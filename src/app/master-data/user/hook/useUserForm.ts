import { createEffect, createSignal } from "solid-js";
import type { User, UserFormData } from "../type/user";

interface UseUserFormParams {
  initialData: () => User | undefined;
}

export const useUserForm = (params: UseUserFormParams) => {
  const [formData, setFormData] = createSignal<UserFormData>({
    email: params.initialData()?.email || "",
    password: "",
    name: params.initialData()?.name || "",
    role_id: params.initialData()?.role_id
      ? String(params.initialData()!.role_id)
      : "",
  });

  createEffect(() => {
    const user = params.initialData();

    setFormData({
      email: user?.email || "",
      password: "",
      name: user?.name || "",
      role_id: user?.role_id ? String(user.role_id) : "",
    });
  });

  const handleChange = (field: keyof UserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    handleChange,
  };
};
