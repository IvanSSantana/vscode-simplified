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
                  
                  let tag = '';
                  i++;
                  while (i < input.length && input[i] !== ' ' && input !== '>') {
                     tag += input[i];
                     i++;
                  };
 
                  tokens.push({ tipo: 'tag', valor: tag, inicio: (tokens[-1].fim + 2), fim: inicio + tag.length });
                  
                  let atributo = '';
                  i++;
                  while (i < input.length && input[i] !== '=') {
                     atributo += input[i];
                     i++;
                  };

                  tokens.push({ tipo: 'atributo', valor: atributo, inicio: (tokens[-1].fim + 2), fim: inicio + atributo.length})
               };
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

               tokens.push({ tipo: 'valor-atributo', valor, inicio: i - valor.length, fim: i });
               break;

            default:
               let valor = '';

               while (i < input.length && input[i] !== '<' && input[i] !== '>') {
                  valor += input[i];
                  i++;
               };
               tokens.push({ tipo: 'texto', valor, inicio: i - valor.length, fim: i });
         };
      };
      return tokens;
   };

   static colorizer(tokens) {
      for (let i = 0; i < tokens.length; i++) {
         let codigo = document.createElement('p');
         
         switch (tokens[i].tipo) {
            case 'tag-abertura':
               codigo.classList = 'tag';
               break;
            
            case 'tag-fechamento':
               codigo.classList = 'tag';
               break;

            case 'tag':
               codigo.classList = 'tag';
               break;

            case 'valor-atributo':
               codigo.classList = 'atributo';
               break;

            case 'texto':
               codigo.classList = 'texto';
               break;

            case 'igual':
               codigo.classList = 'atributo';
               break;
         };

         
      };
   }
};