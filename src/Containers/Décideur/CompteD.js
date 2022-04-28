import './stylesheets/CompteD.css';
import {useContext} from "react";
import { UserContext } from "../../Context.js";
import NavBarD from '../../Composants/NavBarD';import CarteMonCompte from '../../Composants/CarteMonCompte';
function CompteD() {
  //Page du compte du Décideur
  const {user, loggingOut} = useContext(UserContext);
  return (
    
    <div id="monCompteDiv">
      
     <NavBarD/>
     <div id="compteD">
        <CarteMonCompte userInfo={user} typeUser="Décideur" />
      </div>
    </div>
  );
}

export default CompteD;