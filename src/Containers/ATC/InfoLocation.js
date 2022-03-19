import './stylesheets/InfoLocation.css';
import {useContext} from "react";
import { UserContext } from "../../Context.js";
function InfoLocation() {
  //Page de gestion des véhicules de l'ATC
  const {user, loggingOut} = useContext(UserContext);
  return (
    
    <div>InfoLocation</div>
  );
}

export default InfoLocation;