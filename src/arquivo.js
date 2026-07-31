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

    arquivos.push(novoArquivo);
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
    const arquivoAtual = JSON.parse(localStorage.getItem("arquivoAtual")) || null;
    return arquivoAtual ? arquivoAtual : null;
};

export function definirEstadoPreview(rodando) {
    const localStorageDb = JSON.parse(localStorage.getItem("previewRodando")) || [];
    const estadoAtual = { rodandoPreview: rodando };
    localStorageDb[0] = (estadoAtual);
    localStorage.setItem("previewRodando", JSON.stringify(localStorageDb));
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

export function filtrarArquivosPorTextoContido(texto) {

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