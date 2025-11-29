import axios from 'axios';

const API_URL = 'http://localhost:3000';

export interface Paciente {
  id: string;
  nome: string;
  telefone: string;
  ativo: boolean;
  created_at: string;
}

export interface Recorrencia {
  id: string;
  paciente_id: string;
  dia_semana: number;
  hora: string;
  tipo: 'semanal' | 'quinzenal' | 'mensal';
  proxima_consulta: string;
  ativo: boolean;
  created_at: string;
}

export interface Consulta {
  id: string;
  paciente_id: string;
  data_hora: string;
  status: 'pendente' | 'enviada' | 'confirmada' | 'cancelada';
  created_at: string;
}

export const getPacientes = async (): Promise<Paciente[]> => {
  const response = await axios.get(`${API_URL}/pacientes`);
  return response.data.data;
};

export const createPaciente = async (data: { nome: string; telefone: string }): Promise<Paciente> => {
  const response = await axios.post(`${API_URL}/pacientes`, data);
  return response.data.data;
};

export const updatePaciente = async (id: string, data: { nome: string; telefone: string }): Promise<Paciente> => {
  const response = await axios.put(`${API_URL}/pacientes/${id}`, data);
  return response.data.data;
};

export const deletePaciente = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/pacientes/${id}`);
};

export const getRecorrencias = async (): Promise<Recorrencia[]> => {
  const response = await axios.get(`${API_URL}/recorrencias`);
  return response.data.data;
};

export const createRecorrencia = async (data: {
  paciente_id: string;
  dia_semana: number;
  hora: string;
  tipo: 'semanal' | 'quinzenal' | 'mensal';
  proxima_consulta: string;
}): Promise<Recorrencia> => {
  const response = await axios.post(`${API_URL}/recorrencias`, data);
  return response.data.data;
};

export const updateRecorrencia = async (id: string, data: {
  paciente_id: string;
  dia_semana: number;
  hora: string;
  tipo: 'semanal' | 'quinzenal' | 'mensal';
  proxima_consulta: string;
}): Promise<Recorrencia> => {
  const response = await axios.put(`${API_URL}/recorrencias/${id}`, data);
  return response.data.data;
};

export const deleteRecorrencia = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/recorrencias/${id}`);
};

export const getConsultas = async (): Promise<Consulta[]> => {
  const response = await axios.get(`${API_URL}/consultas`);
  return response.data.data;
};

export const updateConsultaStatus = async (
  id: string,
  status: 'pendente' | 'enviada' | 'confirmada' | 'cancelada'
): Promise<Consulta> => {
  const response = await axios.patch(`${API_URL}/consultas/${id}/status`, { status });
  return response.data.data;
};
