import React from 'react';
import { connect } from 'react-redux';
import ChoiceCard from '../../../common/ChoiceCard';
import { toggleChoice } from '../../../../actions/game';

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

const ChoicesView = ({ choices, isSelected, canSelectChoice, selectChoice }) => (
  <div className="choices-view">
    <div className="choices-list">
      {choices && choices.map(choice => (
        <ChoiceCard
          key={choice.id}
          choice={choice}
          selected={isSelected(choice)}
          canSelect={canSelectChoice || isSelected(choice)}
          onSelect={() => selectChoice(choice)}
        />
      ))}
    </div>
  </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(ChoicesView);
