import './stylesheets/CompteATC.css';
import {useContext} from "react";
import { UserContext } from "../../Context.js";
import NavBarATC from './../../Composants/NavBarATC';
function CompteATC() {
  //Page du compte de l'ATC
  const {user, loggingOut} = useContext(UserContext);
  return (
    
    <div>
      <NavBarATC />
      CompteATC</div>
  );
}

export default CompteATC;