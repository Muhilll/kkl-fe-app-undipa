import type { Accessor } from "solid-js";
import type { User, UserFormData } from "./user";

export interface UserTableProps {
  users: User[];
  isLoading: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

export interface UserFormProps {
  initialData?: User;
  onSubmit: (data: UserFormData) => void;
  isLoading?: boolean;
}

export interface UserManagementState {
  users: Accessor<User[]>;
  isLoading: Accessor<boolean>;
  error: Accessor<string | null>;
  editingUser: Accessor<User | null>;
  showForm: Accessor<boolean>;
  deletingUserId: Accessor<string | null>;
}
