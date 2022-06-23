import "./stylesheets/AccueilATC.css";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../Context.js";
import { getCarLocations } from "../../firebase";
import Map from "../../Composants/Map";
import http from "../../http.js";
import { decryptData } from "../../crypto";
import { useNavigate } from "react-router-dom";
import NavBarATC from "./../../Composants/NavBarATC";
import ClipLoader from "react-spinners/ClipLoader";
import { useAlert } from "react-alert";
//Page d'accueil de l'ATC
function AccueilATC() {
  const alert = useAlert();
  const navigate = useNavigate();
  const { loading } = useContext(UserContext);
  const style = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };
  let redirection = false;
  const [trajets, setTrajets] = useState([]);
  const [querySnapshot, setSnapshot] = useState([]);

  useEffect(() => {
    //Redirection si URL incorrect / incomplet
    if (redirection !== false) {
      navigate(redirection, { replace: true });
    }
    async function getTrajets() {
      await getCarLocations(setSnapshot);
    }
    getTrajets();
  }, []);

  useEffect(() => {
    http
      .get("/gestionlocations/locations", {
        headers: {
          token: decryptData(window.localStorage.getItem("currTok")),
          id_sender: decryptData(window.localStorage.getItem("curruId")),
        },
      })
      .then((jResponse) => {
        let tr = [];
        querySnapshot.forEach((doc) => {
          let t = doc.data();
          t["id"] = doc.id;
          if (
            jResponse.data.find(
              (location) => doc.id === location.numero_chassis
            ) !== undefined
          ) {
            t["id_louer"] = jResponse.data.find(
              (location) => doc.id === location.numero_chassis
            ).id_louer;
          }
          tr.push(t);
        });
        setTrajets(
          tr.filter((obj) => {
            return obj.disponible === false;
          })
        );
      })
      .catch((err) => {
        setTrajets([]);
        console.log(err);
        alert.error("Une erreur est survenue.");
      });
  }, [querySnapshot]);
  // s'il est nécessaire de rediriger : se rediriger vers la destination
  function setRedirection(dest) {
    redirection = dest;
  }
  function accueil() {
    //fonction qui gere la liste des demandes affichées
    switch (window.location.pathname) {
      // Gestion des Onglets de des vues
      case "/atc/accueil":
        return (
          <div id="accueil">
            <div id="trajetVues">
              <div id="vueChosen">Vue globale</div>
            </div>
            <div id="vueGlobale">
              <h4>Nombre de trajets en cours : {trajets.length}</h4>
              <div>
                <Map heightValue="90vh" widthValue="80vw" markers={trajets} />
              </div>
            </div>
          </div>
        );

      case "/atc/accueil/":
        setRedirection("/atc/accueil");
        break;
      default:
        setRedirection("/404");
        return null;
    }
  }

  return (
    <div>
      <ClipLoader color={"#1B92A4"} loading={loading} css={style} size={50} />
      <NavBarATC />
      {accueil()}
    </div>
  );
}

export default AccueilATC;
