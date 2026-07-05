export class htmlLexer {
   static tokenizer(input) {
      let tokens = [];

      for (let i = 0; i < input.length; i++) {
         switch (input[i]) {
            case '<':
               if (input[i + 1] === '/') {
                  tokens.push({ tipo: 'tag-fechamento', valor: '</', inicio: i, fim: i + 1 });
                  
                  let tag = '';
                  i++;
                  i++;
                  while (i < input.length && input[i] !== '>') {
                     tag += input[i];
                     i++;
                  };
                  
                  if (tag !== '') {
                     let inicio = tokens.at(-1).fim + 1; 
                     tokens.push({ tipo: 'tag', valor: tag, inicio: inicio, fim: inicio + tag.length - 1 });
                  }

                  if (input[i] === '>') { i--; break; };
                  i++; 
               } else {
                  tokens.push({ tipo: 'tag-abertura', valor: '<', inicio: i, fim: i });
                  
                  let tag = '';
                  i++;
                  while (i < input.length && input[i].trim() !== '' && input[i] !== '>') {
                     tag += input[i];
                     i++;
                  };
                  
                  if (tag.length > 0) {
                     let inicio = tokens.at(-1).fim + 1; 
                     tokens.push({ tipo: 'tag', valor: tag, inicio: inicio, fim: inicio + tag.length - 1 });
                  }

                  if (input[i] === '>') { i--; break; };
                  if (i < input.length && input[i] == '\n') { i--; break; };
                  
                  if (i < input.length && input[i].trim() === '' && i + 1 < input.length && input[i + 1].trim() !== '') {
                     tokens.push({ tipo: 'espaco', valor: ' ', inicio: i, fim: i });
                     i++;  
                  }; 
                  
                  if (i < input.length && input[i] === '>' || input[i] === '/') { i--; break; };

                  let atributo = '';
                  while (i < input.length && input[i] !== '=') {
                     atributo += input[i];
                     i++;
                  };
                  
                  if (atributo.length > 0) {
                     let inicio = tokens.at(-1).fim + 1;
                     tokens.push({ tipo: 'atributo', valor: atributo, inicio: inicio, fim: inicio + atributo.length - 1 });
                     i--;
                  };
               };
               break;

            case '>':
               if (tokens.length > 0 && tokens.at(-1).valor === '/') {
                  tokens.pop();
                  tokens.push({ tipo: 'tag-fechamento', valor: '/>', inicio: i - 1, fim: i });
               } else {
                  tokens.push({ tipo: 'tag-fechamento', valor: '>', inicio: i, fim: i });
               };
               break;

            case '=':
               tokens.push({ tipo: 'igual', valor: '=', inicio: i, fim: i });
               break;

            case '"':
               tokens.push({ tipo: 'aspas', valor: '"', inicio: i, fim: i });
               i++;

               let valorAtributo = '';

               while (i < input.length && input[i] !== '"') {
                  valorAtributo += input[i];
                  i++;
               };

               if (valorAtributo.length > 0) {
                  tokens.push({ tipo: 'valor-atributo', valor: valorAtributo, inicio: i - valorAtributo.length, fim: i });
               };
               if (i < input.length && input[i] === '"') {
                  tokens.push({ tipo: 'aspas', valor: '"', inicio: i, fim: i });
               };
               break;

            case "/":
               tokens.push({ tipo: 'tag-fechamento', valor: '/', inicio: i, fim: i });
               break;

            default:
               let valor = '';

               while (i < input.length && input[i] !== '<') {
                  valor += input[i];
                  i++;
               };
               
               tokens.push({ tipo: 'texto', valor, inicio: i - valor.length, fim: i });
               if (i < input.length && input[i] === '<') { i--; break; };
         };
      };

      return tokens;
   };

   static colorizer(tokens) {
      const container = document.getElementById('codigo-render');
      let textoCodigo = []; 

      for (let i = 0; i < tokens.length; i++) {
         let codigo = document.createElement('span');

         switch (tokens[i].tipo) {
            case 'tag-abertura':
               codigo.classList = 'tag-abertura-fechamento';
               break;
            
            case 'tag-fechamento':
               codigo.classList = 'tag-abertura-fechamento';
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

            case 'atributo':
               codigo.classList = 'atributo';
               break;

            case 'espaco':
               codigo.classList = 'texto';
               break;
            
            case 'aspas':
               codigo.classList = 'atributo';
               break;
         };

         codigo.textContent = tokens[i].valor;
         textoCodigo.push(codigo);
      };

      container.replaceChildren();
      container.innerHTML = '';
      textoCodigo.forEach((p) => container.appendChild(p));
   };
};