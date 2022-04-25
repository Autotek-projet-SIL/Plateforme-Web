import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {useState} from "react";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css';
import Button from "./Button";
import Input from "./Input";
import './stylesheets/CarteMonCompte.css';
function CarteMonCompte(props) {
  //Composant boutton selon les spécifications de la charte IHM
  const [modifDiv, setShown] = useState(false)
  function  modifierMdp ()
  {

  }
  function  modifierPdp ()
  {
    
  }
  function  modifierInfos ()
  {
    
  }
  function modifierInfosCadre(){
    return (
      
      <div id="monCompteCard">
          <div></div>
          <div id="monCompteImg">
              <img  src={props.userInfo.photo_atc} alt="Votre photo de profil"/>
          </div>
           
          <div id="monCompteContainer">
          </div>
          <div id="monCompteInfos">
          <div id="modifInfos">
            <Input label="Votre nom" inputClass="" containerClass="modifAtcInput" id="atcModifNom" fieldType="text"/>
            <Input label="Votre prénom" inputClass="" containerClass="modifAtcInput" id="atcModifPrenom" fieldType="text"/>
            <Input label="Votre adresse mail" inputClass="" containerClass="modifAtcInput" id="atcModifMail" fieldType="email"/>
            <Input label="Votre numéro de téléphone" inputClass="" containerClass="modifAtcInput" id="atcModifTlfn" fieldType="tel"/>
          </div>
            <div className="modifAtc">
                 
                <div style={{
                  display: 'flex',
                  margin:0,
                  padding:0
                }}>
                <input
                type="file"
                accept="image/*"
                style={{ display: 'none', margin:0 }}
                id="import_atc_pdp"
              />
              <label htmlFor="import_atc_pdp" >
                <Button title="Importer la photo de profile" btnClass="buttonSecondaire footerBtn" variant="contained" color="primary" component="span" onClick={(()=>{document.querySelector("#import_atc_pdp").click()})}/>
              </label>
                </div>
                <Button  title="Modifier la photo de profil" btnClass="buttonPrincipal" onClick={()=>modifierPdp()}/>
             
                <Button  title="Modifier" btnClass="buttonPrincipal" onClick={()=>modifierInfos()}/>
            </div>  
            
            <hr/>
            <div id="modifPwd">
              <Input label="Votre mot de passe" inputClass="" containerClass="modifAtcInput" id="atcModifMdp" fieldType="password"/>
              
              <Input label="Confirmez votre mot de passe" inputClass="" containerClass="modifAtcInput" id="atcModifMdpConf" fieldType="password"/>
            </div>
            <div className="modifAtc">
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
              <img  src={props.userInfo.photo_atc} alt="Votre photo de profil"/>
          </div>
           
          <div id="monCompteContainer">
          </div>
          <div id="monCompteInfos">
                  <h2>{props.userInfo.nom || <Skeleton count="0.15" inline/>} { props.userInfo.prenom || <Skeleton count="0.15"/>}</h2>
                  <p>{props.typeUser}</p>
                  <hr/>
                  <p><FontAwesomeIcon icon="fa-solid fa-envelope " size="xl" /> {props.userInfo.email || <Skeleton height="100%" count="0.25"/>}</p>
                  <p><FontAwesomeIcon icon="fa-solid fa-phone " size="xl" />  {props.userInfo.numero_telephone || <Skeleton height="100%" count="0.25"/>}</p>
                  <div className="modifAtc">
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