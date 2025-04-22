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
        console.log('very', fileRejections[0].errors[0].code)
      }
    }


    // Verifica as dimensões da imagem (100x100)
    if (props.origin == 'descParceiro') {
      
      const file = acceptedFiles[0];
      if (!file) return;

      validarDimensaoImagem(file, 150, 58)
      .then((aproved) => {
        if(aproved) {
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
    } else {
      enviarImg();
    }


    


    function enviarImg() {
      if (props.patrocinador >= 4) {
        localStorage.setItem("imgname" + props.patrocinador, acceptedFiles[0].name);
      } else {
        localStorage.setItem("imgname", acceptedFiles[0].name);
      }

      console.log(acceptedFiles[0])
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
      fetch(`${masterPath.url}/upload-image?cod=${props.codigoUser}&local=promocao`, {
        method: 'POST',
        body: formData
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Erro ao enviar imagem para o servidor');
          }
          console.log('Imagem enviada com sucesso!');

          props.data({
            ...props.minisitio,
            [props.origin]: acceptedFiles[0].name,
            //['descParceiro']: acceptedFiles[0].name,

          });

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
    props.data({
      ...props.minisitio,
      [props.origin]: null,
      //['descParceiro']: "",

    });

    if (props.preview == true) {

    } else {
      setImagem(false);
      setMostrarLabel(true);
      setMostrarMiniPreview(true);
      localStorage.setItem("imgname" + props.patrocinador, "");
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
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "5px",
              /* lineHeight: "38px", */
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
