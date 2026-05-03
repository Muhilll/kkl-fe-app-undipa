import { createEffect, createSignal } from "solid-js";
import type { User, UserFormData } from "../type/user";

interface UseUserFormParams {
  initialData: () => User | undefined;
}

export const useUserForm = (params: UseUserFormParams) => {
  const [formData, setFormData] = createSignal<UserFormData>({
    username: params.initialData()?.username || "",
    password: "",
    is_active: params.initialData()?.is_active ?? true,
    role_id: params.initialData()?.role_id
      ? String(params.initialData()!.role_id)
      : "",
  });

  createEffect(() => {
    const user = params.initialData();

    setFormData({
      username: user?.username || "",
      password: "",
      is_active: user?.is_active ?? true,
      role_id: user?.role_id ? String(user.role_id) : "",
    });
  });

  const handleChange = (field: keyof UserFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value as never }));
  };

  return {
    formData,
    handleChange,
  };
};
