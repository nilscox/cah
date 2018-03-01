// @flow

import * as React from 'react';
import { connect } from 'react-redux';

import type { Dispatch, Action } from 'Types/actions';
import type { State } from 'Types/state';
import type { ChoiceType } from 'Types/models';
import { toClassName } from '../../../../utils';
import { toggleChoice } from 'Actions/game';
import ChoiceCard from '../../../common/ChoiceCard';

const all = arr => arr.indexOf(false) < 0;

type PlayerCardsViewStateProps = {|
  choices: Array<ChoiceType>,
  isSelected: ChoiceType => boolean,
  canSelectChoice: boolean,
|};

type PlayerCardsViewDispatchProps = {|
  toggleChoice: ChoiceType => Action,
|};

type PlayerCardsViewProps =
  & PlayerCardsViewStateProps
  & PlayerCardsViewDispatchProps;

const mapStateToProps: State => PlayerCardsViewStateProps = ({
  game,
  player,
}) => ({
  choices: player.cards,
  isSelected: choice => player.selection.indexOf(choice) >= 0,
  canSelectChoice: all([
    game.state === 'started',
    game.question_master !== player.nick,
    !player.submitted,
    player.selection.length < game.question.nb_choices,
  ]),
});

const mapDispatchToProps: Dispatch => PlayerCardsViewDispatchProps = dispatch => ({
  toggleChoice: choice => dispatch(toggleChoice(choice)),
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
