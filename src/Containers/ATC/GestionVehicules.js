import './stylesheets/GestionVehicules.css';
import {useContext, useEffect, useState} from "react";
import { UserContext } from "../../Context.js";
import ProfileVehicule from "./ProfileVehicule";
import http from "../../http.js";
import NavBarATC from './../../Composants/NavBarATC';
import { decryptData } from '../../crypto';
import { getCarLocations } from '../../firebase';
import { useAlert } from 'react-alert';
import { ClipLoader } from 'react-spinners';
import { Dropdown , DropdownButton } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import Button from "../../Composants/Button";
import Input from '../../Composants/Input';
function GestionVehicules() {
  //Page de gestion des véhicules 
  const alert = useAlert();
  const {setLoading,loading, createUser, user,createImage,/*getCurrentCredentials*/} = useContext(UserContext);
  const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
  const [listComptes, setVehicules]= useState([]); //liste affichée (on peut la filtrer, reordonner,...)
  let redirection = false;
  const navigate = useNavigate();
  const [typeCompteAdd, setTypeCompteAdd] = useState("Type du compte employé") 
  const [typeCompte, setTypeCompte] = useState("Tous les comptes") // Filtrer la liste des vehicules 
  const [listOrder, setOrder] = useState("Up"); // Ordonner la liste des vehicules
  const [searchFor, search] = useState("");  
  const [add, setAdd] = useState(false);
  const handleCloseAdd = () => setAdd(false);
  const handleShowAdd = () => setAdd(true);
  const [flotte, setFlotte]= useState([]);
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
    //Set la flotte avec les infos d'état (dans firebase)
    let tr = [];
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
    setFlotte(tr);
    }).catch(err=>{
      console.log(err)
      alert.error("Une erreur est survenue, veuillez réessayer ultérieurement.")
    })
  }, [querySnapshot]);
  
  useEffect(()=>{     
    let comptes=[];
    if (searchFor!=="")
    {
      document.querySelector("#compteSearchField").value=searchFor;
      comptes =flotte.filter((e)=>{
        return e.nom.toLowerCase().includes(searchFor.toLowerCase())|| e.prenom.toLowerCase().includes(searchFor.toLowerCase());
      });   
    }  
    else{
      comptes =flotte;
    }
    if (listOrder === "Up")
    {
      comptes = comptes.sort((a,b)=>{
        if ( a.nom < b.nom ){
          return -1;
        }
        if ( a.nom > b.nom ){
          return 1;
        }
        if ( a.prenom < b.prenom ){
          return -1;
        }
        if ( a.prenom > b.prenom ){
          return 1;
        }
        return 0;
       });
    }
    else{
      comptes= comptes.sort((a,b)=>{
        if ( a.nom < b.nom ){
          return 1;
        }
        if ( a.nom > b.nom ){
          return -1;
        }
        if ( a.prenom < b.prenom ){
          return 1;
        }
        if ( a.prenom > b.prenom ){
          return -1;
        }
        return 0;
       });
    }
    
    switch (typeCompte)
    {
      case "AM":
          setVehicules(comptes.filter((e)=>{
             return e.type_compte==="AM";
        }));
      break;
      case "ATC":
          setVehicules(comptes.filter((e)=>{
             return e.type_compte==="ATC";
            }));
      break;
      case "Décideurs":
          setVehicules(comptes.filter((e)=>{
             return e.type_compte==="Decideur";       
            }))  ;
      break;
      default : 
        setVehicules(comptes.filter((e)=>{
          return true;       
         }))  ;
       break;
    }  
  }, [flotte, searchFor, listOrder, typeCompte]);


  function setRedirection (dest)
  {
    // s'il est nécessaire de rediriger : se rediriger vers la destination
    redirection = dest;
  }
  function orderUp(event){
    //Re-Ordonner la liste des comptes
     if ((!event.target.classList.contains("disabledOrder"))&&(!event.target.classList.contains("selectedOrder")))
    {
        document.querySelector("#iconOrderDown").classList.remove("selectedOrder");
        document.querySelector("#iconOrderUp").classList.add("selectedOrder");
        setOrder("Up");
    } 
  }

  function orderDown(event){
    //Re-Ordonner la liste des comptes
    if ((!event.target.classList.contains("disabledOrder"))&&(!event.target.classList.contains("selectedOrder")))
     {
        document.querySelector("#iconOrderUp").classList.remove("selectedOrder");
        document.querySelector("#iconOrderDown").classList.add("selectedOrder");
        setOrder("Down");
     } 
 }
  function addModal()
  {

  }
  function addVehicle()
  {

  }
  function returnList()
  {

  }
  switch (window.location.pathname)
        {
          case "/atc/gestionvehicules":
          case "/atc/gestionvehicules/":
            return ( 
              <div id="gestionDesComptesDiv">
                <ClipLoader color={"#1B92A4"} loading={loading} css={style} size={50} />
                <NavBarATC />
                <div id="comptesListContainer">
                  {addModal()}
                            <div id="fitrageList">
                            <Button title="Ajouter un employé" btnClass="buttonPrincipal" onClick={handleShowAdd}/>
                              <div id="filtrageActs">
                        { /*     <DropdownButton id="typeCompteDrop" title={typeCompte} onSelect={(e)=>setTypeCompte(e)}>
                                <Dropdown.Item eventKey="Tous les comptes">Tous les comptes</Dropdown.Item>
                                {(user.est_root===true)&&<Dropdown.Item eventKey="ATC">ATC</Dropdown.Item>}
                                <Dropdown.Item eventKey="AM">AM</Dropdown.Item>
                                <Dropdown.Item eventKey="Décideurs">Décideurs</Dropdown.Item>
                              </DropdownButton>*/}
                            <div className="compteSearch">
                              <input type="text" placeholder="Recherche" id="compteSearchField"></input>
                              <FontAwesomeIcon id="vehiculesearchBtn" icon="fas fa-search" onClick={()=>search(document.querySelector("#compteSearchField").value)}/>
                            </div>
                            <div id="reorderIcons">
                              <FontAwesomeIcon className='reOrderIcon disabledOrder' id="iconOrderUp" icon="fas fa-angle-up " onClick={(event)=>orderUp(event)} />
                              <FontAwesomeIcon className='reOrderIcon disabledOrder' id="iconOrderDown" icon="fas fa-angle-down " onClick={(event)=>orderDown(event)}/>
                            </div>
                            </div>
                            </div>
                            <div id="comptesList">
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

export default GestionVehicules;