import axios from "axios";
import { useEffect, useState } from "react";

function UltimosJogos() {
  // Estado para armazenar a lista dos últimos jogos com detalhes dos times.
  const [ultimosJogos, setUltimosJogos] = useState([]);
  // Estado para controlar o índice do jogo atualmente exibido.
  const [indiceAtual, setIndiceAtual] = useState(0);

  async function getAtuaisJogos() {
    try {
      // Faz uma requisição para obter a lista das últimas partidas.
      const response = await axios.get("http://localhost:8080/partida/detalhes/ultimas");
      // Para cada jogo, busca os detalhes dos times associados.
      const jogosComTimes = await Promise.all(
        response.data.map(async (jogo) => {
          // Requisição para obter os times de uma partida específica.
          const timesResponse = await axios.get(`http://localhost:8080/equipe/partida/${jogo.id}`);
          const times = timesResponse.data;
          return {
            ...jogo,
            // Atribui o primeiro time encontrado ou um placeholder.
            time1: times[0]
              ? { nome: times[0].nomePopular, placar: times[0].placar, sigla: times[0].sigla, urlEscudoEquipe: times[0].urlEscudoEquipe }
              : { nome: "Time 1", placar: "-", sigla: "T1" },
            // Atribui o segundo time encontrado ou um placeholder.
            time2: times[1]
              ? { nome: times[1].nomePopular, placar: times[1].placar, sigla: times[1].sigla, urlEscudoEquipe: times[1].urlEscudoEquipe }
              : { nome: "Time 2", placar: "-", sigla: "T2" },
          };
        })
      );
      setUltimosJogos(jogosComTimes);
    } catch (error) {
      console.error("Erro ao buscar jogos atuais:", error);
    }
  }

  // Lida com a busca dos jogos quando o componente for montado.
  useEffect(() => {
    getAtuaisJogos();
  }, []);

  // Lida com a navegação para o próximo jogo na lista.
  const handleProximo = () => {
    if (ultimosJogos.length === 0) return; // Não faz nada se não houver jogos.
    setIndiceAtual((prevIndice) => (prevIndice + 1) % ultimosJogos.length);
  };


  // Lida com a navegação para o jogo anterior na lista.   
  const handleAnterior = () => {
    if (ultimosJogos.length === 0) return; // Não faz nada se não houver jogos.
    setIndiceAtual((prevIndice) =>
      (prevIndice - 1 + ultimosJogos.length) % ultimosJogos.length
    );
  };

  // Se os jogos ainda não foram carregados (lista vazia), exibe uma tela de carregamento.
  if (ultimosJogos.length === 0) {
    return (
      <div className="flex-1">
        <div className="bg-zinc-900 text-white rounded-2xl shadow-lg p-10">
          <p>Carregando últimos jogos...</p>
        </div>
      </div>
    );
  }

  // Obtém o jogo atual com base no `indiceAtual`.
  const jogoAtual = ultimosJogos[indiceAtual];
  // Formata a data do jogo
  const dataFormatada = new Date(jogoAtual.data + 'T' + jogoAtual.horario).toLocaleDateString('pt-BR');
  // Formata o horário do jogo, pegando apenas as horas e minutos.
  const horarioFormatado = jogoAtual.horario.substring(0, 5);
  
  
  return (
        <div className="w-full animate-fade-in">
          {/* Card que exibe os detalhes do jogo atual. */}
          <div className="bg-zinc-900 text-white rounded-2xl p-7 text-sm border border-zinc-800 shadow-2xl transition-all duration-300 hover:shadow-3xl hover:border-zinc-700">
            <div className="mb-3 text-gray-400 text-sm text-center transition-colors duration-200">
                {jogoAtual.nomeCampeonato}
            </div>

            {/* Seção que exibe os detalhes dos times e informações centrais do jogo. */}
            <div className="flex justify-between items-center mb-5">
              <div className="flex flex-col items-center text-center w-1/3 transition-all duration-300 hover:opacity-80 cursor-pointer group">
                <img src={jogoAtual.time1.urlEscudoEquipe} alt={jogoAtual.time1.nome} className="w-10 h-10 mb-2 rounded-xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/25" />
                <span className="text-xs font-bold transition-colors duration-200 group-hover:text-blue-400">{jogoAtual.time1.nome}</span>
                <span className="text-lg transition-all duration-200 group-hover:text-blue-300">{jogoAtual.time1.placar}</span>
                <span className="text-xs text-gray-400 transition-colors duration-200 group-hover:text-gray-300">{jogoAtual.time1.sigla}</span>
              </div>
              {/* Informações centrais do jogo (horário, data, status, estádio). */}
              <div className="flex flex-col items-center transition-all duration-300 hover:opacity-80">
                <span className="text-lg font-bold transition-colors duration-200 hover:text-blue-400">{horarioFormatado}</span>
                <span className="text-xs text-gray-400 transition-colors duration-200 hover:text-gray-300">{dataFormatada}</span>
                <span className="text-xs text-gray-400 transition-colors duration-200 hover:text-gray-300">{jogoAtual.status}</span>
                <span className="text-xs text-gray-400 mt-2 transition-colors duration-200 hover:text-gray-300">{jogoAtual.nomeOficialEstadio}</span>
              </div>
              <div className="flex flex-col items-center text-center w-1/3 transition-all duration-300 hover:opacity-80 cursor-pointer group">
                <img src={jogoAtual.time2.urlEscudoEquipe} alt={jogoAtual.time2.nome} className="w-10 h-10 mb-2 rounded-xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-red-500/25" />
                <span className="text-xs font-bold transition-colors duration-200 group-hover:text-red-400">{jogoAtual.time2.nome}</span>
                <span className="text-lg transition-all duration-200 group-hover:text-red-300">{jogoAtual.time2.placar}</span>
                <span className="text-xs text-gray-400 transition-colors duration-200 group-hover:text-gray-300">{jogoAtual.time2.sigla}</span>
              </div>
            </div>

            {/* Seção que exibe o vencedor do campeonato. (Caso houver)*/}
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-center transition-colors duration-200 hover:text-blue-400">Vencedor do Campeonato</h3>
              <div className="flex justify-center mt-2">
                <button className="flex-1 bg-purple-600 border border-purple-500 rounded-full py-2 flex items-center justify-center cursor-default transition-all duration-300 hover:bg-purple-500 hover:shadow-lg hover:shadow-purple-500/25">
                  <span className="text-lg font-bold transition-all duration-200 hover:text-purple-200">{jogoAtual.campeao}</span>
                </button>
              </div>
            </div>

            {/* Controles de navegação entre os jogos (Anterior, Próximo e indicadores de página). */}
            <div className="flex justify-between items-center text-gray-400 text-sm mt-5">
              <span className="cursor-pointer transition-all duration-200 hover:text-white" onClick={handleAnterior}>{'<'} Anterior</span>
              <div className="flex space-x-2">
                {ultimosJogos.map((_, index) => (
                  <span
                    key={index}
                    className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-300 hover:opacity-80 ${
                      index === indiceAtual ? 'bg-purple-500 shadow-lg shadow-purple-500/50' : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                    onClick={() => setIndiceAtual(index)}
                  ></span>
                ))}
              </div>
              <span className="cursor-pointer transition-all duration-200 hover:text-white" onClick={handleProximo}>{'>'} Próximo</span>
            </div>
          </div>
        </div>
    )
}

export default UltimosJogos