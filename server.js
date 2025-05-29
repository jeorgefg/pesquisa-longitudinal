// server.js - Arquivo principal do servidor Express
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Configurar middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Pasta para armazenar os dados
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

// Arquivo de dados
const FORM_DATA_FILE = path.join(DATA_DIR, 'form_data.json');

// Inicializar arquivo de dados se não existir
if (!fs.existsSync(FORM_DATA_FILE)) {
  fs.writeFileSync(FORM_DATA_FILE, JSON.stringify([]));
}

// Rota para a página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para salvar dados do formulário inicial
app.post('/api/formulario-inicial', (req, res) => {
  try {
    // Ler dados existentes
    const formData = JSON.parse(fs.readFileSync(FORM_DATA_FILE));
    
    // Adicionar metadados
    const newData = {
      ...req.body,
      tipo_formulario: 'inicial',
      data_preenchimento: new Date().toISOString()
    };
    
    // Verificar se já existe um formulário inicial com o mesmo código
    const existingIndex = formData.findIndex(item => 
      item.codigo === newData.codigo && item.tipo_formulario === 'inicial'
    );
    
    if (existingIndex >= 0) {
      // Atualizar dados existentes
      formData[existingIndex] = newData;
    } else {
      // Adicionar novos dados
      formData.push(newData);
    }
    
    // Salvar dados atualizados
    fs.writeFileSync(FORM_DATA_FILE, JSON.stringify(formData, null, 2));
    
    res.status(200).json({ 
      success: true, 
      message: 'Dados salvos com sucesso',
      data: newData
    });
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao salvar dados',
      error: error.message
    });
  }
});

// Rota para salvar dados do formulário final
app.post('/api/formulario-final', (req, res) => {
  try {
    // Ler dados existentes
    const formData = JSON.parse(fs.readFileSync(FORM_DATA_FILE));
    
    // Adicionar metadados
    const newData = {
      ...req.body,
      tipo_formulario: 'final',
      data_preenchimento: new Date().toISOString()
    };
    
    // Verificar se já existe um formulário final com o mesmo código
    const existingIndex = formData.findIndex(item => 
      item.codigo === newData.codigo && item.tipo_formulario === 'final'
    );
    
    if (existingIndex >= 0) {
      // Atualizar dados existentes
      formData[existingIndex] = newData;
    } else {
      // Adicionar novos dados
      formData.push(newData);
    }
    
    // Salvar dados atualizados
    fs.writeFileSync(FORM_DATA_FILE, JSON.stringify(formData, null, 2));
    
    res.status(200).json({ 
      success: true, 
      message: 'Dados salvos com sucesso',
      data: newData
    });
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao salvar dados',
      error: error.message
    });
  }
});

// Rota para obter dados de um formulário específico
app.get('/api/formulario/:codigo/:tipo', (req, res) => {
  try {
    const { codigo, tipo } = req.params;
    
    // Ler dados existentes
    const formData = JSON.parse(fs.readFileSync(FORM_DATA_FILE));
    
    // Encontrar o formulário solicitado
    const form = formData.find(item => 
      item.codigo === codigo && item.tipo_formulario === tipo
    );
    
    if (!form) {
      return res.status(404).json({ 
        success: false, 
        message: 'Formulário não encontrado'
      });
    }
    
    res.status(200).json({ 
      success: true, 
      data: form
    });
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao buscar dados',
      error: error.message
    });
  }
});

// Rota para obter todos os dados
app.get('/api/dados', (req, res) => {
  try {
    // Verificar senha de administrador
    const { senha } = req.query;
    if (senha !== 'admin123') {
      return res.status(401).json({ 
        success: false, 
        message: 'Acesso não autorizado'
      });
    }
    
    // Ler dados existentes
    const formData = JSON.parse(fs.readFileSync(FORM_DATA_FILE));
    
    res.status(200).json({ 
      success: true, 
      data: formData
    });
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao buscar dados',
      error: error.message
    });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
