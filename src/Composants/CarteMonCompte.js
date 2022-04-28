import './stylesheets/CarteMonCompte.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {useContext, useState} from "react";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css';
import Button from "./Button";
import Input from "./Input";
import { useAlert } from 'react-alert';
import http from "../http.js"
import { decryptData } from '../crypto';
import { UserContext } from '../Context';
function CarteMonCompte(props) {
  //Composant boutton selon les spécifications de la charte IHM
  const [modifDiv, setShown] = useState(false);
  const alert = useAlert();
  const {setLoading,loading, updateEmail,updatePwd, loggingOut,createImage,suppImage} = useContext(UserContext);
  async function  modifierMdp ()
  {

    let  comptePwd = document.querySelector("#inputcompteModifMdp").value;
    let confComptePwd = document.querySelector("#inputcompteModifMdpConf").value;
    if (comptePwd==="")
    {
      alert.error("Veuillez introduire un mot de passe ");
      document.querySelector("#inputcompteModifMdp").classList.add("input-error");
    }
    else if (comptePwd.length < 6)
      {
        alert.error("Veuillez introduire un mot de passe dont la taille est supérieure à 6.");
        document.querySelector("#inputcompteModifMdp").classList.add("input-error");
      }
      else if (confComptePwd==="")
      {
        alert.error("Veuillez confirmer votre mot de passe ");
        document.querySelector("#inputcompteModifMdpConf").classList.add("input-error");
      }
    else if (comptePwd!==confComptePwd)
    {
      alert.error("Les mots de passe ne correspondent pas.");
        document.querySelector("#inputcompteModifMdp").classList.add("input-error");
        document.querySelector("#inputcompteModifMdpConf").classList.add("input-error");
    }
    else{
      if (props.typeUser==="Décideur")
      {
        http.put("/gestionprofils/modifier_decideur/modifier_mot_de_passe/"+props.userInfo.id_decideur,
        {"token" : decryptData(window.localStorage.getItem("currTok")),
        "id_sender":decryptData(window.localStorage.getItem("curruId")),
        "mot_de_passe": comptePwd,
      }).then(async jResponse=>{
        await updatePwd(comptePwd)
        alert.show("Mot de passe modifié avec succès.");
        loggingOut();
      }).catch(err=>{
        console.log(err)
        alert.error("Une erreur est survenue. Veuillez réessayer ultérieurement.")
      })
      }
      else{
          http.put("/gestionprofils/modifier_atc/modifier_mot_de_passe/"+props.userInfo.id_atc,
          {"token" : decryptData(window.localStorage.getItem("currTok")),
          "id_sender":decryptData(window.localStorage.getItem("curruId")),
          "mot_de_passe": comptePwd,
        }).then(async jResponse=>{
          await updatePwd(comptePwd)
          alert.show("Mot de passe modifié avec succès.");
          loggingOut();
        }).catch(err=>{
          console.log(err)
          alert.error("Une erreur est survenue. Veuillez réessayer ultérieurement.")
        })
      }
      
      
    }
  }
  async function  modifierPdp ()
  {
    let newPdp = document.querySelector("#import_compte_pdp").files;
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
          if (props.typeUser==="Décideur")
          {
            await suppImage(props.userInfo.photo_decideur);
            let img =await createImage(newPdp[0],"Decideur",decryptData(window.localStorage.getItem("curruId")));
            http.put("/gestionprofils/modifier_decideur/modifier_photo/"+props.userInfo.id_decideur,
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
          else{
              await suppImage(props.userInfo.photo_atc);
              let img =await createImage(newPdp[0],"ATC",decryptData(window.localStorage.getItem("curruId")));
              http.put("/gestionprofils/modifier_atc/modifier_photo/"+props.userInfo.id_atc,
              {"token" : decryptData(window.localStorage.getItem("currTok")),
              "id_sender":decryptData(window.localStorage.getItem("curruId")),
              "photo_atc": img
        
            }).then(async jResponse=>{
              alert.show("Photo de profil modifiée avec succès.");
            }).catch(err=>{
              console.log(err)
              alert.error("Une erreur est survenue. Veuillez réessayer ultérieurement.")
          })
          }
          
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
    let nom =  formatString(document.querySelector("#inputcompteModifNom").value);
    let prenom = formatString(document.querySelector("#inputcompteModifPrenom").value);
    let email =  document.querySelector("#inputcompteModifMail").value;
    let numTel =  document.querySelector("#inputcompteModifTlfn").value;
    if ((nom==="")||(prenom==="")||(email==="")||(numTel===""))
    {
      // champs requis vides
      alert.error("Veuillez remplir tous les champs requis.");
      
      (nom==="") && document.querySelector("#inputcompteModifNom").classList.add("input-error");
      (prenom==="") && document.querySelector("#inputcompteModifPrenom").classList.add("input-error");
      (email==="") && document.querySelector("#inputcompteModifMail").classList.add("input-error");
      (numTel==="") && document.querySelector("#inputcompteModifTlfn").classList.add("input-error");
    }
    else if (validateEmail(email) === false)
      {
        alert.error("Veuillez introduire une adresse mail valide.");
        document.querySelector("#inputnewEmpMail").classList.add("input-error");
      }
    else{
      
      if (props.typeUser==="Décideur")
      {
          http.put("/gestionprofils/modifier_decideur/"+props.userInfo.id_decideur,
      {"token" : decryptData(window.localStorage.getItem("currTok")),
      "id_sender":decryptData(window.localStorage.getItem("curruId")),
      "nom" : nom,
      "prenom": prenom,
      "email": email,
      "numero_telephone":numTel,

    }).then(async jResponse=>{
      if (email !== props.userInfo.email)
      {
        await updateEmail(email);
        alert.show("Données modifiées avec succès.");
        loggingOut();
      }
      else{
        alert.show("Données modifiées avec succès.");
      }
    }).catch(err=>{
      console.log(err)
      alert.error("Une erreur est survenue. Veuillez réessayer ultérieurement.")
    })
      }
      else{
          http.put("/gestionprofils/modifier_atc/"+props.userInfo.id_atc,
      {"token" : decryptData(window.localStorage.getItem("currTok")),
      "id_sender":decryptData(window.localStorage.getItem("curruId")),
      "nom" : nom,
      "prenom": prenom,
      "email": email,
      "numero_telephone":numTel,

    }).then(async jResponse=>{
      if (email !== props.userInfo.email)
      {
        await updateEmail(email);
        alert.show("Données modifiées avec succès.");
        loggingOut();
      }
      else{
        alert.show("Données modifiées avec succès.");
      }
      
    }).catch(err=>{
      console.log(err)
      alert.error("Une erreur est survenue. Veuillez réessayer ultérieurement.")
    })
      }
      
      }
  }
    
  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  function formatString(string)
  {
    //Retoune un string sans extra vides + avec MAJUSCULE au début
    let str = string.replace(/\s+/g,' ').trim();
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  function modifierInfosCadre(){
    return (
      
      <div id="monCompteCard">
          <div></div>
          <div id="monCompteImg">
              <img  src={props.userInfo.photo_atc || props.userInfo.photo_decideur} alt="Votre photo de profil"/>
          </div>
           
          <div id="monCompteContainer">
          </div>
          <div id="monCompteInfos">
          <div id="modifInfos">
            <Input label="Votre nom" inputClass="" containerClass="modifCompteInput" id="compteModifNom" fieldType="text" parDef={props.userInfo.nom}/>
            <Input label="Votre prénom" inputClass="" containerClass="modifCompteInput" id="compteModifPrenom" fieldType="text" parDef={props.userInfo.prenom}/>
            <Input label="Votre adresse mail" inputClass="" containerClass="modifCompteInput" id="compteModifMail" fieldType="email"parDef={props.userInfo.email}/>
            <Input label="Votre numéro de téléphone" inputClass="" containerClass="modifCompteInput" id="compteModifTlfn" fieldType="tel"parDef={props.userInfo.numero_telephone}/>
          </div>
            <div className="modifCompte">
                 
                <div style={{
                  display: 'flex',
                  margin:0,
                  padding:0
                }}>
                <input
                type="file"
                accept="image/*"
                style={{ display: 'none', margin:0 }}
                id="import_compte_pdp"
              />
              <label htmlFor="import_compte_pdp" >
                <Button title="Importer la photo de profile" btnClass="buttonSecondaire footerBtn" variant="contained" color="primary" component="span" onClick={(()=>{document.querySelector("#import_compte_pdp").click()})}/>
              </label>
                </div>
                <Button  title="Modifier la photo de profil" btnClass="buttonPrincipal" onClick={()=>modifierPdp()}/>
             
                <Button  title="Modifier" btnClass="buttonPrincipal" onClick={()=>modifierInfos()}/>
            </div>  
            
            <hr/>
            <div id="modifPwd">
              <Input label="Votre mot de passe" inputClass="" containerClass="modifCompteInput" id="compteModifMdp" fieldType="password" />
              
              <Input label="Confirmez votre mot de passe" inputClass="" containerClass="modifCompteInput" id="compteModifMdpConf" fieldType="password"/>
            </div>
            <div className="modifCompte">
                <Button  title="Modifier le mot de passe" btnClass="buttonSecondaire" onClick={()=>modifierMdp()}/>
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
          <div></div>
          <div id="monCompteImg">
              <img  src={props.userInfo.photo_atc || props.userInfo.photo_decideur} alt="Votre photo de profil"/>
          </div>
           
          <div id="monCompteContainer">
          </div>
          <div id="monCompteInfos">
                  <h2>{props.userInfo.nom || <Skeleton count="0.15" inline/>} { props.userInfo.prenom || <Skeleton count="0.15"/>}</h2>
                  <p>{props.typeUser}</p>
                  <hr/>
                  <p><FontAwesomeIcon icon="fa-solid fa-envelope " size="xl" /> {props.userInfo.email || <Skeleton height="100%" count="0.25"/>}</p>
                  <p><FontAwesomeIcon icon="fa-solid fa-phone " size="xl" />  {props.userInfo.numero_telephone || <Skeleton height="100%" count="0.25"/>}</p>
                  <div className="modifCompte">
                    <Button  title="Modifier" btnClass="buttonPrincipal" onClick={()=>setShown(true)}/>
                  </div>
                  
              </div>
      </div>
      </SkeletonTheme>
    );
  }
  return (
    (modifDiv && modifierInfosCadre()) || showInfosCadre()
  );
}

export default CarteMonCompte;