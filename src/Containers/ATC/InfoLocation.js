import "./stylesheets/InfoLocation.css";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../Context.js";
import { getCarLocations } from "../../firebase";
import NavBarATC from "./../../Composants/NavBarATC";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import http from "../../http.js";
import { decryptData } from "../../crypto";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import Map, { getReverseGeocodingData } from "../../Composants/Map";

//Page des informations d'une location
function InfoLocation(props) {
  const alert = useAlert();
  const navigate = useNavigate();
  const { loading, setLoading } = useContext(UserContext);
  const [viewedLocation, setViewedLocation] = useState({});
  const [trajet, setTrajet] = useState([]);
  const style = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  const [querySnapshot, setSnapshot] = useState(null);
  const [adrDebut, setDebut] = useState("");
  const [adrDest, setDest] = useState("");

  useEffect(() => {
    console.log(props.locationId)
    http
      .get("/gestionlocations/location/" + props.locationId, {
        headers: {
          token: decryptData(window.localStorage.getItem("currTok")),
          id_sender: decryptData(window.localStorage.getItem("curruId")),
        },
      })
      .then((response) => {
        if (response.data.length === 0) {
          navigate("/404", { replace: true });
        } else {
          async function getAdresses() {
            if (
              response.data[0].latitude_depart !== 0 &&
              response.data[0].longitude_depart !== 0
            ) {
              await getReverseGeocodingData(
                response.data[0].latitude_depart,
                response.data[0].longitude_depart,
                (adresse) => {
                  setDebut(adresse);
                }
              );
            }
            if (
              response.data[0].latitude_arrive !== 0 &&
              response.data[0].longitude_arrive !== 0
            ) {
              await getReverseGeocodingData(
                response.data[0].latitude_arrive,
                response.data[0].longitude_arrive,
                (adresse) => {
                  setDest(adresse);
                }
              );
            }
          }
          async function getTrajet() {
            await getCarLocations(setSnapshot);
          }
          getAdresses();
          if (response.data[0].status_demande_location !== "rejete")
          {

            http
            .get("/flotte/detail_vehicule/" + response.data[0].numero_chassis, {
              headers: {
                token: decryptData(window.localStorage.getItem("currTok")),
                id_sender: decryptData(window.localStorage.getItem("curruId")),
              },
            })
            .then(async (vresponse) => {
              if (response.data[0].en_cours) {
                await getTrajet();
              }
              http
                .get(
                  "/gestionprofils/locataire/" + response.data[0].id_locataire,
                  {
                    headers: {
                      token: decryptData(
                        window.localStorage.getItem("currTok")
                      ),
                      id_sender: decryptData(
                        window.localStorage.getItem("curruId")
                      ),
                    },
                  }
                )
                .then((lresponse) => {
                  let vehicule = vresponse.data[0];
                  delete vehicule["nom"];
                  delete vehicule["prenom"];
                  setViewedLocation({
                    ...response.data[0],
                    ...vehicule,
                    nom: lresponse.data[0]["nom"],
                    prenom: lresponse.data[0]["prenom"],
                  });
                });
            });
          }
          else{
            http
              .get(
                "/gestionprofils/locataire/" + response.data[0].id_locataire,
                {
                  headers: {
                    token: decryptData(
                      window.localStorage.getItem("currTok")
                    ),
                    id_sender: decryptData(
                      window.localStorage.getItem("curruId")
                    ),
                  },
                }
              )
              .then((lresponse) => {
                setViewedLocation({
                  ...response.data[0],
                  nom: lresponse.data[0]["nom"],
                  prenom: lresponse.data[0]["prenom"],
                });
              });
          }
        }
      })
      .catch((err) => {
        alert.error(
          "Une erreur est survenue! Veuillez vérifier votre connexion ou réessayer ultérieurement."
        );
      });
  }, []);

  useEffect(() => {
    if (querySnapshot !== null && viewedLocation.numero_chassis) {
      querySnapshot.forEach((doc) => {
        let t = doc.data();
        t["id"] = doc.id;
        if (t["id"] === viewedLocation.numero_chassis) {
          let tr = [];
          tr.push(t);
          console.log(tr);
          setTrajet(tr);
        }
      });
    }
  }, [querySnapshot]);

  if (viewedLocation.id_louer) {
    let dollarUSLocale = Intl.NumberFormat("en-US");
    return (
      <div id="infoLocationContainer">
        <NavBarATC />
        <div id="infoLocation">
          {(viewedLocation.status_demande_location !== "rejete") &&<div id="loc_imgDiv">
            <img src={viewedLocation.image_vehicule} alt="Photo du véhicule" />
          </div>}
          <div id="loc_infos">
            <h3>{viewedLocation.nom + " " + viewedLocation.prenom}</h3>
            {(viewedLocation.status_demande_location !== "rejete") &&<h4>
              {viewedLocation.modele} #{viewedLocation.numero_chassis}
              <FontAwesomeIcon
                icon="fa-solid fa-magnifying-glass"
                id="loc_v_loc"
                title="Plus d'informations sur le vehicule"
                onClick={() =>
                  navigate("/atc/vehicule/" + viewedLocation.numero_chassis)
                }
              />
            </h4>}

            <hr />
            <div>
              <p className="locationTitle" title="Id de la location">
                <b>ID: </b>
                {viewedLocation.id_louer}
              </p>
              <p
                className="locationTitle"
                title="Date et heure debut de la location"
              >
                <b>Date debut: </b>
                {viewedLocation.date_debut.slice(0, 10)}
              </p>
              <p className="locationTitle" title="Heure debut de la location">
                <b>Heure debut: </b>
                {viewedLocation.heure_debut}
              </p>
              <p className="locationTitle" title="Heure fin de la location">
                <b>Heure fin: </b>
                {viewedLocation.heure_fin}
              </p>
              <p className="locationTitle" title="Tarification de la location">
                <b>Tarification: </b>
                {dollarUSLocale.format(viewedLocation.tarification)}Da
              </p>
              <p className="locationTitle" title="Etat de la location">
                <b>Etat: </b>Location{" "}
                {(viewedLocation.status_demande_location === "rejete" &&
                  "Rejettée") ||
                  (viewedLocation.en_cours && "En cours") ||
                  "Terminée"}
              </p>
              {viewedLocation.status_demande_location !== "rejete" && (
                <p>
                  <a
                    className="locationTitle"
                    href={
                      "https://www.google.dz/maps/place/" +
                      adrDebut.replace(" ", "+")
                    }
                    title="Adresse départ de la location"
                  >
                    <b>De: </b>
                    {adrDebut}
                  </a>
                </p>
              )}
              {viewedLocation.status_demande_location !== "rejete" && (
                <p>
                  <a
                    className="locationTitle"
                    href={
                      "https://www.google.dz/maps/place/" +
                      adrDest.replace(" ", "+")
                    }
                    title="Adresse d'arrivée de la location"
                  >
                    <b>Vers: </b>
                    {adrDest}
                  </a>
                </p>
              )}
            </div>
          </div>
          <div id="loc_more">
            {(viewedLocation.status_demande_location === "rejete" && (
              <div id="loc_rej">
                <h3>Cette location a été Rejettée</h3>
              </div>
            )) ||
              (viewedLocation.en_cours && (
                <div id="loc_map">
                  {console.log(trajet)}
                  <Map heightValue="70vh" widthValue="70vw" markers={trajet} />
                </div>
              )) || (
                <div id="loc_fact">
                  <h2>Facture</h2>
                  <h3>Date: {viewedLocation.date_facture.slice(0, 10)}</h3>
                  <h3>Heure : {viewedLocation.heure}</h3>
                  <h3>TVA: {viewedLocation.tva}%</h3>
                  <h3 id="fact_montant">
                    Montant Total:{" "}
                    {dollarUSLocale.format(viewedLocation.montant)}Da
                  </h3>
                </div>
              )}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div id="infoLocationContainer">
        <NavBarATC />
        <ClipLoader color={"#1B92A4"} loading={loading} css={style} size={50} />
      </div>
    );
  }
}

export default InfoLocation;
