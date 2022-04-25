import './stylesheets/CompteD.css';
import {useContext} from "react";
import { UserContext } from "../../Context.js";
import NavBarD from '../../Composants/NavBarD';
function CompteD() {
  //Page du compte du Décideur
  const {user, loggingOut} = useContext(UserContext);
  return (
    
    <div>
      
     <NavBarD/>
    </div>
  );
}

export default CompteD;