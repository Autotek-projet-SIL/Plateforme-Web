import './stylesheets/InfoLocation.css';
import {useContext, useEffect, useState} from "react";
import { UserContext } from "../../Context.js";
import NavBarATC from './../../Composants/NavBarATC';
import { getThemeProps } from '@material-ui/system';
import http from "../../http.js";
import { decryptData } from '../../crypto';
function InfoLocation(props) {
  //Page de gestion des véhicules de l'ATC
  const {user,loading, setLoading, loggingOut} = useContext(UserContext);
  const[viewedLocation, setViewedLocation] = useState({})
  useEffect(()=>{
    http.get("/gestionlocations/location/"+props.locationId, {"headers": {
      "token" : decryptData(window.localStorage.getItem("currTok")),
      "id_sender": decryptData(window.localStorage.getItem("curruId")),
    }}).then((response)=>{
        setViewedLocation(response.data[0])
        console.log(response.data[0])
    }).catch((err)=>{
      alert.error("Une erreur est survenue! Veuillez vérifier votre connexion ou réessayer ultérieurement.");
    })
  },[])
  return (
    
    <div>
      <NavBarATC />
      {props.locationId}
      InfoLocation</div>
  );
}

export default InfoLocation;