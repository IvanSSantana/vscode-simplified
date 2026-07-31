import { lerArquivoAtual, definirEstadoPreview, definirArquivoAtual, lerArquivo, lerEstadoAtualPreview } from "./arquivo.js";

export const tiposTokens = Object.freeze({
      TAG_ABERTURA: '<',
      TAG_FECHAMENTO: '</',
      TAG_AUTOFECHAMENTO: '/>',
      ASPAS: '"',
      BARRA: '/',
      IGUAL: '=',
      ESPACO: ' ',
      TAG: 0,
      TEXTO: 1,
      ATRIBUTO: 2,
      VALOR_ATRIBUTO: 3,
      TAG_CONCLUSAO_ABERTURA: 4,
      TAG_CONCLUSAO_FECHAMENTO: 5,
      ERRO: 6,
});

export function autoCompleteTag(tokens) {
    if (tokens.length > 0 && tokens.at(-1).tipo === tiposTokens.TAG_CONCLUSAO_ABERTURA) {
        let tag = '';

        for (let i = tokens.length - 1; i >= 0; i--) {
            if (tokens[i].tipo === tiposTokens.TAG) {
                tag = tokens[i].valor;
                break;
            }
        };

        const posicaoTagConclusaoAnterior = tokens.at(-1).fim;
        tokens.push({ tipo: tiposTokens.TAG_FECHAMENTO, valor: '</', inicio: posicaoTagConclusaoAnterior + 1, fim: posicaoTagConclusaoAnterior + 3 });
        tokens.push({ tipo: tiposTokens.TAG, valor: tag, inicio: tokens.at(-1).fim + 1, fim: tokens.at(-1).fim + 1 + tag.length - 1 });
        tokens.push({ tipo: tiposTokens.TAG_CONCLUSAO_FECHAMENTO, valor: '>', inicio: tokens.at(-1).fim + 1, fim: tokens.at(-1).fim + 1 });

        // Ajuste do textarea
        const areaCodigo = document.getElementById("codigo");
        areaCodigo.value += `</${tag}>`;

        // Ajuste do cursor
        areaCodigo.focus();
        areaCodigo.setSelectionRange(tokens.at(-4).fim + 1, tokens.at(-4).fim + 1);
    };

    return tokens;
};

export function atualizarTextArea(tokens) {
    let codigoStr = '';

    tokens.forEach(token => {
        codigoStr += token.valor
    });

    const textAreaCodigo = document.getElementById('codigo');
    textAreaCodigo.value = codigoStr;
};

export function atualizarCodigoRenderizado(codigoStr, lexer) {
    let tokens = lexer.tokenizer(codigoStr);
    tokens = lexer.detectadorErros(tokens); 

    if (!tokens.some(token => token.tipo === tiposTokens.ERRO)) {
        tokens = autoCompleteTag(tokens);
    }; 

    atualizarTextArea(tokens);
    lexer.colorizer(tokens);
}

export function criarNovaAbaPreview() {
    if (!!lerEstadoAtualPreview()) return;

    // Modificando a aba
    const abaArquivo = document.querySelector(".abas-arquivos");

    const abaPreview = document.createElement("span");
    abaPreview.classList.add("preview");
    abaPreview.textContent = lerArquivoAtual().nome + " - preview";
    abaPreview.id = 'botao-aba-preview';

    const botaoFecharAba = document.createElement("button");
    botaoFecharAba.textContent = "X";
    botaoFecharAba.classList.add("botao-fechar-arquivo");

    abaPreview.appendChild(botaoFecharAba);
    abaArquivo.appendChild(abaPreview);

    // Modificando a área de exibição
    const areaExibicao = document.getElementById('codigo-preview');
    const areaCodigo = document.getElementById('codigo');
    const areaCodigoRenderizado = document.getElementById('codigo-render');

    areaCodigo.style.pointerEvents = 'none';
    areaCodigo.style.display = 'none';
    areaCodigo.value = '';

    areaCodigoRenderizado.style.display = 'none';

    areaExibicao.style.display = 'flex';

    definirEstadoPreview(true);
};

export function fecharAbaPreview() {
    const botaoAbaPreview = document.getElementById('botao-aba-preview');
    const areaCodigo = document.getElementById('codigo');
    const areaCodigoRenderizado = document.getElementById('codigo-render');
    const areaExibicao = document.getElementById('codigo-preview');

    botaoAbaPreview.remove();

    areaCodigo.style.pointerEvents = 'auto';
    areaCodigo.style.display = 'flex';
    const abasArquivos = document.querySelector('.abas-arquivos');
    const nomeUltimoArquivo = abasArquivos.lastChild.textContent.slice(0, -1);
    areaCodigo.value = lerArquivo(nomeUltimoArquivo).conteudo;

    areaCodigoRenderizado.style.display = 'block';

    areaExibicao.style.display = 'none';

    definirEstadoPreview(false);
};

export function selecionarAbaPreview() {
    if (!lerEstadoAtualPreview()) return;

    const areaExibicao = document.getElementById('codigo-preview');
    const areaCodigo = document.getElementById('codigo');
    const areaCodigoRenderizado = document.getElementById('codigo-render');

    areaCodigo.style.pointerEvents = 'none';
    areaCodigo.style.display = 'none';
    areaCodigo.value = '';

    areaCodigoRenderizado.style.display = 'none';

    areaExibicao.style.display = 'flex';
};

export function sairAbaPreview() {
    if (!lerEstadoAtualPreview()) return;

    const areaCodigo = document.getElementById('codigo');
    const areaCodigoRenderizado = document.getElementById('codigo-render');
    const areaExibicao = document.getElementById('codigo-preview');

    areaCodigo.style.pointerEvents = 'auto';
    areaCodigo.style.display = 'flex';

    areaCodigoRenderizado.style.display = 'block';

    areaExibicao.style.display = 'none';
};