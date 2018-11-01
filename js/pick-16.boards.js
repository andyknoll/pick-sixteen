/* 
    pick-16.boards.js 
*/

// holds Start button and Timer display
mcc.ScoreBoard = function(id, parent) {
    this.id = id;
    this.parent = parent;
    this.$elem = null;

    // these UI elements are currently assigned in main game
    this.$startButton = null;
    this.$timerDisplay = null;

    this.currTime = 0;
    this.timer = 0;

    this.pickAreas = [];

    this.createUIObjects = function() {
        var $pick = null;
        for (var i = 0; i < MAX_PIECES; i++) {
            $pick = $("#pick-" + i);
            this.pickAreas.push($pick);
        }
    };

    this.onButtonClick = function(e) {
        var scoreBoard = e.data;
        var game = scoreBoard.parent;

        if (game.isStarted) {
            scoreBoard.parent.stopGame();
        } else {
            scoreBoard.parent.startGame();
        }
    };

    this.resetTimer = function() {
        this.currTime = 0;
        this.updateTimerDisplay();
    };

    this.startTimer = function() {
        //alert("startTimer");
        var self = this;
        this.currTime = 0;
        this.timer = setInterval(function() {
            self.currTime++;
            self.updateTimerDisplay();
        }, 1000);
    };

    this.stopTimer = function() {
        //alert("stopTimer");
        clearInterval(this.timer);
    };

    this.updateTimerDisplay = function() {
        this.$timerDisplay.html(this.currTime);
    };

    this.clearPickAreas = function() {
        for (var i = 0; i < MAX_PIECES; i++) {
            this.setPickAreaValue(i, "&nbsp;");      // cannot be blank for display alignment
        }
    };

    this.setPickAreaValue = function(idx, val) {
        this.pickAreas[idx].html(val);
    };

};




// holds the clickable pieces
mcc.GameBoard = function(id, parent) {
    this.id = id;
    this.parent = parent;
    this.$elem  = null;
    this.pieces  = [];
    this.showSpeed = 50;        // msecs between piece reveals

    // accessor methods
    //this.square = function(idx) { return this.squares[idx]; };
    this.piece = function(idx) { return this.pieces[idx]; };

    this.createPieces = function() {
        var piece = null;
        var id = "";
        for (var i = 0; i < MAX_PIECES; i++) {
            id = "piece" + i;
            piece = new mcc.BoardPiece(id, this);
            this.pieces.push(piece);
        }
    };

    this.setPieceValues = function() {
        for (var i = 0; i < MAX_PIECES; i++) {
            this.piece(i).setValue(this.parent.values[i]);     // after shuffling
        }
    };

    this.showPiece = function(i) {
        this.piece(i).$elem.css("visibility", "visible");
    };

    this.hidePiece = function(i) {
        this.piece(i).$elem.css("visibility", "hidden");
    };

    this.hidePieces = function() {
        for (var i = 0; i < MAX_PIECES; i++) {
            this.hidePiece(i);
        }
    };

    this.initPiecesToNeutral = function() {
        for (var i = 0; i < MAX_PIECES; i++) {
            this.piece(i).showNeutral();
        }
    };

    this.showPiecesRandomly = function() {
        var values = this.parent.values;
        var self = this;
        var i = 0;
        var timer = setInterval(function() {
            self.showPiece(values[i] - 1);      // pieces are 0-based
            i++;
            if (i == MAX_PIECES) {
                clearInterval(timer);
            }
        }, this.showSpeed);
    };

    this.createElem = function(elemId) {
        this.$elem = $("#" + elemId);
    };

    this.createPieces();
};





mcc.BoardPiece = function(id, parent) {
    this.id = id;
    this.parent = parent;
    this.value = 0;
    this.$elem = null;

    // these UI elements are currently assigned in main game
    this.createElem = function(elemId) {
        this.$elem = $("#" + elemId);
    };

    // also updates UI
    this.setValue = function(val) {
        this.value = val;
        this.$elem.html(this.value);
    };

    this.showCorrect = function() {
        this.$elem.removeClass("piece-incorrect");
        this.$elem.addClass("piece-correct");
    };

    this.showIncorrect = function() {
        var self = this;
        this.$elem.removeClass("piece-correct");
        this.$elem.addClass("piece-incorrect");
        setTimeout(function() {
            self.showNeutral();
        }, 250);
    };

    this.showNeutral = function() {
        this.$elem.removeClass("piece-correct");
        this.$elem.removeClass("piece-incorrect");
    };

    this.onClick = function(e) {
        var piece = e.data;
        var game = piece.parent.parent;     // parent of GameBoard

        // test only!
        // if (piece.value == currPick) {
        if (piece.value == game.currPick()) {
            piece.showCorrect();
            game.playCorrect();
            game.getNextPick();
        } else {
            piece.showIncorrect();
            game.playIncorrect();
        }

    };
};

