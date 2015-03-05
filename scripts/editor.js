// Mouse Event Listner
editorCanvas.addEventListener('mousedown', function(e) {
	//editorCanvas.addEventListener('mousemove', function(){
		var mousePos = getMousePosition(editorCanvas, e);
		var x_pos = Math.floor(mousePos.x/_EDITOR.cellSize)*_EDITOR.cellSize;
		var y_pos = Math.floor(mousePos.y/_EDITOR.cellSize)*_EDITOR.cellSize;
		if(e.which == 3)
			eraseWallCell(x_pos, y_pos);
		else{
			if(_EDITOR.walls.length >= _EDITOR.size)
				_EDITOR.walls.shift();

			if(!checkCollision(x_pos, y_pos, _EDITOR.walls)){
				var wall = {x: x_pos, y: y_pos};
				_EDITOR.walls.push(wall);
				paintEditorWalls();
			}
		}
		_EDITOR.saved = false;
		displaySaveIcon(_EDITOR.saved);
	//}, false);
}, false);

// Mouse Up Event Listener
editorCanvas.addEventListener('mouseup', function(e) {
	//editorCanvas.removeEventListener('mousemove', function(){}, false);
}, false);

function paintEditorGrid(){

	for (var x = 0; x < editorCanvas.width; x += _EDITOR.cellSize) {
	  editorContext.moveTo(x, 0);
	  editorContext.lineTo(x, editorCanvas.height);
	}

	for (var y = 0; y < editorCanvas.height; y += _EDITOR.cellSize) {
	  editorContext.moveTo(0, y);
	  editorContext.lineTo(editorCanvas.width, y);
	}

	editorContext.strokeStyle = "#ddd";
	editorContext.stroke();

}

function getMousePosition(canvas, e) {
	var rect = canvas.getBoundingClientRect();
	return {
	  x: e.clientX - rect.left,
	  y: e.clientY - rect.top
	};
}

function eraseWallCell(x, y){
	var eraseIndex = 0;
	var eraseFlag = false;
	for(var i = 0; i < _EDITOR.walls.length; ++i){
		if(x == _EDITOR.walls[i].x && y == _EDITOR.walls[i].y){
			eraseIndex = i;
			eraseFlag = true;
		}
	}

	if(eraseFlag){
		_EDITOR.walls.splice(eraseIndex,1);
		paintEditorWalls();
	}
}

function paintEditorWalls(){

	editorContext.clearRect(0,0,editorCanvas.width,editorCanvas.height);
	displayWallCellsLeft();
	paintEditorGrid();
	for(var i = 0; i < _EDITOR.walls.length; ++i){
		editorContext.fillStyle = "#06C";
		editorContext.fillRect(_EDITOR.walls[i].x, _EDITOR.walls[i].y, _EDITOR.cellSize, _EDITOR.cellSize);
	}
}

function displayWallCellsLeft(){
	document.getElementById("editorCellsLeft").innerHTML = _EDITOR.size - _EDITOR.walls.length;
}

function clearEditor(){
	editorContext.clearRect(0,0,editorCanvas.width,editorCanvas.height);
	paintEditorGrid();
	_EDITOR.walls = [];
	displayWallCellsLeft();
}

function displaySaveIcon(saved){
	var editorSavedIcon = "glyphicon glyphicon-ok-sign";
	var editorUnSavedIcon = "glyphicon glyphicon-remove-sign";
	var icon = document.getElementById("saveIcon");
	var saveText = document.getElementById("saveProgress");

	if(!saved){
		icon.className = icon.className.replace(editorSavedIcon, "");
		icon.className = icon.className+editorUnSavedIcon;
		saveText.innerHTML = "Save";

	}else{
		icon.className = icon.className.replace(editorUnSavedIcon, "");
		icon.className = icon.className+editorSavedIcon;
		saveText.innerHTML = "Saved";
	}
}

function saveCustomWalls(){

	// Reset and make a deep copy clone
	_WALLS = [];

	// Transistion the editor size to the game size
	for(var i = 0; i < _EDITOR.walls.length; ++i)
	{
		var savedWall = {x: 0, y: 0};
		savedWall.x = _EDITOR.walls[i].x/_EDITOR.cellSize;
		savedWall.y = _EDITOR.walls[i].y/_EDITOR.cellSize;

		_WALLS.push(savedWall);
	}

	_EDITOR.saved = true;
	displaySaveIcon(_EDITOR.saved);
}