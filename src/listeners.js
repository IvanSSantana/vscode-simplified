import { criarArquivo, renderizarArquivos, removerArquivo, salvarArquivo, definirArquivoAtual, lerArquivoAtual, lerEstadoAtualPreview, definirEstadoPreview, salvarCodigoPreview, lerCodigoPreview, deletarCodigoPreview, lerArquivos, lerArquivo } from "./arquivo.js";
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
        };
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

};

function fecharAbaArquivoListener() {
    let abasArquivos = document.querySelector(".abas-arquivos");

   abasArquivos.addEventListener("click", (event) => {
        if (!event.target.classList.contains("botao-fechar-arquivo"))
            return; 

        const nomeArquivo = event.target.parentElement.textContent.slice(0, -1);

        if (!!event.target.parentElement.classList.contains('preview')) {
            const botaoPlay = document.getElementById('play-codigo');
            fecharAbaPreview();
            botaoPlay.firstElementChild.setAttribute('data-prefix', 'far');
            return;
        };

        removerArquivo(nomeArquivo);
        event.target.parentElement.remove();

        abasArquivos = document.querySelector(".abas-arquivos");

        if (abasArquivos.childElementCount === 0) {
            const deletarArquivoAtual = [];
            const arquivoAtualParaStorage = localStorage.setItem("arquivoAtual", JSON.stringify(deletarArquivoAtual));
            atualizarTextArea([]);
            atualizarCodigoRenderizado('', htmlLexer);
        };
    });
};

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
        definirArquivoAtual(nomeArquivo);
        const arquivoClicado = lerArquivoAtual(nomeArquivo);
        
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
            botaoPlay.firstElementChild.setAttribute('data-prefix', 'far');
            return;
        };
        
        const arquivoAtual = lerArquivoAtual();
        salvarArquivo(arquivoAtual.nome, codigo.value);

        criarNovaAbaPreview();
        botaoPlay.firstElementChild.setAttribute('data-prefix', 'fas');
        botaoPlay.firstElementChild.style.opacity = 1;
    });
};

function verificarRedirecionado() {
    const redirecionadoNovoArquivo = sessionStorage.getItem("redirecionadoNovoArquivo") || false;
    const redirecionadoImportarArquivo = sessionStorage.getItem("redirecionadoImportarArquivo") || false;
    
    if (!!redirecionadoNovoArquivo) {
        const inputModal = document.getElementById("input-nome-arquivo");
        inputModal.style.display = "flex";
        inputModal.showModal();
        
        sessionStorage.removeItem('redirecionadoNovoArquivo');

    } else if (!!redirecionadoImportarArquivo) {
        const arquivoRedirecionado = JSON.parse(sessionStorage.getItem("arquivoRedirecionado"));
           
        const arquivos = JSON.parse(localStorage.getItem("arquivos")) || [];
        const abaArquivo = document.querySelector(".abas-arquivos");
        
        const arquivoHtml = document.createElement("span");
        arquivoHtml.classList.add("arquivo");
        arquivoHtml.textContent = arquivoRedirecionado.nome;
        
        const botaoFecharArquivo = document.createElement("button");
        botaoFecharArquivo.textContent = "X";
        botaoFecharArquivo.classList.add("botao-fechar-arquivo");
        
        arquivoHtml.appendChild(botaoFecharArquivo);
        abaArquivo.appendChild(arquivoHtml);
        
        const conteudoArquivo = arquivoRedirecionado.conteudo;

        criarArquivo(arquivoRedirecionado.nome, conteudoArquivo);
        salvarArquivo(arquivoRedirecionado.nome, conteudoArquivo)

        atualizarTextArea(htmlLexer.tokenizer(conteudoArquivo));
        atualizarCodigoRenderizado(conteudoArquivo, htmlLexer);

        sessionStorage.removeItem("arquivoRedirecionado");
        sessionStorage.removeItem("redirecionadoImportarArquivo");
    };    
};

function clicarBotoesLateralListener() {
    const abaLateral = document.getElementById('aba-lateral');

    const observerBotaoArquivo = new MutationObserver(() => {
        const botaoLateralArquivo = document.getElementById("botao-lateral-arquivo");

        if (!botaoLateralArquivo || botaoLateralArquivo.tagName !== "svg") return;

        observerBotaoArquivo.disconnect();

        botaoLateralArquivo.addEventListener("click", () => {
            if (abaLateral.style.display === 'none') {
                abaLateral.style.display = 'block';
                abaLateral.classList = 'aba-lateral';

                let arquivos = lerArquivos();
                arquivos.forEach(arquivoDb => {
                    const arquivoHtml = document.createElement("span");
                    arquivoHtml.classList = "arquivoAbaLateral";
                    arquivoHtml.textContent = arquivoDb.nome;
                    abaLateral.appendChild(arquivoHtml);
                });

            } else {
                abaLateral.style.display = 'none';
                abaLateral.replaceChildren();
            };
        });
    });

    const observerBotaoPesquisar = new MutationObserver(() => {
        const botaoLateralPesquisar = document.getElementById("botao-lateral-pesquisa");

        if (!botaoLateralPesquisar || botaoLateralPesquisar.tagName !== "svg") return;

        observerBotaoPesquisar.disconnect();

        botaoLateralPesquisar.addEventListener("click", () => {
           if (abaLateral.style.display === 'none') {
                abaLateral.style.display = 'block';
                abaLateral.classList = 'aba-lateral';
                const inputLocalizar = document.createElement('input');
                inputLocalizar.classList = 'input-localizar'; 
                inputLocalizar.placeholder = 'Localizar...'; 

                const containerSubstituir = document.createElement('div');

                const inputSubstituir = document.createElement('input');
                inputSubstituir.classList = 'input-substituir';
                inputSubstituir.placeholder = 'Substituir...';
                
                const botaoSubstituir = document.createElement('button');
                botaoSubstituir.textContent = 'Substituir'

                containerSubstituir.appendChild(inputSubstituir);
                containerSubstituir.appendChild(botaoSubstituir);
                
                abaLateral.appendChild(inputLocalizar);
                abaLateral.appendChild(containerSubstituir);    

                const containerArquivos = document.createElement('div');
                containerArquivos.classList = 'container-arquivos-aba-lateral';

                const arquivo1 = document.createElement('div');
                arquivo1.classList = 'arquivo-aba-pesquisar';
                arquivo1.textContent = 'arquivo1.teste';
                arquivo1.style.cursor = 'pointer';

                const trecho1Arquivo1 = document.createElement('span');
                trecho1Arquivo1.classList = 'trecho-codigo';
                trecho1Arquivo1.textContent = 'alguma coisa...'
                trecho1Arquivo1.style.display = 'none'
                const trecho2Arquivo1 = document.createElement('span');
                trecho2Arquivo1.classList = 'trecho-codigo';
                trecho2Arquivo1.textContent = '...coisa alguma';
                trecho2Arquivo1.style.display = 'none'

                arquivo1.appendChild(trecho1Arquivo1);
                arquivo1.appendChild(trecho2Arquivo1);
                containerArquivos.appendChild(arquivo1);
                abaLateral.appendChild(containerArquivos);

            } else {
                abaLateral.style.display = 'none';
                abaLateral.replaceChildren();
            };
        });
    });

    observerBotaoArquivo.observe(document.body, {
        childList: true,
        subtree: true
    });

    observerBotaoPesquisar.observe(document.body, {
        childList: true,
        subtree: true
    });
};

function clicarArquivoAbaLateralPesquisarListener() {
    const abaLateral = document.getElementById("aba-lateral");

    abaLateral.addEventListener("click", (event) => {
        const arquivo = event.target.closest(".arquivo-aba-pesquisar");

        if (!arquivo) return;

        const trechos = [...arquivo.children];

        const aberto = trechos[0]?.style.display === "block";

        trechos.forEach(trecho => {
            trecho.style.display = aberto ? "none" : "block";
        });
    });
}

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
    verificarRedirecionado();
    clicarBotoesLateralListener();
    clicarArquivoAbaLateralPesquisarListener();
    
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

    const abasArquivos = document.querySelector(".abas-arquivos");
    const arquivos = lerArquivos();
    
    if (arquivos.length === 0) {
        areaCodigo.style.pointerEvents = 'none';
    };

    const observerAbaArquivos = new MutationObserver(() => {
        areaCodigo.style.pointerEvents = abasArquivos.childElementCount === 0 ? "none" : "auto";
    });
    observerAbaArquivos.observe(abasArquivos, { childList: true });
});
