import "./stylesheets/AuthD.css";
import { useContext } from "react";
import { UserContext } from "../../Context.js";
import Button from "./../../Composants/Button";
import Input from "./../../Composants/Input";
import Logo from "./../../ressources/images/logo-L.svg";
import ImgAuth from "./../../ressources/images/auth-img-d.svg";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import ClipLoader from "react-spinners/ClipLoader";
//Page de l'authentification du Décideur
function AuthD() {
  const style = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };
  const alert = useAlert();
  const { loading, login } = useContext(UserContext);
  const navigate = useNavigate();
  
  function logging() {
    // Fonction permettant le logging de l'atc dans la plateforme
    let email = document.querySelector("#inputdauthMail").value;
    let mdp = document.querySelector("#inputdauthMdp").value;
    if (email === "" || mdp === "") {
      // champs requis vides

      alert.error("Veuillez remplir les champs requis.");
      email === "" &&
        document.querySelector("#inputdauthMail").classList.add("input-error");
      mdp === "" &&
        document.querySelector("#inputdauthMdp").classList.add("input-error");
    } else if (validateEmail(email) === false) {
      // email invalid
      alert.error("Veuillez introduire une adresse mail valide.");
      document.querySelector("#inputdauthMail").classList.add("input-error");
    } else {
      let userInfo = { email: email, mdp: mdp };
      login(userInfo, "decideur");
    }
  }
  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  return (
    <div id="dauthPage">
      <ClipLoader color={"#1B92A4"} loading={loading} css={style} size={50} />
      <div id="dauthContainer">
        <div id="dauthForm">
          <img src={Logo} alt="Logo Autotek" />
          <div>
            <Input
              label="Votre adresse mail"
              inputClass=""
              containerClass="formAuthInput"
              id="dauthMail"
              fieldType="email"
            />
            <Input
              label="Votre mot de passe"
              inputClass=""
              containerClass="formAuthInput"
              id="dauthMdp"
              fieldType="password"
            />
          </div>

          <Button
            title="Connexion"
            btnClass="buttonPrincipal"
            onClick={() => logging()}
          />
          <h4>
            Vous êtes un administrateur ATC ?{" "}
            <b onClick={() => navigate("/atc/authentification")}>
              Connectez vous !
            </b>
          </h4>
        </div>
        <div id="dauthImg">
          <img src={ImgAuth} alt="Logo Autotek" />
        </div>
      </div>
    </div>
  );
}

export default AuthD;
