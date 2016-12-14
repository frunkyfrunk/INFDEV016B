var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('higher-lower');
});

router.post('/', function (req, res) {
    var wager = parseInt(req.body.wager);
    if (isNaN(wager)) wager = 0;

    var newRandom = Math.floor((Math.random() * 10) + 1);
    var previousRandom = req.body.previousRandom;
    var playerWon = undefined;
    if (typeof previousRandom !== 'undefined') {
        var higherLower = req.body.higherlower;
        playerWon = checkWin(previousRandom, newRandom, higherLower);

    }

    res.render('higher-lower', {wager: wager, randomNumber: newRandom, previousNumber: previousRandom, playerWon: playerWon});
});

// takes a 2 number and higher or lower and compares 1 with 2
// returns false if same numbers
function checkWin(number1, number2,  higherLower) {
    if (higherLower == 'Lower') {
        return number2 < number1;
    } else {
        return number2 > number1;
    }
}

module.exports = router;

