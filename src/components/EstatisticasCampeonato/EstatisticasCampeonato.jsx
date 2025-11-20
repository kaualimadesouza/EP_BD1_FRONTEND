import React, { useState, useEffect } from "react";

function EstatisticasCampeonato() {
    const [medias, setMedias] = useState([]);
    const [estadios, setEstadios] = useState([]);

    useEffect(() => {
        const idCampeonato = 1; // Usando id fixo por enquanto
        fetch(`http://localhost:8080/campeonato/estatisticas/${idCampeonato}`)
            .then(res => res.json())
            .then(data => {
                setMedias(data.mediaGolsPorPartidaDTO);
                setEstadios(data.estadiosNaoEstaNoCampeonatoDTO);
            })
            .catch(() => {
                setMedias([]);
                setEstadios([]);
            });
    }, []);

    return (
        <div className="bg-zinc-900 text-white rounded-2xl p-5 text-sm border border-zinc-800 shadow-2xl transition-all duration-300 hover:shadow-3xl hover:border-zinc-700 animate-fade-in">
            <h4 className="text-base font-bold mb-3 text-center transition-colors duration-200 hover:text-blue-400">Estatísticas Gerais</h4>

            {/* Médias de Gols por Partida */}
            <div className="mb-4">
                <h5 className="text-sm font-bold mb-2 transition-colors duration-200 hover:text-blue-400">Média de Gols por Partida em cada campeonato</h5>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                    {medias.map((media, idx) => (
                        <div key={idx} className="flex justify-between items-center p-2 rounded bg-zinc-800 transition-all duration-300 hover:bg-zinc-700 hover:opacity-90 cursor-pointer">
                            <span className="text-xs transition-colors duration-200 hover:text-blue-400">{media.nomeCampeonato}:</span>
                            <span className="font-bold text-[#374df5] text-xs transition-all duration-200 hover:text-blue-300">{media.mediaGolsPorPartida}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Estádios Não Utilizados */}
            <div>
                <h5 className="text-sm font-bold mb-2 transition-colors duration-200 hover:text-blue-400">Estádios Não Utilizados no Campeonato</h5>
                <div className="space-y-1 overflow-y-auto">
                    {estadios.map((estadio, idx) => (
                        <div key={idx} className="flex justify-between items-center p-2 rounded bg-zinc-800 transition-all duration-300 hover:bg-zinc-700 hover:opacity-90 cursor-pointer">
                            <div className="flex-1">
                                <span className="text-xs font-bold transition-colors duration-200 hover:text-blue-400">{estadio.nomeEstadio}</span>
                                <span className="text-xs text-gray-400 block transition-colors duration-200 hover:text-gray-300">{estadio.cidadeEstadio}</span>
                            </div>
                            <span className="font-bold text-[#374df5] text-xs transition-all duration-200 hover:text-blue-300">{estadio.capacidadeAtual.toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default EstatisticasCampeonato;
