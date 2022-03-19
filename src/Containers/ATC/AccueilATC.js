import './stylesheets/AccueilATC.css';
import {useContext} from "react";
import { UserContext } from "../../Context.js";
import Button from './../../Composants/Button';
function AccueilATC() {
  //Page d'accueil de l'ATC
  const {user, loggingOut} = useContext(UserContext);
  return (
    <div>AccueilATC
      
      <Button title="testlogout" onClick={()=>loggingOut()}/>
    </div>
  );
}

export default AccueilATC;