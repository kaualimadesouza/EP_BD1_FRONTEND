import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { useEffect, useState } from "react";

function ArtilheirosCampeonato() {
    const [campeonatos, setCampeonatos] = useState([]);
    const [indiceAtual, setIndiceAtual] = useState(0);
    const [mostrarMais, setMostrarMais] = useState(false);


    useEffect(() => {
        fetch("http://localhost:8080/campeonato/artilheiros")
            .then(res => {
                if (!res.ok) throw new Error("Erro ao buscar artilheiros");
                return res.json();
            })
            .then(data => setCampeonatos(data))
            .catch(() => {
                setCampeonatos([]);
            });
    }, []);

    if (campeonatos.length === 0) {
        return (
            <div className="w-full">
                <div className="bg-zinc-900 text-white rounded-2xl p-7 text-sm border border-zinc-800 shadow-2xl">
                    <p>Carregando artilheiros...</p>
                </div>
            </div>
        );
    }


    const campeonatoAtual = campeonatos[indiceAtual];
    const artilheiros = campeonatoAtual.artilheiros || [];
    // Lógica correta para mostrar só os 3 primeiros por padrão
    const artilheirosExibidos = mostrarMais ? artilheiros : artilheiros.slice(0, 3);

    const handleProximo = () => {
        setIndiceAtual((prev) => (prev + 1) % campeonatos.length);
        setMostrarMais(false);
    };
    const handleAnterior = () => {
        setIndiceAtual((prev) => (prev - 1 + campeonatos.length) % campeonatos.length);
        setMostrarMais(false);
    };

    return (
        <div className="w-full animate-fade-in">
            <div className="bg-zinc-900 text-white rounded-2xl p-7 text-sm space-y-3 border border-zinc-800 shadow-2xl transition-all duration-300 hover:shadow-3xl hover:border-zinc-700">
                <div className="flex justify-between items-center w-full mb-2">
                    <div className="flex-1 flex justify-center">
                        <h3 className="text-base font-bold transition-colors duration-200 hover:text-blue-400">Artilheiros</h3>
                    </div>
                    <div className="relative group">
                        <Info className="size-4 cursor-pointer transition-all duration-200 hover:opacity-80 hover:text-blue-400" />
                        <div className="absolute right-0 top-6 z-10 w-56 bg-zinc-800 text-white text-xs rounded-lg shadow-lg p-3 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200">
                            Este bloco mostra os principais artilheiros do campeonato selecionado, com número de jogos e gols.
                        </div>
                    </div>
                </div>
                <div className="mb-2 text-gray-400 text-xs text-center font-bold transition-colors duration-200 hover:text-gray-300">
                    {campeonatoAtual.nomeCampeonato}
                </div>
                <div
                    className={`space-y-3 transition-all duration-500 ease-in-out overflow-hidden ${mostrarMais ? 'max-h-[1000px]' : 'max-h-[220px]'}`}
                >
                    {artilheirosExibidos.map((artilheiro, idx) => (
                        <div key={artilheiro.id} className="flex items-center justify-between mb-2 rounded-lg py-2 px-2 transition-all duration-300 hover:bg-zinc-800 hover:opacity-90 cursor-pointer group">
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-xs transition-all duration-200 group-hover:text-blue-400">{idx + 1}</span>
                                    <img src={artilheiro.fotoJogador} alt={artilheiro.nome} className="size-10 rounded-full transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/25" />
                                <div>
                                    <span className="block font-bold text-xs transition-colors duration-200 group-hover:text-blue-400">{artilheiro.nome}</span>
                                    <span className="block opacity-80 text-xs transition-colors duration-200 group-hover:text-gray-300">{artilheiro.posicao}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                    <div className="bg-zinc-800 py-1 px-2 rounded-sm transition-all duration-300 group-hover:bg-zinc-700">
                                        <span className="font-bold transition-colors duration-200 group-hover:text-blue-400">Jogos: {artilheiro.numJogos}</span>
                                    </div>
                                    <div className="bg-[#374df5] py-1 px-2 rounded-sm transition-all duration-300 group-hover:bg-blue-600 group-hover:shadow-lg group-hover:shadow-blue-500/25">
                                        <span className="font-bold transition-all duration-200">Gols: {artilheiro.numGols}</span>
                                    </div>
                            </div>
                        </div>
                    ))}
                </div>
                {artilheiros.length > 3 && !mostrarMais && (
                    <div className="flex justify-center mt-2">
                        <button className="flex items-center gap-2 cursor-pointer text-white px-4 py-1 rounded-full font-bold transition-all duration-300 hover:bg-blue-600 hover:shadow-lg" onClick={() => setMostrarMais(true)}>
                            <span>Mostrar mais</span>
                            <ChevronDown className="transition-transform duration-200" />
                        </button>
                    </div>
                )}
                {mostrarMais && (
                    <div className="flex justify-center mt-2">
                        <button className="flex items-center gap-2 cursor-pointer text-white px-4 py-1 rounded-full font-bold transition-all duration-300 hover:bg-blue-600 hover:shadow-lg" onClick={() => setMostrarMais(false)}>
                            <span>Mostrar menos</span>
                            <ChevronUp className="transition-transform duration-200" />
                        </button>
                    </div>
                )}
                {/* Carrossel de campeonatos */}
                <div className="flex justify-between items-center text-gray-400 text-xs mt-4">
                    <span className="cursor-pointer transition-all duration-200 hover:text-white" onClick={handleAnterior}>{'<'} Campeonato anterior</span>
                    <div className="flex space-x-2">
                        {campeonatos.map((_, index) => (
                            <span
                                key={index}
                                className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-300 hover:opacity-80 ${
                                    index === indiceAtual ? 'bg-purple-500 shadow-lg shadow-purple-500/50' : 'bg-gray-600 hover:bg-gray-500'
                                }`}
                                onClick={() => { setIndiceAtual(index); setMostrarMais(false); }}
                            ></span>
                        ))}
                    </div>
                    <span className="cursor-pointer transition-all duration-200 hover:text-white" onClick={handleProximo}>{'>'} Próximo campeonato</span>
                </div>
            </div>
        </div>
    );
}

export default ArtilheirosCampeonato;