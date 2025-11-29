import { useState, useEffect } from 'react';
import { Users, Calendar, Clock, LogOut, Plus, Edit2, Trash2, Search } from 'lucide-react';
import { getPacientes, getRecorrencias, getConsultas, createPaciente, createRecorrencia, updatePaciente, deletePaciente, updateRecorrencia, deleteRecorrencia } from '../services/api';
import type { Paciente, Recorrencia, Consulta } from '../services/api';

interface DashboardProps {
  onLogout: () => void;
}

type Tab = 'pacientes' | 'recorrencias' | 'consultas';

const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export default function Dashboard({ onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('pacientes');
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [recorrencias, setRecorrencias] = useState<Recorrencia[]>([]);
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPacienteModal, setShowPacienteModal] = useState(false);
  const [showRecorrenciaModal, setShowRecorrenciaModal] = useState(false);
  const [editingPaciente, setEditingPaciente] = useState<Paciente | null>(null);
  const [editingRecorrencia, setEditingRecorrencia] = useState<Recorrencia | null>(null);
  const [novoPaciente, setNovoPaciente] = useState({ nome: '', telefone: '' });
  const [novaRecorrencia, setNovaRecorrencia] = useState({
    paciente_id: '',
    dia_semana: 1,
    hora: '14:00',
    tipo: 'semanal' as 'semanal' | 'quinzenal' | 'mensal',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [p, r, c] = await Promise.all([getPacientes(), getRecorrencias(), getConsultas()]);
      setPacientes(p);
      setRecorrencias(r);
      setConsultas(c);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePaciente = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPaciente) {
        await updatePaciente(editingPaciente.id, novoPaciente);
      } else {
        await createPaciente(novoPaciente);
      }
      setNovoPaciente({ nome: '', telefone: '' });
      setEditingPaciente(null);
      setShowPacienteModal(false);
      loadData();
    } catch (error) {
      alert(editingPaciente ? 'Erro ao atualizar paciente' : 'Erro ao criar paciente');
    }
  };

  const handleEditPaciente = (paciente: Paciente) => {
    setEditingPaciente(paciente);
    setNovoPaciente({ nome: paciente.nome, telefone: paciente.telefone });
    setShowPacienteModal(true);
  };

  const handleDeletePaciente = async (id: string, nome: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o paciente ${nome}?`)) {
      try {
        await deletePaciente(id);
        loadData();
      } catch (error) {
        alert('Erro ao excluir paciente');
      }
    }
  };

  const handleCloseModal = () => {
    setShowPacienteModal(false);
    setEditingPaciente(null);
    setNovoPaciente({ nome: '', telefone: '' });
  };

  const handleCreateRecorrencia = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const hoje = new Date();
      const proximaData = new Date(hoje);
      const diferencaDias = (novaRecorrencia.dia_semana - hoje.getDay() + 7) % 7;
      proximaData.setDate(hoje.getDate() + (diferencaDias === 0 ? 7 : diferencaDias));
      const [horas, minutos] = novaRecorrencia.hora.split(':');
      proximaData.setHours(parseInt(horas), parseInt(minutos), 0, 0);

      const dataToSend = { ...novaRecorrencia, proxima_consulta: proximaData.toISOString() };

      if (editingRecorrencia) {
        await updateRecorrencia(editingRecorrencia.id, dataToSend);
      } else {
        await createRecorrencia(dataToSend);
      }

      setNovaRecorrencia({ paciente_id: '', dia_semana: 1, hora: '14:00', tipo: 'semanal' });
      setEditingRecorrencia(null);
      setShowRecorrenciaModal(false);
      loadData();
    } catch (error) {
      alert(editingRecorrencia ? 'Erro ao atualizar recorrência' : 'Erro ao criar recorrência');
    }
  };

  const handleEditRecorrencia = (rec: Recorrencia) => {
    setEditingRecorrencia(rec);
    setNovaRecorrencia({
      paciente_id: rec.paciente_id,
      dia_semana: rec.dia_semana,
      hora: rec.hora,
      tipo: rec.tipo,
    });
    setShowRecorrenciaModal(true);
  };

  const handleDeleteRecorrencia = async (id: string, pacienteNome: string) => {
    if (window.confirm(`Tem certeza que deseja excluir a recorrência de ${pacienteNome}?`)) {
      try {
        await deleteRecorrencia(id);
        loadData();
      } catch (error) {
        alert('Erro ao excluir recorrência');
      }
    }
  };

  const handleCloseRecorrenciaModal = () => {
    setShowRecorrenciaModal(false);
    setEditingRecorrencia(null);
    setNovaRecorrencia({ paciente_id: '', dia_semana: 1, hora: '14:00', tipo: 'semanal' });
  };

  const getPacienteNome = (id: string) => pacientes.find(p => p.id === id)?.nome || 'Desconhecido';
  const formatDate = (date: string) => new Date(date).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      pendente: { bg: 'bg-amber-500', text: 'Pendente', icon: '⏳' },
      enviada: { bg: 'bg-blue-500', text: 'Enviada', icon: '📤' },
      confirmada: { bg: 'bg-emerald-500', text: 'Confirmada', icon: '✓' },
      cancelada: { bg: 'bg-red-500', text: 'Cancelada', icon: '✗' },
    };
    const badge = badges[status as keyof typeof badges] || badges.pendente;
    return <span className={`${badge.bg} text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-md`}>{badge.icon} {badge.text}</span>;
  };

  const filteredPacientes = pacientes.filter(p =>
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) || p.telefone.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-100 via-purple-50 to-fuchsia-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-violet-500 border-t-transparent"></div>
          <p className="mt-4 text-violet-600 font-semibold">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-purple-50 to-fuchsia-100">
      <header className="bg-white/90 backdrop-blur-xl border-b border-violet-100 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">Dashboard Psicologia</h1>
                <p className="text-sm text-gray-600 font-medium">Gestão de Consultas</p>
              </div>
            </div>
            <button onClick={onLogout} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl transition-all shadow-md font-semibold">
              <LogOut className="w-4 h-4" /> Sair
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-violet-100 hover:shadow-2xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase mb-1">Total Pacientes</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">{pacientes.length}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl border border-purple-100 hover:shadow-2xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase mb-1">Recorrências</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">{recorrencias.filter(r => r.ativo).length}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Calendar className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl border border-fuchsia-100 hover:shadow-2xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase mb-1">Pendentes</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
                  {consultas.filter(c => c.status === 'pendente' || c.status === 'enviada').length}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-fuchsia-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Clock className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-violet-100">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'pacientes', label: 'Pacientes', icon: Users },
              { id: 'recorrencias', label: 'Recorrências', icon: Calendar },
              { id: 'consultas', label: 'Consultas', icon: Clock },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex-1 px-6 py-4 font-semibold transition-all relative ${activeTab === tab.id ? 'text-violet-600 bg-violet-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                <div className="flex items-center justify-center gap-2">
                  <tab.icon className="w-5 h-5" /> {tab.label}
                </div>
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 to-purple-600"></div>}
              </button>
            ))}
          </div>

          <div className="p-8">
            {activeTab === 'pacientes' && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Gerenciar Pacientes</h2>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-initial">
                      <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all w-full" />
                    </div>
                    <button onClick={() => setShowPacienteModal(true)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl transition-all shadow-lg font-semibold whitespace-nowrap">
                      <Plus className="w-5 h-5" /> Novo
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredPacientes.map((p) => (
                    <div key={p.id} className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-5 border border-violet-100 hover:shadow-lg transition-all group">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800 text-lg mb-2">{p.nome}</h3>
                          <p className="text-sm text-gray-600 mb-1 flex items-center gap-2"><span>📱</span>{p.telefone}</p>
                          <p className="text-xs text-gray-500">Cadastrado em {new Date(p.created_at).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${p.ativo ? 'bg-emerald-500 text-white' : 'bg-gray-400 text-white'} shadow-md`}>
                            {p.ativo ? '✓ Ativo' : 'Inativo'}
                          </span>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEditPaciente(p)} className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-md"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => handleDeletePaciente(p.id, p.nome)} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-md"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredPacientes.length === 0 && (
                  <div className="text-center py-16">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium">{searchTerm ? 'Nenhum paciente encontrado' : 'Nenhum paciente cadastrado'}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'recorrencias' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Horários Recorrentes</h2>
                  <button onClick={() => setShowRecorrenciaModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl transition-all shadow-lg font-semibold">
                    <Plus className="w-5 h-5" /> Nova Recorrência
                  </button>
                </div>

                <div className="space-y-4">
                  {recorrencias.map((rec) => (
                    <div key={rec.id} className="bg-gradient-to-r from-purple-50 to-fuchsia-50 rounded-xl p-6 border border-purple-100 hover:shadow-lg transition-all group">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800 text-lg mb-3">{getPacienteNome(rec.paciente_id)}</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div><p className="text-xs text-gray-500 uppercase mb-1">Dia</p><p className="text-sm font-semibold text-purple-600">📅 {diasSemana[rec.dia_semana]}</p></div>
                            <div><p className="text-xs text-gray-500 uppercase mb-1">Horário</p><p className="text-sm font-semibold text-purple-600">🕐 {rec.hora}</p></div>
                            <div><p className="text-xs text-gray-500 uppercase mb-1">Frequência</p><p className="text-sm font-semibold text-purple-600">
                              {rec.tipo === 'semanal' && '🔄 Semanal'}{rec.tipo === 'quinzenal' && '🔄 Quinzenal'}{rec.tipo === 'mensal' && '🔄 Mensal'}</p></div>
                            <div><p className="text-xs text-gray-500 uppercase mb-1">Próxima</p><p className="text-sm font-semibold text-purple-600">{new Date(rec.proxima_consulta).toLocaleDateString('pt-BR')}</p></div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${rec.ativo ? 'bg-emerald-500 text-white' : 'bg-gray-400 text-white'} shadow-md`}>
                            {rec.ativo ? '✓ Ativa' : 'Inativa'}
                          </span>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEditRecorrencia(rec)} className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-md">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteRecorrencia(rec.id, getPacienteNome(rec.paciente_id))} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-md">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {recorrencias.length === 0 && (
                  <div className="text-center py-16"><Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500 text-lg font-medium">Nenhuma recorrência</p></div>
                )}
              </div>
            )}

            {activeTab === 'consultas' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Consultas Agendadas</h2>
                <div className="space-y-4">
                  {consultas.sort((a, b) => new Date(b.data_hora).getTime() - new Date(a.data_hora).getTime()).map((c) => (
                    <div key={c.id} className="bg-white border-l-4 border-violet-500 rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg mb-2">{getPacienteNome(c.paciente_id)}</h3>
                          <p className="text-sm text-gray-600 font-medium mb-1">📅 {formatDate(c.data_hora)}</p>
                          <p className="text-xs text-gray-500">Criada em {new Date(c.created_at).toLocaleDateString('pt-BR')}</p>
                        </div>
                        {getStatusBadge(c.status)}
                      </div>
                    </div>
                  ))}
                </div>

                {consultas.length === 0 && (
                  <div className="text-center py-16"><Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500 text-lg font-medium">Nenhuma consulta</p></div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showPacienteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl transform animate-slideUp">
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-6 rounded-t-3xl">
              <h3 className="text-2xl font-bold text-white">{editingPaciente ? 'Editar Paciente' : 'Novo Paciente'}</h3>
              <p className="text-white/80 text-sm mt-1">{editingPaciente ? 'Atualize os dados do paciente' : 'Cadastre um novo paciente'}</p>
            </div>
            <form onSubmit={handleCreatePaciente} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nome Completo *</label>
                <input type="text" value={novoPaciente.nome} onChange={(e) => setNovoPaciente({ ...novoPaciente, nome: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all"
                  placeholder="Ex: Maria Silva" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Telefone *</label>
                <input type="text" value={novoPaciente.telefone} onChange={(e) => setNovoPaciente({ ...novoPaciente, telefone: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all"
                  placeholder="+5511999999999" required />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={handleCloseModal}
                  className="flex-1 px-5 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all">Cancelar</button>
                <button type="submit"
                  className="flex-1 px-5 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg">
                  {editingPaciente ? 'Atualizar' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showRecorrenciaModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl transform animate-slideUp">
            <div className="bg-gradient-to-r from-purple-600 to-fuchsia-600 p-6 rounded-t-3xl">
              <h3 className="text-2xl font-bold text-white">{editingRecorrencia ? 'Editar Recorrência' : 'Nova Recorrência'}</h3>
              <p className="text-white/80 text-sm mt-1">{editingRecorrencia ? 'Atualize os dados da recorrência' : 'Configure horários recorrentes'}</p>
            </div>
            <form onSubmit={handleCreateRecorrencia} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Paciente *</label>
                <select value={novaRecorrencia.paciente_id} onChange={(e) => setNovaRecorrencia({ ...novaRecorrencia, paciente_id: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all" required>
                  <option value="">Selecione</option>
                  {pacientes.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Dia *</label>
                  <select value={novaRecorrencia.dia_semana} onChange={(e) => setNovaRecorrencia({ ...novaRecorrencia, dia_semana: Number(e.target.value) })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all">
                    {diasSemana.map((dia, idx) => <option key={idx} value={idx}>{dia}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Horário *</label>
                  <input type="time" value={novaRecorrencia.hora} onChange={(e) => setNovaRecorrencia({ ...novaRecorrencia, hora: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Frequência *</label>
                <select value={novaRecorrencia.tipo} onChange={(e) => setNovaRecorrencia({ ...novaRecorrencia, tipo: e.target.value as any })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all">
                  <option value="semanal">📅 Semanal</option>
                  <option value="quinzenal">📆 Quinzenal</option>
                  <option value="mensal">🗓️ Mensal</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={handleCloseRecorrenciaModal}
                  className="flex-1 px-5 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all">Cancelar</button>
                <button type="submit"
                  className="flex-1 px-5 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-semibold rounded-xl transition-all shadow-lg">
                  {editingRecorrencia ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

