import psycopg2
from faker import Faker
import random
from datetime import date, time, timedelta, datetime

# --- CONFIGURAÇÃO DO BANCO DE DADOS ---
# Use as credenciais fornecidas
DB_NAME = "postgres"
DB_USER = "postgres.xevlercinmqwjvjyxpmu"
DB_PASS = "dMzcbvgtv5qxUZar"
DB_HOST = "aws-1-sa-east-1.pooler.supabase.com"
DB_PORT = "5432"

# --- PARÂMETROS DE ESCALA ---
NUM_EQUIPES = 20
JOGADORES_POR_EQUIPE = 100 # Total de 2000 jogadores
NUM_PARTIDAS = 50
EVENTOS_POR_PARTIDA = 15 # Aumenta a densidade de eventos

# Inicializa Faker para gerar dados aleatórios em português
fake = Faker('pt_BR')
Faker.seed(0)

# Listas globais para armazenar IDs
EQUIPE_IDS = []
JOGADOR_IDS = []
PARTIDA_IDS = []
CAMPEONATO_ID = None
ESTADIO_ID = None

# --- FUNÇÕES AUXILIARES ---

def get_db_connection():
    """Cria e retorna a conexão com o banco de dados."""
    return psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASS,
        host=DB_HOST,
        port=DB_PORT
    )

def execute_query(conn, query, params=None, fetch=False, commit=True):
    """Executa uma query."""
    with conn.cursor() as cur:
        try:
            cur.execute(query, params)
            if fetch:
                return cur.fetchone()[0]
            if commit:
                conn.commit()
            return None
        except Exception as e:
            conn.rollback()
            # print(f"Erro ao executar a query: {e}\nQuery: {query[:80]}...\nParâmetros: {params[:20]}...")
            print(f"❌ ERRO: {e}")
            return None

# --- FUNÇÕES DE INSERÇÃO ---

def inserir_campeonato(conn):
    """Insere um campeonato aleatório."""
    global CAMPEONATO_ID
    
    nome = fake.unique.city() + " League"
    temporada = random.randint(2023, 2025)
    
    query = """
    INSERT INTO campeonato (nome, temporada, tipo_campeonato, status, regiao, url_campeonato)
    VALUES (%s, %s, %s, %s, %s, %s)
    RETURNING id;
    """
    CAMPEONATO_ID = execute_query(conn, query, (nome, temporada, 'Nacional', 'Em Andamento', fake.country(), fake.url()), fetch=True)
    print(f"✅ Campeonato '{nome}' ({temporada}) inserido com ID: {CAMPEONATO_ID}")
    return CAMPEONATO_ID

def inserir_estadio(conn):
    """Insere um estádio aleatório."""
    global ESTADIO_ID
    
    nome_oficial = fake.company() + " Stadium"
    capacidade_maxima = random.randint(30000, 90000)
    
    query = """
    INSERT INTO estadio (nome_oficial, nome_apelido, capacidade_atual, capacidade_maxima, pais, endereco, data_inauguracao, tipo_gramado)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    RETURNING id;
    """
    ESTADIO_ID = execute_query(conn, query, (
        nome_oficial,
        "The Colossus",
        random.randint(25000, capacidade_maxima),
        capacidade_maxima,
        fake.country(),
        fake.address(),
        fake.date_between(start_date='-50y', end_date='-5y'),
        random.choice(['Natural', 'Sintético'])
    ), fetch=True)
    print(f"✅ Estádio '{nome_oficial}' inserido com ID: {ESTADIO_ID}")
    return ESTADIO_ID

def inserir_equipes(conn):
    """Insere equipes e relaciona ao campeonato."""
    global EQUIPE_IDS
    
    if not CAMPEONATO_ID: return
    
    rel_campeonato_data = []
    
    for _ in range(NUM_EQUIPES):
        # --- CORREÇÃO DO ERRO city_prefix ---
        cidade_equipe = fake.city()
        nome_popular = cidade_equipe + " " + random.choice(["FC", "Esporte Clube", "Tigres", "Leões"])
        
        # Inserção individual de equipe (necessário para obter o ID de retorno)
        query = """
        INSERT INTO equipe (nome_popular, nome_oficial, estado, cidade, data_funcacao, sigla, nome_estadio)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        RETURNING id;
        """
        
        data = (
            nome_popular,
            fake.company() + " FootBall Club",
            fake.state_abbr(),
            cidade_equipe,
            fake.date_between(start_date='-100y', end_date='-10y'),
            nome_popular[:3].upper(), 
            f"Estádio de {nome_popular}"
        )
        
        equipe_id = execute_query(conn, query, data, fetch=True)
        
        if equipe_id:
            EQUIPE_IDS.append(equipe_id)
            rel_campeonato_data.append((CAMPEONATO_ID, equipe_id, 'Fase de Grupos'))

    # Inserção em massa na tabela de relacionamento (para eficiência)
    if rel_campeonato_data:
        # Usando mogrify para preparar a string de valores em massa de forma segura
        values_list = ', '.join(conn.cursor().mogrify("(%s, %s, %s)", x).decode('utf-8') for x in rel_campeonato_data)
        query_rel = "INSERT INTO campeonato_equipe (id_campeonato, id_equipe, colocacao_ou_fase) VALUES " + values_list
        execute_query(conn, query_rel)

    print(f"✅ {len(EQUIPE_IDS)} Equipes inseridas e relacionadas ao campeonato.")

def inserir_jogadores(conn):
    """Insere milhares de jogadores e os relaciona às equipes."""
    global JOGADOR_IDS
    
    rel_jogador_equipe_data = []
    
    for equipe_id in EQUIPE_IDS:
        for _ in range(JOGADORES_POR_EQUIPE):
            posicoes = ['GOL', 'DEF', 'MEI', 'ATA', 'DEF', 'MEI'] # Prioriza DEF e MEI
            
            # Inserção individual para capturar o ID
            query = """
            INSERT INTO jogador (posicao, pe_dominante, altura, preco, nome_completo, data_nascimento, nacionalidade, nome_popular)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id;
            """
            
            jogador_data = (
                random.choice(posicoes),
                random.choice(['Direito', 'Esquerdo']),
                random.uniform(1.65, 2.00),
                random.uniform(100000.00, 5000000.00),
                fake.name(),
                fake.date_of_birth(minimum_age=16, maximum_age=35),
                fake.country(),
                fake.first_name()
            )

            jogador_id = execute_query(conn, query, jogador_data, fetch=True)
            
            if jogador_id:
                JOGADOR_IDS.append(jogador_id)
                # Adiciona o relacionamento
                rel_jogador_equipe_data.append((
                    equipe_id,
                    jogador_id,
                    fake.date_between(start_date='-3y', end_date='today'),
                    fake.date_between(start_date='today', end_date='+5y')
                ))

    # Inserção em massa na tabela de relacionamento (para eficiência)
    if rel_jogador_equipe_data:
        values_list = ', '.join(conn.cursor().mogrify("(%s, %s, %s, %s)", x).decode('utf-8') for x in rel_jogador_equipe_data)
        query_rel = "INSERT INTO jogador_equipe (id_equipe, id_jogador, data_inicio_contrato, data_vencimento_co) VALUES " + values_list
        execute_query(conn, query_rel)
    
    print(f"✅ {len(JOGADOR_IDS)} Jogadores inseridos e distribuídos nas equipes.")


def inserir_partidas(conn):
    """Insere partidas e seus placares, focando em inserir em massa o relacionamento placar."""
    global PARTIDA_IDS
    
    placar_data = []
    
    for i in range(NUM_PARTIDAS):
        # Sorteia duas equipes diferentes para o jogo
        eq1_id, eq2_id = random.sample(EQUIPE_IDS, 2)
        
        data_partida = fake.date_between(start_date='-30d', end_date='today')
        
        # Inserção individual de partida para capturar o ID
        query = """
        INSERT INTO partida (id_estadio, id_campeonato, data, horario, condicao_climatica, status)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id;
        """
        partida_id = execute_query(conn, query, (
            ESTADIO_ID, CAMPEONATO_ID, data_partida, time(hour=random.randint(15, 22)),
            random.choice(['Sol', 'Chuva', 'Nublado']), 'Finalizada'
        ), fetch=True)
        
        if partida_id:
            PARTIDA_IDS.append(partida_id)
            
            # Adiciona os placares para inserção em massa
            placar1 = random.randint(0, 4)
            placar2 = random.randint(0, 4)
            placar_data.append((partida_id, eq1_id, placar1))
            placar_data.append((partida_id, eq2_id, placar2))

    # Inserção em massa na tabela de placares
    if placar_data:
        values_list = ', '.join(conn.cursor().mogrify("(%s, %s, %s)", x).decode('utf-8') for x in placar_data)
        query_placar = "INSERT INTO partida_equipe_possui (id_partida, id_equipe, placar) VALUES " + values_list
        execute_query(conn, query_placar)

    print(f"✅ {len(PARTIDA_IDS)} Partidas inseridas com placares aleatórios.")

def inserir_eventos_basicos(conn):
    """Insere eventos (finalizações e cartões) em massa."""
    
    finalizacao_data = []
    cartao_data = []
    
    if not JOGADOR_IDS: return

    for partida_id in PARTIDA_IDS:
        for i in range(1, EVENTOS_POR_PARTIDA + 1):
            jogador_id = random.choice(JOGADOR_IDS)
            
            # --- 1. Finalização ---
            is_goal = random.choice([True, False, False, False, False])
            cronometragem_time = (datetime.min + timedelta(minutes=random.randint(1, 95))).time()

            finalizacao_data.append((
                partida_id, jogador_id, is_goal, random.choice(['Pé', 'Cabeça']),
                timedelta(seconds=random.randint(1, 10)),
                random.uniform(0.1, 0.9), random.uniform(0.1, 0.9), random.uniform(0.0, 0.5), # Origem
                random.uniform(0.4, 0.6), random.uniform(0.4, 0.6), random.uniform(0.0, 1.0), # Destino
                random.choice(['Primeiro Tempo', 'Segundo Tempo']),
                cronometragem_time, i
            ))

            # --- 2. Cartão ---
            if random.random() < 0.2:
                cronometragem_ts = datetime(2025, 1, 1, 0, 0, 0) + timedelta(minutes=random.randint(1, 95))
                cartao_data.append((
                    partida_id, random.choice(JOGADOR_IDS), random.choice(['Amarelo', 'Vermelho']),
                    random.choice(['Primeiro Tempo', 'Segundo Tempo']), cronometragem_ts, i
                ))

    # Inserção em massa de Finalizações
    if finalizacao_data:
        # A forma mais robusta de inserção em massa no Python para evitar erros de string muito longa é usar execute_many, 
        # mas o mogrify é usado aqui para compatibilidade com o PostgreSQL.
        values_list = ', '.join(conn.cursor().mogrify("(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", x).decode('utf-8') for x in finalizacao_data)
        query_finalizacao = "INSERT INTO finalizacao (id_partida, id_jogador, sucesso, parte_do_corpo, duracao, posicao_x_origem, posicao_y_origem, posicao_z_origem, posicao_x_destino, posicao_y_destino, posicao_z_destino, fase_da_partida, cronometragem, id_evento_anterior) VALUES " + values_list
        execute_query(conn, query_finalizacao)

    # Inserção em massa de Cartões
    if cartao_data:
        values_list = ', '.join(conn.cursor().mogrify("(%s, %s, %s, %s, %s, %s)", x).decode('utf-8') for x in cartao_data)
        query_cartao = "INSERT INTO cartao (id_partida, id_pessoa, tipo, fase_da_partida, cronometro, id_evento_anterior) VALUES " + values_list
        execute_query(conn, query_cartao)
                
    print(f"✅ Eventos inseridos: {len(finalizacao_data)} Finalizações e {len(cartao_data)} Cartões.")


# --- FUNÇÃO PRINCIPAL ---

def main():
    """Função principal para executar a população em massa."""
    print("Iniciando a população do banco de dados em MASSA...")
    print(f"Alvo: {NUM_EQUIPES} equipes, {JOGADORES_POR_EQUIPE * NUM_EQUIPES} jogadores, {NUM_PARTIDAS} partidas.")
    
    try:
        conn = get_db_connection()
    except Exception as e:
        print(f"❌ ERRO DE CONEXÃO: Verifique as credenciais. Detalhe: {e}")
        return

    print("-" * 30)
    
    # 2. Inserção de Dados
    if not inserir_campeonato(conn):
        conn.close()
        return

    if not inserir_estadio(conn):
        conn.close()
        return
        
    inserir_equipes(conn)
    inserir_jogadores(conn)
    inserir_partidas(conn)
    inserir_eventos_basicos(conn)

    conn.close()
    print("-" * 30)
    print("\n🎉 População de dados em MASSA concluída com sucesso!")
    print(f"Total de jogadores inseridos: {len(JOGADOR_IDS)}")
    print(f"Total de partidas inseridas: {len(PARTIDA_IDS)}")

if __name__ == "__main__":
    main()