var evaluate = require("./evaluate");
var hasNeighbor = require("./neighbor.js");
var R = require("./role.js");

function deepCopy(obj) {
    var out = [], i = 0, len = obj.length;
    for (; i < len; i++) {
        if (obj[i] instanceof Array) {
            out[i] = deepCopy(obj[i]);
        }
        else out[i] = obj[i];
    }
    return out;
};

function primaryAi(_board) {
    var board = deepCopy(_board);
    var computerPosition = {
        x: 0,
        y: 0
    };
    var maxPoint = 0;
    var humanScore = 10000000;  //玩家得分低点
    var humanPosition = {  //玩家得分低点位置
        x: 0,
        y: 0
    };
    var blockHuman = false; //现在棋盘如果有利于玩家的时候
    var current_result = evaluate(board);
    if(current_result.humScore > current_result.comScore){
        blockHuman = true;
    }
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (board[i][j] == R.empty && hasNeighbor(board, [i, j], 2, 1)) {
                var boardTemp = deepCopy(board);
                boardTemp[i][j] = R.com;
                var evaluate_result = evaluate(boardTemp);
                //是否有电脑得分大于玩家的点
                var result_point = evaluate_result.comScore - evaluate_result.humScore;

                if (result_point > maxPoint) {
                    maxPoint = result_point;
                    computerPosition.x = i;
                    computerPosition.y = j;
                }
                //用于保持没有最佳点的情况
                if (evaluate_result.humScore < humanScore) {
                    humanScore = evaluate_result.humScore;
                    humanPosition.x = i;
                    humanPosition.y = j;
                }
            }
        }
    }
    if (maxPoint > 0 && !blockHuman)
        return [computerPosition.x, computerPosition.y];
    else
        return [humanPosition.x, humanPosition.y];
}

module.exports = primaryAi;