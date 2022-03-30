import './stylesheets/GestionDemandes.css';
import {useContext, useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom';
import { UserContext } from "../../Context.js";
import CadreDemandeInsc from "../../Composants/CadreDemandeInsc.js"
import NavBarATC from './../../Composants/NavBarATC';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import http from "../../http.js"
import { DropdownButton, Spinner, Dropdown } from 'react-bootstrap';
function GestionDemandes() {
  //Page de gestion des demandes (inscription + support) de l'ATC
  const refreshInterval = 120000; // temps d'attente avant d'actualiser les données (2 mins)
  const {user} = useContext(UserContext);
  const [listDemandes, setDemandes]= useState([]); //liste affichée (on peut la filtrer, reordonner,...)
  const [demandesFetched, setFetchedList] = useState([]); // liste récupérée de la bdd
  let redirection = false;
  const navigate = useNavigate();
  const [etatDmnd, setEtatDmnd] = useState("Toutes les demandes")
  useEffect (()=>{
    //Redirection si URL incorrect / incomplet
    if (redirection!==false)
    {
     navigate(redirection, { replace: true })
    }
  }, []);

  useEffect(()=>{
    //Récupérer les données selon l'onglet courrant
    if (window.location.pathname==="/atc/gestiondemandes/inscription")
    {
      //récupérer les demandes d'inscription de la base de données
      getDemandesInsc();
      const interval=setInterval(()=>{
        getDemandesInsc()
       },refreshInterval)
       return()=>clearInterval(interval) 
         
    }
    else{
      // fetch demandes support 
    }
  }, [window.location.pathname]);

  useEffect(()=>{
    setDemandes(demandesFetched)
  }, [demandesFetched])
  function setRedirection (dest)
  {
    // s'il est nécessaire de rediriger : se rediriger vers la destination
    redirection = dest;
  }

  async function getDemandesInsc() {
     //récupérer les demandes d'inscription de la base de données
    if (window.location.pathname==="/atc/gestiondemandes/inscription")
    {
     
      await http.get("demandesinscription").then((jResponse)=>{
        document.querySelectorAll("#reorderIcons>*").forEach((icon)=>{
          icon.classList.remove("disabledOrder")
      })
  /*      let data = []
        await Promise.all(jResponse.data.map(async(demande)=>{
        // Récupérer les informations du locataire à partir de la base de données selon la demande
        await http.get(`locataire/${demande.email}`).then((lResponse)=>{
          
         if (lResponse.data.length!== 0)
         {
          data.push({demande: demande, locataire: lResponse.data})
         }
        }).catch((error)=>{
          console.log(error)
          data = [];
        })
      }))
      setDemandes(data)*/
      setFetchedList(jResponse.data);
      
      }).catch((error)=>{
        document.querySelectorAll("#reorderIcons>*").forEach((icon)=>{
          icon.classList.add("disabledOrder")
      })
        setFetchedList([]);
      });
    }
  }
  function handleSelect (e)
  {
    setEtatDmnd(e)
    setDemandes(listDemandes); // filtrer les demandes selon l'état
    switch (e)
    {
      case "Demandes en attente":
        document.querySelector("h2#etatDmndTitle").innerHTML = "Liste des demandes d'inscription en attente"
      break;
      case "Demandes validées":
        document.querySelector("h2#etatDmndTitle").innerHTML = "Liste des demandes d'inscription validées"
      break;
      case "Demandes rejetées":
        document.querySelector("h2#etatDmndTitle").innerHTML = "Liste des demandes d'inscription rejetées"
      break;
      default : 
        document.querySelector("h2#etatDmndTitle").innerHTML = "Liste des demandes d'inscription"
       break;
    }
  }
  function orderUp(event){
    //Re-Ordonner la liste des demandes
     if ((!event.target.classList.contains("selectedOrder"))&&(!event.target.classList.contains("disabledOrder")))
    {
          document.querySelectorAll("#reorderIcons>*").forEach((icon)=>{
          icon.classList.remove("selectedOrder")
          console.log(icon.classList)
      })
      event.target.classList.add("selectedOrder")
      setDemandes(listDemandes.reverse());
      console.log(event.target.classList.classList)
    } 
  }

  function orderDown(event){
    //Re-Ordonner la liste des demandes
     if ((!event.target.classList.contains("selectedOrder"))&&(!event.target.classList.contains("disabledOrder")))
     {
           document.querySelectorAll("#reorderIcons>*").forEach((icon)=>{
           icon.classList.remove("selectedOrder")
       })
       event.target.classList.add("selectedOrder")
       setDemandes(listDemandes.reverse());
     } 
 }

  function search(){

    //setDemandes([])
  }

  function returnList ()
  {
    //Retourner une titre si la liste des demandes est vide OU les cadres des demandes
      if (demandesFetched.length===0)
      {
        return (<h3 id="inscNoDemande">La liste des demandes est vide pour le moment.&emsp;<Spinner animation="border" /></h3>)
      }
    else if (listDemandes.length===0)
   {
     return (<h3 id="inscNoDemande">Aucune demande ne correspond à votre requête.</h3>)
   }
    else{
      return (
            listDemandes.map((laDemande) => {
                return (
                  <CadreDemandeInsc key={laDemande.id_demande_inscription} demandeId ={laDemande.id_demande_inscription} id_locataire={laDemande.id_locataire} demande={laDemande}/>
                )
          }));}
  }

  function gestionDemands ()
  {
    //fonction qui gere la liste des demandes affichées
    // get list where statut="en attente" and order by date_inscription
    switch (window.location.pathname)
        {
          // Gestion des Onglets de demandes
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
                    <h2 id="etatDmndTitle">Liste des demandes d'inscription</h2>
                    <DropdownButton id="etatDmndDrop" title={etatDmnd} onSelect={(e)=>handleSelect(e)}>
                      <Dropdown.Item eventKey="Toutes les Demandes">Toutes les Demandes</Dropdown.Item>
                      <Dropdown.Item eventKey="Demandes validées">Demandes validées</Dropdown.Item>
                      <Dropdown.Item eventKey="Demandes en attente">Demandes en attente</Dropdown.Item>
                      <Dropdown.Item eventKey="Demandes rejetées">Demandes rejetées</Dropdown.Item>
                    </DropdownButton>
                  <div className="demandesSearch">
                    <input type="email" placeholder="Recherche"></input>
                    <FontAwesomeIcon id="demandeSearchBtn" icon="fas fa-search" onClick={()=>search()}/>
                  </div>
                  <div id="reorderIcons">
                    <FontAwesomeIcon icon="fas fa-angle-up disabledOrder" onClick={(event)=>orderUp(event)} />
                    <FontAwesomeIcon icon="fas fa-angle-down disabledOrder" onClick={(event)=>orderDown(event)}/>
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
    </div>
  );
}

export default GestionDemandes;