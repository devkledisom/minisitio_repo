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
import DistribuirAnuncios from './classificados/DistribuirAnuncios';

function Caderno() {

  const [nomeAtividade, setNomeAtividade] = useState([]);
  const [minisitio, setMinisitio] = useState([]);
  const [smoot, setSmoot] = useState(false);
  const [listaIds, setListaIds] = useState([]);
  const [btnNav, setbtnNav] = useState(false);
  const [contadorAds, setContadorAds] = useState(false);

  const [loading, setLoading] = useState(false);

  /*----------layout colums--------------->*/
  const [divs, setDivs] = useState([]); // Estado para armazenar as divs criadas
  const col1Ref = useRef(null); // Referência da primeira coluna
  const col2Ref = useRef(null); // Referência da segunda coluna
  const [counter, setCounter] = useState(1); // Contador para rotular as divs
  const maxHeight = 2347;
  const [limit, setLimit] = useState(null);
  const [base1, setBase1] = useState([]);
  const [base2, setBase2] = useState([]);

  const location = useLocation();

  const pegarParam = new URLSearchParams(location.search);

  const page = pegarParam.get('page');
  const book = pegarParam.get('book');
  const id = pegarParam.get('id');
  const caderno = pegarParam.get('caderno');
  const estado = pegarParam.get('estado');

  const [numberPage, setNumberPage] = useState(1);
  const [pageNumberUnique, setPageNumberUnique] = useState(true);
  const [ufs, setUfs] = useState([]);
  const [cadernos, setCadernos] = useState([]);

  useEffect(() => {

    fetch(`${masterPath.url}/cadernos`)
      .then((x) => x.json())
      .then((res) => {

        let nome = res.find((item) => item.codCaderno == caderno)
        setCadernos(nome.nomeCaderno);
      });
    fetch(`${masterPath.url}/ufs`)
      .then((x) => x.json())
      .then((res) => {
        let nome = res.find((item) => item.id_uf == estado)
        setUfs(nome.sigla_uf);
      });


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
          //console.log(res)
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



            if (pageNumberUnique) {

              arr.sort((a, b) => a.codAtividade.localeCompare(b.codAtividade));

              const itemIndex = arr.findIndex(item => item.codAnuncio == id) + 1;

              const pageNumberClass = Math.ceil(itemIndex / 10);

              //console.log(`pagina ${pageNumberClass}`, itemIndex);
              setNumberPage(pageNumberClass);
              paginator(arr, pageNumberClass);/*  */

            } else {
              paginator(arr);/*  */
            }
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
      console.log("primeiro")
    } else {
      buscarTodosClassificado();
      console.log("segundo")
    }


    function paginator(param, pageNumberClass) {
      // Array de 3000 objetos (exemplo)
      let arrayDeObjetos = Array.from({ length: 3000 }, (_, i) => ({ id: i + 1 }));

      param.sort((a, b) => a.codAtividade.localeCompare(b.codAtividade));

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
      //console.log(pageNumber)
      setMinisitio({
        anuncios: paginatedResult.data,
        totalPaginas: Math.ceil(param.length / limitPerPage),
        paginaAtual: pageNumber
      });

      console.log('lsaflsjkdhfasdjklfsd: ', {
        anuncios: paginatedResult.data,
        totalPaginas: Math.ceil(param.length / limitPerPage),
        paginaAtual: pageNumber
      })

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
            console.error("encontrado na base de dados")
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
        //console.log(document.querySelector(`#item_${id}`))
        document.querySelector(`#item_${id}`).children[0].style.border = "none";
        document.querySelector(`#item_${id}`).classList.add("pulsating-border");

        document.querySelector(`#item_${id}`).scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
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

    //mensagemProgramada();
    /* 
        let column1 = document.getElementById("col1");
        let column2 = document.getElementById("col2");
        let counter = 1; // Contador para rotular as divs
    
        setColumn1(column1.scrollHeight);
        setColumn2(column1.clientHeight);
     */






  })

  const addDiv = () => {
    // Cria uma nova div e atualiza o estado
    const newDiv = { id: counter, label: `Div ${counter}` };
    setDivs((prevDivs) => [...prevDivs, newDiv]);
    setCounter(counter + 1); // Incrementa o contador
  };

  // Função para verificar se a primeira coluna está cheia
  const isColumnFullold = (columnRef) => {
    if (columnRef.current) {
      console.log(columnRef.current.scrollHeight, columnRef.current.clientHeight)
      return columnRef.current.scrollHeight > columnRef.current.clientHeight;
    }
    return false;
  };

  const isColumnFull = (columnRef) => {
    if (columnRef.current) {
      /* console.log(columnRef.current.scrollHeight, columnRef.current.clientHeight) */
      return columnRef.current.scrollHeight > columnRef.current.clientHeight;
    }
    return false;
  };

  const debug = "mensagem debug: ";
  useEffect(() => {

    testin();
  }, [nomeAtividade])


  let arr = [];
  const testin = () => {

    const arrOu = [];

    const categorias = nomeAtividade;






    if (nomeAtividade.length < 1) {
      return;
    }

    const arrObj = [];
    let title;
    minisitio.anuncios.map((anuncio, i) => {
      //console.log(anuncio.codAtividade, minisitio.anuncios[i-1].codAtividade)
      if (anuncio.codAtividade) {
        arrObj.push({ title: anuncio.codAtividade });
      }
      arrObj.push(anuncio);

      const removeDuplicate = [...new Set(arrObj)];

      var list = removeDuplicate.length;

      var list = (list % 2 == 0) ? list : list + 1;

      //let division = list / 2;
      let division = list;

      const arrayParte1 = division < 5 ? removeDuplicate.slice(0, list) : removeDuplicate.slice(0, division);
      const arrayParte2 = division > 5 ? removeDuplicate.slice(division) : [];


      // Remover duplicados comparando objetos
      const arraySemDuplicados = arrayParte1.filter((item, index, self) =>
        index === self.findIndex((t) => (
          JSON.stringify(t) === JSON.stringify(item)
        ))
      );

      const arraySemDuplicados2 = arrayParte2.filter((item, index, self) =>
        index === self.findIndex((t) => (
          JSON.stringify(t) === JSON.stringify(item)
        ))
      );

      //console.log(arraySemDuplicados2);

      //setBase1([...new Set(arrayParte1)]);
      setBase1([...new Set(arraySemDuplicados)]);
      setBase2([...new Set(arraySemDuplicados2)]);
      //console.log(arrayParte1, division) 
    })


    nomeAtividade.map((item, index) => {

      arr.push(item);

      if (index == nomeAtividade.length - 1) {
        //setBase1(arr);
        //console.log(col1Ref.current.scrollHeight)

        //editorial1();


        minisitio.anuncios.map((anuncio, i) => {
          if (anuncio.codAtividade == item.codAtividade) {
            //console.log(anuncio)
          }
        })
      }

    });

  };


  // editorial1();
  function editorial12() {
    const observador = setInterval(() => {
      try {

        const colElement = document.querySelector('#col1'); // Armazena o elemento uma vez

        if (colElement) { // Verifica se colElement não é nulo ou indefinido


          if (colElement.scrollHeight != null && colElement.scrollHeight > 2326) {


            const children = Array.from(colElement.children); // Converte para um array de filhos

            console.log("1", colElement.scrollHeight, children[children.length - 1]);
            //col1Ref.current.removeChild(col1Ref.current.lastChild);

            if (children[children.length - 1] != null || children[children.length - 1] != undefined) {
              //children[children.length - 1].remove();
              //col1Ref.current.removeChild(col1Ref.current.lastChild);
              document.querySelector('#col1').removeChild(document.querySelector('#col1').lastChild)
              console.log(children[children.length - 1], 'bugado')
            }


          } else {
            clearInterval(observador); // Para o intervalo quando a condição não é mais atendida
          }

          /*  if (colElement.children.length > 0) {
             const children = Array.from(colElement.children); // Converte para um array de filhos
             
             // Certifique-se de que col1Ref e col1Ref.current não são indefinidos
             if (colElement.scrollHeight > 2326) {
               console.log(children[children.length - 1]);
       
               // Remove o último filho do array de children
               children[children.length - 1].remove();
             } else {
               clearInterval(observador); // Para o intervalo quando a condição não é mais atendida
             } 
           } else {
             clearInterval(observador); // Para o intervalo se não houver mais filhos
           } */

        } else {
          console.log("2", colElement.scrollHeight)
        }

      } catch (err) {
        console.log(err)
      }
    }, 1000); // Intervalo de 1 segundo
  }

  function editorial1() {
    const observador = setInterval(() => {
      try {
        const colElement = document.querySelector('#col1'); // Armazena o elemento uma vez

        if (colElement) { // Verifica se colElement não é nulo ou indefinido
          if (colElement.scrollHeight != null && colElement.scrollHeight > 2326) {
            const children = Array.from(colElement.children); // Converte para um array de filhos

            console.log("1", colElement.scrollHeight, children[children.length - 1]);

            const lastChild = colElement.lastChild; // Armazena o último filho

            // Verifique se o último filho existe e se ele ainda é filho de colElement
            if (lastChild) {
              if (colElement.contains(lastChild)) {
                //colElement.removeChild(lastChild);
                console.log("Elemento removido:", lastChild);
              } else {
                console.log("O último elemento não é filho de #col1.");
              }
            } else {
              console.log("Nenhum último elemento encontrado para remover.");
            }

          } else {
            clearInterval(observador); // Para o intervalo quando a condição não é mais atendida
          }

        } else {
          console.log("Elemento #col1 não encontrado.");
        }

      } catch (err) {
        console.error("Erro:", err);
      }
    }, 1000); // Intervalo de 1 segundo
  }




  function editorial1Experimental() {
    const intervalId = setInterval(() => {
      if (base1.length < 1) {
        return;
      }
      const colElement = document.querySelector('#col1'); // Tenta encontrar o elemento

      if (!colElement) {
        console.log("Elemento ainda não existe, aguardando...");
        return; // Sai do intervalo se o elemento não existir
      }

      // Verifica se o scrollHeight excede o limite
      if (colElement.scrollHeight > 2326) {
        console.log("Altura do scroll:", colElement.scrollHeight);
        const children = Array.from(colElement.children); // Converte para um array de filhos

        if (children.length > 0) {
          console.log("Removendo o último filho...");
          children[children.length - 1].remove();
        }
      } else {
        clearInterval(intervalId); // Para o intervalo se a condição não for mais atendida
        console.log("Observador finalizado. Altura suficiente.");
      }

    }, 1000); // Intervalo de 1 segundo
  }

  const testin2 = () => {

    let col1Count = document.querySelectorAll('#col1 .atividade-title').length;
    /*   if(document.querySelectorAll('#col1 .atividade-title')[col1Count - 1]) {
        document.querySelectorAll('#col1 .atividade-title')[col1Count - 1].remove();
      } */


    return (

      nomeAtividade.length > 0 && nomeAtividade.map((item, index) => (

        (index >= limit)
          ? (
            <div id={item.id} key={item.id} className="atividade-title px-2" >
              <h2 className='bg-yellow py-2'>
                {item.codAtividade}
              </h2>


              {minisitio.anuncios.map((anuncio) => {
                if (anuncio.codTipoAnuncio == 1) {
                  // Renderiza o componente MiniWebCardSimples
                  return <MiniWebCardSimples key={anuncio.codAnuncio} id={anuncio.codAnuncio} data={anuncio} />
                } else if (anuncio.codAtividade == item.codAtividade) {
                  // Renderiza o componente MiniWebCard se o codAtividade coincidir
                  return (
                    <MiniWebCard
                      key={anuncio.codAnuncio}
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

                  )
                }

                return null; // Retorna null se nenhuma condição for atendida
              })}

              {/* Mensagem programada pode ser incluída aqui, caso necessário */}
              {/* <MsgProgramada /> */}
            </div>
          )
          : null
      )))
  }



  function nextPage() {
    if (numberPage >= minisitio.totalPaginas) {
      alert("Você está na última página!");
      return;
    }

    setNumberPage(numberPage + 1);
    console.log(numberPage + 1);


    if (book != undefined && id != undefined) {
      setPageNumberUnique(false);
    }
    //setNomeAtividade([]);
  }
  function prevPage() {
    if (numberPage <= minisitio.totalPaginas) {
      alert("Você está na primeira página!");
      return;
    }

    setNumberPage(numberPage - 1);
    console.log(numberPage - 1);


    if (book != undefined && id != undefined) {
      setPageNumberUnique(false);
    }
    //setNomeAtividade([]);
  }


  return (
    <div className="App">

      <header>
        <Mosaico logoTop={true} borda="none" />
      </header>
      <main>

        {loading &&
          <button className="buttonload" style={{ display: "block" }}>
            <i class="fa fa-spinner fa-spin"></i>Carregando
          </button>
        }

        <Busca paginaAtual={"caderno"} />
        <h1 id="title-caderno" className='py-2'>Caderno {cadernos} - {ufs}</h1>
        <h2 className='py-4 info-title'>Existem {minisitio.totalPaginas} páginas no Caderno {cadernos} - {ufs}. Você está vendo a página {minisitio.paginaAtual}.</h2>
        {/*         <h1 id="title-caderno" className='py-2'>Caderno {localStorage.getItem("caderno: ")} - {localStorage.getItem("uf: ")}</h1>
        <h2 className='py-4'>Existem {minisitio.totalPaginas} páginas no Caderno {localStorage.getItem("caderno: ")} - {localStorage.getItem("uf: ")}. Você está vendo a página {minisitio.paginaAtual}.</h2>
 */}        <div className="container">
          {btnNav &&
            <div className="row p-3 btn-nav">
              <div className="col-md-6 col-6 text-end area-prev">
                <button id="btn-prev" onClick={prevPage}>
                  {/* <button id="btn-prev" onClick={() => setNumberPage(numberPage - 1)}> */}
                  <i className="fa fa-arrow-left mx-2"></i>
                  Anterior
                </button>
              </div>
              <div className="col-md-6 col-6 text-start area-next">
                <button id="btn-next" onClick={nextPage}>
                  Próximo
                  <i className="fa fa-arrow-right mx-2"></i>
                </button>
              </div>
            </div>
          }
          {/* teste row */}
          <div className="row p-3">

            <div className="col-md-6 w-100 secao-anuncios-caderno">
              <div class="grid-container">

                <div class="column" id="col1" ref={col1Ref}>
                  {
                    //minisitio.anuncios
                    base1.map((anuncio, i) => {

                      if (anuncio.title) {
                        return <h2 className='bg-yellow py-2'>
                          {anuncio.title}
                        </h2>

                      }

                      if (anuncio.codTipoAnuncio == 1) {
                        return <MiniWebCardSimples key={anuncio.codAnuncio} id={anuncio.codAnuncio} data={anuncio} />
                      } else {
                        //if (anuncio.codAtividade == item.codAtividade) {
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
                          ids={buscarId(anuncio.codDesconto)}
                        />
                        /* } <MsgProgramada />
                          if(i >= minisitio.anuncios.length-1) {
                           console.log("ultima render");
                           //editorial1()
                         }  */
                        //return <MiniWebCard key={anuncio.codAnuncio} id={anuncio.codAnuncio} data={minisitio} />
                      }

                      return null;
                    })
                  }


                  {base1.length > 0 && base1.map((item, index) => (

                    //((index + 1) % 5 === 0) ? <MsgProgramada /> : "" 

                    (item != undefined || item.length > 0)
                      ?
                      <div id={item.id} key={item.id} className="atividade-title px-2" >
                        {/*    <h2 className='bg-yellow py-2'>
                          {item.codAtividade}
                        </h2> */}

                        {/*     {
                          //minisitio.anuncios
                          minisitio.anuncios.map((anuncio, i) => {

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
                                if(i >= minisitio.anuncios.length-1) {
                                 console.log("ultima render");
                                 //editorial1()
                               } 
                              //return <MiniWebCard key={anuncio.codAnuncio} id={anuncio.codAnuncio} data={minisitio} />
                            }

                            return null;
                          })
                        } */}
                        {
                          // Verifica se não é o último card e se não há anúncio associado à próxima atividade
                          //      index !== nomeAtividade.length - 1 && minisitio.anuncios.every(anuncio => anuncio.codAtividade !== nomeAtividade[index + 1].id) &&

                        }
                      </div>
                      :
                      <h1>erro</h1>
                  ))}


                </div>
                <div class="column" id="col2">
                  {
                    //minisitio.anuncios
                    base2.map((anuncio, i) => {

                      if (anuncio.title) {
                        return <h2 className='bg-yellow py-2'>
                          {anuncio.title}
                        </h2>

                      }

                      if (anuncio.codTipoAnuncio == 1) {
                        return <MiniWebCardSimples key={anuncio.codAnuncio} id={anuncio.codAnuncio} data={anuncio} />
                      } else {
                        //if (anuncio.codAtividade == item.codAtividade) {
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
                        /* } <MsgProgramada />
                          if(i >= minisitio.anuncios.length-1) {
                           console.log("ultima render");
                           //editorial1()
                         }  */
                        //return <MiniWebCard key={anuncio.codAnuncio} id={anuncio.codAnuncio} data={minisitio} />
                      }

                      return null;
                    })
                  }
                  {
                    //testin2()
                  }
                </div>
              </div>

              {/* <DistribuirAnuncios nomeAtividade={nomeAtividade} minisitio={minisitio}/> */}



              <div
                className="masonry-layout position-relative"
              >
                {/*         {nomeAtividade.length > 0 && nomeAtividade.map((item, index) => (

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
                ))}  */}
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
          <div className='container'>
            <div className="row p-3 btn-nav">
              <div className="col-md-6 col-6 text-end area-prev">
                <button id="btn-prev" onClick={prevPage}>
                  {/* <button id="btn-prev" onClick={() => setNumberPage(numberPage - 1)}> */}
                  <i className="fa fa-arrow-left mx-2"></i>
                  Anterior
                </button>
              </div>
              <div className="col-md-6 col-6 text-start area-next">
                <button id="btn-next" onClick={nextPage}>
                  Próximo
                  <i className="fa fa-arrow-right mx-2"></i>
                </button>
              </div>
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
