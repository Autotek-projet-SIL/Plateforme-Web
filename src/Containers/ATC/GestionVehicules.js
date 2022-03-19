import './stylesheets/GestionVehicules.css';
import {useContext} from "react";
import { UserContext } from "../../Context.js";
function GestionVehicules() {
  //Page de gestion des véhicules de l'ATC
  const {user, loggingOut} = useContext(UserContext);
  return (
    
    <div>GestionVehicules</div>
  );
}

export default GestionVehicules;