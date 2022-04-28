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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import Button from "../../Composants/Button";
import Input from '../../Composants/Input';
import CadreVehicule from '../../Composants/CadreVehicule';
import { DropdownButton,  Dropdown, Modal } from 'react-bootstrap';
function GestionVehicules() {
  //Page de gestion des véhicules 
  const alert = useAlert();
  const {setLoading,loading, createUser, user,createImage,/*getCurrentCredentials*/} = useContext(UserContext);
  const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
  const [listVehicules, setVehicules]= useState([]); //liste affichée (on peut la filtrer, reordonner,...)
  let redirection = false;
  const navigate = useNavigate();
  const [dispoVehicule, setTypeVehicule] = useState("Tous les vehicules") // Filtrer la liste des vehicules 
  const [listOrder, setOrder] = useState("Up"); // Ordonner la liste des vehicules
  const [searchFor, search] = useState("");  
  const [add, setAdd] = useState(false);
  const handleCloseAdd = () => setAdd(false);
  const handleShowAdd = () => setAdd(true);
  const [flotte, setFlotte]= useState([]);
  const [selectedBrand, setSelectedBrand]= useState([]);
  const [selectedModele, setSelectedModele]= useState([]);
  const [selectedAm, setSelectedAm]= useState("L'agent de maintenance responsable");
  const [brands, setBrands] = useState("La marque du véhicule");
  const [modeles, setModeles] = useState("Le modéle du véhicule");
  const [listAm, setListAm] = useState([]);
  const [querySnapshot, setSnapshot] = useState([]);
  useEffect(()=>{
    async function getTrajets ()
      {
        await getCarLocations(setSnapshot)
      }
        getTrajets () 
     /*   http.get("https://the-vehicles-api.herokuapp.com/brands/").then((response)=>{
          setBrands(response.data);
        }).catch(err=>{
          alert.error("Une erreur est survenue lors du chargement des données. Vérifiez votre connexion.")
        })*/
        http.get("gestionprofils/am/", {"headers": {
          "token" : decryptData(window.localStorage.getItem("currTok")),
          "id_sender": decryptData(window.localStorage.getItem("curruId")),
        }}).then((response)=>{
            setListAm(response.data);
        }).catch((err)=>{
          alert.error("Une erreur est survenue lors du chargement des données. Vérifiez votre connexion.")
        })
    }
    ,[])
  useEffect(()=>{
  /*  http.get("https://the-vehicles-api.herokuapp.com/models?brandId="+selectedBrand.id).then((response)=>{
        setModeles(response.data);
        }).catch(err=>{
          alert.error("Une erreur est survenue lors du chargement des données. Vérifiez votre connexion.")
        })*/
  }, [selectedBrand])
  
  useEffect(()=>{
    //Set la flotte avec les infos d'état (dans firebase)
     document.querySelectorAll("#reorderIcons>.reOrderIcon").forEach((icon)=>{
      icon.classList.add("disabledOrder")
      icon.classList.remove("selectedOrder")
    })
    setLoading(true)
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
    if(tr.length!==0)
      {
        document.querySelectorAll("#reorderIcons>.reOrderIcon").forEach((icon)=>{
          icon.classList.remove("disabledOrder")
          icon.classList.remove("selectedOrder")
        })
        document.querySelector("#iconOrder"+listOrder).classList.add("selectedOrder");
      }
    setLoading(false)
    }).catch(err=>{
      setLoading(false)
      console.log(err)
      alert.error("Une erreur est survenue, veuillez réessayer ultérieurement.")
    })
  }, [querySnapshot]);
  
  useEffect(()=>{     
    let vehicules=[];
    if (searchFor!=="")
    {
      document.querySelector("#vehiculeSearchField").value=searchFor;
      vehicules =flotte.filter((e)=>{
        return e.modele.toLowerCase().includes(searchFor.toLowerCase());
      });   
    }  
    else{
      vehicules =flotte;
    }
    if (listOrder === "Up")
    {
      vehicules = vehicules.sort((a,b)=>{
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
      vehicules= vehicules.sort((a,b)=>{
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
    
    switch (dispoVehicule)
    {
      case "Véhicules disponnibles":
          setVehicules(vehicules.filter((e)=>{
             return e.disponible===true;
        }));
      break;
      case "Véhicules louées":
          setVehicules(vehicules.filter((e)=>{
             return e.disponible===false;
            }));
      break;
      default : 
        setVehicules(vehicules.filter((e)=>{
          return true;       
         }))  ;
       break;
    }  
  }, [flotte, searchFor, listOrder, dispoVehicule]);


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
 function addVehicle()
 {
/*
    dispo true 
    destination : 0
    kilometrage 0

    temperature 0 */
 }
  function addModal()
  {
    /*
    num chassis  *
    marque --
    modele--
    couleur *
    type vehicule--
    am
    img
    latitude longitude : park--
    */
    return(
      <Modal
        show={add}
        onHide={handleCloseAdd}
        backdrop="static"
        keyboard={false}
        centered
        dialogClassName="custom-dialog-add"
      >
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un véhicule</Modal.Title>
        </Modal.Header>
        <Modal.Body id="addModalBody">
        <Input label="Numéro du chassis" inputClass="" containerClass="formAddVecInput" id="numChassis" fieldType="text"/>
        <Input label="Couleur du véhicule" inputClass="" containerClass="formAddVecInput" id="vecColor" fieldType="text"/>
        <DropdownButton id="dropDownAdd" title={selectedAm} onSelect={(e)=>setSelectedBrand(e)}>
          {
            listAm.map(am =>{
              return(<Dropdown.Item eventKey={am.id_am}>{am.nom +" " + am.prenom}</Dropdown.Item>)
            })
          }
        </DropdownButton>
        </Modal.Body>
        <Modal.Footer >
        <Button title="Ajouter" btnClass="buttonPrincipal" onClick={()=>{addVehicle();}}/>
        <div style={{
          display: 'flex',
          margin:0,
          padding:0
        }}>
        <input
        type="file"
        accept="image/*"
        style={{ display: 'none', margin:0 }}
        id="import_emp_pdp"
      />
      <label htmlFor="import_emp_pdp" >
        <Button title="Importer la photo de profile" btnClass="buttonSecondaire footerBtn" variant="contained" color="primary" component="span" onClick={(()=>{document.querySelector("#import_emp_pdp").click()})}/>
      </label>
        </div>
        <Button title="Annuler" btnClass="buttonSecondaire" onClick={()=>{handleCloseAdd();}}/>
        </Modal.Footer>
      </Modal>
    );
  }
  function returnList()
  {
    if (flotte.length===0)
      {
        return (<h3 id="noEmp">La liste des véhicules est vide.</h3>)
      }
    else if (listVehicules.length===0)
   {
     return (<h3 id="noEmp">Aucun compte ne correspond à votre requête.</h3>)
   }
    else{
      return (
            listVehicules.map((vehicule) => {
              console.log(vehicule)
                return (
                  <CadreVehicule key={vehicule.numero_chassis} id={vehicule.numero_chassis} vehicule={vehicule}></CadreVehicule>
                )
          }));}
  }
  switch (window.location.pathname)
        {
          case "/atc/gestionvehicules":
          case "/atc/gestionvehicules/":
            return ( 
              <div id="gestionDesVehiculesDiv">
                <ClipLoader color={"#1B92A4"} loading={loading} css={style} size={50} />
                <NavBarATC />
                <div id="vehiculesListContainer">
                  {addModal()}
                            <div id="fitrageList">
                            <Button title="Ajouter un véhicule" btnClass="buttonPrincipal" onClick={handleShowAdd}/>
                              <div id="filtrageActs">
                             <DropdownButton id="dispoVehiculeDrop" title={dispoVehicule} onSelect={(e)=>setTypeVehicule(e)}>
                                <Dropdown.Item eventKey="Tous les véhicules">Tous les véhicules</Dropdown.Item>
                                <Dropdown.Item eventKey="Véhicules disponnibles">Véhicules disponnibles </Dropdown.Item>
                                <Dropdown.Item eventKey="Véhicules louées">Véhicules louées</Dropdown.Item>
                              </DropdownButton>
                            <div className="vehiculeSearch">
                              <input type="text" placeholder="Recherche" id="vehiculeSearchField"></input>
                              <FontAwesomeIcon id="vehiculesearchBtn" icon="fas fa-search" onClick={()=>search(document.querySelector("#vehiculeSearchField").value)}/>
                            </div>
                            <div id="reorderIcons">
                              <FontAwesomeIcon className='reOrderIcon disabledOrder' id="iconOrderUp" icon="fas fa-angle-up " onClick={(event)=>orderUp(event)} />
                              <FontAwesomeIcon className='reOrderIcon disabledOrder' id="iconOrderDown" icon="fas fa-angle-down " onClick={(event)=>orderDown(event)}/>
                            </div>
                            </div>
                            </div>
                            <div id="vehiculesList">
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