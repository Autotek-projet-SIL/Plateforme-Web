import './stylesheets/ProfileVehicule.css';
import {useContext} from "react";
import { UserContext } from "../../Context.js";
import NavBarATC from './../../Composants/NavBarATC';
function ProfileVehicule() {
  //Page de gestion des véhicules de l'ATC
  const {user, loggingOut} = useContext(UserContext);
  return (
    
    <div>
      <NavBarATC page=""/>
      ProfileVehicule</div>
  );
}

export default ProfileVehicule;