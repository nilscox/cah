import React, {Component} from 'react';
import request from './request';
import Player from './Player';

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      game: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.hasOwnProperty('player')) {
      const player = nextProps.player;

      if (player && player.game !== null)
        this.fetch();
      else
        this.setState({ game: null });
    }
  }

  create() {
    return request('POST', '/api/game/')
      .then(game => this.setState({ game }))
      .catch(err => console.error(err));
  }

  fetch() {
    return request('GET', '/api/game/')
      .then(game => this.setState({ game }))
      .catch(err => console.error(err));
  }

  join(id) {
    return request('POST', '/api/game/join/' + id)
      .then(game => this.setState({ game }))
      .catch(err => console.error(err));
  }

  leave() {
    return request('POST', '/api/game/leave/')
      .then(() => this.setState({ game: null }))
      .catch(err => console.error(err));
  }

  start() {
    return request('POST', '/api/game/start/')
      .then(game => this.setState({ game }))
      .catch(err => console.error(err));
  }

  selectAnswer(id) {
    return request('POST', '/api/answer/select/' + id)
      .then(answered => console.log(answered))
      .catch(err => console.error(err));
  }

  render() {
    const game = this.state.game;
    const player = this.props.player;

    if (!player)
      return <div />;

    if (!game) {
      let joinGameId = null;

      return (
        <div>
          <div>
            <button onClick={() => this.create()}>
              Create game
            </button>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); this.join(joinGameId); }}>
            Join: <input onChange={e => joinGameId = e.target.value} />
          </form>
        </div>
      );
    }

    let leaveButton = (
      <span style={{ fontSize: 'small', paddingLeft: '15px', cursor: 'pointer' }} onClick={() => this.leave()}>
        (leave)
      </span>
    );

    let startButton = '';
    if (game.state === 'idle' && player.nick === game.owner)
      startButton = <div><button onClick={() => this.start()}>Start</button></div>;

    let question = '';
    if (game.state === 'started')
      question = <div>Question: {game.question.text}</div>;

    const players = game.players.map(player => (
      <li key={'player-' + player.nick}>
        <span style={{
          fontWeight: player.nick === game.question_master ? 'bold': null,
          marginRight: '10px',
        }}
        >{player.nick}</span>
        ({player.score})
      </li>
    ));

    let propositionsList = null;
    if (game.state === 'started') {
      if (game.question_master === player.nick) {
        propositionsList = game.propositions.map(p => (
          <li key={p.id} style={{cursor: 'pointer'}} onClick={() => this.selectAnswer(p.id)}>{p.text}</li>
        ));
      } else {
        propositionsList = game.propositions.map(p => (
          <li key={p.id}>{p.text}</li>
        ));
      }
    }

    let propositions = null;
    if (propositionsList && propositionsList.length > 0) {
      propositions = (
        <div>
          Propositions:
          <ul>{propositionsList}</ul>
        </div>
      );
    }

    let playerComponent = null;
    if (game.state === 'started') {
      playerComponent = <Player
        player={this.props.player}
        canAnswer={game.question_master !== player.nick}
        nbChoices={game.question ? game.question.nb_choices : null}
      />;
    }

    return (
      <div id={'game-' + game.id}>
        Game #{game.id}
        {leaveButton}
        <div>
          Players:
          <ul>{players}</ul>
        </div>
        <hr />
        {startButton}
        {question}
        {question ? <hr /> : null}
        {playerComponent}
        {propositions ? <hr /> : null}
        {propositions}
      </div>
    );
  }
}

export default Game;