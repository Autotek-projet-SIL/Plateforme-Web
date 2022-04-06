import './stylesheets/AuthATC.css';
import {useContext} from "react";
import { UserContext } from "../../Context.js";
import Button from './../../Composants/Button';
import Logo from "./../../ressources/images/logo-L.svg";
import ImgAuth from "./../../ressources/images/auth-img-atc.svg";
import Input from './../../Composants/Input';
import {useNavigate} from 'react-router-dom';
function AuthATC() {
  //Page d'authentification  de l'ATC
  const {login} = useContext(UserContext);
  const navigate = useNavigate();
  function logging ()
  {
    // Fonction permettant le logging de l'atc dans la plateforme
    let email = document.querySelector("#inputatcauthMail").value;
    let mdp = document.querySelector("#inputatcauthMdp").value;
    if ((email==="")||(mdp===""))
    {
      // champs requis vides
      alert("vide")
    }
    else if (validateEmail(email) === false)
    {
      // email invalid
      alert("invalid")
    }
    else{
      let userInfo = {email:"atc@root.dz", mdp:"autotekatcroot"}; 
      login (userInfo, "atc");
    }
    
  }
  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  return (
    <div id="atcauthPage">
      <div id="atcauthContainer">
        <div id="atcauthImg">
        <img src={ImgAuth} alt="Logo Autotek"/>
        </div>
        <div id="atcauthForm">
        <img src={Logo} alt="Logo Autotek"/>
        <div >
          <Input label="Votre adresse mail" inputClass="" containerClass="formAuthInput" id="atcauthMail" fieldType="email"/>
          <Input label="Votre mot de passe" inputClass="" containerClass="formAuthInput" id="atcauthMdp" fieldType="password"/>
        </div>
        
        <Button title="Connexion" btnClass="buttonPrincipal" onClick={()=>logging()}/>
        <h4>Vous êtes un décideur ? <b onClick={()=>
     navigate("/decideur/authentification")}>Connectez vous !</b></h4>
        </div>
        
      </div>
    </div>
  );
}

export default AuthATC;