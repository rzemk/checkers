/* eslint-disable max-len, quotes, arrow-body-style, jsx-quotes, no-underscore-dangle */
import React from 'react';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = { players: [], game: { gameBoard: [] } };
    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    fetch('//localhost:3333/players')
    .then(r => r.json())
    .then(j => {
      console.log('cDM game.js j = ', j);
      this.setState({ players: j.players });
    });
  }

  submit() {
    const player1 = this.refs.player1.value;
    const player2 = this.refs.player2.value;
    console.log('in submit', player1, player2);
    fetch('//localhost:3333/games', { method: 'post', body: JSON.stringify({ player1, player2 }), headers: { "Content-Type": "application/json" } })
    .then((r) => { return r.json(); })
    .then((data) => {
      console.log('then data!', data);
      this.setState({ game: data.game });
    });
  }

  render() {
    const cls = 'taken';
    return (
      <div>
        <h1>Game on!</h1>
        <div>
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
        <div>
          {this.state.game.gameBoard.map((c, c2) => <div>{c.map((t, t2) => <div className={cls} >{c2} - {t2}</div>)}</div>)}
        </div>
      </div>
    );
  }
}

export default Game;
