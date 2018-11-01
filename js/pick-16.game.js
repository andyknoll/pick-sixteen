/* 
    pick-16.game.js 

    Andy Knoll
    October 2018

    Contains the following objects:

        NumberGame
            GameBoard
            BoardSquare
            BoardPiece

    Requires pick-16.board.js and pick-16.pieces.js

*/

var mcc = {};                   // namespace
const MAX_PIECES = 16;


// the main game object
mcc.NumberGame = function(id) {

    // app properties
    this.id = id;               // helps for debugging

    // UI objects (jQuery)
    this.$body = null;
    this.$header = null;
    this.$main = null;
    this.$footer = null;

    // game objects
    this.scoreBoard = null;
    this.gameBoard  = null;
    this.picks   = [];
    this.values  = [];

    this.currPickIndex = -1;

    this.isStarted  = false;     // game state
    this.startLabel = "START PICKIN'";
    this.stopLabel  = "PLAY AGAIN";

    this.isCompletedHtml  = "";
    this.notCompletedHtml = "";

    // mp3 sounds
    this.mp3Correct = null;
    this.mp3Incorrect = null;

    // accessor methods
    this.square = function(idx) { return this.gameBoard.square(idx); };
    this.piece = function(idx) { return this.gameBoard.piece(idx); };
    this.currPick = function() { return this.picks[this.currPickIndex]; };


    // call this manually after creating this app object
    this.run = function() {
        //this.assignObjects();               // create jQuery objects
        this.createGameObjects();           // ScoreBoard and GameBoard
        this.createUIObjects();
        this.bindUIObjects();
        //this.showInstructions();
        this.scoreBoard.clearPickAreas();
        this.hidePieces();
        this.initPiecesToNeutral();
        this.hideResults();
        //this.initGame();
        this.fadeInGame();
    };
    
    this.fadeInGame = function() {
        this.$body.hide(0);
        this.$body.fadeIn(1000);
    };

    // all methods below called by run()
    this.assignObjects = function() {
        this.$body = $("body");
        this.$header = $("header");
        this.$main = $("main");
        this.$footer = $("footer");
        //alert("assignObjects");
    };

    this.createGameObjects = function() {
        this.createPicksArray();
        this.createValuesArray();    
        this.scoreBoard = new mcc.ScoreBoard("scoreBoard", this);
        this.gameBoard = new mcc.GameBoard("gameBoard", this);

        this.mp3Correct = new Audio();
        this.mp3Correct.src = "media/bell.wav";
        this.mp3Incorrect = new Audio();
        this.mp3Incorrect.src = "media/tumba.wav";
    };

    // called only once
    this.createPicksArray = function() {
        for (var i = 1; i <= MAX_PIECES; i++) {
            this.picks.push(i);
        }
    };

    // called only once
    this.createValuesArray = function() {
        for (var i = 1; i <= MAX_PIECES; i++) {
            this.values.push(i);
        }
    };



    // this links to the provided HTML tags
    // this should probably be done in the GameBoard object
    this.createUIObjects = function() {
        var scoreBoard = this.scoreBoard;
        var board = this.gameBoard;

        this.$body = $("body");
        this.$header = $("header");
        this.$main = $("main");
        this.$footer = $("footer");
        this.$overlay = $("#overlay");      // id not element!

        scoreBoard.$startButton = $("#start-button");
        scoreBoard.$startButton.html(this.startLabel);
        scoreBoard.$timerDisplay = $("#timer-display");
        scoreBoard.updateTimerDisplay();

        scoreBoard.createUIObjects();       // move others here too!

        board.piece(0).createElem("p0");
        board.piece(1).createElem("p1");
        board.piece(2).createElem("p2");
        board.piece(3).createElem("p3");
        board.piece(4).createElem("p4");
        board.piece(5).createElem("p5");
        board.piece(6).createElem("p6");
        board.piece(7).createElem("p7");
        board.piece(8).createElem("p8");
        board.piece(9).createElem("p9");
        board.piece(10).createElem("p10");
        board.piece(11).createElem("p11");
        board.piece(12).createElem("p12");
        board.piece(13).createElem("p13");
        board.piece(14).createElem("p14");
        board.piece(15).createElem("p15");

        this.isCompletedHtml  += "<br>";
        this.isCompletedHtml  += "Congratulations!";
        this.isCompletedHtml  += "<br><br>";
        this.isCompletedHtml  += "You made it - not bad.";
        this.isCompletedHtml  += "<br><br>";
        this.isCompletedHtml  += "Play again and beat your score!";

        this.notCompletedHtml += "<br>";
        this.notCompletedHtml += "Sorry!";
        this.notCompletedHtml += "<br><br>";
        this.notCompletedHtml += "You did not complete the game this round.";
        this.notCompletedHtml += "<br><br>";
        this.notCompletedHtml  += "Better luck next time!";
    
    };

    // these should be in a controller!
    // doing all UI binding here in one place
    this.bindUIObjects = function() {
        var scoreBoard = this.scoreBoard;
        var $startButton = scoreBoard.$startButton;
        var board = this.gameBoard;
        var piece = null;

        // assign all scoreBoard click handlers - pass scoreBoard object
        $startButton.bind("click", scoreBoard, scoreBoard.onButtonClick);

        // assign all pieces' click handlers
        for (var i = 0; i < MAX_PIECES; i++) {
            piece = board.piece(i);
            piece.$elem.bind("click", piece, piece.onClick);
        }

    };

    this.shufflePicks = function() {
        this.shuffleArray(this.picks);
        this.currPickIndex = -1;
    };

    this.shuffleValues = function() {
        this.shuffleArray(this.values);
    };


    this.hidePieces = function() {
        this.gameBoard.hidePieces();
    };

    this.initPiecesToNeutral = function() {
        this.gameBoard.initPiecesToNeutral();
    };

    this.hideResults = function() {
        //alert("hideResults");
        this.$overlay.fadeOut(100);
    };

    this.showResults = function(isCompleted) {
        if (isCompleted) {
            this.$overlay.html(this.isCompletedHtml);
        } else {
            this.$overlay.html(this.notCompletedHtml);
        }
        this.$overlay.fadeIn(500);
    };

    this.isCompleted = function() {
        return this.currPickIndex == MAX_PIECES;
    };

    // click Start button
    this.startGame = function() {
        var self = this;
        this.isStarted = true;
        this.scoreBoard.resetTimer();
        this.scoreBoard.clearPickAreas();
        this.hidePieces();
        this.initPiecesToNeutral();
        this.hideResults();
        this.shufflePicks();
        this.shuffleValues();
        this.gameBoard.setPieceValues();
        this.gameBoard.showPiecesRandomly();
        this.scoreBoard.$startButton.html(this.stopLabel);
        this.currPickIndex = -1;

        // pause a bit...
        setTimeout(function() {
            self.getNextPick();    
            self.scoreBoard.startTimer();
        }, 1500);
    };

    // click Play Again button
    this.stopGame = function() {
        this.isStarted = false;
        this.scoreBoard.stopTimer();
        this.scoreBoard.$startButton.html(this.startLabel);
        this.showResults(this.isCompleted());
    };

    this.getNextPick = function() {
        this.currPickIndex++;
        if (this.currPickIndex == MAX_PIECES) {
            this.stopGame();
        } else {
            this.scoreBoard.setPickAreaValue(this.currPickIndex, this.currPick());
        }
    };




    // Durstenfeld algorithm - shuffle any array in place
    this.shuffleArray = function(array) {
        var i = 0;
        var j = 0;
        var temp = null;
      
        for (i = array.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1))
            temp = array[i]
            array[i] = array[j]
            array[j] = temp
        }
    };

    this.playCorrect = function() {
        //alert("playCorrect");
        this.mp3Correct.play();
    };

    this.playIncorrect = function() {
        //alert("playIncorrect");
        this.mp3Incorrect.play();
    };

    

};

