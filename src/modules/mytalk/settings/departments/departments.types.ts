interface DepartmentUserProps {
  user_id: string;
  name: string;
  login: string;
  ativo: number;
  avatar: string;
}

export interface DepartmentProps {
  id: number;
  name: string;
  description: string;
  leader_id: number;
  date: Date;
  id_empresa: number;
  users: DepartmentUserProps[];
}
