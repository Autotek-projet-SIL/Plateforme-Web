import './stylesheets/CompteATC.css';
import {useContext} from "react";
import { UserContext } from "../../Context.js";
import NavBarATC from './../../Composants/NavBarATC';
import CarteMonCompte from '../../Composants/CarteMonCompte';
import ClipLoader from "react-spinners/ClipLoader"
function CompteATC() {
  //Page du compte de l'ATC
  const {loading, user} = useContext(UserContext);
  const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
  return (
    
    <div id="monCompteDiv">
      <NavBarATC />
      <div id="compteATC">
        <CarteMonCompte userInfo={user} typeUser="Administrateur de la tour de controle" />
      </div>
      
    </div>
  );
}

export default CompteATC;