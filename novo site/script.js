const filesData = {
    'index.html': {
        content: '<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n    <meta charset="UTF-8">\n    <title>Meu Projeto</title>\n    <link rel="stylesheet" href="style.css">\n</head>\n<body>\n    <h1>Olá, Mundo!</h1>\n    <script src="main.js"></script>\n</body>\n</html>',
        type: 'HTML',
        icon: '&lt;&gt;',
        iconColor: 'var(--yellow-tag)',
        breadcrumb: 'index.html > html > body > h1'
    },
    'style.css': {
        content: 'body {\n    background-color: #1e1e1e;\n    color: #ffffff;\n}\n\nh1 {\n    color: #facc15;\n}',
        type: 'CSS',
        icon: '#',
        iconColor: '#60a5fa',
        breadcrumb: 'style.css > body'
    },
    'main.js': {
        content: 'console.log("Sistema iniciado!");\n\nfunction init() {\n    alert("Bem-vindo ao editor!");\n}\n\ninit();',
        type: 'JS',
        icon: 'JS',
        iconColor: '#facc15',
        breadcrumb: 'main.js > init()'
    }
};

let openTabs = ['index.html', 'style.css', 'main.js'];
let activeFile = 'index.html';

const tabsContainer = document.getElementById('tabs-container');
const codeEditor = document.getElementById('code-editor');
const codeDisplay = document.getElementById('code-display');
const lineNumbers = document.getElementById('line-numbers');
const breadcrumbs = document.getElementById('breadcrumbs');
const statusLang = document.getElementById('status-lang');
const titleBarText = document.getElementById('title-bar-text');

const explorerIcon = document.getElementById('explorer-icon');
const searchIcon = document.getElementById('search-icon');
const panelExplorer = document.getElementById('panel-explorer');
const panelSearch = document.getElementById('panel-search');
const sidebar = document.getElementById('sidebar');

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const searchResults = document.getElementById('search-results');

if (sidebar && panelSearch && panelSearch.parentElement !== sidebar) {
    sidebar.appendChild(panelSearch);
}

function renderTabs() {
    tabsContainer.innerHTML = '';
    
    openTabs.forEach(fileName => {
        const file = filesData[fileName];
        const tab = document.createElement('div');
        tab.className = `tab ${fileName === activeFile ? 'active' : ''}`;
        tab.onclick = () => switchTab(fileName);
        
        tab.innerHTML = `
            <div class="tab-content">
                <span style="color: ${file.iconColor}; font-weight: bold;">${file.icon}</span>
                <span>${fileName}</span>
            </div>
            <div class="tab-close" onclick="closeTab(event, '${fileName}')">×</div>
        `;
        
        tabsContainer.appendChild(tab);
    });
    
    updateSidebarSelection();
}

function switchTab(fileName) {
    if (!filesData[fileName]) return;
    
    activeFile = fileName;
    codeEditor.value = filesData[fileName].content;
    statusLang.textContent = filesData[fileName].type;
    breadcrumbs.innerHTML = `<span>${filesData[fileName].breadcrumb}</span>`;
    titleBarText.textContent = `${fileName} - nome-pasta`;
    
    renderTabs();
    updateEditor();
}

function openFile(fileName) {
    if (!openTabs.includes(fileName)) {
        openTabs.push(fileName);
    }
    switchTab(fileName);
}

function closeTab(event, fileName) {
    event.stopPropagation();
    
    const index = openTabs.indexOf(fileName);
    if (index !== -1) {
        openTabs.splice(index, 1);
    }
    
    if (openTabs.length === 0) {
        activeFile = null;
        codeEditor.value = '';
        codeDisplay.innerHTML = '';
        lineNumbers.innerHTML = '1';
        breadcrumbs.innerHTML = '';
        titleBarText.textContent = 'nome-pasta';
        statusLang.textContent = '';
        tabsContainer.innerHTML = '';
        updateSidebarSelection();
        return;
    }
    
    if (activeFile === fileName) {
        const nextFile = openTabs[index] || openTabs[index - 1];
        switchTab(nextFile);
    } else {
        renderTabs();
    }
}

function updateSidebarSelection() {
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
        const fileAttr = item.getAttribute('data-file');
        if (fileAttr === activeFile) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

function highlightHTML(code) {
    code = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return code.replace(/(&lt;\/?)([\w-]+)(.*?)(&gt;)/g, '<span class="tag-bracket">$1</span><span class="tag-name">$2</span>$3<span class="tag-bracket">$4</span>');
}

function highlightCSS(code) {
    code = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return code.replace(/([\w-]+)\s*\{/g, '<span style="color: #60a5fa;">$1</span> {')
               .replace(/([\w-]+)\s*:/g, '<span style="color: #facc15;">$1</span>:');
}

function highlightJS(code) {
    code = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return code.replace(/(function|const|let|var|return|if|else)\b/g, '<span style="color: #facc15;">$1</span>')
               .replace(/(console|alert)\b/g, '<span style="color: #60a5fa;">$1</span>')
               .replace(/(".*?"|'.*?')/g, '<span style="color: #4ade80;">$1</span>');
}

function updateEditor() {
    if (!activeFile || !filesData[activeFile]) return;
    
    const content = codeEditor.value;
    filesData[activeFile].content = content;
    
    const linesCount = content.split('\n').length;
    lineNumbers.innerHTML = Array.from({length: linesCount}, (_, i) => i + 1).join('<br>');
    
    let highlighted = content;
    const type = filesData[activeFile].type;
    
    if (type === 'HTML') highlighted = highlightHTML(content);
    else if (type === 'CSS') highlighted = highlightCSS(content);
    else if (type === 'JS') highlighted = highlightJS(content);
    else highlighted = content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    codeDisplay.innerHTML = highlighted + (content.endsWith('\n') ? '<br>' : '');
}

function syncScroll() {
    codeDisplay.scrollTop = codeEditor.scrollTop;
    codeDisplay.scrollLeft = codeEditor.scrollLeft;
    lineNumbers.scrollTop = codeEditor.scrollTop;
}

function performSearch() {
    if (!searchInput || !searchResults) return;
    const query = searchInput.value.trim().toLowerCase();
    searchResults.innerHTML = '';
    
    if (!query) return;
    
    let foundCount = 0;
    
    Object.keys(filesData).forEach(fileName => {
        const lines = filesData[fileName].content.split('\n');
        lines.forEach((line, index) => {
            if (line.toLowerCase().includes(query)) {
                foundCount++;
                const item = document.createElement('div');
                item.className = 'search-result-item';
                item.onclick = () => {
                    openFile(fileName);
                };
                item.innerHTML = `
                    <div class="search-result-file">${fileName} : linha ${index + 1}</div>
                    <div>${line.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
                `;
                searchResults.appendChild(item);
            }
        });
    });
    
    if (foundCount === 0) {
        searchResults.innerHTML = '<div style="color: #888; font-size: 12px; padding: 5px;">Nenhum resultado encontrado.</div>';
    }
}

if (searchButton) {
    searchButton.addEventListener('click', performSearch);
}

if (searchInput) {
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        } else {
            performSearch();
        }
    });
}

explorerIcon.addEventListener('click', () => {
    if (explorerIcon.classList.contains('active')) {
        sidebar.classList.toggle('collapsed');
    } else {
        sidebar.classList.remove('collapsed');
        explorerIcon.classList.add('active');
        searchIcon.classList.remove('active');
        panelExplorer.style.display = 'block';
        panelSearch.style.display = 'none';
    }
});

searchIcon.addEventListener('click', () => {
    if (searchIcon.classList.contains('active')) {
        sidebar.classList.toggle('collapsed');
    } else {
        sidebar.classList.remove('collapsed');
        searchIcon.classList.add('active');
        explorerIcon.classList.remove('active');
        panelSearch.style.display = 'block';
        panelExplorer.style.display = 'none';
        if (searchInput) searchInput.focus();
    }
});

window.addEventListener('DOMContentLoaded', () => {
    switchTab('index.html');
});

// --- SISTEMA DE REDIMENSIONAMENTO DA BARRA LATERAL ---
const resizer = document.createElement('div');
resizer.className = 'resizer';
if (sidebar) sidebar.appendChild(resizer);

let isResizing = false;

resizer.addEventListener('mousedown', (e) => {
    isResizing = true;
    resizer.classList.add('resizing');
    document.body.style.cursor = 'ew-resize';
    e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    
    // Calcula a largura subtraindo os 50px da barra lateral de ícones (activity-bar)
    let newWidth = e.clientX - 50;
    
    // Define limites para a barra não ficar fina ou larga demais
    if (newWidth < 160) newWidth = 160; 
    if (newWidth > 600) newWidth = 600; 
    
    sidebar.style.width = `${newWidth}px`;
});

document.addEventListener('mouseup', () => {
    if (isResizing) {
        isResizing = false;
        resizer.classList.remove('resizing');
        document.body.style.cursor = 'default';
    }
});