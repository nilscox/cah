import React, {Component} from 'react';
import QuestionView from './components/QuestionView';
import ChoicesView from './components/ChoicesView';
import './Game.css';
import GameIdle from './GameIdle';
import {
  start as startGame,
  answer as submitChoices
} from '../../../services/game';

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      game: props.game,
      selectedChoices: [],
      answeredQuestion: props.player.submitted,
    };

    this.onError = props.onError;
  }

  onStart() {
    startGame()
      .then(game => this.setState({ game }))
      .catch(this.onError);
  }

  onChoiceSelected(selected) {
    this.setState({
      selectedChoices: selected,
    });
  }

  onSubmit() {
    const selection = this.state.selectedChoices;

    submitChoices(selection.map(choice => choice.id))
      .then(answeredQuestion => this.setState({
        answeredQuestion,
      }))
      .catch(this.onError);
  }

  render() {
    const { player } = this.props;
    const { game, selectedChoices, answeredQuestion } = this.state;
    const choices = answeredQuestion ? answeredQuestion.answers : selectedChoices;

    if (game.state === 'idle')
      return <GameIdle player={player} game={game} onStart={() => this.onStart()} />;

    return (
      <div id="page-game" className="page">
        <QuestionView
          questionMaster={game.question_master}
          question={game.question}
          choices={choices}
          onSubmit={() => this.onSubmit()}
          disabled={!!answeredQuestion}
        />
        <ChoicesView
          choices={player.cards}
          canSelect={!answeredQuestion && player.nick !== game.question_master}
          maxSelection={game.question.nb_choices}
          onChoiceSelected={choice => this.onChoiceSelected(choice)}
        />
     </div>
    );
  }
}

export default Game;
