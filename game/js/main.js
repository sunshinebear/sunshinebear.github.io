var R = require("./role.js");
var W = require("./win.js");
require("../lib/util");
var primaryAi = require("./primaryAi.js");

var Board = function (container, status) {
    this.container = container;
    this.status = status;
    this.backCount = 1;
    this.isComVersion = false;

    this.boardItemWidth = parseInt(Util.css(this.container, 'width')) * 0.065;
    //棋盘的边角offset
    this.offset = parseInt(Util.css(this.container, 'width')) * 0.041;
    this.offsetLeft = container.offsetLeft;
    this.offsetTop = container.offsetTop;

    this.steps = [];  //存储
    this.forwardSteps = []; //撤销悔棋

    this.started = false;
    var self = this;

    /*标志位*/
    this.isWhiteTurn = true;

    this.container.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (self.lock || !self.started) return;
        var y, x;
        x = Math.round(((e.clientX - self.offsetLeft) - self.offset) / self.boardItemWidth);
        y = Math.round(((e.clientY - self.offsetTop) - self.offset) / self.boardItemWidth);
        if (self.isComVersion)
            self.set(x, y, R.hum);
        else {
            if (self.isWhiteTurn)
                self.set(x, y, R.hum);
            else
                self.set(x, y, R.com);
        }
    });

    this.setStatus("请点击开始按钮");
};

Board.prototype.start = function () {
    if (this.started) return;
    this.initBoard();
    this.board[7][7] = R.com;
    this.steps.push([7, 7]);
    this.draw(7, 7);
    this.setStatus("欢迎加入五子棋游戏");
    this.started = true;
}

Board.prototype.stop = function () {
    if (!this.started) return;
    this.setStatus("请重新开始");
    this.started = false;
}
Board.prototype.initBoard = function () {
    this.board = [];
    for (var i = 0; i < 15; i++) {
        var row = [];
        for (var j = 0; j < 15; j++) {
            row.push(0);
        }
        this.board.push(row);
    }
    this.steps = [];
    this.forwardSteps =[];
    this.draw();
}

Board.prototype.draw = function (x, y) {
    var container = this.container;
    var board = this.board;
    if (arguments.length < 2) {
        Util.remove(container);
        return;
    }
    if (board[x][y] != 0) {
        var chessman = document.createElement('div');
        Util.addClass(chessman, 'chessman');
        chessman.id = x + "and" + y;
        Util.css(chessman, 'top', (this.offset + y * this.boardItemWidth) + "px");
        Util.css(chessman, "left", (this.offset + x * this.boardItemWidth) + "px");
        if (board[x][y] == 2)
            Util.addClass(chessman, 'black');
        container.appendChild(chessman);
    } else {
        var _temp = document.getElementById(x + "and" + y);
        if (_temp)
            _temp.parentNode.removeChild(_temp);
    }

}

Board.prototype._set = function (x, y, role) {
    if (!this.isComVersion)
        this.isWhiteTurn = !this.isWhiteTurn;
    this.board[x][y] = role;
    this.steps.push([x, y]);
    this.draw(x, y);
    var winner = W(this.board);
    var self = this;
    if (winner == R.com) {
        if(this.isComVersion)
            Util.alert("电脑赢了！");
        else
            Util.alert("黑棋赢了");
        self.stop();
    } else if (winner == R.hum) {
        Util.alert("白棋赢了！");
        self.stop();
    }
}

Board.prototype.set = function (x, y, role) {
    if (this.board[x][y] !== 0) {
        console.log("此位置不为空");
        return;
    }
    this._set(x, y, role);
    this.forwardSteps = [];
    if(this.isComVersion)
        this.com();
};

Board.prototype.com = function () {
    if (!this.started) return;
    var result = primaryAi(this.board);
    this._set(result[0], result[1], R.com);
}

Board.prototype.setStatus = function (s) {
    this.status.innerHTML = s;
}

Board.prototype.back = function (count) {
    if(!this.started)
        return;
    count = this.backCount ? this.backCount : 1;
    while (count > 0 && this.steps.length > 0) {
        var s = this.steps.pop();
        this.forwardSteps.push(s.concat(this.board[s[0]][s[1]]));
        this.board[s[0]][s[1]] = R.empty;
        this.draw(s[0], s[1]);
        count--;
        this.isWhiteTurn = !this.isWhiteTurn;
    }
};

Board.prototype.forward = function (count) {
    if(!this.started)
        return;
    count = this.backCount ? this.backCount : 1;
    while (count > 0 && this.forwardSteps.length > 0) {
        var s = this.forwardSteps.pop();
        this.board[s[0]][s[1]] = s[2];
        this.draw(s[0], s[1]);
        this.steps.push([s[0], s[1]]);
        count--;
        this.isWhiteTurn = !this.isWhiteTurn;
    }
};

var b = new Board($("#board"), $(".status"));
$("#start").addEventListener('click', function () {
    b.start();
});

$("#fail").addEventListener('click', function () {
    if (confirm("确定认输吗?")) {
        b.stop();
    }
});

$("#back").addEventListener('click', function () {
    b.back();
});

$("#forward").addEventListener('click', function () {
    b.forward();
});

$("#alertBtn").addEventListener('click',function () {
    Util.css($("#alert"), 'display', 'none');
});

$("#selectMode").addEventListener('change',function (e) {
        var val =e.target.value;
        if(val =='1'){
            b.backCount = 1;
            b.isComVersion = false;
            b.stop();
        }else{
            b.backCount = 2;
            b.isComVersion = true;
            b.stop();
        }
});
