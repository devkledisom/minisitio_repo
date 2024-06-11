import React, { useState, useEffect } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import { masterPath } from '../../../config/config';

import "../../assets/css/fieldset.css";
import ChooseFile from "../../../components/ChooseFile";

const FieldsetPatrocinador = (props) => {
    return (
        <div className="app-patrocinador w-50">
            <fieldset className="border-bottom">
                <legend className="">Patrocinador 0{props.numeroPatrocinador}</legend>
                <div class="control-group" style={{ display: 'block' }}><label for="descImagem" class="control-label optional">IMAGEM DE PATROCINADOR: (148 x 46 pixels)</label>

                </div>
                <ChooseFile largura={"w-100 py-4"} preview={true} />
                <div class="control-group" style={{ display: 'block' }}><label for="descLink" class="control-label optional">LINK DE PATROCINADOR: </label>
                    <div class="controls mb-5">
                        <input type="text" name="descLink" id="descLink" className="w-100" maxlength="255" />
                        <p class="help-block" style={{ color: '#999' }}>Inserir link com "http://". Exemplo: http://google.com</p></div></div>
            </fieldset>
        </div>
    )
};

export default FieldsetPatrocinador;