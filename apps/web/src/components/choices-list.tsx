import { ChoicesSlice, selectCanSelectChoice } from '@cah/store';
import clsx from 'clsx';
import { For } from 'solid-js';

import { selector } from '../selector';

type ChoicesListProps = {
  choices: Array<ChoicesSlice>;
  selectedChoices: Array<ChoicesSlice | null>;
  onSelected: (choices: ChoicesSlice) => void;
};

export function ChoicesList(props: ChoicesListProps) {
  const canSelect = selector(selectCanSelectChoice);

  return (
    <div class="col flex-1 overflow-auto bg-white text-dark">
      <div class="col flex-1 justify-evenly">
        <For each={props.choices}>
          {(choice, index) => (
            <>
              <Card
                choice={choice}
                isSelected={props.selectedChoices.includes(choice)}
                onClick={canSelect() ? () => props.onSelected(choice) : undefined}
              />
              {index() < props.choices.length - 1 && <hr />}
            </>
          )}
        </For>
      </div>
    </div>
  );
}

type CardProps = {
  choice: ChoicesSlice;
  isSelected: boolean;
  onClick?: () => void;
};

function Card(props: CardProps) {
  return (
    <div
      role="button"
      class={clsx('px-4 py-2', props.isSelected && 'font-bold')}
      onClick={() => props.onClick?.()}
    >
      {props.choice.text}
    </div>
  );
}
