import { useLocation } from "@solidjs/router";
import { createMemo } from "solid-js";
import {
  findMatchingNavigationItem,
  getNavigationFromStorage,
} from "../components/layout/navigation";

export const usePagePermissions = () => {
  const location = useLocation();

  const currentItem = createMemo(() =>
    findMatchingNavigationItem(location.pathname, getNavigationFromStorage()),
  );

  const permissions = createMemo(() => currentItem()?.permissions);

  return {
    canRead: createMemo(() => !!permissions()?.can_read),
    canCreate: createMemo(() => !!permissions()?.can_create),
    canUpdate: createMemo(() => !!permissions()?.can_update),
    canDelete: createMemo(() => !!permissions()?.can_delete),
    canReport: createMemo(() => !!permissions()?.can_report),
  };
};
