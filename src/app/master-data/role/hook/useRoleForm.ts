import { createEffect, createSignal } from "solid-js";
import type { Role, RoleFormData } from "../type/role";

interface UseRoleFormParams {
  initialData: () => Role | undefined;
}

export const useRoleForm = (params: UseRoleFormParams) => {
  const [formData, setFormData] = createSignal<RoleFormData>({
    code: params.initialData()?.code || "",
    name: params.initialData()?.name || "",
  });

  createEffect(() => {
    const role = params.initialData();
    setFormData({
      code: role?.code || "",
      name: role?.name || "",
    });
  });

  const handleChange = (field: keyof RoleFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    handleChange,
  };
};
