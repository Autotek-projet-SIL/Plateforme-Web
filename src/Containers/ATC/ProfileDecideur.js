import './stylesheets/ProfileDecideur.css';
import {useContext} from "react";
import { UserContext } from "../../Context.js";
function ProfileDecideur() {
  //Page de gestion des véhicules de l'ATC
  const {user, loggingOut} = useContext(UserContext);
  return (
    
    <div>ProfileDecideur</div>
  );
}

export default ProfileDecideur;