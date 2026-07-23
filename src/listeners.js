import { criarArquivo, lerStorageArquivos, removerArquivo, salvarArquivo, selecionarArquivoAtual, lerArquivoAtual } from "./arquivo.js";
import { htmlLexer } from "./lexer.js";
import { atalhoNovoArquivo, atalhoSalvarArquivo } from "./atalhos.js";
import { autoCompleteTag } from "./utils.js";

function abrirAbaArquivoListener() {
    const abaArquivo = document.getElementById("arquivo");

    abaArquivo.addEventListener("click", () => {
        let abaOpcoesArquivo = document.getElementById("opcoes-aba-arquivo");
        abaOpcoesArquivo.style.display = "flex";
        abaOpcoesArquivo.showModal();
    });
};

function criarNovoArquivoListener() {
    const abaOpcoesArquivo = document.getElementById("opcoes-aba-arquivo");
    const inputModal = document.getElementById("input-nome-arquivo");
    const input = inputModal.querySelector("input");

    abaOpcoesArquivo.addEventListener("click", (event) => {
        if (event.target.getAttribute("option") === "novo-arquivo") {
            inputModal.showModal();
        }
    });

    input.addEventListener("keydown", (event) => {
        if (event.key !== "Enter")
            return;

        criarArquivo(input.value.trim());

        input.value = "";

        inputModal.close();
    });

}

function fecharAbaArquivoListener() {
    const abasArquivos = document.querySelector(".abas-arquivos");

   abasArquivos.addEventListener("click", (event) => {
        if (!event.target.classList.contains("botao-fechar-arquivo"))
            return; 

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
    const areaCodigo = document.querySelector(".area-codigo textarea");

    abasArquivos.addEventListener("click", (event) => {
        if (!event.target.classList.contains("arquivo"))
            return;

        const nomeArquivo = event.target.textContent.slice(0, -1);
        const arquivoClicado = selecionarArquivoAtual(nomeArquivo);
        
        areaCodigo.value = arquivoClicado.conteudo;
        const codigoArquivo = htmlLexer.tokenizer(arquivoClicado.conteudo);
        htmlLexer.colorizer(codigoArquivo);
    });
};

function clicarForaOpcoesArquivoListener(){
    document.addEventListener("click", function(e) {
        const abaOpcoesArquivo = document.getElementById("opcoes-aba-arquivo");
        const listaIdsIgnorar = ['opcoes-aba-arquivo', 'arquivo'];

        if(!listaIdsIgnorar.includes(e.target.id)){
            abaOpcoesArquivo.style.display = "none";
            abaOpcoesArquivo.close();
        };
    });
};

document.addEventListener("DOMContentLoaded", () => {
    lerStorageArquivos();

    criarNovoArquivoListener();
    clicarForaOpcoesArquivoListener();
    abrirAbaArquivoListener();
    fecharAbaArquivoListener();
    salvarArquivoListener();
    selecionarArquivoAbaListener();
    
    const arquivoAtual = lerArquivoAtual();
    const codigoArquivoAtual = htmlLexer.tokenizer(arquivoAtual.conteudo);
    htmlLexer.colorizer(codigoArquivoAtual);
    
    const areaCodigo = document.getElementById("codigo");
    
    areaCodigo.addEventListener("input",()=>{
        const codigo = areaCodigo.value;
        let tokens = htmlLexer.tokenizer(codigo);
        tokens = autoCompleteTag(tokens);
                
        htmlLexer.colorizer(tokens);
    });

    atalhoNovoArquivo();
    atalhoSalvarArquivo();
});
