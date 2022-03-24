import './stylesheets/NavBarATC.css';

import {
  Nav,
  NavLink,
  NavMenu,
  NavBtn,
  NavBtnLink
} from './NavbarElements';
function NavBarATC(props) {
  
  //Composant cadre de la demande d'inscription du client 
  return (
    
      <Nav>
        <NavLink id="logo-atc-nav" to='/atc/accueil'>
          <img id='logo-navbarATC' src={require('../ressources/images/logo-s.png')}  alt='logo' />
        </NavLink>
        
        <NavMenu>
          <NavLink to='/atc/accueil' activestyle="true">
            Acceuil
          </NavLink>
          <NavLink to='/atc/gestiondemandes/inscription' activestyle="true">
            Demandes
          </NavLink>
          <NavLink to='/atc/gestionlocations' activestyle="true">
            Locations
          </NavLink>
          <NavLink to='/atc/gestionvehicules' activestyle="true">
            Vehicules
          </NavLink>
          <NavLink to='/atc/gestioncomptes' activestyle="true">
            Comptes
          </NavLink>
        </NavMenu>
        <NavLink id="compte-atc-nav" to='/atc/accueil'>
        <img id='icone_compte_atc' src={require('../ressources/images/user.png')}  alt='Compte ATC' />
        </NavLink>
      </Nav>
  );
}

export default NavBarATC;