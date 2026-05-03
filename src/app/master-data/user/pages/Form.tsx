import { Component } from "solid-js";
import LookupSelect from "../../../../components/ui/LookupSelect";
import { useUserForm } from "../hook/useUserForm";
import { useUserOptions } from "../hook/useUserOptions";
import type { UserFormProps } from "../type/user-props";

const UserForm: Component<UserFormProps> = (props) => {
  const isEditMode = () => !!props.initialData;
  const { formData, handleChange } = useUserForm({
    initialData: () => props.initialData,
  });
  const { roles, isOptionsLoading } = useUserOptions();

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onSubmit(formData());
  };

  return (
    <form onSubmit={handleSubmit} class="user-form">
      <div class="form-group">
        <label for="username">Username</label>
        <input
          id="username"
          type="text"
          value={formData().username}
          onChange={(e) => handleChange("username", e.target.value)}
          placeholder="Username"
          required
          disabled={props.isLoading}
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          type="password"
          value={formData().password}
          onChange={(e) => handleChange("password", e.target.value)}
          placeholder={isEditMode() ? "Leave blank if unchanged" : "********"}
          required={!isEditMode()}
          disabled={props.isLoading}
        />
      </div>

      <LookupSelect
        id="role_id"
        label="Role"
        value={String(formData().role_id)}
        options={roles()}
        placeholder="Select role"
        required
        disabled={props.isLoading || isOptionsLoading()}
        getValue={(role) => String(role.id)}
        getLabel={(role) => `${role.name} (${role.code})`}
        onChange={(value) => handleChange("role_id", value)}
      />

      <div class="form-group" style={{ display: "flex", "align-items": "center", gap: "8px", "margin-top": "16px" }}>
        <input
          id="is_active"
          type="checkbox"
          checked={formData().is_active}
          onChange={(e) => handleChange("is_active", e.target.checked)}
          disabled={props.isLoading}
        />
        <label for="is_active" style={{ margin: 0 }}>Is Active</label>
      </div>

      <button type="submit" class="btn-submit" disabled={props.isLoading}>
        {props.isLoading ? "Loading..." : props.initialData ? "Update User" : "Add User"}
      </button>
    </form>
  );
};

export default UserForm;
