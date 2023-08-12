import { QuestionChunk } from '@cah/store';
import clsx from 'clsx';
import { For } from 'solid-js';

type QuestionCardProps = {
  chunks: QuestionChunk[];
  onClick: () => void;
};

export function QuestionCard(props: QuestionCardProps) {
  return (
    <div role="button" class="col min-h-[16rem] justify-center" onClick={() => props.onClick()}>
      <div class="text-large">
        <For each={props.chunks}>
          {(chunk) =>
            chunk.text ? <span class={clsx(chunk.isBlank && 'underline')}>{chunk.text}</span> : <Blank />
          }
        </For>
      </div>
    </div>
  );
}

function Blank() {
  return <span class="inline-block w-[3rem] border-b border-[#fff]" />;
}
