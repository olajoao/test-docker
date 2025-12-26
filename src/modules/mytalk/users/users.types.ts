export interface User {
  id: string;
  name: string;
  login: string;
  ativo: number;
  avatar: string;
}

export interface UserApiProps {
  id: string;
  user_id: number;
  channel_id: number;
  department_id: number;
  date: Date;
  id_empresa: number;
  is_admin: number;
  webUser: User;
}

export interface WebUserApiProps {
  id: string;
  id_empresas: number;
  nome: string;
  login: string;
  senha: string;
  ativo: number;
  avatar: string;
  callcenter_gestor_chat: number;
}
