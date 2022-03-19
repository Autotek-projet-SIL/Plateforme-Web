import './stylesheets/AuthATC.css';
import {useContext} from "react";
import { UserContext } from "../../Context.js";
import Button from './../../Composants/Button';
function AuthATC() {
  //Page d'authentification  de l'ATC
  const {login} = useContext(UserContext);
  function logging ()
  {
    // Fonction permettant le logging de l'atc dans la plateforme
    let userInfo = {id:1}; //test
    login (userInfo, "atc");
    window.location.reload();
  }
  return (
    
    <div>AuthATC
      <Button title="testlogin" onClick={()=>logging()}/>
    </div>
  );
}

export default AuthATC;