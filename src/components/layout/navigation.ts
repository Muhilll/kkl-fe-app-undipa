import { api } from "../../services/api";

export interface NavigationPermissions {
  can_read: boolean;
  can_create: boolean;
  can_update: boolean;
  can_delete: boolean;
  can_report: boolean;
}

export interface NavigationItem {
  id: number;
  name: string;
  path: string;
  icon: string;
  parent_id: number | null;
  permissions: NavigationPermissions;
  children: NavigationItem[];
}

const NAVIGATION_STORAGE_KEY = "myNavigation";

export const navigationAPI = {
  getMyNavigation: () => api.get<NavigationItem[]>("/users/me/navigation"),
};

export const filterReadableMenus = (items: NavigationItem[]): NavigationItem[] =>
  items
    .filter((item) => item.permissions?.can_read)
    .map((item) => ({
      ...item,
      children: filterReadableMenus(item.children || []),
    }));

export const flattenNavigationPaths = (items: NavigationItem[]): string[] =>
  items.flatMap((item) => [
    ...(item.path ? [item.path] : []),
    ...flattenNavigationPaths(item.children || []),
  ]);

export const findMatchingNavigationItem = (
  pathname: string,
  items: NavigationItem[],
): NavigationItem | null => {
  const normalizedPathname = pathname.replace(/\/+$/, "") || "/";
  const matches = items.flatMap((item) => {
    const normalizedPath = item.path?.replace(/\/+$/, "") || "";
    const isMatch =
      normalizedPath &&
      (normalizedPathname === normalizedPath ||
        normalizedPathname.startsWith(`${normalizedPath}/`));

    return [
      ...(isMatch ? [{ item, score: normalizedPath.length }] : []),
      ...findMatchingNavigationItemsInChildren(normalizedPathname, item.children || []),
    ];
  });

  if (matches.length === 0) return null;

  return matches.sort((left, right) => right.score - left.score)[0].item;
};

const findMatchingNavigationItemsInChildren = (
  pathname: string,
  items: NavigationItem[],
): Array<{ item: NavigationItem; score: number }> =>
  items.flatMap((item) => {
    const normalizedPath = item.path?.replace(/\/+$/, "") || "";
    const isMatch =
      normalizedPath &&
      (pathname === normalizedPath || pathname.startsWith(`${normalizedPath}/`));

    return [
      ...(isMatch ? [{ item, score: normalizedPath.length }] : []),
      ...findMatchingNavigationItemsInChildren(pathname, item.children || []),
    ];
  });

export const hasReadablePathAccess = (
  pathname: string,
  items: NavigationItem[],
) => {
  const matchedItem = findMatchingNavigationItem(pathname, items);
  return !!matchedItem?.permissions?.can_read;
};

export const saveNavigationToStorage = (items: NavigationItem[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(NAVIGATION_STORAGE_KEY, JSON.stringify(items));
};

export const getNavigationFromStorage = (): NavigationItem[] => {
  if (typeof window === "undefined") return [];

  const raw = localStorage.getItem(NAVIGATION_STORAGE_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as NavigationItem[];
  } catch {
    return [];
  }
};

export const clearNavigationStorage = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(NAVIGATION_STORAGE_KEY);
};
