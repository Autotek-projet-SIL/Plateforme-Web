import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import './stylesheets/Input.css';
function Input(props) {
  const [passwordShown, setPasswordShown] = useState(false);
  function manageLabelIn(event)
    {
      document.querySelector("#input"+props.id).classList.remove("has-content")
      document.querySelector("#input"+props.id).classList.remove("input-error")
    }
  function manageLabelOut(event)
    {
        if (event.target.value === "")
        {
            document.querySelector("#input"+props.id).classList.remove("has-content")
        }
        else{
          document.querySelector("#input"+props.id).classList.add("has-content")
        }
    }
  //Composant input selon les spécifications de la charte IHM
    if (props.fieldType ==="password")
    {
      return (
        <div className={"col-3 input-effect " + props.containerClass}>
          <input id={"input"+props.id} className={"input "+ props.inputClass} type={passwordShown ? "text" : "password"} placeholder="" onFocus={(event)=>{manageLabelIn(event)}} onBlur={(event)=>{manageLabelOut(event)}} />
            <label id={"inputLabel"+props.id}>{props.label}</label>
            <FontAwesomeIcon className='pwdToggleVis' title={passwordShown ? "Cacher le mot de passe" : "Montrer le mot de passe"} onClick={()=>setPasswordShown(!passwordShown)} icon={passwordShown ? "fa-solid  fa-eye-slash" : "fa-solid  fa-eye"} />
            <span className="focus-border">
             <i></i>
            </span>
        </div>
      );
    }
    else{
      return (
        <div className={"col-3 input-effect " + props.containerClass}>
          <input id={"input"+props.id} className={"input " + (props.parDef&&"has-content" || "") + props.inputClass} type={props.fieldType} placeholder="" defaultValue={props.parDef || ""}  onFocus={(event)=>{manageLabelIn(event)}} onBlur={(event)=>{manageLabelOut(event)}} />
            <label id={"inputLabel"+props.id}>{props.label}</label>
            <span className="focus-border">
              <i></i>
            </span>
        </div>
      );
    }
}

export default Input;