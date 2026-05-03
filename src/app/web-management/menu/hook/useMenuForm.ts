import { createEffect, createSignal } from "solid-js";
import type { Menu, MenuFormData } from "../type/menu";

interface UseMenuFormParams {
  initialData: () => Menu | undefined;
}

export const useMenuForm = (params: UseMenuFormParams) => {
  const [formData, setFormData] = createSignal<MenuFormData>({
    name: params.initialData()?.name || "",
    path: params.initialData()?.path || "",
    permission_path: params.initialData()?.permission_path || "",
    icon: params.initialData()?.icon || "",
    parent_id: params.initialData()?.parent_id ? String(params.initialData()!.parent_id) : "",
  });

  createEffect(() => {
    const menu = params.initialData();
    setFormData({
      name: menu?.name || "",
      path: menu?.path || "",
      permission_path: menu?.permission_path || "",
      icon: menu?.icon || "",
      parent_id: menu?.parent_id ? String(menu.parent_id) : "",
    });
  });

  const handleChange = (field: keyof MenuFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    handleChange,
  };
};
