// @flow

import React from 'react';
import { connect } from 'react-redux';

import type { ChoiceType } from '../../../../types/models';
import type {State} from '../../../../types/state';
import { toClassName } from '../../../../utils';
import { toggleChoice } from '../../../../actions/game';
import ChoiceCard from '../../../common/ChoiceCard';

const all = arr => arr.indexOf(false) < 0;

type PlayerCardsViewStateProps = {
  choices: Array<ChoiceType>,
  isSelected: ChoiceType => boolean,
  canSelectChoice: boolean,
};

type PlayerCardsViewDispatchProps = {
  toggleChoice: ChoiceType => void,
};

type PlayerCardsViewProps =
  & PlayerCardsViewStateProps
  & PlayerCardsViewDispatchProps;

const mapStateToProps = ({ game, player, selection }: State) => ({
  choices: player.cards,
  isSelected: choice => selection.indexOf(choice) >= 0,
  canSelectChoice: all([
    game.state === 'started',
    game.question_master !== player.nick,
    !player.submitted,
    selection.length < game.question.nb_choices,
  ]),
});

const mapDispatchToProps = dispatch => ({
  toggleChoice: choice => dispatch(toggleChoice(choice.id)),
});

const PlayerCardsView = ({
  choices,
  isSelected,
  canSelectChoice,
  toggleChoice,
}: PlayerCardsViewProps) => {
  const onCardClicked = choice => {
    if (canSelectChoice || isSelected(choice))
      toggleChoice(choice);
  }

  return (
    <div className="game-view" id="player-cards">

      <div className="cards-list">

        {choices && choices.map(choice => (
          <ChoiceCard
            key={choice.id}
            choice={choice}
            className={toClassName([
              isSelected(choice) && 'selected',
              canSelectChoice && 'can-select',
            ])}
            onClick={() => onCardClicked(choice)}
          />
        ))}

      </div>

    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayerCardsView);
