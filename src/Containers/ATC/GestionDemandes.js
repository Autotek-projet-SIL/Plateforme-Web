import './stylesheets/GestionDemandes.css';
import {useContext, useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom';
import { UserContext } from "../../Context.js";
import CadreDemandeInsc from "../../Composants/CadreDemandeInsc.js"
import NavBarATC from './../../Composants/NavBarATC';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import http from "../../http.js"
function GestionDemandes() {
  //Page de gestion des demandes (inscription + support) de l'ATC
  const {user, loggingOut} = useContext(UserContext);
  const [listDemandes, setDemandes]= useState([]);
  
  let redirection = false;
  const navigate = useNavigate();
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
    
  }, []);
  useEffect(()=>{
    if (window.location.pathname==="/atc/gestiondemandes/inscription")
    {
      //fetch demandes inscription
      let data = []
      http.get("demandesinscription").then(async(jResponse)=>{
        document.querySelectorAll("#reorderIcons>*").forEach((icon)=>{
          icon.classList.remove("disabledOrder")
      })
        let data = []
        await Promise.all(jResponse.data.map(async(demande)=>{
        // TO DO : query to get locataire whose id_locataire= demande.id_locataire : 
        //id_locataire
        //(`locataire/${demande.email}`)
       await http.get(`locataire/lekhelmohammed@gmail.com`).then((lResponse)=>{
         
         data.push({demande: demande, locataire: lResponse.data})
        }).catch((error)=>{
          console.log(error)
          data = [];
        })
      }))
      setDemandes(data)
      }).catch((error)=>{
        document.querySelectorAll("#reorderIcons>*").forEach((icon)=>{
          icon.classList.add("disabledOrder")
      })
        setDemandes([]);
      });
      
    }
    else{
      // fetch demandes support 
    }
  }, [window.location.pathname])
  function orderUp(event){
     if ((!event.target.classList.contains("selectedOrder"))&&(!event.target.classList.contains("disabledOrder")))
    {
      document.querySelectorAll("#reorderIcons>*").forEach((icon)=>{
          icon.classList.add("disabledOrder")
      })
      event.target.classList.add("selectedOrder")
      event.target.classList.remove("disabledOrder")
      setDemandes(listDemandes.reverse());
    }
  }
  function orderDown(event){
    if ((!event.target.classList.contains("selectedOrder"))&&(!event.target.classList.contains("disabledOrder")))
   {
      document.querySelectorAll("#reorderIcons>*").forEach((icon)=>{
          icon.classList.add("disabledOrder")
      })
      event.target.classList.add("selectedOrder")
      event.target.classList.remove("disabledOrder")
      setDemandes(listDemandes.reverse());
   }
 }
  function search(){

  }
  function returnList ()
  {
      if (listDemandes.length===0)
    {
      return (<h3>Aucune demande en attente pour le moment.</h3>)
    }
    else{
      
      return (
    listDemandes.map((laDemande) => {
        return (
          <CadreDemandeInsc key={laDemande.demande.id_demande_inscription} demandeId ={laDemande.demande.id_demande_inscription} id_locataire={laDemande.demande.id_locataire} demandeur={laDemande.locataire[0]}/>
        )
  }));}
  }
  function gestionDemands ()
  {
    //fonction qui gere la liste des demandes affichées
    // TO DO : get list where statut="en attente" and order by date_inscription
          let list = [{id_demande_inscription:1, id_locataire: 5}, {id_demande_inscription:2, id_locataire: 6}, {id_demande_inscription:3, id_locataire: 7}, {id_demande_inscription:4, id_locataire: 8}];
    switch (window.location.pathname)
        {
          // Onglet de demandes
          
          case "/atc/gestiondemandes/inscription/":
          case "/atc/gestiondemandes":
          case "/atc/gestiondemandes/":
            setRedirection("/atc/gestiondemandes/inscription");
            return(null);
            
          case "/atc/gestiondemandes/inscription":
            return (
              <div id="pageDemandes">
                <div id="demandesVues">
                  <div id="vueChosen">
                    Demandes d'inscription
                  </div>
                  <div id="vueNotChosen" onClick={()=>navigate("/atc/gestiondemandes/support", { replace: true })}>
                    Demandes de support
                  </div>
                </div>
                <div id="demandesInsc">
                  <div id="fitrageList">
                  <div className="demandesSearch">
                    <input type="email" placeholder="Recherche"></input>
                    <FontAwesomeIcon id="demandeSearchBtn" icon="fas fa-search" onClick={()=>search()}/>
                  </div>
                  <div id="reorderIcons">
                    <FontAwesomeIcon icon="fas fa-angle-up" onClick={(event)=>orderUp(event)} />
                    <FontAwesomeIcon icon="fas fa-angle-down" onClick={(event)=>orderDown(event)}/>
                  </div>
                  </div>
                  <div id="demandesList">
                    {
                      returnList()
                    }
                  </div>
                </div>
              </div>
            );
          break;
          case "/atc/gestiondemandes/support":
            return (
              <div id="pageDemandes">
                <div id="demandesVues">
                  <div id="vueNotChosen" onClick={()=>navigate("/atc/gestiondemandes/inscription", { replace: true })}>
                    Demandes d'inscription
                  </div>
                  <div id="vueChosen" >
                    Demandes de support
                  </div>
                </div>
              </div>
            );
          default :
          setRedirection('/404');
          return(null);
    
      }    
  }
  
  return (
    
    <div id="gestionDemandesDiv">
      <NavBarATC />
        {gestionDemands()} 
      <footer> </footer> 
    </div>
  );
}

export default GestionDemandes;