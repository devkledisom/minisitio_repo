import React, { useEffect, useCallback, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { masterPath } from "../../config/config";

import "../../assets/css/comprar-anuncio.css";

//global functions
import { validarDimensaoImagem } from '../../globalFunctions/functions';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../components/ui/tooltip.tsx";
import { InfoIcon } from "lucide-react";

function UploadImage(props) {
  //state
  const [imagem, setImagem] = useState(false);
  const [mostrarLabel, setMostrarLabel] = useState(true);
  const [textLabel, setTextLabel] = useState(props.msg);

  const [mostrarMiniPreview, setMostrarMiniPreview] = useState(props.miniPreview);
  const [ativarPreview, setPreview] = useState(props.preview);
  const [codImg, setCodImg] = useState(null);


  //ref
  const inputImg = useRef();
  useEffect(() => {
    if (!mostrarMiniPreview) {
      setMostrarLabel(false);
    }

    if (props.codImg == 0 || props.codImg == "" || props.codImg == undefined) {
      setMostrarMiniPreview(true);
      setMostrarLabel(true);
    }


  }, []);


  const onDrop = useCallback((acceptedFiles, fileRejections) => {

    if (fileRejections.length > 0) {
      if (fileRejections[0].errors) {
        if (fileRejections[0].errors[0].code === "file-invalid-type") {
          alert("Formato inválido! Apenas PNG e JPEG são permitidos.");
          return;
        } else if (fileRejections[0].errors[0].code === "file-too-large") {
          alert("Imagem atingiu o limite, por favor insira uma imagem de até 1MB");
          return;
        }
        //console.log('very', fileRejections[0].errors[0].code)
      }
    }


    // Verifica as dimensões da imagem (100x100)
    if (props.origin == 'descParceiro') {

      const file = acceptedFiles[0];
      if (!file) return;

      validarDimensaoImagem(file, 150, 58)
        .then((aproved) => {
          if (aproved) {
            enviarImg();
          } else {
            alert("A imagem deve ter exatamente 150x58 pixels.");
          }
        });

      /*  const img = new Image();
       img.onload = () => {
         if (img.width !== 100 || img.height !== 100) {
           alert("A imagem deve ter exatamente 100x100 pixels.");
           return;
         }
 
         // ✅ Se passou nas validações, faz o que precisa (ex: setFile, enviar, etc.)
         console.log("Imagem válida!");
         enviarImg()
         // setImagem(file); ou qualquer ação que você queira
       };
       img.onerror = () => {
         alert("Erro ao carregar imagem.");
       };
       img.src = URL.createObjectURL(file); */
    } else if (props.origin == 'cashback_logo') {
      const file = acceptedFiles[0];
      if (!file) return;

      validarDimensaoImagem(file, 150, 58)
        .then((aproved) => {
          if (aproved) {
            enviarImg();
          } else {
            alert("A imagem deve ter exatamente 150x58 pixels.");
          }
        });
    } else {
      enviarImg();
    }





    function enviarImg() {
      if (props.patrocinador >= 4) {
        localStorage.setItem("imgname" + props.patrocinador, acceptedFiles[0].name);
      } else {
        localStorage.setItem("imgname", acceptedFiles[0].name);
      }

      setImagem(acceptedFiles[0]);
      setMostrarLabel(false);


      if (props.preview == true) {
        document.querySelector('.comImagem img').src = URL.createObjectURL(acceptedFiles[0]);
        document.querySelector('.semImagem').style.display = 'none';
        document.querySelector('.comImagem').style.display = 'block';

      }

      const formData = new FormData();
      formData.append('image', acceptedFiles[0]);

      // Enviar a imagem para o servidor
      fetch(`${masterPath.url}/upload-image?cod=${props.dt.codAnuncio}&local=${props.local}`, {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(response => {

          console.log('Imagem enviada com sucesso!', response);

          if (props.origin === 'logoPromocao') {

            props.data(prev => ({
              ...prev,
              [props.origin]: response.fileName.replace(/\s+/g, "-"), //acceptedFiles[0].name,
              promoc: {
                ...prev.promoc, // Mantém o que já existia no objeto promoc se houver
                banner: response.fileName.replace(/\s+/g, "-") //acceptedFiles[0].name
              }
            }));

          } else {
            props.data(prev => ({
              ...prev,
              [props.origin]: response.fileName.replace(/\s+/g, "-")//acceptedFiles[0].name,
            }));
          }


          setMostrarLabel(false);
          setMostrarMiniPreview(true);
        })
        .catch(error => {
          console.error('Erro ao enviar imagem:', error);
        });
    }

  }, []);

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
    //console.log("limparInputImg", props.origin, props.dt);
    props.data(prev => ({
      ...prev,
      [props.origin]: null,
      //['descParceiro']: "",

    }));

    if (props.preview == true) {

    } else {
      setImagem(false);
      setMostrarLabel(true);
      setMostrarMiniPreview(true);
      localStorage.setItem("imgname" + props.patrocinador, "");
    }


  }

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

            {!mostrarMiniPreview ? <img src={`${masterPath.url}/files/${props.local}/${props.codImg}`} width={50} style={{ fontSize: "15px" }} /> : ""}
            {!mostrarMiniPreview ? <a href={`${masterPath.url}/files/${props.local}/${props.codImg}`} target="_blank" rel="noopener noreferrer" class="pull-right d-flex" id="btnVerImagem" title="verimagem">Ver imagem</a> : ""}
            {/* {!mostrarMiniPreview && <a href="javascript:;" class="pull-right" id="btnDeleteImagem" title="Remover arquivo" onClick={limparInputImg}><i class="fa fa-times-circle"></i></a>} */}


            {/* console.log(mostrarLabel) */}
            {imagem ? <img src={URL.createObjectURL(imagem)} width={50} style={{ fontSize: "15px" }} /> : ""}
            {imagem ? <a href={`${masterPath.url}/files/${props.local}/${imagem.name}`} target="_blank" rel="noopener noreferrer" class="pull-right d-flex mx-2" id="btnVerImagem" title="verimagem">Ver imagem</a> : ""}
            {mostrarLabel && <span {...getRootProps()}>{textLabel}</span>}

            {/*    {!mostrarLabel && 
                             {imagem && <a href="javascript:;" class="pull-right" id="btnDeleteImagem" title="Remover arquivo" onClick={limparInputImg}><i class="fa fa-times-circle"></i></a>}
                 } */}



          </span>

          {!mostrarLabel && !mostrarMiniPreview && (
            <a href="javascript:;" class="pull-right" id="btnDeleteImagem" title={"Remover arquivo" + props.origin} onClick={limparInputImg}><i class="fa fa-times-circle"></i></a>
          )}

          {!mostrarLabel && imagem && (
            <a href="javascript:;" class="pull-right" id="btnDeleteImagem" title={"Remover arquivo" + props.origin} onClick={limparInputImg}><i class="fa fa-times-circle"></i></a>
          )}

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
      {/*   <div className="col-md-8">
        <div className="input-icon margin-top-10">
          <i className="fa fa-paperclip"></i>
          <span
            className="form-control descImagem"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "5px",
              color: "#4f4f4f!important",
              margin: "auto"
            }}
          >

            {!mostrarMiniPreview ? <img src={`${masterPath.url}/files/2/${props.codImg}`} width={50} style={{ fontSize: "15px" }} /> : ""}
            {!mostrarMiniPreview ? <a href={`${masterPath.url}/files/2/${props.codImg}`} target="_blank" rel="noopener noreferrer" class="pull-right d-flex" id="btnVerImagem" title="verimagem">Ver imagem</a> : ""}
            {!mostrarMiniPreview && <a href="javascript:;" class="pull-right" id="btnDeleteImagem" title="Remover arquivo" onClick={limparInputImg}><i class="fa fa-times-circle"></i></a>}

            {imagem ? <img src={URL.createObjectURL(imagem)} width={50} style={{ fontSize: "15px" }} /> : ""}
            {imagem ? <a href={`${masterPath.url}/files/2/${imagem.name}`} target="_blank" rel="noopener noreferrer" class="pull-right d-flex" id="btnVerImagem" title="verimagem">Ver imagem</a> : ""}
            {mostrarLabel && textLabel}
            {imagem && <a href="javascript:;" class="pull-right" id="btnDeleteImagem" title="Remover arquivo" onClick={limparInputImg}><i class="fa fa-times-circle"></i></a>}

          </span>
          <input {...getInputProps({ name: "imagem", title: "descImagem" })} />
        </div>
      </div> */}
      {/*       <div className="col-md-4 botao-procurar" {...getRootProps()}>
        <button type="button" className="btn cinza w-100" id="btnDescImagem">
          procurar
        </button>
      </div> */}
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
