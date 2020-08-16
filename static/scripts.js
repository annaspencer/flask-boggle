
let score = 0
let wordsArray = [];


// gets word guess from form
$( "#guess_form" ).submit(function( event ) {
    event.preventDefault();
    let query = $("#search-query").val()
    checkAddedWords(query)
    $('form :input').val('');
  });

  
//  first checks if word has already been used, then sends to server to check if word is on the table
function checkAddedWords(query){
    if (wordsArray.includes(`${query}`)){
        $("#message_box").html(`Already found ${query}`, "err")
        return
    } else {
        checkWordGuess(query)
    }
}

// sends word to server to be checked, response is read
 async function checkWordGuess(query){
    let word_guess = query
    const response = await axios.get('http://127.0.0.1:5000/check-word', { params: { word: word_guess}})
    if (response.data.result === "not-word") {
        $("#message_box").html(`${word_guess} is not a valid English word`, "err");
      } else if (response.data.result === "not-on-board") {
        $("#message_box").html(`${word_guess} is not a valid word on this board`, "err");
      } else {
        score += word_guess.length
        $( "#score" ).html(score)
        $("#added_words").append(`<li>${word_guess}</li>`)
        wordsArray.push(`${word_guess}`)
        $("#message_box").html(`Added: ${word_guess}!`);
       
      }
}




// ends game by hiding form and running score function
function endGame(){
    $("#guess_form").toggleClass('end')
    scoreGame()
}


// checks for high score and shows final score/high score
async function scoreGame() {
    const resp = await axios.post("/post-score", { score: score });
    if (resp.data.brokeRecord) {
        $("#message_box").html(`New record: ${score}`, "ok");
    } else {
        $("#message_box").html(`Final score: ${score}`, "ok");
    }
  }

// play again button
$("#reset").click(function() {
    location.reload(true)
})

// starts game
setTimeout(endGame,30000);