import './stylesheets/Button.css';
function Button(props) {
  return (
    <button class={"button "+ props.class} id={props.id} >{props.title}</button>
  );
}

export default Button;