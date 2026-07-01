class htmlLexer {
   static tokenizer(input) {
      let tokens = [];

      for (let i = 0; i < input.length; i++) {
         switch (input[i]) {
            case '<':
               if (input[i + 1] === '/') {
                  tokens.push({ tipo: 'tag-fechamento', valor: '</', inicio: i, fim: i + 1 });
                  i++; // Como estamos analisando dois caracteres, precisamos avançar o índice em 1 para pegar o próximo caractere corretamente.
               } else {
                  tokens.push({ tipo: 'tag-abertura', valor: '<', inicio: i, fim: i });
               }
               break;

            case '>':
               tokens.push({ tipo: 'tag-fechamento', valor: '>', inicio: i, fim: i });
               break;

            case '=':
               tokens.push({ tipo: 'igual', valor: '=', inicio: i, fim: i });
               break;

            case '"':
               let valor = '';
               i++;

               while (i < input.length && input[i] !== '"') {
                  valor += input[i];
                  i++;
               };

               tokens.push({ tipo: 'string', valor, inicio: i - valor.length, fim: i });
               break;

            default:
               let valor = '';

               while (i < input.length && input[i] !== '<' && input[i] !== '>') {
                  valor += input[i];
                  i++;
               };
               tokens.push({ tipo: 'texto', valor, inicio: i - valor.length, fim: i });

               // TODO: Implementar a lógica para tags, atributos e outros casos, se necessário.
         };
      };
      return tokens;
   };
};