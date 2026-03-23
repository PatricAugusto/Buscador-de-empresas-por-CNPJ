# cnpj-buscador

API REST para consulta e gerenciamento de dados públicos de empresas brasileiras via CNPJ. Consome a [BrasilAPI](https://brasilapi.com.br), persiste os dados localmente e expõe endpoints de busca com paginação e suporte a favoritos.

---

## Tecnologias

- **Node.js** (18+) + **Express**
- **SQLite** via `better-sqlite3`
- **BrasilAPI** `/cnpj/v1` como fonte de dados
- `dotenv` para variáveis de ambiente
- `nodemon` para desenvolvimento

---

## Estrutura do projeto

```
cnpj-buscador/
├── src/
│   ├── routes/           # Definição das URLs
│   ├── controllers/      # Leitura de req/res e delegação
│   ├── services/         # Regras de negócio
│   ├── repositories/     # Queries SQL (única camada que toca o banco)
│   ├── db/
│   │   ├── connection.js # Conexão SQLite
│   │   └── migrate.js    # Criação das tabelas
│   └── app.js            # Inicialização do Express
├── .env
├── .gitignore
└── package.json
```

---

## Instalação

```bash
git clone https://github.com/seu-usuario/cnpj-buscador.git
cd cnpj-buscador
npm install
```

Crie o arquivo `.env` na raiz:

```env
PORT=3000
```

---

## Uso

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção
npm start
```

O banco de dados é criado automaticamente na primeira execução em `database.sqlite`.

---

## Endpoints

### Health check

```
GET /health
```

```json
{ "status": "ok" }
```

---

### Consultar empresa por CNPJ

```
GET /companies/cnpj/:cnpj
```

Busca os dados na BrasilAPI e persiste no banco. Nas consultas seguintes retorna direto do banco local (cache).

**Exemplo:**

```bash
curl http://localhost:3000/companies/cnpj/33000167000101
```

```json
{
  "company": {
    "id": 1,
    "cnpj": "33000167000101",
    "razao_social": "PETROLEO BRASILEIRO S A PETROBRAS",
    "nome_fantasia": "PETROBRAS",
    "situacao": "ATIVA",
    "municipio": "RIO DE JANEIRO",
    "uf": "RJ"
  },
  "source": "api"
}
```

O campo `source` indica a origem do dado: `"api"` na primeira consulta, `"cache"` nas seguintes.

---

### Buscar empresas

```
GET /companies/search?by=&value=&page=&pageSize=
```

| Parâmetro  | Obrigatório | Descrição                                              |
|------------|-------------|--------------------------------------------------------|
| `by`       | sim         | Campo de busca: `razao_social`, `municipio`, `situacao` |
| `value`    | sim         | Termo buscado (mínimo 2 caracteres)                    |
| `page`     | não         | Número da página (padrão: `1`)                         |
| `pageSize` | não         | Itens por página (padrão: `10`, máximo: `50`)          |

**Exemplo:**

```bash
curl "http://localhost:3000/companies/search?by=situacao&value=ativa&page=1&pageSize=2"
```

```json
{
  "data": [
    { "id": 1, "cnpj": "33000167000101", "razao_social": "PETROLEO BRASILEIRO S A PETROBRAS", "situacao": "ATIVA" },
    { "id": 2, "cnpj": "00000000000191", "razao_social": "BANCO DO BRASIL SA", "situacao": "ATIVA" }
  ],
  "pagination": {
    "total": 3,
    "page": 1,
    "pageSize": 2,
    "totalPages": 2
  }
}
```

---

### Listar favoritos

```
GET /favorites?page=&pageSize=
```

Retorna as empresas favoritadas com paginação, ordenadas pela data de favorito mais recente.

```bash
curl "http://localhost:3000/favorites?page=1&pageSize=10"
```

---

### Adicionar favorito

```
POST /favorites/:cnpj
```

A empresa precisa ter sido consultada via `GET /companies/cnpj/:cnpj` antes de ser favoritada.

```bash
curl -X POST http://localhost:3000/favorites/33000167000101
```

Retorna `201 Created` com os dados do favorito.

---

### Remover favorito

```
DELETE /favorites/:cnpj
```

```bash
curl -X DELETE http://localhost:3000/favorites/33000167000101
```

Retorna `204 No Content`.

---

## Status codes

| Código | Situação                                      |
|--------|-----------------------------------------------|
| `200`  | Sucesso                                       |
| `201`  | Favorito criado                               |
| `204`  | Favorito removido                             |
| `400`  | CNPJ inválido ou parâmetros incorretos        |
| `404`  | CNPJ não encontrado                           |
| `409`  | Empresa já está nos favoritos                 |
| `502`  | Erro na comunicação com a BrasilAPI           |

---

## Decisões de design

**Cache local** — antes de chamar a BrasilAPI, o sistema verifica se o CNPJ já existe no banco. Evita requisições desnecessárias e funciona mesmo sem conexão para CNPJs já consultados.

**Whitelist de campos de busca** — o campo `by` é validado contra uma lista de valores permitidos antes de ser usado na query. Isso previne SQL injection por interpolação de nomes de coluna.

**Favoritos dependem de consulta prévia** — só é possível favoritar empresas que já foram consultadas via CNPJ. Mantém o serviço de favoritos simples e sem dependência da API externa.

**Arquitetura em camadas** — routes, controllers, services e repositories têm responsabilidades bem definidas. Queries SQL existem apenas nos repositories; regras de negócio existem apenas nos services.

---