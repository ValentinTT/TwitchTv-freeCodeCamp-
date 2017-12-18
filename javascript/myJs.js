$(document).ready(function($) {
	/*Some channels that usually stream*/
	var channels = ["ESL_SC2", "OgamingSC2", "cretetion",
		"freecodecamp", "storbeck", "habathcx",
		"RobotCaleb", "noobs2ninjas", "cosmos"
	];
	//Object that contain the channels data.
	var channelsStatus = channels.map(function(channel) {
		return {
			channelName: channel,
			channelLogo: "", //Image to be displayed.
			channelUrl: "",
			channelStream: false,
			channelStreamDescription: ""
		};
	});
	channelsSuggested();

	/*
	*searchChannel(channel) make a request at twitch for a channel
	*and display it.
	*/
	function searchChannel(channel) {
		//In case channel wasn't a string.
		if (typeof channel != "string") return; 

		channelResult = {
			channelName: channel,
			channelLogo: "",
			channelUrl: "",
			channelStream: false,
			channelStreamDescription: ""
		};
		//Twitch request.
		$.getJSON('https://wind-bow.gomix.me/twitch-api/channels/' + encodeURI(channel) + "?callback=?", function(data) {
			channelResult.channelLogo = data.logo == undefined ? "img/img-aux.jpg" : data.logo;
			channelResult.channelUrl = data.url;
			$.getJSON('https://wind-bow.gomix.me/twitch-api/streams/' + encodeURI(channel) + "?callback=?", function(data) {
				if (data.stream == null) {
					appendChannel(channelResult, true);
					return;
				}
				if (data.stream.stream_type != "live") {
					appendChannel(channelResult, true);
					return;
				}
				channelResult.channelStream = true;
				channelResult.channelStreamDescription = data.stream.game;
				appendChannel(channelResult, true);
			});
		});
	}
	/*
	*This function search all the suggested channels by freecodecamp
	*and print them on the screen.
	*/
	function channelsSuggested() {
		var resultados = [];
		channels.forEach(function(channel) {
			$.getJSON('https://wind-bow.gomix.me/twitch-api/channels/' + encodeURI(channel) + "?callback=?", function(data) {
				var index = channels.indexOf(channel);
				channelsStatus[index].channelLogo = data.logo;
				channelsStatus[index].channelUrl = data.url;
				$.getJSON('https://wind-bow.gomix.me/twitch-api/streams/' + encodeURI(channel) + "?callback=?", function(data) {
					var index = channels.indexOf(channel);
					if (data.stream == null) {
						appendChannel(channelsStatus[index], false);
						return;
					}
					if (data.stream.stream_type != "live") {
						appendChannel(channelsStatus[index], false);
						return;
					}
					channelsStatus[index].channelStream = true;
					channelsStatus[index].channelStreamDescription = data.stream.game;
					appendChannel(channelsStatus[index], false);
				});
			});
		});
	}
	/*
	*This function create a channel's cards to append at the section 
	*which is inside the article tag.
	*channel = object with the data necesary to by displayer
	*removePrevius = delete all the cards that already exist
	*/
	function appendChannel(channel, removePrevius = false) {
		if (removePrevius) { //Remove all the cards.
			$(".search-results div").remove();
			if (channel.channelUrl == undefined) {
				/*If the channel doesn't have a url it means it doesn't exist
				*and a h4 tag is displayed with a message to inform this to the user
				*/
				$("article .no-channel-found").css('display', 'inline');
				return;
			}
		}
		//Hide the channel-not found in case it was visible.
		$("article .no-channel-found").css('display', 'none');

		//Variables necesary in case the channel is already streaming
		var isOnline = "";
		var connectionDot = "";
		var gameDescription = "";
		if (channel.channelStream) {
			isOnline = "online";
			connectionDot = "#A5CF35";
			gameDescription = '<p class="channel-game-description">' + channel.channelStreamDescription + '</p>'
		} else {
			isOnline = "offline";
			connectionDot = "red";
		}
		var channelHtml = '<div class="channel-container"><div class="img-channel-container"><img src="' + channel.channelLogo + '" alt="' + channel.channelName + 's image" class="img-channel"></div><div class="channel-info-container"><h6 class="channel-name">' + channel.channelName + '</h6><a href="' + channel.channelUrl + '" target="_blank"><i style="color: ' + connectionDot + '" class="fas fa-circle fa-xs"></i> ' + isOnline + '</a>' + gameDescription + '</div></div>'
		$(".search-results").append(channelHtml);
	}

	/*Listeners in charge of start searching*/
	$('.fa-search').on('click', function() {
		if ($(".search-input").val().trim() !== "") {
			var channelToSearch = $(".search-input").val().trim().replace(/\s/g, '');
			searchChannel(channelToSearch);
			$(".search-input").val("");
		}
	});
	$('.search-input').on("keydown", function(e) {
		if (e.keyCode === 13 & $(".search-input").val().trim() !== "") {
			var channelToSearch = $(".search-input").val().trim().replace(/\s/g, '');
			searchChannel(channelToSearch);
			$(".search-input").val("");
		}
	});
});