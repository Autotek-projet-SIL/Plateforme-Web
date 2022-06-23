import "./stylesheets/CadreDemandeSupport.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import { FloatingLabel, Form, Modal } from "react-bootstrap";
import Button from "./Button";
import "./stylesheets/bootsrapNeededStles.css";
import http from "../http.js";
import { useAlert } from "react-alert";
import { decryptData } from "../crypto";
import { UserContext } from "./../Context.js";
function CadreDemandeSupport(props) {
  //Composant cadre de la demande de support
  const alert = useAlert();
  const { setLoading } = useContext(UserContext);
  
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function repondreModal() {
    if (props.demande.reponse === null) {
      return (
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Répondre à la demande de support de {props.demande.nom}{" "}
              {props.demande.prenom} ?
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FloatingLabel id="reponseDemandeSupp" label="Votre Réponse">
              <Form.Control
                as="textarea"
                placeholder="Réponse de la demande de support"
                style={{ height: "100px" }}
              />
            </FloatingLabel>
          </Modal.Body>
          <Modal.Footer className="validerDiv">
            <Button
              title="Répondre"
              btnClass="buttonPrincipal"
              onClick={() => repondre()}
            />
            <Button
              title="Annuler"
              btnClass="buttonSecondaire"
              onClick={() => handleShow()}
            />
          </Modal.Footer>
        </Modal>
      );
    } else {
      return (
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Votre Réponse à la demande de support de {props.demande.nom}{" "}
              {props.demande.prenom}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FloatingLabel id="reponseDemandeSupp" label="Votre Réponse">
              <Form.Control
                as="textarea"
                placeholder="Réponse de la demande de support de"
                style={{ height: "100px" }}
                value={props.demande.reponse}
                readOnly
              />
            </FloatingLabel>
          </Modal.Body>
        </Modal>
      );
    }
  }
  async function repondre() {
    // Repondre a un message de support
    setLoading(true);
    http
      .put(
        `/demande_support/repondre_demande_support/${props.demande.email}/demande/${props.demande.id_demande_support}`,
        {
          token: decryptData(window.localStorage.getItem("currTok")),
          id_sender: decryptData(window.localStorage.getItem("curruId")),
          response: document.querySelector("#reponseDemandeSupp textarea")
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
  }
  return (
    <div className="cadreSupp">
      {repondreModal()}
      <div
        style={{
          backgroundImage: `url("${props.demande.photo_selfie}")`,
        }}
        className="cadreImg"
      ></div>
      <div className="suppInfos">
        <h3>
          {props.demande.nom} {props.demande.prenom}{" "}
          <FontAwesomeIcon
            className="supportIcon"
            title={
              (props.demande.reponse === null &&
                "Répondre à la demande de support") ||
              "Visualiser votre réponse à la demande de support"
            }
            icon="fa-solid fa-comment-dots"
            onClick={() => handleShow()}
          />{" "}
        </h3>
        <a href={"/atc/vehicule/" + props.demande.numero_chassis}>
          Vehicule loué
        </a>
        <div>
          <h4 className="supportDescTitle">Objet : {props.demande.objet}</h4>
          <p className="supportDesc">{props.demande.descriptif}</p>
        </div>
      </div>
    </div>
  );
}

export default CadreDemandeSupport;
