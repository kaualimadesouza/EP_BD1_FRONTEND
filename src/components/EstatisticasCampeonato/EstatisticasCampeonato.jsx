import React, { useState, useEffect } from "react";

function EstatisticasCampeonato() {
    const [campeonatos, setCampeonatos] = useState([]);
    const [campeonatoSelecionado, setCampeonatoSelecionado] = useState("");

    useEffect(() => {
        fetch(`http://localhost:8080/campeonato/estatisticas/${campeonatoSelecionado}`)
            .then(res => res.json())
            .then(data => setCampeonatos([data]))
            .catch(() => setCampeonatos([]));

        // Mock por enquanto
        const mockEstatisticas = [
            {
                id_campeonato: 1,
                nome_campeonato: "Brasileirão Betano",
                estatisticas: {
                    elenco: {
                        distribuicao_por_posicao: [
                            { posicao: "ATA", total_atletas: 145 },
                            { posicao: "MEI", total_atletas: 180 },
                            { posicao: "DEF", total_atletas: 160 },
                            { posicao: "GOL", total_atletas: 42 }
                        ]
                    },
                    mercado: {
                        valor_medio_por_nacionalidade: [
                            { nacionalidade: "Brasil", media_valor: 2500000.50 },
                            { nacionalidade: "Argentina", media_valor: 1800000.00 },
                            { nacionalidade: "Uruguai", media_valor: 1200000.75 },
                            { nacionalidade: "Colombia", media_valor: 950000.00 }
                        ]
                    },
                    logistica: {
                        total_estadios_utilizados: 18
                    }
                }
            },
            {
                id_campeonato: 2,
                nome_campeonato: "Champions League",
                estatisticas: {
                    elenco: {
                        distribuicao_por_posicao: [
                            { posicao: "ATA", total_atletas: 120 },
                            { posicao: "MEI", total_atletas: 150 },
                            { posicao: "DEF", total_atletas: 140 },
                            { posicao: "GOL", total_atletas: 40 }
                        ]
                    },
                    mercado: {
                        valor_medio_por_nacionalidade: [
                            { nacionalidade: "França", media_valor: 3000000.00 },
                            { nacionalidade: "Alemanha", media_valor: 2800000.00 },
                            { nacionalidade: "Espanha", media_valor: 2600000.00 },
                            { nacionalidade: "Inglaterra", media_valor: 2400000.00 }
                        ]
                    },
                    logistica: {
                        total_estadios_utilizados: 32
                    }
                }
            }
        ];
        setCampeonatos(mockEstatisticas);
        setCampeonatoSelecionado(mockEstatisticas[0]?.nome_campeonato || "");
    }, []);

    const campeonato = campeonatos.find(c => c.nome_campeonato === campeonatoSelecionado);    
    return (
        <div className="bg-zinc-900 text-white rounded-2xl p-5 text-sm border border-zinc-800 shadow-2xl">
            <h4 className="text-base font-bold mb-3 text-center">Estatísticas do Campeonato</h4>

            {/* Seletor de campeonato */}
            <div className="mb-4">
                <label className="block text-xs font-bold mb-2">Selecione o Campeonato:</label>
                <select
                    value={campeonatoSelecionado}
                    onChange={(e) => setCampeonatoSelecionado(e.target.value)}
                    className="w-full bg-zinc-800 text-white rounded-lg px-3 py-2 text-xs"
                >
                    {campeonatos.map((camp, idx) => (
                        <option key={idx} value={camp.nome_campeonato}>
                            {camp.nome_campeonato}
                        </option>
                    ))}
                </select>
            </div>

            {/* Estatísticas */}
            <div className="space-y-4">
                {/* Elenco */}
                <div>
                    <h5 className="text-sm font-bold mb-2">Número de jogadores por posição</h5>
                    <div className="space-y-1">
                        {campeonato?.estatisticas.elenco.distribuicao_por_posicao.map((pos, idx) => (
                            <div key={idx} className="flex justify-between items-center py-1 px-2 rounded bg-zinc-800">
                                <span className="text-xs">{pos.posicao}:</span>
                                <span className="font-bold text-[#374df5] text-xs">{pos.total_atletas}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mercado */}
                <div>
                    <h5 className="text-sm font-bold mb-2">Média de equipes com jogadores mais valiosos por nacionalidade</h5>
                    <div className="space-y-1">
                        {campeonato?.estatisticas.mercado.valor_medio_por_nacionalidade.map((nac, idx) => (
                            <div key={idx} className="flex justify-between items-center py-1 px-2 rounded bg-zinc-800">
                                <span className="text-xs">{nac.nacionalidade}:</span>
                                <span className="font-bold text-[#374df5] text-xs">R$ {nac.media_valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Logística */}
                <div>
                    <h5 className="text-sm font-bold mb-2">Estádios Utilizados</h5>
                    <div className="flex justify-between items-center py-1 px-2 rounded bg-zinc-800">
                        <span className="text-xs">Estádios Utilizados:</span>
                        <span className="font-bold text-[#374df5] text-xs">{campeonato?.estatisticas.logistica.total_estadios_utilizados}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EstatisticasCampeonato;
