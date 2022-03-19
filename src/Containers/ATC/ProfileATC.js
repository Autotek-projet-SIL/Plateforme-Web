import './stylesheets/ProfileATC.css';
import {useContext} from "react";
import { UserContext } from "../../Context.js";
function ProfileATC() {
  //Page de gestion des véhicules de l'ATC
  const {user, loggingOut} = useContext(UserContext);
  return (
    
    <div>ProfileATC</div>
  );
}

export default ProfileATC;