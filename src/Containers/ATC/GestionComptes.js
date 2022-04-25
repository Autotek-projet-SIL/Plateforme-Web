import './stylesheets/GestionComptes.css'
import ProfileATC from "./ProfileATC";
import ProfileAM from "./ProfileAM";
import ProfileDecideur from "./ProfileDecideur";
import {useContext, useEffect, useState} from "react";
import {Route, useNavigate} from 'react-router-dom';
import { UserContext } from "../../Context.js";
import CadreCompte from "../../Composants/CadreCompte"
import NavBarATC from './../../Composants/NavBarATC';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import http from "../../http.js";
import axios from 'axios';
import { DropdownButton, Spinner, Dropdown, Modal } from 'react-bootstrap';
import {encryptData, decryptData} from "../../crypto";
import { ClipLoader } from 'react-spinners';
import Button from "../../Composants/Button";
import Input from '../../Composants/Input';
import { useAlert } from 'react-alert';
function GestionComptes() {
  //Page de gestion des comptes de l'ATC
  const alert = useAlert();
  const {setLoading,loading, createUser, user,createImage,/*getCurrentCredentials*/} = useContext(UserContext);
  const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
  const [listComptes, setComptes]= useState([]); //liste affichée (on peut la filtrer, reordonner,...)
  const [comptesFetched, setFetchedList] = useState([]); // liste récupérée de la bdd
  let redirection = false;
  const navigate = useNavigate();
  const [typeCompteAdd, setTypeCompteAdd] = useState("Type du compte employé") 
  const [typeCompte, setTypeCompte] = useState("Tous les comptes") // Filtrer la liste des comptes 
  const [listOrder, setOrder] = useState("Up"); // Ordonner la liste des comptes
  const [searchFor, search] = useState("");

  
  const [add, setAdd] = useState(false);
  const handleCloseAdd = () => setAdd(false);
  const handleShowAdd = () => setAdd(true);

  useEffect (()=>{
    //Redirection si URL incorrect / incomplet
    if (redirection!==false)
    {
     navigate(redirection, { replace: true })
    }
    else{
      getcomptesListContainer()
    }
  }, [redirection, user]);


  useEffect(()=>{     
    let comptes=[];
    if (searchFor!=="")
    {
      document.querySelector("#compteSearchField").value=searchFor;
      comptes =comptesFetched.filter((e)=>{
        return e.nom.toLowerCase().includes(searchFor.toLowerCase())|| e.prenom.toLowerCase().includes(searchFor.toLowerCase());
      });   
    }  
    else{
      comptes =comptesFetched;
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
          setComptes(comptes.filter((e)=>{
             return e.type_compte==="AM";
        }));
      break;
      case "ATC":
          setComptes(comptes.filter((e)=>{
             return e.type_compte==="ATC";
            }));
      break;
      case "Décideurs":
          setComptes(comptes.filter((e)=>{
             return e.type_compte==="Decideur";       
            }))  ;
      break;
      default : 
        setComptes(comptes.filter((e)=>{
          return true;       
         }))  ;
       break;
    }  
  }, [comptesFetched, searchFor, listOrder, typeCompte]);


  function setRedirection (dest)
  {
    // s'il est nécessaire de rediriger : se rediriger vers la destination
    redirection = dest;
  }

  async function getcomptesListContainer() {
     //récupérer les dcomptes employés de la base de données
     document.querySelectorAll("#reorderIcons>.reOrderIcon").forEach((icon)=>{
      icon.classList.add("disabledOrder")
      icon.classList.remove("selectedOrder")
    })
      setLoading(true)
      //const currCre =  await getCurrentCredentials();
      const reqAM = http.get("gestionprofils/am/", {"headers": {
        "token" : decryptData(window.localStorage.getItem("currTok")),
        "id_sender": decryptData(window.localStorage.getItem("curruId")),
      }});
      const reqATC = http.get("gestionprofils/atc/", {"headers": {
        "token" : decryptData(window.localStorage.getItem("currTok")),
        "id_sender": decryptData(window.localStorage.getItem("curruId")),
      }});
      const reqD = http.get("gestionprofils/decideur/", {"headers": {
        "token" : decryptData(window.localStorage.getItem("currTok")),
        "id_sender": decryptData(window.localStorage.getItem("curruId")),
      }});
      await axios.all([reqAM, reqATC, reqD]).then(axios.spread((...responses)=>{
        const listeam = responses[0].data.map((compte)=>{
          let c = compte;
          c["id"]= compte["id_am"];
          c["type_compte"] = "AM";
          c["photo"]= compte["photo_am"]
          return c;
        });
        let listeatc = []
        if(user.est_root===true)
        {
          listeatc = responses[1].data.filter((compte)=>{
            if (compte["id_atc"] !== user["id_atc"])
            {
              return true;
            }
            return false;
          }).map((compte)=>{
              let c = compte;
              c["id"]= compte["id_atc"];
              c["type_compte"] = "ATC";
              c["photo"]= compte["photo_atc"];
              return c;
          });
        }
        
        const listed = responses[2].data.map((compte)=>{
          let c = compte;
          c["id"]= compte["id_decideur"];
          c["type_compte"] = "Decideur";
          c["photo"]= compte["photo_decideur"]
          return c;
        });;
        if([...listeam, ...listeatc, ...listed]!==0)
      {
        document.querySelectorAll("#reorderIcons>.reOrderIcon").forEach((icon)=>{
          icon.classList.remove("disabledOrder")
          icon.classList.remove("selectedOrder")
        })
        document.querySelector("#iconOrder"+listOrder).classList.add("selectedOrder");
      }
      let comptes =[...listeam, ...listeatc, ...listed] ;
        setFetchedList(comptes)
        setLoading(false)
      })).catch((error)=>{
        setLoading(false)
        setFetchedList([]);
      });
    
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

  function returnList ()
  {
    //Retourner une titre si la liste des comptes est vide OU les cadres des comptes
      if (comptesFetched.length===0)
      {
        return (<h3 id="noEmp">La liste des employés est vide.</h3>)
      }
    else if (listComptes.length===0)
   {
     return (<h3 id="noEmp">Aucun compte ne correspond à votre requête.</h3>)
   }
    else{
      return (
            listComptes.map((leCompte) => {
                return (
                  <CadreCompte key={leCompte.id} id_user={leCompte.id} compte={leCompte}/>
                )
          }));}
  }
  function formatString(string)
  {
    //Retoune un string sans extra vides + avec MAJUSCULE au début
    let str = string.replace(/\s+/g,' ').trim();
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  async function addEmp()
  {
    //Ajouter un nouveau employé
    let newEmpNom = formatString(document.querySelector("#inputnewEmpNom").value);
    let newEmpPrenom = formatString(document.querySelector("#inputnewEmpPrenom").value);
    let newEmpMail = document.querySelector("#inputnewEmpMail").value;
    let newEmpPwd = document.querySelector("#inputnewEmpPwd").value;
    let newEmpTlfn = document.querySelector("#inputnewEmpTlfn").value;
    let newEmptypeCompte = typeCompteAdd;
    let newEmpPdp = document.querySelector("#import_emp_pdp").files;
    if ((newEmpNom==="")||(newEmpPrenom==="")||(newEmpMail==="")||(newEmpPwd==="")||(newEmpTlfn===""))
    {
      // champs requis vides
      alert.error("Veuillez remplir tous les champs requis.");
      
      (newEmpNom==="") && document.querySelector("#inputnewEmpNom").classList.add("input-error");
      (newEmpPrenom==="") && document.querySelector("#inputnewEmpPrenom").classList.add("input-error");
      (newEmpMail==="") && document.querySelector("#inputnewEmpMail").classList.add("input-error");
      (newEmpPwd==="") && document.querySelector("#inputnewEmpPwd").classList.add("input-error");
      (newEmpTlfn==="") && document.querySelector("#inputnewEmpTlfn").classList.add("input-error");
    }
    else if (newEmptypeCompte==="Type du compte employé"){
      //type de compte non choisi
      alert.error("Veuillez choisir le type de compte d'employé à créer.")
    }
    else if (newEmpPdp.length===0) {
      //photo de profile non choisie
      alert.error("Veuillez importer une photo de profile.")

    }
    else{
      // toutes les données sont choisies
      if (validateEmail(newEmpMail) === false)
      {
        alert.error("Veuillez introduire une adresse mail valide.");
        document.querySelector("#inputnewEmpMail").classList.add("input-error");
      }
      else if (!newEmpPdp[0].type.includes("image"))
      {
        alert.error("Veuillez importer une photo de profil valide");
      }
      else if (newEmpPwd.length < 6)
      {
        alert.error("Veuillez introduire un mot de passe dont la taille est supérieure à 6.");
        document.querySelector("#inputnewEmpPwd").classList.add("input-error");
      }
      else{
        setLoading(true)
        createUser(newEmpMail, newEmpPwd).then( async (data) => { 
          let img =await createImage(newEmpPdp[0],"ATC",data.user.uid);
        //  const currCre =  await getCurrentCredentials();

          if (newEmptypeCompte==="ATC")
          {
            http.post("/gestioncomptes/ajouter_atc/",{
              "token" : decryptData(window.localStorage.getItem("currTok")),
               "id_sender": decryptData(window.localStorage.getItem("curruId")),
               "id": data.user.uid,
               "nom": newEmpNom,
               "prenom": newEmpPrenom,
               "email": newEmpMail,
               "mot_de_passe": newEmpPwd,
               "numero_telephone": newEmpTlfn,
               "est_root" : false,
               "photo_atc": img,
       
              }).then((jResponse)=>{
                  setLoading(false)
                window.location.reload();
              }).catch((error)=>{
                  setLoading(false)
                alert.error("Une erreur est survenue, veuillez réessayer ultérieurement", {timeout : 0});
              });
          }
          else if (newEmptypeCompte==="AM")
          {
            http.post("/gestioncomptes/ajouter_am/",{
              "token" : decryptData(window.localStorage.getItem("currTok")),
               "id_sender": decryptData(window.localStorage.getItem("curruId")),
               "id": data.user.uid,
              "nom": newEmpNom,
              "prenom": newEmpPrenom,
              "email": newEmpMail,
              "mot_de_passe": newEmpPwd,
              "numero_telephone": newEmpTlfn,
              "photo_am": img

              }).then((jResponse)=>{
                  setLoading(false)
                  window.location.reload();
                }).catch((error)=>{
                  setLoading(false)
                  alert.error("Une erreur est survenue, veuillez réessayer ultérieurement", {timeout : 0});
                });
          }
          else{
            http.post("/gestioncomptes/ajouter_decideur/",{
              "token" : decryptData(window.localStorage.getItem("currTok")),
               "id_sender": decryptData(window.localStorage.getItem("curruId")),
               "id": data.user.uid,
               "nom": newEmpNom,
               "prenom": newEmpPrenom,
               "email": newEmpMail,
               "mot_de_passe": newEmpPwd,
               "numero_telephone": newEmpTlfn,
               "photo_decideur": img,
              }).then((jResponse)=>{
                  setLoading(false)
                  window.location.reload();
                }).catch((error)=>{
                  setLoading(false)
                  alert.error("Une erreur est survenue, veuillez réessayer ultérieurement", {timeout : 0});
                });
          }
       })
       .catch(error => {
        console.log(error.message);
        if (error.message==="Firebase: Error (auth/email-already-in-use).")
        {
                  setLoading(false)
          alert.error("Cet adresse mail est déja utilisée. Impossible d'ajouter cet employé")
        }
        else{
                  setLoading(false)
          alert.error("Une erreur est survenue. Veuillez réessayer ultérieurement.")
        }
       });
      }
    }
  }
  
  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  function addModal(){
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
          <Modal.Title>Ajouter un employé</Modal.Title>
        </Modal.Header>
        <Modal.Body id="addModalBody">
        <Input label="Nom de l'employé" inputClass="" containerClass="formAddEmpInput" id="newEmpNom" fieldType="text"/>
        <Input label="Prénom de l'employé" inputClass="" containerClass="formAddEmpInput" id="newEmpPrenom" fieldType="text"/>
        
        <Input label="Adresse mail" inputClass="" containerClass="formAddEmpInput" id="newEmpMail" fieldType="email"/>
        <Input label="Mot de passe" inputClass="" containerClass="formAddEmpInput" id="newEmpPwd" fieldType="password"/>

        <Input label="Numéro de téléphone" inputClass="" containerClass="formAddEmpInput" id="newEmpTlfn" fieldType="tel"/>

        <DropdownButton id="dropDownAdd" title={typeCompteAdd} onSelect={(e)=>setTypeCompteAdd(e)}>
              {(user.est_root===true)&&<Dropdown.Item eventKey="ATC">ATC</Dropdown.Item>}
              <Dropdown.Item eventKey="AM">AM</Dropdown.Item>
              <Dropdown.Item eventKey="Decideur">Décideur</Dropdown.Item>
        </DropdownButton>
        
        </Modal.Body>
        <Modal.Footer >
        <Button title="Ajouter" btnClass="buttonPrincipal" onClick={()=>{addEmp();}}/>
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
        <Button title="Annuler" btnClass="buttonSecondaire" onClick={()=>{handleCloseAdd();setTypeCompteAdd('Type du compte employé');}}/>
        </Modal.Footer>
      </Modal>
    );
  }
  switch (window.location.pathname)
        {
          case "/atc/gestioncomptes":
          case "/atc/gestioncomptes/":
            return ( 
              <div id="gestionDesComptesDiv">
                <ClipLoader color={"#1B92A4"} loading={loading} css={style} size={50} />
                <NavBarATC />
                <div id="comptesListContainer">
                  {addModal()}
                            <div id="fitrageList">
                            <Button title="Ajouter un employé" btnClass="buttonPrincipal" onClick={handleShowAdd}/>
                              <div id="filtrageActs">
                              <DropdownButton id="typeCompteDrop" title={typeCompte} onSelect={(e)=>setTypeCompte(e)}>
                                <Dropdown.Item eventKey="Tous les comptes">Tous les comptes</Dropdown.Item>
                                {(user.est_root===true)&&<Dropdown.Item eventKey="ATC">ATC</Dropdown.Item>}
                                <Dropdown.Item eventKey="AM">AM</Dropdown.Item>
                                <Dropdown.Item eventKey="Décideurs">Décideurs</Dropdown.Item>
                              </DropdownButton>
                            <div className="compteSearch">
                              <input type="text" placeholder="Recherche" id="compteSearchField"></input>
                              <FontAwesomeIcon id="comptesearchBtn" icon="fas fa-search" onClick={()=>search(document.querySelector("#compteSearchField").value)}/>
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

export default GestionComptes;