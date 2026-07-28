import { salvarArquivo, lerArquivoAtual } from "./arquivo.js";

export function atalhoNovoArquivo() {
    const inputModal = document.getElementById("input-nome-arquivo");

    document.addEventListener('keydown', (event) => {
        if (inputModal.open) return;
        
        const areaCodigo = document.getElementById('codigo');
        if (document.activeElement === areaCodigo) return;

        if (event.shiftKey && event.code === "KeyN") {
            event.preventDefault();
            inputModal.style.display = "flex";
            inputModal.showModal();
        };
    });
};

export function atalhoSalvarArquivo() {
    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.shiftKey && event.code === "KeyS") {
            event.preventDefault();

            const nomeArquivo = lerArquivoAtual().nome;
            const conteudoArquivo = document.querySelector(".area-codigo textarea").value;
            salvarArquivo(nomeArquivo, conteudoArquivo);    
        };
    });
};