import './stylesheets/ProfileATC.css';
import {useContext, useEffect, useState} from "react";
import { UserContext } from "../../Context.js";
import NavBarATC from './../../Composants/NavBarATC';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import http from "../../http.js";
import { decryptData } from '../../crypto';
import { useAlert } from 'react-alert';
function ProfileATC(props) {
  //Page de gestion des véhicules de l'ATC
  
  const alert = useAlert();
  const {setLoading,loading,user} = useContext(UserContext);
  const  [viewedUser, setViewedUser] =useState({});
  const navigate = useNavigate();
  let redirection = false;
  const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
  function setRedirection (dest)
  {
    // s'il est nécessaire de rediriger : se rediriger vers la destination
    redirection = dest;
  }
  useEffect (()=>{
    if (redirection!==false)
    {
      if (redirection==="root_undefined")
      {
        setLoading(true)
      }
      else{
        navigate(redirection, { replace: true })
      }
     
    }
    else{
      //Récupérer les informations de l'atc
      http.get("/gestionprofils/atc/"+decryptData(props.userId), {"headers": {
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
  }, [redirection,loading, ]);
  if (user.est_root===true)
  {
    //Peut gérer les ATC
    if(props.userId=== localStorage.getItem("curruId"))
    {
      //Le compte à consulter est le compte de l'atc : Cas qui ne peut se produire que si l'utilisateur entre l'url lui meme
      setRedirection("/atc/monprofil")
      return (null)
    }
    else{
      //Gérer le profil de l'atc
      return (
    
        <div id="pageProfileAtc"> 
          <NavBarATC />
          {viewedUser.nom}
          ProfileATC</div>
      );
    }
  }
  else if (user.est_root === undefined)
  {
    setRedirection("root_undefined")
    return (
      <div id="pageProfileAtc">
        <ClipLoader color={"#1B92A4"} loading={loading} css={style} size={50} />
        <NavBarATC />
        </div>
    );
  }
  else{
    // Ne peut pas gérer les ATC
    return (
    
      <div id="pageProfileAtc">
        <NavBarATC />
          <div id="divNoAccess">
            <div >
              <h3>Il semble que vous n'avez pas accès à ce contenu. Veuillez vous rediriger vers <a href='/atc/gestioncomptes'>la page de gestion des profils</a>.</h3>
            </div>
          </div>
        </div>
    );
  }
  
}

export default ProfileATC;