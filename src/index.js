import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square"
      onClick={props.onClick}>
      {props.status}
    </button>
  );
}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.renderSquare = this.renderSquare.bind(this);
  }
  renderSquare(id) {
    return (
      <Square
        key={"s" + id.toString()}
        id={id}
        status={this.props.squares[id] ? '' : 'X'}
        onClick={() => this.props.onClick(id)}
      />
    );
  }
  render() {
    const rows = [];
    for (let i = 0; i < 10; ++i) {
      const rowSquares = [];
      for (let j = 0; j < 10; ++j) {
        rowSquares.push(this.renderSquare(i * 10 + j));
      }
      const row = <div className="board-row" key={"r" + i.toString()}>{rowSquares}</div>;
      rows.push(row);
    }
    return (
      <div>
        <div className="status">
          Welcome to the Game of Life!
        </div>
        {rows}
      </div>
    );
  }
}
class Game extends React.Component {
  constructor(props) {
    super(props);
    //this.handleClick = this.handleClick.bind(this);
    this.jumpTo = this.jumpTo.bind(this);
    this.state = {
      genNum: 0,
      history: [{
        squares: Array(100).fill(false)
      }],
    };
  }
  handleClick(id) {
    const history = this.state.history.slice(0, this.state.genNum + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    squares[id] = !this.state.history[history.length - 1].squares[id];
    current.squares = squares;
    history[history.length - 1] = current;
    this.setState({
      history: history,
    });
    console.log(id);
    console.log(squares[id]);
    console.log(computeLiveAdj(squares, id));
    console.log(computeStatus(squares, id));
  }
  jumpTo(genNum) {
    this.setState({
      genNum: genNum + 1,
    });
  }
  evolve() {
    const history = this.state.history.slice(0, this.state.genNum + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const nextGen = computeNextGen(squares);
    this.setState({
      genNum: this.state.genNum + 1,
      history: history.concat([
        {
          squares: nextGen
        }
      ]),
    });
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.genNum];
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <button onClick={() => this.evolve()}>
            "Evolve"
          </button>
        </div>
      </div>
    );
  }
}
// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function computeLiveAdj(squares, id) {
  var liveAdj = 0;
  var y = id % 10;
  var x = (id - y) / 10;
  var adj = [];
  for (let i = -1; i < 2; ++i) {
    var xAdj = (x + i) % 10;
    for (let j = -1; j < 2; ++j) {
      var yAdj = (y + j) % 10;
      var idAdj = xAdj * 10 + yAdj;
      adj.push(idAdj);
    }
  }
  for (let i = 0; i < 9; ++i) {
    if(i !== 4) {
      if (squares[adj[i]]) {
        ++liveAdj;
      }
    }
  }
  return liveAdj;
}
function computeStatus(squares, id) {
  var status = squares[id];
  var liveAdj = computeLiveAdj(squares, id);
  if (status) {
    if (liveAdj === 2 || liveAdj === 3) {
      status = true;
    } else {
      status = false;
    }
  } else {
    if (liveAdj === 3) {
      status = true;
    }
  }
  return status;
}
function computeNextGen(squares) {
  var nextGen = squares.slice();
  for (let i = 0; i < 100; ++i) {
    nextGen[i] = computeStatus(squares, i);
  }
  return nextGen;
}
