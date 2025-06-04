// Adicionar manipulador de eventos para o formulário intermediário
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
                
                // Endpoint para salvar formulário intermediário
                else if (url === '/api/formulario-intermediario' && options.method === 'POST') {
                    const formData = JSON.parse(options.body);
                    const success = saveFormData('intermediario', formData);
                    responseData = { success, message: success ? 'Dados salvos com sucesso' : 'Erro ao salvar dados' };
                }
                
                // Endpoint para salvar formulário final
                else if (url === '/api/formulario-final' && options.method === 'POST') {
                    const formData = JSON.parse(options.body);
                    const success = saveFormData('final', formData);
                    responseData = { success, message: success ? 'Dados salvos com sucesso' : 'Erro ao salvar dados' };
                }
                
                // Endpoint para buscar formulário específico
                else if (url.match(/\/api\/formulario\/(.+)\/(inicial|intermediario|final)/)) {
                    const matches = url.match(/\/api\/formulario\/(.+)\/(inicial|intermediario|final)/);
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
                else if (url === '/api/formularios/inicial' || url === '/api/formularios/intermediario' || url === '/api/formularios/final') {
                    const tipo = url.split('/').pop();
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

    // Manipulador para o formulário inicial
    const formInicial = document.getElementById('form-inicial');
    if (formInicial) {
        formInicial.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Validar formulário
            if (!formInicial.checkValidity()) {
                event.stopPropagation();
                formInicial.classList.add('was-validated');
                return;
            }
            
            // Coletar dados do formulário
            const formData = {};
            const formElements = formInicial.elements;
            
            for (let i = 0; i < formElements.length; i++) {
                const element = formElements[i];
                
                // Ignorar elementos sem nome ou botões
                if (!element.name || element.type === 'submit') continue;
                
                // Tratar checkboxes
                if (element.type === 'checkbox') {
                    formData[element.name] = element.checked;
                }
                // Tratar radio buttons
                else if (element.type === 'radio') {
                    if (element.checked) {
                        formData[element.name] = element.value;
                    }
                }
                // Tratar outros tipos de campos
                else {
                    formData[element.name] = element.value;
                }
            }
            
            // Adicionar data de preenchimento
            formData.data_preenchimento = new Date().toISOString();
            
            // Enviar dados para a API
            fetch('/api/formulario-inicial', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Mostrar mensagem de sucesso
                    alert('Formulário enviado com sucesso!');
                    
                    // Gerar PDF do formulário
                    generatePDF(formData, 'inicial');
                    
                    // Limpar formulário
                    formInicial.reset();
                    formInicial.classList.remove('was-validated');
                } else {
                    alert('Erro ao enviar formulário: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.');
            });
        });
    }

    // Manipulador para o formulário intermediário
    const formIntermediario = document.getElementById('formulario-intermediario');
    if (formIntermediario) {
        formIntermediario.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Validar formulário
            if (!formIntermediario.checkValidity()) {
                event.stopPropagation();
                formIntermediario.classList.add('was-validated');
                return;
            }
            
            // Coletar dados do formulário
            const formData = {};
            const formElements = formIntermediario.elements;
            
            for (let i = 0; i < formElements.length; i++) {
                const element = formElements[i];
                
                // Ignorar elementos sem nome ou botões
                if (!element.name || element.type === 'submit') continue;
                
                // Tratar checkboxes
                if (element.type === 'checkbox') {
                    formData[element.name] = element.checked;
                }
                // Tratar radio buttons
                else if (element.type === 'radio') {
                    if (element.checked) {
                        formData[element.name] = element.value;
                    }
                }
                // Tratar outros tipos de campos
                else {
                    formData[element.name] = element.value;
                }
            }
            
            // Adicionar data de preenchimento
            formData.data_preenchimento = new Date().toISOString();
            
            // Enviar dados para a API
            fetch('/api/formulario-intermediario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Mostrar mensagem de sucesso
                    alert('Formulário enviado com sucesso!');
                    
                    // Gerar PDF do formulário
                    generatePDF(formData, 'intermediario');
                    
                    // Limpar formulário
                    formIntermediario.reset();
                    formIntermediario.classList.remove('was-validated');
                } else {
                    alert('Erro ao enviar formulário: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.');
            });
        });
    }

    // Manipulador para o formulário final
    const formFinal = document.getElementById('formulario-final');
    if (formFinal) {
        formFinal.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Validar formulário
            if (!formFinal.checkValidity()) {
                event.stopPropagation();
                formFinal.classList.add('was-validated');
                return;
            }
            
            // Coletar dados do formulário
            const formData = {};
            const formElements = formFinal.elements;
            
            for (let i = 0; i < formElements.length; i++) {
                const element = formElements[i];
                
                // Ignorar elementos sem nome ou botões
                if (!element.name || element.type === 'submit') continue;
                
                // Tratar checkboxes
                if (element.type === 'checkbox') {
                    formData[element.name] = element.checked;
                }
                // Tratar radio buttons
                else if (element.type === 'radio') {
                    if (element.checked) {
                        formData[element.name] = element.value;
                    }
                }
                // Tratar outros tipos de campos
                else {
                    formData[element.name] = element.value;
                }
            }
            
            // Adicionar data de preenchimento
            formData.data_preenchimento = new Date().toISOString();
            
            // Enviar dados para a API
            fetch('/api/formulario-final', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Mostrar mensagem de sucesso
                    alert('Formulário enviado com sucesso!');
                    
                    // Gerar PDF do formulário
                    generatePDF(formData, 'final');
                    
                    // Limpar formulário
                    formFinal.reset();
                    formFinal.classList.remove('was-validated');
                } else {
                    alert('Erro ao enviar formulário: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.');
            });
        });
    }
});

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

// Função para exportar dados comparativos para CSV
function exportComparativeDataToCSV(codigo) {
    // Buscar dados dos três momentos
    const dadosInicial = getFormData(codigo, 'inicial');
    const dadosIntermediario = getFormData(codigo, 'intermediario');
    const dadosFinal = getFormData(codigo, 'final');
    
    if (!dadosInicial && !dadosIntermediario && !dadosFinal) {
        alert('Não há dados para exportar para este código.');
        return null;
    }
    
    // Criar cabeçalhos para cada momento
    const headers = ['campo', 'inicial', 'intermediario', 'final'];
    
    // Criar conjunto de todos os campos possíveis
    const allFields = new Set();
    if (dadosInicial) Object.keys(dadosInicial).forEach(key => allFields.add(key));
    if (dadosIntermediario) Object.keys(dadosIntermediario).forEach(key => allFields.add(key));
    if (dadosFinal) Object.keys(dadosFinal).forEach(key => allFields.add(key));
    
    // Criar linhas do CSV
    let csvContent = headers.join(',') + '\n';
    
    allFields.forEach(field => {
        const row = [
            field,
            dadosInicial ? (dadosInicial[field] !== undefined ? dadosInicial[field] : '') : '',
            dadosIntermediario ? (dadosIntermediario[field] !== undefined ? dadosIntermediario[field] : '') : '',
            dadosFinal ? (dadosFinal[field] !== undefined ? dadosFinal[field] : '') : ''
        ];
        
        // Garantir que valores com vírgulas sejam cercados por aspas
        const formattedRow = row.map(value => {
            if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
                return '"' + value.replace(/"/g, '""') + '"';
            }
            return value;
        });
        
        csvContent += formattedRow.join(',') + '\n';
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

// Função para comparar escores TIPI entre os três momentos
function compareTIPIScores(codigo) {
    // Buscar dados dos três momentos
    const dadosInicial = getFormData(codigo, 'inicial');
    const dadosIntermediario = getFormData(codigo, 'intermediario');
    const dadosFinal = getFormData(codigo, 'final');
    
    if (!dadosInicial && !dadosIntermediario && !dadosFinal) {
        return null;
    }
    
    // Calcular escores para cada momento disponível
    const scoresInicial = dadosInicial ? calculateTIPIScores(dadosInicial) : null;
    const scoresIntermediario = dadosIntermediario ? calculateTIPIScores(dadosIntermediario) : null;
    const scoresFinal = dadosFinal ? calculateTIPIScores(dadosFinal) : null;
    
    return {
        inicial: scoresInicial,
        intermediario: scoresIntermediario,
        final: scoresFinal
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

// Função para gerar PDF do formulário
function generatePDF(formData, formType) {
    // Carregar a biblioteca jsPDF
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    document.head.appendChild(script);
    
    script.onload = function() {
        // Carregar a biblioteca html2canvas
        const script2 = document.createElement('script');
        script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        document.head.appendChild(script2);
        
        script2.onload = function() {
            // Criar um elemento temporário para renderizar o formulário
            const tempDiv = document.createElement('div');
            tempDiv.className = 'container my-4';
            tempDiv.style.backgroundColor = 'white';
            tempDiv.style.padding = '20px';
            tempDiv.style.width = '210mm'; // Tamanho A4
            tempDiv.style.position = 'absolute';
            tempDiv.style.left = '-9999px';
            document.body.appendChild(tempDiv);
            
            // Título do formulário
            const title = document.createElement('h2');
            title.className = 'text-center mb-4';
            
            if (formType === 'inicial') {
                title.textContent = 'Formulário Inicial - Pesquisa Longitudinal';
            } else if (formType === 'intermediario') {
                title.textContent = 'Formulário Intermediário - Pesquisa Longitudinal';
            } else {
                title.textContent = 'Formulário Final - Pesquisa Longitudinal';
            }
            
            tempDiv.appendChild(title);
            
            // Subtítulo com data
            const subtitle = document.createElement('p');
            subtitle.className = 'text-center mb-4';
            const date = new Date(formData.data_preenchimento);
            subtitle.textContent = `Data de preenchimento: ${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR')}`;
            tempDiv.appendChild(subtitle);
            
            // Dados do formulário
            const dataDiv = document.createElement('div');
            dataDiv.className = 'mt-4';
            
            // Seção de identificação
            const idSection = document.createElement('div');
            idSection.className = 'mb-4';
            idSection.innerHTML = `
                <h4 class="border-bottom pb-2 mb-3">Identificação</h4>
                <p><strong>Código:</strong> ${formData.codigo || ''}</p>
                <p><strong>Idade:</strong> ${formData.idade || ''}</p>
                <p><strong>Gênero:</strong> ${formData.genero || ''}</p>
                <p><strong>Situação de Trabalho:</strong> ${formData.trabalho || ''}</p>
            `;
            
            // Adicionar período atual para formulário intermediário
            if (formType === 'intermediario') {
                idSection.innerHTML += `<p><strong>Período/Semestre atual:</strong> ${formData.periodo_atual || ''}</p>`;
            }
            
            dataDiv.appendChild(idSection);
            
            // Seção de propósito (apenas para formulário inicial)
            if (formType === 'inicial') {
                const purposeSection = document.createElement('div');
                purposeSection.className = 'mb-4';
                purposeSection.innerHTML = `
                    <h4 class="border-bottom pb-2 mb-3">Motivações e Propósito</h4>
                    <p><strong>Principal motivação:</strong> ${formData.motivacao || ''}</p>
                    <p><strong>Área de interesse:</strong> ${formData.area_interesse || ''}</p>
                    <p><strong>Principal propósito:</strong> ${formData.proposito || ''}</p>
                    
                    <h5 class="mt-3 mb-2">Avaliação de Propósito</h5>
                    <p><strong>Clareza sobre sentido da vida:</strong> ${formData.proposito_clareza || ''}/5</p>
                    <p><strong>Atividades contribuem para propósito maior:</strong> ${formData.proposito_contribuicao || ''}/5</p>
                    <p><strong>Objetivos de longo prazo:</strong> ${formData.proposito_objetivos || ''}/5</p>
                    <p><strong>Vida com rumo claro:</strong> ${formData.proposito_rumo || ''}/5</p>
                    <p><strong>Fazer diferença através da Psicologia:</strong> ${formData.proposito_diferenca || ''}/5</p>
                `;
                dataDiv.appendChild(purposeSection);
                
                // Seção de expectativas
                const expectSection = document.createElement('div');
                expectSection.className = 'mb-4';
                expectSection.innerHTML = `
                    <h4 class="border-bottom pb-2 mb-3">Expectativas</h4>
                    <p><strong>Expectativa de preparação para o mercado:</strong> ${formData.expectativa_preparacao || ''}/5</p>
                    <p><strong>Expectativa de satisfação pessoal:</strong> ${formData.expectativa_satisfacao || ''}/5</p>
                    <p><strong>Expectativa de retorno financeiro:</strong> ${formData.expectativa_financeiro || ''}/5</p>
                    <p><strong>Expectativa de habilidades clínicas:</strong> ${formData.expectativa_habilidades_clinicas || ''}/5</p>
                    <p><strong>Expectativa de oportunidades de pesquisa:</strong> ${formData.expectativa_pesquisa || ''}/5</p>
                    <p><strong>Expectativa de networking:</strong> ${formData.expectativa_networking || ''}/5</p>
                `;
                dataDiv.appendChild(expectSection);
            }
            
            // Seção de avaliação parcial (apenas para formulário intermediário)
            if (formType === 'intermediario') {
                const avaliacaoSection = document.createElement('div');
                avaliacaoSection.className = 'mb-4';
                avaliacaoSection.innerHTML = `
                    <h4 class="border-bottom pb-2 mb-3">Avaliação Parcial do Curso</h4>
                    <p><strong>Avaliação geral:</strong> ${formData.avaliacao_geral || ''}</p>
                    <p><strong>Justificativa:</strong> ${formData.justificativa_avaliacao || ''}</p>
                    <p><strong>Pontos positivos:</strong> ${formData.pontos_positivos || ''}</p>
                    <p><strong>Pontos a melhorar:</strong> ${formData.pontos_melhorar || ''}</p>
                    
                    <h5 class="mt-3 mb-2">Avaliação Quantitativa</h5>
                    <p><strong>Qualidade das aulas teóricas:</strong> ${formData.avaliacao_aulas_teoricas || ''}/5</p>
                    <p><strong>Qualidade das aulas práticas:</strong> ${formData.avaliacao_aulas_praticas || ''}/5</p>
                    <p><strong>Qualidade do corpo docente:</strong> ${formData.avaliacao_professores || ''}/5</p>
                    <p><strong>Infraestrutura da instituição:</strong> ${formData.avaliacao_infraestrutura || ''}/5</p>
                    <p><strong>Oportunidades de estágio/prática:</strong> ${formData.avaliacao_estagios || ''}/5</p>
                `;
                dataDiv.appendChild(avaliacaoSection);
                
                // Seção de mudanças nas expectativas
                const expectativasSection = document.createElement('div');
                expectativasSection.className = 'mb-4';
                expectativasSection.innerHTML = `
                    <h4 class="border-bottom pb-2 mb-3">Mudanças nas Expectativas</h4>
                    <p><strong>Área de interesse atual:</strong> ${formData.area_interesse_atual || ''}</p>
                    <p><strong>Mudança de interesse:</strong> ${formData.mudanca_interesse || ''}</p>
                    <p><strong>Expectativas atendidas:</strong> ${formData.expectativas_atendidas || ''}</p>
                    <p><strong>Justificativa:</strong> ${formData.justificativa_expectativas || ''}</p>
                    
                    <h5 class="mt-3 mb-2">Expectativas Atuais</h5>
                    <p><strong>Expectativa atual de habilidades clínicas:</strong> ${formData.expectativa_atual_habilidades_clinicas || ''}/5</p>
                    <p><strong>Expectativa atual de pesquisa:</strong> ${formData.expectativa_atual_pesquisa || ''}/5</p>
                    <p><strong>Expectativa atual de networking:</strong> ${formData.expectativa_atual_networking || ''}/5</p>
                    <p><strong>Expectativa atual de preparação para o mercado:</strong> ${formData.expectativa_atual_preparacao || ''}/5</p>
                    <p><strong>Expectativa atual de satisfação pessoal:</strong> ${formData.expectativa_atual_satisfacao || ''}/5</p>
                    <p><strong>Expectativa atual de retorno financeiro:</strong> ${formData.expectativa_atual_financeiro || ''}/5</p>
                `;
                dataDiv.appendChild(expectativasSection);
                
                // Seção de desafios
                const desafiosSection = document.createElement('div');
                desafiosSection.className = 'mb-4';
                desafiosSection.innerHTML = `
                    <h4 class="border-bottom pb-2 mb-3">Desafios Enfrentados</h4>
                    <p><strong>Principais desafios:</strong> ${formData.desafios_enfrentados || ''}</p>
                    <p><strong>Como lidou com os desafios:</strong> ${formData.superacao_desafios || ''}</p>
                    <p><strong>Apoio recebido/desejado:</strong> ${formData.apoio_recebido || ''}</p>
                    <p><strong>Desafios futuros:</strong> ${formData.desafios_futuros || ''}</p>
                `;
                dataDiv.appendChild(desafiosSection);
                
                // Seção de propósito atual
                const propositoSection = document.createElement('div');
                propositoSection.className = 'mb-4';
                propositoSection.innerHTML = `
                    <h4 class="border-bottom pb-2 mb-3">Propósito Atual</h4>
                    <p><strong>Propósito atual:</strong> ${formData.proposito_atual || ''}</p>
                    <p><strong>Mudança de propósito:</strong> ${formData.mudanca_proposito || ''}</p>
                    
                    <h5 class="mt-3 mb-2">Avaliação de Propósito Atual</h5>
                    <p><strong>Clareza sobre sentido da vida:</strong> ${formData.proposito_atual_clareza || ''}/5</p>
                    <p><strong>Atividades contribuem para propósito maior:</strong> ${formData.proposito_atual_contribuicao || ''}/5</p>
                    <p><strong>Objetivos de longo prazo:</strong> ${formData.proposito_atual_objetivos || ''}/5</p>
                    <p><strong>Vida com rumo claro:</strong> ${formData.proposito_atual_rumo || ''}/5</p>
                    <p><strong>Fazer diferença através da Psicologia:</strong> ${formData.proposito_atual_diferenca || ''}/5</p>
                `;
                dataDiv.appendChild(propositoSection);
            }
            
            // Seção de trajetória (apenas para formulário final)
            if (formType === 'final') {
                const trajectorySection = document.createElement('div');
                trajectorySection.className = 'mb-4';
                trajectorySection.innerHTML = `
                    <h4 class="border-bottom pb-2 mb-3">Trajetória e Avaliação do Curso</h4>
                    <p><strong>Área de interesse atual:</strong> ${formData.area_interesse_atual || ''}</p>
                    <p><strong>Mudança de interesse:</strong> ${formData.mudanca_interesse || ''}</p>
                    <p><strong>Expectativas atendidas:</strong> ${formData.expectativas_atendidas || ''}</p>
                    <p><strong>Justificativa:</strong> ${formData.justificativa_expectativas || ''}</p>
                    <p><strong>Desafios enfrentados:</strong> ${formData.desafios_enfrentados || ''}</p>
                    <p><strong>Superação de desafios:</strong> ${formData.superacao_desafios || ''}</p>
                `;
                dataDiv.appendChild(trajectorySection);
                
                // Seção de propósito atual
                const currentPurposeSection = document.createElement('div');
                currentPurposeSection.className = 'mb-4';
                currentPurposeSection.innerHTML = `
                    <h4 class="border-bottom pb-2 mb-3">Propósito e Planos Futuros</h4>
                    <p><strong>Propósito atual:</strong> ${formData.proposito_atual || ''}</p>
                    <p><strong>Mudança de propósito:</strong> ${formData.mudanca_proposito || ''}</p>
                    <p><strong>Planos pós-formatura:</strong> ${formData.planos_pos_formatura || ''}</p>
                `;
                dataDiv.appendChild(currentPurposeSection);
            }
            
            // Seção TIPI
            const tipiSection = document.createElement('div');
            tipiSection.className = 'mb-4';
            tipiSection.innerHTML = `
                <h4 class="border-bottom pb-2 mb-3">Inventário de Personalidade TIPI</h4>
                <p><strong>1. Extrovertido(a), entusiasta:</strong> ${formData.tipi1 || ''}/7</p>
                <p><strong>2. Crítico(a), briguento(a):</strong> ${formData.tipi2 || ''}/7</p>
                <p><strong>3. Confiável, autodisciplinado(a):</strong> ${formData.tipi3 || ''}/7</p>
                <p><strong>4. Ansioso(a), facilmente chateado(a):</strong> ${formData.tipi4 || ''}/7</p>
                <p><strong>5. Aberto(a) a novas experiências, complexo(a):</strong> ${formData.tipi5 || ''}/7</p>
                <p><strong>6. Reservado(a), quieto(a):</strong> ${formData.tipi6 || ''}/7</p>
                <p><strong>7. Simpático(a), caloroso(a):</strong> ${formData.tipi7 || ''}/7</p>
                <p><strong>8. Desorganizado(a), descuidado(a):</strong> ${formData.tipi8 || ''}/7</p>
                <p><strong>9. Calmo(a), emocionalmente estável:</strong> ${formData.tipi9 || ''}/7</p>
                <p><strong>10. Convencional, não criativo(a):</strong> ${formData.tipi10 || ''}/7</p>
            `;
            dataDiv.appendChild(tipiSection);
            
            // Adicionar todos os dados ao elemento temporário
            tempDiv.appendChild(dataDiv);
            
            // Usar html2canvas para converter o elemento em uma imagem
            html2canvas(tempDiv).then(canvas => {
                // Criar PDF
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF('p', 'mm', 'a4');
                
                // Adicionar a imagem ao PDF
                const imgData = canvas.toDataURL('image/png');
                const imgWidth = 210; // A4 width in mm
                const pageHeight = 295; // A4 height in mm
                const imgHeight = canvas.height * imgWidth / canvas.width;
                let heightLeft = imgHeight;
                let position = 0;
                
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
                
                // Adicionar páginas adicionais se necessário
                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }
                
                // Salvar o PDF
                let fileName = '';
                if (formType === 'inicial') {
                    fileName = 'formulario_inicial_';
                } else if (formType === 'intermediario') {
                    fileName = 'formulario_intermediario_';
                } else {
                    fileName = 'formulario_final_';
                }
                
                pdf.save(fileName + formData.codigo + '.pdf');
                
                // Remover o elemento temporário
                document.body.removeChild(tempDiv);
            });
        };
    };
}
