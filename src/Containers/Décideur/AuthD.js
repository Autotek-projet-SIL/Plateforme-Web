import './stylesheets/AuthD.css';
import {useContext} from "react";
import { UserContext } from "../../Context.js";
import Button from './../../Composants/Button';
function AuthD() {
  //Page d'inscription du Décideur
  const {login} = useContext(UserContext);
  function logging ()
  {
    // Fonction permettant le logging de l'atc dans la plateforme
    let userInfo = {id:1}; //test
    login (userInfo, "decideur");
    window.location.reload();
  }
  return (
    
    <div>AuthD
      <Button title="testlogin" onClick={()=>logging()}/>
    </div>
  );
}

export default AuthD;