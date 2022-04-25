import './stylesheets/AccueilATC.css';
import {useContext, useEffect, useState} from "react";
import { UserContext } from "../../Context.js";
import Button from './../../Composants/Button';
import {useNavigate} from 'react-router-dom';
import NavBarATC from './../../Composants/NavBarATC';
import ClipLoader from "react-spinners/ClipLoader";
import {getCarLocations} from "../../firebase";
import Map from '../../Composants/Map';
function AccueilATC() {
  //Page d'accueil de l'ATC
  const navigate = useNavigate();
  const {setLoading,loading} = useContext(UserContext);
  const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
  let redirection = false;
  const [trajets, setTrajets] = useState([]);
  const [querySnapshot, setSnapshot] = useState([]);
  useEffect (()=>{
    //Redirection si URL incorrect / incomplet
    if (redirection!==false)
    {
     navigate(redirection, { replace: true })
    }
    async function getTrajets ()
  {
    await getCarLocations(setSnapshot)
  }
    getTrajets ()
  }, []);

  useEffect(()=>{
    let tr = [];
    querySnapshot.forEach((doc) => {
      let t = doc.data();
      t["id"] = doc.id;
      tr.push(t)
    })
    setTrajets(tr);
  }, [querySnapshot])
  function setRedirection (dest)
  {
    // s'il est nécessaire de rediriger : se rediriger vers la destination
    redirection = dest;
  }
  function accueil ()
  {
    //fonction qui gere la liste des demandes affichées
    // get list where statut="en attente" and order by date_inscription
    switch (window.location.pathname)
        {
          // Gestion des Onglets de des vues            
          case "/atc/accueil":
            return (
              <div id="accueil">
                <div id="trajetVues">
                  <div id="vueChosen">
                    Vue globale
                  </div>
                </div>
                <div id="vueGlobale">
                  <h4 >Nombre de trajets en cours : {trajets.length}</h4>
                  <div>
                    <Map markers={trajets}/>
                    {
                      /*trajets.map((doc) => {
                        return (<h1>{doc.id}</h1>);
                      })*/
                      
                    }
                  </div>
                </div>
              </div>
            );
            

          case "/atc/accueil/":
            setRedirection('/atc/accueil');
          break;
          default :
          setRedirection('/404');
          return(null);
    
      }    
  }
  
  return (
    <div>
      <ClipLoader color={"#1B92A4"} loading={loading} css={style} size={50} />
      <NavBarATC />
      {accueil()}
      
    </div>
  );
}

export default AccueilATC;