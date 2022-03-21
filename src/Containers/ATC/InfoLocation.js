import './stylesheets/InfoLocation.css';
import {useContext} from "react";
import { UserContext } from "../../Context.js";
import NavBarATC from './../../Composants/NavBarATC';
function InfoLocation() {
  //Page de gestion des véhicules de l'ATC
  const {user, loggingOut} = useContext(UserContext);
  return (
    
    <div>
      <NavBarATC page=""/>
      InfoLocation</div>
  );
}

export default InfoLocation;