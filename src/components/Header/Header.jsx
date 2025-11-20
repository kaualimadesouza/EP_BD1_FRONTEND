/**
 * Componente Header.
 */
import { Link } from "react-router-dom";
import { Search, Calendar, User, Settings } from 'lucide-react'; // Importa ícones do Lucide React

function Header() {
    return (
        // Contêiner principal do cabeçalho, com layout flexível, espaçamento e cores de fundo/texto.
        <header className="flex items-center justify-between px-4 md:px-8 lg:px-70 py-4 bg-zinc-900 text-white transition-all duration-300">
            <div className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200 cursor-pointer">
                <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center transition-all duration-200 hover:bg-gray-200">
                    <div className="w-3 h-3 bg-zinc-900 transition-all duration-200"></div>
                </div>
                <span className="text-xl font-bold transition-all duration-200 hover:text-blue-400">Goalytics</span>
            </div>

            {/* Barra de pesquisa central. */}
            <div className="hidden md:flex items-center bg-zinc-800 rounded-full px-4 py-2 flex-grow mx-2 md:mx-8 max-w-xl transition-all duration-300 hover:bg-zinc-700 focus-within:bg-zinc-700 focus-within:ring-2 focus-within:ring-blue-500">
                <Search className="text-gray-400 mr-2 transition-colors duration-200" size={20} />
                <input
                    type="text"
                    placeholder="Pesquise por partidas, competições, times, jogadores e mais"
                    className="bg-transparent outline-none text-gray-300 placeholder-gray-500 flex-grow transition-all duration-200 focus:text-white"
                />
            </div>

            {/* Seção de navegação com ícones e botão de login. */}
            <div className="flex items-center space-x-4">
                <Calendar size={20} className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer" />
                <button className="flex items-center bg-white text-zinc-900 px-4 py-2 rounded-full font-semibold transition-all duration-200 hover:bg-blue-500 hover:text-white">
                    <User size={20} className="mr-2" />
                    ENTRAR
                </button>
                {/* Link para a página de administração. */}
                <Link to="/admin">
                    <Settings size={20} className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer" />
                </Link>
            </div>
        </header>
    );
}

export default Header;
