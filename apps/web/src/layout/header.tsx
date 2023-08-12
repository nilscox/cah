import { JSX } from 'solid-js';

type HeaderProps = {
  children: JSX.Element;
};

export function Header(props: HeaderProps) {
  return (
    <div class="row items-center border-b p-4">
      <div>
        <h1 class="text-large font-bold">Cards Against Humanity</h1>
        <h2 class="text-sm text-dim">{props.children}</h2>
      </div>
    </div>
  );
}
