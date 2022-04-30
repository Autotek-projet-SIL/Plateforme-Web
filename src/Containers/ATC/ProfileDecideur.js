import './stylesheets/ProfileDecideur.css';
import {useContext, useEffect, useState} from "react";
import { UserContext } from "../../Context.js";
import NavBarATC from './../../Composants/NavBarATC';
import { useNavigate } from 'react-router-dom';
import http from "../../http.js";
import { decryptData } from '../../crypto';
import { useAlert } from 'react-alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import Input from '../../Composants/Input';
import Button from '../../Composants/Button';
import { Modal } from 'react-bootstrap';
function ProfileDecideur(props) {
  //Page de gestion des véhicules de l'Decideur
  
  
  const alert = useAlert();
  const {setLoading,loading, updateEmail,updatePwd, user,createImage,suppImage} = useContext(UserContext);
  const [modifDiv, setShown] = useState(false);
  const  [viewedUser, setViewedUser] =useState({});
  const [fire, setFire] = useState(false);
  const handleCloseFire = () => setFire(false);
  const handleShowFire = () => setFire(true);
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

  async function  modifierPdp ()
  {
    let newPdp = document.querySelector("#import_decideur_pdp").files;
    if (newPdp.length===0) {
      //photo de profile non choisie
      alert.error("Veuillez importer une photo de profile.")

    }
    else if (!newPdp[0].type.includes("image"))
      {
        alert.error("Veuillez importer une photo de profil valide");
      }
      else{
        try {
    //      await suppImage(viewedUser.photo_decideur);
          let img =await createImage(newPdp[0],"Decideur",viewedUser.id_decideur);
          http.put("/gestionprofils/modifier_decideur/modifier_photo/"+viewedUser.id_decideur,
          {"token" : decryptData(window.localStorage.getItem("currTok")),
          "id_sender":decryptData(window.localStorage.getItem("curruId")),
          "photo_decideur": img
    
        }).then(async jResponse=>{
          alert.show("Photo de profil modifiée avec succès.");
        }).catch(err=>{
          console.log(err)
          alert.error("Une erreur est survenue. Veuillez réessayer ultérieurement.")
        })
        }
        catch (error)
        {
          console.log(error)
          alert.error("Une erreur est survenue. Veuillez réessayer ultérieurement.")
        }
        
      }
  }
  async function  modifierInfos ()
  {
    let nom =  formatString(document.querySelector("#inputdecideurModifNom").value);
    let prenom = formatString(document.querySelector("#inputdecideurModifPrenom").value);
    let numTel =  document.querySelector("#inputdecideurModifTlfn").value;
    if ((nom==="")||(prenom==="")||(numTel===""))
    {
      // champs requis vides
      alert.error("Veuillez remplir tous les champs requis.");
      
      (nom==="") && document.querySelector("#inputdecideurModifNom").classList.add("input-error");
      (prenom==="") && document.querySelector("#inputdecideurModifPrenom").classList.add("input-error");
      (numTel==="") && document.querySelector("#inputdecideurModifTlfn").classList.add("input-error");
    }
    else{
      http.put("/gestionprofils/modifier_decideur/"+viewedUser.id_decideur,
      {"token" : decryptData(window.localStorage.getItem("currTok")),
      "id_sender":decryptData(window.localStorage.getItem("curruId")),
      "nom" : nom,
      "prenom": prenom,
      "numero_telephone":numTel,
      "email" : viewedUser.email,

    }).then(async jResponse=>{
      alert.show("Données modifiées avec succès.");
    }).catch(err=>{
      console.log(err)
      alert.error("Une erreur est survenue. Veuillez réessayer ultérieurement.")
    })
      }
  }
 
  function formatString(string)
  {
    //Retoune un string sans extra vides + avec MAJUSCULE au début
    let str = string.replace(/\s+/g,' ').trim();
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  async function fireEmp (){
    //const currCre =  await getCurrentCredentials();
      setLoading(true)
      http.delete(`/gestioncomptes/supprimer_decideur/${viewedUser.id}`,{"token" : decryptData(window.localStorage.getItem("currTok")),
         "id_sender": decryptData(window.localStorage.getItem("curruId")),}).then((jResponse)=>{
          setLoading(false)
          document.location.href="/atc/gestioncomptes/";
         }).catch((error)=>{
        setLoading(false)
         alert.error("Une erreur est survenue, veuillez réessayer ultérieurement", {timeout : 0});
         });
   
  }
  function fireModal(){
    return(
      <Modal
        show={fire}
        onHide={handleCloseFire}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Êtes vous sure de vouloir virer l'employé {viewedUser.nom} {viewedUser.prenom} ?</Modal.Title>
        </Modal.Header>
        <Modal.Footer className="validerDiv">
          <Button title="Confirmer" btnClass="buttonPrincipal" onClick={()=>fireEmp()} />
          <Button title="Annuler" btnClass="buttonSecondaire" onClick={()=>handleCloseFire()}/>
        </Modal.Footer>
      </Modal>
    );
  }

  function modifierInfosCadre(){
    return (
      
      <div id="monCompteCard">
          <div></div>
          <div id="monCompteImg">
              <img  src={viewedUser.photo_decideur} alt="Votre photo de profil"/>
          </div>
           
          <div id="monCompteContainer">
          </div>
          <div id="monCompteInfos">
          <div id="modifInfosProfile">
            <Input label="Votre nom" inputClass="" containerClass="modifDecideurInput" id="decideurModifNom" fieldType="text" parDef={viewedUser.nom}/>
            <Input label="Votre prénom" inputClass="" containerClass="modifDecideurInput" id="decideurModifPrenom" fieldType="text" parDef={viewedUser.prenom}/>
            <Input label="Votre numéro de téléphone" inputClass="" containerClass="modifDecideurInput" id="decideurModifTlfn" fieldType="tel"parDef={viewedUser.numero_telephone}/>
          </div>
            <div className="modifDecideur">
                 
                <div style={{
                  display: 'flex',
                  margin:0,
                  padding:0
                }}>
                <input
                type="file"
                accept="image/*"
                style={{ display: 'none', margin:0 }}
                id="import_decideur_pdp"
              />
              <label htmlFor="import_decideur_pdp" >
                <Button title="Importer la photo de profile" btnClass="buttonSecondaire footerBtn" variant="contained" color="primary" component="span" onClick={(()=>{document.querySelector("#import_decideur_pdp").click()})}/>
              </label>
                </div>
                <Button  title="Modifier la photo de profil" btnClass="buttonPrincipal" onClick={()=>modifierPdp()}/>
             
                <Button  title="Modifier" btnClass="buttonPrincipal" onClick={()=>modifierInfos()}/>
            </div>  
            
            <div className="modifDecideur">
                <Button  title="Annuler" btnClass="buttonPrincipal" onClick={()=>setShown(false)}/>
            </div> 
          </div>
      </div>
    );
  }
  function showInfosCadre()
  {
    return (
      <SkeletonTheme  baseColor="#c3c3c3" highlightColor="#dbdbdb">
      <div id="monCompteCard">
        {fireModal()}
          <div></div>
          <div id="monCompteImg">
              <img  src={viewedUser.photo_decideur} alt="Votre photo de profil"/>
          </div>
           
          <div id="monCompteContainer">
          </div>
          <div id="monCompteInfos">
                  <h2>{viewedUser.nom || <Skeleton count="0.15" inline/>} { viewedUser.prenom || <Skeleton count="0.15"/>}</h2>
                  <p>Décideur</p>
                  <hr/>
                  <p><FontAwesomeIcon icon="fa-solid fa-envelope " size="xl" /> {viewedUser.email || <Skeleton height="100%" count="0.25"/>}</p>
                  <p><FontAwesomeIcon icon="fa-solid fa-phone " size="xl" />  {viewedUser.numero_telephone || <Skeleton height="100%" count="0.25"/>}</p>
                  <div className="modifDecideur">
                    <Button  title="Modifier" btnClass="buttonPrincipal" onClick={()=>setShown(true)}/>
                    <Button  title="Supprimer" btnClass="buttonSecondaire" onClick={()=>handleShowFire()}/>
                  </div>
                  
              </div>
      </div>
      </SkeletonTheme>
    );
  }
  
      //Gérer le profil du Decideur
      return (
    
        <div id="pageProfileDecideur"> 
          <NavBarATC />
          <div id="cadreProfileDecideur">
            {(modifDiv && modifierInfosCadre()) || showInfosCadre()}
          </div>
          </div>
      );
}

export default ProfileDecideur;