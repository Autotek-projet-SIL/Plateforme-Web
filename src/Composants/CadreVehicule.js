import "./stylesheets/CadreVehicule.css";
import "./stylesheets/bootsrapNeededStles.css";
import { UserContext } from "./../Context.js";
import Button from "./Button";
import http from "../http.js";
import { decryptData, encryptData } from "../crypto";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import { Modal } from "react-bootstrap";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";

//Composant cadre d'un vehicule vehicule
function CadreVehicule(props) {
  const alert = useAlert();
  const navigate = useNavigate();

  const { setLoading, suppImage } = useContext(UserContext);
  const [supp, setSupp] = useState(false);
  const handleCloseSupp = () => setSupp(false);
  const handleShowSupp = () => setSupp(true);

  async function suppVehicule() {
    // Fonction de suppression d'un vehicule
    setLoading(true);
    http
      .delete(`/flotte/supprimer_vehicule/${props.id}`, {
        data: {
          token: decryptData(window.localStorage.getItem("currTok")),
          id_sender: decryptData(window.localStorage.getItem("curruId")),
        },
      })
      .then(async (jResponse) => {
        await suppImage(props.vehicule.image_vehicule);
        setLoading(false);
        document.location.href = "/atc/gestionvehicules";
      })
      .catch((error) => {
        setLoading(false);
        alert.error(
          "Une erreur est survenue, veuillez réessayer ultérieurement",
          { timeout: 0 }
        );
      });
  }
  function suppModal() {
    return (
      <Modal
        show={supp}
        onHide={handleCloseSupp}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Êtes vous sure de vouloir supprimer le vehicule{" "}
            {props.vehicule.modele + " #" + props.id}?
          </Modal.Title>
        </Modal.Header>
        <Modal.Footer className="validerDiv">
          <Button
            title="Confirmer"
            btnClass="buttonPrincipal"
            onClick={() => suppVehicule()}
          />
          <Button
            title="Annuler"
            btnClass="buttonSecondaire"
            onClick={() => handleCloseSupp()}
          />
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <>
      {suppModal()}
      <div className="cadreVehicule">
        <div
          style={{
            backgroundImage: `url("${props.vehicule.image_vehicule}")`,
          }}
          className="cadreImg"
        ></div>
        <div className="infoVehicule">
          <h3 className="vehiculeModele">
            {props.vehicule.modele + " #" + props.id}
          </h3>
          <h3 className="vehiculeType">{props.vehicule.libelle}</h3>
          <h3 className="vehiculeDispo">
            {(props.vehicule.disponible && "Disponible") || "Non disponible"}
          </h3>
        </div>
        <div className="actions">
          <FontAwesomeIcon
            icon="fa-solid fa-magnifying-glass"
            title="Afficher les informations du vehicule"
            className="viewIcon"
            onClick={() => navigate("/atc/vehicule/" + props.id)}
          />
          {props.vehicule.id_am !== null && (
            <FontAwesomeIcon
              icon="fa-solid fa-user"
              className="viewAmIcone"
              onClick={() =>
                navigate("/atc/profil/am/" + encryptData(props.vehicule.id_am))
              }
            />
          )}
          <FontAwesomeIcon
            icon="fa-solid fa-xmark"
            title="supprimer le vehicule"
            className="suppIcon"
            size="lg"
            onClick={() => handleShowSupp()}
          />
        </div>
      </div>
    </>
  );
}

export default CadreVehicule;
