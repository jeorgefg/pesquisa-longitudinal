// Arquivo principal de scripts para o sistema de pesquisa longitudinal

// Função para salvar dados no localStorage
function saveFormData(formType, formData) {
    // Obter dados existentes ou inicializar array vazio
    let allData = JSON.parse(localStorage.getItem('pesquisa_data')) || {};
    
    // Se não existir seção para este tipo de formulário, criar
    if (!allData[formType]) {
        allData[formType] = [];
    }
    
    // Verificar se já existe um formulário com este código
    const existingIndex = allData[formType].findIndex(item => item.codigo === formData.codigo);
    
    if (existingIndex >= 0) {
        // Atualizar formulário existente
        allData[formType][existingIndex] = formData;
    } else {
        // Adicionar novo formulário
        allData[formType].push(formData);
    }
    
    // Salvar dados atualizados
    localStorage.setItem('pesquisa_data', JSON.stringify(allData));
    
    return true;
}

// Função para buscar dados de um formulário específico
function getFormData(codigo, formType) {
    const allData = JSON.parse(localStorage.getItem('pesquisa_data')) || {};
    
    if (!allData[formType]) {
        return null;
    }
    
    return allData[formType].find(item => item.codigo === codigo) || null;
}

// Função para buscar todos os dados de um tipo de formulário
function getAllFormData(formType) {
    const allData = JSON.parse(localStorage.getItem('pesquisa_data')) || {};
    return allData[formType] || [];
}

// Função para exportar dados para CSV
function exportToCSV(formType) {
    const data = getAllFormData(formType);
    
    if (data.length === 0) {
        alert('Não há dados para exportar.');
        return null;
    }
    
    // Obter cabeçalhos (todas as chaves possíveis de todos os objetos)
    const headers = [];
    data.forEach(item => {
        Object.keys(item).forEach(key => {
            if (!headers.includes(key)) {
                headers.push(key);
            }
        });
    });
    
    // Criar linhas do CSV
    let csvContent = headers.join(',') + '\n';
    
    data.forEach(item => {
        const row = headers.map(header => {
            // Garantir que valores com vírgulas sejam cercados por aspas
            let value = item[header] !== undefined ? item[header] : '';
            if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
                value = '"' + value.replace(/"/g, '""') + '"';
            }
            return value;
        });
        csvContent += row.join(',') + '\n';
    });
    
    return csvContent;
}

// Função para calcular os escores do TIPI
function calculateTIPIScores(data) {
    // Converter valores para números
    const tipi1 = parseInt(data.tipi1);
    const tipi2 = parseInt(data.tipi2);
    const tipi3 = parseInt(data.tipi3);
    const tipi4 = parseInt(data.tipi4);
    const tipi5 = parseInt(data.tipi5);
    const tipi6 = parseInt(data.tipi6);
    const tipi7 = parseInt(data.tipi7);
    const tipi8 = parseInt(data.tipi8);
    const tipi9 = parseInt(data.tipi9);
    const tipi10 = parseInt(data.tipi10);
    
    // Calcular escores (alguns itens são invertidos)
    const extroversao = (tipi1 + (8 - tipi6)) / 2;
    const amabilidade = ((8 - tipi2) + tipi7) / 2;
    const conscienciosidade = (tipi3 + (8 - tipi8)) / 2;
    const estabilidade_emocional = ((8 - tipi4) + tipi9) / 2;
    const abertura = (tipi5 + (8 - tipi10)) / 2;
    
    return {
        extroversao,
        amabilidade,
        conscienciosidade,
        estabilidade_emocional,
        abertura
    };
}

// Função para gerar um ID único
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Função para download de arquivo
function downloadFile(content, fileName, contentType) {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
}

// Configurar endpoints da API simulada
document.addEventListener('DOMContentLoaded', function() {
    // Interceptar chamadas fetch para simular API
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        // Se não for uma chamada para nossa API simulada, usar fetch normal
        if (!url.startsWith('/api/')) {
            return originalFetch(url, options);
        }
        
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simular resposta da API
                let responseData = { success: false, message: 'Endpoint não encontrado' };
                
                // Endpoint para salvar formulário inicial
                if (url === '/api/formulario-inicial' && options.method === 'POST') {
                    const formData = JSON.parse(options.body);
                    const success = saveFormData('inicial', formData);
                    responseData = { success, message: success ? 'Dados salvos com sucesso' : 'Erro ao salvar dados' };
                }
                
                // Endpoint para salvar formulário final
                else if (url === '/api/formulario-final' && options.method === 'POST') {
                    const formData = JSON.parse(options.body);
                    const success = saveFormData('final', formData);
                    responseData = { success, message: success ? 'Dados salvos com sucesso' : 'Erro ao salvar dados' };
                }
                
                // Endpoint para buscar formulário específico
                else if (url.match(/\/api\/formulario\/(.+)\/(inicial|final)/)) {
                    const matches = url.match(/\/api\/formulario\/(.+)\/(inicial|final)/);
                    const codigo = matches[1];
                    const tipo = matches[2];
                    const formData = getFormData(codigo, tipo);
                    
                    if (formData) {
                        responseData = { success: true, formulario: formData };
                    } else {
                        responseData = { success: false, message: 'Formulário não encontrado' };
                    }
                }
                
                // Endpoint para listar todos os formulários
                else if (url === '/api/formularios/inicial' || url === '/api/formularios/final') {
                    const tipo = url.endsWith('inicial') ? 'inicial' : 'final';
                    const formData = getAllFormData(tipo);
                    responseData = { success: true, formularios: formData };
                }
                
                // Endpoint para autenticação de admin
                else if (url === '/api/admin/login' && options.method === 'POST') {
                    const loginData = JSON.parse(options.body);
                    if (loginData.username === 'admin' && loginData.password === 'admin123') {
                        responseData = { success: true, token: 'admin-token-' + generateUniqueId() };
                    } else {
                        responseData = { success: false, message: 'Credenciais inválidas' };
                    }
                }
                
                // Criar objeto de resposta simulado
                const response = {
                    ok: responseData.success,
                    status: responseData.success ? 200 : 400,
                    json: () => Promise.resolve(responseData)
                };
                
                resolve(response);
            }, 300); // Simular delay de rede
        });
    };
});
