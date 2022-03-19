import './stylesheets/ProfileVehicule.css';
import {useContext} from "react";
import { UserContext } from "../../Context.js";
function ProfileVehicule() {
  //Page de gestion des véhicules de l'ATC
  const {user, loggingOut} = useContext(UserContext);
  return (
    
    <div>ProfileVehicule</div>
  );
}

export default ProfileVehicule;