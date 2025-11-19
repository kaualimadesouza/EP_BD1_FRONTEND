/**
 * Componente Home.
 *
 * Este componente exibe os últimos jogos de futebol, permitindo a navegação entre eles.
 * Ele busca dados de uma API local Feita em Java usando JDBC para buscar no banco de dados postgres para obter informações sobre as partidas e os times.
 */
import Header from "../components/Header/Header.jsx";
import UltimosJogos from "../components/UltimosJogos/UltimosJogos.jsx";
import JogosPrincipaisCampeonatosHome from "../components/JogosPrincipaisCampeonatosHome/JogosPrincipaisCampeonatosHome.jsx";
import ArtilheirosCampeonato from "../components/ArtilheirosCampeonato/ArtilheirosCampeonato.jsx";
import MediaGolsCampeonato from "../components/ArtilheirosCampeonato/MediaGolsCampeonato.jsx";
import EstatisticasCampeonato from "../components/EstatisticasCampeonato/EstatisticasCampeonato.jsx";

function Home() {
  return (
    <div className="bg-black min-h-screen space-y-6">
      <Header />
      {/* Seção principal do conteúdo, com layout flexível e espaçamento horizontal. */}
            {/* Seção principal do conteúdo, com layout em grid responsivo. */}
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 px-4 md:px-8 lg:px-70">
        <JogosPrincipaisCampeonatosHome />
        <div className="space-y-5">
          <UltimosJogos />
          <ArtilheirosCampeonato />
          <MediaGolsCampeonato />
        </div>
        <EstatisticasCampeonato />
      </main>
    </div>
  )
}

export default Home
