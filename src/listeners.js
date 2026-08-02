import { criarArquivo, renderizarArquivos, removerArquivo, salvarArquivo, definirArquivoAtual, lerArquivoAtual, lerEstadoAtualPreview, definirEstadoPreview, salvarCodigoPreview, lerCodigoPreview, deletarCodigoPreview, lerArquivos, lerArquivo, filtrarArquivosPorTextoContido } from "./arquivo.js";
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
        if (event.key === 'Escape') {
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

        // removerArquivo(nomeArquivo);
        event.target.parentElement.remove();

        abasArquivos = document.querySelector(".abas-arquivos");

        if (abasArquivos.childElementCount === 0) {
            const deletarArquivoAtual = [];
            const arquivoAtualParaStorage = localStorage.setItem("arquivoAtual", JSON.stringify(deletarArquivoAtual));
            atualizarTextArea([]);
            atualizarCodigoRenderizado('', htmlLexer);
        };

        const abaLateral = document.getElementById('aba-lateral');
        const inputLocalizar = document.querySelector('.input-localizar');
        if (abaLateral.style.display !== 'none' && !!inputLocalizar) {
            renderizarResultadosPesquisa(inputLocalizar.value);
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
        const novoArquivoAtual = definirArquivoAtual(nomeArquivo);

        atualizarTextArea(htmlLexer.tokenizer(novoArquivoAtual.conteudo));
        atualizarCodigoRenderizado(novoArquivoAtual.conteudo, htmlLexer);
    });
};

function clicarForaOpcoesArquivoListener() {
    document.addEventListener("click", function (e) {
        const abaOpcoesArquivo = document.getElementById("opcoes-aba-arquivo");
        const listaIdsIgnorar = ['opcoes-aba-arquivo', 'arquivo'];

        if (!listaIdsIgnorar.includes(e.target.id)) {
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

        leitor.onload = function (eventoLeitor) {
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
                    arquivoHtml.classList.add("arquivoAbaLateral");

                    const nomeSpan = document.createElement("span");
                    nomeSpan.classList.add("nome-arquivo-lateral");
                    nomeSpan.textContent = arquivoDb.nome;

                    const botaoDeletar = document.createElement("button");
                    botaoDeletar.classList.add("botao-deletar-arquivo-lateral");
                    botaoDeletar.title = "Deletar arquivo";
                    botaoDeletar.innerHTML = '<i class="fa-solid fa-trash"></i>';

                    arquivoHtml.appendChild(nomeSpan);
                    arquivoHtml.appendChild(botaoDeletar);
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
                botaoSubstituir.id = 'botao-substituir-lateral';
                botaoSubstituir.textContent = 'Substituir'

                containerSubstituir.appendChild(inputSubstituir);
                containerSubstituir.appendChild(botaoSubstituir);

                abaLateral.appendChild(inputLocalizar);
                abaLateral.appendChild(containerSubstituir);

                const containerArquivos = document.createElement('div');
                containerArquivos.classList = 'container-arquivos-aba-lateral';
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

function digitarNoLocalizarListener() {
    const abaLateral = document.getElementById('aba-lateral');
    let timeoutPesquisa;

    abaLateral.addEventListener("input", (event) => {
        if (event.target.classList.contains("input-localizar")) {
            clearTimeout(timeoutPesquisa);

            timeoutPesquisa = setTimeout(() => {
                const texto = event.target.value;
                renderizarResultadosPesquisa(texto);
            }, 700);
        }
    });
};

function substituirTextoListener() {
    const abaLateral = document.getElementById('aba-lateral');

    abaLateral.addEventListener('click', (event) => {
        if (event.target.id === 'botao-substituir-lateral') {
            const inputLocalizar = document.querySelector('.input-localizar');
            const inputSubstituir = document.querySelector('.input-substituir');

            if (!inputLocalizar || !inputSubstituir) return;

            const textoBuscado = inputLocalizar.value;
            const textoSubstituto = inputSubstituir.value;

            if (!textoBuscado) return;

            const arquivos = lerArquivos();
            const arquivoAtual = lerArquivoAtual();
            let arquivoAtualAlterado = false;
            let arquivoAtualConteudoAtualizado = '';

            arquivos.forEach(arquivo => {
                let conteudoArquivo = arquivo.conteudo;

                if (!!conteudoArquivo && conteudoArquivo.includes(textoBuscado)) {
                    conteudoArquivo = arquivo.conteudo.replaceAll(textoBuscado, textoSubstituto);
                    salvarArquivo(arquivo.nome, conteudoArquivo);
                    
                    if (!!arquivoAtual && arquivoAtual.nome === arquivo.nome) {
                        arquivoAtualConteudoAtualizado = conteudoArquivo;
                        arquivoAtualAlterado = true;
                    };
                };
            });
            
            if (!!arquivoAtualAlterado) {
                const arquivoAtualizado = definirArquivoAtual(arquivoAtual.nome);

                atualizarTextArea(htmlLexer.tokenizer(arquivoAtualizado.conteudo));
                atualizarCodigoRenderizado(arquivoAtualizado.conteudo, htmlLexer);
            };

            renderizarResultadosPesquisa(inputLocalizar.value);
        };
    });
};

export function abrirAbaSuperior(nomeArquivo) {
    const abaArquivo = document.querySelector(".abas-arquivos");
    if (!abaArquivo) return;

    const abasExistentes = abaArquivo.querySelectorAll(".arquivo");
    const jaExiste = [...abasExistentes].some(aba => {
        const nomeAba = aba.childNodes[0]?.textContent?.trim() || aba.textContent.slice(0, -1).trim();
        return nomeAba === nomeArquivo;
    });

    if (!jaExiste) {
        const arquivoHtml = document.createElement("span");
        arquivoHtml.classList.add("arquivo");
        arquivoHtml.textContent = nomeArquivo;

        const botaoFecharArquivo = document.createElement("button");
        botaoFecharArquivo.textContent = "X";
        botaoFecharArquivo.classList.add("botao-fechar-arquivo");

        arquivoHtml.appendChild(botaoFecharArquivo);
        abaArquivo.appendChild(arquivoHtml);
    }
}

function renderizarResultadosPesquisa(texto) {
    const container = document.querySelector(".container-arquivos-aba-lateral");
    if (!container) return;
    container.replaceChildren();
    if (!texto.trim()) return;

    const arquivosFiltrados = filtrarArquivosPorTextoContido(texto);
    if (!arquivosFiltrados) return;
    
    for (const arquivo of arquivosFiltrados) {
        if (!arquivo || arquivo.length === 0) continue;

        const divArquivo = document.createElement("div");
        divArquivo.className = "arquivo-aba-pesquisar";

        const tituloArquivo = document.createElement("div");
        tituloArquivo.className = "titulo-arquivo-pesquisa";
        tituloArquivo.innerHTML = `<i class="fa-regular fa-file-code"></i> <span>${arquivo[0].arquivo}</span>`;

        divArquivo.appendChild(tituloArquivo);

        arquivo.forEach(trecho => {
            const trechoHtml = document.createElement("div");
            trechoHtml.innerHTML = destacarTrecho(trecho.contexto, texto);
            trechoHtml.className = "trecho-codigo";
            trechoHtml.style.display = "none";

            trechoHtml.dataset.arquivo = trecho.arquivo;
            trechoHtml.dataset.indiceTextArea = trecho.indice;

            divArquivo.appendChild(trechoHtml);
        });
        
        container.appendChild(divArquivo);
    };
};

function destacarTrecho(contexto, texto) {
    if (!contexto || !texto) return;

    // Substitui tags de cabeçalho (h1-h6) por p para padronizar a exibição
    const contextoPadronizado = contexto.replace(/<\/?h[1-6]/gi, match => match.startsWith('</') ? '</p' : '<p');

    const indiceInicioTrecho = contextoPadronizado.toLowerCase().indexOf(texto.toLowerCase());
    if (indiceInicioTrecho === -1) return contextoPadronizado;

    const antes = contextoPadronizado.slice(0, indiceInicioTrecho);
    const destaque = contextoPadronizado.slice(indiceInicioTrecho, indiceInicioTrecho + texto.length);
    const depois = contextoPadronizado.slice(indiceInicioTrecho + texto.length);

    return antes + "<mark>" + destaque + "</mark>" + depois;
};

function clicarTrechoPesquisadoListener() {
    document.addEventListener("click", (event) => {
        const trecho = event.target.closest(".trecho-codigo");
        if (!trecho) return;

        abrirResultadoPesquisa(trecho.dataset.arquivo, trecho.dataset.indiceTextArea);
    });
};

function abrirResultadoPesquisa(nomeArquivo, indiceTextArea) {
    abrirAbaSuperior(nomeArquivo);
    const arquivo = definirArquivoAtual(nomeArquivo);
    const arquivosDb = lerArquivos();

    if (!arquivosDb.some(arquivo => arquivo.nome === nomeArquivo)) {
        criarArquivo(nomeArquivo, arquivo.conteudo);
    };

    atualizarTextArea(htmlLexer.tokenizer(arquivo.conteudo));
    atualizarCodigoRenderizado(arquivo.conteudo, htmlLexer);

    const textarea = document.getElementById("codigo");
    textarea.focus();
    textarea.setSelectionRange(indiceTextArea, indiceTextArea);

    const textoAntes = textarea.value.slice(0, indiceTextArea);
    const linha = textoAntes.split("\n").length - 1;
    const alturaLinha = 18; 
    textarea.scrollTop = linha * alturaLinha;
};

function clicarArquivoAbaLateralPesquisarListener() {
    const abaLateral = document.getElementById("aba-lateral");

    abaLateral.addEventListener("click", (event) => {
        if (event.target.closest(".trecho-codigo")) return;

        const arquivo = event.target.closest(".arquivo-aba-pesquisar");
        if (!arquivo) return;

        const trechos = arquivo.querySelectorAll(".trecho-codigo");
        if (trechos.length === 0) return;

        const aberto = trechos[0].style.display === "block";

        trechos.forEach(trecho => {
            trecho.style.display = aberto ? "none" : "block";
        });
    });
};

function clicarArquivoAbaLateralListener() {
    const abaLateral = document.getElementById("aba-lateral");

    abaLateral.addEventListener("click", (event) => {
        const botaoDeletar = event.target.closest(".botao-deletar-arquivo-lateral");

        if (botaoDeletar) {
            event.stopPropagation();
            const arquivoHtml = event.target.closest(".arquivoAbaLateral");
            if (!arquivoHtml) return;

            const nomeSpan = arquivoHtml.querySelector(".nome-arquivo-lateral");
            const nomeArquivo = nomeSpan ? nomeSpan.textContent.trim() : arquivoHtml.textContent.trim();

            removerArquivo(nomeArquivo);
            arquivoHtml.remove();

            // Remover das abas superiores se estiver aberto
            const abasSuperiores = document.querySelectorAll(".abas-arquivos .arquivo");
            abasSuperiores.forEach(aba => {
                const nomeAba = aba.childNodes[0]?.textContent?.trim() || aba.textContent.slice(0, -1).trim();
                if (nomeAba === nomeArquivo) {
                    aba.remove();
                }
            });

            const abasArquivos = document.querySelector(".abas-arquivos");
            if (abasArquivos && abasArquivos.childElementCount === 0) {
                atualizarTextArea([]);
                atualizarCodigoRenderizado('', htmlLexer);
            } else {
                const arquivoAtual = lerArquivoAtual();
                if (!arquivoAtual) {
                    const arquivosRestantes = lerArquivos();
                    if (arquivosRestantes.length > 0) {
                        const ultimoArquivo = arquivosRestantes[arquivosRestantes.length - 1];
                        const novoAtual = definirArquivoAtual(ultimoArquivo.nome);
                        atualizarTextArea(htmlLexer.tokenizer(novoAtual.conteudo));
                        atualizarCodigoRenderizado(novoAtual.conteudo, htmlLexer);
                    } else {
                        atualizarTextArea([]);
                        atualizarCodigoRenderizado('', htmlLexer);
                    }
                }
            }
            return;
        }

        const arquivoHtml = event.target.closest(".arquivoAbaLateral");
        if (!arquivoHtml) return;

        const nomeSpan = arquivoHtml.querySelector(".nome-arquivo-lateral");
        const nomeArquivo = nomeSpan ? nomeSpan.textContent.trim() : arquivoHtml.textContent.trim();
        
        abrirAbaSuperior(nomeArquivo);

        const arquivo = definirArquivoAtual(nomeArquivo);
        atualizarTextArea(htmlLexer.tokenizer(arquivo.conteudo));
        atualizarCodigoRenderizado(arquivo.conteudo, htmlLexer);
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
    verificarRedirecionado();
    clicarBotoesLateralListener();
    clicarArquivoAbaLateralPesquisarListener();
    digitarNoLocalizarListener();
    substituirTextoListener();
    clicarTrechoPesquisadoListener();
    clicarArquivoAbaLateralListener();

    const arquivoAtual = lerArquivoAtual();
    
    if (!!arquivoAtual) {
        const codigoArquivoAtual = atualizarCodigoRenderizado(arquivoAtual.conteudo, htmlLexer);
    };

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
