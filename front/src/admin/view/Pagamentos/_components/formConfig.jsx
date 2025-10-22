import React, { useEffect, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../../../context/AuthContext';
import { masterPath, version } from '../../../../config/config';

import { Loader2 } from "lucide-react"

export default function FormConfig({ fetchCampanhas, setShowSpinner, setShow }) {
    const [idsList, setIdsList] = useState([]);
    const [uf, setUfs] = useState([]);
    const [cadernos, setCaderno] = useState([]);
    const [ufSelected, setUf] = useState(0);
    const [loader, setLoader] = useState(false);
    const [precoFixo, setPrecoFixo] = useState(0);

    const { user } = useContext(AuthContext);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        setShowSpinner(true);
        fetch(`${masterPath.url}/admin/preco-base/read`)
            .then((x) => x.json())
            .then((res) => {
                setPrecoFixo(res.value);
                setShowSpinner(false);
            });

    }, []);

    function formSubmit(data) {
        setLoader(true);
        fetch(`${masterPath.url}/admin/preco-base`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "authorization": 'Bearer ' + sessionStorage.getItem('userTokenAccess')
            },
            body: JSON.stringify(data)
        })
            .then((x) => x.json())
            .then((res) => {
                if (res.success) {
                    alert(res.message);
                    //setShow(false);
                    setLoader(false);
                } else {
                    alert("Erro ao criar campanha, tente novamente.");
                    setLoader(false);
                }
                setShowSpinner(false);
            })
    }

    function changeUf(e) {
        fetch(`${masterPath.url}/cadernos?uf=${e.target.value}`)
            .then((x) => x.json())
            .then((res) => {
                setCaderno(res);
            })
        setUf(e.target.value);
    }

    return (
        <form
            onSubmit={handleSubmit(data => formSubmit(data))}
            className="space-y-4 pt-6"
        >
            {/* ID promocional */}
            <div className="flex flex-col">
                <label htmlFor="id-promo" className="text-sm font-medium text-gray-700">
                    Valor anual da assinatura
                </label>
                <input
                    id="id-promo"
                    {...register("novoValor", { required: true })}
                    className="mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Digite o valor da assinatura"
                    value={precoFixo}
                    onChange={(e) => setPrecoFixo(e.target.value)}
                />
            </div>

            {/* UF e Caderno */}
            {/*   <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                    <label htmlFor="uf" className="text-sm font-medium text-gray-700">
                        UF
                    </label>
                    <select
                        id="uf"
                        {...register("uf")}
                        className="mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        onChange={(e) => changeUf(e)}
                    >
                        <option value="" selected="selected">- Selecione um estado -</option>
                        {
                            uf.map((uf) => (
                                <option key={uf.id_uf} value={uf.sigla_uf}>{uf.sigla_uf}</option>
                            ))
                        }
                    </select>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="caderno" className="text-sm font-medium text-gray-700">
                        Caderno
                    </label>
                    <select
                        id="caderno"
                        {...register("caderno")}
                        className="mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                        <option value="" selected="selected">- Selecione uma cidade -</option>
                        {
                            cadernos.map((cidades) => (
                                cidades.UF == ufSelected &&
                                <option key={cidades.codCaderno} value={cidades.nomeCaderno}>{cidades.nomeCaderno}</option>
                            ))
                        }
                    </select>
                </div>
            </div> */}

            {/* Fim da campanha */}
            {/*    <div className="flex flex-col">
                <label htmlFor="fim-campanha" className="text-sm font-medium text-gray-700">
                    Fim da campanha
                </label>
                <input
                    id="fim-campanha"
                    type="date"
                    {...register("dataFim", { required: true })}
                    className="mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.dataFim && (
                    <p className="text-red-500 text-sm mt-1">Campo obrigatório.</p>
                )}
            </div> */}

            {/* Botão */}
            <div className="pt-2">
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 flex justify-center items-center"
                >
                    {loader ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar"}
                </button>
            </div>
        </form>
    );
};
