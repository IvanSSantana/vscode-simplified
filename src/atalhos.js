function atalhoNovoArquivo() {
    document.addEventListener('keydown', (event) => {
        if (event.shiftKey && event.key === 'n') {
            event.preventDefault();

            const inputModal = document.getElementById("input-nome-arquivo");
            inputModal.showModal();
        };
    });
};

function atalhoSalvarArquivo() {
    document.addEventListener('keydown', (event) => {
        if (event.shiftKey && event.key === 's') {
            event.preventDefault();

            const nomeArquivo = JSON.parse(localStorage.getItem("arquivoAtual"))?.nome || [];
            const conteudoArquivo = document.querySelector(".area-codigo textarea").value;
            salvarArquivo(nomeArquivo, conteudoArquivo);    
        };
    });
};

document.addEventListener("DOMContentLoaded", () => {
    atalhoNovoArquivo();
    atalhoSalvarArquivo();
});