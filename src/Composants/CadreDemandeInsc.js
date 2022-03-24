import './stylesheets/cadreDemandeInsc.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from 'react';
import  {Dropdown, DropdownButton, FloatingLabel, Form, Modal}  from 'react-bootstrap';
import Button from "./Button"
import "./stylesheets/bootsrapNeededStles.css";
import http from "../http.js"
function CadreDemandeInsc(props) {
  
  const [show, setShow] = useState(false);
  const [showPId, setShowPId] = useState(false);
  const [showValider, setShowValider] = useState(false);
  const [showRejetter, setShowRejetter] = useState(false);
  const [rejetVal, setRejetVal] = useState(0)
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleClosePID = () => setShowPId(false);
  const handleShowPID = () => setShowPId(true);
  const handleCloseValider = () => setShowValider(false);
  const handleShowValider = () => setShowValider(true);
  const handleCloseRejetter = () => setShowRejetter(false);
  const handleShowRejetter = () => setShowRejetter(true);
  //Composant cadre de la demande d'inscription du client
  function handleSelect (e)
  {
    if (e=="personalise")
    {
      document.querySelector("#causeRejetDesc").style.display = 'block';
    }
    else{
      document.querySelector("#causeRejetDesc").style.display = 'none';
    }
    setRejetVal(e)
  }
  function confirmerValider()
  {
    //Confirmer la validation de la demande d'inscription du client
    http.put(`valider_demande/${props.id_locataire}/demande/${props.demandeId}`).then((jResponse)=>{
      window.location.reload();
    }).catch((error)=>{
      alert("Une erreur est survenue, veuillez réessayer ultérieurement");
    });
  }
  function confirmerRejet()
  {
    //Confirmer le rejet de la demande d'inscription du client
    if(rejetVal != 0)
    {
      if (rejetVal==="personalise")
      {
        http.put(`refuser_demande/${props.id_locataire}/demande/${props.demandeId}`,{
          "objet" :"Votre demande d'inscription a été rejettée",
          "descriptif":document.querySelector("#causeRejetDesc textarea").value,
          }).then((jResponse)=>{
           window.location.reload();
          }).catch((error)=>{
            alert("Une erreur est survenue, veuillez réessayer ultérieurement");
            
          });
      }
      else{
        http.put(`refuser_demande/${props.id_locataire}/demande/${props.demandeId}`,{
          "objet" :"Votre demande d'inscription a été rejettée",
          "descriptif":rejetVal,
          }).then((jResponse)=>{
           window.location.reload();
          }).catch((error)=>{
            alert("Une erreur est survenue, veuillez réessayer ultérieurement");
            
          });
      }
  }
    
  }
  return (
    <div id= {"cadre"+props.demandeId} className='cadreInsc' >
        <div style={{
        backgroundImage: `url("${props.demandeur.photo_selfie}")`
      }}  className='cadreImg'></div>
        <div className='infoUser'>
            <h3 className='nomUser'>{props.demandeur.nom} {props.demandeur.prenom} <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" title="Plus d'informations" onClick={handleShow} /></h3>
            <h4 className='email'>{props.demandeur.email}</h4>
            <h4 className='pieceId' title="Vérifier la pièce d'identité" onClick={handleShowPID} >Pièce d'identité</h4>
        </div>
        <div className='actions'>
            <FontAwesomeIcon icon="fa-solid fa-check" title="Valider la demande" className="validerIcone" size="lg" onClick={()=>handleShowValider()} />
            <FontAwesomeIcon icon="fa-solid fa-trash" title="Rejetter la demande" className="rejetterIcone" size="lg" onClick={()=>handleShowRejetter()} />
        </div>
       
      <Modal
        dialogClassName="custom-dialog"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Plus d'informations</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="insc_modal_body">
        <div style={{
        backgroundImage: `url("${props.demandeur.photo_selfie}")`
      }}  className='cadreImg'></div>
        <div className='infoUser'>
           <h2 className='nomUser'>{props.demandeur.nom} {props.demandeur.prenom} </h2>
            <h4 className='email'><FontAwesomeIcon icon="fa-solid fa-envelope"  className="infoIcon" />{props.demandeur.email}</h4>
            
            <h4 className='numero_telephone'><FontAwesomeIcon icon="fa-solid fa-phone" className="infoIcon" />{props.demandeur.numero_telephone}</h4>
           <br/>
            <h4 className='InscpieceId' title="Vérifier la pièce d'identité" onClick={handleShowPID}>Pièce d'identité</h4>
          </div>
        </div>
        </Modal.Body>
        <Modal.Footer>
          <FontAwesomeIcon icon="fa-solid fa-check" title="Valider la demande" className="validerIcone" size="lg" onClick={()=>handleShowValider()}/>
          <FontAwesomeIcon icon="fa-solid fa-trash" title="Rejetter la demande" className="rejetterIcone" size="lg" onClick={()=>handleShowRejetter()}/>
        </Modal.Footer>
      </Modal>
      
      <Modal
        dialogClassName="custom-dialog2"
        show={showPId}
        onHide={handleClosePID}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Pièce d'identité de {props.demandeur.nom} {props.demandeur.prenom}</Modal.Title>
        </Modal.Header>
        <Modal.Body >
          
          <div className="pid_modal_body">
            <div style={{
            backgroundImage: `url("${props.demandeur.photo_identite_recto}")`
          }}  className='cadreImgPieceIdentite'></div>
            <div style={{
            backgroundImage: `url("${props.demandeur.photo_identite_verso}")`
          }}  className='cadreImgPieceIdentite'></div>
          </div>
        </Modal.Body>
        <Modal.Footer >
          <div className="modalActions">
            <FontAwesomeIcon icon="fa-solid fa-check" title="Valider la demande" className="validerIcone" size="lg" />
            <FontAwesomeIcon icon="fa-solid fa-trash" title="Rejetter la demande" className="rejetterIcone" size="lg" />
          </div>
        </Modal.Footer>
      </Modal>

      
      <Modal
        show={showValider}
        onHide={handleCloseValider}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Êtes vous sure de vouloir valider la demande d'inscription de {props.demandeur.nom} {props.demandeur.prenom} ?</Modal.Title>
        </Modal.Header>
        <Modal.Footer className="validerDiv">
          <Button title="Confirmer" class="buttonPrincipal" onClick={()=>confirmerValider()}/>
          <Button title="Annuler" class="buttonSecondaire" onClick={()=>handleCloseValider()}/>
        </Modal.Footer>
      </Modal>
      
      <Modal
        show={showRejetter}
        onHide={handleCloseRejetter}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Êtes vous sure de vouloir rejetter la demande d'inscription de {props.demandeur.nom} {props.demandeur.prenom} ?</Modal.Title>
        </Modal.Header>
        <Modal.Body className='rejetCauseDiv' >
        <DropdownButton id="causeRejetDrop" title="Cause du rejet"onSelect={(e)=>handleSelect(e)}>
          <Dropdown.Item eventKey="Pièce d'identité invalide">Pièce d'identité invalide</Dropdown.Item>
          <Dropdown.Item eventKey="Photo floue">Photo floue</Dropdown.Item>
          <Dropdown.Item eventKey="personalise">Cause personnalisée</Dropdown.Item>
        </DropdownButton>
        {
        <FloatingLabel id="causeRejetDesc" label="Votre message">
        <Form.Control
          as="textarea"
          placeholder="Cause de rejet personnalisée"
          style={{ height: '100px' }}
        />
      </FloatingLabel>
        }
        </Modal.Body>
        <Modal.Footer className="rejetterDiv">
          <Button title="Confirmer" class="buttonPrincipal" onClick={()=>confirmerRejet()}/>
          <Button title="Annuler" class="buttonSecondaire" onClick={()=>handleCloseRejetter()}/>
        </Modal.Footer>
      </Modal>
  </div>
  );
}

export default CadreDemandeInsc;