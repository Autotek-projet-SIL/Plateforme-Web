import './stylesheets/ProfileATC.css';
import {useContext} from "react";
import { UserContext } from "../../Context.js";
import NavBarATC from './../../Composants/NavBarATC';
function ProfileATC() {
  //Page de gestion des véhicules de l'ATC
  const {user, loggingOut} = useContext(UserContext);
  return (
    
    <div>
      <NavBarATC page=""/>
      ProfileATC</div>
  );
}

export default ProfileATC;