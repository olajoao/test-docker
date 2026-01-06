export interface WhoAmIUser {
  id: string;
  id_empresas: number;
  nome: string;
  ativo: number;
  avatar: string;
  callcenter_gestor_chat: number;
  department: {
    id: number;
    name: string;
  };
  wideChat?: boolean;
  isAdmin?: boolean;
  wideChatType?: string;
}
