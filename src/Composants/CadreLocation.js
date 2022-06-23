import "./stylesheets/CadreLocation.css";
import { useEffect, useState } from "react";
import { getReverseGeocodingData } from "./Map";
// Composant cadre d'une location
function CadreLocation(props) {
  const [adrDebut, setDebut] = useState("");
  const [adrDest, setDest] = useState("");

  useEffect(() => {
    async function getAdresses() {
      await getReverseGeocodingData(
        props.location.latitude_depart,
        props.location.longitude_depart,
        (adresse) => {
          setDebut(adresse);
        }
      );
      await getReverseGeocodingData(
        props.location.latitude_arrive,
        props.location.longitude_arrive,
        (adresse) => {
          setDest(adresse);
        }
      );
    }
    getAdresses();
  }, []);

  return (
    <div
      className={
        "cadreLocation " +
        ((props.location.status_demande_location === "rejete" &&
          "cadreLocRej") ||
          (!props.location.en_cours && "cadreLocFin"))
      }
    >
      <p className="locationTitle" title="Id de la location">
        {"ID: " + props.location.id_louer}
      </p>
      <p className="locationTitle" title="Etat de la location">
        {"Etat: " +
          ((props.location.status_demande_location === "rejete" &&
            "Rejettée") ||
            (props.location.en_cours && "En cours") ||
            (!props.location.en_cours && "Terminée"))}
      </p>
      {adrDebut !== "" && (
        <a
          className="locationTitle"
          href={
            "https://www.google.dz/maps/place/" + adrDebut.replace(" ", "+")
          }
          title="Adresse départ de la location"
        >
          De: {adrDebut}
        </a>
      )}
      {adrDest !== "" && (
        <a
          className="locationTitle"
          href={"https://www.google.dz/maps/place/" + adrDest.replace(" ", "+")}
          title="Adresse d'arrivée de la location"
        >
          Vers: {adrDest}
        </a>
      )}
      <p className="locationTitle" title="Locataire de la location">
        {"Locataire: " + props.location.nom + " " + props.location.prenom}
      </p>
      <a
        title="Visionner Plus d'informations sur la location"
        href={"/atc/gestionlocations/" + props.id}
      >
        Plus d'informations
      </a>
    </div>
  );
}
export default CadreLocation;
