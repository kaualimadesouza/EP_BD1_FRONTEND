import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";

function JogadoresMaisCarosCampeonato() {
    const [campeonatos, setCampeonatos] = useState([]);
    const [indiceAtual, setIndiceAtual] = useState(0);
    const [mostrarMais, setMostrarMais] = useState(false);

    useEffect(() => {
        fetch("http://localhost:8080/campeonato/estatisticas/jogadorescaros")
            .then(res => res.json())
            .then(data => setCampeonatos(data))
            .catch(() => setCampeonatos([]));

        // Mock
        // setCampeonatos([
        //     {
        //         nomeCampeonato: "Copa do Mundo FIFA 2022",
        //         jogadoresMaisCaros: [
        //             { nome: "Kylian Mbappé", preco: 180000000, fotoJogador: "https://img.sofascore.com/api/v1/player/826643/image" },
        //             { nome: "Jude Bellingham", preco: 120000000, fotoJogador: null },
        //             { nome: "Vinícius Júnior", preco: 120000000, fotoJogador: "https://img.sofascore.com/api/v1/player/868812/image" },
        //             { nome: "Phil Foden", preco: 110000000, fotoJogador: null },
        //             { nome: "Bukayo Saka", preco: 100000000, fotoJogador: null },
        //             { nome: "Pedri", preco: 100000000, fotoJogador: null },
        //             { nome: "Harry Kane", preco: 90000000, fotoJogador: null },
        //             { nome: "Aurélien Tchouaméni", preco: 90000000, fotoJogador: null },
        //             { nome: "Gavi", preco: 90000000, fotoJogador: null },
        //             { nome: "Casemiro", preco: 90000000, fotoJogador: null }
        //         ]
        //     },
        //     {
        //         nomeCampeonato: "Supermundial de Clubes FIFA 2025",
        //         jogadoresMaisCaros: []
        //     },
        //     {
        //         nomeCampeonato: "Brasileirão Série A",
        //         jogadoresMaisCaros: []
        //     },
        //     {
        //         nomeCampeonato: "Teixeira das Pedras League",
        //         jogadoresMaisCaros: []
        //     }
        // ]);
    }, []);

    if (campeonatos.length === 0) {
        return (
            <div className="w-full">
                <div className="bg-zinc-900 text-white rounded-2xl p-7 text-sm border border-zinc-800 shadow-2xl">
                    <p>Carregando jogadores mais caros...</p>
                </div>
            </div>
        );
    }

    const campeonatoAtual = campeonatos[indiceAtual];
    const jogadores = campeonatoAtual.jogadoresMaisCaros || [];
    // Lógica para mostrar só os 3 primeiros por padrão
    const jogadoresExibidos = mostrarMais ? jogadores : jogadores.slice(0, 3);

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
                        <h3 className="text-base font-bold transition-colors duration-200 hover:text-blue-400">Jogadores Mais Caros</h3>
                    </div>
                </div>
                <div className="mb-2 text-gray-400 text-xs text-center font-bold transition-colors duration-200 hover:text-gray-300">
                    {campeonatoAtual.nomeCampeonato}
                </div>
                <div
                    className={`space-y-3 transition-all duration-500 ease-in-out overflow-hidden ${mostrarMais ? 'max-h-[1000px]' : 'max-h-[220px]'}`}
                >
                    {jogadoresExibidos.length > 0 ? jogadoresExibidos.map((jogador, idx) => (
                        <div key={idx} className="flex items-center justify-between mb-2 rounded-lg py-2 px-2 transition-all duration-300 hover:bg-zinc-800 hover:opacity-90 cursor-pointer group">
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-xs transition-all duration-200 group-hover:text-blue-400">{idx + 1}</span>
                                <img src={jogador.fotoJogador} alt={jogador.nome} className="size-10 rounded-full transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/25" />
                                <div>
                                    <span className="block font-bold text-xs transition-colors duration-200 group-hover:text-blue-400">{jogador.nome}</span>
                                </div>
                            </div>
                            <div className="bg-[#374df5] py-1 px-2 rounded-sm transition-all duration-300 group-hover:bg-blue-600 group-hover:shadow-lg group-hover:shadow-blue-500/25">
                                <span className="font-bold transition-all duration-200">€ {jogador.preco.toLocaleString()}</span>
                            </div>
                        </div>
                    )) : (
                        <p className="text-gray-400 text-xs text-center">Nenhum jogador encontrado.</p>
                    )}
                </div>
                {jogadores.length > 3 && !mostrarMais && (
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
                    <span className="cursor-pointer transition-all duration-200 hover:text-white" onClick={handleAnterior}><ChevronLeft className="inline transition-transform duration-200" /> Campeonato anterior</span>
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
                    <span className="cursor-pointer transition-all duration-200 hover:text-white" onClick={handleProximo}>Próximo campeonato <ChevronRight className="inline transition-transform duration-200" /></span>
                </div>
            </div>
        </div>
    );
}

export default JogadoresMaisCarosCampeonato;
