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

type PlayerCardsViewState = {|
  lastCards: ChoiceType[],
  newCards: ChoiceType[],
|};

const mapStateToProps: State => PlayerCardsViewStateProps = ({
  game,
  player,
}) => ({
  choices: player.cards,
  isSelected: choice => Object.values(player.selection).indexOf(choice) >= 0,
  canSelectChoice: all([
    game.state === 'started',
    game.question_master !== player.nick,
    !player.submitted,
    Object.keys(player.selection).length < game.question.nb_choices,
  ]),
});

const mapDispatchToProps: Dispatch => PlayerCardsViewDispatchProps = dispatch => ({
  toggleChoice: choice => dispatch(toggleChoice(choice)),
});

class PlayerCardsView extends React.Component<PlayerCardsViewProps, PlayerCardsViewState> {
  constructor(props) {
    super(props);

    this.state = {
      lastCards: props.choices,
      newCards: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.choices.length === nextProps.choices.length)
      return;

    const { choices } = nextProps;
    const { lastCards } = this.state;

    const newCards = choices.filter(choice => !lastCards.find(last => last.id === choice.id));

    this.setState({
      lastCards: choices,
      newCards,
    });
  }

  onCardClicked = choice => {
    const { isSelected, canSelectChoice, toggleChoice } = this.props;

    if (canSelectChoice || isSelected(choice))
      toggleChoice(choice);
  };

  render() {
    const { choices, isSelected, canSelectChoice } = this.props;
    const { newCards } = this.state;

    const isCardNew = card => newCards.find(c => card.id === c.id);

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
                isCardNew(choice) && 'new-card',
              ])}
              onClick={() => this.onCardClicked(choice)}
            />
          ))}

        </div>

      </div>
    );
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayerCardsView);
