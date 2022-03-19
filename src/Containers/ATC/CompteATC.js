import './stylesheets/CompteATC.css';
import {useContext} from "react";
import { UserContext } from "../../Context.js";
function CompteATC() {
  //Page du compte de l'ATC
  const {user, loggingOut} = useContext(UserContext);
  return (
    
    <div>CompteATC</div>
  );
}

export default CompteATC;