import { QuestionChunk } from '@cah/store';
import clsx from 'clsx';
import { For } from 'solid-js';

type QuestionCardProps = {
  class?: string;
  chunks: QuestionChunk[];
};

export function QuestionCard(props: QuestionCardProps) {
  return (
    <div class={props.class}>
      <For each={props.chunks}>
        {(chunk) =>
          chunk.text ? <span class={clsx(chunk.isBlank && 'underline')}>{chunk.text}</span> : <Blank />
        }
      </For>
    </div>
  );
}

function Blank() {
  return <span class="inline-block w-[3rem] border-b border-[#fff] leading-1">&nbsp;</span>;
}
