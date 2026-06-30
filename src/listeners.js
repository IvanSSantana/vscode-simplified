import { criarArquivo, lerStorageArquivos, removerArquivo, salvarArquivo, selecionarArquivoAtual } from "./arquivo.js";

function abrirAbaArquivoListener() {
    const abaArquivo = document.getElementById("arquivo");

    abaArquivo.addEventListener("click", () => {
        let abaOpcoesArquivo = document.getElementById("opcoes-aba-arquivo");
        abaOpcoesArquivo.showModal();
    });
};

function criarNovoArquivoListener() {
    let abaOpcoesArquivo = document.getElementById("opcoes-aba-arquivo");

    if (abaOpcoesArquivo) {
        abaOpcoesArquivo.addEventListener("click", (event) => {
            const option = event.target.getAttribute("option");

            if (option === "novo-arquivo") {
                const inputNomeArquivoModal = document.querySelector("#input-nome-arquivo");
                inputNomeArquivoModal.showModal();

                const inputNomeArquivo = inputNomeArquivoModal.querySelector("input[type='text']");
                inputNomeArquivo.addEventListener("keydown", (event) => {
                    if (event.key === "Enter") {
                        const nomeArquivo = inputNomeArquivo.value.trim();
                        criarArquivo(nomeArquivo);
                    }
                });
            };
        });
    };
};

function fecharAbaArquivoListener() {
    const abasArquivos = document.querySelector(".abas-arquivos");

   abasArquivos.addEventListener("click", (event) => {

    if (!event.target.classList.contains("botao-fechar-arquivo"))
        return; // Fallback para caso não clique em um dos botões de fechar arquivo

        const nomeArquivo = event.target.parentElement.textContent.slice(0, -1);

        removerArquivo(nomeArquivo);

        event.target.parentElement.remove();
    });
}

function salvarArquivoListener() {
    let abaOpcoesArquivo = document.getElementById("opcoes-aba-arquivo");

    if (abaOpcoesArquivo) {
        abaOpcoesArquivo.addEventListener("click", (event) => {
            const option = event.target.getAttribute("option");

            if (option === "salvar") {
                const nomeArquivo = JSON.parse(localStorage.getItem("arquivoAtual"))?.nome || [];
                const conteudoArquivo = document.querySelector(".area-codigo textarea").value;
                salvarArquivo(nomeArquivo, conteudoArquivo);
            };
        });
    };   
};

function selecionarArquivoAbaListener() {
    const abasArquivos = document.querySelector(".abas-arquivos");

    abasArquivos.addEventListener("click", (event) => {
        if (!event.target.classList.contains("arquivo"))
            return;

        const nomeArquivo = event.target.textContent.slice(0, -1);
        selecionarArquivoAtual(nomeArquivo);
    });
};


document.addEventListener("DOMContentLoaded", () => {
    lerStorageArquivos();

    criarNovoArquivoListener();
    abrirAbaArquivoListener();
    fecharAbaArquivoListener();
    salvarArquivoListener();
    selecionarArquivoAbaListener();
});

