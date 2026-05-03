import { For, createEffect, createSignal, type Component } from "solid-js";
import type { RolePermissionFormProps } from "../type/role-permission-props";
import type { RolePermissionMatrixItem } from "../type/role-permission";

const RolePermissionForm: Component<RolePermissionFormProps> = (props) => {
  const [items, setItems] = createSignal<RolePermissionMatrixItem[]>(props.items);

  createEffect(() => {
    setItems(props.items);
  });

  const handleToggle = (
    menuId: number,
    field: "can_read" | "can_create" | "can_update" | "can_delete" | "can_report",
    checked: boolean,
  ) => {
    setItems((current) =>
      current.map((item) =>
        item.menu_id === menuId
          ? {
              ...item,
              [field]: checked,
            }
          : item,
      ),
    );
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onSubmit(items());
  };

  return (
    <form onSubmit={handleSubmit} class="user-form role-permission-form">
      <div class="form-group role-permission-role">
        <label>Role</label>
        <input
          type="text"
          value={props.role ? `${props.role.name} (${props.role.code})` : "-"}
          disabled
        />
      </div>

      <div class="app-table-card role-permission-matrix">
        <div class="app-table-scroll">
          <table class="app-table">
            <thead>
              <tr>
                <th>Menu</th>
                <th>Can Read</th>
                <th>Can Create</th>
                <th>Can Update</th>
                <th>Can Delete</th>
                <th>Can Report</th>
              </tr>
            </thead>
            <tbody>
              <For each={items()}>
                {(item) => (
                  <tr>
                    <td>{item.menu_name}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={item.can_read}
                        onChange={(e) =>
                          handleToggle(item.menu_id, "can_read", e.currentTarget.checked)}
                        disabled={props.isLoading}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={item.can_create}
                        onChange={(e) =>
                          handleToggle(item.menu_id, "can_create", e.currentTarget.checked)}
                        disabled={props.isLoading}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={item.can_update}
                        onChange={(e) =>
                          handleToggle(item.menu_id, "can_update", e.currentTarget.checked)}
                        disabled={props.isLoading}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={item.can_delete}
                        onChange={(e) =>
                          handleToggle(item.menu_id, "can_delete", e.currentTarget.checked)}
                        disabled={props.isLoading}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={item.can_report}
                        onChange={(e) =>
                          handleToggle(item.menu_id, "can_report", e.currentTarget.checked)}
                        disabled={props.isLoading}
                      />
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </div>

      <button
        type="submit"
        class="btn-submit role-permission-submit"
        disabled={props.isLoading}
      >
        {props.isLoading ? "Saving..." : "Save Permissions"}
      </button>
    </form>
  );
};

export default RolePermissionForm;
