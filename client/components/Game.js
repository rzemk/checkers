/* eslint-disable max-len, quotes, arrow-body-style, jsx-quotes, no-underscore-dangle */
import React from 'react';
import Board from './GameBoard';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = { players: [], game: { _id: '', gameBoard: [] } };
    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    fetch('//localhost:3333/players')
    .then(r => r.json())
    .then(j => {
      this.setState({ players: j.players });
    });
  }

  submit() {
    const player1 = this.refs.player1.value;
    const player2 = this.refs.player2.value;
    fetch('//localhost:3333/games', { method: 'post', body: JSON.stringify({ player1, player2 }), headers: { "Content-Type": "application/json" } })
    .then((r) => { return r.json(); })
    .then((data) => {
      this.setState({ game: data.game });
    });
  }

  render() {
    let selectDisplay = '';
    let boardDisplay = '';
    if (this.state.game.gameBoard.length > 0) {
      selectDisplay = 'none';
      boardDisplay = 'inline-block';
    } else {
      selectDisplay = 'inline-block';
      boardDisplay = 'none';
    }
    return (
      <div>
        <h1>Game on!</h1>
        <div style={{ display: selectDisplay }} >
          <div>player 1:
            <select ref='player1' >
              {this.state.players.map((p, i) => <option value={p._id} key={i}>{p.name}</option>)}
            </select>
            player 2:<select ref='player2' >
              {this.state.players.map((p, i) => <option value={p._id} key={i}>{p.name}</option>)}
            </select>
          </div>
          <div><button onClick={this.submit} >Start</button></div>
        </div>
        <div style={{ display: boardDisplay }} >
          <Board game={this.state.game} />
        </div>
      </div>
    );
  }
}

export default Game;
