import "./stylesheets/ProfileAM.css";
import "../../Composants/stylesheets/bootsrapNeededStles.css";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../Context.js";
import NavBarATC from "./../../Composants/NavBarATC";
import { useNavigate } from "react-router-dom";
import http from "../../http.js";
import { decryptData } from "../../crypto";
import { useAlert } from "react-alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import Input from "../../Composants/Input";
import Button from "../../Composants/Button";
import {
  Dropdown,
  DropdownButton,
  FloatingLabel,
  Form,
  Modal,
  Table,
} from "react-bootstrap";
import CadreVehicule from "../../Composants/CadreVehicule";
import DatePicker from "react-datepicker";
import "./../../Composants/stylesheets/datePicker.css";
import {
  ComposedChart,
  Line,
  AreaChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
//Page Profile d'un AM
function ProfileAM(props) {
  const alert = useAlert();
  const {
    setLoading,
    loading,
    updateEmail,
    updatePwd,
    user,
    createImage,
    suppImage,
  } = useContext(UserContext);
  const [modifDiv, setShown] = useState(false);
  const [viewedUser, setViewedUser] = useState({});
  const [fire, setFire] = useState(false);
  const [statsFirst, setstatsFirst] = useState(true); // montrer les pannes/ la liste des vehicules
  const handleCloseFire = () => setFire(false);
  const handleShowFire = () => setFire(true);
  const [attribuerTache, setAttribuerTache] = useState(false);
  const handleCloseAttribuerTache = () => setAttribuerTache(false);
  const handleShowAttribuerTache = () => setAttribuerTache(true);

  const [listOrder, setOrder] = useState("Up"); // Ordonner la liste des vehicules
  const [searchFor, search] = useState("");

  const [flotte, setFlotte] = useState([]);
  const [listeVehicule, setListeVehicule] = useState([]);

  const [fetchedTasks, setFetchedTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [tasksStats, setTasksStats] = useState([]);

  const [tachesFilter, setTachesFilter] = useState("Mois");
  const [tachesVueFilter, setTachesVueFilter] = useState("Diagramme");

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const navigate = useNavigate();
  let redirection = false;
  function setRedirection(dest) {
    // s'il est nécessaire de rediriger : se rediriger vers la destination
    redirection = dest;
  }
  useEffect(() => {
    if (redirection !== false) {
      navigate(redirection, { replace: true });
    } else {
      //Récupérer les informations de l'AM
      http
        .get("/gestionprofils/am/" + decryptData(props.userId), {
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
            //Récupérer les véhicules attribués à l'am
            http
              .get("/flotte/vehicule_am/" + decryptData(props.userId), {
                headers: {
                  token: decryptData(window.localStorage.getItem("currTok")),
                  id_sender: decryptData(
                    window.localStorage.getItem("curruId")
                  ),
                },
              })
              .then((reponse) => {
                setFlotte(reponse.data);
              })
              .catch((err) => {
                alert.error(
                  "Une erreur est survenue! Veuillez vérifier votre connexion ou réessayer ultérieurement."
                );
              });
            http
              .get("/tache/get_tache_byidam/" + decryptData(props.userId), {
                headers: {
                  token: decryptData(window.localStorage.getItem("currTok")),
                  id_sender: decryptData(
                    window.localStorage.getItem("curruId")
                  ),
                },
              })
              .then((reponse) => {
                setFetchedTasks(
                  reponse.data.sort((a, b) => {
                    if (a.date_debut > b.date_debut) {
                      return 1;
                    }
                    if (a.date_debut < b.date_debut) {
                      return -1;
                    }
                    return 0;
                  })
                );
              })
              .catch((err) => {
                alert.error(
                  "Une erreur est survenue! Veuillez vérifier votre connexion ou réessayer ultérieurement."
                );
              });
          }
        })
        .catch((err) => {
          alert.error(
            "Une erreur est survenue! Veuillez vérifier votre connexion ou réessayer ultérieurement."
          );
        });
    }
  }, [redirection]);
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
    setListeVehicule(vehicules);
  }, [flotte, searchFor, listOrder]);

  useEffect(() => {
    let today = new Date();
    let dates;
    let lesTasks;
    switch (tachesFilter) {
      case "Semaine":
        lesTasks = fetchedTasks.filter((e) => {
          return (
            formatGetYear(e.date_debut) === today.getFullYear() &&
            formatGetMonth(e.date_debut) === today.getMonth() + 1 &&
            today.getDate() - formatGetDay(e.date_debut) < 7
          );
        });
        setTasks(lesTasks);
        dates = [
          ...new Set(
            lesTasks.map(
              (item) =>
                formatGetYear(item.date_debut) +
                "-" +
                (formatGetMonth(item.date_debut).toString().length === 1
                  ? "0" + formatGetMonth(item.date_debut)
                  : formatGetMonth(item.date_debut)) +
                "-" +
                (formatGetDay(item.date_debut).toString().length === 1
                  ? "0" + formatGetDay(item.date_debut)
                  : formatGetDay(item.date_debut))
            )
          ),
        ];
        setTasksStats(
          dates.map((e) => {
            return {
              date_debut: e,
              nombre: lesTasks.filter(
                (cur) =>
                  formatGetYear(cur.date_debut) === formatGetYear(e) &&
                  formatGetMonth(cur.date_debut) === formatGetMonth(e) &&
                  formatGetDay(cur.date_debut) === formatGetDay(e)
              ).length,
            };
          })
        );
        break;

      case "Mois":
        lesTasks = fetchedTasks.filter((e) => {
          return (
            formatGetYear(e.date_debut) === today.getFullYear() &&
            formatGetMonth(e.date_debut) === today.getMonth() + 1
          );
        });
        setTasks(lesTasks);
        dates = [
          ...new Set(
            lesTasks.map(
              (item) =>
                formatGetYear(item.date_debut) +
                "-" +
                (formatGetMonth(item.date_debut).toString().length === 1
                  ? "0" + formatGetMonth(item.date_debut)
                  : formatGetMonth(item.date_debut))
            )
          ),
        ];
        setTasksStats(
          dates.map((e) => {
            return {
              date_debut: e,
              nombre: lesTasks.filter(
                (cur) =>
                  formatGetYear(cur.date_debut) === formatGetYear(e) &&
                  formatGetMonth(cur.date_debut) === formatGetMonth(e)
              ).length,
            };
          })
        );
        break;

      default:
        lesTasks = fetchedTasks.filter((e) => {
          return formatGetYear(e.date_debut) === today.getFullYear();
        });
        setTasks(lesTasks);
        dates = [
          ...new Set(lesTasks.map((item) => formatGetYear(item.date_debut))),
        ];
        setTasksStats(
          dates.map((e) => {
            return {
              date_debut: e,
              nombre: lesTasks.filter(
                (cur) => formatGetYear(cur.date_debut) === e
              ).length,
            };
          })
        );
        break;
    }
  }, [fetchedTasks, tachesFilter]);

  async function modifierPdp() {
    let newPdp = document.querySelector("#import_am_pdp").files;
    if (newPdp.length === 0) {
      //photo de profile non choisie
      alert.error("Veuillez importer une photo de profile.");
    } else if (!newPdp[0].type.includes("image")) {
      alert.error("Veuillez importer une photo de profil valide");
    } else {
      try {
        await suppImage(viewedUser.photo_am);
        let img = await createImage(
          newPdp[0],
          "AM",
          decryptData(window.localStorage.getItem("curruId"))
        );
        http
          .put(
            "/gestionprofils/modifier_am/modifier_photo/" + viewedUser.id_am,
            {
              token: decryptData(window.localStorage.getItem("currTok")),
              id_sender: decryptData(window.localStorage.getItem("curruId")),
              photo_am: img,
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
    let nom = formatString(document.querySelector("#inputamModifNom").value);
    let prenom = formatString(
      document.querySelector("#inputamModifPrenom").value
    );
    let numTel = document.querySelector("#inputamModifTlfn").value;
    if (nom === "" || prenom === "" || numTel === "") {
      // champs requis vides
      alert.error("Veuillez remplir tous les champs requis.");

      nom === "" &&
        document.querySelector("#inputamModifNom").classList.add("input-error");
      prenom === "" &&
        document
          .querySelector("#inputamModifPrenom")
          .classList.add("input-error");
      numTel === "" &&
        document
          .querySelector("#inputamModifTlfn")
          .classList.add("input-error");
    } else {
      http
        .put("/gestionprofils/modifier_am/" + viewedUser.id_am, {
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

  function formatGetDay(date) {
    return Number(date.substr(8, 2));
  }
  function formatGetMonth(date) {
    return Number(date.substr(5, 2));
  }
  function formatGetYear(date) {
    return Number(date.substr(0, 4));
  }
  function formatString(string) {
    //Retoune un string sans vides supplemetaires + avec MAJUSCULE au début
    let str = string.replace(/\s+/g, " ").trim();
    return str.charAt(0).toUpperCase() + str.slice(1);
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

  function CustomTooltipTask({ payload, label, active }) {
    if (active && payload !== null && label !== null) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`Nombre de taches attribuées: ${payload[0].value}`}</p>
          <p className="info">{`Date : ${label}`}</p>
        </div>
      );
    }
    return null;
  }
  async function fireEmp() {
    setLoading(true);
    http
      .delete(`/gestioncomptes/supprimer_am/${viewedUser.id_am}`, {
        data: {
          token: decryptData(window.localStorage.getItem("currTok")),
          id_sender: decryptData(window.localStorage.getItem("curruId")),
        },
      })
      .then(async (jResponse) => {
        await suppImage(viewedUser.photo_am);
        setLoading(false);
        document.location.href = "/atc/gestioncomptes/";
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
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
  async function ajouterTache() {
    let objet = document.querySelector("#inputobjetTacheInput").value;
    let descriptif = document.querySelector("#descTache>textArea").value;
    http
      .post("/tache/ajouter_tache/", {
        token: decryptData(window.localStorage.getItem("currTok")),
        id_sender: decryptData(window.localStorage.getItem("curruId")),
        objet: objet,
        descriptif: descriptif,
        etat: "en cours",
        date_debut:
          startDate.getFullYear() +
          "-" +
          ("0" + (startDate.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + startDate.getDate()).slice(-2),
        date_fin:
          endDate.getFullYear() +
          "-" +
          ("0" + (endDate.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + endDate.getDate()).slice(-2),
        id_am: viewedUser.id_am,
        etat_avancement: 0,
        type_tache: "Tache affectée par un atc",
        email: viewedUser.email,
      })
      .then(async (jResponse) => {
        alert.show("La tache a été affectée a l'agent de maintenance.");
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        alert.error(
          "Une erreur est survenue. Veuillez réessayer ultérieurement."
        );
      });
  }
  function tacheModal() {
    return (
      <Modal
        show={attribuerTache}
        onHide={handleCloseAttribuerTache}
        backdrop="static"
        keyboard={false}
        centered
        dialogClassName="custom-dialog-attribuer"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Attribuer une tâche à l'agent de maintenance {viewedUser.nom}{" "}
            {viewedUser.prenom}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body id="assignTaskBody">
          <Input
            label="Objet de la tache"
            inputClass=""
            containerClass="objetTache"
            id="objetTacheInput"
            fieldType="text"
          />
          <FloatingLabel label="Descriptif de la tache" id="descTache">
            <Form.Control
              as="textarea"
              placeholder="Descriptif de la tache"
              style={{ height: "100px" }}
            />
          </FloatingLabel>
          <div id="datePickersDiv">
            <div className="datePickerContainer">
              <label for="datePickersStart">Date de debut : </label>
              <DatePicker
                id="datePickersStart"
                selected={startDate}
                dateFormat="dd/MM/yyyy"
                minDate={startDate}
                onChange={(date) => {
                  setStartDate(date);
                  if (date > endDate) {
                    setEndDate(date);
                  }
                }}
              />
            </div>
            <div className="datePickerContainer">
              <label for="datePickersEnd">Date limite : </label>
              <DatePicker
                id="datePickersEnd"
                selected={endDate}
                dateFormat="dd/MM/yyyy"
                minDate={startDate}
                onChange={(date) => setEndDate(date)}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="validerDiv">
          <Button
            title="Confirmer"
            btnClass="buttonPrincipal"
            onClick={() => ajouterTache()}
          />
          <Button
            title="Annuler"
            btnClass="buttonSecondaire"
            onClick={() => handleCloseAttribuerTache()}
          />
        </Modal.Footer>
      </Modal>
    );
  }
  function modifierInfosCadre() {
    return (
      <div id="monCompteCard">
        <div></div>
        <div id="monCompteImg">
          <img src={viewedUser.photo_am} alt="Votre photo de profil" />
        </div>

        <div id="monCompteContainer"></div>
        <div id="monCompteInfos">
          <div id="modifInfosProfile">
            <Input
              label="Nom"
              inputClass=""
              containerClass="modifAmInput"
              id="amModifNom"
              fieldType="text"
              parDef={viewedUser.nom}
            />
            <Input
              label="Prénom"
              inputClass=""
              containerClass="modifAmInput"
              id="amModifPrenom"
              fieldType="text"
              parDef={viewedUser.prenom}
            />
            <Input
              label="Numéro de téléphone"
              inputClass=""
              containerClass="modifAmInput"
              id="amModifTlfn"
              fieldType="tel"
              parDef={viewedUser.numero_telephone}
            />
          </div>
          <div className="modifAm">
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
                id="import_am_pdp"
              />
              <label htmlFor="import_am_pdp">
                <Button
                  title="Importer la photo de profile"
                  btnClass="buttonSecondaire footerBtn"
                  variant="contained"
                  color="primary"
                  component="span"
                  onClick={() => {
                    document.querySelector("#import_am_pdp").click();
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

          <div className="modifAm">
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
  function showInfosCadre() {
    return (
      <SkeletonTheme baseColor="#c3c3c3" highlightColor="#dbdbdb">
        <div id="monCompteCard">
          {fireModal()}
          {tacheModal()}
          <div></div>
          <div id="monCompteImg">
            <img src={viewedUser.photo_am} alt="Votre photo de profil" />
          </div>

          <div id="monCompteContainer"></div>
          <div id="monCompteInfos">
            <h2>
              {viewedUser.nom || <Skeleton count="0.15" inline />}{" "}
              {viewedUser.prenom || <Skeleton count="0.15" />}
            </h2>
            <p>Agent de maintenance</p>
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
            <div className="modifAm">
              <Button
                title="Attribuer une tache"
                btnClass="buttonPrincipal"
                onClick={() => handleShowAttribuerTache()}
              />
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
  function pannesCadre() {
    return (
      <>
        <div id="amFiltrageList">
          <DropdownButton
            id="profileAmDropTime"
            title={tachesVueFilter}
            onSelect={(e) => setTachesVueFilter(e)}
          >
            <Dropdown.Item eventKey="Table">Table</Dropdown.Item>
            <Dropdown.Item eventKey="Diagramme">Diagramme</Dropdown.Item>
          </DropdownButton>
          <DropdownButton
            id="profileAmDropVue"
            title={tachesFilter}
            onSelect={(e) => setTachesFilter(e)}
          >
            <Dropdown.Item eventKey="Semaine">Semaine</Dropdown.Item>
            <Dropdown.Item eventKey="Mois">Mois</Dropdown.Item>
            <Dropdown.Item eventKey="Année">Année</Dropdown.Item>
          </DropdownButton>
        </div>
        <div id="amVechiculeList">
          {(tachesVueFilter === "Table" && (
            <div>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Tache</th>
                    <th>Type</th>
                    <th>Date debut</th>
                    <th>Date fin</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => {
                    return (
                      <tr key={task.id_tache}>
                        <td>
                          {task.objet.charAt(0).toUpperCase() +
                            task.objet.slice(1)}
                        </td>
                        <td>
                          {task.type_tache.charAt(0).toUpperCase() +
                            task.type_tache.slice(1)}
                        </td>
                        <td>{task.date_debut.slice(0, 10)}</td>
                        <td>{task.date_fin.slice(0, 10)}</td>
                        <td>
                          {task.etat.charAt(0).toUpperCase() +
                            task.etat.slice(1)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )) || (
            <div id="aGraphsTDiv">
              {(tasksStats.length === 0 && (
                <h3>
                  Aucune tache à afficher{" "}
                  {(tachesFilter === "Semaine" && "cette semaine") ||
                    (tachesFilter === "Mois" && "cette année")}
                  .
                </h3>
              )) || (
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart
                    data={tasksStats}
                    margin={{
                      top: 20,
                      right: 20,
                      bottom: 20,
                      left: 20,
                    }}
                  >
                    {console.log(tasksStats)}
                    <CartesianGrid stroke="#f5f5f5" />
                    <XAxis dataKey="date_debut" scale="band" />
                    <YAxis />
                    <Tooltip
                      wrapperStyle={{
                        backgroundColor: "var(--white)",
                        padding: "1%",
                      }}
                      content={<CustomTooltipTask />}
                    />
                    <Legend
                      formatter={(value, entry, index) => (
                        <span className="text-color-class">
                          Nombre de taches
                        </span>
                      )}
                      wrapperStyle={{
                        backgroundColor: "var(--white)",
                        border: "1px solid var(--mediumGreen)",
                        borderRadius: 3,
                        lineHeight: "40px",
                      }}
                    />
                    <Bar
                      dataKey="nombre"
                      barSize={20}
                      fill="var(--mediumGreen)"
                    />
                    <Line
                      type="monotone"
                      dataKey="nombre"
                      stroke="var(--darkGreen)"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              )}
            </div>
          )}
        </div>
      </>
    );
  }
  function vehiculesCadre() {
    if (flotte.length === 0) {
      return (
        <>
          <div id="filtrageList">
            <div id="filtrageActs">
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
                    search(document.querySelector("#vehiculeSearchField").value)
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
          <h3 id="noEmp">La liste des véhicules est vide.</h3>
        </>
      );
    } else if (listeVehicule.length === 0) {
      return (
        <>
          <div id="filtrageList">
            <div id="filtrageActs">
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
                    search(document.querySelector("#vehiculeSearchField").value)
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
          <h3 id="noEmp">Aucun véhicule ne correspond à votre requête.</h3>
        </>
      );
    } else {
      return (
        <>
          <div id="filtrageList">
            <div id="filtrageActs">
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
                    search(document.querySelector("#vehiculeSearchField").value)
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
          <div id="amVechiculeList">
            {listeVehicule.map((vehicule) => {
              return (
                <CadreVehicule
                  key={vehicule.numero_chassis}
                  id={vehicule.numero_chassis}
                  vehicule={vehicule}
                ></CadreVehicule>
              );
            })}
          </div>
        </>
      );
    }
  }

  return (
    <div id="pageProfileAM">
      <NavBarATC />
      <div id="cadreProfileAm">
        {(modifDiv && modifierInfosCadre()) || showInfosCadre()}
      </div>
      <div id="statsCadre">
        <div id="contentTags">
          <div
            title="Visionner les taches effectuées par l'AM"
            className={(statsFirst && "selectedDiv") || " "}
            onClick={() => {
              if (!statsFirst) {
                setstatsFirst(true);
              }
            }}
          >
            Taches effectuées
          </div>
          <div
            title="Visionner les véhicules gérés par l'AM"
            className={(!statsFirst && "selectedDiv") || " "}
            onClick={() => {
              if (statsFirst) {
                setstatsFirst(false);
              }
            }}
          >
            Liste des véhicules
          </div>
        </div>
        <div id="statsContainer">
          {(statsFirst && pannesCadre()) || vehiculesCadre()}
        </div>
      </div>
    </div>
  );
}

export default ProfileAM;
