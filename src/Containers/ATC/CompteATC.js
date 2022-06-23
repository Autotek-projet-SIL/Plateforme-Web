import "./stylesheets/CompteATC.css";
import { useContext } from "react";
import { UserContext } from "../../Context.js";
import NavBarATC from "./../../Composants/NavBarATC";
import CarteMonCompte from "../../Composants/CarteMonCompte";
//Page du compte de l'ATC connecte
function CompteATC() {
  const {user } = useContext(UserContext);
  
  return (
    <div id="monCompteDiv">
      <NavBarATC />
      <div id="compteATC">
        <CarteMonCompte
          userInfo={user}
          typeUser="Administrateur de la tour de controle"
        />
      </div>
    </div>
  );
}

export default CompteATC;
