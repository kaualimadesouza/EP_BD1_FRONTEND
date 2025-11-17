import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import flagBrasil from "../../assets/flag_brasil.png";
import iconPalmeiras from "../../assets/palmeiras_icon.png";
import iconFlamengo from "../../assets/flamengo_icon.png";

function JogosPrincipaisCampeonatosHome() {
    return (
        <div className="text-white h-screen py-6 px-5 rounded-2xl bg-zinc-900 flex-1 text-sm">
          <div className="space-y-3">
            {/* Sessão do Campeonato */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <img src={flagBrasil} alt="flag" className="size-8" /> 
                <div>
                  <span className="block opacity-80">Brasil</span>
                  <span className="block font-bold">Brasileirão Betano</span>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-px h-12 bg-gray-500"></div>
                <FontAwesomeIcon icon={faStar} />
              </div>         
            </div>
            {/* Sessão dos Jogos desse determinado campeonato */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <div className="opacity-80 text-[12px] font-semibold">
                    <span className="block">18:30</span>
                    <span className="block">F2ºT</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-px h-12 bg-gray-500"></div>
                    <div>
                      <div className="flex items-center gap-2">
                        <img src={iconPalmeiras} alt="Palmeiras" className="size-4" />
                        <span className="block">Palmeiras</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <img src={iconFlamengo} alt="Flamengo" className="size-4" />
                        <span className="block">Flamengo</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="flex gap-2 items-center">
                    <div>
                      <span className="block opacity-75">0</span>
                      <span className="block opacity-75">0</span>
                    </div>
                    <div className="w-px h-12 bg-gray-500"></div>
                  </div>
                  <FontAwesomeIcon icon={faStar} />
                </div>         
              </div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <div className="opacity-80 text-[12px] font-semibold">
                    <span className="block">18:30</span>
                    <span className="block">F2ºT</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-px h-12 bg-gray-500"></div>
                    <div>
                      <div className="flex items-center gap-2">
                        <img src={iconPalmeiras} alt="Palmeiras" className="size-4" />
                        <span className="block">Palmeiras</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <img src={iconFlamengo} alt="Flamengo" className="size-4" />
                        <span className="block">Flamengo</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="flex gap-2 items-center">
                    <div>
                      <span className="block opacity-75">0</span>
                      <span className="block opacity-75">0</span>
                    </div>
                    <div className="w-px h-12 bg-gray-500"></div>
                  </div>
                  <FontAwesomeIcon icon={faStar} />
                </div>         
              </div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <div className="opacity-80 text-[12px] font-semibold">
                    <span className="block">18:30</span>
                    <span className="block">F2ºT</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-px h-12 bg-gray-500"></div>
                    <div>
                      <div className="flex items-center gap-2">
                        <img src={iconPalmeiras} alt="Palmeiras" className="size-4" />
                        <span className="block">Palmeiras</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <img src={iconFlamengo} alt="Flamengo" className="size-4" />
                        <span className="block">Flamengo</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="flex gap-2 items-center">
                    <div>
                      <span className="block opacity-75">0</span>
                      <span className="block opacity-75">0</span>
                    </div>
                    <div className="w-px h-12 bg-gray-500"></div>
                  </div>
                  <FontAwesomeIcon icon={faStar} />
                </div>         
              </div>
            </div>
          </div>
        </div>
    )
}

export default JogosPrincipaisCampeonatosHome;