import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { masterPath } from '../../config/config';

import { Button } from '../../components/ui/button.tsx'
import { Input } from "../../components/ui/input.tsx"
import { Label } from "../../components/ui/label.tsx"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card.tsx"
import { Lock, Eye, EyeOff, CheckCircle2Icon, AlertCircleIcon, Loader2 } from "lucide-react"

import {
    Alert,
    AlertDescription,
    AlertTitle
} from "../../components/ui/alert.tsx"

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [message, setMessage] = useState(false);
    const [messageError, setMessageError] = useState(false);
    const [messageinfo, setMessageinfo] = useState(false);
    const [loader, setLoader] = useState(false);

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handleReset = async (e) => {
        e.preventDefault();
        setLoader(true);

        const formData = new FormData(e.target);
        const password = formData.get("password");
        const confirmPassword = formData.get("confirmPassword");

        if (password !== confirmPassword) {
            setMessageError(true);
            setLoader(false);
            return;
        }

        try {

            fetch(`${masterPath.url}/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token,
                    password,
                })
            }).then(x => x.json())
                .then(res => {
                    if (res.success) {
                        setLoader(false);
                        setMessage(true);
                        setMessageError(false);

                        setTimeout(() => {
                            navigate('/login');
                        }, 5000)

                    } else {
                        setLoader(false);
                        setMessageError(true);
                        setMessageinfo(res.message)
                    }

                })


        } catch (error) {
            setMessage('Token inválido ou expirado.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <div className="bg-yellow-400 rounded-full p-2 mr-3">
                                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">M</span>
                                </div>
                            </div>
                            <span className="text-xl font-bold text-gray-800">MINISITIO</span>
                        </div>
                        <div className="flex items-center space-x-4 gap-2">
                            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold">ASSINE AGORA</Button>
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
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Redefinir Senha</h1>
                        <p className="text-gray-700">Digite sua nova senha para concluir a recuperação</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-md mx-auto -mt-8 px-4 pb-16">
                <Card className="shadow-lg" style={{ paddingTop: 0 }}>
                    <CardHeader className="bg-gray-200 text-center rounded-t-xl">
                        <CardTitle className="text-gray-800 flex items-center justify-center gap-2 py-6">
                            <Lock className="w-5 h-5" />
                            Nova Senha
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <form className="space-y-6" onSubmit={handleReset}>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-gray-700 font-medium">
                                    Nova senha
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name='password'
                                        placeholder="Digite sua nova senha"
                                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                                    Confirmar nova senha
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        name='confirmPassword'
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirme sua nova senha"
                                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                            {/* 
                            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                                <p className="font-medium mb-1">Sua senha deve conter:</p>
                                <ul className="text-xs space-y-1">
                                    <li>• Pelo menos 8 caracteres</li>
                                    <li>• Uma letra maiúscula</li>
                                    <li>• Uma letra minúscula</li>
                                    <li>• Um número</li>
                                </ul>
                            </div> */}

                            <Button
                                type="submit"
                                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 font-semibold rounded-md transition-colors"
                            >
                                {loader ? <Loader2 className="h-4 w-4 animate-spin" /> : "Redefinir Senha"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
                {message &&
                    <Alert className='bg-green-100 text-green-800 border-green-300 mt-3'>
                        <CheckCircle2Icon />
                        <AlertTitle>Sucesso! </AlertTitle>
                        <AlertDescription>
                            Parabéns a sua senha foi alterada com sucesso!
                        </AlertDescription>
                    </Alert>
                }
                {messageError &&
                    <Alert variant="destructive" className='bg-red-100 text-red-800 border-red-300 mt-3'>
                        <AlertCircleIcon />
                        <AlertTitle>Falha! </AlertTitle>
                        <AlertDescription>
                            {!messageinfo ? "As senhas digitadas não correspondem!" : messageinfo}
                        </AlertDescription>
                    </Alert>
                }
            </div>

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
        /*        <form onSubmit={handleReset}>
                   <h2>Nova Senha</h2>
                   <input
                       type="password"
                       placeholder="Nova senha"
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       required
                   />
                   <button type="submit">Alterar Senha</button>
                   <p>{message}</p>
               </form> */
    );
}

export default ResetPassword;
