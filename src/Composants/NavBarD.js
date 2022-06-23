import "./stylesheets/NavBarD.css";
import { useContext } from "react";
import { UserContext } from "./../Context.js";
import { useNavigate } from "react-router-dom";

import { Nav, NavLink, NavMenu} from "./NavbarElements";

//Composant barre de navigation du decideur
function NavBarD(props) {
  const { loggingOut } = useContext(UserContext);
  const navigate = useNavigate();
  return (
    <Nav>
      <NavLink className="nav-eles" to="/decideur/accueil">
        <img
          id="logo-NavBarD"
          src={require("../ressources/images/logo-s.png")}
          alt="logo"
        />
      </NavLink>
      <NavMenu>
        <NavLink
          title="Accueil Décideur"
          className="nav-eles"
          to="/decideur/accueil"
          activestyle="true"
        >
          Acceuil
        </NavLink>
        <NavLink
          title="Mon compte"
          className="nav-eles"
          to="/decideur/monprofil"
          activestyle="true"
        >
          Mon compte
        </NavLink>
      </NavMenu>
      <div className="showD nav-eles">
        <img
          id="icone_compte_atc"
          src={require("../ressources/images/user.png")}
          alt="Compte ATC"
        />
        <div className="list-categoriesD">
          <ul>
            <li
              onClick={() => navigate("/decideur/monprofil", { replace: true })}
            >
              Mon Compte
            </li>
            <li onClick={() => loggingOut()}> Déconnexion</li>
          </ul>
        </div>
      </div>
    </Nav>
  );
}

export default NavBarD;
