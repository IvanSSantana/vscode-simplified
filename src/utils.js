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
      TAG_CONCLUSAO_FECHAMENTO: 5
});

export function autoCompleteTag(tokens) {
    console.log("CHAMANDO AUTOCOMPLETE!");

    if (tokens.length > 0 && tokens.at(-1).tipo === tiposTokens.TAG_CONCLUSAO_ABERTURA) {
        console.log("CAIU NO IF!")
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