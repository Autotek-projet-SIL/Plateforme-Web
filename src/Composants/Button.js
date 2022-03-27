import './stylesheets/Button.css';
function Button(props) {
  //Composant boutton selon les spécifications de la charte IHM
  return (
    <button className={"button "+ props.btnClass} id={props.id} onClick={props.onClick}>{props.title}</button>
  );
}

export default Button;