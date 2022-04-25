import './stylesheets/GestionDemandes.css';
import {useContext, useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom';
import { UserContext } from "../../Context.js";
import CadreDemandeInsc from "../../Composants/CadreDemandeInsc.js"
import NavBarATC from './../../Composants/NavBarATC';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import http from "../../http.js"
import { DropdownButton, Spinner, Dropdown } from 'react-bootstrap';
import {encryptData, decryptData} from "../../crypto";

import ClipLoader from "react-spinners/ClipLoader"
function GestionDemandes() {
  //Page de gestion des demandes (inscription + support) de l'ATC
  const {setLoading,loading,/*getCurrentCredentials*/} = useContext(UserContext);
  const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
  const refreshInterval = 120000; // temps d'attente avant d'actualiser les données (2 mins)
  const [listDemandes, setDemandes]= useState([]); //liste affichée (on peut la filtrer, reordonner,...)
  const [demandesFetched, setFetchedList] = useState([]); // liste récupérée de la bdd
  let redirection = false;
  const navigate = useNavigate();
  const [etatDmnd, setEtatDmnd] = useState("Toutes les demandes") // Filtrer la liste des demandes 
  const [listOrder, setOrder] = useState("Up"); // Ordonner la liste des demandes
  const [searchFor, search] = useState("")
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
      console.log("fetch demandes support")
    }
  }, [window.location.pathname]);

  useEffect(()=>{
    if (window.location.pathname==="/atc/gestiondemandes/inscription")
    {
      //récupérer les demandes d'inscription de la base de données
      let dmnd=[];
    if (searchFor!=="")
    {
      document.querySelector("#demandeSearchField").value = searchFor;
      dmnd =demandesFetched.filter((e)=>{
        return e.nom.toLowerCase().includes(searchFor.toLowerCase())|| e.prenom.toLowerCase().includes(searchFor.toLowerCase());
      });   
    }  
    else{
      dmnd =demandesFetched;
    }
    if (listOrder === "Up")
    {
      dmnd = dmnd.sort((a,b)=>{
        if ( a.date_inscription < b.date_inscription ){
          return 1;
        }
        if ( a.date_inscription > b.date_inscription ){
          return -1;
        }
        return 0;
       });
    }
    else{
      dmnd= dmnd.sort((a,b)=>{
        if ( a.date_inscription < b.date_inscription ){
          return -1;
        }
        if ( a.date_inscription > b.date_inscription ){
          return 1;
        }
        return 0;
       });
    }
    
    switch (etatDmnd)
    {
      case "Demandes en attente":
        document.querySelector("h2#etatDmndTitle").innerHTML = "Liste des demandes d'inscription en attente";
          setDemandes(dmnd.filter((e)=>{
             return e.statut==="en attente";
        }));
      break;
      case "Demandes validées":
        document.querySelector("h2#etatDmndTitle").innerHTML = "Liste des demandes d'inscription validées";
          setDemandes(dmnd.filter((e)=>{
             return e.statut==="validee";
            }));
      break;
      case "Demandes rejetées":
        document.querySelector("h2#etatDmndTitle").innerHTML = "Liste des demandes d'inscription rejetées";
          setDemandes(dmnd.filter((e)=>{
             return e.statut==="refusee";       
            }))  ;
      break;
      default : 
        document.querySelector("h2#etatDmndTitle").innerHTML = "Liste des demandes d'inscription";
        setDemandes(dmnd.filter((e)=>{
          return true;       
         }))  ;
       break;
    }  
    }
    else{
      // fetch demandes support 
      console.log("demandes support displayed")
    }
    
  }, [demandesFetched, searchFor, listOrder, etatDmnd])
  function setRedirection (dest)
  {
    // s'il est nécessaire de rediriger : se rediriger vers la destination
    redirection = dest;
  }

  async function getDemandesInsc() {
    
    //const currCre =  await getCurrentCredentials();
     //récupérer les demandes d'inscription de la base de données
     document.querySelectorAll("#reorderIcons>.reOrderIcon").forEach((icon)=>{
      icon.classList.add("disabledOrder")
      icon.classList.remove("selectedOrder")
    })
    if (window.location.pathname==="/atc/gestiondemandes/inscription")
    {
      setLoading(true)
      await http.get("gestionprofils/locataire/", {"headers": {
        "token" : decryptData(window.localStorage.getItem("currTok")),
        "id_sender": decryptData(window.localStorage.getItem("curruId")),
      }}).then((jResponse)=>{
      if(jResponse.data.length!==0)
      {
        document.querySelectorAll("#reorderIcons>.reOrderIcon").forEach((icon)=>{
          icon.classList.remove("disabledOrder")
          icon.classList.remove("selectedOrder")
        })
        document.querySelector("#iconOrder"+listOrder).classList.add("selectedOrder");
        setFetchedList(jResponse.data);
      }
      else if (demandesFetched.length!==0)
        {
          setFetchedList(demandesFetched);
        }
      else{
          setFetchedList(jResponse.data);
        }
      setLoading(false)
      }).catch((error)=>{
        setLoading(false)
        setFetchedList([]);
      });
    }
  }
 
  function orderUp(event){
    //Re-Ordonner la liste des demandes
     if ((!event.target.classList.contains("disabledOrder"))&&(!event.target.classList.contains("selectedOrder")))
    {
        document.querySelector("#iconOrderDown").classList.remove("selectedOrder");
        document.querySelector("#iconOrderUp").classList.add("selectedOrder");
        setOrder("Up");
    } 
  }

  function orderDown(event){
    //Re-Ordonner la liste des demandes
    if ((!event.target.classList.contains("disabledOrder"))&&(!event.target.classList.contains("selectedOrder")))
     {
        document.querySelector("#iconOrderUp").classList.remove("selectedOrder");
        document.querySelector("#iconOrderDown").classList.add("selectedOrder");
        setOrder("Down");
     } 
 }

  function returnList ()
  {
    //Retourner une titre si la liste des demandes est vide/les données se chargent OU les cadres des demandes
      if (demandesFetched.length===0)
      {
        if (loading)
        {
          return (<h3 id="inscNoDemande">Rien à afficher pour le moment.</h3>)
        }
        else{
          return (<h3 id="inscNoDemande">La liste des demandes est vide pour le moment.&emsp;<Spinner animation="border" /></h3>)
        }
       
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
                  <div id="vueNotChosen" onClick={()=>navigate("/atc/gestiondemandes/support")}>
                    Demandes de support
                  </div>
                </div>
                <div id="demandesInsc">
                  <div id="fitrageList">
                    <h2 id="etatDmndTitle">Liste des demandes d'inscription</h2>
                    <div id="filtrageActs">
                    <DropdownButton id="etatDmndDrop" title={etatDmnd} onSelect={(e)=>setEtatDmnd(e)}>
                      <Dropdown.Item eventKey="Toutes les Demandes">Toutes les Demandes</Dropdown.Item>
                      <Dropdown.Item eventKey="Demandes validées">Demandes validées</Dropdown.Item>
                      <Dropdown.Item eventKey="Demandes en attente">Demandes en attente</Dropdown.Item>
                      <Dropdown.Item eventKey="Demandes rejetées">Demandes rejetées</Dropdown.Item>
                    </DropdownButton>
                  <div className="demandesSearch">
                    <input type="text" placeholder="Recherche" id="demandeSearchField"></input>
                    <FontAwesomeIcon id="demandeSearchBtn" icon="fas fa-search" onClick={()=>search(document.querySelector("#demandeSearchField").value)}/>
                  </div>
                  <div id="reorderIcons">
                    <FontAwesomeIcon className='reOrderIcon disabledOrder' id="iconOrderUp" icon="fas fa-angle-up " onClick={(event)=>orderUp(event)} />
                    <FontAwesomeIcon className='reOrderIcon disabledOrder' id="iconOrderDown" icon="fas fa-angle-down " onClick={(event)=>orderDown(event)}/>
                  </div>
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
                  <div id="vueNotChosen" onClick={()=>navigate("/atc/gestiondemandes/inscription")}>
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
      <ClipLoader color={"#1B92A4"} loading={loading} css={style} size={50} />
      <NavBarATC />
        {gestionDemands()} 
    </div>
  );
}

export default GestionDemandes;