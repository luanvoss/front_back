const API_URL = "http://localhost:3300";

const tituloFormulario = document.getElementById("tituloFormulario");
const formProduto = document.getElementById("formProduto");
const nome = document.getElementById("nome");
const descricao = document.getElementById("descricao");
const preco = document.getElementById("preco");
const botaoCancelar = document.getElementById("botaoCancelar");
const botaoSalvar = document.getElementById("botaoSalvar");
const mensagem = document.getElementById("mensagem");
const idBusca = document.getElementById("idBusca");
const botaoBuscar = document.getElementById("botaoBuscar");
const botaoListar = document.getElementById("botaoListar");
const resultadoBusca = document.getElementById("resultadoBusca");
const botaoAtualizarLista = document.getElementById("botaoAtualizarLista");
const listaProdutos = document.getElementById("listaProdutos");
botaoBuscar.addEventListener('click', buscarPorId);
botaoSalvar.addEventListener('click', () => {
    console.log("Botão salvar clicado!");
    cadastrarProduto();
});


function mostrarMensagem(texto, ehErro = false) {
    mensagem.textContent = texto;
    mensagem.className = ehErro ? 'erro' : 'sucesso';
}

async function listarProdutos() {
    try {
        const resposta = await fetch(`${API_URL}/produtos`);

        if (!resposta.ok) {
            throw new Error('Erro ao buscar produtos.');
        }

        const produtos = await resposta.json();
        listaProdutos.innerHTML = '';

        if (produtos.length === 0) {
            listaProdutos.innerHTML = `
                <tr>
                    <td colspan = "5">Nenhum produto cadastrado.</td> 
                </tr>
            `;
            return;
        };

        produtos.forEach((produto) => {
            listaProdutos.innerHTML += `
                <tr>
                    <td>${produto.id}</td>
                    <td>${produto.nome}</td>
                    <td>${produto.descricao}</td>
                    <td>R$ ${Number(produto.preco).toFixed(2)}</td>
                    <td>
                    <button onclick ="prepararEdicao(${produto.id})">
                        Editar
                      </button>

                      <button onclick="excluirProduto(${produto.id})">
                          Excluir
                      </button>
                    </td>
                </tr>
            `;
        });
    } catch (erro) {
        mostrarMensagem(erro.message, true);
    }
}

listarProdutos();

async function buscarPorId() {
    try {
        const id = idBusca.value;

        if (!id) {
            resultadoBusca.textContent = "Digite o ID do produto.";
            return;
        }

        const resposta = await fetch(`${API_URL}/produtos/${id}`);

        if (!resposta.ok) {
            throw new Error('Produto não encontrado.');
        }

        const dados = await resposta.json();

        if (dados.length === 0) {
            throw new Error('Produto não encontrado.');
        }

        const produto = dados[0];

        resultadoBusca.innerHTML = `
            <h3>Produto encontrado</h3>
            <p>ID: ${produto.id}</p>
            <p>Nome: ${produto.nome}</p>
            <p>Descrição: ${produto.descricao}</p>
            <p>Preço: R$ ${Number(produto.preco).toFixed(2)}</p>
        `;
    } catch (erro) {
        resultadoBusca.textContent = erro.message;
    }
}


async function cadastrarProduto() {
    const dadosProduto = {
        nome: nome.value,
        descricao: descricao.value,
        preco: Number(preco.value)
    };
    try {
        const resposta = await fetch(`${API_URL}/produtos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosProduto)
        });

        if (!resposta.ok) {
            throw new Error('Erro ao cadastrar produto');
        }

        const resultado = await resposta.json();
        mostrarMensagem('Produto cadastrado com sucesso!');
        formProduto.reset();
        listarProdutos();
        console.log(resultado);
    } catch (erro) {
        mostrarMensagem(erro.message, true);
    }
}

async function excluirProduto() {
    try {
        const confirmar = confirm('Deseja realmente excluir este produto?');
        if (!confirmar)
            return;

        const resposta = await fetch(`${API_URL}/produtos/${id}`, {
            method: 'DELETE'
        });

        if (!resposta.ok) {
            throw new Error('Erro ao excluir produto.');
        }

        mostrarMensagem('Produto excluído com sucesso!');

        listarProdutos();

    } catch (erro) {
        mostrarMensagem(erro.message, true);
    }
};