import { useEffect, useState } from 'react';
import { Form, Link, useParams, useNavigate } from 'react-router-dom';
import '../../styles/globals.css';
import { masterPath } from '../../config/config.js';

import { Button } from '../../components/ui/button.tsx'
import { Input } from "../../components/ui/input.tsx"
import { Label } from "../../components/ui/label.tsx"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card.tsx"
import { Mail, ArrowLeft, CheckCircle2Icon, Loader2, AlertCircleIcon } from "lucide-react";
import FormAdesao from './_components/FormAdesao.jsx';

import {
    Alert,
    AlertDescription,
    AlertTitle
} from "../../components/ui/alert.tsx"


function Promocao() {
    const [message, setMessage] = useState(false);
    const [messageError, setMessageError] = useState(false);
    const [loader, setLoader] = useState(false);

    const { codAnuncio, hash } = useParams();

    const navigate = useNavigate();

    //console.log(codAnuncio, hash);

    useEffect(() => {
        document.title = "Promoção Ativa - Minisitio";

        fetch(`${masterPath.url}/admin/campanha/promocao/${codAnuncio}/${hash}`)
            .then(x => x.json())
            .then(res => {
                if (res.success) {
                   //console.log(res);
                } else {

                    navigate('/token-invalido');

                    //console.log('Promoção inválida ou expirada.');
                }
            })
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);

        const formData = new FormData(e.target);
        const email = formData.get("email");

        try {

            fetch(`${masterPath.url}/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            }).then(x => x.json())
                .then(res => {

                    if (res.success) {
                        setLoader(false);
                        setMessage(true);
                        setMessageError(false);
                    } else {
                        setLoader(false);
                        setMessageError(true);
                    }
                })
        } catch (error) {
            setMessage('Erro ao enviar e-mail. Verifique se o e-mail está correto.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-24">
                        <div className="flex items-center">
                            <div className="rounded-full p-2 mr-3">
                               <img src="../../assets/img/logo.png" alt="MINISITIO" width="100"></img>
                            </div>
                          {/*   <span className="text-xl font-bold text-gray-800">MINISITIO</span> */}
                        </div>
                        <div className="flex items-center space-x-4 gap-2">
                           {/*  <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold">ASSINE AGORA</Button> */}
                            <div className="w-8 h-6 bg-green-500 rounded-sm flex items-center justify-center">
                                <span className="text-white text-xs font-bold">BR</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Yellow Background Section */}
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Promoção Ativa</h1>
                        <p className="text-gray-700">Aproveite as ofertas especiais disponíveis por tempo limitado!</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
           {/*  <div className="max-w-md mx-auto -mt-8 px-4 pb-16">
                <Card className="shadow-lg" style={{ paddingTop: 0 }}>
                    <CardHeader className="bg-gray-200 text-center rounded-t-xl">
                        <CardTitle className="text-gray-800 flex items-center justify-center gap-2 py-6">
                            <Mail className="w-5 h-5" />
                            Recuperação de Senha
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-700 font-medium">
                                    Digite seu email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name='email'
                                    placeholder="seu@email.com"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 font-semibold rounded-md transition-colors"
                            >
                                {loader ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Enviar Link de Recuperação'}

                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Voltar para o login
                            </Link>
                        </div>
                    </CardContent>
                </Card>
                {message &&
                    <Alert className='bg-green-100 text-green-800 border-green-300 mt-3'>
                        <CheckCircle2Icon />
                        <AlertTitle>Sucesso! </AlertTitle>
                        <AlertDescription>
                            As instruções de recuperação foram enviadas para o seu email!
                        </AlertDescription>
                    </Alert>
                }
                {messageError &&
                    <Alert variant="destructive" className='bg-red-100 text-red-800 border-red-300 mt-3'>
                        <AlertCircleIcon />
                        <AlertTitle>Falha! </AlertTitle>
                        <AlertDescription>
                            O email informado não é válido!
                        </AlertDescription>
                    </Alert>
                }
            </div> */}
            <FormAdesao />

            {/* Footer */}
            <footer className="bg-gray-600 text-white py-4">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-sm">
                        <span className="mr-2">💡</span>
                        Clique aqui e saiba as vantagens de anunciar conosco
                    </p>
                </div>
            </footer>
        </div>
        /*      <form onSubmit={handleSubmit}>
                 <h2>Recuperar Senha</h2>
                 <input
                     type="email"
                     placeholder="Seu e-mail"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     required
                 />
                 <button type="submit">Enviar</button>
                 <p>{message}</p>
                 <Button variant="outline">Button</Button>
             </form> */

    );
}

export default Promocao;
