import clsx from 'clsx';
import { JSX } from 'solid-js';

type ViewProps = {
  header?: JSX.Element;
  footer?: JSX.Element;
  class?: string;
  children?: JSX.Element;
};

export function View(props: ViewProps) {
  return (
    <div class="col h-screen overflow-hidden">
      {props.header}
      <div class={clsx('col flex-1 p-4', props.class)}>{props.children}</div>
      {props.footer}
    </div>
  );
}
