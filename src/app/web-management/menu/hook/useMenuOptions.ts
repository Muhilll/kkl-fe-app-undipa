import { createSignal, onMount } from "solid-js";
import { menuAPI } from "../service/menu.api";
import type { Menu } from "../type/menu";

export const useMenuOptions = () => {
  const [menus, setMenus] = createSignal<Menu[]>([]);
  const [isOptionsLoading, setIsOptionsLoading] = createSignal(false);

  const loadMenus = async () => {
    setIsOptionsLoading(true);
    try {
      const result = await menuAPI.getAll();
      if (result.success && result.data) {
        setMenus(result.data);
      }
    } finally {
      setIsOptionsLoading(false);
    }
  };

  onMount(loadMenus);

  return {
    menus,
    isOptionsLoading,
  };
};
