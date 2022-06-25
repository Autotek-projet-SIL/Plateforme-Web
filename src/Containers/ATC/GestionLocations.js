import "./stylesheets/GestionLocations.css";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../Context.js";
import http from "../../http.js";
import NavBarATC from "./../../Composants/NavBarATC";
import { decryptData } from "../../crypto";
import { useAlert } from "react-alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import CadreLocation from "../../Composants/CadreLocation";
import GestionPagination from "../../Composants/GestionPagination";
//Page de gestion locations
function GestionLocations() {
  const alert = useAlert();
  const { setLoading, loading } = useContext(UserContext);
  const style = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };
  let redirection = false;
  const navigate = useNavigate();
  const numItems = 10;
  const [dispoLocation, setTypeLocation] = useState("Toutes les locations"); // Filtrer la liste des locations
  const [listOrder, setOrder] = useState("Up"); // Ordonner la liste des locations
  const [searchFor, search] = useState("");
  const [listLocations, setListLocations] = useState([]);
  const [locations, setLocations] = useState([]); //liste affichée (on peut la filtrer, reordonner,...)
  const [currPage, setCurrPage] = useState(1);
  const [numPages, setNumPages] = useState(1);
  useEffect(() => {
    //Set la listLocations avec les infos d'état (dans firebase)
    http
      .get("/gestionlocations/locations", {
        headers: {
          token: decryptData(window.localStorage.getItem("currTok")),
          id_sender: decryptData(window.localStorage.getItem("curruId")),
        },
      })
      .then((jResponse) => {
        setListLocations(jResponse.data);
        console.log(jResponse.data)
        if (jResponse.data.length !== 0) {
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
        console.log(err);
        alert.error(
          "Une erreur est survenue, veuillez réessayer ultérieurement."
        );
      });
  }, []);

  useEffect(() => {
    let locs = [];
    if (searchFor !== "") {
      document.querySelector("#locationSearchField").value = searchFor;
      locs = listLocations.filter((e) => {
        console.log(e);
        return (
          e.nom.toLowerCase().includes(searchFor.toLowerCase()) ||
          e.prenom.toLowerCase().includes(searchFor.toLowerCase())
        );
      });
    } else {
      locs = listLocations;
    }
    if (listOrder === "Up") {
      locs = locs.sort((a, b) => {
        if (a.id_louer < b.id_louer) {
          return -1;
        }
        if (a.id_louer > b.id_louer) {
          return 1;
        }
        return 0;
      });
    } else {
      locs = locs.sort((a, b) => {
        if (a.id_louer < b.id_louer) {
          return 1;
        }
        if (a.id_louer > b.id_louer) {
          return -1;
        }
        return 0;
      });
    }

    switch (dispoLocation) {
      case "Locations rejettées":
        setLocations(
          locs.filter((e) => {
            return e.status_demande_location === "rejete";
          })
        );
        break;
      case "Locations en cours":
        setLocations(
          locs.filter((e) => {
            return (e.en_cours === true)&&(e.status_demande_location !== "rejete");
          })
        );
        break;
      case "Locations terminées":
        setLocations(
          locs.filter((e) => {
            return (e.en_cours === false)&&(e.status_demande_location !== "rejete");
          })
        );
        break;
      default:
        setLocations(
          locs.filter((e) => {
            return true;
          })
        );
        break;
    }
  }, [listLocations, searchFor, listOrder, dispoLocation]);
  useEffect(() => {
    setNumPages(Math.ceil(locations.length / numItems));
  }, [locations]);

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
  
  function returnList() {
    if (listLocations.length === 0) {
      return <h3 id="noEmp">La liste de locations est vide.</h3>;
    } else if (locations.length === 0) {
      return <h3 id="noEmp">Aucune location ne correspond à votre requête.</h3>;
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
          {locations.map((location) => {
            return (
              <CadreLocation
                key={location.id_louer}
                id={location.id_louer}
                location={location}
              />
            );
          })}
        </GestionPagination>
      );
    }
  }

  switch (window.location.pathname) {
    case "/atc/gestionlocations":
    case "/atc/gestionlocations/":
      return (
        <div id="gestionDesLocationsDiv">
          <ClipLoader
            color={"#1B92A4"}
            loading={loading}
            css={style}
            size={50}
          />
          <NavBarATC />
          <div id="locationsListContainer">
            <div id="filtrageList">
              <div id="filtrageActs">
                <DropdownButton
                  id="dispoLocationDrop"
                  title={dispoLocation}
                  onSelect={(e) => setTypeLocation(e)}
                >
                  <Dropdown.Item eventKey="Toutes les locations">
                    Toutes les locations
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="Locations en cours">
                    Locations en cours{" "}
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="Locations terminées">
                    Locations terminées
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="Locations rejettées">
                    Locations rejettées{" "}
                  </Dropdown.Item>
                </DropdownButton>
                <div className="locationSearch">
                  <input
                    type="text"
                    placeholder="Recherche"
                    id="locationSearchField"
                  ></input>
                  <FontAwesomeIcon
                    id="locationSearchBtn"
                    icon="fas fa-search"
                    onClick={() =>
                      search(
                        document.querySelector("#locationSearchField").value
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
            <div id="locationsList">{returnList()}</div>
          </div>
        </div>
      );

    default:
      setRedirection("/404");
      return null;
  }
}

export default GestionLocations;
