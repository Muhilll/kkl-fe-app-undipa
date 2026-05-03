export interface Role {
  id: number;
  code: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateRoleInput {
  code: string;
  name: string;
}

export interface UpdateRoleInput {
  code?: string;
  name?: string;
}

export interface RoleFormData {
  code: string;
  name: string;
}
