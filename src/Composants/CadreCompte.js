import "./stylesheets/CadreCompte.css";
import "./stylesheets/bootsrapNeededStles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import { UserContext } from "./../Context.js";
import { Modal } from "react-bootstrap";
import Button from "./Button";
import http from "../http.js";
import { useAlert } from "react-alert";
import { decryptData, encryptData } from "../crypto";
import {useNavigate } from "react-router-dom";
//Composant cadre d'un compte employé
function CadreCompte(props) {
  const alert = useAlert();
  const navigate = useNavigate();
  const { setLoading, suppImage } = useContext(UserContext);
  const [fire, setFire] = useState(false);
  const handleCloseFire = () => setFire(false);
  const handleShowFire = () => setFire(true);

  // Fonction de suppression d'un employé
  async function fireEmp() {
    setLoading(true);
    if (props.compte.type_compte === "ATC") {
      http
        .delete(`/gestioncomptes/supprimer_atc/${props.compte.id}`, {
          data: {
            token: decryptData(window.localStorage.getItem("currTok")),
            id_sender: decryptData(window.localStorage.getItem("curruId")),
          },
        })
        .then(async (jResponse) => {
          await suppImage(props.compte.photo_atc);
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
    } else if (props.compte.type_compte === "AM") {
      http
        .delete(`/gestioncomptes/supprimer_am/${props.compte.id}`, {
          data: {
            token: decryptData(window.localStorage.getItem("currTok")),
            id_sender: decryptData(window.localStorage.getItem("curruId")),
          },
        })
        .then(async (jResponse) => {
          await suppImage(props.compte.photo_am);
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
      //Employé === Décideur
      http
        .delete(`/gestioncomptes/supprimer_decideur/${props.compte.id}`, {
          data: {
            token: decryptData(window.localStorage.getItem("currTok")),
            id_sender: decryptData(window.localStorage.getItem("curruId")),
          },
        })
        .then(async (jResponse) => {
          await suppImage(props.compte.photo_decideur);
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
  }
  // Cadre de suppression d'un employé
  function fireModal() {
    return (
      <Modal
        show={fire}
        onHide={handleCloseFire}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Êtes vous sure de vouloir virer l'employé {props.compte.nom}{" "}
            {props.compte.prenom} ?
          </Modal.Title>
        </Modal.Header>
        <Modal.Footer className="validerDiv">
          <Button
            title="Confirmer"
            btnClass="buttonPrincipal"
            onClick={() => fireEmp()}
          />
          <Button
            title="Annuler"
            btnClass="buttonSecondaire"
            onClick={() => handleCloseFire()}
          />
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <>
      {fireModal()}
      <div className="cadreCompte">
        <div
          style={{
            backgroundImage: `url("${props.compte.photo}")`,
          }}
          className="cadreImg"
        ></div>
        <div className="infoUser">
          <h3 className="nomUser">
            {props.compte.nom} {props.compte.prenom}
          </h3>
          <h3 className="emailUser">{props.compte.email} </h3>
          <h3 className="typeUser">{props.compte.type_compte}</h3>
        </div>
        <div className="actions">
          <FontAwesomeIcon
            icon="fa-solid fa-magnifying-glass"
            title="Afficher le profile de l'employé"
            className="viewIcon"
            onClick={() =>
              navigate(
                "/atc/profil/" +
                  props.compte.type_compte.toLowerCase() +
                  "/" +
                  encryptData(props.compte.id)
              )
            }
          />
          <FontAwesomeIcon
            icon="fa-solid fa-user-slash"
            title="Virer l'employé"
            className="fireIcon"
            size="lg"
            onClick={() => handleShowFire()}
          />
        </div>
      </div>
    </>
  );
}

export default CadreCompte;
