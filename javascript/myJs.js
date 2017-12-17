$(document).ready(function($) {
	var channels = ["ESL_SC2", "OgamingSC2", "cretetion",
		"freecodecamp", "storbeck", "habathcx",
		"RobotCaleb", "noobs2ninjas", "cosmos"
	];
	var channelsStatus = channels.map(function(channel) {
		return {
			channelName: channel,
			channelLogo: "",
			channelUrl: "",
			channelStream: false,
			channelStreamDescription: ""
		};
	});
	channelsSuggested();
	$('.fa-search').on('click', function() {
		/*var searchInputVisibility = $('.search-input').css('visibility');
		if (searchInputVisibility == "hidden") {
			$('.search-input').css('visibility', 'visible');
			$('.search-input').fadeIn(200);
		} else {
			$('.search-input').css('visibility', 'hidden');
			$('.search-input').fadeOut(200);			
		}*/
		searchChannel();
		console.log(channelsStatus);
	});
	$('.search-input').on("keydown", function(e) {
		if (e.keyCode === 13 & $(".search-input").val().trim() !== "") {
			searchChannel();
		}
	});

	function searchChannel() {

	}

	function channelsSuggested() {
		//console.log(channelsStatus);
		var resultados = [];
		channels.forEach(function(channel) {
			$.getJSON('https://wind-bow.gomix.me/twitch-api/channels/' + encodeURI(channel) + "?callback=?", function(data) {
				//console.log("users data: ", data);
				var index = channels.indexOf(channel);
				channelsStatus[index].channelLogo = data.logo;
				channelsStatus[index].channelUrl = data.url;
			});
			$.getJSON('https://wind-bow.gomix.me/twitch-api/streams/' + encodeURI(channel) + "?callback=?", function(data) {
				//console.log("streams data: ", data);
				if (data.stream == null) return;
				if (data.stream.stream_type != "live")	return;
				var index = channels.indexOf(channel);
				channelsStatus[index].channelStream = true;
				channelsStatus[index].channelStreamDescription = data.stream.game;
			});
		});
	}

});