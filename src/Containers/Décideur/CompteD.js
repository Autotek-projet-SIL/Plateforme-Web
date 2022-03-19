import './stylesheets/CompteD.css';
import {useContext} from "react";
import { UserContext } from "../../Context.js";
function CompteD() {
  //Page du compte du Décideur
  const {user, loggingOut} = useContext(UserContext);
  return (
    
    <div>CompteD</div>
  );
}

export default CompteD;