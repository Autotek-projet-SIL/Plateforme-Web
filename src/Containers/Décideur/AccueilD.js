import "./stylesheets/AccueilD.css";
import { useEffect, useState } from "react";
import NavBarD from "../../Composants/NavBarD";
import http from "../../http.js";
import { decryptData } from "../../crypto";
import { useAlert } from "react-alert";
import CarteStat from "../../Composants/CarteStat";
import { Dropdown, DropdownButton } from "react-bootstrap";
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

//Page d'accueil du Décideur
function AccueilD() {
  const [viewedGraph, setViewedG] = useState(1);
  const [locsAcc, setLocAcc] = useState([]);
  const [locsRej, setLocRej] = useState([]);
  const [inscr, setInscr] = useState([]);
  const [factures, setFactures] = useState([]);
  const [locs, setLocs] = useState([]);
  const [regions, setRegions] = useState([]);

  const [locsAccFilter, setLocAccFilter] = useState("Mois");
  const [locsRejFilter, setLocRejFilter] = useState("Mois");
  const [inscrFilter, setInscrFilter] = useState("Mois");
  const [facturesFilterT, setFacturesFilterT] = useState("Mois");
  const [facturesFilterR, setFacturesFilterR] = useState("Toutes les regions");
  const [locsFilterT, setLocsFilterT] = useState("Mois");
  const [locsFilterR, setLocsFilterR] = useState("Toutes les regions");

  const [locsAccNbrViewed, setLocAccNbrViewed] = useState(0);
  const [locsRejNbrViewed, setLocRejNbrViewed] = useState(0);
  const [inscrNbrViewed, setInscrNbrViewed] = useState(0);
  const [facturesViewed, setFacturesViewed] = useState([]);
  const [locsViewed, setLocsViewed] = useState([]);
  const alert = useAlert();

  useEffect(() => {
    //Regions
    http
      .get("/gestionlocations/regions", {
        headers: {
          token: decryptData(window.localStorage.getItem("currTok")),
          id_sender: decryptData(window.localStorage.getItem("curruId")),
        },
      })
      .then((response) => {
        setRegions(response.data);
      })
      .catch((error) => {
        console.log(error);
        alert.error(
          "Une erreur est survenue. Veuillez reessayer ulterieurement"
        );
      });
    //locations acceptees
    http
      .get("/statistiques/getLocationsAcceptes", {
        headers: {
          token: decryptData(window.localStorage.getItem("currTok")),
          id_sender: decryptData(window.localStorage.getItem("curruId")),
        },
      })
      .then((response) => {
        setLocAcc(response.data);
      })
      .catch((error) => {
        console.log(error);
        alert.error(
          "Une erreur est survenue. Veuillez reessayer ulterieurement"
        );
      });
    //locations rejettees
    http
      .get("/statistiques/getLocationsRejetes", {
        headers: {
          token: decryptData(window.localStorage.getItem("currTok")),
          id_sender: decryptData(window.localStorage.getItem("curruId")),
        },
      })
      .then((response) => {
        setLocRej(response.data);
      })
      .catch((error) => {
        console.log(error);
        alert.error(
          "Une erreur est survenue. Veuillez reessayer ulterieurement"
        );
      });
    //nbr inscriptions
    http
      .get("/statistiques/getDemandeInscription", {
        headers: {
          token: decryptData(window.localStorage.getItem("currTok")),
          id_sender: decryptData(window.localStorage.getItem("curruId")),
        },
      })
      .then((response) => {
        setInscr(response.data);
      })
      .catch((error) => {
        console.log(error);
        alert.error(
          "Une erreur est survenue. Veuillez reessayer ulterieurement"
        );
      });
    //taux utilisation
    http
      .get("/statistiques/get_locations", {
        headers: {
          token: decryptData(window.localStorage.getItem("currTok")),
          id_sender: decryptData(window.localStorage.getItem("curruId")),
        },
      })
      .then((response) => {
        setLocs(response.data);
      })
      .catch((error) => {
        console.log(error);
        alert.error(
          "Une erreur est survenue. Veuillez reessayer ulterieurement"
        );
      });
    //rapport de revenue
    http
      .get("/statistiques/getFactures", {
        headers: {
          token: decryptData(window.localStorage.getItem("currTok")),
          id_sender: decryptData(window.localStorage.getItem("curruId")),
        },
      })
      .then((response) => {
        setFactures(response.data);
      })
      .catch((error) => {
        console.log(error);
        alert.error(
          "Une erreur est survenue. Veuillez reessayer ulterieurement"
        );
      });
  }, []);
  useEffect(() => {
    if (locsAcc.length !== 0) {
      let today = new Date();
      switch (locsAccFilter) {
        case "Semaine":
          setLocAccNbrViewed(
            locsAcc.filter((e) => {
              return (
                formatGetYear(e.date_debut) === today.getFullYear() &&
                formatGetMonth(e.date_debut) === today.getMonth() + 1 &&
                today.getDate() - formatGetDay(e.date_debut) < 7
              );
            }).length
          );
          break;
        case "Mois":
          setLocAccNbrViewed(
            locsAcc.filter((e) => {
              return (
                formatGetYear(e.date_debut) === today.getFullYear() &&
                formatGetMonth(e.date_debut) === today.getMonth() + 1
              );
            }).length
          );
          break;
        default:
          setLocAccNbrViewed(
            locsAcc.filter((e) => {
              return formatGetYear(e.date_debut) === today.getFullYear();
            }).length
          );
          break;
      }
    }
  }, [locsAccFilter, locsAcc]);
  useEffect(() => {
    if (locsRej.length !== 0) {
      let today = new Date();
      switch (locsRejFilter) {
        case "Semaine":
          setLocRejNbrViewed(
            locsRej.filter((e) => {
              return (
                formatGetYear(e.date_debut) === today.getFullYear() &&
                formatGetMonth(e.date_debut) === today.getMonth() + 1 &&
                today.getDate() - formatGetDay(e.date_debut) < 7
              );
            }).length
          );
          break;
        case "Mois":
          setLocRejNbrViewed(
            locsRej.filter((e) => {
              return (
                formatGetYear(e.date_debut) === today.getFullYear() &&
                formatGetMonth(e.date_debut) === today.getMonth() + 1
              );
            }).length
          );
          break;
        default:
          setLocRejNbrViewed(
            locsRej.filter((e) => {
              return formatGetYear(e.date_debut) === today.getFullYear();
            }).length
          );
          break;
      }
    }
  }, [locsRejFilter, locsRej]);
  useEffect(() => {
    if (inscr.length !== 0) {
      let today = new Date();
      switch (inscrFilter) {
        case "Semaine":
          setInscrNbrViewed(
            inscr.filter((e) => {
              return (
                formatGetYear(e.date_inscription) === today.getFullYear() &&
                formatGetMonth(e.date_inscription) === today.getMonth() + 1 &&
                today.getDate() - formatGetDay(e.date_inscription) < 7
              );
            }).length
          );
          break;
        case "Mois":
          setInscrNbrViewed(
            inscr.filter((e) => {
              return (
                formatGetYear(e.date_inscription) === today.getFullYear() &&
                formatGetMonth(e.date_inscription) === today.getMonth() + 1
              );
            }).length
          );
          break;
        default:
          setInscrNbrViewed(
            inscr.filter((e) => {
              return formatGetYear(e.date_inscription) === today.getFullYear();
            }).length
          );
          break;
      }
    }
  }, [inscrFilter, inscr]);
  useEffect(() => {
    if (factures.length !== 0) {
      let today = new Date();
      let dates;
      let facts;
      switch (facturesFilterR) {
        case "Toutes les regions":
          facts = factures;
          break;
        default:
          facts = factures.filter((e) => {
            return e.region === facturesFilterR;
          });
      }
      switch (facturesFilterT) {
        case "Semaine":
          dates = [
            ...new Set(
              facts.map(
                (item) =>
                  formatGetYear(item.date_facture) +
                  "-" +
                  (formatGetMonth(item.date_facture).toString().length === 1
                    ? "0" + formatGetMonth(item.date_facture)
                    : formatGetMonth(item.date_facture)) +
                  "-" +
                  (formatGetDay(item.date_facture).toString().length === 1
                    ? "0" + formatGetDay(item.date_facture)
                    : formatGetDay(item.date_facture))
              )
            ),
          ];

          facts = dates.map((e) => {
            return {
              date_facture: e,
              montant: facts.reduce(
                (acc, cur) =>
                  formatGetYear(cur.date_facture) === formatGetYear(e) &&
                  formatGetMonth(cur.date_facture) === formatGetMonth(e) &&
                  formatGetDay(cur.date_facture) === formatGetDay(e)
                    ? acc + cur.montant
                    : acc,
                0
              ),
            };
          });

          facts = facts.sort((a, b) => {
            if (a.date_facture < b.date_facture) {
              return -1;
            }
            if (a.date_facture > b.date_facture) {
              return 1;
            }
            return 0;
          });
          setFacturesViewed(
            facts.filter((e) => {
              return (
                formatGetYear(e.date_facture) === today.getFullYear() &&
                formatGetMonth(e.date_facture) === today.getMonth() + 1 &&
                today.getDate() - formatGetDay(e.date_facture) < 7
              );
            })
          );
          break;
        case "Mois":
          dates = [
            ...new Set(
              facts.map(
                (item) =>
                  formatGetYear(item.date_facture) +
                  "-" +
                  (formatGetMonth(item.date_facture).toString().length === 1
                    ? "0" + formatGetMonth(item.date_facture)
                    : formatGetMonth(item.date_facture))
              )
            ),
          ];
          facts = dates.map((e) => {
            return {
              date_facture: e,
              montant: facts.reduce(
                (acc, cur) =>
                  formatGetYear(cur.date_facture) === formatGetYear(e) &&
                  formatGetMonth(cur.date_facture) === formatGetMonth(e)
                    ? acc + cur.montant
                    : acc,
                0
              ),
            };
          });

          facts = facts.sort((a, b) => {
            if (a.date_facture < b.date_facture) {
              return -1;
            }
            if (a.date_facture > b.date_facture) {
              return 1;
            }
            return 0;
          });
          setFacturesViewed(
            facts.filter((e) => {
              return formatGetYear(e.date_facture) === today.getFullYear();
            })
          );
          break;
        default:
          dates = [
            ...new Set(facts.map((item) => formatGetYear(item.date_facture))),
          ];
          facts = dates.map((e) => {
            return {
              date_facture: e,
              montant: facts.reduce(
                (acc, cur) =>
                  formatGetYear(cur.date_facture) === e
                    ? acc + cur.montant
                    : acc,
                0
              ),
            };
          });

          facts = facts.sort((a, b) => {
            if (a.date_facture < b.date_facture) {
              return -1;
            }
            if (a.date_facture > b.date_facture) {
              return 1;
            }
            return 0;
          });
          setFacturesViewed(facts);
          break;
      }
    }
  }, [facturesFilterT, facturesFilterR, factures]);
  useEffect(() => {
    if (locs.length !== 0) {
      let today = new Date();
      let dates;
      let locations;
      switch (locsFilterR) {
        case "Toutes les regions":
          locations = locs;
          break;
        default:
          locations = locs.filter((e) => {
            return e.region === locsFilterR;
          });
      }
      switch (locsFilterT) {
        case "Semaine":
          dates = [
            ...new Set(
              locations.map(
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
          locations = dates.map((e) => {
            return {
              date_debut: e,
              nombre: locations.reduce(
                (acc, cur) =>
                  formatGetYear(cur.date_debut) === formatGetYear(e) &&
                  formatGetMonth(cur.date_debut) === formatGetMonth(e) &&
                  formatGetDay(cur.date_debut) === formatGetDay(e)
                    ? ++acc
                    : acc,
                0
              ),
            };
          });
          locations = locations.sort((a, b) => {
            if (a.date_debut < b.date_debut) {
              return -1;
            }
            if (a.date_debut > b.date_debut) {
              return 1;
            }
            return 0;
          });
          setLocsViewed(
            locations.filter((e) => {
              return (
                formatGetYear(e.date_debut) === today.getFullYear() &&
                formatGetMonth(e.date_debut) === today.getMonth() + 1 &&
                today.getDate() - formatGetDay(e.date_debut) < 7
              );
            })
          );
          break;
        case "Mois":
          dates = [
            ...new Set(
              locations.map(
                (item) =>
                  formatGetYear(item.date_debut) +
                  "-" +
                  (formatGetMonth(item.date_debut).toString().length === 1
                    ? "0" + formatGetMonth(item.date_debut)
                    : formatGetMonth(item.date_debut))
              )
            ),
          ];
          locations = dates.map((e) => {
            return {
              date_debut: e,
              nombre: locations.reduce(
                (acc, cur) =>
                  formatGetYear(cur.date_debut) === formatGetYear(e) &&
                  formatGetMonth(cur.date_debut) === formatGetMonth(e)
                    ? ++acc
                    : acc,
                0
              ),
            };
          });

          locations = locations.sort((a, b) => {
            if (a.date_debut < b.date_debut) {
              return -1;
            }
            if (a.date_debut > b.date_debut) {
              return 1;
            }
            return 0;
          });
          setLocsViewed(
            locations.filter((e) => {
              return formatGetYear(e.date_debut) === today.getFullYear();
            })
          );
          break;
        default:
          dates = [
            ...new Set(locations.map((item) => formatGetYear(item.date_debut))),
          ];

          locations = dates.map((e) => {
            return {
              date_debut: e,
              nombre: locations.reduce(
                (acc, cur) =>
                  formatGetYear(cur.date_debut) === e ? ++acc : acc,
                0
              ),
            };
          });

          locations = locations.sort((a, b) => {
            if (a.date_debut < b.date_debut) {
              return -1;
            }
            if (a.date_debut > b.date_debut) {
              return 1;
            }
            return 0;
          });
          setLocsViewed(locations);
          break;
      }
    }
  }, [locsFilterT, locsFilterR, locs]);

  function formatGetDay(date) {
    return Number(date.substr(8, 2));
  }
  function formatGetMonth(date) {
    return Number(date.substr(5, 2));
  }
  function formatGetYear(date) {
    return Number(date.substr(0, 4));
  }

  function CustomTooltipLoc({ payload, label, active }) {
    if (active && payload !== null && label !== null) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`Locations effectuées : ${payload[0].value} `}</p>
          <p className="info">{`Date : ${label}`}</p>
        </div>
      );
    }
    return null;
  }
  function CustomTooltipFact({ payload, label, active }) {
    let dollarUSLocale = Intl.NumberFormat("en-US");
    if (active && payload !== null && label !== null) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`Revenue : ${dollarUSLocale.format(
            payload[0].value
          )}Da`}</p>
          <p className="info">{`Date : ${label}`}</p>
        </div>
      );
    }
    return null;
  }
  return (
    <div id="accueilDContainer">
      <NavBarD />
      <div id="accueilD">
        <div id="accueilDCartes">
          <CarteStat
            title="Nombre de locations acceptées"
            data={locsAccNbrViewed}
            listeFiltre={["Semaine", "Mois", "Année"]}
            selectedFilter={locsAccFilter}
            callback={setLocAccFilter}
          />
          <CarteStat
            title="Nombre de locations rejettées"
            data={locsRejNbrViewed}
            listeFiltre={["Semaine", "Mois", "Année"]}
            selectedFilter={locsRejFilter}
            callback={setLocRejFilter}
          />
          <CarteStat
            title="Nombre d'inscriptions"
            data={inscrNbrViewed}
            listeFiltre={["Semaine", "Mois", "Année"]}
            selectedFilter={inscrFilter}
            callback={setInscrFilter}
          />
        </div>
        <div id="accueilDGraphs">
          <div id="dGraphsVues">
            <div
              id={(viewedGraph === 1 && "vueChosen") || "vueNotChosen"}
              onClick={
                (viewedGraph === 2 &&
                  (() => {
                    setViewedG(1);
                  })) ||
                (() => {
                  return null;
                })
              }
            >
              Taux d'utilisation
            </div>
            <div
              id={(viewedGraph === 2 && "vueChosen") || "vueNotChosen"}
              onClick={
                (viewedGraph === 1 &&
                  (() => {
                    setViewedG(2);
                  })) ||
                (() => {
                  return null;
                })
              }
            >
              Rapports de revenue
            </div>
          </div>
          {(viewedGraph === 1 && (
            <div id="dGraphsT">
              <div id="filtrageList">
                <div id="filtrageActs">
                  <DropdownButton
                    id="dGraphDropT"
                    title={locsFilterT}
                    onSelect={(e) => setLocsFilterT(e)}
                  >
                    <Dropdown.Item eventKey="Semaine">Semaine</Dropdown.Item>
                    <Dropdown.Item eventKey="Mois">Mois</Dropdown.Item>
                    <Dropdown.Item eventKey="Année">Année</Dropdown.Item>
                  </DropdownButton>
                  <DropdownButton
                    id="dGraphDropR"
                    title={locsFilterR}
                    onSelect={(e) => setLocsFilterR(e)}
                  >
                    <Dropdown.Item eventKey="Toutes les regions">
                      Toutes les regions
                    </Dropdown.Item>
                    {regions.map((region) => {
                      return (
                        <Dropdown.Item
                          key={region.region}
                          eventKey={region.region}
                        >
                          {region.region}
                        </Dropdown.Item>
                      );
                    })}
                  </DropdownButton>
                </div>
              </div>
              <div id="dGraphsTDiv">
                {(locsViewed.length === 0 && (
                  <h3>
                    Aucune activité à afficher{" "}
                    {(locsFilterT === "Semaine" && "cette semaine") ||
                      (locsFilterT === "Mois" && "cette année")}
                    .
                  </h3>
                )) || (
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={locsViewed}
                      margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20,
                      }}
                    >
                      <CartesianGrid stroke="#f5f5f5" />
                      <XAxis dataKey="date_debut" scale="band" />
                      <YAxis />
                      <Tooltip
                        wrapperStyle={{
                          backgroundColor: "var(--white)",
                          padding: "1%",
                        }}
                        content={<CustomTooltipLoc />}
                      />
                      <Legend
                        formatter={(value, entry, index) => (
                          <span className="text-color-class">
                            Nombre de locations
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
            </div>
          )) || (
            <div id="dGraphsR">
              <div id="filtrageList">
                <div id="filtrageActs">
                  <DropdownButton
                    id="dGraphDropT"
                    title={facturesFilterT}
                    onSelect={(e) => setFacturesFilterT(e)}
                  >
                    <Dropdown.Item eventKey="Semaine">Semaine</Dropdown.Item>
                    <Dropdown.Item eventKey="Mois">Mois</Dropdown.Item>
                    <Dropdown.Item eventKey="Année">Année</Dropdown.Item>
                  </DropdownButton>
                  <DropdownButton
                    id="dGraphDropR"
                    title={facturesFilterR}
                    onSelect={(e) => setFacturesFilterR(e)}
                  >
                    <Dropdown.Item eventKey="Toutes les regions">
                      Toutes les regions
                    </Dropdown.Item>
                    {regions.map((region) => {
                      return (
                        <Dropdown.Item
                          key={region.region}
                          eventKey={region.region}
                        >
                          {region.region}
                        </Dropdown.Item>
                      );
                    })}
                  </DropdownButton>
                </div>
              </div>
              <div id="dGraphsRDiv">
                {(facturesViewed.length === 0 && (
                  <h3>
                    Aucune activité à afficher{" "}
                    {(facturesFilterT === "Semaine" && "cette semaine") ||
                      (facturesFilterT === "Mois" && "cette année")}
                    .
                  </h3>
                )) || (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={facturesViewed}
                      margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20,
                      }}
                    >
                      <defs>
                        <linearGradient
                          id="colorUvFact"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="10%"
                            stopColor="var(--mediumGreen)"
                            stopOpacity={1}
                          />
                          <stop
                            offset="90%"
                            stopColor="var(--mediumGreenLow)"
                            stopOpacity={0.3}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#f5f5f5" />
                      <XAxis dataKey="date_facture" />
                      <YAxis />
                      <Tooltip
                        wrapperStyle={{
                          backgroundColor: "var(--white)",
                          padding: "1%",
                        }}
                        content={<CustomTooltipFact />}
                      />
                      <Legend
                        formatter={(value, entry, index) => (
                          <span className="text-color-class">Revenue</span>
                        )}
                        wrapperStyle={{
                          backgroundColor: "var(--white)",
                          border: "1px solid var(--mediumGreen)",
                          borderRadius: 3,
                          lineHeight: "40px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="montant"
                        stroke="var(--mediumGreen)"
                        fill="url(#colorUvFact)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AccueilD;
