// Estado da aplicação
let state = {
  currentView: 'login',
  user: null,
  pacientes: [],
  recorrencias: [],
  consultas: []
};

// Utilitários
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
}

function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function formatPhone(phone) {
  return phone.replace(/^(\+55)?(\d{2})(\d{5})(\d{4})$/, '($2) $3-$4');
}

// Renderização de Views
function renderLogin() {
  return `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div class="bg-white p-8 rounded-lg shadow-2xl w-96">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Confirm Consultas</h1>
          <p class="text-gray-600">Sistema de Confirmação via WhatsApp</p>
        </div>
        
        <form onsubmit="handleLogin(event)" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Usuário</label>
            <input 
              type="text" 
              id="username"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite seu usuário"
              required
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Senha</label>
            <input 
              type="password" 
              id="password"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite sua senha"
              required
            >
          </div>
          
          <button 
            type="submit"
            class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  `;
}

function renderDashboard() {
  const tabs = ['pacientes', 'recorrencias', 'consultas'];
  const currentTab = state.currentTab || 'pacientes';

  return `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-900">Confirm Consultas</h1>
          <button 
            onclick="handleLogout()"
            class="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            Sair
          </button>
        </div>
      </header>

      <!-- Tabs -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8">
            ${tabs.map(tab => `
              <button
                onclick="changeTab('${tab}')"
                class="py-4 px-1 border-b-2 font-medium text-sm ${
                  currentTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }"
              >
                ${tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            `).join('')}
          </nav>
        </div>

        <!-- Content -->
        <div class="mt-6">
          ${renderTabContent(currentTab)}
        </div>
      </div>
    </div>
  `;
}

function renderTabContent(tab) {
  switch(tab) {
    case 'pacientes':
      return renderPacientes();
    case 'recorrencias':
      return renderRecorrencias();
    case 'consultas':
      return renderConsultas();
    default:
      return '';
  }
}

function renderPacientes() {
  return `
    <div class="bg-white shadow rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 class="text-lg font-semibold text-gray-900">Pacientes</h2>
        <button 
          onclick="showAddPacienteModal()"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Novo Paciente
        </button>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            ${state.pacientes.length === 0 ? `
              <tr>
                <td colspan="4" class="px-6 py-8 text-center text-gray-500">
                  Nenhum paciente cadastrado
                </td>
              </tr>
            ` : state.pacientes.map(p => `
              <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${p.nome}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatPhone(p.telefone)}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    p.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }">
                    ${p.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onclick="deletePaciente('${p.id}')" class="text-red-600 hover:text-red-900">Excluir</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderRecorrencias() {
  const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  return `
    <div class="bg-white shadow rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 class="text-lg font-semibold text-gray-900">Recorrências</h2>
        <button 
          onclick="showAddRecorrenciaModal()"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Nova Recorrência
        </button>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dia</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Próxima</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            ${state.recorrencias.length === 0 ? `
              <tr>
                <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                  Nenhuma recorrência cadastrada
                </td>
              </tr>
            ` : state.recorrencias.map(r => {
              const paciente = state.pacientes.find(p => p.id === r.paciente_id);
              return `
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${paciente?.nome || '-'}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${diasSemana[r.dia_semana]}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${r.hora}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${r.tipo}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(r.proxima_consulta)}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onclick="deleteRecorrencia('${r.id}')" class="text-red-600 hover:text-red-900">Excluir</button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderConsultas() {
  const statusColors = {
    'pendente': 'bg-yellow-100 text-yellow-800',
    'enviada': 'bg-blue-100 text-blue-800',
    'confirmada': 'bg-green-100 text-green-800',
    'cancelada': 'bg-red-100 text-red-800'
  };

  return `
    <div class="bg-white shadow rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Consultas</h2>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data/Hora</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            ${state.consultas.length === 0 ? `
              <tr>
                <td colspan="3" class="px-6 py-8 text-center text-gray-500">
                  Nenhuma consulta agendada
                </td>
              </tr>
            ` : state.consultas.map(c => {
              const paciente = state.pacientes.find(p => p.id === c.paciente_id);
              return `
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${paciente?.nome || '-'}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(c.data_hora)} ${formatTime(c.data_hora)}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[c.status]}">
                      ${c.status}
                    </span>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// Event Handlers
function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Simulação de login (você pode adicionar validação real depois)
  if (username && password) {
    state.user = { username };
    state.currentView = 'dashboard';
    state.currentTab = 'pacientes';
    render();
    loadData();
  }
}

function handleLogout() {
  state.user = null;
  state.currentView = 'login';
  render();
}

function changeTab(tab) {
  state.currentTab = tab;
  render();
}

async function loadData() {
  try {
    state.pacientes = await api.getPacientes();
    state.recorrencias = await api.getRecorrencias();
    state.consultas = await api.getConsultas();
    render();
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
  }
}

function showAddPacienteModal() {
  const nome = prompt('Nome do paciente:');
  const telefone = prompt('Telefone (ex: 22999800898):');

  if (nome && telefone) {
    addPaciente(nome, telefone);
  }
}

async function addPaciente(nome, telefone) {
  try {
    await api.createPaciente({ nome, telefone });
    await loadData();
  } catch (error) {
    alert('Erro ao adicionar paciente');
    console.error(error);
  }
}

async function deletePaciente(id) {
  if (confirm('Tem certeza que deseja excluir este paciente?')) {
    try {
      await api.deletePaciente(id);
      await loadData();
    } catch (error) {
      alert('Erro ao excluir paciente');
      console.error(error);
    }
  }
}

function showAddRecorrenciaModal() {
  const pacienteId = prompt('ID do Paciente:');
  const diaSemana = prompt('Dia da semana (0-6, 0=Domingo):');
  const hora = prompt('Hora (HH:MM):');
  const tipo = prompt('Tipo (semanal/quinzenal/mensal):');
  const proximaConsulta = prompt('Próxima consulta (YYYY-MM-DD):');

  if (pacienteId && diaSemana && hora && tipo && proximaConsulta) {
    addRecorrencia({
      paciente_id: pacienteId,
      dia_semana: parseInt(diaSemana),
      hora,
      tipo,
      proxima_consulta: proximaConsulta
    });
  }
}

async function addRecorrencia(recorrencia) {
  try {
    await api.createRecorrencia(recorrencia);
    await loadData();
  } catch (error) {
    alert('Erro ao adicionar recorrência');
    console.error(error);
  }
}

async function deleteRecorrencia(id) {
  if (confirm('Tem certeza que deseja excluir esta recorrência?')) {
    try {
      await api.deleteRecorrencia(id);
      await loadData();
    } catch (error) {
      alert('Erro ao excluir recorrência');
      console.error(error);
    }
  }
}

// Render principal
function render() {
  const app = document.getElementById('app');

  if (state.currentView === 'login') {
    app.innerHTML = renderLogin();
  } else if (state.currentView === 'dashboard') {
    app.innerHTML = renderDashboard();
  }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  render();
});

