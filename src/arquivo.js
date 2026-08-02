import { htmlLexer } from "./lexer.js";
import { tiposTokens } from "./utils.js";

export function renderizarArquivos() {
    const arquivos = JSON.parse(localStorage.getItem("arquivos")) || [];
    const abaArquivo = document.querySelector(".abas-arquivos");

    for (let i = 0; i < arquivos.length; i++) {
        const arquivo = document.createElement("span");
        arquivo.classList.add("arquivo");
        arquivo.textContent = arquivos[i].nome;

        const botaoFecharArquivo = document.createElement("button");
        botaoFecharArquivo.textContent = "X";
        botaoFecharArquivo.classList.add("botao-fechar-arquivo");

        arquivo.appendChild(botaoFecharArquivo);
        abaArquivo.appendChild(arquivo);
    };
};

export function criarArquivo(nomeArquivo, conteudo = '') {
    const arquivos = JSON.parse(localStorage.getItem("arquivos")) || [];

    const novoArquivo = {
        nome: nomeArquivo,
        conteudo: conteudo
    };
    
    if (!arquivos.some(arquivo => arquivo.nome === nomeArquivo)) {
        arquivos.push(novoArquivo);
    };
    const arquivosStorage = localStorage.setItem("arquivos", JSON.stringify(arquivos));
    
    const abaArquivo = document.querySelector(".abas-arquivos");
    abaArquivo.replaceChildren(); // Limpa a lista de arquivos antes de adicionar novamente
    
    renderizarArquivos();
    definirArquivoAtual(nomeArquivo);

    return novoArquivo;
};

export function removerArquivo(nomeArquivo) {
    const arquivos = JSON.parse(localStorage.getItem("arquivos")) || [];
    const index = arquivos.findIndex(arquivo => arquivo.nome === nomeArquivo);

    if (index !== -1) { // -1 é o retornado para quando não encontra o arquivo
        arquivos.splice(index, 1);
        localStorage.setItem("arquivos", JSON.stringify(arquivos));
    };
};

export function salvarArquivo(nomeArquivo, conteudoArquivo) {
    const arquivos = JSON.parse(localStorage.getItem("arquivos")) || [];
    const index = arquivos.findIndex(arquivo => arquivo.nome === nomeArquivo);

    Toastify({
        text: "Arquivo salvo com sucesso!",
        duration: 3000,
        position: "center"
    }).showToast();

    if (index !== -1) {
        arquivos[index].conteudo = conteudoArquivo;
        localStorage.setItem("arquivos", JSON.stringify(arquivos));
    };
};

export function definirArquivoAtual(nomeArquivo) {
    const arquivos = JSON.parse(localStorage.getItem("arquivos")) || [];
    const arquivoAtual = arquivos.find(arquivo => arquivo.nome === nomeArquivo);
    const arquivoAtualParaStorage = localStorage.setItem("arquivoAtual", JSON.stringify(arquivoAtual));

    return arquivoAtual;
};

export function lerArquivoAtual() {
    try {
        const item = localStorage.getItem("arquivoAtual");
        if (!item || item === "undefined") return null;
        return JSON.parse(item) || null;
    } catch (e) {
        return null;
    }
};

export function definirEstadoPreview(rodando) {
    const localStorageDb = JSON.parse(localStorage.getItem("previewRodando")) || [];
    const estadoAtual = { rodandoPreview: rodando };
    localStorageDb[0] = (estadoAtual);
    localStorage.setItem("previewRodando", JSON.stringify(localStorageDb));

    if (rodando === false) {
        deletarCodigoPreview();
    };
};

export function lerEstadoAtualPreview() {
    const localStorageDb = JSON.parse(localStorage.getItem("previewRodando")) || [];
    return localStorageDb[0].rodandoPreview || false;
};

export function lerArquivo(nomeArquivo) {
    const arquivosDb = JSON.parse(localStorage.getItem("arquivos")) || [];
    const arquivo = arquivosDb.find(arquivo => arquivo.nome === nomeArquivo);
    return arquivo || null;
};

export function salvarCodigoPreview(codigoStr) {
    const localStorageDb = JSON.parse(localStorage.getItem("codigoPreview")) || [];
    const codigoPreview = { codigoPreview: codigoStr };
    localStorageDb[0] = (codigoPreview);
    localStorage.setItem("codigoPreview", JSON.stringify(localStorageDb));
};

export function lerCodigoPreview() {
    const localStorageDb = JSON.parse(localStorage.getItem("codigoPreview")) || [];
    return localStorageDb[0].codigoPreview;
};

export function deletarCodigoPreview() {
    const localStorageDb = JSON.parse(localStorage.getItem("codigoPreview")) || [];
    localStorageDb.pop();
    localStorage.setItem("codigoPreview", JSON.stringify(localStorageDb));
};

export function lerArquivos() {
    const arquivos = JSON.parse(localStorage.getItem("arquivos")) || [];
    return arquivos;
};

export function filtrarArquivosPorTextoContido(textoBuscado) {
    const arquivos = lerArquivos();

    if (!arquivos) return [];

    const arquivosFiltrados = [];

    for (const arquivo of arquivos) {
        const grupoTrechosArquivo = [];

        const tokens = htmlLexer.tokenizer(arquivo.conteudo);

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];

            if (!token.valor.toLowerCase().includes(textoBuscado.toLowerCase())) continue;

            const indiceStrToken = token.valor.toLowerCase().indexOf(textoBuscado.toLowerCase());
            const indiceGlobal = token.inicio + indiceStrToken;

            // Procura o início do contexto (< ou </)
            let inicioContexto = i;
            while (inicioContexto > 0 &&
                tokens[inicioContexto].tipo !== tiposTokens.TAG_ABERTURA &&
                tokens[inicioContexto].tipo !== tiposTokens.TAG_FECHAMENTO
            ) {
                inicioContexto--;
            };

            // Procura o fim do contexto (> ou />)
            let fimContexto = i;
            while (fimContexto < tokens.length &&
                tokens[fimContexto].tipo !== tiposTokens.TAG_CONCLUSAO_ABERTURA &&
                tokens[fimContexto].tipo !== tiposTokens.TAG_CONCLUSAO_FECHAMENTO &&
                tokens[fimContexto].tipo !== tiposTokens.TAG_AUTOFECHAMENTO
            ) {
                fimContexto++;
            };

            let contexto = "";

            for (let j = inicioContexto; j <= fimContexto && j < tokens.length; j++) {
                contexto += tokens[j].valor;
            };

            grupoTrechosArquivo.push({ arquivo: arquivo.nome, indice: indiceGlobal, indiceNoToken: indiceStrToken, token: { ...token }, contexto });
        };

        arquivosFiltrados.push(grupoTrechosArquivo)
    };

    return arquivosFiltrados;
};