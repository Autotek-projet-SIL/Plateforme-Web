import "./stylesheets/ProfileVehicule.css";
import { useContext, useEffect, useState } from "react";
import { Dropdown, DropdownButton, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import Skeleton from "react-loading-skeleton";
import { ClipLoader } from "react-spinners";
import { UserContext } from "../../Context.js";
import NavBarATC from "./../../Composants/NavBarATC";
import { decryptData, encryptData } from "../../crypto";
import { getCarLocations } from "../../firebase";
import http from "../../http.js";
import Button from "../../Composants/Button";
import Input from "../../Composants/Input";

//Page Profil véhicule
function ProfileVehicule(props) {
  const { setLoading, loading, createImage } = useContext(UserContext);
  const navigate = useNavigate();
  const alert = useAlert();

  const [viewedVehicle, setVehicle] = useState({});

  const [shownModif, setModifShown] = useState(false);
  const handleCloseModifShown = () => setModifShown(false);
  const handleShowModifShown = () => setModifShown(true);

  const [supp, setSupp] = useState(false);
  const handleCloseSupp = () => setSupp(false);
  const handleShowSupp = () => setSupp(true);

  const [affecterAM, setAffecterAM] = useState(false);
  const handleCloseAffecterAM = () => setAffecterAM(false);
  const handleShowAffecterAM = () => setAffecterAM(true);

  const [selectedAm, setSelectedAm] = useState(
    "L'agent de maintenance responsable"
  );
  const [listAm, setListAm] = useState([]);
  const [selectedType, setSelectedType] = useState("Le type du véhicule");
  const [types, setTypes] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("La marque du véhicule");
  const [brands, setBrands] = useState([]);
  const [selectedModele, setSelectedModele] = useState("Le modèle du véhicule");
  const [modeles, setModeles] = useState([]);
  const [querySnapshot, setSnapshot] = useState([]);
  const style = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };
  
  // Recuperer les vehicules du firestore
  useEffect(() => {
    async function getTrajets() {
      await getCarLocations(setSnapshot);
    }
    getTrajets();
  }, []);
  // Au changement des vehicules du firestore, recuperer de la bdd les vehicules, les am, les types de vehicules et les marques des vehicules
  useEffect(() => {
    http
      .get("/flotte/detail_vehicule/" + props.carId, {
        headers: {
          token: decryptData(window.localStorage.getItem("currTok")),
          id_sender: decryptData(window.localStorage.getItem("curruId")),
        },
      })
      .then((jResponse) => {
        if (jResponse.data.length === 0) {
          navigate("/404", { replace: true });
        } else {
          querySnapshot.forEach((doc) => {
            if (jResponse.data[0].numero_chassis === doc.id) {
              setVehicle({ ...doc.data(), ...jResponse.data[0] });
            }
          });
          http
            .get("gestionprofils/am/", {
              headers: {
                token: decryptData(window.localStorage.getItem("currTok")),
                id_sender: decryptData(window.localStorage.getItem("curruId")),
              },
            })
            .then((response) => {
              setListAm(response.data);
            })
            .catch((err) => {
              alert.error(
                "Une erreur est survenue lors du chargement des données. Vérifiez votre connexion."
              );
            });
          http
            .get("flotte/typevehicule/", {
              headers: {
                token: decryptData(window.localStorage.getItem("currTok")),
                id_sender: decryptData(window.localStorage.getItem("curruId")),
              },
            })
            .then((response) => {
              setTypes(response.data);
            })
            .catch((err) => {
              alert.error(
                "Une erreur est survenue lors du chargement des données. Vérifiez votre connexion."
              );
            });

          http
            .get("flotte/marque/", {
              headers: {
                token: decryptData(window.localStorage.getItem("currTok")),
                id_sender: decryptData(window.localStorage.getItem("curruId")),
              },
            })
            .then((mResponse) => {
              setBrands(mResponse.data);
            })
            .catch((err) => {
              alert.error(
                "Une erreur est survenue lors du chargement des données. Vérifiez votre connexion."
              );
            });
        }
      })
      .catch((err) => {
        alert.error(
          "Une erreur est survenue! Veuillez vérifier votre connexion ou réessayer ultérieurement."
        );
      });
  }, [querySnapshot]);
  // A la selection d'une marque, recuperer les modeles associees
  useEffect(() => {
    if (selectedBrand !== "La marque du véhicule") {
      http
        .get("flotte/modele_marque/" + selectedBrand, {
          headers: {
            token: decryptData(window.localStorage.getItem("currTok")),
            id_sender: decryptData(window.localStorage.getItem("curruId")),
          },
        })
        .then((response) => {
          setModeles(response.data);
        })
        .catch((err) => {
          alert.error(
            "Une erreur est survenue lors du chargement des données. Vérifiez votre connexion."
          );
        });
    }
  }, [selectedBrand]);
  // Gestion du changement de la marque
  useEffect(() => {
    if (brands.length !== 0 && Object.keys(viewedVehicle).length !== 0) {
      setSelectedBrand(
        brands.find((e) => e.libelle === viewedVehicle.marque).id_marque
      );
    }
  }, [brands, viewedVehicle]);
  // Gestion du changement du type
  useEffect(() => {
    if (types.length !== 0 && Object.keys(viewedVehicle).length !== 0) {
      setSelectedType(viewedVehicle.id_type_vehicule);
    }
  }, [types, viewedVehicle]);
  // Gestion du changement du modele
  useEffect(() => {
    if (modeles.length !== 0 && Object.keys(viewedVehicle).length !== 0) {
      if (
        viewedVehicle.marque ===
        brands.find((e) => e.id_marque === parseInt(selectedBrand)).libelle
      ) {
        setSelectedModele(
          modeles.find((e) => e.libelle === viewedVehicle.modele).id_modele
        );
      } else {
        setSelectedModele("Le modèle du véhicule");
      }
    }
  }, [modeles, viewedVehicle]);

  function suppModal() {
    // La fct de Supression du vehicule
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
            Êtes vous sure de vouloir supprimer le véhicule{" "}
            {viewedVehicle.modele + " #" + viewedVehicle.numero_chassis}?
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
  async function suppVehicule() {
    // Le cadre de Supression du vehicule
    setLoading(true);
    http
      .delete(`/flotte/supprimer_vehicule/${viewedVehicle.numero_chassis}`, {
        data: {
          token: decryptData(window.localStorage.getItem("currTok")),
          id_sender: decryptData(window.localStorage.getItem("curruId")),
        },
      })
      .then(async (jResponse) => {
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
  function affecterModal() {
    // Le cadre d'affectation d'AM au vehicule
    return (
      <Modal
        show={affecterAM}
        onHide={handleCloseAffecterAM}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Affecter un AM au véhicule{" "}
            {viewedVehicle.modele + " #" + viewedVehicle.numero_chassis}?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DropdownButton
            id="dropDownAdd"
            title={
              (selectedAm === "L'agent de maintenance responsable" &&
                selectedAm) ||
              listAm.find((e) => e.id_am === selectedAm).nom +
                " " +
                listAm.find((e) => e.id_am === selectedAm).prenom
            }
            onSelect={(e) => setSelectedAm(e)}
          >
            {(listAm.length === 0 && (
              <p
                style={{
                  margin: "1px",
                  color: "gray",
                }}
              >
                -En cours de chargement-
              </p>
            )) ||
              listAm.map((am) => {
                return (
                  <Dropdown.Item key={am.id_am} eventKey={am.id_am}>
                    {am.nom + " " + am.prenom}
                  </Dropdown.Item>
                );
              })}
          </DropdownButton>
        </Modal.Body>
        <Modal.Footer className="validerDiv">
          <Button
            title="Confirmer"
            btnClass="buttonPrincipal"
            onClick={() => affecterUnAm()}
          />
          <Button
            title="Annuler"
            btnClass="buttonSecondaire"
            onClick={() => handleCloseAffecterAM()}
          />
        </Modal.Footer>
      </Modal>
    );
  }
  async function affecterUnAm() {
    // LA fct d'affectation d'AM au vehicule
    if (selectedAm !== "L'agent de maintenance responsable") {
      http
        .put("/flotte/modifier_am_vehicule/" + viewedVehicle.numero_chassis, {
          token: decryptData(window.localStorage.getItem("currTok")),
          id_sender: decryptData(window.localStorage.getItem("curruId")),
          id_am: selectedAm,
        })
        .then((response) => {
          document.location.reload();
        })
        .catch((err) => {
          alert.error(
            "Une erreur est survenue. Veuillez réessayer ultérieurment."
          );
          console.log(err);
        });
    } else {
      alert.error("Veuillez sélectionner un agent de maintenace");
    }
  }
  function modifModal() {
    // Le cadre de modfication du vehicule
    return (
      <Modal
        show={shownModif}
        onHide={handleCloseModifShown}
        backdrop="static"
        keyboard={false}
        centered
        dialogClassName="custom-dialog2"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Modifier les informations du véhicule{" "}
            {viewedVehicle.modele + " #" + viewedVehicle.numero_chassis}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body id="modifVechModalBody">
          <DropdownButton
            id="dropDownAdd"
            title={
              (selectedBrand === "La marque du véhicule" && selectedBrand) ||
              brands.find((e) => e.id_marque === parseInt(selectedBrand))
                .libelle
            }
            onSelect={(e) => {
              setSelectedBrand(e);
              setSelectedModele("Le modèle du véhicule");
            }}
          >
            {(brands.length === 0 && (
              <p
                style={{
                  margin: "1px",
                  color: "gray",
                }}
              >
                -En cours de chargement-
              </p>
            )) ||
              brands.map((brand) => {
                return (
                  <Dropdown.Item
                    key={brand.id_marque}
                    eventKey={brand.id_marque}
                  >
                    {brand.libelle}
                  </Dropdown.Item>
                );
              })}
          </DropdownButton>
          <DropdownButton
            id="dropDownAdd"
            title={
              (selectedModele === "Le modèle du véhicule" && selectedModele) ||
              modeles.find((e) => e.id_modele === parseInt(selectedModele))
                .libelle
            }
            onSelect={(e) => setSelectedModele(e)}
          >
            {(selectedBrand === "La marque du véhicule" && (
              <p
                style={{
                  margin: "1px",
                  color: "gray",
                }}
              >
                -Veuillez séléctionner une marque d'abord-
              </p>
            )) ||
              (modeles.length === 0 && (
                <p
                  style={{
                    margin: "1px",
                    color: "gray",
                  }}
                >
                  -En cours de chargement-
                </p>
              )) ||
              modeles.map((modele) => {
                return (
                  <Dropdown.Item
                    key={modele.id_modele}
                    eventKey={modele.id_modele}
                  >
                    {modele.libelle}
                  </Dropdown.Item>
                );
              })}
          </DropdownButton>

          <DropdownButton
            id="dropDownAdd"
            title={
              (selectedType === "Le type du véhicule" && selectedType) ||
              types.find((e) => e.id_type_vehicule === parseInt(selectedType))
                .libelle
            }
            onSelect={(e) => setSelectedType(e)}
          >
            {(types.length === 0 && (
              <p
                style={{
                  margin: "1px",
                  color: "gray",
                }}
              >
                -En cours de chargement-
              </p>
            )) ||
              types.map((type) => {
                return (
                  <Dropdown.Item
                    key={type.id_type_vehicule}
                    eventKey={type.id_type_vehicule}
                  >
                    {type.libelle}
                  </Dropdown.Item>
                );
              })}
          </DropdownButton>
          <Input
            label="Couleur du véhicule"
            inputClass=""
            containerClass="modifCouleurV"
            id="modifCouleurVInput"
            fieldType="text"
            parDef={viewedVehicle.couleur}
          />
        </Modal.Body>
        <Modal.Footer className="modifVFooter">
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
              id="import_vehicule_pdp"
            />
            <label htmlFor="import_vehicule_pdp">
              <Button
                title="Importer la photo du véhicule"
                btnClass="buttonSecondaire footerBtn"
                variant="contained"
                color="primary"
                component="span"
                onClick={() => {
                  document.querySelector("#import_vehicule_pdp").click();
                }}
              />
            </label>
          </div>
          <Button
            title="Modifier la photo du véhicule"
            btnClass="buttonPrincipal"
            onClick={() => {
              modifPhotoVehicule();
            }}
          />
          <Button
            title="Confirmer"
            btnClass="buttonPrincipal"
            onClick={() => modifVechicule()}
          />
          <Button
            title="Annuler"
            btnClass="buttonSecondaire"
            onClick={() => handleCloseModifShown()}
          />
        </Modal.Footer>
      </Modal>
    );
  }
  async function modifVechicule() {
    // La fct de modification du vehicule
    let couleur = document.querySelector("#inputmodifCouleurVInput").value;
    if (selectedBrand === "La marque du véhicule") {
      alert.error("Veuillez sélectionner la marque du véhicule");
    } else if (selectedModele === "Le modèle du véhicule") {
      alert.error("Veuillez sélectionner le modèle du véhicule");
    } else if (selectedType === "Le type du véhicule") {
      alert.error("Veuillez sélectionner le type du véhicule");
    } else if (couleur === "") {
      alert.error("Veuillez sélectionner la couleur du véhicule");
      document
        .querySelector("#inputmodifCouleurVInput")
        .classList.add("input-error");
    } else {
      setLoading(true);
      http
        .put("/flotte/modifier_vehicule/" + viewedVehicle.numero_chassis, {
          token: decryptData(window.localStorage.getItem("currTok")),
          id_sender: decryptData(window.localStorage.getItem("curruId")),
          num_chassis: viewedVehicle.numero_chassis,
          marque: brands.find((e) => e.id_marque === parseInt(selectedBrand))
            .libelle,
          modele: modeles.find((e) => e.id_modele === parseInt(selectedModele))
            .libelle,
          couleur: formatString(couleur),
          id_type_vehicule: selectedType,
        })
        .then((response) => {
          setLoading(false);
          document.location.reload();
        })
        .catch((err) => {
          setLoading(false);
          alert.error(
            "Une erreur est survenue. Veuillez réessayer ultérieurment."
          );
          console.log(err);
        });
    }
  }
  async function modifPhotoVehicule() {
    // La fct de modification de l'image du vehicule
    let newPdp = document.querySelector("#import_vehicule_pdp").files;
    if (newPdp.length === 0) {
      //photo de profile non choisie
      alert.error("Veuillez importer une photo de profile.");
    } else if (!newPdp[0].type.includes("image")) {
      alert.error("Veuillez importer une photo de profil valide");
    } else {
      try {
        //await suppImage(viewedVehicle.image_vehicule);
        let img = await createImage(
          newPdp[0],
          "Vehicule",
          viewedVehicle.numero_chassis
        );
        http
          .put(
            "/flotte/modifier_image_vehicule/" + viewedVehicle.numero_chassis,
            {
              token: decryptData(window.localStorage.getItem("currTok")),
              id_sender: decryptData(window.localStorage.getItem("curruId")),
              image_vehicule: img,
              location_image:
                "Vehicule/" + viewedVehicle.numero_chassis + newPdp[0].name,
            }
          )
          .then(async (jResponse) => {
            alert.show("Photo modifiée avec succès.");
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

  function formatString(string) {
    //Retoune un string sans vides supplemetaires + avec MAJUSCULE au début
    let str = string.replace(/\s+/g, " ").trim();
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Si le vehicule est chargé
  if (viewedVehicle.numero_chassis) {
    return (
      <div id="profileVehiculeContainer">
        <NavBarATC />
        <div id="profileVehicule">
          {suppModal()}
          {affecterModal()}
          {modifModal()}
          <div id="vec_imgDiv">
            <img src={viewedVehicle.image_vehicule} alt="Véhicule" />
          </div>
          <div id="vec_infos">
            <h3>
              {viewedVehicle.modele} #{viewedVehicle.numero_chassis}
            </h3>
            <div>
              <h4>{viewedVehicle.libelle}</h4>
              {(viewedVehicle.id_am !== null && (
                <h4
                  id="titleViewAmVec"
                  onClick={() =>
                    navigate(
                      "/atc/profil/am/" + encryptData(viewedVehicle.id_am)
                    )
                  }
                >
                  {viewedVehicle.nom + " " + viewedVehicle.prenom}
                </h4>
              )) || <h4>Aucun AM Responsable</h4>}
            </div>
          </div>
          <hr />
          <div id="vec_etat">
            <h3>Etat du véhicule</h3>
            <div>
              <h4>
                {(viewedVehicle.disponible && "Disponible") || "Non disponible"}
              </h4>
              <h4>{viewedVehicle.etat}</h4>
              <h4>{viewedVehicle.temperature + "°"}</h4>
              <h4>{viewedVehicle.batterie + "%"}</h4>
              <h4>{viewedVehicle.kilometrage + "Km"}</h4>
              <h4>{viewedVehicle.vitesse + "km/h"}</h4>
            </div>
          </div>
          <hr />
          <div id="vec_caracs">
            <h3>Caractéristiques du véhicule</h3>
            <div>
              <h4 title="Marque du véhicule">
                <FontAwesomeIcon icon="fa-solid fa-car-side" />
                {viewedVehicle.marque || <Skeleton />}
              </h4>
              <h4 title="Modèle du véhicule">
                <FontAwesomeIcon icon="fa-solid fa-gear" />
                {viewedVehicle.modele || <Skeleton />}
              </h4>
              <h4 title="Couleur du véhicule">
                <FontAwesomeIcon icon="fa-solid fa-brush" />
                {viewedVehicle.couleur || <Skeleton />}
              </h4>
            </div>
          </div>
          <div id="vehiculeActions">
            <Button
              title="Affecter à un AM"
              btnClass="buttonPrincipal"
              onClick={() => handleShowAffecterAM()}
            />
            <Button
              title="Modifier"
              btnClass="buttonPrincipal"
              onClick={() => handleShowModifShown()}
            />
            <Button
              title="Supprimer"
              btnClass="buttonSecondaire"
              onClick={() => handleShowSupp()}
            />
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div id="profileVehiculeContainer">
        <NavBarATC />
        <ClipLoader color={"#1B92A4"} loading={loading} css={style} size={50} />
      </div>
    );
  }
}

export default ProfileVehicule;
