import "./stylesheets/GestionVehicules.css";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../Context.js";
import ProfileVehicule from "./ProfileVehicule";
import http from "../../http.js";
import NavBarATC from "./../../Composants/NavBarATC";
import { decryptData } from "../../crypto";
import { getCarLocations } from "../../firebase";
import { useAlert } from "react-alert";
import { ClipLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import Button from "../../Composants/Button";
import Input from "../../Composants/Input";
import CadreVehicule from "../../Composants/CadreVehicule";
import { DropdownButton, Dropdown, Modal } from "react-bootstrap";
import GestionPagination from "../../Composants/GestionPagination";

//Page de gestion des véhicules
function GestionVehicules() {
  const alert = useAlert();
  const { setLoading, loading, createImage } =
    useContext(UserContext);
  const style = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };
  const [listVehicules, setVehicules] = useState([]); //liste affichée (on peut la filtrer, reordonner,...)
  let redirection = false;
  const numItems = 10;
  const navigate = useNavigate();
  const [dispoVehicule, setTypeVehicule] = useState("Tous les vehicules"); // Filtrer la liste des vehicules
  const [listOrder, setOrder] = useState("Up"); // Ordonner la liste des vehicules
  const [searchFor, search] = useState("");
  const [add, setAdd] = useState(false);
  const handleCloseAdd = () => setAdd(false);
  const handleShowAdd = () => setAdd(true);
  const [flotte, setFlotte] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("La marque du véhicule");
  const [selectedType, setSelectedType] = useState("Le type du véhicule");
  const [selectedModele, setSelectedModele] = useState("Le modèle du véhicule");
  const [selectedAm, setSelectedAm] = useState(
    "L'agent de maintenance responsable"
  );
  const [types, setTypes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [modeles, setModeles] = useState([]);
  const [listAm, setListAm] = useState([]);
  const [querySnapshot, setSnapshot] = useState([]);
  const [currPage, setCurrPage] = useState(1);
  const [numPages, setNumPages] = useState(1);

  useEffect(() => {
    async function getTrajets() {
      await getCarLocations(setSnapshot);
    }
    getTrajets();
    http
      .get("flotte/marque/", {
        headers: {
          token: decryptData(window.localStorage.getItem("currTok")),
          id_sender: decryptData(window.localStorage.getItem("curruId")),
        },
      })
      .then((response) => {
        setBrands(response.data);
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
  }, []);
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
  useEffect(() => {
    setNumPages(Math.ceil(listVehicules.length / numItems));
  }, [listVehicules]);
  useEffect(() => {
    //Set la flotte avec les infos d'état (dans firebase)
    document.querySelectorAll("#reorderIcons>.reOrderIcon").forEach((icon) => {
      icon.classList.add("disabledOrder");
      icon.classList.remove("selectedOrder");
    });
    setLoading(true);
    let tr = [];
    http
      .get("/flotte/vehicule/", {
        headers: {
          token: decryptData(window.localStorage.getItem("currTok")),
          id_sender: decryptData(window.localStorage.getItem("curruId")),
        },
      })
      .then((jResponse) => {
        querySnapshot.forEach((doc) => {
          if (jResponse.data.some((e) => e.numero_chassis === doc.id)) {
            let t = {
              ...doc.data(),
              ...jResponse.data.find((vehicule) => {
                if (vehicule.numero_chassis === doc.id) {
                  return true;
                }
                return false;
              }),
            };
            tr.push(t);
          }
        });
        setFlotte(tr);
        if (tr.length !== 0) {
          document
            .querySelectorAll("#reorderIcons>.reOrderIcon")
            .forEach((icon) => {
              icon.classList.remove("disabledOrder");
              icon.classList.remove("selectedOrder");
            });
          document
            .querySelector("#iconOrder" + listOrder)
            .classList.add("selectedOrder");
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        alert.error(
          "Une erreur est survenue, veuillez réessayer ultérieurement."
        );
      });
  }, [querySnapshot]);

  useEffect(() => {
    let vehicules = [];
    if (searchFor !== "") {
      document.querySelector("#vehiculeSearchField").value = searchFor;
      vehicules = flotte.filter((e) => {
        return e.modele.toLowerCase().includes(searchFor.toLowerCase());
      });
    } else {
      vehicules = flotte;
    }
    if (listOrder === "Up") {
      vehicules = vehicules.sort((a, b) => {
        if (a.modele < b.modele) {
          return -1;
        }
        if (a.modele > b.modele) {
          return 1;
        }
        if (a.numero_chassis < b.numero_chassis) {
          return -1;
        }
        if (a.numero_chassis > b.numero_chassis) {
          return 1;
        }
        return 0;
      });
    } else {
      vehicules = vehicules.sort((a, b) => {
        if (a.modele < b.modele) {
          return 1;
        }
        if (a.modele > b.modele) {
          return -1;
        }
        if (a.numero_chassis < b.numero_chassis) {
          return 1;
        }
        if (a.numero_chassis > b.numero_chassis) {
          return -1;
        }
        return 0;
      });
    }

    switch (dispoVehicule) {
      case "Véhicules disponnibles":
        setVehicules(
          vehicules.filter((e) => {
            return e.disponible === true;
          })
        );
        break;
      case "Véhicules louées":
        setVehicules(
          vehicules.filter((e) => {
            return e.disponible === false;
          })
        );
        break;
      default:
        setVehicules(
          vehicules.filter((e) => {
            return true;
          })
        );
        break;
    }
  }, [flotte, searchFor, listOrder, dispoVehicule]);

  function setRedirection(dest) {
    // s'il est nécessaire de rediriger : se rediriger vers la destination
    redirection = dest;
  }
  function afterPageClicked(page_number) {
    setCurrPage(page_number);
  }
  function orderUp(event) {
    //Re-Ordonner la liste des véhicules
    if (
      !event.target.classList.contains("disabledOrder") &&
      !event.target.classList.contains("selectedOrder")
    ) {
      document
        .querySelector("#iconOrderDown")
        .classList.remove("selectedOrder");
      document.querySelector("#iconOrderUp").classList.add("selectedOrder");
      setOrder("Up");
    }
  }
  function orderDown(event) {
    //Re-Ordonner la liste des véhicules
    if (
      !event.target.classList.contains("disabledOrder") &&
      !event.target.classList.contains("selectedOrder")
    ) {
      document.querySelector("#iconOrderUp").classList.remove("selectedOrder");
      document.querySelector("#iconOrderDown").classList.add("selectedOrder");
      setOrder("Down");
    }
  }

  async function addVehicle() {
    let numero_chassis = document.querySelector("#inputnumChassis").value;
    let couleur = document.querySelector("#inputvecColor").value;
    let newPdp = document.querySelector("#import_vehicule_pdp").files;
    if (numero_chassis === "") {
      alert.error("Veuillez sélectionner le numéro chassis du véhicule");
      document.querySelector("#inputnumChassis").classList.add("input-error");
    } else if (numero_chassis.length > 10) {
      alert.error(
        "La longueur du numéro de chassis ne doit pas dépasser 10 charactères"
      );
      document.querySelector("#inputnumChassis").classList.add("input-error");
    } else if (newPdp.length === 0) {
      //photo de profile non choisie
      alert.error("Veuillez importer une photo de profile.");
    } else if (!newPdp[0].type.includes("image")) {
      alert.error("Veuillez importer une photo de profil valide");
    } else if (selectedBrand === "La marque du véhicule") {
      alert.error("Veuillez sélectionner la marque du véhicule");
    } else if (selectedModele === "Le modèle du véhicule") {
      alert.error("Veuillez sélectionner le modèle du véhicule");
    } else if (selectedType === "Le type du véhicule") {
      alert.error("Veuillez sélectionner le type du véhicule");
    } else if (couleur === "") {
      alert.error("Veuillez sélectionner la couleur du véhicule");
      document.querySelector("#inputvecColor").classList.add("input-error");
    } else {
      try {
        let img = await createImage(newPdp[0], "Vehicule", numero_chassis);
        http
          .post("/flotte/ajouter_vehicule/", {
            token: decryptData(window.localStorage.getItem("currTok")),
            id_sender: decryptData(window.localStorage.getItem("curruId")),
            num_chassis: numero_chassis,
            marque: brands.find((e) => e.id_marque === parseInt(selectedBrand))
              .libelle,
            modele: modeles.find(
              (e) => e.id_modele === parseInt(selectedModele)
            ).libelle,
            couleur: couleur,
            id_type_vehicule: selectedType,
            id_am: selectedAm,
            image_vehicule: img,
            disponible: true,
            location_image: "Vehicule/" + numero_chassis + newPdp[0].name,
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
      } catch (err) {
        alert.error(
          "Une erreur est survenue. Veuillez réessayer ultérieurment."
        );
        console.log(err);
      }
    }
  }
  function addModal() {
    return (
      <Modal
        show={add}
        onHide={handleCloseAdd}
        backdrop="static"
        keyboard={false}
        centered
        dialogClassName="custom-dialog-add"
      >
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un véhicule</Modal.Title>
        </Modal.Header>
        <Modal.Body id="addModalBody">
          <Input
            label="Numéro du chassis"
            inputClass=""
            containerClass="formAddVecInput"
            id="numChassis"
            fieldType="text"
          />
          <Input
            label="Couleur du véhicule"
            inputClass=""
            containerClass="formAddVecInput"
            id="vecColor"
            fieldType="text"
          />
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
        </Modal.Body>
        <Modal.Footer className="addVFooter">
          <Button
            title="Ajouter"
            btnClass="buttonPrincipal"
            onClick={() => {
              addVehicle();
            }}
          />
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
            title="Annuler"
            btnClass="buttonSecondaire"
            onClick={() => {
              handleCloseAdd();
            }}
          />
        </Modal.Footer>
      </Modal>
    );
  }

  function returnList() {
    if (flotte.length === 0) {
      return <h3 id="noEmp">La liste des véhicules est vide.</h3>;
    } else if (listVehicules.length === 0) {
      return <h3 id="noEmp">Aucun véhicule ne correspond à votre requête.</h3>;
    } else {
      return (
        <GestionPagination
          totPages={numPages}
          currentPage={currPage}
          numItems={numItems}
          pageClicked={(ele) => {
            afterPageClicked(ele);
          }}
        >
          {listVehicules.map((vehicule) => {
            return (
              <CadreVehicule
                key={vehicule.numero_chassis}
                id={vehicule.numero_chassis}
                vehicule={vehicule}
              ></CadreVehicule>
            );
          })}
        </GestionPagination>
      );
    }
  }

  switch (window.location.pathname) {
    case "/atc/gestionvehicules":
    case "/atc/gestionvehicules/":
      return (
        <div id="gestionDesVehiculesDiv">
          <ClipLoader
            color={"#1B92A4"}
            loading={loading}
            css={style}
            size={50}
          />
          <NavBarATC />
          <div id="vehiculesListContainer">
            {addModal()}
            <div id="filtrageList">
              <Button
                title="Ajouter un véhicule"
                btnClass="buttonPrincipal"
                onClick={handleShowAdd}
              />
              <div id="filtrageActs">
                <DropdownButton
                  id="dispoVehiculeDrop"
                  title={dispoVehicule}
                  onSelect={(e) => setTypeVehicule(e)}
                >
                  <Dropdown.Item eventKey="Tous les véhicules">
                    Tous les véhicules
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="Véhicules disponnibles">
                    Véhicules disponnibles{" "}
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="Véhicules louées">
                    Véhicules louées
                  </Dropdown.Item>
                </DropdownButton>
                <div className="vehiculeSearch">
                  <input
                    type="text"
                    placeholder="Recherche"
                    id="vehiculeSearchField"
                  ></input>
                  <FontAwesomeIcon
                    id="vehiculesearchBtn"
                    icon="fas fa-search"
                    onClick={() =>
                      search(
                        document.querySelector("#vehiculeSearchField").value
                      )
                    }
                  />
                </div>
                <div id="reorderIcons">
                  <FontAwesomeIcon
                    className="reOrderIcon disabledOrder"
                    id="iconOrderUp"
                    icon="fas fa-angle-up "
                    onClick={(event) => orderUp(event)}
                  />
                  <FontAwesomeIcon
                    className="reOrderIcon disabledOrder"
                    id="iconOrderDown"
                    icon="fas fa-angle-down "
                    onClick={(event) => orderDown(event)}
                  />
                </div>
              </div>
            </div>
            <div id="vehiculesList">{returnList()}</div>
          </div>
        </div>
      );

    default:
      setRedirection("/404");
      return null;
  }
}

export default GestionVehicules;
