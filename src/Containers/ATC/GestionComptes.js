import './stylesheets/GestionComptes.css';
import {useContext} from "react";
import { UserContext } from "../../Context.js";
function GestionComptes() {
  //Page de gestion des comptes de l'ATC
  const {user, login, logout} = useContext(UserContext);
  return (
    
    <div>GestionComptes</div>
  );
}

export default GestionComptes;