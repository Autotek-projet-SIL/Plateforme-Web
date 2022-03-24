import './stylesheets/AccueilATC.css';
import {useContext} from "react";
import { UserContext } from "../../Context.js";
import Button from './../../Composants/Button';
import {useNavigate} from 'react-router-dom';
import NavBarATC from './../../Composants/NavBarATC';
function AccueilATC() {
  //Page d'accueil de l'ATC
  const navigate = useNavigate();
  const {user, loggingOut} = useContext(UserContext);
  
  return (
    <div>
      <NavBarATC />
      AccueilATC
      
      <Button title="testlogout" class="buttonPrincipal" onClick={()=>loggingOut()}/>
    </div>
  );
}

export default AccueilATC;