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
        <label for="name">Name</label>
        <input
          id="name"
          type="text"
          value={formData().name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Full name"
          required
          disabled={props.isLoading}
        />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          value={formData().email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="user@example.com"
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
        label="Role ID"
        value={String(formData().role_id)}
        options={roles()}
        placeholder="Select role"
        required
        disabled={props.isLoading || isOptionsLoading()}
        getValue={(role) => String(role.id)}
        getLabel={(role) => `${role.name} (${role.code})`}
        onChange={(value) => handleChange("role_id", value)}
      />

      <button type="submit" class="btn-submit" disabled={props.isLoading}>
        {props.isLoading ? "Loading..." : props.initialData ? "Update User" : "Add User"}
      </button>
    </form>
  );
};

export default UserForm;
