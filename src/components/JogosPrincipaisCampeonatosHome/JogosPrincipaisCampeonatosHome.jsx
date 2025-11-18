
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import flagBrasil from "../../assets/flag_brasil.png";
import iconPalmeiras from "../../assets/palmeiras_icon.png";
import iconFlamengo from "../../assets/flamengo_icon.png";


function JogosPrincipaisCampeonatosHome() {
  const [campeonatos, setCampeonatos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/campeonato/jogos_recentes")
      .then((res) => res.json())
      .then((data) => {
        setCampeonatos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
  <div className="text-white py-6 px-5 rounded-2xl bg-zinc-900 text-sm">
  <div className="space-y-3 w-full max-w-2xl mx-auto">
        {loading ? (
          <div>Carregando...</div>
        ) : (
          campeonatos.map((camp) => (
            <div key={camp.idCampeonato} className="mb-8">
              {/* Sessão do Campeonato */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  {/* Se tiver um ícone, use, senão um placeholder */}
                  <img src={camp.iconCampeonato || flagBrasil} alt="flag" className="size-8" />
                  <div>
                    <span className="block opacity-80">{camp.regiao || ""}</span>
                    <span className="block font-bold">{camp.nomeCampeonato}</span>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="w-px h-12 bg-gray-500"></div>
                  <FontAwesomeIcon icon={faStar} />
                </div>
              </div>
              {/* Sessão dos Jogos desse determinado campeonato */}
              <div>
                {camp.ultimosJogos.map((jogo) => (
                  <div key={jogo.idJogo} className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                      <div className="opacity-80 text-[12px] font-semibold">
                        <span className="block">{jogo.horaJogo.slice(0,5)}</span>
                        <span className="block">{jogo.dataJogo}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-px h-12 bg-gray-500"></div>
                        <div>
                          <div className="flex items-center gap-2">
                            {/* Ícone do time casa, se existir */}
                            {jogo.times.timeCasa.icon ? (
                              <img src={jogo.times.timeCasa.icon} alt={jogo.times.timeCasa.nome} className="size-4" />
                            ) : null}
                            <span className="block">{jogo.times.timeCasa.nome}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {/* Ícone do time visitante, se existir */}
                            {jogo.times.timeVisitante.icon ? (
                              <img src={jogo.times.timeVisitante.icon} alt={jogo.times.timeVisitante.nome} className="size-4" />
                            ) : null}
                            <span className="block">{jogo.times.timeVisitante.nome}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 items-center">
                      <div className="flex gap-2 items-center">
                        <div>
                          <span className="block opacity-75">{jogo.times.timeCasa.gols}</span>
                          <span className="block opacity-75">{jogo.times.timeVisitante.gols}</span>
                        </div>
                        <div className="w-px h-12 bg-gray-500"></div>
                      </div>
                      <FontAwesomeIcon icon={faStar} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default JogosPrincipaisCampeonatosHome;