import { tiposTokens } from "./utils.js";

export class htmlLexer {
   
   static sinaisReservados = ['<', '>', '/', '=', '"']
   static estados = Object.freeze({
      TAG_NAO_FECHADA: 0,
      TAG_FECHADA: 1
   });

   static estadoAtual = this.estados.TAG_FECHADA;

   static tokenizer(input) {
      let tokens = [];

      for (let i = 0; i < input.length; i++) {
         switch (input[i]) {
            case '<':
               if (input[i + 1] === '/') {
                  tokens.push({ tipo: tiposTokens.TAG_FECHAMENTO, valor: '</', inicio: i, fim: i + 1 });
                  
                  let tag = '';
                  i++;
                  i++;
                  while (i < input.length && input[i] !== '>') {
                     tag += input[i];
                     i++;
                  };
                  
                  if (tag !== '') {
                     let inicio = tokens.at(-1).fim + 1; 
                     tokens.push({ tipo: tiposTokens.TAG, valor: tag, inicio: inicio, fim: inicio + tag.length - 1 });
                  }

                  if (input[i] === '>') { i--; break; };
                  i++; 
               } else {
                  tokens.push({ tipo: tiposTokens.TAG_ABERTURA, valor: '<', inicio: i, fim: i });
                  
                  this.estadoAtual = this.estados.TAG_NAO_FECHADA;
                  
                  let tag = '';
                  i++;
                  while (i < input.length && input[i].trim() !== '' && input[i] !== '>') {
                     tag += input[i];
                     i++;
                  };
                  
                  if (tag.length > 0) {
                     let inicio = tokens.at(-1).fim + 1; 
                     tokens.push({ tipo: tiposTokens.TAG, valor: tag, inicio: inicio, fim: inicio + tag.length - 1 });
                  }

                  if (input[i] === '>') { i--; break; };
                  if (i < input.length && input[i] == '\n') { i--; break; };
                  
                  if (i < input.length && input[i].trim() === '') {
                     tokens.push({ tipo: tiposTokens.ESPACO, valor: ' ', inicio: i, fim: i });
                     i++;  
                  }; 
                  
                  if (i < input.length && input[i] === '>' || input[i] === '/') { i--; break; };
                  i--;
               };
               break;

            case '>':
               if (tokens.length > 0 && tokens.at(-1).valor === '/') {
                  tokens.pop();
                  tokens.push({ tipo: tiposTokens.TAG_AUTOFECHAMENTO, valor: '/>', inicio: i - 1, fim: i });
               } else {
                  if (tokens.at(-2).tipo === tiposTokens.TAG_FECHAMENTO) {
                     tokens.push({ tipo: tiposTokens.TAG_CONCLUSAO_FECHAMENTO, valor: '>', inicio: i, fim: i });
                  } else {
                     tokens.push({ tipo: tiposTokens.TAG_CONCLUSAO_ABERTURA, valor: '>', inicio: i, fim: i });
                  };
               };
               this.estadoAtual = this.estados.TAG_FECHADA;
               break;

            case '=':
               tokens.push({ tipo: tiposTokens.IGUAL, valor: '=', inicio: i, fim: i });
               break;

            case '"':
               tokens.push({ tipo: tiposTokens.ASPAS, valor: '"', inicio: i, fim: i });
               i++;

               let valorAtributo = '';

               while (i < input.length && input[i] !== '"') {
                  valorAtributo += input[i];
                  i++;
               };

               if (valorAtributo.length > 0) {
                  tokens.push({ tipo: tiposTokens.VALOR_ATRIBUTO, valor: valorAtributo, inicio: i - valorAtributo.length, fim: i });
               };
               if (i < input.length && input[i] === '"') {
                  tokens.push({ tipo: tiposTokens.ASPAS, valor: '"', inicio: i, fim: i });
               };
               break;

            case '/':
               tokens.push({ tipo: tiposTokens.BARRA, valor: '/', inicio: i, fim: i });
               break;

            case ' ':
               tokens.push({ tipo: tiposTokens.BARRA, valor: ' ', inicio: i, fim: i });
               break;
            
            default:
               let valor = '';
               
               if (this.estadoAtual === this.estados.TAG_FECHADA) {
                  while (i < input.length && input[i] !== '<') {
                     valor += input[i];
                     i++;
                  };
               } else {
                  while (i < input.length && !this.sinaisReservados.includes(input[i]) && input[i] !== ' ') {
                     valor += input[i];
                     i++;
                  };
               }
               
               if (this.estadoAtual === this.estados.TAG_NAO_FECHADA) {
                  tokens.push({ tipo: tiposTokens.ATRIBUTO, valor, inicio: i - valor.length, fim: i });
               } else {
                  tokens.push({ tipo: tiposTokens.TEXTO, valor, inicio: i - valor.length, fim: i });                  
               };
                
               i--;
               break;
         };
      };

      return tokens;
   };

   static colorizer(tokens) {
      const container = document.getElementById('codigo-render');
      let textoCodigo = []; 

      const SINAIS_TAGS = [tiposTokens.TAG_ABERTURA, tiposTokens.TAG_CONCLUSAO_ABERTURA, tiposTokens.TAG_CONCLUSAO_FECHAMENTO, tiposTokens.TAG_FECHAMENTO, tiposTokens.TAG_AUTOFECHAMENTO];
      const ATRIBUTOS = [tiposTokens.ATRIBUTO, tiposTokens.VALOR_ATRIBUTO, tiposTokens.ASPAS];

      for (let i = 0; i < tokens.length; i++) {
         let codigo = document.createElement('span');

         if (SINAIS_TAGS.includes(tokens[i].tipo)) {
            codigo.classList = 'tag-abertura-fechamento';
         } else if (ATRIBUTOS.includes(tokens[i].tipo)) {
            codigo.classList = 'atributo';
         } else if (tokens[i].tipo === tiposTokens.TAG || tokens[i].tipo === tiposTokens.IGUAL) {
            codigo.classList = 'tag';
         } else {
            codigo.classList = 'texto';
         };

         codigo.textContent = tokens[i].valor;
         textoCodigo.push(codigo);
      };

      container.replaceChildren();
      container.innerHTML = '';
      textoCodigo.forEach((p) => container.appendChild(p));
   };
};