import './stylesheets/Input.css';
function Input(props) {
  
  function manageLabelIn(event)
    {
      document.querySelector("#inputLabel"+props.id).style.display="block"
    }
  function manageLabelOut(event)
    {
        if (event.target.value === "")
        {
            document.querySelector("#inputLabel"+props.id).style.display="block"
        }
        else{
          document.querySelector("#inputLabel"+props.id).style.display="none"
        }
    }
  //Composant input selon les spécifications de la charte IHM
    if (props.fieldType ==="password")
    {
      return (
        <div className={"col-3 input-effect " + props.containerClass}>
          <input id={props.id} className={"input "+ props.inputClass} type={props.fieldType} placeholder="" onFocus={(event)=>{manageLabelIn(event)}} onBlur={(event)=>{manageLabelOut(event)}} />
            <label id={"inputLabel"+props.id}>{props.label}</label>
            <span className="focus-border">
              <i></i>
            </span>
        </div>
      );
    }
    else{
      return (
        <div className={"col-3 input-effect " + props.containerClass}>
          <input id={props.id} className={"input "+ props.inputClass} type={props.fieldType} placeholder="" onFocus={(event)=>{manageLabelIn(event)}} onBlur={(event)=>{manageLabelOut(event)}} />
            <label id={"inputLabel"+props.id}>{props.label}</label>
            <span className="focus-border">
              <i></i>
            </span>
        </div>
      );
    }
}

export default Input;