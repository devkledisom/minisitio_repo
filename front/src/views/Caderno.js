import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useLocation } from 'react-router-dom';
import { masterPath } from '../config/config';

//lib
import Masonry from 'react-masonry-css';


import 'bootstrap/dist/css/bootstrap.min.css';
/* import 'font-awesome/css/font-awesome.min.css'; */
import '../assets/css/caderno.css';

import Mosaico from '../components/Mosaico';
import Busca from '../components/Busca';
import MiniWebCard from '../components/MiniWebCard';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import MsgProgramada from '../components/MsgProgramada';
import MiniWebCardSimples from '../components/MiniWebCardSimples';

function Caderno() {

  const [nomeAtividade, setNomeAtividade] = useState([]);
  const [minisitio, setMinisitio] = useState([]);
  const [smoot, setSmoot] = useState(false);
  const [listaIds, setListaIds] = useState([]);
  const [btnNav, setbtnNav] = useState(false);

  const [loading, setLoading] = useState(false);

  const location = useLocation();

  const pegarParam = new URLSearchParams(location.search);

  const page = pegarParam.get('page');
  const book = pegarParam.get('book');
  const id = pegarParam.get('id');
  const caderno = pegarParam.get('caderno');
  const estado = pegarParam.get('estado');

  const [numberPage, setNumberPage] = useState(1);

  useEffect(() => {

    setLoading(true);
    async function buscarAtividadeold() {
      try {
        const res = await fetch(`${masterPath.url}/anuncios/${book}?page=${page}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        });

        const minisitio = await res.json();

        console.log('dasdads', minisitio)

        setMinisitio(minisitio);

        //console.log("minsindias", minisitio)

        const codigosAtividades = minisitio.anuncios.map((item) => item.codAtividade);
        const valores = [...new Set(codigosAtividades)];

        const codigosTable = await fetch(`${masterPath.url}/atividade/6`).then(response => response.json());
        const atividadesEncontradas = codigosTable.filter((item) => valores.includes(item.id));

        setNomeAtividade(atividadesEncontradas);

        console.log("Final", atividadesEncontradas, nomeAtividade);
      } catch (error) {
        console.error('Erro ao buscar atividades:', error);
      }
    }
    async function buscarAtividade() {
      fetch(`${masterPath.url}/admin/anuncio/classificado/geral/${caderno}/${estado}`)
        .then(x => x.json())
        .then(async res => {
          if (res.success) {

            const codigosAtividades = res.teste.rows.map((item) => item.codAtividade);
            const valores = [...new Set(codigosAtividades)];

            const codigosTable = await fetch(`${masterPath.url}/atividade/6`).then(response => response.json());
            const atividadesEncontradas = codigosTable.filter((item) => valores.includes(item.id));

            const arrTeste = res.data.filter((category) => category.id == res.teste.rows[0].codAtividade);

            let result = res.teste.rows.filter(category =>
              res.data.some(anuncio => category.id === anuncio.codAtividade)
            );

            const arr = [];

            let result1 = res.data.map((category) => {
              // Filtra os anúncios que correspondem à categoria atual
              let teste = res.teste.rows.filter(anuncio => category.id === anuncio.codAtividade);

              // Adiciona a nova propriedade 'kledisom' com os anúncios correspondentes
              category.kledisom = teste;
              teste.forEach((item) => {
                item.codAtividade = category.atividade; //adiciona as categorias
                arr.push(item); //salva so os anuncios
              });

              //console.log(arr)

              // Retorna o objeto category modificado
              return category;
            });

            //console.log(result1);

            // Atualiza o estado com os dados paginados
            setMinisitio({ anuncios: result1 });
            setNomeAtividade(result1);

            const itemIndex = arr.findIndex(item => item.codAnuncio == id) + 1;

            const pageNumberClass = Math.ceil(itemIndex / 10);

            console.log(`pagina ${pageNumberClass}`);

            setNumberPage(pageNumberClass);

            paginator(arr, pageNumberClass);

          } else {

          }

        })
    }

    function buscarTodosClassificadoold() {
      fetch(`${masterPath.url}/admin/anuncio/classificado/geral/${caderno}/${estado}`)
        .then(x => x.json())
        .then(async res => {
          if (res.success) {

            const codigosAtividades = res.teste.rows.map((item) => item.codAtividade);
            const valores = [...new Set(codigosAtividades)];

            const codigosTable = await fetch(`${masterPath.url}/atividade/6`).then(response => response.json());
            const atividadesEncontradas = codigosTable.filter((item) => valores.includes(item.id));

            const arrTeste = res.data.filter((category) => category.id == res.teste.rows[0].codAtividade);

            let result = res.teste.rows.filter(category =>
              res.data.some(anuncio => category.id === anuncio.codAtividade)
            );


            /*    let result1 = res.data.map((category) => {
                 // Filtra os anúncios que correspondem à categoria atual
                 let teste = res.teste.rows.filter(anuncio => category.id === anuncio.codAtividade);
               
                 // Adiciona a nova propriedade 'kledisom' com os anúncios correspondentes
                 console.log(teste)
                 category.kledisom = teste;
               
                 // Retorna o objeto category modificado
                 return category;
               }); */

            /*  let result1 = res.data.map((category) => {
               // Inicializa o contador para limitar a 10 anúncios por categoria
               let contador = 0;
 
               // Filtra os anúncios que correspondem à categoria atual e conta os primeiros 10
               let teste = res.teste.rows.filter(anuncio => {
                 if (category.id === anuncio.codAtividade && contador < 10) {
                   contador++;
                   return true;
                 }
                 return false;
               });
 
               // Adiciona a nova propriedade 'kledisom' com os anúncios correspondentes
               category.kledisom = teste;
               //console.log(teste)
 
               // Retorna o objeto category modificado
               return category;
             }); */


            let result1 = res.data.map((category) => {
              // Filtra os anúncios que correspondem à categoria atual
              let totalAnuncios = res.teste.rows.filter(anuncio => {
                return category.id === anuncio.codAtividade;
              });

              // Página atual (você pode controlar isso pelo frontend)
              let currentPage = 1; // Exemplo de página atual
              let limitPerPage = 10;

              // Paginação
              let startIndex = (currentPage - 1) * limitPerPage;
              let endIndex = startIndex + limitPerPage;
              let paginatedAnuncios = totalAnuncios.slice(startIndex, endIndex);

              // Adiciona a nova propriedade 'kledisom' com os anúncios paginados
              category.kledisom = paginatedAnuncios;

              // Retorna o objeto category modificado
              return category;
            });


            console.log(result1);



            setMinisitio({ anuncios: result });
            setNomeAtividade(result1);



            result.sort((a, b) => a.codAtividade - b.codAtividade);


            //setMinisitio({ anuncios: dividido[0] });
            paginator(result1);
            function pagi() {
              const limitPerPage = 10;

              result1.map((category) => {
                // Para cada categoria, calcule o número de páginas
                let totalPages = Math.ceil(category.kledisom.length / limitPerPage);

                // Página atual
                let currentPage = 1; // Exemplo: Pode ser controlado por um parâmetro de frontend

                // Cálculo do índice inicial e final dos anúncios
                let startIndex = (currentPage - 1) * limitPerPage;
                let endIndex = startIndex + limitPerPage;

                // Pegue os anúncios para a página atual
                let paginatedAnuncios = category.kledisom.slice(startIndex, endIndex);

                console.log(paginatedAnuncios)
              })

            }
            pagi()
          } else {

          }

        })
    };
    function buscarTodosClassificado() {
      fetch(`${masterPath.url}/admin/anuncio/classificado/geral/${caderno}/${estado}`)
        .then(x => x.json())
        .then(async res => {
          if (res.success) {

            const codigosAtividades = res.teste.rows.map((item) => item.codAtividade);
            const valores = [...new Set(codigosAtividades)];

            const codigosTable = await fetch(`${masterPath.url}/atividade/6`).then(response => response.json());
            const atividadesEncontradas = codigosTable.filter((item) => valores.includes(item.id));

            const arrTeste = res.data.filter((category) => category.id == res.teste.rows[0].codAtividade);

            let result = res.teste.rows.filter(category =>
              res.data.some(anuncio => category.id === anuncio.codAtividade)
            );

            const arr = [];

            let result1 = res.data.map((category) => {
              // Filtra os anúncios que correspondem à categoria atual
              let teste = res.teste.rows.filter(anuncio => category.id === anuncio.codAtividade);

              // Adiciona a nova propriedade 'kledisom' com os anúncios correspondentes
              category.kledisom = teste;
              teste.forEach((item) => {
                item.codAtividade = category.atividade; //adiciona as categorias
                arr.push(item); //salva so os anuncios
              });

              //console.log(arr)

              // Retorna o objeto category modificado
              return category;
            });

            /*  let result1 = res.data.map((category) => {
               // Inicializa o contador para limitar a 10 anúncios por categoria
               let contador = 0;
 
               // Filtra os anúncios que correspondem à categoria atual e conta os primeiros 10
               let teste = res.teste.rows.filter(anuncio => {
                 if (category.id === anuncio.codAtividade && contador < 10) {
                   contador++;
                   return true;
                 }
                 return false;
               });
 
               // Adiciona a nova propriedade 'kledisom' com os anúncios correspondentes
               category.kledisom = teste;
               //console.log(teste)
 
               // Retorna o objeto category modificado
               return category;
             }); */



            //console.log(result1);

            // Atualiza o estado com os dados paginados
            setMinisitio({ anuncios: result1 });
            setNomeAtividade(result1);

            // Função de Paginação para mudar de página dinamicamente
            function paginator1(categories, currentPage = 1) {
              const limitPerPage = 10;

              return categories.map((category) => {
                // Total de anúncios para a categoria atual
                let totalAnuncios = category.kledisom;

                // Calcula o número de páginas
                let totalPages = Math.ceil(totalAnuncios.length / limitPerPage);

                // Garantir que a página atual não ultrapasse o número total de páginas
                if (currentPage > totalPages) currentPage = totalPages;
                if (currentPage < 1) currentPage = 1;

                // Paginação
                let startIndex = (currentPage - 1) * limitPerPage;
                let endIndex = startIndex + limitPerPage;

                // Pegue os anúncios paginados
                let paginatedAnuncios = totalAnuncios.slice(startIndex, endIndex);
                console.log(paginatedAnuncios)
                // Retorna os dados paginados para a categoria
                return {
                  ...category,
                  currentPage,
                  totalPages,
                  paginatedAnuncios,
                };
              });
            }

            //pagi();
            paginator(arr);

          } else {

          }

        })
    };


    if (book != undefined && id != undefined) {
      buscarAtividade();
    } else {
      buscarTodosClassificado();
    }


    function paginator(param, pageNumberClass) {
      // Array de 3000 objetos (exemplo)
      let arrayDeObjetos = Array.from({ length: 3000 }, (_, i) => ({ id: i + 1 }));

      // Função para paginar o array
      function paginate(array, pageNumber, limitPerPage) {
        const totalPages = Math.ceil(array.length / limitPerPage);

        // Garantir que a página esteja dentro do limite
        if (pageNumber > totalPages) pageNumber = totalPages;
        if (pageNumber < 1) pageNumber = 1;

        // Índices de início e fim dos objetos a serem exibidos na página atual
        const startIndex = (pageNumber - 1) * limitPerPage;
        const endIndex = startIndex + limitPerPage;

        // Retornar o array paginado e o total de páginas
        return {
          currentPage: pageNumber,
          totalPages: totalPages,
          data: array.slice(startIndex, endIndex)
        };
      }

      // Usando a função para obter a página 1 com 10 objetos por página
      const pageNumber = pageNumberClass || numberPage; // Página que você quer exibir
      const limitPerPage = 10; // Número de objetos por página
      const paginatedResult = paginate(param, pageNumber, limitPerPage);

      //console.log(paginatedResult);

      let categoriasFiltradas = [...new Map(paginatedResult.data.map(item => [item.codAtividade, item])).values()];

      //console.log(categoriasFiltradas);

      //setMinisitio({ anuncios: currentPageData });
      setNomeAtividade(categoriasFiltradas);
      //setNomeAtividade(paginatedResult.data);

      //console.log(currentPageData)

      setMinisitio({
        anuncios: paginatedResult.data,
        totalPaginas: Math.ceil(param.length / limitPerPage),
        paginaAtual: pageNumber
      });

      setLoading(false);
      setbtnNav(true);

    };

    function buscarId() {
      fetch(`${masterPath.url}/admin/desconto/read/all`)
        .then((x) => x.json())
        .then((res) => {
          if (res.success) {
            setListaIds(res.data);

          } else {
            console.error("encontrado na base de dados");
          }

        })
      return;
    };

    buscarId();

  }, [book, page, numberPage]);


  const teste = useRef(null)//observar

  useEffect(() => {

    const interID = setInterval(() => {
      if (document.querySelector(`#item_${id}`)) {
        console.log(document.querySelector(`#item_${id}`))
        document.querySelector(`#item_${id}`).children[0].style.border = "none";
        document.querySelector(`#item_${id}`).classList = "pulsating-border";

        document.querySelector(`#item_${id}`).scrollIntoView({ behavior: 'smooth' })
        clearInterval(interID);
      }
    }, 1000)

  }, [id])

  function buscarId(id) {
    const idEncontrado = listaIds.find(item => item.idDesconto == id);
    return idEncontrado;
  };





  useEffect(() => {
    function mensagemProgramada() {
      document.querySelectorAll('.msg-programada').forEach(item => item.remove());

      const ads = document.querySelectorAll('.MiniWebCard');

      if (ads.length > 0) {
        let rectUm = ads[0].getBoundingClientRect();
        let rectDois = ads[1].getBoundingClientRect();
        let rectTres = ads[2].getBoundingClientRect();
        let rectQuatro = ads[3].getBoundingClientRect();
        let rectCinco = ads[4].getBoundingClientRect();
        let rectSeis = ads[5].getBoundingClientRect();
        let rectSete = ads[6].getBoundingClientRect();
        let rectOito = ads[7].getBoundingClientRect();
        let rectNove = ads[8].getBoundingClientRect();

        const distance1 = rectDois.top - rectUm.bottom; // Distância vertical
        const distance2 = rectTres.top - rectDois.bottom; // Distância vertical
        const distance3 = rectQuatro.top - rectTres.bottom; // Distância vertical
        const distance4 = rectCinco.top - rectQuatro.bottom; // Distância vertical
        const distance5 = rectSeis.top - rectCinco.bottom; // Distância vertical
        const distance6 = rectSete.top - rectSeis.bottom; // Distância vertical
        const distance7 = rectOito.top - rectSete.bottom; // Distância vertical
        const distance8 = rectNove.top - rectOito.bottom; // Distância vertical
        //const distance9 = rectCinco.top - rectNove.bottom; // Distância vertical






        /* console.log(`Distância vertical entre ${5} e ${6}: ${distance6}px`);  
        console.log(`Distância vertical entre ${6} e ${7}: ${distance7}px`);  
        console.log(`Distância vertical entre ${7} e ${8}: ${distance8}px`);   */

        if (distance1 < 0) {
          const tempDiv = document.createElement("div");
          tempDiv.style.backgroundColor = 'red';
          tempDiv.innerHTML = "dfahfdjkfh";
          tempDiv.classList.add("msg-programada");

          console.log(`Distância vertical entre ${0} e ${1}: ${distance1}px`);

          // Insere a div antes do terceiro item
          ads[0].insertAdjacentElement("afterend", tempDiv);
        } else if (distance2 < 0) {
          const tempDiv = document.createElement("div");
          tempDiv.style.backgroundColor = 'red';
          tempDiv.innerHTML = "dfahfdjkfh";
          tempDiv.classList.add("msg-programada");

          console.log(`Distância vertical entre ${1} e ${2}: ${distance2}px`);

          // Insere a div antes do terceiro item
          ads[1].insertAdjacentElement("afterend", tempDiv);
        } else if (distance3 < 0) {
          const tempDiv = document.createElement("div");
          tempDiv.style.backgroundColor = 'red';
          tempDiv.innerHTML = "dfahfdjkfh";
          tempDiv.classList.add("msg-programada");

          console.log(`Distância vertical entre ${2} e ${3}: ${distance3}px`);

          // Insere a div antes do terceiro item
          ads[2].insertAdjacentElement("afterend", tempDiv);
        } else if (distance4 < 0) {
          const tempDiv = document.createElement("div");
          tempDiv.style.backgroundColor = 'red';
          tempDiv.innerHTML = "dfahfdjkfh";
          tempDiv.classList.add("msg-programada");

          console.log(`Distância vertical entre ${3} e ${4}: ${distance4}px`);

          // Insere a div antes do terceiro item
          ads[4].insertAdjacentElement("afterend", tempDiv);
        } else if (distance5 < 0) {
          const tempDiv = document.createElement("div");
          tempDiv.style.backgroundColor = 'red';
          tempDiv.innerHTML = "dfahfdjkfh";
          tempDiv.classList.add("msg-programada");

          console.log(`Distância vertical entre ${4} e ${5}: ${distance5}px`);

          // Insere a div antes do terceiro item
          document.querySelector('.masonry-layout').appendChild(tempDiv);
        }

      }





      /*   ads.forEach((item, i) => {
          if (i < ads.length - 1) { // Garante que não tentamos acessar ads[i+1] no último item
            let rectQuatro = item.getBoundingClientRect();
            let rectCinco = ads[i + 1].getBoundingClientRect();
            
            const distance = rectCinco.top - rectQuatro.bottom; // Distância vertical
            
            console.log(`Distância vertical entre ${i} e ${i + 1}: ${distance}px`);  
            console.log(item, ads[i + 1])
    
            if(i == 4) {
              if(distance < 0) {
                const tempDiv = document.createElement("div");
                tempDiv.style.backgroundColor = 'red';
                tempDiv.innerHTML = "dfahfdjkfh";
                tempDiv.classList.add("msg-programada");
         
                // Insere a div antes do terceiro item
                document.querySelector('.masonry-layout').appendChild(tempDiv);
              }
              console.log("5 elemento")
            } else {
              if(distance < 0) {
                const tempDiv = document.createElement("div");
                tempDiv.style.backgroundColor = 'red';
                tempDiv.innerHTML = "dfahfdjkfh";
                tempDiv.classList.add("msg-programada");
         
                // Insere a div antes do terceiro item
                item.insertAdjacentElement("afterend", tempDiv);
              }
            }
    
          }
        }); */






      let quatro = document.querySelectorAll('.MiniWebCard')[4];
      let cinco = document.querySelectorAll('.MiniWebCard')[5];

      // Verifica se os elementos existem antes de acessar suas propriedades
      /* if (quatro && cinco) {
          let rectQuatro = quatro.getBoundingClientRect();
          let rectCinco = cinco.getBoundingClientRect();
      
          const distance = rectCinco.top - rectQuatro.bottom; // Distância vertical
      
          //console.log(`Distância vertical entre ${4} e ${5}: ${distance}px`);
      
          if (distance > 1000) {
             // Remove todas as mensagens programadas
             document.querySelectorAll('.msg-programada').forEach(item => item.remove());
      
             // Cria a nova div temporária
             const tempDiv = document.createElement("div");
             tempDiv.style.backgroundColor = 'red';
             tempDiv.innerHTML = "dfahfdjkfh";
             tempDiv.classList.add("msg-programada");
      
             // Insere a div antes do terceiro item
             document.querySelectorAll('.MiniWebCard')[2].insertAdjacentElement("afterend", tempDiv);
      
             // Renderiza o componente React dentro da div
             //ReactDOM.render(<MsgProgramada type={1} />, tempDiv);
          } else if (distance < 0) {
              // Remove todas as mensagens programadas
              document.querySelectorAll('.msg-programada').forEach(item => item.remove());
      
              // Cria a nova div temporária
              const tempDiv = document.createElement("div");
              tempDiv.style.backgroundColor = 'red';
              tempDiv.innerHTML = "dfahfdjkfh";
              tempDiv.classList.add("msg-programada");
      
              // Insere a div antes do terceiro item
              //document.querySelectorAll('.MiniWebCard')[9].insertAdjacentElement("beforebegin", tempDiv);
              document.querySelector('.masonry-layout').appendChild(tempDiv);
      
              // Renderiza o componente React dentro da div
              //ReactDOM.render(<MsgProgramada type={2} />, tempDiv);
          }
      } */



      let start = 0;
      let next = 1;

      const atividadeTitles = document.querySelectorAll('.atividade-title');

      atividadeTitles.forEach((item, i, currentArr) => {
        // Certifique-se de que não estamos no último item
        if (i < atividadeTitles.length - 1) {
          let teste1 = item.getBoundingClientRect(); // Usando o item diretamente
          let teste2 = atividadeTitles[i + 1].getBoundingClientRect();

          const distance = teste2.top - teste1.bottom; // Distância vertical

          //console.log(`Distância vertical entre ${i} e ${i + 1}: ${distance}px`);
          //console.log(distance < 7, i)
          if (distance < 7 && i < 4) {
            //console.log("é maior")
          }

          if (distance <= -1) {

            /*     const tempDiv = document.createElement("div");
                tempDiv.style.backgroundColor = 'red';
                tempDiv.innerHTML = "dfahfdjkfh"
  
                item.insertAdjacentElement("afterend", tempDiv);
                 
                return; */
          }

          /* if (distance <= -2000 && distance >= -2500 && start == 0) {
  
            document.querySelectorAll('.msg-programada').forEach(item => item.remove())
  
            console.log(currentArr)
            const tempDiv = document.createElement("div");
            tempDiv.style.backgroundColor = 'red';
            tempDiv.innerHTML = "dfahfdjkfh";
            tempDiv.classList.add("msg-programada")
  
  
            //document.querySelectorAll('.atividade-title')[currentArr.length - 1].insertAdjacentElement("afterend", tempDiv);
            start = 1;
  
            document.querySelector('.masonry-layout').appendChild(tempDiv);
  
  
            // Renderiza o componente React dentro da div
            ReactDOM.render(<MsgProgramada />, tempDiv);
  
            return;
          } */

        } else {
          //console.log(`Não há próximo elemento para o índice ${i}`);
        }
      });




    }

    //mensagemProgramada()
  })

  return (
    <div className="App">

      <header>
        <Mosaico logoTop={true} borda="none" />
      </header>
      <main>

        {loading &&
          <button class="buttonload" style={{ display: "block" }}>
            <i class="fa fa-spinner fa-spin"></i>Carregando
          </button>
        }


        <Busca paginaAtual={"caderno"} />
        <h1 id="title-caderno" className='py-2'>Caderno {localStorage.getItem("caderno: ")} - {localStorage.getItem("uf: ")}</h1>
        <h2 className='py-4'>Existem {minisitio.totalPaginas} páginas no Caderno {localStorage.getItem("caderno: ")} - {localStorage.getItem("uf: ")}. Você está vendo a página {minisitio.paginaAtual}.</h2>
        <div className="container">
          {btnNav &&
            <div className="row p-3">
              <div className="col-md-6 text-end">
                <button id="btn-prev" onClick={() => setNumberPage(numberPage - 1)}>
                  <i className="fa fa-arrow-left mx-2"></i>
                  Anterior
                </button>
              </div>
              <div className="col-md-6 text-start">
                <button id="btn-next" onClick={() => setNumberPage(numberPage + 1)}>
                  Próximo
                  <i className="fa fa-arrow-right mx-2"></i>
                </button>
              </div>
            </div>
          }

          {/* teste row */}
          <div className="row p-3">

            <div className="col-md-6 w-100 secao-anuncios">

              <div
                className="masonry-layout position-relative"
              >
                {nomeAtividade.length > 0 && nomeAtividade.map((item, index) => (

                  //((index + 1) % 5 === 0) ? <MsgProgramada /> : "" 

                  (item != undefined || item.length > 0)
                    ?
                    <div id={item.id} key={item.id} className="atividade-title px-2" >
                      <h2 className='bg-yellow py-2'>
                        {item.codAtividade}
                      </h2>

                      {
                        //minisitio.anuncios
                        minisitio.anuncios.map((anuncio) => {

                          if (anuncio.codTipoAnuncio == 1) {
                            return <MiniWebCardSimples key={anuncio.codAnuncio} id={anuncio.codAnuncio} data={anuncio} />
                          } else {
                            if (anuncio.codAtividade == item.codAtividade) {
                              return <MiniWebCard key={anuncio.codAnuncio}
                                id={anuncio.codAnuncio}
                                data={minisitio}
                                codImg={anuncio.descImagem}
                                ref={teste}
                                empresa={anuncio.descAnuncio}
                                endereco={anuncio.descEndereco}
                                telefone={anuncio.descTelefone}
                                celular={anuncio.descCelular}
                                codDesconto={anuncio.codDesconto}
                                ids={buscarId(90)}
                              />
                            } <MsgProgramada />
                            //return <MiniWebCard key={anuncio.codAnuncio} id={anuncio.codAnuncio} data={minisitio} />
                          }

                          return null;
                        })
                      }
                      {
                        // Verifica se não é o último card e se não há anúncio associado à próxima atividade
                        //      index !== nomeAtividade.length - 1 && minisitio.anuncios.every(anuncio => anuncio.codAtividade !== nomeAtividade[index + 1].id) &&

                      }
                    </div>
                    :
                    <h1>erro</h1>
                ))}
                {/* {nomeAtividade.length > 0 && nomeAtividade.map((item, index) => (

                  // ((index + 1) % 5 === 0) ? <MsgProgramada /> : "" 


                  (item != undefined || item.length > 0)
                    ?
                    <div id={item.id} key={item.id} className="atividade-title px-2" >
                      <h2 className='bg-yellow py-2'>
                        {item.atividade}
                      </h2>
                      {console.log(item)}
                      {
                        //minisitio.anuncios
                        item.kledisom.map((anuncio) => {

                          if (anuncio.codTipoAnuncio == 1) {
                            return <MiniWebCardSimples key={anuncio.codAnuncio} id={anuncio.codAnuncio} data={anuncio} />
                          } else {
                            if (anuncio.codAtividade == item.id) {
                              return <MiniWebCard key={anuncio.codAnuncio}
                                id={anuncio.codAnuncio}
                                data={minisitio}
                                codImg={anuncio.descImagem}
                                ref={teste}
                                empresa={anuncio.descAnuncio}
                                endereco={anuncio.descEndereco}
                                telefone={anuncio.descTelefone}
                                celular={anuncio.descCelular}
                                codDesconto={anuncio.codDesconto}
                                ids={buscarId(90)}
                              />
                            } <MsgProgramada />
                            //return <MiniWebCard key={anuncio.codAnuncio} id={anuncio.codAnuncio} data={minisitio} />
                          }

                          return null;
                        })
                      }
                      {
                        // Verifica se não é o último card e se não há anúncio associado à próxima atividade
                        //      index !== nomeAtividade.length - 1 && minisitio.anuncios.every(anuncio => anuncio.codAtividade !== nomeAtividade[index + 1].id) &&
                          //    <MsgProgramada /> 
                      }
                    </div>
                    :
                    <h1>erro</h1>
                ))} */}
                {/* {<MsgProgramada />} */}
              </div>


            </div>
          </div>
        </div>

        {btnNav &&
          <div className="row p-3">
            <div className="col-md-6 text-end">
              <button id="btn-prev" onClick={() => setNumberPage(numberPage - 1)}>
                <i className="fa fa-arrow-left mx-2"></i>
                Anterior
              </button>
            </div>
            <div className="col-md-6 text-start">
              <button id="btn-next" onClick={() => setNumberPage(numberPage + 1)}>
                Próximo
                <i className="fa fa-arrow-right mx-2"></i>
              </button>
            </div>
          </div>
        }
      </main>

      <footer>
        <Nav styleClass="Nav" />
        <Footer />
      </footer>
    </div >
  );
}

export default Caderno;
