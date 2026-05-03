import { createSignal, onMount } from "solid-js";
import { lookupAPI } from "../../../../services/lookups";
import { Role } from "../../role/type/role";

export const useUserOptions = () => {
  const [roles, setRoles] = createSignal<Role[]>([]);
  const [isOptionsLoading, setIsOptionsLoading] = createSignal(false);

  const loadOptions = async () => {
    setIsOptionsLoading(true);

    try {
      const [rolesResult] = await Promise.all([
        lookupAPI.getRoles(),
      ]);

      if (rolesResult.success && rolesResult.data) {
        setRoles(rolesResult.data);
      }
    } finally {
      setIsOptionsLoading(false);
    }
  };

  onMount(loadOptions);

  return {
    roles,
    isOptionsLoading,
  };
};
