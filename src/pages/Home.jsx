import Header from "../components/Header/Header.jsx";
import UltimosJogos from "../components/UltimosJogos/UltimosJogos.jsx";
import JogosPrincipaisCampeonatosHome from "../components/JogosPrincipaisCampeonatosHome/JogosPrincipaisCampeonatosHome.jsx";
import ArtilheirosCampeonato from "../components/ArtilheirosCampeonato/ArtilheirosCampeonato.jsx";
import EstatisticasCampeonato from "../components/EstatisticasCampeonato/EstatisticasCampeonato.jsx";
import JogadoresMaisCarosCampeonato from "../components/JogadoresMaisCarosCampeonato/JogadoresMaisCarosCampeonato.jsx";
import Footer from "../components/Footer/Footer.jsx";

function Home() {
  return (
    <div className="bg-black space-y-6">
      <Header />
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_2fr_1fr] gap-4 md:gap-5 px-4 md:px-8 lg:px-70">
        <JogosPrincipaisCampeonatosHome />
        <div className="space-y-5">
          <UltimosJogos />
          <ArtilheirosCampeonato />
          <JogadoresMaisCarosCampeonato />
        </div>
        <div>
          <EstatisticasCampeonato />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Home
