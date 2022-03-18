import './stylesheets/Input.css';
function Input(props) {
  return (
    <div class="col-3 input-effect">
    <input id={props.id} class={"input"+ props.class} type="text" />
      <label>{props.label}</label>
      <span class="focus-border">
        <i></i>
      </span>
  </div>
  );
}

export default Input;