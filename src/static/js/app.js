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
                    onclick="showEditPacienteModal('${p.id}')" 
                    class="text-purple-600 hover:text-purple-800 font-medium transition-colors mr-3"
                  >
                    Editar
                  </button>
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
                      onclick="showEditRecorrenciaModal('${r.id}')" 
                      class="text-purple-600 hover:text-purple-800 font-medium transition-colors mr-3"
                    >
                      Editar
                    </button>
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
    showNotification('Erro ao carregar dados', 'error');
  }
}

// Funções de Modal
function showModal(title, content, onSubmit) {
  const modalContainer = document.getElementById('modal-container');
  modalContainer.innerHTML = `
    <div class="modal active items-center justify-center p-4" onclick="closeModal(event)">
      <div class="modal-content bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onclick="event.stopPropagation()">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-gray-800">${title}</h3>
          <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <form onsubmit="${onSubmit}; return false;" id="modal-form">
          ${content}
          <div class="flex space-x-3 mt-6">
            <button type="button" onclick="closeModal()" class="flex-1 px-4 py-2.5 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-all">
              Cancelar
            </button>
            <button type="submit" class="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 font-medium shadow-lg transition-all">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function closeModal(event) {
  if (event && event.target.classList.contains('modal')) {
    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = '';
  } else if (!event) {
    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = '';
  }
}

function showNotification(message, type = 'success') {
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  };

  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-xl shadow-lg z-50 transform transition-all duration-300`;
  notification.style.transform = 'translateX(400px)';
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 10);

  setTimeout(() => {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Pacientes - Adicionar
function showAddPacienteModal() {
  const content = `
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Nome do Paciente</label>
        <input 
          type="text" 
          id="paciente-nome"
          class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all outline-none"
          placeholder="Ex: João Silva"
          required
        >
      </div>
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Telefone (com DDD)</label>
        <input 
          type="text" 
          id="paciente-telefone"
          class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all outline-none"
          placeholder="Ex: 22999800898"
          required
        >
      </div>
    </div>
  `;

  showModal('Novo Paciente', content, 'handleAddPaciente(event)');
}

async function handleAddPaciente(event) {
  event.preventDefault();
  const nome = document.getElementById('paciente-nome').value;
  const telefone = document.getElementById('paciente-telefone').value;

  try {
    await api.createPaciente({ nome, telefone });
    closeModal();
    await loadData();
    showNotification('Paciente adicionado com sucesso!');
  } catch (error) {
    showNotification('Erro ao adicionar paciente', 'error');
    console.error(error);
  }
}

// Pacientes - Editar
function showEditPacienteModal(id) {
  const paciente = state.pacientes.find(p => p.id === id);
  if (!paciente) return;

  const content = `
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Nome do Paciente</label>
        <input 
          type="text" 
          id="paciente-nome"
          class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all outline-none"
          value="${paciente.nome}"
          required
        >
      </div>
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Telefone (com DDD)</label>
        <input 
          type="text" 
          id="paciente-telefone"
          class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all outline-none"
          value="${paciente.telefone}"
          required
        >
      </div>
    </div>
  `;

  showModal('Editar Paciente', content, `handleEditPaciente(event, '${id}')`);
}

async function handleEditPaciente(event, id) {
  event.preventDefault();
  const nome = document.getElementById('paciente-nome').value;
  const telefone = document.getElementById('paciente-telefone').value;

  try {
    await api.updatePaciente(id, { nome, telefone });
    closeModal();
    await loadData();
    showNotification('Paciente atualizado com sucesso!');
  } catch (error) {
    showNotification('Erro ao atualizar paciente', 'error');
    console.error(error);
  }
}

// Pacientes - Deletar
async function deletePaciente(id) {
  const paciente = state.pacientes.find(p => p.id === id);
  const content = `
    <div class="text-center py-4">
      <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
        <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Excluir Paciente</h3>
      <p class="text-gray-600">Tem certeza que deseja excluir <strong>${paciente?.nome}</strong>?</p>
      <p class="text-sm text-gray-500 mt-2">Esta ação não pode ser desfeita.</p>
    </div>
  `;

  const modalContainer = document.getElementById('modal-container');
  modalContainer.innerHTML = `
    <div class="modal active items-center justify-center p-4" onclick="closeModal(event)">
      <div class="modal-content bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onclick="event.stopPropagation()">
        ${content}
        <div class="flex space-x-3 mt-6">
          <button onclick="closeModal()" class="flex-1 px-4 py-2.5 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-all">
            Cancelar
          </button>
          <button onclick="confirmDeletePaciente('${id}')" class="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium transition-all">
            Excluir
          </button>
        </div>
      </div>
    </div>
  `;
}

async function confirmDeletePaciente(id) {
  try {
    await api.deletePaciente(id);
    closeModal();
    await loadData();
    showNotification('Paciente excluído com sucesso!');
  } catch (error) {
    showNotification('Erro ao excluir paciente', 'error');
    console.error(error);
  }
}

// Recorrências - Adicionar
function showAddRecorrenciaModal() {
  const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  const content = `
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Paciente</label>
        <select 
          id="recorrencia-paciente"
          class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all outline-none"
          required
        >
          <option value="">Selecione um paciente</option>
          ${state.pacientes.map(p => `<option value="${p.id}">${p.nome}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Dia da Semana</label>
        <select 
          id="recorrencia-dia"
          class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all outline-none"
          required
        >
          ${diasSemana.map((dia, index) => `<option value="${index}">${dia}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Hora</label>
        <input 
          type="time" 
          id="recorrencia-hora"
          class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all outline-none"
          required
        >
      </div>
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Tipo</label>
        <select 
          id="recorrencia-tipo"
          class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all outline-none"
          required
        >
          <option value="semanal">Semanal</option>
          <option value="quinzenal">Quinzenal</option>
          <option value="mensal">Mensal</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Próxima Consulta</label>
        <input 
          type="date" 
          id="recorrencia-proxima"
          class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all outline-none"
          required
        >
      </div>
    </div>
  `;

  showModal('Nova Recorrência', content, 'handleAddRecorrencia(event)');
}

async function handleAddRecorrencia(event) {
  event.preventDefault();

  const recorrencia = {
    paciente_id: document.getElementById('recorrencia-paciente').value,
    dia_semana: parseInt(document.getElementById('recorrencia-dia').value),
    hora: document.getElementById('recorrencia-hora').value,
    tipo: document.getElementById('recorrencia-tipo').value,
    proxima_consulta: document.getElementById('recorrencia-proxima').value
  };

  try {
    await api.createRecorrencia(recorrencia);
    closeModal();
    await loadData();
    showNotification('Recorrência adicionada com sucesso!');
  } catch (error) {
    showNotification('Erro ao adicionar recorrência', 'error');
    console.error(error);
  }
}

// Recorrências - Editar
function showEditRecorrenciaModal(id) {
  const recorrencia = state.recorrencias.find(r => r.id === id);
  if (!recorrencia) return;

  const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  const content = `
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Paciente</label>
        <select 
          id="recorrencia-paciente"
          class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all outline-none"
          required
        >
          ${state.pacientes.map(p => `
            <option value="${p.id}" ${p.id === recorrencia.paciente_id ? 'selected' : ''}>
              ${p.nome}
            </option>
          `).join('')}
        </select>
      </div>
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Dia da Semana</label>
        <select 
          id="recorrencia-dia"
          class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all outline-none"
          required
        >
          ${diasSemana.map((dia, index) => `
            <option value="${index}" ${index === recorrencia.dia_semana ? 'selected' : ''}>
              ${dia}
            </option>
          `).join('')}
        </select>
      </div>
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Hora</label>
        <input 
          type="time" 
          id="recorrencia-hora"
          class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all outline-none"
          value="${recorrencia.hora}"
          required
        >
      </div>
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Tipo</label>
        <select 
          id="recorrencia-tipo"
          class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all outline-none"
          required
        >
          <option value="semanal" ${recorrencia.tipo === 'semanal' ? 'selected' : ''}>Semanal</option>
          <option value="quinzenal" ${recorrencia.tipo === 'quinzenal' ? 'selected' : ''}>Quinzenal</option>
          <option value="mensal" ${recorrencia.tipo === 'mensal' ? 'selected' : ''}>Mensal</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Próxima Consulta</label>
        <input 
          type="date" 
          id="recorrencia-proxima"
          class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all outline-none"
          value="${recorrencia.proxima_consulta.split('T')[0]}"
          required
        >
      </div>
    </div>
  `;

  showModal('Editar Recorrência', content, `handleEditRecorrencia(event, '${id}')`);
}

async function handleEditRecorrencia(event, id) {
  event.preventDefault();

  const recorrencia = {
    paciente_id: document.getElementById('recorrencia-paciente').value,
    dia_semana: parseInt(document.getElementById('recorrencia-dia').value),
    hora: document.getElementById('recorrencia-hora').value,
    tipo: document.getElementById('recorrencia-tipo').value,
    proxima_consulta: document.getElementById('recorrencia-proxima').value
  };

  try {
    await api.updateRecorrencia(id, recorrencia);
    closeModal();
    await loadData();
    showNotification('Recorrência atualizada com sucesso!');
  } catch (error) {
    showNotification('Erro ao atualizar recorrência', 'error');
    console.error(error);
  }
}

// Recorrências - Deletar
async function deleteRecorrencia(id) {
  const recorrencia = state.recorrencias.find(r => r.id === id);
  const paciente = state.pacientes.find(p => p.id === recorrencia?.paciente_id);

  const content = `
    <div class="text-center py-4">
      <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
        <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Excluir Recorrência</h3>
      <p class="text-gray-600">Tem certeza que deseja excluir a recorrência de <strong>${paciente?.nome}</strong>?</p>
      <p class="text-sm text-gray-500 mt-2">Esta ação não pode ser desfeita.</p>
    </div>
  `;

  const modalContainer = document.getElementById('modal-container');
  modalContainer.innerHTML = `
    <div class="modal active items-center justify-center p-4" onclick="closeModal(event)">
      <div class="modal-content bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onclick="event.stopPropagation()">
        ${content}
        <div class="flex space-x-3 mt-6">
          <button onclick="closeModal()" class="flex-1 px-4 py-2.5 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-all">
            Cancelar
          </button>
          <button onclick="confirmDeleteRecorrencia('${id}')" class="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium transition-all">
            Excluir
          </button>
        </div>
      </div>
    </div>
  `;
}

async function confirmDeleteRecorrencia(id) {
  try {
    await api.deleteRecorrencia(id);
    closeModal();
    await loadData();
    showNotification('Recorrência excluída com sucesso!');
  } catch (error) {
    showNotification('Erro ao excluir recorrência', 'error');
    console.error(error);
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

