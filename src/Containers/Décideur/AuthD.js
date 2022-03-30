import './stylesheets/AuthD.css';
import {useContext} from "react";
import { UserContext } from "../../Context.js";
import Button from './../../Composants/Button';
import Input from './../../Composants/Input';
import Logo from "./../../ressources/images/logo-L.svg";
import ImgAuth from "./../../ressources/images/auth-img-d.svg";
import {useNavigate} from 'react-router-dom';
function AuthD() {
  //Page d'inscription du Décideur
  const {login} = useContext(UserContext);
  const navigate = useNavigate();
  function logging ()
  {
    // Fonction permettant le logging de l'atc dans la plateforme
    let email = document.querySelector("#authMail").value;
    let mdp = document.querySelector("#authMdp").value;
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
      let userInfo = {id:1}; //test
      login (userInfo, "atc");
      window.location.reload();
    }
    
  }
  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  return (
    <div id="dauthPage">
      <div id="dauthContainer">
        <div id="dauthForm">
        <img src={Logo} alt="Logo Autotek"/>
        <div >
          <Input label="Votre adresse mail" inputClass="" containerClass="formAuthInput" id="dauthMail" fieldType="email"/>
          <Input label="Votre mot de passe" inputClass="" containerClass="formAuthInput" id="dauthMdp" fieldType="password"/>
        </div>
        
        <Button title="Connexion" btnClass="buttonPrincipal" onClick={()=>logging()}/>
        <h4>Vous êtes un administrateur ATC ? <b onClick={()=>
     navigate("/atc/inscription")}>Connectez vous !</b></h4>
        </div>
        <div id="dauthImg">
          <img src={ImgAuth} alt="Logo Autotek"/>
        </div>
      </div>
    </div>
  );
}

export default AuthD;