import { Component } from "solid-js";
import LookupSelect from "../../../../components/ui/LookupSelect";
import { useMenuForm } from "../hook/useMenuForm";
import { useMenuOptions } from "../hook/useMenuOptions";
import type { MenuFormProps } from "../type/menu-props";

const MenuForm: Component<MenuFormProps> = (props) => {
  const { formData, handleChange } = useMenuForm({
    initialData: () => props.initialData,
  });
  const { menus, isOptionsLoading } = useMenuOptions();

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onSubmit(formData());
  };

  const parentOptions = () =>
    menus().filter((menu) => menu.id !== props.initialData?.id);

  return (
    <form onSubmit={handleSubmit} class="user-form">
      <div class="form-group">
        <label for="name">Name</label>
        <input
          id="name"
          type="text"
          value={formData().name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Dashboard"
          required
          disabled={props.isLoading}
        />
      </div>

      <div class="form-group">
        <label for="path">Path</label>
        <input
          id="path"
          type="text"
          value={formData().path}
          onChange={(e) => handleChange("path", e.target.value)}
          placeholder="/dashboard"
          disabled={props.isLoading}
        />
      </div>

      <div class="form-group">
        <label for="permission_path">Permission Path</label>
        <input
          id="permission_path"
          type="text"
          value={formData().permission_path}
          onChange={(e) => handleChange("permission_path", e.target.value)}
          placeholder="/dashboard"
          disabled={props.isLoading}
        />
      </div>

      <div class="form-group">
        <label for="icon">Icon</label>
        <input
          id="icon"
          type="text"
          value={formData().icon}
          onChange={(e) => handleChange("icon", e.target.value)}
          placeholder="home"
          disabled={props.isLoading}
        />
      </div>

      <LookupSelect
        id="parent_id"
        label="Parent Menu"
        value={formData().parent_id}
        options={parentOptions()}
        placeholder="Select parent menu"
        disabled={props.isLoading || isOptionsLoading()}
        getValue={(menu) => String(menu.id)}
        getLabel={(menu) => menu.name}
        onChange={(value) => handleChange("parent_id", value)}
      />

      <button type="submit" class="btn-submit" disabled={props.isLoading}>
        {props.isLoading ? "Loading..." : props.initialData ? "Update Menu" : "Add Menu"}
      </button>
    </form>
  );
};

export default MenuForm;
