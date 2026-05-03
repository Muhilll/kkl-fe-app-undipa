import { Role } from "../../role/type/role";

export interface User {
  id: number;
  username: string;
  is_active: boolean;
  role_id: number;
  created_at: string;
  updated_at: string;
  role?: Role | null;
}

export interface CreateUserInput {
  username: string;
  password?: string;
  is_active?: boolean;
  role_id: number;
}

export interface UpdateUserInput {
  username?: string;
  password?: string;
  is_active?: boolean;
  role_id?: number;
}

export interface UserFormData {
  username: string;
  password?: string;
  is_active: boolean;
  role_id: string;
}
