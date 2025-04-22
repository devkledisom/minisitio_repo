import React, { useEffect, useCallback, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { masterPath } from "../../config/config";

import "../../assets/css/comprar-anuncio.css";

//global functions
import { validarDimensaoImagem } from '../../globalFunctions/functions';


function UploadImage(props) {
  //state
  const [imagem, setImagem] = useState(false);
  const [mostrarLabel, setMostrarLabel] = useState(true);
  const [textLabel, setTextLabel] = useState("Anexar imagem");

  const [mostrarMiniPreview, setMostrarMiniPreview] = useState(props.miniPreview);
  const [ativarPreview, setPreview] = useState(props.preview);
  const [codImg, setCodImg] = useState(null);


  //ref
  const inputImg = useRef();
  /*   if (props.codImg != '') {
      setImagem(false);
    } */



  useEffect(() => {
    if (!mostrarMiniPreview) {
      setMostrarLabel(false);
    }
    if (props.codImg == 0) {
      setImagem(false);
      setMostrarLabel(true);
      setMostrarMiniPreview(true);
      return;
    }

    if (!mostrarMiniPreview && props.codImg != 0) {
      //document.querySelector('.comImagem img').src = `${masterPath.url}/files/${props.codImg}`;
      document.querySelector('.semImagem').style.display = 'none';
      document.querySelector('.comImagem').style.display = 'block';
    }


  }, []);




  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    // Faça algo com os arquivos aceitos, como enviar para um servidor
    // Criar um objeto FormData para enviar a imagem para o servidor
    //setPreview(props.preview);

    if (fileRejections.length > 0) {
      if (fileRejections[0].errors) {
        if (fileRejections[0].errors[0].code === "file-invalid-type") {
          alert("Formato inválido! Apenas PNG e JPEG são permitidos.");
          return;
        } else if (fileRejections[0].errors[0].code === "file-too-large") {
          alert("Imagem atingiu o limite, por favor insira uma imagem de até 1MB");
          return;
        }
        console.log('very', fileRejections[0].errors[0].code)
      }
    }

    // Verifica as dimensões da imagem (100x100)
    console.log(props.origin)
    if (props.origin == 'descImagem') {

      const file = acceptedFiles[0];
      if (!file) return;

      validarDimensaoImagem(file, 600, 300)
        .then((aproved) => {
          if (aproved) {
            enviarImg();
          } else {
            alert("A imagem deve ter exatamente 600x300 pixels.");
          }
        });
    } else {
      enviarImg();
    }

    function enviarImg() {
      if (props.patrocinador > 1 && props.patrocinador < 4) {
        localStorage.setItem("imgname" + props.patrocinador, acceptedFiles[0].name);
      } else {
        localStorage.setItem("imgname", acceptedFiles[0].name);
      }
  
      //console.log(acceptedFiles[0])
      setImagem(acceptedFiles[0]);
      setMostrarLabel(false);
      //setTextLabel(acceptedFiles[0].name);
      //localStorage.setItem("imgname", acceptedFiles[0].name);
  
      /*   if(props.teste != undefined) {
          props.teste(acceptedFiles[0], true)
        }; */
  
  
      if (props.preview == true) {
        document.querySelector('.comImagem img').src = URL.createObjectURL(acceptedFiles[0]);
        document.querySelector('.semImagem').style.display = 'none';
        document.querySelector('.comImagem').style.display = 'block';
  
      }
  
      const formData = new FormData();
      formData.append('image', acceptedFiles[0]);
  
      // Enviar a imagem para o servidor
      fetch(`${masterPath.url}/upload-image?cod=${props.codigoUser}`, {
        method: 'POST',
        body: formData
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Erro ao enviar imagem para o servidor');
          }
          console.log('Imagem enviada com sucesso!');
          setMostrarLabel(false);
          setMostrarMiniPreview(true);
        })
        .catch(error => {
          console.error('Erro ao enviar imagem:', error);
        });
  
  
    }

  });

  

  //const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  // Configuração do Dropzone
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/png": [], "image/jpeg": [] },
    /* accept: { "image/png": [], "image/jpeg": [], "image/webp": [] }, */
    maxSize: 1 * 1024 * 1024,
  });

  const limparInputImg = () => {
    if (props.preview == true) {
      document.querySelector('.semImagem').style.display = 'block';
      document.querySelector('.comImagem').style.display = 'none';

      setImagem(false);
      setMostrarLabel(true);
      setMostrarMiniPreview(true);
      //document.querySelector(".descImagem").style.display = 'none';
      localStorage.setItem("imgname", "")
    } else {
      setImagem(false);
      setMostrarLabel(true);
      setMostrarMiniPreview(true);
      //document.querySelector(".descImagem").style.display = 'none';
      localStorage.setItem("imgname", "")
    }


  }

  return (
    <div className={"row webcard choose-main" + " " + props.largura} >
      <div className="col-md-8">
        <div className="input-icon margin-top-10">
          <i className="fa fa-paperclip"></i>
          <span
            className="form-control descImagem"
            style={{
              paddingTop: "5px",
              lineHeight: "38px",
              color: "#4f4f4f!important"
            }}
            onChange={(event) => alert()}
          >

            {!mostrarMiniPreview ? <img src={`${masterPath.url}/files/${props.codImg}`} width={50} style={{ fontSize: "15px" }} /> : ""}
            {!mostrarMiniPreview ? <a href={`${masterPath.url}/files/${props.codImg}`} target="_blank" rel="noopener noreferrer" class="pull-right d-flex" id="btnVerImagem" title="verimagem">Ver imagem</a> : ""}
            {!mostrarMiniPreview && <a href="javascript:;" class="pull-right" id="btnDeleteImagem" title="Remover arquivo" onClick={limparInputImg}><i class="fa fa-times-circle"></i></a>}


            {/* console.log(mostrarLabel) */}
            {imagem ? <img src={URL.createObjectURL(imagem)} width={50} style={{ fontSize: "15px" }} /> : ""}
            {imagem ? <a href={`${masterPath.url}/files/${imagem.name}`} target="_blank" rel="noopener noreferrer" class="pull-right d-flex" id="btnVerImagem" title="verimagem">Ver imagem</a> : ""}
            {mostrarLabel && textLabel}
            {imagem && <a href="javascript:;" class="pull-right" id="btnDeleteImagem" title="Remover arquivo" onClick={limparInputImg}><i class="fa fa-times-circle"></i></a>}

          </span>
          <input {...getInputProps({ name: "imagem", title: "descImagem" })} />
        </div>
      </div>
      <div className="col-md-4 botao-procurar" {...getRootProps()}>
        <button type="button" className="btn cinza w-100" id="btnDescImagem">
          procurar
        </button>
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
