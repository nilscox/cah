import React from 'react';
import { connect } from 'react-redux';

import { toggleChoice } from '../../../../actions/game';
import ChoiceCard from '../../../common/ChoiceCard';

const all = arr => arr.indexOf(false) < 0;

const mapStateToProps = state => {
  const { game, player, selection } = state;

  return {
    choices: state.player.cards,
    isSelected: choice => selection.indexOf(choice) >= 0,
    canSelectChoice: all([
      game.state === 'started',
      game.question_master !== player.nick,
      !player.submitted,
      selection.length < game.question.nb_choices,
    ]),
  };
};

const mapDispatchToProps = dispatch => ({
  selectChoice: choiceId => dispatch(toggleChoice(choiceId)),
});

const PlayerCardsView = ({ choices, isSelected, canSelectChoice, selectChoice }) => (
  <div className="game-view" id="player-cards">

    <div className="cards-list">

      {choices && choices.map(choice => (
        <ChoiceCard
          key={choice.id}
          choice={choice}
          className={[
            isSelected(choice) && 'selected',
            canSelectChoice && 'can-select',
          ].toClassName()}
          onClick={() => (canSelectChoice || isSelected(choice)) && selectChoice(choice)}
        />
      ))}

    </div>

  </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(PlayerCardsView);
