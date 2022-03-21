import './stylesheets/cadreDemandeInsc.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function CadreDemandeInsc(props) {
  
  //Composant cadre de la demande d'inscription du client 
  return (
    <div id= {"cadre"+props.demandeId} className='cadreInsc' >
        <div style={{
        backgroundImage: `url("${props.demandeur.photoSelfie}")`
      }}  className='cadreImg'></div>
        <div className='infoUser'>
            <h3 className='nomUser'>{props.demandeur.nom} {props.demandeur.prenom} <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" title="Plus d'informations"  /></h3>
            <h4 className='email'>{props.demandeur.email}</h4>
            <h4 className='pieceId'>Pièce d'identité</h4>
        </div>
        <div className='actions'>
            <FontAwesomeIcon icon="fa-solid fa-check" title="Valider la demande" className="validerIcone" size="lg" />
            <FontAwesomeIcon icon="fa-solid fa-trash" title="Rejetter la demande" className="rejetterIcone" size="lg" />
        </div>
        
  </div>
  );
}

export default CadreDemandeInsc;