from flask import Flask, request, jsonify
from flask_cors import CORS
import chess
import chess.engine

app = Flask(__name__)
CORS(app)

def get_fen_from_algebraic(algebraic_moves):
    board = chess.Board()
    for move in algebraic_moves:
        board.push_san(move)
    return board.fen()

def get_best_move(fen, depth=20, path_to_stockfish="./stockfish/avx2.exe"):
    with chess.engine.SimpleEngine.popen_uci(path_to_stockfish) as engine:
        board = chess.Board(fen)
        result = engine.play(board, chess.engine.Limit(depth=depth))
        return result.move

@app.route('/api/record-move', methods=['GET'])
def get_best_move_api():
    algebraic_moves = request.args.getlist('moves[]')
    fen = get_fen_from_algebraic(algebraic_moves)
    best_move = get_best_move(fen)
    print(best_move)
    return jsonify({"best_move": best_move.uci()})

if __name__ == '__main__':
    app.run(debug=False)
    
