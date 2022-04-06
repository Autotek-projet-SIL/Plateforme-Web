import './stylesheets/NavBarATC.css';
import {useContext} from "react";
import { UserContext } from "./../Context.js";
import {useNavigate} from 'react-router-dom';

import {
  Nav,
  NavLink,
  NavMenu,
  NavBtn,
  NavBtnLink
} from './NavbarElements';
function NavBarATC(props) {
  
  const {loggingOut} = useContext(UserContext);
  const navigate = useNavigate();
  //Composant cadre de la demande d'inscription du client 
  return (
    
      <Nav>
        <NavLink className="nav-eles" to='/atc/accueil'>
          <img id='logo-navbarATC' src={require('../ressources/images/logo-s.png')}  alt='logo' />
        </NavLink>
        
        <NavMenu>
          <NavLink title="Accueil ATC" className="nav-eles" to='/atc/accueil' activestyle="true">
            Acceuil
          </NavLink>
          <NavLink title="Gestion des demandes" className="nav-eles" to='/atc/gestiondemandes/inscription' activestyle="true">
            Demandes
          </NavLink>
          <NavLink title="Gestion des locations"   className="nav-eles" to='/atc/gestionlocations' activestyle="true">
            Locations
          </NavLink>
          <NavLink title="Gestion des véhicules"  className="nav-eles" to='/atc/gestionvehicules' activestyle="true">
            Vehicules
          </NavLink>
          <NavLink title="Gestion des comptes"  className="nav-eles" to='/atc/gestioncomptes' activestyle="true">
            Comptes
          </NavLink>
        </NavMenu>
        <div  className="show nav-eles" >
          <img id='icone_compte_atc' src={require('../ressources/images/user.png')}  alt='Compte ATC' />
            <div className="list-categories">
              <ul >
              <li  onClick={()=>navigate("/atc/monprofil", { replace: true })}>Votre Compte</li>
              <li onClick={()=>loggingOut()} > Déconnexion</li>
              </ul>       
            </div>
          </div>
      </Nav>
  );
}

export default NavBarATC;