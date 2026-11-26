// Elementos da página
const listaRestricoes = document.getElementById('restricoes');
const grade = document.getElementById('pratos');
const mensagem = document.getElementById('mensagem');
const contador = document.getElementById('contador');
const contadorTexto = document.getElementById('contador-texto');
const campoBusca = document.getElementById('busca');
const botoesCategoria = document.querySelectorAll('#categorias button');
const detalhes = document.getElementById('detalhes');
const detalhesConteudo = document.getElementById('detalhes-conteudo');

// O que o usuário escolheu até agora
let restricoesEscolhidas = [];
let categoriaEscolhida = '';
let pratos = [];

// ---------- Busca de dados no servidor ----------

async function carregarRestricoes() {
  const resposta = await fetch('/api/restricoes');
  const restricoes = await resposta.json();

  listaRestricoes.innerHTML = restricoes
    .map(
      (r) => `
        <label class="chip">
          <input type="checkbox" value="${r.id}">
          <span>${r.nome}</span>
        </label>`
    )
    .join('');
}

async function carregarPratos() {
  const parametros = new URLSearchParams({
    restricoes: restricoesEscolhidas.join(','),
    categoria: categoriaEscolhida,
    busca: campoBusca.value.trim(),
  });

  try {
    const resposta = await fetch('/api/pratos?' + parametros);
    pratos = await resposta.json();
    mostrarPratos();
  } catch (erro) {
    grade.innerHTML = '';
    mensagem.textContent = 'Não foi possível carregar o cardápio. Verifique se o servidor está ligado.';
  }
}

// ---------- Exibição na tela ----------

function formatarPreco(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function criarTags(restricoes) {
  const nomes = restricoes ? restricoes.split(',') : [];
  const visiveis = nomes.slice(0, 3).map((nome) => `<span class="tag">${nome}</span>`);

  if (nomes.length > 3) {
    visiveis.push(`<span class="tag">+${nomes.length - 3}</span>`);
  }
  return visiveis.join('');
}

function mostrarPratos() {
  contador.textContent = pratos.length;
  contadorTexto.textContent = pratos.length === 1 ? 'prato para você' : 'pratos para você';

  if (pratos.length === 0) {
    mensagem.textContent = 'Nenhum prato atende a todas as escolhas. Tente remover uma restrição ou limpar a busca.';
  } else {
    mensagem.textContent = '';
  }

  grade.innerHTML = pratos
    .map(
      (p) => `
        <article class="prato">
          <div class="prato-imagem" aria-hidden="true">${p.icone}</div>
          <h3>${p.nome}</h3>
          <p>${p.descricao}</p>
          <div class="tags">${criarTags(p.restricoes)}</div>
          <div class="prato-rodape">
            <span class="preco">${formatarPreco(p.preco)}</span>
            <button class="botao" type="button" data-id="${p.id}">Ver detalhes</button>
          </div>
        </article>`
    )
    .join('');
}

function abrirDetalhes(id) {
  const prato = pratos.find((p) => p.id === id);
  const restricoes = prato.restricoes ? prato.restricoes.split(',').join(', ') : 'Nenhuma';

  detalhesConteudo.innerHTML = `
    <div class="prato-imagem" aria-hidden="true">${prato.icone}</div>
    <h3>${prato.nome}</h3>
    <p>${prato.descricao}</p>
    <h4>Ingredientes</h4>
    <p>${prato.ingredientes}</p>
    <h4>Alérgenos</h4>
    <p>${prato.alergenos}</p>
    <h4>Atende às restrições</h4>
    <p>${restricoes}</p>
    <h4>Preço</h4>
    <p>${formatarPreco(prato.preco)}</p>`;

  detalhes.showModal();
}

// ---------- Ações do usuário ----------

// Marcar ou desmarcar uma restrição
listaRestricoes.addEventListener('change', () => {
  const marcadas = listaRestricoes.querySelectorAll('input:checked');
  restricoesEscolhidas = [...marcadas].map((caixa) => caixa.value);
  carregarPratos();
});

// Escolher uma categoria
botoesCategoria.forEach((botao) => {
  botao.addEventListener('click', () => {
    categoriaEscolhida = botao.dataset.categoria;
    botoesCategoria.forEach((b) => b.setAttribute('aria-pressed', b === botao));
    carregarPratos();
  });
});

// Digitar na busca
campoBusca.addEventListener('input', carregarPratos);

// Abrir os detalhes de um prato
grade.addEventListener('click', (evento) => {
  const botao = evento.target.closest('button[data-id]');
  if (botao) {
    abrirDetalhes(Number(botao.dataset.id));
  }
});

// Fechar os detalhes ao clicar fora da janela
detalhes.addEventListener('click', (evento) => {
  if (evento.target === detalhes) {
    detalhes.close();
  }
});


carregarRestricoes();
carregarPratos();