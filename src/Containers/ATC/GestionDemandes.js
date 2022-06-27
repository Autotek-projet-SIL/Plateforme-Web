import "./stylesheets/GestionDemandes.css";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Context.js";
import http from "../../http.js";
import { decryptData } from "../../crypto";
import GestionPagination from "../../Composants/GestionPagination";
import CadreDemandeInsc from "../../Composants/CadreDemandeInsc.js";
import CadreDemandeSupport from "../../Composants/CadreDemandeSupport.js";
import NavBarATC from "./../../Composants/NavBarATC";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DropdownButton, Spinner, Dropdown } from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";

//Page de gestion des demandes (inscription + support) de l'ATC
function GestionDemandes(props) {
  const { setLoading, loading } = useContext(UserContext);
  let redirection = false;
  const navigate = useNavigate();
  const style = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };
  const [currPage, setCurrPage] = useState(1);
  const [numPages, setNumPages] = useState(1);
  const numItems = 10;
  const refreshInterval = 120000; // temps d'attente avant d'actualiser les données (2 mins)
  const [listDemandes, setDemandes] = useState([]); //liste affichée (on peut la filtrer, reordonner,...)
  const [demandesFetched, setFetchedList] = useState([]); // liste récupérée de la bdd
  const [etatDmnd, setEtatDmnd] = useState("Toutes les demandes"); // Filtrer la liste des demandes
  const [listOrder, setOrder] = useState("Up"); // Ordonner la liste des demandes
  const [searchFor, search] = useState("");
  
  useEffect(() => {
    //Redirection si URL incorrect / incomplet
    if (redirection !== false) {
      navigate(redirection, { replace: true });
    }
  }, []);

  useEffect(() => {
    search("");
    //Récupérer les données selon l'onglet courrant
    if (props.onglet === "insc") {
      //récupérer les demandes d'inscription
      getDemandesInsc();
      const interval = setInterval(() => {
        getDemandesInsc();
      }, refreshInterval);
      return () => clearInterval(interval);
    } else {
      // fetch demandes support
      getDemandesSupport();
      const interval = setInterval(() => {
        getDemandesSupport();
      }, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [props.onglet]);

  useEffect(() => {
    setNumPages(Math.ceil(listDemandes.length / numItems));
  }, [listDemandes]);

  useEffect(() => {
    if (window.location.pathname === "/atc/gestiondemandes/inscription") {
      //Filtrer/ordonner les demandes d'inscription de la base de données
      let dmnd = [];
      if (searchFor !== "") {
        document.querySelector("#demandeSearchField").value = searchFor;
        dmnd = demandesFetched.filter((e) => {
          return (
            e.nom.toLowerCase().includes(searchFor.toLowerCase()) ||
            e.prenom.toLowerCase().includes(searchFor.toLowerCase())
          );
        });
      } else {
        dmnd = demandesFetched;
      }
      if (listOrder === "Up") {
        dmnd = dmnd.sort((a, b) => {
          if (a.date_inscription < b.date_inscription) {
            return 1;
          }
          if (a.date_inscription > b.date_inscription) {
            return -1;
          }
          return 0;
        });
      } else {
        dmnd = dmnd.sort((a, b) => {
          if (a.date_inscription < b.date_inscription) {
            return -1;
          }
          if (a.date_inscription > b.date_inscription) {
            return 1;
          }
          return 0;
        });
      }

      switch (etatDmnd) {
        case "Demandes en attente":
          document.querySelector("h2#etatDmndTitle").innerHTML =
            "Liste des demandes d'inscription en attente";
          setDemandes(
            dmnd.filter((e) => {
              return e.statut === "en attente";
            })
          );
          break;
        case "Demandes validées":
          document.querySelector("h2#etatDmndTitle").innerHTML =
            "Liste des demandes d'inscription validées";
          setDemandes(
            dmnd.filter((e) => {
              return e.statut === "validee";
            })
          );
          break;
        case "Demandes rejetées":
          document.querySelector("h2#etatDmndTitle").innerHTML =
            "Liste des demandes d'inscription rejetées";
          setDemandes(
            dmnd.filter((e) => {
              return e.statut === "refusee";
            })
          );
          break;
        default:
          document.querySelector("h2#etatDmndTitle").innerHTML =
            "Liste des demandes d'inscription";
          setDemandes(
            dmnd.filter((e) => {
              return true;
            })
          );
          break;
      }
    } else {
      //Filtrer/ordonner les demandes support
      let dmnd = [];
      if (searchFor !== "") {
        document.querySelector("#demandeSearchField").value = searchFor;
        dmnd = demandesFetched.filter((e) => {
          return (
            e.nom.toLowerCase().includes(searchFor.toLowerCase()) ||
            e.prenom.toLowerCase().includes(searchFor.toLowerCase())
          );
        });
      } else {
        dmnd = demandesFetched;
      }
      if (listOrder === "Up") {
        dmnd = dmnd.sort((a, b) => {
          if (a.id_louer < b.id_louer) {
            return 1;
          }
          if (a.id_louer > b.id_louer) {
            return -1;
          }
          return 0;
        });
      } else {
        dmnd = dmnd.sort((a, b) => {
          if (a.id_louer < b.id_louer) {
            return -1;
          }
          if (a.id_louer > b.id_louer) {
            return 1;
          }
          return 0;
        });
      }
      setDemandes(dmnd);
    }
  }, [demandesFetched, searchFor, listOrder, etatDmnd]);

  function setRedirection(dest) {
    // s'il est nécessaire de rediriger : se rediriger vers la destination
    redirection = dest;
  }

  function afterPageClicked(page_number) {
    setCurrPage(page_number);
  }

  async function getDemandesInsc() {
    //récupérer les demandes d'inscription de la base de données
    document.querySelectorAll("#reorderIcons>.reOrderIcon").forEach((icon) => {
      icon.classList.add("disabledOrder");
      icon.classList.remove("selectedOrder");
    });
    if (window.location.pathname === "/atc/gestiondemandes/inscription") {
      setLoading(true);
      await http
        .get("gestionprofils/locataire/", {
          headers: {
            token: decryptData(window.localStorage.getItem("currTok")),
            id_sender: decryptData(window.localStorage.getItem("curruId")),
          },
        })
        .then((jResponse) => {
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
            setFetchedList(jResponse.data);
          } else if (demandesFetched.length !== 0) {
            setFetchedList(demandesFetched);
          } else {
            setFetchedList(jResponse.data);
          }
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          setFetchedList([]);
        });
    }
  }

  async function getDemandesSupport() {
    //récupérer les demandes de support de la base de données
    document.querySelectorAll("#reorderIcons>.reOrderIcon").forEach((icon) => {
      icon.classList.add("disabledOrder");
      icon.classList.remove("selectedOrder");
    });
    if (window.location.pathname === "/atc/gestiondemandes/support") {
      setLoading(true);
      await http
        .get("demande_support/demande_support", {
          headers: {
            token: decryptData(window.localStorage.getItem("currTok")),
            id_sender: decryptData(window.localStorage.getItem("curruId")),
          },
        })
        .then((jResponse) => {
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
            setFetchedList(jResponse.data);
          } else if (demandesFetched.length !== 0) {
            setFetchedList(demandesFetched);
          } else {
            setFetchedList(jResponse.data);
          }
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          setFetchedList([]);
        });
    }
  }

  function orderUp(event) {
    //Re-Ordonner la liste des demandes
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
    //Re-Ordonner la liste des demandes
    if (
      !event.target.classList.contains("disabledOrder") &&
      !event.target.classList.contains("selectedOrder")
    ) {
      document.querySelector("#iconOrderUp").classList.remove("selectedOrder");
      document.querySelector("#iconOrderDown").classList.add("selectedOrder");
      setOrder("Down");
    }
  }
  function returnListInsc() {
    //Retourner une titre si la liste des demandes est vide/les données se chargent OU les cadres des demandes
    if (demandesFetched.length === 0) {
      if (loading) {
        return <h3 id="inscNoDemande">Rien à afficher pour le moment.</h3>;
      } else {
        return (
          <h3 id="inscNoDemande">
            La liste des demandes est vide pour le moment.&emsp;
            <Spinner animation="border" />
          </h3>
        );
      }
    } else if (listDemandes.length === 0) {
      return (
        <h3 id="inscNoDemande">
          Aucune demande ne correspond à votre requête.
        </h3>
      );
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
          {listDemandes.map((laDemande) => {
            return (
              <CadreDemandeInsc
                key={laDemande.id_demande_inscription}
                demandeId={laDemande.id_demande_inscription}
                id_locataire={laDemande.id_locataire}
                demande={laDemande}
              />
            );
          })}
        </GestionPagination>
      );
    }
  }
  function returnListSupport() {
    //Retourner une titre si la liste des demandes est vide/les données se chargent OU les cadres des demandes
    if (demandesFetched.length === 0) {
      if (loading) {
        return <h3 id="inscNoDemande">Rien à afficher pour le moment.</h3>;
      } else {
        return (
          <h3 id="inscNoDemande">
            La liste des demandes est vide pour le moment.&emsp;
            <Spinner animation="border" />
          </h3>
        );
      }
    } else if (listDemandes.length === 0) {
      return (
        <h3 id="inscNoDemande">
          Aucune demande ne correspond à votre requête.
        </h3>
      );
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
          {listDemandes.map((laDemande) => {
            return (
              <CadreDemandeSupport
                key={laDemande.id_demande_support}
                demande={laDemande}
              />
            );
          })}
        </GestionPagination>
      );
    }
  }
  function gestionDemands() {
    //fonction qui gere la liste des demandes affichées
    // get list where statut="en attente" and order by date_inscription
    switch (window.location.pathname) {
      // Gestion des Onglets de demandes
      case "/atc/gestiondemandes/inscription/":
      case "/atc/gestiondemandes":
      case "/atc/gestiondemandes/":
        setRedirection("/atc/gestiondemandes/inscription");
        return null;

      case "/atc/gestiondemandes/inscription":
        if (props.onglet === "insc")
          return (
            <div id="pageDemandes">
              <div id="demandesVues">
                <div id="vueChosen">Demandes d'inscription</div>
                <div
                  id="vueNotChosen"
                  onClick={() => {
                    setDemandes([]);
                    navigate("/atc/gestiondemandes/support");
                  }}
                >
                  Demandes de support
                </div>
              </div>
              <div id="demandesInsc">
                <div id="filtrageList">
                  <h2 id="etatDmndTitle">Liste des demandes d'inscription</h2>
                  <div id="filtrageActs">
                    <DropdownButton
                      id="etatDmndDrop"
                      title={etatDmnd}
                      onSelect={(e) => setEtatDmnd(e)}
                    >
                      <Dropdown.Item eventKey="Toutes les Demandes">
                        Toutes les Demandes
                      </Dropdown.Item>
                      <Dropdown.Item eventKey="Demandes validées">
                        Demandes validées
                      </Dropdown.Item>
                      <Dropdown.Item eventKey="Demandes en attente">
                        Demandes en attente
                      </Dropdown.Item>
                      <Dropdown.Item eventKey="Demandes rejetées">
                        Demandes rejetées
                      </Dropdown.Item>
                    </DropdownButton>
                    <div className="demandesSearch">
                      <input
                        type="text"
                        placeholder="Recherche"
                        id="demandeSearchField"
                      ></input>
                      <FontAwesomeIcon
                        id="demandeSearchBtn"
                        icon="fas fa-search"
                        onClick={() =>
                          search(
                            document.querySelector("#demandeSearchField").value
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
                <div id="demandesList">{returnListInsc()}</div>
              </div>
            </div>
          );
        return null;
      case "/atc/gestiondemandes/support":
        if (props.onglet === "supp")
          return (
            <div id="pageDemandes">
              <div id="demandesVues">
                <div
                  id="vueNotChosen"
                  onClick={() => {
                    setDemandes([]);
                    navigate("/atc/gestiondemandes/inscription");
                  }}
                >
                  Demandes d'inscription
                </div>
                <div id="vueChosen">Demandes de support</div>
              </div>
              <div id="demandesInsc">
                <div id="filtrageList">
                  <h2 id="etatDmndTitle">Liste des demandes de support</h2>
                  <div id="filtrageActs">
                    <div className="demandesSearch">
                      <input
                        type="text"
                        placeholder="Recherche"
                        id="demandeSearchField"
                      ></input>
                      <FontAwesomeIcon
                        id="demandeSearchBtn"
                        icon="fas fa-search"
                        onClick={() =>
                          search(
                            document.querySelector("#demandeSearchField").value
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
                <div id="demandesList">{returnListSupport()}</div>
              </div>
            </div>
          );
        return null;
      default:
        setRedirection("/404");
        return null;
    }
  }

  return (
    <div id="gestionDemandesDiv">
      <ClipLoader color={"#1B92A4"} loading={loading} css={style} size={50} />
      <NavBarATC />
      {gestionDemands()}
    </div>
  );
}

export default GestionDemandes;
