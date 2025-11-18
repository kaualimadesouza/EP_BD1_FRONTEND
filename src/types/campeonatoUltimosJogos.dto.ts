export interface JogoUltimosJogosDTO {
  time1: string;
  iconTime1: string;
  time2: string;
  iconTime2: string;
  golsTime1: number;
  golsTime2: number;
  dataJogo: string;
  horaJogo: string;
}

export interface CampeonatoUltimosJogosDTO {
  iconcampeonato: string;
  regiao?: string;
  pais?: string;
  nomecampeonato: string;
  ultimosJogos: JogoUltimosJogosDTO[];
}

export type CampeonatosUltimosJogosResponseDTO = CampeonatoUltimosJogosDTO[];