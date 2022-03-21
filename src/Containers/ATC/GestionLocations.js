import './stylesheets/GestionLocations.css';
import {useContext} from "react";
import { UserContext } from "../../Context.js";
import InfoLocation from "./InfoLocation";
import NavBarATC from './../../Composants/NavBarATC';
function GestionLocations() {
  //Page de gestion des demandes (inscription + support) de l'ATC
  const {user, loggingOut} = useContext(UserContext);
  return (
    
    <div>
      <NavBarATC page=""/>
      GestionLocations</div>
  );
}

export default GestionLocations;