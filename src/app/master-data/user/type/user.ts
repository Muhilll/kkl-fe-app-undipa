import { Role } from "../../role/type/role";

export interface User {
  id: number;
  email: string;
  name: string;
  role_id: number;
  created_at: string;
  updated_at: string;
  role?: Role | null;
}

export interface CreateUserInput {
  email: string;
  password?: string;
  name: string;
  role_id: number;
}

export interface UpdateUserInput {
  email?: string;
  password?: string;
  name?: string;
  role_id?: number;
}

export interface UserFormData {
  email: string;
  password?: string;
  name: string;
  role_id: string;
}
