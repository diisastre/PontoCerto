
const Database = require('better-sqlite3');
const banco = new Database('prato_certo.db');

banco.exec(`
  DROP TABLE IF EXISTS prato_restricao;
  DROP TABLE IF EXISTS pratos;
  DROP TABLE IF EXISTS restricoes;

  CREATE TABLE restricoes (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL
  );

  CREATE TABLE pratos (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    nome      TEXT NOT NULL,
    descricao TEXT,
    categoria TEXT,
    preco     REAL,
    imagem TEXT
  );

  CREATE TABLE prato_restricao (
    prato_id     INTEGER NOT NULL,
    restricao_id INTEGER NOT NULL,
    PRIMARY KEY (prato_id, restricao_id),
    FOREIGN KEY (prato_id) REFERENCES pratos(id),
    FOREIGN KEY (restricao_id) REFERENCES restricoes(id)
  );
`);


const inserirRestricao = banco.prepare('INSERT INTO restricoes (nome) VALUES (?)');
['Vegetariano', 'Vegano', 'Sem glúten', 'Sem lactose'].forEach((nome) => inserirRestricao.run(nome));

const inserirPrato = banco.prepare(
  'INSERT INTO pratos (nome, descricao, categoria, preco) VALUES (?, ?, ?, ?)'
);
const imagens = {
  'Salada Caprese': '/img/Insalata Caprese – Tomaten Mozzarella Salat » Taste of Travel.jpg',
  'Bruschetta de Tomate': '/img/Italian Bruschetta.jpg', 'Guacamole': '/img/Guacamole.jpg',
  'Salada de Grão-de-bico': '/img/Salada de Grão-de-Bico Refrescante 🥗🌿_ 30 Minutos de Preparo _ Receita Fácil - Receitas do Blog do Lago.jpg',
  'Batata Rústica': '/img/🥔 Batata Rústica Crocante para o Jogo….jpg', 'Sopa de Legumes': '/img/Minestrone di verdure.jpg',
  'Risoto de Cogumelos': '/img/Mushroom Risotto 🍄🧂_Serves_ 4 _ Prep Time_ 10….jpg',
  'Curry de Grão-de-bico': '/img/Creamy Coconut Chickpea Curry with Aromatic….jpg',
  'Lasanha de Vegetais': '/img/Lasa#U00f1a de Verduras Asadas - Receta Vegetariana Deliciosa.jpg',
  'Quinoa com Legumes': '/img/Veggie Loaded Quinoa Fried Rice Flavorful and Easy___.jpg',
  'Peixe Assado': '/img/Easy Spicy Lemon Garlic Baked Tilapia.jpg', 'Arroz com Lentilhas': '/img/Arroz Integral com Lentilhas Nutritivo e Saboroso#U2026.jpg',
  'Tofu com Legumes': '/img/Healthy Veggie Stir Fry with Tofu and Brown Rice.jpg'
};
const atualizarImagem = banco.prepare('UPDATE pratos SET imagem = ? WHERE nome = ?');
const ligar = banco.prepare('INSERT INTO prato_restricao (prato_id, restricao_id) VALUES (?, ?)');


const pratos = [
  ['Salada Caprese', 'Tomate, muçarela e manjericão', 'Entradas', 22.9, [1, 3]],
  ['Bruschetta de Tomate', 'Pão, tomate, azeite e manjericão', 'Entradas', 18.0, [1]],
  ['Guacamole', 'Abacate, tomate, cebola, limão e temperos', 'Entradas', 20.0, [1, 2, 3, 4]],
  ['Salada de Grão-de-bico', 'Grão-de-bico, pepino, tomate e azeite', 'Entradas', 19.5, [1, 2, 3, 4]],
  ['Batata Rústica', 'Batatas assadas com ervas e azeite', 'Entradas', 16.0, [1, 2, 3, 4]],
  ['Sopa de Legumes', 'Legumes variados com temperos naturais', 'Entradas', 17.0, [1, 2, 3, 4]],

  ['Risoto de Cogumelos', 'Arroz arbóreo com cogumelos frescos', 'Pratos principais', 38.5, [1, 3]],
  ['Curry de Grão-de-bico', 'Grão-de-bico, leite de coco e especiarias', 'Pratos principais', 34.0, [1, 2, 3, 4]],
  ['Lasanha de Vegetais', 'Lasanha com abobrinha, cenoura e molho de tomate', 'Pratos principais', 35.0, [1]],
  ['Quinoa com Legumes', 'Quinoa, cenoura, abobrinha e brócolis', 'Pratos principais', 32.0, [1, 2, 3, 4]],
  ['Frango Grelhado', 'Filé de frango grelhado com ervas', 'Pratos principais', 39.0, [3, 4]],
  ['Peixe Assado', 'Filé de peixe assado com limão e ervas', 'Pratos principais', 42.0, [3, 4]],
  ['Macarrão ao Molho Pesto', 'Macarrão com molho pesto de manjericão', 'Pratos principais', 31.0, [1]],
  ['Arroz com Lentilhas', 'Arroz, lentilhas, cebola e temperos', 'Pratos principais', 28.0, [1, 2, 3, 4]],
  ['Omelete de Espinafre', 'Ovos, espinafre e temperos', 'Pratos principais', 27.0, [1, 3, 4]],


  ['Pudim de Leite', 'Clássico pudim com calda de caramelo', 'Sobremesas', 14.0, [1, 3]],
  ['Salada de Frutas', 'Frutas frescas da estação', 'Sobremesas', 12.0, [1, 2, 3, 4]],
  ['Brownie de Chocolate', 'Brownie tradicional de chocolate', 'Sobremesas', 16.0, [1]],
  ['Sorbet de Morango', 'Sobremesa gelada feita com morangos', 'Sobremesas', 15.0, [1, 2, 3, 4]],
  ['Mousse de Maracujá', 'Mousse cremosa de maracujá', 'Sobremesas', 13.0, [1]],
  ['Banana Assada', 'Banana assada com canela', 'Sobremesas', 10.0, [1, 2, 3, 4]],
  ['Cookies de Aveia', 'Cookies com aveia e gotas de chocolate', 'Sobremesas', 12.0, [1]],

  ['Suco de Laranja', 'Suco natural de laranja', 'Bebidas', 10.0, [1, 2, 3, 4]],
  ['Limonada', 'Limão, água e açúcar', 'Bebidas', 8.0, [1, 2, 3, 4]],
  ['Água Mineral', 'Água mineral natural', 'Bebidas', 5.0, [1, 2, 3, 4]],
  ['Chá Gelado', 'Chá natural servido gelado', 'Bebidas', 9.0, [1, 2, 3, 4]],
  ['Vitamina de Banana', 'Banana batida com leite', 'Bebidas', 12.0, [1]],
  ['Suco de Abacaxi com Hortelã', 'Abacaxi, hortelã e água', 'Bebidas', 11.0, [1, 2, 3, 4]],
  ['Café', 'Café tradicional', 'Bebidas', 6.0, [1, 2, 3, 4]]
];


pratos.forEach(([nome, descricao, categoria, preco, restricoes]) => {
  const { lastInsertRowid } = inserirPrato.run(nome, descricao, categoria, preco);
  restricoes.forEach((r) => ligar.run(lastInsertRowid, r));
  atualizarImagem.run(imagens[nome] || null, nome);
});

console.log('Banco criado com sucesso!');
banco.close();