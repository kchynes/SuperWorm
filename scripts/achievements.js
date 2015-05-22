function incrementAchievementProgress(id, increment){
	_ACHIEVEMENTS[id].Progress += increment;
	checkAchievementProgress(id);
}

function updateAchievementProgress(id, updatedValue){
	if(_ACHIEVEMENTS[id].Progress < updatedValue){
		_ACHIEVEMENTS[id].Progress = updatedValue;
		checkAchievementProgress(id);
	}
}

function checkAchievementProgress(id){
	if(_ACHIEVEMENTS[id].Progress == _ACHIEVEMENTS[id].Total){
		$(".modal-body #AchievementMessageText").text( _ACHIEVEMENTS[id].Desc);
		$('#AchievementMessage').modal();      
	}
	loadAchievements();
}