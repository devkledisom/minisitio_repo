import { useEffect, useState, useRef } from 'react';
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
  const [numberPage, setNumberPage] = useState(1);

  const location = useLocation();

  const pegarParam = new URLSearchParams(location.search);

  const page = pegarParam.get('page');
  const book = pegarParam.get('book');
  const id = pegarParam.get('id');
  const caderno = pegarParam.get('caderno');
  const estado = pegarParam.get('estado');

  useEffect(() => {
    async function buscarAtividade() {
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
              //console.log(category)
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



    function paginator(param) {
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
      const pageNumber = 1; // Página que você quer exibir
      const limitPerPage = 10; // Número de objetos por página
      const paginatedResult = paginate(param, pageNumber, limitPerPage);

      console.log(paginatedResult);


      //setMinisitio({ anuncios: currentPageData });
      //setNomeAtividade(currentPageData)
      setNomeAtividade(paginatedResult.data)

      //console.log(currentPageData)

      setMinisitio({
        anuncios: paginatedResult.data,
        totalPaginas: Math.ceil(param.length / 3000),
        paginaAtual: pageNumber
      });

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
        document.querySelector(`#item_${id}`).classList = "pulsating-border"

        document.querySelector(`#item_${id}`).scrollIntoView({ behavior: 'smooth' })
        clearInterval(interID);
      }
    }, 1000)

  }, [id])

  function buscarId(id) {
    const idEncontrado = listaIds.find(item => item.idDesconto == id);
    return idEncontrado;
  };

  return (
    <div className="App">

      <header>
        <Mosaico logoTop={true} borda="none" />
      </header>
      <main>
        <Busca paginaAtual={"caderno"} />
        <h1 id="title-caderno" className='py-2'>Caderno {localStorage.getItem("caderno: ")} - {localStorage.getItem("uf: ")}</h1>
        <h2 className='py-4'>Existem {minisitio.totalPaginas} páginas no Caderno {localStorage.getItem("caderno: ")} - {localStorage.getItem("uf: ")}. Você está vendo a página {minisitio.paginaAtual}.</h2>
        <div className="container">
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
          {/* teste row */}
          <div className="row p-3">

            <div className="col-md-6 w-100 secao-anuncios">

              <div
                className="masonry-layout"
              >
                {/*      {
                  nomeAtividade.map((item) => {
                    console.log(item)
                  })
                
                } */}
                {nomeAtividade.length > 0 && nomeAtividade.map((anuncio, index) => {

                  if (anuncio.codTipoAnuncio == 1) {
                    return <MiniWebCardSimples key={anuncio.codAnuncio} id={anuncio.codAnuncio} data={anuncio} />
                  } else {
                    //if (anuncio.codAtividade == item.id) {
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
                   // } <MsgProgramada />
                    //return <MiniWebCard key={anuncio.codAnuncio} id={anuncio.codAnuncio} data={minisitio} />
                  }

                  //((index + 1) % 5 === 0) ? <MsgProgramada /> : "" 

                 /*  (item != undefined || item.length > 0)
                    ?
                    <div  id={item.id} key={item.id} className="atividade-title px-2" >
                        <h2 className='bg-yellow py-2'>
                        {item.atividade}
                      </h2> 

                      {
                        //minisitio.anuncios
                        item.map((anuncio) => {



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
                    <h1>erro</h1> */
                })}
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
              </div>


            </div>
          </div>
        </div>
      </main>

      <footer>
        <Nav styleClass="Nav" />
        <Footer />
      </footer>
    </div >
  );
}

export default Caderno;
