from flask import Flask, render_template, request, session, jsonify
from flask_debugtoolbar import DebugToolbarExtension
from boggle import Boggle
app = Flask(__name__)
boggle_game = Boggle()
app.config['SECRET_KEY'] = "671-741-814"

debug = DebugToolbarExtension(app)

@app.route('/')
def index():
    """game homepage"""
     
    board = boggle_game.make_board()
    session['board'] = board

    return render_template("index.html", board=board)


@app.route('/check-word')
def check_word():
    """receives word guess from front end and checks if valid, returns json response"""

    word_guess = request.args['word']
    board = session['board']
    res = boggle_game.check_valid_word(board, word_guess)

    return jsonify(({'result': res}))


@app.route("/post-score", methods=["POST"])
def post_score():
    """Receive score, update nplays, update high score if appropriate."""

    score = request.json["score"]
    highscore = session.get("highscore", 0)
    nplays = session.get("nplays", 0)
    
    session['nplays'] = nplays + 1
    session['highscore'] = max(score, highscore)

    return jsonify(brokeRecord=score > highscore)