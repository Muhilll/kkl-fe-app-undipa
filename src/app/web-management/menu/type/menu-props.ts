import type { Menu, MenuFormData } from "./menu";

export interface MenuTableProps {
  menus: Menu[];
  isLoading: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  onEdit: (menu: Menu) => void;
  onDelete: (id: string) => void;
}

export interface MenuFormProps {
  initialData?: Menu;
  onSubmit: (data: MenuFormData) => void;
  isLoading?: boolean;
}
