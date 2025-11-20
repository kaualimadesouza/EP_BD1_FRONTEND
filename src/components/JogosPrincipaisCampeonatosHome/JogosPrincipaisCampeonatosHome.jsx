
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-regular-svg-icons";


function JogosPrincipaisCampeonatosHome() {
  const [campeonatos, setCampeonatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoritos, setFavoritos] = useState({});

  const toggleFavorito = (tipo, id) => {
    const key = `${tipo}-${id}`;
    setFavoritos(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

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
  <div className="text-white py-6 px-5 rounded-2xl bg-zinc-900 text-sm border border-zinc-800 shadow-2xl animate-fade-in transition-all duration-300 hover:shadow-3xl hover:border-zinc-700">
  <div className="space-y-3 w-full">
        {loading ? (
          <div>Carregando...</div>
        ) : (
          campeonatos.map((camp) => (
            <div key={camp.idCampeonato} className="mb-8">
              {/* Sessão do Campeonato */}
              <div className="flex justify-between items-center mb-6 transition-all duration-300 hover:opacity-90">
                <div className="flex items-center gap-4">
                  {/* Se tiver um ícone, use, senão um placeholder */}
                  <img src={camp.iconCampeonato || flagBrasil} alt="flag" className="size-8 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25" />
                  <div>
                    <span className="block opacity-80 transition-colors duration-200 hover:text-gray-300">{camp.regiao || ""}</span>
                    <span className="block font-bold transition-colors duration-200 hover:text-blue-400 pr-1">{camp.nomeCampeonato}</span>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="w-px h-16 bg-gray-500"></div>
                  <FontAwesomeIcon 
                    icon={faStar} 
                    className={`cursor-pointer transition-all duration-200 hover:scale-110 ${favoritos[`camp-${camp.idCampeonato}`] ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'}`}
                    onClick={() => toggleFavorito('camp', camp.idCampeonato)}
                  />
                </div>
              </div>
              {/* Sessão dos Jogos desse determinado campeonato */}
              <div>
                {camp.ultimosJogos.map((jogo) => (
                  <div key={jogo.idJogo} className="flex justify-between items-center mb-6 rounded-lg py-2 px-2 transition-all duration-300 hover:bg-zinc-800 hover:opacity-90 cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="opacity-80 text-[12px] font-semibold transition-colors duration-200 group-hover:text-gray-300">
                        <span className="block">{jogo.horaJogo.slice(0,5)}</span>
                        <span className="block">{jogo.dataJogo}</span>
                      </div>
                      <div className="w-px h-16 bg-gray-500"></div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {/* Ícone do time casa, se existir */}
                          {jogo.times.timeCasa.icon ? (
                            <img src={jogo.times.timeCasa.icon} alt={jogo.times.timeCasa.nome} className="size-4 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/25" />
                          ) : null}
                          <span className="block transition-colors duration-200 group-hover:text-blue-400">{jogo.times.timeCasa.nome}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* Ícone do time visitante, se existir */}
                          {jogo.times.timeVisitante.icon ? (
                            <img src={jogo.times.timeVisitante.icon} alt={jogo.times.timeVisitante.nome} className="size-4 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/25" />
                          ) : null}
                          <span className="block transition-colors duration-200 group-hover:text-blue-400">{jogo.times.timeVisitante.nome}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 items-center">
                      <div className="flex gap-2 items-center">
                        <div className="text-right">
                          <span className="block opacity-75 transition-colors duration-200 group-hover:text-blue-400">{jogo.times.timeCasa.gols}</span>
                          <span className="block opacity-75 transition-colors duration-200 group-hover:text-blue-400">{jogo.times.timeVisitante.gols}</span>
                        </div>
                        <div className="w-px h-16 bg-gray-500"></div>
                      </div>
                      <FontAwesomeIcon 
                        icon={faStar} 
                        className={`cursor-pointer transition-all duration-200 hover:scale-110 ${favoritos[`jogo-${jogo.idJogo}`] ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'}`}
                        onClick={() => toggleFavorito('jogo', jogo.idJogo)}
                      />
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