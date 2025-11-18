/**
 * Componente Home.
 *
 * Este componente exibe os últimos jogos de futebol, permitindo a navegação entre eles.
 * Ele busca dados de uma API local Feita em Java usando JDBC para buscar no banco de dados postgres para obter informações sobre as partidas e os times.
 */
import Header from "../components/Header/Header.jsx";
import UltimosJogos from "../components/UltimosJogos/UltimosJogos.jsx";
import JogosPrincipaisCampeonatosHome from "../components/JogosPrincipaisCampeonatosHome/JogosPrincipaisCampeonatosHome.jsx";
import TabelaHome from "../components/TabelaHome/TabelaHome.jsx";


function Home() {
  return (
    <div className="bg-black min-h-screen space-y-6">
      <Header />
      {/* Seção principal do conteúdo, com layout flexível e espaçamento horizontal. */}
      <main className="flex gap-5 px-70">
        <JogosPrincipaisCampeonatosHome />
        <UltimosJogos />
      </main>
    </div>
  )
}

export default Home
