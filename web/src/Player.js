import React, {Component} from 'react';
import request from "./request";

class Player extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedChoices: [],
      submitted: props.player.submitted,
    };
  }

  selectChoice(id) {
    const selectedChoices = this.state.selectedChoices.slice();
    const idx =selectedChoices.indexOf(id);

    if (idx >= 0)
      selectedChoices.splice(idx, 1);
    else
      selectedChoices.push(id);

    this.setState({ selectedChoices });
  }

  submitAnswer() {
    request('POST', '/api/answer/', { ids: this.state.selectedChoices })
      .then(res => this.setState({ selectedChoices: [], submitted: res }))
      .catch(err => console.error(err));
  }

  render() {
    const player = this.props.player;
    const canAnswer = this.props.canAnswer && player.submitted === null;

    const choiceColor = choice => {
      if (this.state.selectedChoices.indexOf(choice.id) >= 0)
        return 'darkgreen';

      const submitted = this.state.submitted;

      if (submitted && submitted.answers.map(c => c.id).indexOf(choice.id) >= 0)
        return 'grey';
    };

    const choices = player.cards.map(card => (
      <li
        key={card.id}
        onClick={canAnswer ? () => this.selectChoice(card.id) : null}
        style={{
          color: choiceColor(card),
          cursor: canAnswer ? 'pointer' : undefined,
        }}>
        {card.text}
      </li>
    ));

    let submittedAnswer = null;
    if (this.state.submitted !== null)
      submittedAnswer = <div>Submitted: {this.state.submitted.text}</div>;

    return (
      <div className={'player-' + player.id}>
        <div>
          Cards:
          <ul>
            {choices}
          </ul>
          <button
            onClick={() => this.submitAnswer()}
            disabled={!canAnswer || this.state.selectedChoices.length !== this.props.nbChoices}
          >Submit answer</button>
          {submittedAnswer ? <hr /> : null}
          {submittedAnswer}
        </div>
      </div>
    );
  }
}

export default Player;
