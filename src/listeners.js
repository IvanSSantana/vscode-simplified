import { criarArquivo, renderizarArquivos, removerArquivo, salvarArquivo, definirArquivoAtual, lerArquivoAtual, lerEstadoAtualPreview, definirEstadoPreview, salvarCodigoPreview, lerCodigoPreview, deletarCodigoPreview } from "./arquivo.js";
import { htmlLexer } from "./lexer.js";
import { atalhoNovoArquivo, atalhoSalvarArquivo } from "./atalhos.js";
import { autoCompleteTag, atualizarTextArea, atualizarCodigoRenderizado, criarNovaAbaPreview, fecharAbaPreview, selecionarAbaPreview, sairAbaPreview } from "./utils.js";

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
            inputModal.style.display = "flex";
            inputModal.showModal();
        }
    });

    input.addEventListener("keydown", (event) => {
        if (event.key === 'Escape')
        {
            inputModal.close();
            inputModal.style.display = 'none';
        };

        if (event.key !== "Enter")
            return;

        criarArquivo(input.value.trim());

        input.value = "";

        inputModal.close();
        inputModal.style.display = 'none';
    });

}

function fecharAbaArquivoListener() {
    const abasArquivos = document.querySelector(".abas-arquivos");

   abasArquivos.addEventListener("click", (event) => {
        if (!event.target.classList.contains("botao-fechar-arquivo"))
            return; 

        const nomeArquivo = event.target.parentElement.textContent.slice(0, -1);

        if (!!event.target.parentElement.classList.contains('preview')) {
            const botaoPlay = document.getElementById('play-codigo');
            fecharAbaPreview();
            deletarCodigoPreview();
            botaoPlay.firstElementChild.setAttribute('data-prefix', 'far');
            return;
        };

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
        if (!!event.target.classList.contains('preview')) {
            selecionarAbaPreview();
            const codigo = lerCodigoPreview();
            const iframe = document.getElementById("codigo-preview");
            iframe.srcdoc = codigo; // Faz o parser do HTML
            return;
        };
        
        if (!event.target.classList.contains("arquivo"))
            return;

        if (!!lerEstadoAtualPreview()) {
            sairAbaPreview();
        };

        const nomeArquivo = event.target.textContent.slice(0, -1);
        const arquivoClicado = definirArquivoAtual(nomeArquivo);
        
        if (!arquivoClicado.conteudo) return;

        atualizarTextArea(htmlLexer.tokenizer(arquivoClicado.conteudo));
        atualizarCodigoRenderizado(arquivoClicado.conteudo, htmlLexer);
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

function clicarForaInputNomeNovoArquivoListener() {
    const inputNomeNovoArquivoModal = document.getElementById('input-nome-arquivo');

    inputNomeNovoArquivoModal.addEventListener('focusout', (event) => {
        if (!inputNomeNovoArquivoModal.contains(event.relatedTarget)) {
            inputNomeNovoArquivoModal.close();
            inputNomeNovoArquivoModal.style.display = 'none';
        };
    });
};

function abrirArquivoListener() {
    const inputArquivo = document.getElementById('input-arquivo');

    inputArquivo.addEventListener('change', (e) => {
        const arquivo = e.target.files[0];
        let conteudoArquivo = '';

        if (!arquivo) return;

        const leitor = new FileReader();
        
        leitor.onload = function(eventoLeitor) {
            conteudoArquivo = eventoLeitor.target.result;
            atualizarTextArea(htmlLexer.tokenizer(conteudoArquivo));
            atualizarCodigoRenderizado(conteudoArquivo, htmlLexer);
        };
        leitor.readAsText(arquivo);
    });
};

function rodarCodigoPreviewListener() {
    const botaoPlay = document.getElementById('play-codigo');
    const iframe = document.getElementById("codigo-preview");
    
    botaoPlay.addEventListener('click', () => {
        let codigo = document.getElementById('codigo');
        salvarCodigoPreview(codigo.value);
        iframe.srcdoc = codigo.value; // Faz o parser do HTML
        
        if (!!lerEstadoAtualPreview()) {
            fecharAbaPreview();
            deletarCodigoPreview();
            botaoPlay.firstElementChild.setAttribute('data-prefix', 'far');
            return;
        };

        criarNovaAbaPreview();
        botaoPlay.firstElementChild.setAttribute('data-prefix', 'fas');
    });
};

document.addEventListener("DOMContentLoaded", () => {
    renderizarArquivos();
    definirEstadoPreview(false);

    criarNovoArquivoListener();
    clicarForaOpcoesArquivoListener();
    abrirAbaArquivoListener();
    fecharAbaArquivoListener();
    salvarArquivoListener();
    selecionarArquivoAbaListener();
    clicarForaInputNomeNovoArquivoListener();
    abrirArquivoListener();
    rodarCodigoPreviewListener();
    
    const arquivoAtual = lerArquivoAtual();
    const codigoArquivoAtual = atualizarCodigoRenderizado(arquivoAtual.conteudo, htmlLexer);
    
    const areaCodigo = document.getElementById("codigo");
    const areaRenderizacao = document.getElementById("codigo-render");

    areaCodigo.addEventListener("input", () => {
        const codigo = areaCodigo.value;
        atualizarCodigoRenderizado(codigo, htmlLexer);
    });

    areaCodigo.addEventListener("scroll", () => {
        areaRenderizacao.scrollTop = codigo.scrollTop;
        render.scrollLeft = codigo.scrollLeft;
    });

    atalhoNovoArquivo();
    atalhoSalvarArquivo();
});
