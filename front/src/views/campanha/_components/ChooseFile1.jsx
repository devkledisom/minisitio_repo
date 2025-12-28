import React, { useEffect, useCallback, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { masterPath } from "../../../config/config";

import "../../../assets/css/comprar-anuncio.css";

//global functions
import { validarDimensaoImagem } from '../../../globalFunctions/functions';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../components/ui/tooltip.tsx";
import { InfoIcon } from "lucide-react";

function UploadImage(props) {
  //state
  const [imagem, setImagem] = useState(false);
  const [mostrarLabel, setMostrarLabel] = useState(true);
  const [textLabel, setTextLabel] = useState(props.msg);

  const [mostrarMiniPreview, setMostrarMiniPreview] = useState(props.miniPreview);
  const [ativarPreview, setPreview] = useState(props.preview);
  const [codImg, setCodImg] = useState(null);
  const [minisitio, setMinisitio] = useState([]);


  //ref
  const inputImg = useRef();
  useEffect(() => {
    if (!mostrarMiniPreview) {
      setMostrarLabel(false);
    }

    if (props.codImg == 0 || props.codImg == "" || props.codImg == undefined) {
      setMostrarMiniPreview(true);
      setMostrarLabel(true);
    } else {
      setMostrarMiniPreview(false);
      setMostrarLabel(false);
    }

  }, [props.codImg]);

  useEffect(() => {
    setMinisitio(props.minisitio)

  }, [props.minisitio])


  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    if (!acceptedFiles.length) return;

    const file = acceptedFiles[0];
    setImagem(file);
    setMostrarLabel(false);
    props.hasUserInteracted.current = true;

    const formData = new FormData();
    formData.append('image', file);

    fetch(`${masterPath.url}/upload-image?cod=${props.minisitio.codAnuncio}&local=${props.local}`, {
      method: 'POST',
      body: formData
    })
      .then(x => x.json())
      .then((res) => {
        console.log("result: ", res);
        props.data(prev => ({
          ...prev,
          [props.origin]: res.fileName.replace(/\s+/g, "-")
        }));

        setMostrarMiniPreview(true);
        setMostrarLabel(true)
      });
  }, [props.minisitio.codAnuncio]);


  /*   const { getRootProps, getInputProps, isDragActive, acceptedFiles, fileRejections } = useDropzone({ onDrop }, {
      accept: {
        "image/png": [],
        "image/jpeg": [],
        "image/webp": [],
      }, // Permite apenas PNG, JPEG e WEBP
      maxSize: 2 * 1024 * 1024, // Limite de 2MB
    }); */

  // Configuração do Dropzone
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/png": [], "image/jpeg": [] },
    /* accept: { "image/png": [], "image/jpeg": [], "image/webp": [] }, */
    maxSize: 1 * 1024 * 1024,
  });

  const limparInputImg = () => {
    props.hasUserInteracted.current = true;
    props.data({
      ...props.minisitio,
      [props.origin]: null,
      //['descParceiro']: "",

    });

    setImagem(false);
    setMostrarLabel(true);
    setMostrarMiniPreview(true);

    if (props.preview == true) {

    } else {
      /*  setImagem(false);
       setMostrarLabel(true);
       setMostrarMiniPreview(true);
       localStorage.setItem("imgname" + props.patrocinador, ""); */
    }


  }

  const mostrarBotaoRemover =
    !mostrarLabel && (imagem || !mostrarMiniPreview);

  return (
    <div className={"webcard choose-main" + " " + props.largura} >
      <div className="col-md-12">
        <div className="d-flex justify-content-between align-items-center gap-2 input-icon margin-top-10 form-control descImagem pl-0" style={{ paddingLeft: "0px" }}>
          <i className="fa fa-paperclip" style={{ position: "absolute", left: "0", marginTop: "unset" }}></i>
          <span
            className="cursor-pointer d-flex justify-content-around align-items-center"
            style={{
              marginLeft: "40px",
              /*         paddingTop: "5px",
                      lineHeight: "38px", */
              color: "#4f4f4f!important"
            }}
            onChange={(event) => alert()}

          >

            {/* PRIORIDADE: imagem recém-enviada */}
            {imagem ? (
              <>
                <img src={URL.createObjectURL(imagem)} width={50} style={{ fontSize: "15px" }} />
                <a
                  href={URL.createObjectURL(imagem)}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="pull-right d-flex mx-2" id="btnVerImagem" title="verimagem"
                >
                  Ver imagem
                </a>
              </>
            ) : (
              /* FALLBACK: imagem do backend */
              props.codImg && !mostrarMiniPreview && (
                <>
                  <img src={`${masterPath.url}/files/${props.local}/${props.codImg}`} width={50} style={{ fontSize: "15px" }} />
                  <a
                    href={`${masterPath.url}/files/${props.local}/${props.codImg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="pull-right d-flex mx-2" id="btnVerImagem" title="verimagem"
                  >
                    Ver imagem
                  </a>
                </>
              )
            )}


            {/*             {!mostrarMiniPreview ? <img src={`${masterPath.url}/files/${props.codImg}`} width={50} style={{ fontSize: "15px" }} /> : ""}
            {!mostrarMiniPreview ? <a href={`${masterPath.url}/files/${props.codImg}`} target="_blank" rel="noopener noreferrer" class="pull-right d-flex" id="btnVerImagem" title="verimagem">Ver imagem</a> : ""}


            {imagem ? <img src={URL.createObjectURL(imagem)} width={50} style={{ fontSize: "15px" }} /> : ""}
            {imagem ? <a href={`${masterPath.url}/files/${imagem.name}`} target="_blank" rel="noopener noreferrer" class="pull-right d-flex mx-2" id="btnVerImagem" title="verimagem">Ver imagem</a> : ""}
 */}            {mostrarLabel && <span {...getRootProps()}>{textLabel}</span>}

          </span>

          {mostrarBotaoRemover && (
            <a
              href="javascript:;"
              id="btnDeleteImagem"
              className="pull-right"
              title="Remover arquivo"
              onClick={limparInputImg}
            >
              <i className="fa fa-times-circle"></i>
            </a>
          )}

          {/*        {!mostrarLabel && !mostrarMiniPreview && (
            <a href="javascript:;" class="pull-right" id="btnDeleteImagem" title="Remover arquivo" onClick={limparInputImg}><i class="fa fa-times-circle"></i></a>
          )}

          {!mostrarLabel && imagem && (
            <a href="javascript:;" class="pull-right" id="btnDeleteImagem" title="Remover arquivo" onClick={limparInputImg}><i class="fa fa-times-circle"></i></a>
          )} */}

          {mostrarLabel &&
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon />
                {/*    <span className="border border-dark rounded-circle px-1 py-0 m-1 bg-gainsboro text-dark" style={{ fontSize: "12px", lineHeight: "12px", cursor: "pointer" }}>
                i
               </span> */}
              </TooltipTrigger>
              <TooltipContent
                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg border border-blue-400 max-w-xs break-words whitespace-normal"
                align="center">
                <p>A imagem deve ser no formato PNG, JPEG e ter no máximo 1MB, o nome da imagem não pode conter caracteres especiais ou espaços.</p>
              </TooltipContent>
            </Tooltip>
          }

          <input {...getInputProps({ name: "imagem", title: "descImagem" })} />
        </div>
      </div>
    </div>
  );
}

const dropzoneStyles = {
  border: "2px dashed #cccccc",
  borderRadius: "4px",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
};

export default UploadImage;
