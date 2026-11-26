
const express = require('express');
const Database = require('better-sqlite3');

const app = express();

const banco = new Database('prato_certo.db');

app.use(express.json());
app.use(express.static('public'));
app.use('/img', express.static('img'));

// Listar restrições
app.get('/api/restricoes', (req, res) => {
  const restricoes = banco.prepare(
    'SELECT * FROM restricoes'
  ).all();

  res.json(restricoes);
});

// Listar pratos
app.get('/api/pratos', (req, res) => {
  const restricoes = req.query.restricoes
    ? req.query.restricoes.split(',').map(Number).filter(Number.isInteger)
    : [];

  const categoria = req.query.categoria || '';
  const busca = req.query.busca || '';

  let sql = `
    SELECT p.*,
      COALESCE(GROUP_CONCAT(r.nome, ','), '') AS restricoes
    FROM pratos p
    LEFT JOIN prato_restricao pr ON p.id = pr.prato_id
    LEFT JOIN restricoes r ON pr.restricao_id = r.id
    WHERE (p.nome LIKE ? OR p.descricao LIKE ?)
  `;

  const parametros = [`%${busca}%`, `%${busca}%`];

  if (categoria) {
    sql += ' AND p.categoria = ?';
    parametros.push(categoria);
  }

  sql += ' GROUP BY p.id';

  let resultado = banco.prepare(sql).all(...parametros);

  // Filtrar pratos pelas restrições escolhidas
  if (restricoes.length > 0) {
    resultado = resultado.filter(prato => {
      const ids = banco.prepare(`
        SELECT restricao_id
        FROM prato_restricao
        WHERE prato_id = ?
      `).all(prato.id).map(r => r.restricao_id);

      return restricoes.every(id => ids.includes(id));
    });
  }

  res.json(resultado);
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
