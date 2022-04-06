import './stylesheets/PageATC.css';
import {useContext, useEffect} from "react";
import {useNavigate} from 'react-router-dom';
import { UserContext } from "../../Context.js";
import AuthATC from './AuthATC';
import GestionVehicules from './GestionVehicules';
import GestionDemandes from './GestionDemandes';
import GestionComptes from './GestionComptes';
import GestionLocations from './GestionLocations';
import CompteATC from './CompteATC';
import AccueilATC from './AccueilATC';
import {encryptData, decryptData} from "../../crypto";
function PageATC() {
  //container qui redirige les pages du ATC
  const navigate = useNavigate();
  const {user, login, logout, refreshUser} = useContext(UserContext);
  let redirection = false;
  
  function setRedirection (dest)
  {
    // s'il est nécessaire de rediriger : se rediriger vers la destination
    redirection = dest;
  }
  useEffect (()=>{
    if (redirection!==false)
    {
     navigate(redirection, { replace: true })
    }
    
    // test si le ATC est déja authentifié selon les données persistantes
   
    if (decryptData(window.localStorage.getItem("auth"))==="true")
    {
      refreshUser();
    }
    else{
      logout();
    }
  }, []);
  // test si le ATC est authentifié ou pas)))
  if ((!("auth" in window.localStorage))||((decryptData(window.localStorage.getItem("auth") ) !== "true")&&(decryptData(window.localStorage.getItem("auth") ) !== "false")))
  {
    window.localStorage.setItem("auth", encryptData("false" ))
  }
  if (decryptData(window.localStorage.getItem("auth") ) === "false")
    {
      if (window.location.pathname!=="/atc/authentification")
       {
          setRedirection('/atc/authentification');
          return (null);
       }
       else{
         return (<AuthATC/>)
       }
    }
  else{
      //test si l'utilisateur authentifié est bien un ATC
      
      if (decryptData(window.localStorage.getItem("type") ) === "atc")
      {
        switch (window.location.pathname)
        {
          // Les pages de gestion auront la possibilité de faire appel à des composants comme ProfileAM par exemple, et donc il y'aura du routing dans ces pages aussi
          case "/atc/accueil" :
            return (<AccueilATC/>);

          case "/atc/monprofil":
            return (<CompteATC/>);

          case "/atc/gestiondemandes":
          case "/atc/gestiondemandes/inscription":
          case "/atc/gestiondemandes/support":
            return (<GestionDemandes/>);

          case "/atc/gestioncomptes":
          case ((window.location.pathname.match("/atc/gestioncomptes/"))? window.location.pathname : undefined):
            return (<GestionComptes/>);

          case "/atc/gestionvehicules":
          case ((window.location.pathname.match("/atc/gestionvehicules/"))? window.location.pathname : undefined):
            return (<GestionVehicules/>);

          case "/atc/gestionlocations":
          case ((window.location.pathname.match("/atc/gestionlocations/"))? window.location.pathname : undefined):
            return (<GestionLocations/>);

          case "/atc/authentification":
          case "/atc/authentification/":
          case "/atc":
          case "/atc/":
            setRedirection('/atc/accueil');
            return(null);
            
          default :
            setRedirection('/404');
            return (null);
        }
      }
    else{
      setRedirection('/decideur');
      return (null);
  }
  }
 
}

export default PageATC;