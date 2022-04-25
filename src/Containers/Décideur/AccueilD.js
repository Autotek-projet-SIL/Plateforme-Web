import './stylesheets/AccueilD.css';
import {useContext} from "react";
import { UserContext } from "../../Context.js";
import Button from './../../Composants/Button';
import NavBarD from '../../Composants/NavBarD';
function AccueilD() {
  //Page d'accueil du Décideur
  const {user, loggingOut} = useContext(UserContext);
  return (
    
    <div>
     <NavBarD/>
    </div>
  );
}

export default AccueilD;