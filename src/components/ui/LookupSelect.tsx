import { Component, For } from "solid-js";

interface LookupSelectProps<T> {
  id: string;
  label: string;
  value: string;
  options: T[];
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
  getValue: (option: T) => string;
  getLabel: (option: T) => string;
  onChange: (value: string) => void;
}

function LookupSelect<T>(props: LookupSelectProps<T>) {
  return (
    <div class="form-group">
      <label for={props.id}>{props.label}</label>
      <select
        id={props.id}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        required={props.required}
        disabled={props.disabled}
      >
        <option value="">{props.placeholder}</option>
        <For each={props.options}>
          {(option) => (
            <option
              value={props.getValue(option)}
              selected={props.value === props.getValue(option)}
            >
              {props.getLabel(option)}
            </option>
          )}
        </For>
      </select>
    </div>
  );
}

export default LookupSelect;
