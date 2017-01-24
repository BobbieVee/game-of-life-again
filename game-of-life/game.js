var gameOfLife = {
  width: 12, 
  height: 12, // width and height dimensions of the board
  stepInterval: null, // should be used to hold reference to an interval that is "playing" the game
  play: true,

  createAndShowBoard: function () {
    // create <table> element
    var goltable = document.createElement("tbody");
    
    // build Table HTML
    var tablehtml = '';
    for (var h=0; h<this.height; h++) {
      tablehtml += "<tr id='row+" + h + "'>";
      for (var w=0; w<this.width; w++) {
        tablehtml += "<td data-status='dead' id='" + w + "-" + h + "'></td>";
      }
      tablehtml += "</tr>";
    }
    goltable.innerHTML = tablehtml;
    
    // add table to the #board element
    var board = document.getElementById('board');
    board.appendChild(goltable);
    
    // once html elements are added to the page, attach events to them
    this.setupBoardEvents();
  },

  forEachCell: function (iteratorFunc) {
    for (var h = 0; h < this.height; h++) {
      for (var w = 0; w < this.width; w++){
      var  elem = (document.getElementById( h + "-" + w ));
        iteratorFunc(elem, h, w);
      }
    }
  },

  makeDead: function(elem){
    elem.className = "dead";
    elem.setAttribute('data-status', 'dead');
  },

  makeAlive: function(elem){
    elem.className = "alive";
    elem.setAttribute('data-status', 'alive');
  },  


  clearBoard: function(){
    this.play = false;
    var that = this;
    this.forEachCell(function(elem){
      that.makeDead(elem);
    });
  },

  randomize: function(){
    this.play = false;
    var that = this;
    this.forEachCell(function(elem){
      if (Math.random() < .5) {
        that.makeAlive(elem);
      } else {
        that.makeDead(elem);
      }
    });
  },
  
  setupBoardEvents: function() {
    var that = this;
    var onCellClick = function (e) {
      if (this.getAttribute('data-status') == 'dead') {
        that.makeAlive(this)
      } else {
        that.makeDead(this);
      }
    };
    
    gameOfLife.forEachCell(function(elem){
      elem.addEventListener('click', onCellClick);
    });

    document.getElementById('clear_btn').addEventListener('click', this.clearBoard.bind(this));
    document.getElementById('reset_btn').addEventListener('click', this.randomize.bind(this));
    document.getElementById('step_btn').addEventListener('click', this.step.bind(this));
    document.getElementById('play_btn').addEventListener('click', this.enableAutoPlay.bind(this));
  },

  checkNeighbors: function(x,y){
    var aliveCount = 0;
    for (var i = x-1; i < x + 2; i++){
      for (var j = y-1; j < y + 2; j++){
        if (!(i=== x && j === y) && i >= 0 && j >= 0 && i < this.height && j < this.width){
          elem = document.getElementById(i + "-" + j);
          if (elem.getAttribute('data-status') == 'alive')
            aliveCount++;
          }
      }
    }
    return aliveCount;
  },

   step: function () {
    // create 2d array
    var boardArr = [];
    for (var i = 0; i < this.height; i++){
      boardArr.push([]);
    }

    // Fill in boardArr for next iteration
    var that = this;
    this.forEachCell(function(elem, x, y){
      var count =  that.checkNeighbors(x,y);
      
      if (elem.getAttribute('data-status') == 'alive') {
        if (count < 2 || count > 3){
          boardArr[x][y] = false;
        } else {
          boardArr[x][y] = true;
        }
      } else {
        if (count === 3){
          boardArr[x][y] = true;
        } else {
          boardArr[x][y] = false;
        }
      }
    });

    // create next iteration
    this.forEachCell(function(elem, x, y){
      if (boardArr[x][y]) {
        that.makeAlive(elem);
      } else {
        that.makeDead(elem);
      }
    });
   
  }, 

  enableAutoPlay: function () {
    this.play = true;
    var that = this;
    function playLoop(){
      setTimeout(function(){
        that.step();
        console.log('hello');
        if (that.play === true) playLoop();
      } , 250);
      
    }
    playLoop();
  }  
};



gameOfLife.createAndShowBoard();


