/**
 * Componente Header.
 */
import { Link } from "react-router-dom";
import { Search, Calendar, User, Settings } from 'lucide-react'; // Importa ícones do Lucide React

function Header() {
    return (
        // Contêiner principal do cabeçalho, com layout flexível, espaçamento e cores de fundo/texto.
        <header className="flex items-center justify-between px-4 md:px-8 lg:px-70 py-4 bg-zinc-900 text-white">
            <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                    <div className="w-3 h-3 bg-zinc-900"></div>
                </div>
                <span className="text-xl font-bold">Goalytics</span>
            </div>

            {/* Barra de pesquisa central. */}
            <div className="hidden md:flex items-center bg-zinc-800 rounded-full px-4 py-2 flex-grow mx-2 md:mx-8 max-w-xl">
                <Search className="text-gray-400 mr-2" size={20} />
                <input
                    type="text"
                    placeholder="Pesquise por partidas, competições, times, jogadores e mais"
                    className="bg-transparent outline-none text-gray-300 placeholder-gray-500 flex-grow"
                />
            </div>

            {/* Seção de navegação com ícones e botão de login. */}
            <div className="flex items-center space-x-4">
                <Calendar size={20} className="text-gray-400" />
                <button className="flex items-center bg-white text-zinc-900 px-4 py-2 rounded-full font-semibold">
                    <User size={20} className="mr-2" />
                    ENTRAR
                </button>
                {/* Link para a página de administração. */}
                <Link to="/admin">
                    <Settings size={20} className="text-gray-400" />
                </Link>
            </div>
        </header>
    );
}

export default Header;
