import './stylesheets/ProfileDecideur.css';
import {useContext, useEffect, useState} from "react";
import { UserContext } from "../../Context.js";
import NavBarATC from './../../Composants/NavBarATC';
import { useNavigate } from 'react-router-dom';
import http from "../../http.js";
import { decryptData } from '../../crypto';
import { useAlert } from 'react-alert';
function ProfileDecideur(props) {
  //Page de gestion des véhicules de l'Decideur
  
  const alert = useAlert();
  const {user} = useContext(UserContext);
  const  [viewedUser, setViewedUser] =useState({});
  const navigate = useNavigate();
  let redirection = false;
  function setRedirection (dest)
  {
    // s'il est nécessaire de rediriger : se rediriger vers la destination
    redirection = dest;
  }
  useEffect (()=>{
    if (redirection!==false)
    {
        navigate(redirection, { replace: true })
    }
    else{
      //Récupérer les informations de l'Decideur
      http.get("/gestionprofils/decideur/"+decryptData(props.userId), {"headers": {
        "token" : decryptData(window.localStorage.getItem('currTok')),
        "id_sender": decryptData(window.localStorage.getItem('curruId')),
      }}).then((jResponse)=>{
        if (jResponse.data.length===0)
        {
          navigate("/404", { replace: true })
        }
        else{
          setViewedUser(jResponse.data[0])
        }
      }).catch(err=>{
        alert.error("Une erreur est survenue! Veuillez vérifier votre connexion ou réessayer ultérieurement.");
      })

    }
  }, [redirection, ]);
      //Gérer le profil du Decideur
      return (
    
        <div id="pageProfileDecideur"> 
          <NavBarATC />
          {viewedUser.nom}
          ProfileDecideur</div>
      );
}

export default ProfileDecideur;