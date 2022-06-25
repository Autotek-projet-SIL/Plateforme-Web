import "./stylesheets/ProfileATC.css";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../Context.js";
import NavBarATC from "./../../Composants/NavBarATC";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import http from "../../http.js";
import { decryptData } from "../../crypto";
import { useAlert } from "react-alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import Button from "../../Composants/Button";
import Input from "../../Composants/Input";
import { Modal } from "react-bootstrap";

// Profil d'un ATC
function ProfileATC(props) {
  const alert = useAlert();
  const { setLoading, loading, user, createImage, suppImage } =
    useContext(UserContext);
  const navigate = useNavigate();
  let redirection = false;
  const style = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };
  const [modifDiv, setShown] = useState(false);
  const [viewedUser, setViewedUser] = useState({});
  const [fire, setFire] = useState(false);
  const handleCloseFire = () => setFire(false);
  const handleShowFire = () => setFire(true);
  useEffect(() => {
    if (redirection !== false) {
      if (redirection === "root_undefined") {
        setLoading(true);
      } else {
        navigate(redirection, { replace: true });
      }
    } else {
      //Récupérer les informations de l'atc
      http
        .get("/gestionprofils/atc/" + decryptData(props.userId), {
          headers: {
            token: decryptData(window.localStorage.getItem("currTok")),
            id_sender: decryptData(window.localStorage.getItem("curruId")),
          },
        })
        .then((jResponse) => {
          if (jResponse.data.length === 0) {
            navigate("/404", { replace: true });
          } else {
            setViewedUser(jResponse.data[0]);
          }
        })
        .catch((err) => {
          alert.error(
            "Une erreur est survenue! Veuillez vérifier votre connexion ou réessayer ultérieurement."
          );
        });
    }
  }, [redirection, loading]);

  function setRedirection(dest) {
    // s'il est nécessaire de rediriger : se rediriger vers la destination
    redirection = dest;
  }

  async function modifierPdp() {
    // Fonction pour modifier la photo de profil
    let newPdp = document.querySelector("#import_atc_pdp").files;
    if (newPdp.length === 0) {
      //photo de profile non choisie
      alert.error("Veuillez importer une photo de profile.");
    } else if (!newPdp[0].type.includes("image")) {
      alert.error("Veuillez importer une photo de profil valide");
    } else {
      try {
        await suppImage(viewedUser.photo_atc);
        let img = await createImage(newPdp[0], "ATC", viewedUser.id_atc);
        http
          .put(
            "/gestionprofils/modifier_atc/modifier_photo/" + viewedUser.id_atc,
            {
              token: decryptData(window.localStorage.getItem("currTok")),
              id_sender: decryptData(window.localStorage.getItem("curruId")),
              photo_atc: img,
            }
          )
          .then(async (jResponse) => {
            alert.show("Photo de profil modifiée avec succès.");
          })
          .catch((err) => {
            console.log(err);
            alert.error(
              "Une erreur est survenue. Veuillez réessayer ultérieurement."
            );
          });
      } catch (error) {
        console.log(error);
        alert.error(
          "Une erreur est survenue. Veuillez réessayer ultérieurement."
        );
      }
    }
  }

  async function modifierInfos() {
    // Fonction pour modifier les informations
    let nom = formatString(document.querySelector("#inputatcModifNom").value);
    let prenom = formatString(
      document.querySelector("#inputatcModifPrenom").value
    );
    let numTel = document.querySelector("#inputatcModifTlfn").value;
    if (nom === "" || prenom === "" || numTel === "") {
      // champs requis vides
      alert.error("Veuillez remplir tous les champs requis.");

      nom === "" &&
        document
          .querySelector("#inputatcModifNom")
          .classList.add("input-error");
      prenom === "" &&
        document
          .querySelector("#inputatcModifPrenom")
          .classList.add("input-error");
      numTel === "" &&
        document
          .querySelector("#inputatcModifTlfn")
          .classList.add("input-error");
    } else {
      http
        .put("/gestionprofils/modifier_atc/" + viewedUser.id_atc, {
          token: decryptData(window.localStorage.getItem("currTok")),
          id_sender: decryptData(window.localStorage.getItem("curruId")),
          nom: nom,
          prenom: prenom,
          numero_telephone: numTel,
          email: viewedUser.email,
        })
        .then(async (jResponse) => {
          alert.show("Données modifiées avec succès.");
        })
        .catch((err) => {
          console.log(err);
          alert.error(
            "Une erreur est survenue. Veuillez réessayer ultérieurement."
          );
        });
    }
  }
  function modifierInfosCadre() {
    return (
      <div id="monCompteCard">
        <div></div>
        <div id="monCompteImg">
          <img src={viewedUser.photo_atc} alt="Votre photo de profil" />
        </div>

        <div id="monCompteContainer"></div>
        <div id="monCompteInfos">
          <div id="modifInfosProfile">
            <Input
              label="Nom"
              inputClass=""
              containerClass="modifAtcInput"
              id="atcModifNom"
              fieldType="text"
              parDef={viewedUser.nom}
            />
            <Input
              label="Prénom"
              inputClass=""
              containerClass="modifAtcInput"
              id="atcModifPrenom"
              fieldType="text"
              parDef={viewedUser.prenom}
            />
            <Input
              label="Numéro de téléphone"
              inputClass=""
              containerClass="modifAtcInput"
              id="atcModifTlfn"
              fieldType="tel"
              parDef={viewedUser.numero_telephone}
            />
          </div>
          <div className="modifAtc">
            <div
              style={{
                display: "flex",
                margin: 0,
                padding: 0,
              }}
            >
              <input
                type="file"
                accept="image/*"
                style={{ display: "none", margin: 0 }}
                id="import_atc_pdp"
              />
              <label htmlFor="import_atc_pdp">
                <Button
                  title="Importer la photo de profile"
                  btnClass="buttonSecondaire footerBtn"
                  variant="contained"
                  color="primary"
                  component="span"
                  onClick={() => {
                    document.querySelector("#import_atc_pdp").click();
                  }}
                />
              </label>
            </div>
            <Button
              title="Modifier la photo de profil"
              btnClass="buttonPrincipal"
              onClick={() => modifierPdp()}
            />

            <Button
              title="Modifier"
              btnClass="buttonPrincipal"
              onClick={() => modifierInfos()}
            />
          </div>

          <div className="modifAtc">
            <Button
              title="Annuler"
              btnClass="buttonPrincipal"
              onClick={() => setShown(false)}
            />
          </div>
        </div>
      </div>
    );
  }

  function formatString(string) {
    //Retoune un string sans vides supplemetaires + avec MAJUSCULE au début
    let str = string.replace(/\s+/g, " ").trim();
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  async function fireEmp() {
    // Supprimer l'am
    setLoading(true);
    http
      .delete(`/gestioncomptes/supprimer_atc/${viewedUser.id_atc}`, {
        data: {
          token: decryptData(window.localStorage.getItem("currTok")),
          id_sender: decryptData(window.localStorage.getItem("curruId")),
        },
      })
      .then(async (jResponse) => {
        await suppImage(viewedUser.photo_atc);
        setLoading(false);
        document.location.href = "/atc/gestioncomptes/";
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        alert.error(
          "Une erreur est survenue, veuillez réessayer ultérieurement",
          { timeout: 0 }
        );
      });
  }
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
            Êtes vous sure de vouloir virer l'employé {viewedUser.nom}{" "}
            {viewedUser.prenom} ?
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

  function showInfosCadre() {
    return (
      <SkeletonTheme baseColor="#c3c3c3" highlightColor="#dbdbdb">
        <div id="monCompteCard">
          {fireModal()}
          <div></div>
          <div id="monCompteImg">
            <img src={viewedUser.photo_atc} alt="Votre photo de profil" />
          </div>

          <div id="monCompteContainer"></div>
          <div id="monCompteInfos">
            <h2>
              {viewedUser.nom || <Skeleton count="0.15" inline />}{" "}
              {viewedUser.prenom || <Skeleton count="0.15" />}
            </h2>
            <p>Administrateur de la tour de controle</p>
            <hr />
            <p>
              <FontAwesomeIcon icon="fa-solid fa-envelope " size="xl" />{" "}
              {viewedUser.email || <Skeleton height="100%" count="0.25" />}
            </p>
            <p>
              <FontAwesomeIcon icon="fa-solid fa-phone " size="xl" />{" "}
              {viewedUser.numero_telephone || (
                <Skeleton height="100%" count="0.25" />
              )}
            </p>
            <div className="modifAtc">
              <Button
                title="Modifier"
                btnClass="buttonPrincipal"
                onClick={() => setShown(true)}
              />
              <Button
                title="Supprimer"
                btnClass="buttonSecondaire"
                onClick={() => handleShowFire()}
              />
            </div>
          </div>
        </div>
      </SkeletonTheme>
    );
  }

  if (user.est_root === true) {
    //Peut gérer les ATC
    if (props.userId === localStorage.getItem("curruId")) {
      //Le compte à consulter est le compte de l'atc : Cas qui ne peut se produire que si l'utilisateur entre l'url lui meme
      setRedirection("/atc/monprofil");
      return null;
    } else {
      //Gérer le profil de l'atc
      return (
        <div id="pageProfileAtc">
          <NavBarATC />
          <div id="cadreProfileAtc">
            {(modifDiv && modifierInfosCadre()) || showInfosCadre()}
          </div>
        </div>
      );
    }
  } else if (user.est_root === undefined) {
    setRedirection("root_undefined");
    return (
      <div id="pageProfileAtc">
        <ClipLoader color={"#1B92A4"} loading={loading} css={style} size={50} />
        <NavBarATC />
      </div>
    );
  } else {
    // Ne peut pas gérer les ATC
    return (
      <div id="pageProfileAtc">
        <NavBarATC />
        <div id="divNoAccess">
          <div>
            <h3>
              Il semble que vous n'avez pas accès à ce contenu. Veuillez vous
              rediriger vers{" "}
              <a href="/atc/gestioncomptes">la page de gestion des profils</a>.
            </h3>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileATC;
