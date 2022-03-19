import './stylesheets/ProfileAM.css';
import {useContext} from "react";
import { UserContext } from "../../Context.js";
function ProfileAM() {
  //Page de gestion des véhicules de l'ATC
  const {user, loggingOut} = useContext(UserContext);
  return (
    
    <div>ProfileAM</div>
  );
}

export default ProfileAM;