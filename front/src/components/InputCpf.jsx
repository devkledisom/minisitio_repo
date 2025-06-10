import React from 'react';
import InputMask from 'react-input-mask';

import '../assets/css/main.css'
 
// Will work fine
const Input = (props) => {
  if(props.value.length <= 11) {
    return <InputMask 
    mask="999.999.999-99" 
    value={props.value} 
    onChange={props.onChange}
    name="descCPFCNPJ"
    id="descCPFCNPJ"
    className="form-control"
    placeholder="Digite seu CPF ou CNPJ" />
  } else {
    return <InputMask 
    mask="99.999.999/9999-99" 
    value={props.value} 
    onChange={props.onChange}
    name="descCPFCNPJ"
    id="descCPFCNPJ"
    className="form-control"
    placeholder="Digite seu CPF ou CNPJ" />
  }
 
};

export default Input;