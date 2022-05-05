import './stylesheets/CadreCompte.css';
import "./stylesheets/bootsrapNeededStles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from 'react';
import { UserContext } from "./../Context.js";
import  {Dropdown, DropdownButton, FloatingLabel, Form, Modal}  from 'react-bootstrap';
import Button from "./Button"
import http from "../http.js"
import { useAlert } from 'react-alert';
import { decryptData, encryptData } from '../crypto'; 
import {Route, Routes, useNavigate} from 'react-router-dom';
function CadreCompte(props) {
   //Composant cadre d'un compte employé
  
  const alert = useAlert();
 
  const navigate = useNavigate();
  //const {getCurrentCredentials} = useContext(UserContext);
  const {setLoading,loading,suppImage} = useContext(UserContext)
  const [fire, setFire] = useState(false);
  const handleCloseFire = () => setFire(false);
  const handleShowFire = () => setFire(true);
  async function fireEmp (){
    //const currCre =  await getCurrentCredentials();
      setLoading(true)
     if (props.compte.type_compte==="ATC")
     {
      http.delete(`/gestioncomptes/supprimer_atc/${props.compte.id}`,{"token" : decryptData(window.localStorage.getItem("auth")),
      "id_sender": decryptData(window.localStorage.getItem("curruId"))}).then(async(jResponse)=>{
        
        await suppImage(props.compte.photo_am)
        setLoading(false)
        window.location.reload();
      }).catch((error)=>{
        setLoading(false)
        alert.error("Une erreur est survenue, veuillez réessayer ultérieurement", {timeout : 0});
      });
     }
     else if (props.compte.type_compte==="AM")
     {
      http.delete(`/gestioncomptes/supprimer_am/${props.compte.id}`,{"token" : decryptData(window.localStorage.getItem("currTok")),
      "id_sender": decryptData(window.localStorage.getItem("curruId")),}).then((jResponse)=>{
        setLoading(false)
        window.location.reload();
      }).catch((error)=>{
        setLoading(false)
        alert.error("Une erreur est survenue, veuillez réessayer ultérieurement", {timeout : 0});
      });
     }
     else{
        //Employé === Décideur
        http.delete(`/gestioncomptes/supprimer_decideur/${props.compte.id}`,{"token" : decryptData(window.localStorage.getItem("currTok")),
         "id_sender": decryptData(window.localStorage.getItem("curruId")),}).then((jResponse)=>{
          setLoading(false)
          window.location.reload();
         }).catch((error)=>{
        setLoading(false)
         alert.error("Une erreur est survenue, veuillez réessayer ultérieurement", {timeout : 0});
         });
     }
   
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
          <Modal.Title>Êtes vous sure de vouloir virer l'employé {props.compte.nom} {props.compte.prenom} ?</Modal.Title>
        </Modal.Header>
        <Modal.Footer className="validerDiv">
          <Button title="Confirmer" btnClass="buttonPrincipal" onClick={()=>fireEmp()} />
          <Button title="Annuler" btnClass="buttonSecondaire" onClick={()=>handleCloseFire()}/>
        </Modal.Footer>
      </Modal>
    );
  }
  
  return (
    <>
    {fireModal()}
       <div className='cadreCompte' >
            <div style={{
            backgroundImage: `url("${props.compte.photo}")`
          }}  className='cadreImg'></div>
             <div className='infoUser'>
                <h3 className='nomUser'>{props.compte.nom} {props.compte.prenom}</h3>
                <h3 className='emailUser'>{props.compte.email} </h3>
                <h3 className='typeUser'>{props.compte.type_compte}</h3>
             </div>
             <div className="actions">
                <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" title="Afficher le profile de l'employé" className="viewIcon"  onClick={()=>navigate(("/atc/profil/"+props.compte.type_compte.toLowerCase()+"/"+encryptData(props.compte.id))) } />
                <FontAwesomeIcon icon="fa-solid fa-user-slash" title="Virer l'employé" className="fireIcon" size="lg" onClick={()=>handleShowFire()} />
             </div>
          </div>
      
      </>
  );
}

export default CadreCompte;