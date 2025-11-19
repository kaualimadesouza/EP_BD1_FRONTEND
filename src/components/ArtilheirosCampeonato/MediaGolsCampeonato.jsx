
import React, { useEffect, useState } from "react";

function MediaGolsCampeonato() {
    const [medias, setMedias] = useState([]);

        // Exemplo de resposta do backend
        const jsonExemplo = [
            {
                "nome_campeonato": "Champions League - Grupo C",
                "media_total_gols": 3.75
            },
            {
                "nome_campeonato": "Brasileirão Betano",
                "media_total_gols": 2.58
            },
            {
                "nome_campeonato": "Copa do Brasil",
                "media_total_gols": 2.21
            },
            {
                "nome_campeonato": "Campeonato Estadual A1",
                "media_total_gols": 1.95
            }
        ];

        useEffect(() => {
                // Para usar o endpoint, descomente abaixo:
                // fetch("http://localhost:8080/campeonato/media-gols")
                //     .then(res => res.json())
                //     .then(data => setMedias(
                //         data.map(item => ({
                //             nomeCampeonato: item.nome_campeonato,
                //             media: item.media_total_gols.toFixed(2)
                //         }))
                //     ));

                // Usando o jsonExemplo para simular
                setMedias(
                        jsonExemplo.map(item => ({
                                nomeCampeonato: item.nome_campeonato,
                                media: item.media_total_gols.toFixed(2)
                        }))
                );
        }, []);

    return (
        <div className="mt-6 bg-zinc-900 text-white rounded-2xl p-5 text-sm border border-zinc-800 shadow-2xl">
            <h4 className="text-base font-bold mb-3 text-center">Média de gols por partida</h4>
            <div className="space-y-2">
                {medias.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 px-3 rounded-lg bg-zinc-800">
                        <span className="font-bold text-xs">{item.nomeCampeonato}</span>
                        <span className="font-bold text-[#374df5]">{item.media}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MediaGolsCampeonato;
