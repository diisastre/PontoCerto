// Servidor do Prato Certo: entrega o site e responde às consultas ao MySQL.
const express = require('express');
const mysql = require('mysql2/promise');

const app = express();

// Conexão com o banco. Troque o usuário e a senha pelos do seu MySQL.
const banco = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'BelaKawaii14',
  database: 'prato_certo',
});

// Entrega os arquivos da pasta "public" (HTML, CSS e JavaScript)
app.use(express.static('public'));

// Lista todas as restrições alimentares
app.get('/api/restricoes', async (req, res) => {
  try {
    const [restricoes] = await banco.query('SELECT id, nome FROM restricoes ORDER BY id');
    res.json(restricoes);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Não foi possível buscar as restrições.' });
  }
});

// Lista os pratos. Filtros opcionais: restricoes (ex.: "1,2"), categoria e busca
app.get('/api/pratos', async (req, res) => {
  const { categoria, busca } = req.query;
  const restricoes = (req.query.restricoes || '')
    .split(',')
    .map(Number)
    .filter(Number.isInteger);

  const filtros = [];
  const valores = [];

  if (categoria) {
    filtros.push('p.categoria = ?');
    valores.push(categoria);
  }

  if (busca) {
    filtros.push('p.nome LIKE ?');
    valores.push(`%${busca}%`);
  }

  // Só entram os pratos que atendem TODAS as restrições escolhidas
  if (restricoes.length > 0) {
    filtros.push(`p.id IN (
      SELECT prato_id FROM prato_restricao
      WHERE restricao_id IN (?)
      GROUP BY prato_id
      HAVING COUNT(DISTINCT restricao_id) = ?
    )`);
    valores.push(restricoes, restricoes.length);
  }

  const where = filtros.length > 0 ? 'WHERE ' + filtros.join(' AND ') : '';

  try {
    const [pratos] = await banco.query(
      `SELECT p.*, GROUP_CONCAT(r.nome ORDER BY r.id SEPARATOR ',') AS restricoes
       FROM pratos p
       LEFT JOIN prato_restricao pr ON pr.prato_id = p.id
       LEFT JOIN restricoes r ON r.id = pr.restricao_id
       ${where}
       GROUP BY p.id
       ORDER BY p.nome`,
      valores
    );
    res.json(pratos);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Não foi possível buscar os pratos.' });
  }
});

app.listen(3000, () => {
  console.log('Prato Certo rodando em http://localhost:3000');
});