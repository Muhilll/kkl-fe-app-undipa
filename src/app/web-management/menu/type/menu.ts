export interface Menu {
  id: number;
  name: string;
  path: string | null;
  permission_path: string | null;
  icon: string | null;
  parent_id: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateMenuInput {
  name: string;
  path?: string | null;
  permission_path?: string | null;
  icon?: string | null;
  parent_id?: number | null;
}

export interface UpdateMenuInput {
  name?: string;
  path?: string | null;
  permission_path?: string | null;
  icon?: string | null;
  parent_id?: number | null;
}

export interface MenuFormData {
  name: string;
  path: string;
  permission_path: string;
  icon: string;
  parent_id: string;
}
