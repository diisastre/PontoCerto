# Prato Certo

Sistema web que filtra um cardápio de acordo com as restrições alimentares do usuário.

## Estrutura

```
prato-certo/
├── banco.sql          # tabelas e dados de exemplo (MySQL)
├── server.js          # servidor Node.js que consulta o MySQL
├── package.json
└── public/
    ├── index.html     # estrutura da página
    ├── style.css      # aparência
    └── script.js      # interação e comunicação com o servidor
```

## Como rodar

1. Instale o Node.js e o MySQL.
2. Crie o banco: `mysql -u root -p < banco.sql`
3. Em `server.js`, confira o usuário e a senha do MySQL.
4. Instale as dependências e inicie: `npm install` e depois `npm start`
5. Abra http://localhost:3000