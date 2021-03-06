import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Context.js";
import AuthATC from "./AuthATC";
import GestionVehicules from "./GestionVehicules";
import GestionDemandes from "./GestionDemandes";
import GestionComptes from "./GestionComptes";
import GestionLocations from "./GestionLocations";
import CompteATC from "./CompteATC";
import AccueilATC from "./AccueilATC";
import ProfileAM from "./ProfileAM";
import ProfileATC from "./ProfileATC";
import ProfileDecideur from "./ProfileDecideur";
import ProfileVehicule from "./ProfileVehicule";
import InfoLocation from "./InfoLocation";
import { encryptData, decryptData } from "../../crypto";

function PageATC() {
  //contenaire qui redirige les pages du ATC
  const navigate = useNavigate();
  const { logout, refreshUser } = useContext(UserContext);
  let redirection = false;

  function setRedirection(dest) {
    // s'il est nécessaire de rediriger : se rediriger vers la destination
    redirection = dest;
  }
  useEffect(() => {
    if (redirection !== false) {
      navigate(redirection, { replace: true });
    }

    // test si le ATC est déja authentifié selon les données persistantes

    if (decryptData(window.localStorage.getItem("auth")) === "true") {
      if (decryptData(window.localStorage.getItem("type")) === "atc") {
        refreshUser("atc");
      }
    } else {
      logout();
    }
  }, []);

  // test si le ATC est authentifié ou pas
  if (
    !("auth" in window.localStorage) ||
    (decryptData(window.localStorage.getItem("auth")) !== "true" &&
      decryptData(window.localStorage.getItem("auth")) !== "false")
  ) {
    window.localStorage.setItem("auth", encryptData("false"));
  }
  if (decryptData(window.localStorage.getItem("auth")) === "false") {
    if (window.location.pathname !== "/atc/authentification") {
      setRedirection("/atc/authentification");
      return null;
    } else {
      return <AuthATC />;
    }
  } else {
    //test si l'utilisateur authentifié est bien un ATC

    if (decryptData(window.localStorage.getItem("type")) === "atc") {
      let id = 0;
      switch (window.location.pathname) {
        // Les pages de gestion auront la possibilité de faire appel à des composants comme ProfileAM par exemple, et donc il y'aura du routing dans ces pages aussi
        case "/atc/accueil":
        case "/atc/accueil/":
          return <AccueilATC />;

        case "/atc/monprofil":
          return <CompteATC />;

        case "/atc/gestiondemandes":
        case "/atc/gestiondemandes/inscription":
          return <GestionDemandes onglet='insc' />;

          case "/atc/gestiondemandes/support":
            return <GestionDemandes onglet='supp' />;
        case "/atc/gestioncomptes":
        case "/atc/gestioncomptes/":
          return <GestionComptes />;

        case window.location.pathname.match("/atc/profil/atc/")
          ? window.location.pathname
          : undefined:
          //Récupérer l'id atc encrypté
          id = window.location.pathname.replace("/atc/profil/atc/", "");
          return <ProfileATC userId={id} />;

        case window.location.pathname.match("/atc/profil/am/")
          ? window.location.pathname
          : undefined:
          //Récupérer l'id am encrypté
          id = window.location.pathname.replace("/atc/profil/am/", "");
          return <ProfileAM userId={id} />;

        case window.location.pathname.match("/atc/profil/decideur/")
          ? window.location.pathname
          : undefined:
          //Récupérer l'id decideur encrypté
          id = window.location.pathname.replace("/atc/profil/decideur/", "");
          return <ProfileDecideur userId={id} />;

        case "/atc/gestionvehicules":
          return <GestionVehicules />;

        case window.location.pathname.match("/atc/vehicule/")
          ? window.location.pathname
          : undefined:
          //Récupérer l'id de la voiture encrypté
          id = window.location.pathname.replace("/atc/vehicule/", "");
          return <ProfileVehicule carId={id} />;

        case "/atc/gestionlocations":
          return <GestionLocations />;

        case window.location.pathname.match("/atc/gestionlocations/")
          ? window.location.pathname
          : undefined:
          id = window.location.pathname.replace("/atc/gestionlocations/", "");
          return <InfoLocation locationId={id} />;
        case "/atc/authentification":
        case "/atc/authentification/":
        case "/atc":
        case "/atc/":
          setRedirection("/atc/accueil");
          return null;

        default:
          setRedirection("/404");
          return null;
      }
    } else {
      setRedirection("/decideur");
      return null;
    }
  }
}

export default PageATC;
