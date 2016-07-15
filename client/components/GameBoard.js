/* eslint-disable react/prop-types, max-len, no-underscore-dangle, quotes, arrow-body-style */

import React from 'react';
import Tile from './Tile';

class GameBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { game: this.props.game, fromX: -1, fromY: -1, toX: -1, toY: -1, error: '' };
    this.target = this.target.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentWillMount() {
    this.setState({ game: this.props.game });
  }

  componentWillReceiveProps(props) {
    this.setState({ game: props.game });
  }

  target(event) {
    const coordX = event.currentTarget.getAttribute('data-x');
    const coordY = event.currentTarget.getAttribute('data-y');
    if (this.state.fromX < 0) {
      if (this.state.game.gameBoard[coordX][coordY] !== '') {
        this.setState({ fromX: coordX, fromY: coordY });
      }
    } else {
      this.setState({ toX: coordX, toY: coordY });
      this.submit(coordX, coordY);
    }
  }

  submit(toX, toY) {
    let player;
    if (this.state.game.currentPlayer === 1) {
      player = this.state.game.player1;
    } else {
      player = this.state.game.player2;
    }
    let movement;
    if (Math.abs(this.state.fromX - toX) > 1) {
      movement = 'jump';
    } else {
      movement = 'move';
    }
    fetch(`//localhost:3333/games/${this.props.game._id}/${movement}`, { method: 'put', body: JSON.stringify({ player, fromX: this.state.fromX, fromY: this.state.fromY, toX, toY }), headers: { "Content-Type": "application/json" } })
    .then((r) => { return r.json(); })
    .then((data) => {
      this.setState({ game: data.game, fromX: -1, fromY: -1, toX: -1, toY: -1, error: data.error });
    });
  }

  render() {
    let turnStatus;
    if (this.state.game.currentPlayer === 1) {
      turnStatus = 'Black take your turn';
    } else {
      turnStatus = 'Red take your turn';
    }
    if (this.state.game.winner > 0) {
      if (this.state.game.winner === 1) {
        turnStatus = 'Red wins!';
      } else {
        turnStatus = 'Black wins!';
      }
    }
    return (
      <div>
        <div>
          {turnStatus}
        </div>
        <div>
          {this.state.game.gameBoard.map((c, c2) => <div key={c2} className="noPad" >{c.map((t, t2) => <Tile key={`${c2}-${t2}`} piece={t} selectedX={this.state.fromX} selectedY={this.state.fromY} x={c2} y={t2} target={this.target} />)}</div>)}
        </div>
        <div>
          {this.state.error}
        </div>
      </div>
    );
  }
}
export default GameBoard;
