document.addEventListener("DOMContentLoaded", () => {
    const botaoNovoArquivo = document.getElementById('novo-arquivo');
    const botaoImportarArquivo = document.getElementById('input-arquivo');

    botaoNovoArquivo.addEventListener('click', () => {
        sessionStorage.setItem('redirecionadoNovoArquivo', true);
    });

    botaoImportarArquivo.addEventListener('change', (e) => {
        sessionStorage.setItem('redirecionadoImportarArquivo', true);
        const arquivoRedirecionado = e.target.files[0];
        let conteudoArquivo = '';
        let nomeArquivo = '';
        
        if (!arquivoRedirecionado) return;
        
        const leitor = new FileReader();
        
        leitor.onload = function(eventoLeitor) {
            conteudoArquivo = eventoLeitor.target.result;
            nomeArquivo = arquivoRedirecionado.name;
            console.log(nomeArquivo)

            const arquivo = {
                nome: nomeArquivo,
                conteudo: conteudoArquivo
            };
            sessionStorage.setItem('arquivoRedirecionado', JSON.stringify(arquivo));
            window.location.href = 'index.html';
        };
        leitor.readAsText(arquivoRedirecionado);
    });
});