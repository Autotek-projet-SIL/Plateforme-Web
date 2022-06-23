import "./stylesheets/cadreDemandeInsc.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import {
  Dropdown,
  DropdownButton,
  FloatingLabel,
  Form,
  Modal,
} from "react-bootstrap";
import Button from "./Button";
import "./stylesheets/bootsrapNeededStles.css";
import http from "../http.js";
import { useAlert } from "react-alert";
import { decryptData } from "../crypto";
import { UserContext } from "./../Context.js";
function CadreDemandeInsc(props) {
  //Composant cadre de la demande d'inscription du client
  const { setLoading } = useContext(UserContext);
  const alert = useAlert();
  const [show, setShow] = useState(false);
  const [showPId, setShowPId] = useState(false);
  const [showValider, setShowValider] = useState(false);
  const [showRejetter, setShowRejetter] = useState(false);
  const [rejetVal, setRejetVal] = useState("Cause du rejet");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleClosePID = () => setShowPId(false);
  const handleShowPID = () => setShowPId(true);
  const handleCloseValider = () => setShowValider(false);
  const handleShowValider = () => setShowValider(true);
  const handleCloseRejetter = () => setShowRejetter(false);
  const handleShowRejetter = () => setShowRejetter(true);

  function handleSelect(e) {
    // fonction traitement de l'evenement pour selectionner la cause du rejet
    if (e === "Cause personnalisée") {
      document.querySelector("#causeRejetDesc").style.display = "block";
    } else {
      document.querySelector("#causeRejetDesc").style.display = "none";
    }
    setRejetVal(e);
  }

  async function confirmerValider() {
    //Confirmer la validation de la demande d'inscription du client
    setLoading(true);
    http
      .put(
        `/authentification_web/valider_demande/${props.demande.email}/demande/${props.demandeId}`,
        {
          token: decryptData(window.localStorage.getItem("currTok")),
          id_sender: decryptData(window.localStorage.getItem("curruId")),
        }
      )
      .then((jResponse) => {
        setLoading(false);
        window.location.reload();
      })
      .catch((error) => {
        setLoading(false);
        alert.error(
          "Une erreur est survenue, veuillez réessayer ultérieurement",
          { timeout: 0 }
        );
      });
  }
  function validerModal() {
    return (
      <Modal
        show={showValider}
        onHide={handleCloseValider}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Êtes vous sure de vouloir valider la demande d'inscription de{" "}
            {props.demande.nom} {props.demande.prenom} ?
          </Modal.Title>
        </Modal.Header>
        <Modal.Footer className="validerDiv">
          <Button
            title="Confirmer"
            btnClass="buttonPrincipal"
            onClick={() => confirmerValider()}
          />
          <Button
            title="Annuler"
            btnClass="buttonSecondaire"
            onClick={() => handleCloseValider()}
          />
        </Modal.Footer>
      </Modal>
    );
  }

  async function confirmerRejet() {
    //Confirmer le rejet de la demande d'inscription du client
    if (rejetVal != "Cause du rejet") {
      setLoading(true);
      if (rejetVal === "Cause personnalisée") {
        http
          .put(
            `/authentification_web/refuser_demande/${props.demande.email}/demande/${props.demandeId}`,
            {
              token: decryptData(window.localStorage.getItem("currTok")),
              id_sender: decryptData(window.localStorage.getItem("curruId")),
              objet: "Votre demande d'inscription a été rejettée",
              descriptif: document.querySelector("#causeRejetDesc textarea")
                .value,
            }
          )
          .then((jResponse) => {
            setLoading(false);
            window.location.reload();
          })
          .catch((error) => {
            setLoading(false);
            alert.error(
              "Une erreur est survenue, veuillez réessayer ultérieurement",
              { timeout: 0 }
            );
          });
      } else {
        http
          .put(
            `/authentification_web/refuser_demande/${props.demande.email}/demande/${props.demandeId}`,
            {
              token: decryptData(window.localStorage.getItem("currTok")),
              id_sender: decryptData(window.localStorage.getItem("curruId")),
              objet: "Votre demande d'inscription a été rejettée",
              descriptif: rejetVal,
            }
          )
          .then((jResponse) => {
            setLoading(false);
            window.location.reload();
          })
          .catch((error) => {
            setLoading(false);
            alert.error(
              "Une erreur est survenue, veuillez réessayer ultérieurement",
              { timeout: 0 }
            );
          });
      }
    } else {
      alert.error("Veuillez séléctionner une cause de rejet.");
    }
  }
  function rejetterModal() {
    return (
      <Modal
        show={showRejetter}
        onHide={handleCloseRejetter}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Êtes vous sure de vouloir rejetter la demande d'inscription de{" "}
            {props.demande.nom} {props.demande.prenom} ?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="rejetCauseDiv">
          <DropdownButton
            id="causeRejetDrop"
            title={rejetVal}
            onSelect={(e) => handleSelect(e)}
          >
            <Dropdown.Item eventKey="Pièce d'identité invalide">
              Pièce d'identité invalide
            </Dropdown.Item>
            <Dropdown.Item eventKey="Photo floue">Photo floue</Dropdown.Item>
            <Dropdown.Item eventKey="Cause personnalisée">
              Cause personnalisée
            </Dropdown.Item>
          </DropdownButton>
          {
            <FloatingLabel id="causeRejetDesc" label="Votre message">
              <Form.Control
                as="textarea"
                placeholder="Cause de rejet personnalisée"
                style={{ height: "100px" }}
              />
            </FloatingLabel>
          }
        </Modal.Body>
        <Modal.Footer className="rejetterDiv">
          <Button
            title="Confirmer"
            btnClass="buttonPrincipal"
            onClick={() => confirmerRejet()}
          />
          <Button
            title="Annuler"
            btnClass="buttonSecondaire"
            onClick={() => handleCloseRejetter()}
          />
        </Modal.Footer>
      </Modal>
    );
  }

  function typeCadre() {
    // fonction qui retourne un cadre différent selon l'état de la demande
    switch (props.demande.statut) {
      case "validee":
        return (
          <div id={"cadre" + props.demandeId} className="cadreInsc inscValidee">
            <div
              style={{
                backgroundImage: `url("${props.demande.photo_selfie}")`,
              }}
              className="cadreImg"
            ></div>
            <div className="infoUser">
              <h3 className="nomUser">
                {props.demande.nom} {props.demande.prenom}{" "}
                <FontAwesomeIcon
                  icon="fa-solid fa-magnifying-glass"
                  title="Plus d'informations"
                  onClick={handleShow}
                />
              </h3>
              <h4 className="email">{props.demande.email}</h4>
              <h4
                className="pieceId"
                title="Vérifier la pièce d'identité du locataire"
                onClick={handleShowPID}
              >
                Pièce d'identité
              </h4>
            </div>
            <div className="etatDmnd">
              <h4>
                Date d'inscription :{" "}
                {props.demande.date_inscription.slice(0, 10)}
              </h4>
              <h4 title="Cette demande a déja été validée">
                Etat de la demande : Validée
              </h4>
            </div>
          </div>
        );

      case "refusee":
        return (
          <div id={"cadre" + props.demandeId} className="cadreInsc inscRejetee">
            <div
              style={{
                backgroundImage: `url("${props.demande.photo_selfie}")`,
              }}
              className="cadreImg"
            ></div>
            <div className="infoUser">
              <h3 className="nomUser">
                {props.demande.nom} {props.demande.prenom}{" "}
                <FontAwesomeIcon
                  icon="fa-solid fa-magnifying-glass"
                  title="Plus d'informations"
                  onClick={handleShow}
                />
              </h3>
              <h4 className="email">{props.demande.email}</h4>
              <h4
                className="pieceId"
                title="Vérifier la pièce d'identité du locataire"
                onClick={handleShowPID}
              >
                Pièce d'identité
              </h4>
            </div>
            <div className="etatDmnd">
              <h4>
                Date d'inscription :{" "}
                {props.demande.date_inscription.slice(0, 10)}
              </h4>
              <h4 title="Cette demande a déja été Rejettée">
                Etat de la demande : Rejettée{" "}
              </h4>
            </div>
          </div>
        );

      default:
        return (
          <div id={"cadre" + props.demandeId} className="cadreInsc">
            <div
              style={{
                backgroundImage: `url("${props.demande.photo_selfie}")`,
              }}
              className="cadreImg"
            ></div>
            <div className="infoUser">
              <h3 className="nomUser">
                {props.demande.nom} {props.demande.prenom}{" "}
                <FontAwesomeIcon
                  icon="fa-solid fa-magnifying-glass"
                  title="Plus d'informations"
                  onClick={handleShow}
                />
              </h3>
              <h4 className="email">{props.demande.email}</h4>
              <h4
                className="pieceId"
                title="Vérifier la pièce d'identité du locataire"
                onClick={handleShowPID}
              >
                Pièce d'identité
              </h4>
            </div>
            <div className="actions">
              <h4 className="etatDmnd">
                Date d'inscription :{" "}
                {props.demande.date_inscription.slice(0, 10)}
              </h4>
              <h4
                className="etatDmnd"
                title="Cette demande est en attente de validation"
              >
                Etat de la demande : en attente
              </h4>
              <div>
                <FontAwesomeIcon
                  icon="fa-solid fa-check"
                  title="Valider la demande"
                  className="validerIcone"
                  size="lg"
                  onClick={() => handleShowValider()}
                />
                <FontAwesomeIcon
                  icon="fas fa-ban"
                  title="Rejetter la demande"
                  className="rejetterIcone"
                  size="lg"
                  onClick={() => handleShowRejetter()}
                />
              </div>
            </div>
            {validerModal()}
            {rejetterModal()}
          </div>
        );
    }
  }
  function moreInfoModal() {
    if (props.demande.statut === "en attente") {
      return (
        <Modal
          dialogClassName="custom-dialog"
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Plus d'informations</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="insc_modal_body">
              <div
                style={{
                  backgroundImage: `url("${props.demande.photo_selfie}")`,
                }}
                className="cadreImg"
              ></div>
              <div className="infoUser">
                <h2 className="nomUser">
                  {props.demande.nom} {props.demande.prenom}{" "}
                </h2>
                <h4 className="email">
                  <FontAwesomeIcon
                    icon="fa-solid fa-envelope"
                    className="infoIcon"
                  />
                  {props.demande.email}
                </h4>

                <h4 className="numero_telephone">
                  <FontAwesomeIcon
                    icon="fa-solid fa-phone"
                    className="infoIcon"
                  />
                  {props.demande.numero_telephone}
                </h4>
                <h4 className="date_insc">
                  <FontAwesomeIcon
                    icon="fa-solid fa-calendar-check"
                    className="infoIcon"
                  />
                  {props.demande.date_inscription.slice(0, 10)}
                </h4>
                <br />
                <h4
                  className="InscpieceId"
                  title="Vérifier la pièce d'identité du locataire"
                  onClick={handleShowPID}
                >
                  Pièce d'identité
                </h4>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <FontAwesomeIcon
              icon="fa-solid fa-check"
              title="Valider la demande"
              className="validerIcone"
              size="lg"
              onClick={() => handleShowValider()}
            />
            <FontAwesomeIcon
              icon="fas fa-ban"
              title="Rejetter la demande"
              className="rejetterIcone"
              size="lg"
              onClick={() => handleShowRejetter()}
            />
          </Modal.Footer>
        </Modal>
      );
    } else if (props.demande.statut === "refusee") {
      return (
        <Modal
          dialogClassName="custom-dialog"
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Plus d'informations</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="insc_modal_body">
              <div
                style={{
                  backgroundImage: `url("${props.demande.photo_selfie}")`,
                }}
                className="cadreImg"
              ></div>
              <div className="infoUser">
                <h2 className="nomUser">
                  {props.demande.nom} {props.demande.prenom}{" "}
                </h2>
                <h4 className="email">
                  <FontAwesomeIcon
                    icon="fa-solid fa-envelope"
                    className="infoIcon"
                  />
                  {props.demande.email}
                </h4>
                <h4 className="numero_telephone">
                  <FontAwesomeIcon
                    icon="fa-solid fa-phone"
                    className="infoIcon"
                  />
                  {props.demande.numero_telephone}
                </h4>
                <h4 className="date_insc">
                  <FontAwesomeIcon
                    icon="fa-solid fa-calendar-check"
                    className="infoIcon"
                  />
                  {props.demande.date_inscription.slice(0, 10)}
                </h4>

                <h4
                  className="InscpieceId"
                  title="Vérifier la pièce d'identité du locataire"
                  onClick={handleShowPID}
                >
                  Pièce d'identité
                </h4>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer id="modalFooter">
            <p>
              <b>
                Cause du rejet : <br />
              </b>
              {props.demande.descriptif}
            </p>
          </Modal.Footer>
        </Modal>
      );
    } else {
      return (
        <Modal
          dialogClassName="custom-dialog"
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Plus d'informations</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="insc_modal_body">
              <div
                style={{
                  backgroundImage: `url("${props.demande.photo_selfie}")`,
                }}
                className="cadreImg"
              ></div>
              <div className="infoUser">
                <h2 className="nomUser">
                  {props.demande.nom} {props.demande.prenom}{" "}
                </h2>
                <h4 className="email">
                  <FontAwesomeIcon
                    icon="fa-solid fa-envelope"
                    className="infoIcon"
                  />
                  {props.demande.email}
                </h4>

                <h4 className="numero_telephone">
                  <FontAwesomeIcon
                    icon="fa-solid fa-phone"
                    className="infoIcon"
                  />
                  {props.demande.numero_telephone}
                </h4>
                <h4 className="date_insc">
                  <FontAwesomeIcon
                    icon="fa-solid fa-calendar-check"
                    className="infoIcon"
                  />
                  {props.demande.date_inscription.slice(0, 10)}
                </h4>
                <br />
                <h4
                  className="InscpieceId"
                  title="Vérifier la pièce d'identité du locataire"
                  onClick={handleShowPID}
                >
                  Pièce d'identité
                </h4>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      );
    }
  }
  function pieceIdModal() {
    if (props.demande.statut === "en attente") {
      return (
        <Modal
          dialogClassName="custom-dialog2"
          show={showPId}
          onHide={handleClosePID}
          backdrop="static"
          keyboard={false}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Pièce d'identité de {props.demande.nom} {props.demande.prenom}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="pid_modal_body">
              <div
                style={{
                  backgroundImage: `url("${props.demande.photo_identite_recto}")`,
                }}
                className="cadreImgPieceIdentite"
              ></div>
              <div
                style={{
                  backgroundImage: `url("${props.demande.photo_identite_verso}")`,
                }}
                className="cadreImgPieceIdentite"
              ></div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="modalActions">
              <FontAwesomeIcon
                icon="fa-solid fa-check"
                title="Valider la demande"
                className="validerIcone"
                size="lg"
              />
              <FontAwesomeIcon
                icon="fas fa-ban"
                title="Rejetter la demande"
                className="rejetterIcone"
                size="lg"
              />
            </div>
          </Modal.Footer>
        </Modal>
      );
    } else {
      return (
        <Modal
          dialogClassName="custom-dialog2"
          show={showPId}
          onHide={handleClosePID}
          backdrop="static"
          keyboard={false}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Pièce d'identité de {props.demande.nom} {props.demande.prenom}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="pid_modal_body">
              <div
                style={{
                  backgroundImage: `url("${props.demande.photo_identite_recto}")`,
                }}
                className="cadreImgPieceIdentite"
              ></div>
              <div
                style={{
                  backgroundImage: `url("${props.demande.photo_identite_verso}")`,
                }}
                className="cadreImgPieceIdentite"
              ></div>
            </div>
          </Modal.Body>
        </Modal>
      );
    }
  }
  return (
    <>
      {typeCadre()}
      {moreInfoModal()}
      {pieceIdModal()}
    </>
  );
}

export default CadreDemandeInsc;
