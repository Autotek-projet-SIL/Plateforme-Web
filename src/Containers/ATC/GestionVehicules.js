import './stylesheets/GestionVehicules.css';
import {useContext} from "react";
import { UserContext } from "../../Context.js";
import ProfileVehicule from "./ProfileVehicule";
import NavBarATC from './../../Composants/NavBarATC';
function GestionVehicules() {
  //Page de gestion des véhicules de l'ATC
  const {user, loggingOut} = useContext(UserContext);
  return (
    
    <div>
      <NavBarATC page=""/>
      GestionVehicules</div>
  );
}

export default GestionVehicules;