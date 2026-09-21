# 🎬 Cine Fácil — Sistema de Ingressos de Cinema

Projeto front-end responsivo para GitHub Pages.

## Recursos
- Catálogo de filmes
- Filtro por gênero
- Escolha de sessão
- Mapa de 48 assentos
- Assentos ocupados e selecionados
- Cálculo automático do valor
- Confirmação de ingresso
- Código de ingresso
- Histórico de ingressos com `localStorage`
- Layout responsivo para celular e desktop
- Sem dependências externas

## Publicar no GitHub Pages
1. Crie um repositório no GitHub.
2. Envie `index.html`, `style.css` e `script.js`.
3. Vá em **Settings → Pages**.
4. Em **Build and deployment**, selecione `Deploy from a branch`.
5. Escolha `main` e `/root`.
6. Salve e aguarde a publicação.

## Importante
Esta é uma versão demonstrativa 100% front-end. Ela não processa pagamentos reais e não possui banco de dados.

### Evolução para uma plataforma real
Backend recomendado:
- Node.js + Express
- PostgreSQL ou MySQL
- Login de cliente
- Painel administrativo
- Cadastro de filmes, salas e sessões
- Controle de assentos em tempo real
- Integração com gateway de pagamento
- E-mail/WhatsApp de confirmação
- QR Code para validação na entrada
- API REST
