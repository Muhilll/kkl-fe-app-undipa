import { createEffect, createSignal } from "solid-js";
import type {
  RolePermission,
  RolePermissionFormData,
} from "../type/role-permission";

interface UseRolePermissionFormParams {
  initialData: () => RolePermission | undefined;
}

export const useRolePermissionForm = (params: UseRolePermissionFormParams) => {
  const [formData, setFormData] = createSignal<RolePermissionFormData>({
    role_id: params.initialData()?.role_id ? String(params.initialData()!.role_id) : "",
    menu_id: params.initialData()?.menu_id ? String(params.initialData()!.menu_id) : "",
    can_read: params.initialData()?.can_read ?? false,
    can_create: params.initialData()?.can_create ?? false,
    can_update: params.initialData()?.can_update ?? false,
    can_delete: params.initialData()?.can_delete ?? false,
    can_report: params.initialData()?.can_report ?? false,
  });

  createEffect(() => {
    const item = params.initialData();
    setFormData({
      role_id: item?.role_id ? String(item.role_id) : "",
      menu_id: item?.menu_id ? String(item.menu_id) : "",
      can_read: item?.can_read ?? false,
      can_create: item?.can_create ?? false,
      can_update: item?.can_update ?? false,
      can_delete: item?.can_delete ?? false,
      can_report: item?.can_report ?? false,
    });
  });

  const handleChange = (
    field: keyof RolePermissionFormData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    handleChange,
  };
};
