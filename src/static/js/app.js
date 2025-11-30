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
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-purple-50 to-lavender-100" style="background: linear-gradient(135deg, #f8f9fa 0%, #f3e8ff 50%, #e9d5ff 100%);">
      <div class="bg-white/80 backdrop-blur-sm p-10 rounded-2xl shadow-xl w-full max-w-md border border-purple-100">
        <!-- Logo/Header -->
        <div class="text-center mb-10">
          <div class="inline-block p-4 bg-gradient-to-br from-purple-100 to-lavender-200 rounded-2xl mb-4">
            <svg class="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Confirm Consultas</h1>
          <p class="text-gray-500 text-sm">Sistema de Confirmação via WhatsApp</p>
        </div>
        
        <!-- Credenciais de acesso -->
        <div class="bg-gradient-to-r from-purple-50 to-lavender-50 border border-purple-200 rounded-xl p-4 mb-6">
          <div class="flex items-start space-x-2">
            <svg class="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
            </svg>
            <div class="flex-1">
              <p class="text-sm text-purple-900 font-semibold mb-2">Credenciais de Acesso</p>
              <div class="space-y-1">
                <p class="text-xs text-purple-700">
                  <span class="text-gray-500">Usuário:</span> 
                  <span class="font-mono font-bold text-purple-800 ml-1">admin</span>
                </p>
                <p class="text-xs text-purple-700">
                  <span class="text-gray-500">Senha:</span> 
                  <span class="font-mono font-bold text-purple-800 ml-1">admin123</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <form onsubmit="handleLogin(event)" class="space-y-5">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Usuário</label>
            <input 
              type="text" 
              id="username"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all outline-none bg-white"
              placeholder="Digite seu usuário"
              value="admin"
              required
            >
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Senha</label>
            <input 
              type="password" 
              id="password"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all outline-none bg-white"
              placeholder="Digite sua senha"
              required
            >
          </div>
          
          <button 
            type="submit"
            class="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all font-semibold shadow-lg shadow-purple-300/50 hover:shadow-xl hover:shadow-purple-400/50 transform hover:-translate-y-0.5"
          >
            Entrar
          </button>
        </form>
        
        <p class="text-center text-xs text-gray-400 mt-6">
          © 2025 Confirm Consultas. Todos os direitos reservados.
        </p>
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
      <header class="bg-white border-b border-gray-200 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-gradient-to-br from-purple-100 to-lavender-200 rounded-xl">
                <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div>
                <h1 class="text-2xl font-bold text-gray-800">Confirm Consultas</h1>
                <p class="text-sm text-gray-500">Olá, ${state.user?.username || 'Admin'}</p>
              </div>
            </div>
            <button 
              onclick="handleLogout()"
              class="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-purple-300 transition-all"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <!-- Tabs -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
          <nav class="flex space-x-2">
            ${tabs.map(tab => {
              const icons = {
                pacientes: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>',
                recorrencias: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>',
                consultas: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>'
              };
              return `
                <button
                  onclick="changeTab('${tab}')"
                  class="flex items-center space-x-2 py-3 px-5 rounded-lg font-medium text-sm transition-all ${
                    currentTab === tab
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-300/50'
                      : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                  }"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    ${icons[tab]}
                  </svg>
                  <span>${tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                </button>
              `;
            }).join('')}
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
    <div class="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
      <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-purple-50">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-xl font-bold text-gray-800">Pacientes</h2>
            <p class="text-sm text-gray-500 mt-1">${state.pacientes.length} paciente(s) cadastrado(s)</p>
          </div>
          <button 
            onclick="showAddPacienteModal()"
            class="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all font-medium shadow-lg shadow-purple-300/50 hover:shadow-xl"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span>Novo Paciente</span>
          </button>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nome</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Telefone</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            ${state.pacientes.length === 0 ? `
              <tr>
                <td colspan="4" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center justify-center space-y-3">
                    <div class="p-4 bg-purple-50 rounded-full">
                      <svg class="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                    </div>
                    <p class="text-gray-500 font-medium">Nenhum paciente cadastrado</p>
                    <p class="text-sm text-gray-400">Clique em "Novo Paciente" para começar</p>
                  </div>
                </td>
              </tr>
            ` : state.pacientes.map(p => `
              <tr class="hover:bg-purple-50/30 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-purple-100 to-lavender-200 rounded-full flex items-center justify-center">
                      <span class="text-purple-700 font-semibold text-sm">${p.nome.charAt(0).toUpperCase()}</span>
                    </div>
                    <div class="text-sm font-medium text-gray-900">${p.nome}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${formatPhone(p.telefone)}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    p.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }">
                    ${p.ativo ? '✓ Ativo' : '○ Inativo'}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onclick="deletePaciente('${p.id}')" 
                    class="text-red-600 hover:text-red-800 font-medium transition-colors"
                  >
                    Excluir
                  </button>
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
    <div class="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
      <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-purple-50">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-xl font-bold text-gray-800">Recorrências</h2>
            <p class="text-sm text-gray-500 mt-1">${state.recorrencias.length} recorrência(s) ativa(s)</p>
          </div>
          <button 
            onclick="showAddRecorrenciaModal()"
            class="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all font-medium shadow-lg shadow-purple-300/50 hover:shadow-xl"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span>Nova Recorrência</span>
          </button>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Paciente</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Dia</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Hora</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tipo</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Próxima</th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            ${state.recorrencias.length === 0 ? `
              <tr>
                <td colspan="6" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center justify-center space-y-3">
                    <div class="p-4 bg-purple-50 rounded-full">
                      <svg class="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                      </svg>
                    </div>
                    <p class="text-gray-500 font-medium">Nenhuma recorrência cadastrada</p>
                    <p class="text-sm text-gray-400">Clique em "Nova Recorrência" para começar</p>
                  </div>
                </td>
              </tr>
            ` : state.recorrencias.map(r => {
              const paciente = state.pacientes.find(p => p.id === r.paciente_id);
              const tipoColors = {
                'semanal': 'bg-blue-100 text-blue-700',
                'quinzenal': 'bg-purple-100 text-purple-700',
                'mensal': 'bg-indigo-100 text-indigo-700'
              };
              return `
                <tr class="hover:bg-purple-50/30 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center space-x-3">
                      <div class="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-purple-100 to-lavender-200 rounded-full flex items-center justify-center">
                        <span class="text-purple-700 font-semibold text-sm">${paciente?.nome?.charAt(0).toUpperCase() || '?'}</span>
                      </div>
                      <div class="text-sm font-medium text-gray-900">${paciente?.nome || '-'}</div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${diasSemana[r.dia_semana]}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">${r.hora}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${tipoColors[r.tipo] || 'bg-gray-100 text-gray-700'}">
                      ${r.tipo}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${formatDate(r.proxima_consulta)}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onclick="deleteRecorrencia('${r.id}')" 
                      class="text-red-600 hover:text-red-800 font-medium transition-colors"
                    >
                      Excluir
                    </button>
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
    'pendente': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'enviada': 'bg-blue-100 text-blue-700 border-blue-200',
    'confirmada': 'bg-green-100 text-green-700 border-green-200',
    'cancelada': 'bg-red-100 text-red-700 border-red-200'
  };

  const statusIcons = {
    'pendente': '⏳',
    'enviada': '📤',
    'confirmada': '✓',
    'cancelada': '✗'
  };

  return `
    <div class="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
      <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-purple-50">
        <div>
          <h2 class="text-xl font-bold text-gray-800">Consultas Agendadas</h2>
          <p class="text-sm text-gray-500 mt-1">${state.consultas.length} consulta(s) no sistema</p>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Paciente</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Data/Hora</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            ${state.consultas.length === 0 ? `
              <tr>
                <td colspan="3" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center justify-center space-y-3">
                    <div class="p-4 bg-purple-50 rounded-full">
                      <svg class="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                      </svg>
                    </div>
                    <p class="text-gray-500 font-medium">Nenhuma consulta agendada</p>
                    <p class="text-sm text-gray-400">As consultas serão geradas automaticamente pelas recorrências</p>
                  </div>
                </td>
              </tr>
            ` : state.consultas.map(c => {
              const paciente = state.pacientes.find(p => p.id === c.paciente_id);
              return `
                <tr class="hover:bg-purple-50/30 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center space-x-3">
                      <div class="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-purple-100 to-lavender-200 rounded-full flex items-center justify-center">
                        <span class="text-purple-700 font-semibold text-sm">${paciente?.nome?.charAt(0).toUpperCase() || '?'}</span>
                      </div>
                      <div class="text-sm font-medium text-gray-900">${paciente?.nome || '-'}</div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900 font-medium">${formatDate(c.data_hora)}</div>
                    <div class="text-sm text-gray-500">${formatTime(c.data_hora)}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-3 py-1.5 inline-flex items-center space-x-1.5 text-xs leading-5 font-semibold rounded-full border ${statusColors[c.status]}">
                      <span>${statusIcons[c.status]}</span>
                      <span>${c.status.charAt(0).toUpperCase() + c.status.slice(1)}</span>
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

// Credenciais de login
const CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

// Event Handlers
function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Validar credenciais
  if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
    state.user = { username };
    state.currentView = 'dashboard';
    state.currentTab = 'pacientes';
    render();
    loadData();
  } else {
    alert('❌ Usuário ou senha incorretos!\n\nUse:\nUsuário: admin\nSenha: admin123');
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

