import './stylesheets/GestionComptes.css';
import {useContext} from "react";
import { UserContext } from "../../Context.js";
import ProfileATC from "./ProfileATC";
import ProfileAM from "./ProfileAM";
import ProfileDecideur from "./ProfileDecideur";
import NavBarATC from './../../Composants/NavBarATC';
function GestionComptes() {
  //Page de gestion des comptes de l'ATC
  const {user, login, logout} = useContext(UserContext);
  return (
    
    <div>
      <NavBarATC page=""/>
      GestionComptes</div>
  );
}

export default GestionComptes;