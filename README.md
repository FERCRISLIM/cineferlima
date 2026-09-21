🎬 Cine Fácil V2 — Plataforma Front-end de Ingressos
Versão profissional de front-end para publicar no GitHub Pages.
O que foi incluído
Cliente
Catálogo de filmes
Busca por título
Filtro por gênero
Horários de sessão
Mapa de 48 assentos
Assentos ocupados
Limite de 8 assentos por compra
Cálculo de valor
Formulário do cliente
Geração de ingresso digital
Código de reserva
Histórico de ingressos
Impressão do ingresso
Persistência em localStorage
Administração
Painel administrativo demonstrativo
Total de reservas
Valor total das reservas
Quantidade de filmes
Listagem de vendas
Cadastro de filmes
Exclusão de filmes
Cadastro de horários e preço
Publicação no GitHub Pages
Crie um repositório público, por exemplo `cine-facil`.
Envie `index.html`, `style.css` e `script.js` para a raiz.
Abra `Settings > Pages`.
Em `Build and deployment`, selecione `Deploy from a branch`.
Selecione `main` e `/ (root)`.
Salve.
Aguarde o GitHub gerar a URL.
Limitação atual
A V2 continua sendo um front-end. O painel administrativo e as reservas usam `localStorage`, portanto os dados não são compartilhados entre clientes diferentes.
Para uma plataforma comercial real, a próxima arquitetura pode ser:
Frontend (GitHub Pages)
↓
API / Backend
↓
Banco de dados
↓
Pagamento / e-mail / QR Code
Sugestão:
Front-end: HTML/CSS/JavaScript ou React
API: Node.js + Express
Banco: PostgreSQL
Autenticação: JWT/session
Pagamento: gateway compatível com o projeto
QR Code: geração e validação no backend
Deploy backend: serviço de hospedagem com banco
Nunca coloque chaves secretas de pagamento ou credenciais no JavaScript publicado no GitHub Pages.
