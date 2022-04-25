import './stylesheets/GestionLocations.css';
import InfoLocation from "./InfoLocation";
import {useContext, useEffect, useState} from "react";
import { UserContext } from "../../Context.js";
import ProfileVehicule from "./ProfileVehicule";
import http from "../../http.js";
import NavBarATC from './../../Composants/NavBarATC';
import { decryptData } from '../../crypto';
import { getCarLocations } from '../../firebase';
import { useAlert } from 'react-alert';
function GestionLocations() {
  //Page de gestion locations
  const alert = useAlert();
  const {user, loggingOut} = useContext(UserContext);
  const [listLocations, setListLocations]= useState([]);
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
  return (
    
    <div>
      <NavBarATC />
      GestionLocations</div>
  );
}

export default GestionLocations;