import "./stylesheets/CarteStat.css";
import { DropdownButton, Dropdown } from "react-bootstrap";

// Composant Cadre de statistiques
function CarteStat(props) {
  // Recoit la donnee a afficher, le menu de filtres ainsi que la fct callback qui met a jour le filtre dans le parent
  return (
    <div className="carteStat">
      <h3>{props.title}</h3>
      <p>{props.data}</p>
      <div id="statDropDiv">
        <DropdownButton
          id="statDrop"
          title={props.selectedFilter}
          onSelect={(e) => props.callback(e)}
        >
          {props.listeFiltre.map((filtre) => {
            return (
              <Dropdown.Item key={filtre} eventKey={filtre}>
                {filtre}
              </Dropdown.Item>
            );
          })}
        </DropdownButton>
      </div>
    </div>
  );
}

export default CarteStat;
