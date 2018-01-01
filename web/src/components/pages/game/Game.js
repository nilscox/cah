import React, {Component} from 'react';
import QuestionView from './components/QuestionView';
import ChoicesView from './components/ChoicesView';
import './Game.css';
import GameIdle from './GameIdle';
import {
  start as startGame,
  answer as submitChoices,
  select as selectAnswer,
} from '../../../services/game';
import AnswerSelectionView from "./components/AnswerSelectionView";

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      game: props.game || null,
      selectedChoices: [],
      answeredQuestion: null,
    };

    if (props.player && props.player.submitted)
      this.state.answeredQuestion = props.player.submitted;

    this.onError = props.onError;
  }

  componentWillReceiveProps(nextProps) {
    const nextState = {};

    if (nextProps.game)
      nextState.game = nextProps.game;
    if (nextProps.player && nextProps.player.submitted)
      nextState.answeredQuestion = nextProps.player.submitted;

    this.setState(nextState);
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

  onSelect(id) {
    selectAnswer(id)
      .then(() => this.setState({
        selectedChoices: [],
        answeredQuestion: null,
      }))
      .then(this.props.reload)
      .catch(this.onError);
  }

  render() {
    const { player } = this.props;
    const { game, selectedChoices, answeredQuestion } = this.state;
    const choices = answeredQuestion ? answeredQuestion.answers : selectedChoices;

    if (game.state === 'idle')
      return <GameIdle player={player} game={game} onStart={() => this.onStart()} />;

    let content = null;
    if (game.propositions.length > 0) {
      content = <AnswerSelectionView
        question={game.question}
        answers={game.propositions}
        canSelect={game.question_master === player.nick}
        onSelect={(id) => this.onSelect(id)}
      />;
    } else {
      content = <QuestionView
        questionMaster={game.question_master}
        question={game.question}
        choices={choices}
        onSubmit={() => this.onSubmit()}
        submitted={!!answeredQuestion}
      />;
    }

    return (
      <div id="page-game" className="page">
        { content }
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
