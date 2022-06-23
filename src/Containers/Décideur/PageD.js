import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Context.js";
import AuthD from "./AuthD";
import CompteD from "./CompteD";
import AccueilD from "./AccueilD";
import { encryptData, decryptData } from "../../crypto";

// Contenaire qui redirige les pages du Décideur
function PageD() {
  let redirection = false;
  const navigate = useNavigate();
  const { secretKey, user, login, logout, refreshUser } =
    useContext(UserContext);
  function setRedirection(dest) {
    // redirection
    redirection = dest;
  }

  useEffect(() => {
    if (redirection !== false) {
      // s'il est nécessaire de rediriger : se rediriger vers la destination
      navigate(redirection, { replace: true });
    }

    // test si le décideur est déja authentifié selon les données persistantes
    if (decryptData(window.localStorage.getItem("auth")) === "true") {
      if (decryptData(window.localStorage.getItem("type")) === "decideur") {
        refreshUser("decideur");
      }
    } else {
      logout();
    }
  }, []);

  if (
    !("auth" in window.localStorage) ||
    (decryptData(window.localStorage.getItem("auth")) !== "true" &&
      decryptData(window.localStorage.getItem("auth")) !== "false")
  ) {
    window.localStorage.setItem("auth", encryptData("false"));
  }
  // test si le décideur est authentifié ou pas
  if (decryptData(window.localStorage.getItem("auth")) === "false") {
    if (window.location.pathname !== "/decideur/authentification") {
      setRedirection("/decideur/authentification");
      return null;
    } else {
      return <AuthD />;
    }
  } else {
    //test si l'utilisateur authentifié est bien un décideur
    if (decryptData(window.localStorage.getItem("type")) === "decideur") {
      switch (window.location.pathname) {
        case "/decideur/accueil":
          return <AccueilD />;
        case "/decideur/monprofil":
          return <CompteD />;
        case "/decideur/authentification":
        case "/decideur/authentification/":
        case "/decideur":
        case "/decideur/":
          setRedirection("/decideur/accueil");
          return null;
        default:
          setRedirection("/404");
          return null;
      }
    } else {
      setRedirection("/atc");
      return null;
    }
  }
}

export default PageD;
