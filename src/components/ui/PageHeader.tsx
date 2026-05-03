import { Component, JSX, Show } from "solid-js";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: JSX.Element;
}

const PageHeader: Component<PageHeaderProps> = (props) => {
  return (
    <div class="page-header">
      <div class="page-header-left">
        <h1>{props.title}</h1>
        <Show when={props.description}>
          <p>{props.description}</p>
        </Show>
      </div>

      <Show when={props.action}>
        {props.action}
      </Show>
    </div>
  );
};

export default PageHeader;
