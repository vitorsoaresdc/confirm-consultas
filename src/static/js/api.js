const API_URL = window.location.origin + '/api';

const api = {
  // Pacientes
  async getPacientes() {
    const response = await fetch(`${API_URL}/pacientes`);
    const data = await response.json();
    return data.data || [];
  },

  async createPaciente(paciente) {
    const response = await fetch(`${API_URL}/pacientes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paciente),
    });
    const data = await response.json();
    return data.data;
  },

  async updatePaciente(id, paciente) {
    const response = await fetch(`${API_URL}/pacientes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paciente),
    });
    const data = await response.json();
    return data.data;
  },

  async deletePaciente(id) {
    await fetch(`${API_URL}/pacientes/${id}`, {
      method: 'DELETE',
    });
  },

  // Recorrências
  async getRecorrencias() {
    const response = await fetch(`${API_URL}/recorrencias`);
    const data = await response.json();
    return data.data || [];
  },

  async createRecorrencia(recorrencia) {
    const response = await fetch(`${API_URL}/recorrencias`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recorrencia),
    });
    const data = await response.json();
    return data.data;
  },

  async updateRecorrencia(id, recorrencia) {
    const response = await fetch(`${API_URL}/recorrencias/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recorrencia),
    });
    const data = await response.json();
    return data.data;
  },

  async deleteRecorrencia(id) {
    await fetch(`${API_URL}/recorrencias/${id}`, {
      method: 'DELETE',
    });
  },

  // Consultas
  async getConsultas() {
    const response = await fetch(`${API_URL}/consultas`);
    const data = await response.json();
    return data.data || [];
  },

  async updateConsultaStatus(id, status) {
    const response = await fetch(`${API_URL}/consultas/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const data = await response.json();
    return data.data;
  },
};
