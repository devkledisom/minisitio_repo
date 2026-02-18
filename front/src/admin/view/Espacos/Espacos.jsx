// components/OutroComponente.js
import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { useLocation, useNavigate } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';
import { masterPath, version } from '../../../config/config';
import { Plus as PlusIcon, Download as DownloadIcon, Upload as UploadIcon, Eye, Pencil, Trash2, Copy, Search } from 'lucide-react';

// shadcn UI components (real components from the project)
import { Button } from '../../../components/ui/button.tsx';
import { Badge } from "../../../components/ui/badge.tsx";
import { Input } from '../../../components/ui/input.tsx';
import { Card, CardHeader, CardContent, CardFooter } from '../../../components/ui/card.tsx';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from '../../../components/ui/dropdown-menu.tsx';

//CSS
import '../../assets/css/users.css';
import '../../assets/css/espacos/espacos.css';

//LIBS
import Swal from 'sweetalert2';


//componente
import Header from "../Header";
import Pagination from '../../components/Pagination';
import Spinner from '../../../components/Spinner';
import Duplicate from './Duplicate';
import EspacoDetailModal from './_components/EspacoDetailModal';

//API
import { fetchEspacos, deleteDuplicacaoEspaco } from '../../../api/admin/espacos';

const Espacos = () => {



    const [ids, setIds] = useState([]);
    const [anuncios, setAnucios] = useState([]);
    const [page, setPage] = useState(1);
    const [selectId, setSelectId] = useState(null);
    const [showSpinner, setShowSpinner] = useState(true);
    const [progressExport, setProgressExport] = useState(0);
    const [del, setDel] = useState(false);
    const [busca, setBusca] = useState(false);
    const [searchOptioncheck, setSearchOptioncheck] = useState(false);
    const [search, setSearch] = useState("");

    // Added missing states for UFs, cadernos and selected filters
    const [ufs, setUfs] = useState([]);
    const [caderno, setCaderno] = useState([]);
    const [estadoSelecionado, setEstadoSelecionado] = useState('todos');
    const [cadernoSelecionado, setCadernoSelecionado] = useState('todos');

    const campoBusca = useRef(null);
    const campoCaderno = useRef(null);
    const codOriginFather = useRef(null);

    // detail modal state
    const [detailOpen, setDetailOpen] = useState(false);
    const [detailEspaco, setDetailEspaco] = useState(null);
    // track selected rows in React state so UI (dropdown disabled) updates immediately
    const [selectedIds, setSelectedIds] = useState([]);

    const tokenAuth = sessionStorage.getItem('userTokenAccess');

    const filtered = (anuncios && anuncios.message && Array.isArray(anuncios.message.anuncios))
        ? anuncios.message.anuncios.filter((e) => {
            const q = (search || (campoBusca.current && campoBusca.current.value) || "").toString().toLowerCase();
            return (
                (e.descAnuncio && e.descAnuncio.toString().toLowerCase().includes(q)) ||
                (e.codAnuncio && e.codAnuncio.toString().includes(q)) ||
                (e.descCPFCNPJ && e.descCPFCNPJ.toString().toLowerCase().includes(q)) ||
                (e.codCaderno && e.codCaderno.toString().toLowerCase().includes(q)) ||
                (e.codUf && e.codUf.toString().toLowerCase().includes(q))
            );
        })
        : [];

    const location = useLocation();


    const getParam = new URLSearchParams(location.search);

    const param = getParam.get('page') ? getParam.get('page') : 1;



    useEffect(() => {
        setShowSpinner(true);


        if (campoBusca.current.value != '') {
            Promise.all([
                fetch(`${masterPath.url}/admin/anuncio/buscar?search=${campoBusca.current.value}&page=${param}&require=${searchOptioncheck}&uf=${estadoSelecionado}&caderno=${cadernoSelecionado}`).then((x) => x.json()),
                //fetch(`${masterPath.url}/admin/usuario/buscar/all`).then((x) => x.json())
            ])
                .then(([resAnuncio]) => {
                    //console.log(resAnuncio)
                    setAnucios(resAnuncio);
                    setShowSpinner(false);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    setShowSpinner(false);
                });
        } else {
            Promise.all([
                fetch(`${masterPath.url}/admin/espacos/read?page=${param}`).then((x) => x.json()),
                //fetch(`${masterPath.url}/admin/usuario/buscar/all`).then((x) => x.json())
            ])
                .then(([resAnuncio]) => {
                    //console.log(resAnuncio.message.anuncios)
                    setAnucios(resAnuncio);
                    setShowSpinner(false);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    setShowSpinner(false);
                });
        }



    }, [param]);

    useEffect(() => {
        fetch(`${masterPath.url}/ufs`)
            .then((x) => x.json())
            .then((res) => {
                setUfs(res);
            })

        /*         fetch(`${masterPath.url}/cadernos`)
                    .then((x) => x.json())
                    .then((res) => {
                        setCaderno(res);
                    }) */
    }, []);

    /*     useEffect(() => {
            fetch(`${masterPath.url}/cadernos?uf=${cadernoSelecionado}`)
                .then((x) => x.json())
                .then((res) => {
                    setCaderno(res);
                })
        }, [cadernoSelecionado]); */



    const navigator = useNavigate();


    function selecaoLinha(event) {
        //console.log(event.currentTarget)

        var linhas = document.querySelectorAll('tbody tr');
        // Remove a classe 'selecionada' de todas as linhas
        linhas.forEach(function (outraLinha) {
            outraLinha.classList.remove('selecionada');
        });

        setSelectId(event.currentTarget.id)

        // Adiciona a classe 'selecionada' à linha clicada
        event.currentTarget.classList.add('selecionada');

        return;
    };


    function apagarAnuncio() {
        if (!selectId) {
            Swal.fire({
                title: "Error!",
                text: "Selecione um anúncio para apagar, se você deseja apagar todos os anúncios, clique no botão 'Apagar Todos'",
                icon: "error"
            });
            return;
        }
        setShowSpinner(true);
        fetch(`${masterPath.url}/admin/anuncio/delete/${selectId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "authorization": 'Bearer ' + sessionStorage.getItem('userTokenAccess')
            },
        })
            .then((x) => x.json())
            .then((res) => {
                console.log(res)
                if (res.success) {
                    setShowSpinner(false);
                    alert("anuncio apagado")
                    document.querySelector(".selecionada").remove();
                }

            })
    };

    function apagarMultiplosAnucios() {
        if (!selectedIds || selectedIds.length === 0) return;
        setShowSpinner(true);

        // delete sequentially to avoid overloading server; collect promises
        const promises = selectedIds.map((id) => {
            return fetch(`${masterPath.url}/admin/anuncio/delete/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": 'Bearer ' + sessionStorage.getItem('userTokenAccess')
                },
            }).then((x) => x.json());
        });

        Promise.all(promises)
            .then((results) => {
                // optionally inspect results for errors
                // refresh list after deletes
                return fetch(`${masterPath.url}/admin/espacos/read?page=${param}`).then((x) => x.json());
            })
            .then((resAnuncio) => {
                setAnucios(resAnuncio);
                setSelectedIds([]); // clear selection
                setShowSpinner(false);
            })
            .catch((error) => {
                console.error('Error deleting items:', error);
                setShowSpinner(false);
            });
    };

    function apagarDup() {
        setShowSpinner(true);
        //let codigoDeOrigem = codOriginFather.current.innerText;

        //if (!codigoDeOrigem) {
        Swal.fire({
            title: "Apagar Duplicação",
            text: "Informe o código de origem para apagar as duplicações:",
            input: "number",
            inputAttributes: {
                autocapitalize: "off"
            },
            showCancelButton: true,
            confirmButtonText: "Apagar",
            confirmButtonColor: "red",
            showLoaderOnConfirm: true,


            // 2. Aplica suas próprias classes CSS
            customClass: {
                confirmButton: 'espaco-botao-delete',
                cancelButton: 'meu-botao-cancelar'
            },

            preConfirm: async (login) => {
                if (!login) {
                    Swal.showValidationMessage("Por favor, informe o código de origem.");
                    return false;
                }

                const response = await deleteDuplicacaoEspaco(login);

                if (response.success) {
                    Swal.fire({
                        title: "Sucesso!",
                        text: "Duplicação apagada com sucesso.",
                        icon: "success"
                    });

                    await fetchEspacos(param).then((resEspacos) => {
                        if (resEspacos.success) {
                            setAnucios(resEspacos);
                            setShowSpinner(false);
                        }
                    });
                }

                if (!response.success) {
                    Swal.showValidationMessage(response.message || "Não foi possível apagar a duplicação.");
                    return false;
                }


            }
        });

        return;
        //}


        /*  fetch(`${masterPath.url}/admin/anuncio/delete/${codigoDeOrigem}?type=dup`, {
             method: "DELETE",
             headers: {
                 "Content-Type": "application/json",
                 "authorization": 'Bearer ' + sessionStorage.getItem('userTokenAccess')
             },
         })
             .then((x) => x.json())
             .then((res) => {
                 if (res.success) {
                     setShowSpinner(false);
                     //alert("anuncio apagado")
                     //document.querySelector(".selecionada").remove();
                     fetch(`${masterPath.url}/admin/espacos/read?page=${param}`)
                         .then(x => x.json())
                         .then((resAnuncio) => {
                             setAnucios(resAnuncio);
                             setShowSpinner(false);
                         })
                         .catch(error => {
                             console.error('Error fetching data:', error);
                             setShowSpinner(false);
                         });
                 }
 
             }).catch((error) => {
                 setShowSpinner(false);
                 console.error('Error:', error);
                 Swal.fire({
                     title: "Error!",
                     text: "Não foi possível apagar o anúncio duplicado",
                     icon: "error"
                 });
             }) */
    };

    function buscarAnuncioId(e) {
        setShowSpinner(true);
        setBusca(true);
        const campoPesquisa = document.getElementById('buscar').value;

        if (!searchOptioncheck) {
            alert('Selecione um critério para a pesquisa');
            setShowSpinner(false);
            return;
        }

        fetch(`${masterPath.url}/admin/anuncio/buscar/?search=${campoPesquisa}&require=${searchOptioncheck}&uf=${estadoSelecionado}&caderno=${cadernoSelecionado}`)
            .then((x) => x.json())
            .then((res) => {
                if (res.success) {
                    //alert("encontrado");
                    setAnucios(res);
                    setShowSpinner(false);
                    //console.log("usussss", res)
                } else {
                    alert("Perfil não encontrado na base de dados");
                    setShowSpinner(false);
                }

            })
    };

    const formatData = (dataCompleta) => {
        if (!dataCompleta) return;
        let dataTempo = dataCompleta.split('T');
        let dataOriginal = dataTempo[0].split('-');

        return `${dataOriginal[2]}/${dataOriginal[1]}/${dataOriginal[0]}`;
    };

    const dataExpiracao = (dataCompleta) => {
        if (!dataCompleta) return;

        let dataTempo = dataCompleta.split('T');
        let dataOriginal = dataTempo[0];

        //const expirationDate = moment(dataOriginal).add(1, 'year').format('DD/MM/YYYY');
        const expirationDate = moment(dataOriginal).format('DD/MM/YYYY');

        //console.log("data", dataOriginal)

        return expirationDate;
    };

    const definirTipoAnuncio = (tipo) => {
        //console.log(tipo)
        switch (tipo) {
            case "1":
                return "Básico";
            case "2":
                return "Simples";
            case "3":
                return "Completo";
            case "4":
                return "Prefeitura";
            default:
                return "Tipo desconhecido";
        }
    };
    function exportExcell() {
        setShowSpinner(true);

        let totalItens = anuncios.message.totalItem;
        if (totalItens > 50000) {
            alert("Atenção, esse caderno atingiu o limite de 50.000 registros. O limite de exportação é de 50.000 registros");
        }

        /*
        Para 1000 linhas: 3125ms
Para 10000 linhas: 31250ms
Para 20000 linhas: 62500ms
Para 30000 linhas: 93750ms
Para 40000 linhas: 125000ms
Para 50000 linhas: 156250ms
Para 60000 linhas: 187500ms
Para 70000 linhas: 218750ms
Para 80000 linhas: 250000ms
Para 90000 linhas: 281250ms
Para 100000 linhas: 312500ms
        */

        if (campoBusca.current.value != '') {

            // Valor máximo em milissegundos
            const maxTime = 312500;

            // Atualiza o progresso a cada 10 ms (ajuste conforme necessário)
            const interval = 10;
            let currentTime = 0;

            // Função para calcular e exibir o percentual
            const intervalId = setInterval(() => {
                currentTime += interval;

                // Calcula o percentual
                const percent = Math.min((currentTime / maxTime) * 100, 100); // Garante que não ultrapasse 100%

                console.log(`Progresso: ${percent.toFixed(2)}%`);
                setProgressExport(percent.toFixed(2));

                // Para quando alcançar o valor máximo
                if (currentTime >= maxTime) {
                    clearInterval(intervalId);
                    console.log("Requisição concluída.");
                }
            }, interval);

            const campoPesquisa = document.getElementById('buscar').value;

            fetch(`${masterPath.url}/admin/anuncio/export?page=${param}&limit=${anuncios.message.totalItem}&export=full&uf=${estadoSelecionado}&caderno=${campoCaderno.current.value}&require=${searchOptioncheck}&search=${campoPesquisa}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(anuncios.message.anuncios)
            })
                .then(x => x.blob())
                .then(res => {
                    const url = window.URL.createObjectURL(res);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "planilha.xlsx"; // Define o nome do arquivo
                    document.body.appendChild(a);
                    a.click(); // Força o clique para baixar
                    document.body.removeChild(a); // Remove o elemento depois do clique
                    window.URL.revokeObjectURL(url); // Libera memória

                    setShowSpinner(false);
                    setProgressExport(0);
                    clearInterval(intervalId);

                    if (res.success) {
                        //console.log(res);
                        setShowSpinner(false);
                        setProgressExport(0);
                        clearInterval(intervalId);
                        window.location.href = res.downloadUrl;
                    }
                })
        } else {
            // Valor máximo em milissegundos
            const maxTime = 312500;

            // Atualiza o progresso a cada 10 ms (ajuste conforme necessário)
            const interval = 10;
            let currentTime = 0;

            // Função para calcular e exibir o percentual
            const intervalId = setInterval(() => {
                currentTime += interval;

                // Calcula o percentual
                const percent = Math.min((currentTime / maxTime) * 100, 100); // Garante que não ultrapasse 100%

                console.log(`Progresso: ${percent.toFixed(2)}%`);
                setProgressExport(percent.toFixed(2));

                // Para quando alcançar o valor máximo
                if (currentTime >= maxTime) {
                    clearInterval(intervalId);
                    console.log("Requisição concluída.");
                }
            }, interval);



            fetch(`${masterPath.url}/admin/anuncio/export?page=${param}&limit=${anuncios.message.totalItem}&export=full&uf=${estadoSelecionado}&caderno=${campoCaderno.current.value}&require=${searchOptioncheck}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(anuncios.message.anuncios)
            })
                .then(x => x.blob())
                .then(res => {
                    const url = window.URL.createObjectURL(res);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "planilha.xlsx"; // Define o nome do arquivo
                    document.body.appendChild(a);
                    a.click(); // Força o clique para baixar
                    document.body.removeChild(a); // Remove o elemento depois do clique
                    window.URL.revokeObjectURL(url); // Libera memória

                    setShowSpinner(false);
                    setProgressExport(0);
                    clearInterval(intervalId);

                    if (res.success) {
                        //console.log(res);
                        setShowSpinner(false);
                        setProgressExport(0);
                        clearInterval(intervalId);
                        window.location.href = res.downloadUrl;
                    }
                })
            /* fetch(`${masterPath.url}/admin/anuncio/export?page=${param}&limit=5000&caderno=${campoCaderno.current.value}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(anuncios.message.anuncios)
            })
                .then(x => x.json())
                .then(res => {
                    if (res.success) {
                        //console.log(res);
                        setShowSpinner(false);
                        window.location.href = res.downloadUrl;
                    }
                }) */
        }

    };

    function editRow() {
        if (selectId != null) {
            navigator(`/admin/anuncio/editar?id=${selectId}`);
        } else {
            Swal.fire({
                title: "Error!",
                text: "Seleciona um anúncio para editar",
                icon: "error"
            });
        }

    };

    function definirCriterioBusca(criterio) {
        setSearchOptioncheck(criterio)

        if (criterio === 'codCaderno' || criterio === 'codUF') {
            document.getElementById('buscar').value = ''
        }

        /*  switch(criterio) {
            case 'codAnuncio':
                setMostrarInputBusca(true);
                break;
            case 'descAnuncio':
                setMostrarInputBusca(true);
                break;
            case 'codCaderno':
                setMostrarInputBusca(false);
                document.getElementById('buscar').style.visibility = 'hidden';
                break;
            case 'descCPFCNPJ':
                setMostrarInputBusca(true);
                break;
            case 'codDesconto':
                setMostrarInputBusca(true);
                break;
            case 'codUF':
                setMostrarInputBusca(true);
                break;
            
        }  */

    };

    function selecaoEstado(e) {
        setEstadoSelecionado(e.target.value);
        limparFiltro(e.target.value);

        fetch(`${masterPath.url}/cadernos?uf=${e.target.value}`)
            .then((x) => x.json())
            .then((res) => {
                setCaderno(res);
            })
    }

    function limparFiltro(param) {
        if (param === 'todos') {
            setCadernoSelecionado("todos")
        }
    }

    function selecionarTodos() {
        const checkboxes = document.querySelectorAll('.chkChildren');
        checkboxes.forEach((checkbox) => {
            checkbox.checked = true;
        });
    };

    // Toggle all checkboxes using React state
    function toggleAll(e) {
        const checked = e.target.checked;
        if (checked) {
            const ids = filtered.map((item) => item.codAnuncio);
            setSelectedIds(ids);
        } else {
            setSelectedIds([]);
        }
    }

    // Return number of selected checkboxes (from state)
    function countSelected() {
        return selectedIds.length;
    }

    function handleCheckboxChange(id) {
        setSelectedIds((prev) => {
            if (prev.includes(id)) return prev.filter((i) => i !== id);
            return [...prev, id];
        });
    }

    function handleBulkDelete() {
        const selected = countSelected();
        if (!selected) {
            Swal.fire({ icon: 'info', title: 'Nenhum selecionado', text: 'Selecione pelo menos um registro para esta ação.' });
            return;
        }

        Swal.fire({
            title: `Apagar ${selected} item(ns)?`,
            text: 'Esta ação não pode ser desfeita.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Sim, apagar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                apagarMultiplosAnucios();
            }
        });
    }

    const style = {
        position: "fixed",
        zIndex: "999"
    }

    return (
        <div className="min-h-screen bg-background users app-espacos">
            {/* Header */}
            <div className="container mx-auto px-6 py-4">
                <Card className="mb-4">
                    <CardHeader className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground tracking-tight">Espaços</h1>
                            <p className="text-sm text-muted-foreground">Gerencie anúncios e espaços</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button size="sm" onClick={() => navigator('/admin/anuncio/cadastro')}>
                                <PlusIcon className="size-4" />
                                <span>Adicionar</span>
                            </Button>
                            <Duplicate selectId={selectId} setAnuncios={setAnucios} />
                            <Button size="sm" variant="outline" onClick={exportExcell}>
                                <DownloadIcon className="size-4" />
                                <span>Exportar</span>
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => navigator('/admin/anuncio/import')}>
                                <UploadIcon className="size-4" />
                                <span>Importar</span>
                            </Button>
                            <Button size="sm" variant="destructive" onClick={apagarDup}>
                                <UploadIcon className="size-4" />
                                <span>Apagar Duplicação</span>
                            </Button>

                        </div>
                    </CardHeader>
                </Card>
            </div>

            <main className="container mx-auto px-6">
                {/* Search / Actions */}
                <div className="mb-6 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="sm">Ação em massa</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuItem onClick={handleBulkDelete} disabled={selectedIds.length === 0}>Apagar selecionados</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="span6 col-md-6 d-flex flex-column">
                        {/* Alinha o bloco de busca na direita do painel */}
                        <div className='d-flex flex-column ml-auto w-full md:w-auto'>
                            <div className="pull-right d-flex items-center gap-2 w-full md:w-auto justify-end">

                                <select name="" id="uf" className="rounded-md border border-input bg-background px-2 py-1 text-sm" style={{ width: 64 }} onChange={(e) => selecaoEstado(e)}>
                                    <option value="todos">UF</option>
                                    {ufs.map(item => (
                                        <option key={item.id_uf} value={item.sigla_uf}>{item.sigla_uf}</option>
                                    ))}
                                </select>

                                <select name="" id="caderno" className="rounded-md border border-input bg-background px-2 py-1 text-sm" style={{ width: 120 }} onChange={(e) => setCadernoSelecionado(e.target.value)} ref={campoCaderno}>
                                    <option value="todos">CADERNO</option>

                                    {caderno.map(item => (
                                        item.UF == estadoSelecionado &&
                                        <option key={item.codCaderno} value={item.nomeCaderno}>{item.nomeCaderno}</option>
                                    ))}
                                </select>

                                <div className="relative flex-1 max-w-md">
                                    {/* <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><Search className="h-4 w-4" /></span> */}
                                    <input
                                        id="buscar"
                                        ref={campoBusca}
                                        placeholder="Código, Nome, Caderno, CPF/CNPJ, ID ou UF"
                                        className="pl-10 border-input rounded-md bg-transparent px-3 py-2 w-full text-sm"
                                        onKeyDown={(e) => e.key == "Enter" ? buscarAnuncioId() : ''}
                                    />
                                </div>

                                <Button size="sm" onClick={buscarAnuncioId}>
                                    <Search className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className='SearchOption mt-2'>

                                <label htmlFor="codigo" onClick={() => definirCriterioBusca('codAnuncio')}>
                                    <input type='radio' name="option" id="codigo" onClick={() => definirCriterioBusca('codAnuncio')} />
                                    Código
                                </label>
                                <label htmlFor="nome" onClick={() => definirCriterioBusca('descAnuncio')} className="ms-3">
                                    <input type='radio' name="option" id="nome" onClick={() => definirCriterioBusca('descAnuncio')} />
                                    Nome
                                </label>
                                <label htmlFor="ufCriterio" onClick={() => definirCriterioBusca('codUf')} className="ms-3">
                                    <input type='radio' name="option" id="ufCriterio" onClick={() => definirCriterioBusca('codUf')} />
                                    UF
                                </label>
                                <label htmlFor="cadernoCriterio" onClick={() => definirCriterioBusca('codCaderno')} className="ms-3">
                                    <input type='radio' name="option" id="cadernoCriterio" onClick={() => definirCriterioBusca('codCaderno')} />
                                    Caderno
                                </label>
                                <label htmlFor="cnpj" onClick={() => definirCriterioBusca('descCPFCNPJ')} className="ms-3">
                                    <input type='radio' name="option" id="cnpj" onClick={() => definirCriterioBusca('descCPFCNPJ')} />
                                    CNPJ
                                </label>
                                <label htmlFor="id" onClick={() => definirCriterioBusca('codDesconto')} className="ms-3">
                                    <input type='radio' name="option" id="id" onClick={() => definirCriterioBusca('codDesconto')} />
                                    ID
                                </label>
                                <label htmlFor="atividade" onClick={() => definirCriterioBusca('codAtividade')} className="ms-3">
                                    <input type='radio' name="option" id="atividade" onClick={() => definirCriterioBusca('codAtividade')} />
                                    Atividade
                                </label>

                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-lg border bg-card overflow-x-auto">
                    <table className="min-w-full divide-y">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="w-20 px-3 py-2 text-left">
                                    <input
                                        type="checkbox"
                                        aria-label="Selecionar todos"
                                        onChange={toggleAll}
                                        checked={selectedIds.length > 0 && selectedIds.length === filtered.length}
                                        className="mr-2 align-middle"
                                    />COD
                                </th>
                                <th className="px-3 py-2 text-left">NOME</th>
                                <th className="px-3 py-2 text-left">CNPJ</th>
                                <th className="px-3 py-2 text-left">TIPO</th>
                                <th className="px-3 py-2 text-left">CADERNO</th>
                                <th className="px-3 py-2 text-left">UF</th>
                                <th className="px-3 py-2 text-left">STATUS</th>
                                <th className="px-3 py-2 text-left">PAG.</th>
                                <th className="px-3 py-2 text-left">VALIDADE</th>
                                <th className="px-3 py-2 text-right">AÇÕES</th>
                            </tr>
                        </thead>
                        <tbody className="bg-background divide-y">
                            {filtered.map((item) => (
                                <tr
                                    key={item.codAnuncio}
                                    id={item.codAnuncio}
                                    className="cursor-pointer hover:bg-accent/10 transition-colors"
                                    onClick={(e) => selecaoLinha(e)}
                                >
                                    <td className="px-3 py-2 font-mono text-xs">
                                        <input
                                            type="checkbox"
                                            id={item.codAnuncio}
                                            className="chkChildren mr-2"
                                            checked={selectedIds.includes(item.codAnuncio)}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={() => handleCheckboxChange(item.codAnuncio)}
                                        />{item.codAnuncio}
                                    </td>
                                    <td className="px-3 py-2 font-medium max-w-[200px] truncate">{item.descAnuncio}</td>
                                    <td className="px-3 py-2 font-mono text-xs">{item.descCPFCNPJ}</td>
                                    <td className="px-3 py-2">{definirTipoAnuncio(item.codTipoAnuncio)}</td>
                                    <td className="px-3 py-2">{item.codCaderno}</td>
                                    <td className="px-3 py-2">{item.codUf}</td>
                                    <td className="px-3 py-2">
                                        <span className={item.activate ? 'inline-flex items-center px-2 py-1 text-xs rounded bg-green-100 text-green-800' : 'inline-flex items-center px-2 py-1 text-xs rounded bg-gray-100 text-gray-700'}>
                                            {item.activate ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2">
                                        {item.pagamentos && item.pagamentos.length > 0 ? (
                                            <Badge variant="outline" className={item.pagamentos[0].status === "Aprovado" ? "border-success text-success" : "border-warning text-warning"}>
                                                {item.pagamentos[0].status}
                                            </Badge>
                                        ) : (
                                            <Badge variant="success" className={item.pagamentos[0]?.status === "Aprovado" ? "border-success text-success" : "border-info text-info"}>
                                                {item.pagamentos.length > 0 ? item.pagamentos[0].status : "Isento"}
                                            </Badge>
                                            /*  <span className="text-muted-foreground text-xs">Isento</span> */
                                        )}
                                    </td>
                                    <td className="px-3 py-2 text-xs">{dataExpiracao(item.dueDate)}</td>
                                    <td className="px-3 py-2 text-right">
                                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                                            <Button size="sm" variant="ghost" onClick={() => { setDetailEspaco(item); setDetailOpen(true); }}>
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button size="sm" variant="ghost" onClick={() => { setSelectId(item.codAnuncio); navigator(`/admin/anuncio/editar?id=${item.codAnuncio}`); }}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => { setSelectId(item.codAnuncio); apagarAnuncio(); }}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={10} className="text-center py-12 text-muted-foreground">Nenhum espaço encontrado.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {anuncios && anuncios.message && (
                    <div className="mt-4">
                        <Pagination totalPages={anuncios.message.totalPaginas} paginaAtual={anuncios.message.paginaAtual} totalItem={anuncios.message.totalItem} table={"espacos"} />
                    </div>
                )}
                {/* Detail modal for selected espaco */}
                <EspacoDetailModal
                    espaco={detailEspaco}
                    open={detailOpen}
                    onOpenChange={(open) => {
                        setDetailOpen(open);
                        if (!open) setDetailEspaco(null);
                    }}
                />
            </main>
        </div>
    );
}

export default Espacos;
