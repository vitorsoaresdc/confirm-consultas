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

export interface CreatePacienteDTO {
  nome: string;
  telefone: string;
}

export interface CreateRecorrenciaDTO {
  paciente_id: string;
  dia_semana: number;
  hora: string;
  tipo: 'semanal' | 'quinzenal' | 'mensal';
  proxima_consulta: string;
}

export interface WhatsAppMessage {
  instance_id: string;
  number: string;
  text: string;
}

export interface WhatsAppWebhook {
  from: string;
  body?: string;
  text?: string;
  message?: {
    conversation?: string;
    extendedTextMessage?: {
      text?: string;
    };
  };
}

