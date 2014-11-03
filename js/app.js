
"use strict";

$(document).ready(function() {
    //creates data structure to hold tiles and fills structure
    var tiles = [];
    var idx;
    for (idx = 1; idx <= 32; ++idx) {
        tiles.push({
            tileNum: idx,
            src: 'img/tile' + idx + '.jpg',
            matched: false
        });
    }
    var shuffledTiles;
    var selectedTiles;
    var tilePairs;

    //need global scope for function referencing
    var tileBack = 'img/tile-back.png';
    var gameBoard = $('#game-board');
    var tileOne;
    var tileTwo;
    var tileClicks;
    var matches = 0;
    var mistakes = 0;
    var timer;
    var elapsedSeconds;
    var recordSeconds = 999999; //arbitrarily large number

    function startGame () {
    	//shuffles tiles in structure
	    shuffledTiles = _.shuffle(tiles);
	    //selects first 8 tiles in shuffle
	    selectedTiles = shuffledTiles.slice(0, 8);
	    //end up with 8 pairs of tiles in a new array
	    tilePairs = [];
	    _.forEach(selectedTiles, function(tile) {
	        tilePairs.push(_.clone(tile));
	        tilePairs.push(_.clone(tile));
	    });
    	tilePairs = _.shuffle(tilePairs);
    	tileOne = null;
    	tileTwo = null;
    	tileClicks = 0;

	    var row = $(document.createElement('div'));
	    var img;
	    _.forEach(tilePairs, function(tile, elemIndex) {
	        if (elemIndex > 0 && !(elemIndex % 4)) {
	            gameBoard.append(row);
	            row = $(document.createElement('div'));
	        }
	        img = $(document.createElement('img'));
	        img.attr({
	            src: tileBack,
	            alt: 'image of tile ' + tile.tileNum
	        });
	        img.data('tile', tile);
	        row.append(img);
	    });
	    gameBoard.append(row);
	    matches = 0;
	    $('#matches').text("Matches: " + matches);
	    $('#remaining').text("Remaining Pairs: " + (8-matches));
	    mistakes = 0;
	    $('#mistakes').text("Mistakes: " + mistakes);
	    //must be inside function for game-board img scope
	    $('#game-board img').click(tileClick); 
    } //startGame function ends

    function resetInfo () {
    	matches = 0;
	    $('#matches').text("Matches: " + matches);
	    $('#remaining').text("Remaining Pairs: " + (8-matches));
	    mistakes = 0;
	    $('#mistakes').text("Mistakes: " + mistakes);
	    var startTime = _.now();
	    window.clearInterval(timer);
	    //makes change to time immediately instead of waiting for next tick to update
	    $('#elapsed-seconds').text("Elapsed Time: 0");
		timer = window.setInterval(function() {
    		elapsedSeconds = Math.floor((_.now() - startTime) / 1000);
   			$('#elapsed-seconds').text("Elapsed Time: " + elapsedSeconds);
		}, 1000);
    }


    $('#startButton').click(function() {
    	   gameBoard.empty();
    	   startGame();
    	   gameBoard.fadeIn(1000);
    	   $('#info').fadeIn(1000);
    	   resetInfo();
    });

    $('#htpButton').click(function () {
    	$('#darkLayer').fadeIn(500);
    	$('#instructions-box').fadeIn(500);
    });

    $('#okayButton').click(function() {
    	$('#darkLayer').fadeOut(500);
    	$('#instructions-box').fadeOut(500);
    });

    function tileFlip (img) {
    	var tile = img.data('tile');
        img.fadeOut(100, function() {
	        if (tile.flipped) {
	            img.attr('src', tileBack);
	            img.on('click', tileClick);
	        } else {
	            img.attr('src', tile.src);
	            img.off('click');
	        }
	        tile.flipped = !tile.flipped;
	        img.fadeIn(100);
        }); // after fadeOut
    }

    $('#resetButton').click( function() {
    	$('#darkLayer').fadeOut(1000);
    	$('#win-screen').fadeOut(1000);
    	gameBoard.empty();
    	startGame();
    	resetInfo();
    });

    function tileClick () {
    	tileClicks++;
    	if (tileClicks == 1) {
    		tileOne = ($(this));
    		tileFlip($(this));
    	}
    	if (tileClicks == 2) {
    		tileTwo = ($(this));
    		tileFlip($(this));
    		console.log(tileOne.context.alt);
    		console.log(tileTwo.context.alt);
    		if (tileOne.context.alt === tileTwo.context.alt) {
    			tileClicks = 0;
    			tileOne = null;
    			tileTwo = null;
    			matches++;
    			$('#matches').text("Matches: " + matches);
    			$('#remaining').text("Remaining Pairs: " + (8-matches));
    			if(matches == 8) {
    				$('#win-screen').fadeIn(1000);
    				$('#darkLayer').fadeIn(1000);
    				if (elapsedSeconds < recordSeconds) {
    					recordSeconds = elapsedSeconds;
    				}
    				window.clearInterval(timer);
    				$('#timeMsg').text("You won in " + elapsedSeconds + " seconds.");
    				$('#recordTimeMsg').text("Your record is " + recordSeconds + " seconds.");
    				//play that slamjam
    				document.getElementById('audio').play();
    			}
    		} else {
    			setTimeout(function () {
    				tileFlip(tileOne);
    				tileFlip(tileTwo);
    				tileClicks = 0;
    			}, 1000);
    			mistakes++;
    			$('#mistakes').text("Mistakes: " + mistakes);
    		}
    	}
    }

}); // jQuery ready function