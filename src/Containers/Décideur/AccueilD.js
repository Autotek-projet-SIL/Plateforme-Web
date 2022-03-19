import './stylesheets/AccueilD.css';
import {useContext} from "react";
import { UserContext } from "../../Context.js";
import Button from './../../Composants/Button';
function AccueilD() {
  //Page d'accueil du Décideur
  const {user, loggingOut} = useContext(UserContext);
  return (
    
    <div>AccueilD
      <Button title="testlogout" onClick={()=>loggingOut()}/>
    </div>
  );
}

export default AccueilD;