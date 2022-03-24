import './stylesheets/ProfileDecideur.css';
import {useContext} from "react";
import { UserContext } from "../../Context.js";
import NavBarATC from './../../Composants/NavBarATC';
function ProfileDecideur() {
  //Page de gestion des véhicules de l'ATC
  const {user, loggingOut} = useContext(UserContext);
  return (
    
    <div>
      <NavBarATC />
      ProfileDecideur</div>
  );
}

export default ProfileDecideur;