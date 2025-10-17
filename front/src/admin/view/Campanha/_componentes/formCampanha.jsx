import React, { useEffect, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../../../context/AuthContext';
import { masterPath, version } from '../../../../config/config';

import { Loader2 } from "lucide-react"

export default function FormCampanha({ fetchCampanhas, setShowSpinner, setShow }) {
    const [idsList, setIdsList] = useState([]);
    const [uf, setUfs] = useState([]);
    const [cadernos, setCaderno] = useState([]);
    const [ufSelected, setUf] = useState(0);
    const [loader, setLoader] = useState(false);

    const { user } = useContext(AuthContext);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        setShowSpinner(true);
        fetch(`${masterPath.url}/admin/campanha/desconto/read`)
            .then((x) => x.json())
            .then((res) => {
                setShowSpinner(false)
                setIdsList(res.message.IdsValue)
            })

        fetch(`${masterPath.url}/ufs`)
            .then((x) => x.json())
            .then((res) => {
                setUfs(res);
            })

    }, []);

    useEffect(() => {
        if (user?.descNome) {
            setValue("criador", user.descNome); // seta o valor no form
        }
    }, [user, setValue]);

    function formSubmit(data) {
        setLoader(true);
        fetch(`${masterPath.url}/admin/campanha/create`, {
            method: "POST",
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
                    fetchCampanhas();
                    setShow(false);
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
                    ID promocional
                </label>
                <select
                    id="id-promo"
                    {...register("idPromocional", { required: true })}
                    className="mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Digite o ID"
                >
                    <option value="">Selecione</option>
                    {idsList.map((item, index) => (
                        <option key={index} value={item.idDesconto}>{item.hash} - {item.nmUsuario}</option>
                    ))}
                </select>
            </div>

            {/* UF e Caderno */}
            <div className="grid grid-cols-2 gap-4">
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
            </div>

            {/* Fim da campanha */}
            <div className="flex flex-col">
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
            </div>

            {/* Botão */}
            <div className="pt-2">
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 flex justify-center items-center"
                >
                    {loader ? <Loader2 className="h-4 w-4 animate-spin" /> : "Gerar Campanha"}
                </button>
            </div>
        </form>
    );
};
