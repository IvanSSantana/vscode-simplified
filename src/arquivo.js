export function lerStorageArquivos() {
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

export function criarArquivo(nomeArquivo) {
    const arquivos = JSON.parse(localStorage.getItem("arquivos")) || [];
    
    const novoArquivo = {
        nome: nomeArquivo,
        conteudo: ''
    };

    arquivos.push(novoArquivo);
    const arquivosStorage = localStorage.setItem("arquivos", JSON.stringify(arquivos));
    
    const abaArquivo = document.querySelector(".abas-arquivos");
    abaArquivo.replaceChildren(); // Limpa a lista de arquivos antes de adicionar novamente

    lerStorageArquivos();

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

export function selecionarArquivoAtual(nomeArquivo) {
    const arquivos = JSON.parse(localStorage.getItem("arquivos")) || [];
    const arquivoAtual = arquivos.find(arquivo => arquivo.nome === nomeArquivo);
    const arquivoAtualParaStorage = localStorage.setItem("arquivoAtual", JSON.stringify(arquivoAtual));
    
    const areaCodigo = document.querySelector(".area-codigo textarea");
    areaCodigo.value = arquivoAtual.conteudo;

    return arquivoAtual;
};