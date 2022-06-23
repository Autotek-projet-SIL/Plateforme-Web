import "./stylesheets/Button.css";
//Composant boutton selon les spécifications de la charte IHM
function Button(props) {
  return (
    <button
      className={"button " + props.btnClass}
      id={props.id}
      onClick={props.onClick}
    >
      {props.title}
    </button>
  );
}

export default Button;
