# Votação em Tempo Real 🗳️

Projeto fullstack para criar, gerenciar e votar em enquetes **em tempo real**!
Feito com **FastAPI (backend)** e **React (frontend)**.

---

## 📸 Demonstrações (GIFs e prints) Futuro


> - Página de enquetes ativas e votação
> - Tela de criação de enquete (admin)
> - Resultado ao vivo (gráfico)
> - Votação funcionando no PC e celular

---

## 🚀 Funcionalidades

- [x] Cadastro e login de admin
- [x] Criação de enquetes com múltiplas opções e data de expiração
- [x] Votação por qualquer pessoa da rede, com nome obrigatório para auditoria
- [x] Cada IP só pode votar 1x por enquete
- [x] Resultados ao vivo com gráfico de pizza (em breve!)
- [x] Backend e frontend separados, fácil de rodar e expandir

---

## 🛠️ Como rodar localmente

### 1. Clone o repositório

git clone https://github.com/pedrinhenrik/votacao-app.git
cd votacao-app

### 2. Backend (FastAPI)

- Crie e ative seu ambiente virtual:
  python -m venv .venv
  .venv\Scripts\activate  # (Windows)
  source .venv/bin/activate  # (Linux/Mac)
- Instale as dependências:
  pip install -r requirements.txt
- Inicie o backend:
  uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

### 3. Frontend (React)

- Entre na pasta do frontend:
  cd frontend
- Instale as dependências:
  npm install
- Inicie o frontend para acesso na rede:
  npx vite --host 0.0.0.0
- Acesse pelo navegador:
  http://<SEU_IP_LOCAL>:5173/

---

## 💡 Exemplo de uso

> *Aqui você pode colocar GIFs/prints mostrando:*
> 1. Como criar enquete (admin)
> 2. Como votar
> 3. Como visualizar resultados

---

## 📦 Estrutura do Projeto

```text
votacao-app/
├── backend/
│   ├── main.py
│   ├── database/
│   ├── models/
│   └── routers/
├── frontend/
│   ├── src/
│   └── public/
├── package.json
├── requirements.txt
├── README.md
└── .gitignore
```

---

## 🔒 Observações de segurança

- A autenticação de admin é obrigatória para criar enquetes.
- Cada IP pode votar apenas 1x em cada enquete.
- O nome do votante é salvo para auditoria.

---

## 🧑‍💻 Autor

- Pedro Henrique ([pedrinhenrik](https://github.com/pedrinhenrik))

---

## ⭐ Contribua!

Achou legal? Tem sugestões? Sinta-se livre para abrir issues ou PRs!
