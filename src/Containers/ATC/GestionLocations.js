import './stylesheets/GestionLocations.css';
import {useContext, useEffect, useState} from "react";
import { UserContext } from "../../Context.js";
import InfoLocation from "./InfoLocation";
import http from "../../http.js";
import NavBarATC from './../../Composants/NavBarATC';
import { decryptData } from '../../crypto';
import { getCarLocations } from '../../firebase';
import { useAlert } from 'react-alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DropdownButton,  Dropdown, Modal } from 'react-bootstrap';
import { ClipLoader } from 'react-spinners';
import Button from "../../Composants/Button";
import { useNavigate } from 'react-router-dom';
import CadreLocation from '../../Composants/CadreLocation';
function GestionLocations() {
  //Page de gestion locations
  const alert = useAlert();
  const {user, loggingOut,setLoading,loading} = useContext(UserContext);
  const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
  let redirection = false;
  const navigate = useNavigate();
  const [dispoLocation, setTypeLocation] = useState("Toutes les locations") // Filtrer la liste des locations 
  const [listOrder, setOrder] = useState("Up"); // Ordonner la liste des locations
  const [searchFor, search] = useState("");  
  const [listLocations, setListLocations]= useState([]);
  const [locations, setLocations] = useState([]) //liste affichée (on peut la filtrer, reordonner,...)
  const [querySnapshot, setSnapshot] = useState([]);
  useEffect(()=>{
    async function getTrajets ()
      {
        await getCarLocations(setSnapshot)
      }
        getTrajets () 
    }
    ,[])
  useEffect(()=>{
    //Set la listLocations avec les infos d'état (dans firebase)
    let tr = [];
    //TODO : instead of vehicles, get locations : no fct yet
    http.get("/flotte/vehicule/", {"headers": {
      "token" : decryptData(window.localStorage.getItem("currTok")),
      "id_sender": decryptData(window.localStorage.getItem("curruId")),
    }}).then((jResponse)=>{
    querySnapshot.forEach((doc) => {
      if (jResponse.data.some(e => e.numero_chassis === doc.id))
      {
        let t = {...doc.data(),...jResponse.data.find((vehicule)=>{
          if (vehicule.numero_chassis===doc.id)
          {
            return true;
          }
          return false;
        })};
        tr.push(t)
      }
      
        
    });
    setListLocations(tr);
    }).catch(err=>{
      console.log(err)
      alert.error("Une erreur est survenue, veuillez réessayer ultérieurement.")
    })
  }, [querySnapshot])
  
  useEffect(()=>{     
    let locs=[];
    if (searchFor!=="")
    {
      document.querySelector("#vehiculeSearchField").value=searchFor;
      locs =listLocations.filter((e)=>{
        return e.modele.toLowerCase().includes(searchFor.toLowerCase());
      });   
    }  
    else{
      locs =listLocations;
    }
    if (listOrder === "Up")
    {
      locs = locs.sort((a,b)=>{
        if ( a.modele < b.modele ){
          return -1;
        }
        if ( a.modele > b.modele ){
          return 1;
        }
        if ( a.numero_chassis < b.numero_chassis ){
          return -1;
        }
        if ( a.numero_chassis > b.numero_chassis ){
          return 1;
        }
        return 0;
       });
    }
    else{
      locs= locs.sort((a,b)=>{
        if ( a.modele < b.modele ){
          return 1;
        }
        if ( a.modele > b.modele ){
          return -1;
        }
        if ( a.numero_chassis < b.numero_chassis ){
          return 1;
        }
        if ( a.numero_chassis > b.numero_chassis ){
          return -1;
        }
        return 0;
       });
    }
    
    switch (dispoLocation)
    {
      case "Véhicules disponnibles":
          setLocations(locs.filter((e)=>{
             return e.disponible===true;
        }));
      break;
      case "Véhicules louées":
        setLocations(locs.filter((e)=>{
             return e.disponible===false;
            }));
      break;
      default : 
      setLocations(locs.filter((e)=>{
          return true;       
         }))  ;
       break;
    }  
  }, [listLocations, searchFor, listOrder, dispoLocation]);

  function setRedirection (dest)
  {
    // s'il est nécessaire de rediriger : se rediriger vers la destination
    redirection = dest;
  }
  function orderUp(event){
    //Re-Ordonner la liste des véhicules
     if ((!event.target.classList.contains("disabledOrder"))&&(!event.target.classList.contains("selectedOrder")))
    {
        document.querySelector("#iconOrderDown").classList.remove("selectedOrder");
        document.querySelector("#iconOrderUp").classList.add("selectedOrder");
        setOrder("Up");
    } 
  }

  function orderDown(event){
    //Re-Ordonner la liste des véhicules
    if ((!event.target.classList.contains("disabledOrder"))&&(!event.target.classList.contains("selectedOrder")))
     {
        document.querySelector("#iconOrderUp").classList.remove("selectedOrder");
        document.querySelector("#iconOrderDown").classList.add("selectedOrder");
        setOrder("Down");
     } 
 }
 function returnList()
 {
   if (listLocations.length===0)
     {
       return (<h3 id="noEmp">La liste de locations est vide.</h3>)
     }
   else if (locations.length===0)
  {
    return (<h3 id="noEmp">Aucune location ne correspond à votre requête.</h3>)
  }
   else{
     return (
        locations.map((location) => {
               return (
                 <CadreLocation/>
               )
         }));}
 }
  switch (window.location.pathname)
        {
          case "/atc/gestionlocations":
          case "/atc/gestionlocations/":
            return ( 
              <div id="gestionDesLocationsDiv">
                <ClipLoader color={"#1B92A4"} loading={loading} css={style} size={50} />
                <NavBarATC />
                <div id="locationsListContainer">
                            <div id="fitrageList">
                              <div id="filtrageActs">
                             <DropdownButton id="dispoLocationDrop" title={dispoLocation} onSelect={(e)=>setTypeLocation(e)}>
                                <Dropdown.Item eventKey="Toutes les locations">Toutes les locations</Dropdown.Item>
                                <Dropdown.Item eventKey="Locations validées">Locations validées </Dropdown.Item>
                                <Dropdown.Item eventKey="Locations en cours">Locations en cours </Dropdown.Item>
                                <Dropdown.Item eventKey="Locations terminées">Locations terminées</Dropdown.Item>
                              </DropdownButton>
                            <div className="locationSearch">
                              <input type="text" placeholder="Recherche" id="locationSearchField"></input>
                              <FontAwesomeIcon id="locationSearchBtn" icon="fas fa-search" onClick={()=>search(document.querySelector("#locationSearchField").value)}/>
                            </div>
                            <div id="reorderIcons">
                              <FontAwesomeIcon className='reOrderIcon disabledOrder' id="iconOrderUp" icon="fas fa-angle-up " onClick={(event)=>orderUp(event)} />
                              <FontAwesomeIcon className='reOrderIcon disabledOrder' id="iconOrderDown" icon="fas fa-angle-down " onClick={(event)=>orderDown(event)}/>
                            </div>
                            </div>
                            </div>
                            <div id="locationsList">
                              {
                                returnList()
                              }
                            </div>
                          </div>
                </div>
            );
            
          default :
          setRedirection('/404');
          return(null);
        }
}

export default GestionLocations;