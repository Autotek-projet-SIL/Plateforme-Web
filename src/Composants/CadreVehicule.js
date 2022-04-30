import './stylesheets/CadreVehicule.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from 'react';
import { UserContext } from "./../Context.js";
import  {Dropdown, DropdownButton, FloatingLabel, Form, Modal}  from 'react-bootstrap';
import Button from "./Button"
import "./stylesheets/bootsrapNeededStles.css";
import http from "../http.js"
import { useAlert } from 'react-alert';
import { decryptData, encryptData } from '../crypto'; 
import {Route, Routes, useNavigate} from 'react-router-dom';
function CadreVehicule(props) {
   //Composant cadre d'un vehicule vehicule
  
  const alert = useAlert();
 
  const navigate = useNavigate();
  //const {getCurrentCredentials} = useContext(UserContext);
  const {setLoading,loading} = useContext(UserContext)
  const [supp, setSupp] = useState(false);
  const handleCloseSupp = () => setSupp(false);
  const handleShowSupp = () => setSupp(true);
  async function suppVehicule (){
    //const currCre =  await getCurrentCredentials();
      setLoading(true)
      http.delete(`/flotte/supprimer_vehicule/${props.id}`,{"token" : decryptData(window.localStorage.getItem("auth")),
      "id_sender": decryptData(window.localStorage.getItem("curruId")),}).then((jResponse)=>{
        setLoading(false)
        document.location.href="/atc/gestionvehicules/";
      }).catch((error)=>{
        setLoading(false)
        alert.error("Une erreur est survenue, veuillez réessayer ultérieurement", {timeout : 0});
      });
  
   
  }
  function suppModal(){
    return(
      <Modal
        show={supp}
        onHide={handleCloseSupp}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Êtes vous sure de vouloir supprimer le vehicule  {props.vehicule.modele +" #"+ props.id}?</Modal.Title>
        </Modal.Header>
        <Modal.Footer className="validerDiv">
          <Button title="Confirmer" btnClass="buttonPrincipal" onClick={()=>suppVehicule()} />
          <Button title="Annuler" btnClass="buttonSecondaire" onClick={()=>handleCloseSupp()}/>
        </Modal.Footer>
      </Modal>
    );
  }
  
  return (
    <>
    {suppModal()}
       <div className='cadreVehicule' >
            <div style={{
            backgroundImage: `url("${props.vehicule.image_vehicule}")`
          }}  className='cadreImg'></div>
             <div className='infoVehicule'>
                <h3 className="vehiculeModele">{props.vehicule.modele +" #"+ props.id}</h3>
                <h3 className="vehiculeType">{props.vehicule.libelle}</h3>
                <h3 className="vehiculeDispo">{(props.vehicule.disponible && "Disponible" )|| "Non disponible"}</h3>
             </div>
             <div className="actions">
                <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" title="Afficher les informations du vehicule" className="viewIcon"  onClick={()=>navigate(("/atc/vehicule/"+props.id)) } />
                <FontAwesomeIcon icon="fa-solid fa-user" className="viewAmIcone" onClick={()=>navigate(("/atc/profil/am/"+encryptData(props.vehicule.id_am)))}/>
                <FontAwesomeIcon icon="fa-solid fa-xmark" title="supprimer le vehicule" className="suppIcon" size="lg" onClick={()=>handleShowSupp()} />
             </div>
          </div>
      
      </>
  );
}

export default CadreVehicule;