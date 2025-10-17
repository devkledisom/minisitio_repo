import { Form, Link, useParams, useNavigate } from 'react-router-dom';
import '../../../styles/globais.css';


function Promocao() {

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
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Promoção não encontrada</h1>
                        <p className="text-gray-700">O link informado não é válido ou está expirado!</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-600 text-white py-4">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-sm">
                        <span className="mr-2">💡</span>
                        <Link to="/" className='text-white'>Clique aqui para voltar à página inicial.</Link>
                    </p>
                </div>
            </footer>
        </div>

    );
}

export default Promocao;
