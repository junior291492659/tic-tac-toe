import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button className={props.className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  createBoard(row, col) {
    const board = [];
    let cellCounter = 0;
    for (let i = 0; i < row; ++i) {
      const columns = [];
      for (let j = 0; j < col; ++j) {
        columns.push(this.renderSquare(cellCounter++));
      }
      board.push(
        <div key={i} className="board-row">
          {columns}
        </div>
      );
    }
    return board;
  }
  renderSquare(i) {
    if (
      this.props.highlight === null ||
      this.props.highlight.indexOf(i) === -1
    ) {
      return (
        <Square
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
          className="square"
          key={i}
        />
      );
    } else {
      return (
        <Square
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
          className="square highlight"
          key={i}
        />
      );
    }
  }
  render() {
    return <div>{this.createBoard(3, 3)}</div>;

    // return (
    //   <div>
    //     <div className="board-row">
    //       {this.renderSquare(0)}
    //       {this.renderSquare(1)}
    //       {this.renderSquare(2)}
    //     </div>
    //     <div className="board-row">
    //       {this.renderSquare(3)}
    //       {this.renderSquare(4)}
    //       {this.renderSquare(5)}
    //     </div>
    //     <div className="board-row">
    //       {this.renderSquare(6)}
    //       {this.renderSquare(7)}
    //       {this.renderSquare(8)}
    //     </div>
    //   </div>
    // );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          stepIndex: -1,
        },
      ],
      xIsNext: true,
      stepCount: 0,
      asc: true,
    };
    this.handelClick = this.handelClick.bind(this);
  }

  handelClick(i) {
    const history = this.state.history.slice(0, this.state.stepCount + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    // 已经决出胜负 或者 该位置已经被使用了
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{ squares, stepIndex: i }]),
      xIsNext: !this.state.xIsNext,
      stepCount: history.length,
    });
    // console.log(history, history.length);
  }

  jump(move) {
    this.setState({
      xIsNext: move % 2 === 0,
      stepCount: move,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepCount];
    const winner = calculateWinner(current.squares);
    const asc = this.state.asc;

    // console.log("stepCount", this.state.stepCount);

    let moves = history.map((step, move) => {
      let desc = !move
        ? `Go to game start`
        : `Go to move #${move}, which locates in (${Math.floor(
            step.stepIndex / 3
          )}, ${step.stepIndex % 3})`;
      return (
        <li key={move}>
          <button
            onClick={(e) => {
              this.jump(move);
              //   console.log(window.document.querySelector(".history").children);
              Array.from(
                window.document.querySelector(".history").children
              ).forEach((item) => item.classList.remove("history-current"));

              //   console.log(e.target.parentNode);
              e.target.parentNode.classList.add("history-current");
            }}
          >
            {desc}
          </button>
        </li>
      );
    });
    !asc && moves.reverse();

    let status, highlight;

    if (winner) {
      highlight = winner[1];
      status = `Winner: ${winner[0]}`;
    } else {
      highlight = null;
      status =
        this.state.stepCount > 9
          ? "No player win! It ends in a draw"
          : `Next player: ${this.state.xIsNext ? "X" : "O"}`;
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            highlight={highlight}
            onClick={this.handelClick}
          />
        </div>
        <div className="game-info">
          <div>
            {status}{" "}
            <button
              onClick={() => {
                this.setState({ asc: !asc });
              }}
            >
              {!asc ? "升序" : "降序"}
            </button>{" "}
          </div>
          <ol className="history">{moves}</ol>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], [a, b, c]];
    }
  }
  return null;
}
