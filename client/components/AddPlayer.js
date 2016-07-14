/* eslint-disable max-len, quotes, arrow-body-style */
import React from 'react';

class AddPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
  }

  submit() {
    const name = this.refs.name.value;
    fetch('//localhost:3333/players', { method: 'post', body: JSON.stringify({ name }), headers: { "Content-Type": "application/json" } })
    .then((r) => { return r.json(); })
    .then((data) => {
      // this.setState({ name });
    });
  }

  render() {
    return (
      <div>
        <h1>New player</h1>
        <div>Name: <input type="text" ref="name" /></div>
        <div><button onClick={this.submit} >Submit</button></div>
      </div>
    );
  }
}

export default AddPlayer;
