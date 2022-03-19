import './stylesheets/GestionDemandes.css';
import {useContext} from "react";
import { UserContext } from "../../Context.js";
function GestionDemandes() {
  //Page de gestion des demandes (inscription + support) de l'ATC
  const {user, loggingOut} = useContext(UserContext);
  return (
    
    <div>GestionDemandes</div>
  );
}

export default GestionDemandes;