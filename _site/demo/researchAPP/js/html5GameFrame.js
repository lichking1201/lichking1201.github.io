const GAME_STATE_MENU = 0 //开始菜单
const GAME_STATE_NEW_GAME = 1 //开始新游戏
const GAME_STATE_GAME_OVER = 2 //游戏结束

var currentGameState = 0
var currentGameStateFunction = null

function runGame (argument) {
	currentGameStateFunction()
}

function switchGameState (newState) {
	currentGameState = newState
	switch (currentGameState){
		case GAME_STATE_MENU:
			currentGameStateFunction = gameStateMenu
			break
		case GAME_STATE_NEW_GAME:
			currentGameStateFunction = gameStateNewGame
			break
		case GAME_STATE_GAME_OVER:
			currentGameStateFunction = gameStateGameOver
			break
	}
}

function gameStateMenu () {
	
}

function gameStateNewGame () {
	
}

function gameStateGameOver () {
	
}