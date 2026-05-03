import type { DataTableColumn } from "../../../../components/ui/DataTable";
import type { Menu } from "../type/menu";
import type { MenuTableProps } from "../type/menu-props";

const IconEdit = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const IconTrash = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const formatDate = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const createMenuColumns = (
  props: Pick<
    MenuTableProps,
    "menus" | "onEdit" | "onDelete" | "canUpdate" | "canDelete"
  >,
): DataTableColumn<Menu>[] => {
  const getParentLabel = (menu: Menu) => {
    if (menu.parent_id === null) return "Root";
    const parent = props.menus.find((item) => item.id === menu.parent_id);
    return parent?.name || menu.parent_id;
  };

  return [
    { header: "No", cell: (_, index) => <>{index + 1}</> },
    { header: "Name", cell: (menu) => <>{menu.name}</> },
    { header: "Path", cell: (menu) => <>{menu.path || "-"}</> },
    { header: "Permission Path", cell: (menu) => <>{menu.permission_path || "-"}</> },
    { header: "Icon", cell: (menu) => <>{menu.icon || "-"}</> },
    { header: "Parent", cell: (menu) => <>{getParentLabel(menu)}</> },
    { header: "Created At", cell: (menu) => <>{formatDate(menu.created_at)}</> },
    { header: "Updated At", cell: (menu) => <>{formatDate(menu.updated_at)}</> },
    {
      header: "Actions",
      headerStyle: { "text-align": "right" },
      cellClass: "td-actions",
      cell: (menu) => (
        <div class="action-btns">
          {props.canUpdate && (
            <button class="btn-icon btn-edit" title="Edit" onClick={() => props.onEdit(menu)}>
              <IconEdit />
            </button>
          )}
          {props.canDelete && (
            <button class="btn-icon btn-delete" title="Delete" onClick={() => props.onDelete(String(menu.id))}>
              <IconTrash />
            </button>
          )}
        </div>
      ),
    },
  ];
};
