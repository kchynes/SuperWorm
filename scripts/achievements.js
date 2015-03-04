function incrementAchievementProgress(id, increment){
	_ACHIEVEMENTS[id].Progress += increment;
}

function updateAchievementProgress(id, updatedValue){
	if(_ACHIEVEMENTS[id].Progress < updatedValue)
		_ACHIEVEMENTS[id].Progress = updatedValue;
}