var apiswf = null;

var lastPlayState = 2;

var trackPlaying = "";

$(function() {
    playback_token = "";
    domain = "";
    $.getJSON("/ajax/player/playbacktoken", {}, function(result) {
        domain = result.result.domain;
        playback_token = result.result.token;
        // on page load use SWFObject to load the API swf into div#apiswf
        var flashvars = {
            'playbackToken': playback_token, // from token.js
            'domain': domain, // from token.js
            'listener': 'callback_object'    // the global name of the object that will receive callbacks from the SWF
        };
        var params = {
            'allowScriptAccess': 'always'
        };
        var attributes = {};
        swfobject.embedSWF('http://www.rdio.com/api/swf/', // the location of the Rdio Playback API SWF
                'apiswf', // the ID of the element that will be replaced with the SWF
                1, 1, '9.0.0', 'expressInstall.swf', flashvars, params, attributes);
    });


    $("#progress-bar").progressbar({
        value: 0
    });

    $("#volume").slider({
        value: 60,
        orientation: "horizontal",
        range: "min",
        min: 0,
        max: 100,
        animate: true,
        disabled: true,
        change: atualizaVolume,
        slide: atualizaVolume
    });

    $("#beginning").button({
        text: false,
        icons: {
            primary: "ui-icon-seek-start"
        },
        disabled: true
    }).click(function(){
        prevTrack(true);
    });

    $("#play").button({
        text: false,
        icons: {
            primary: "ui-icon-play"
        },
        disabled: true
    }).click(play);

    $("#pause").button({
        text: false,
        icons: {
            primary: "ui-icon-pause"
        },
        disabled: true
    }).click(pause);

    $("#end").button({
        text: false,
        icons: {
            primary: "ui-icon-seek-end"
        },
        disabled: true
    }).click(function() {
        nextTrack(true);
    });
    $("#queryok").button({
        text: false,
        icons: {
            primary: "ui-icon-search"
        }
    });


    $('#queryok').click(function() {
        query = $('#term').val();
        if (query.length >= 3) {
            $.getJSON("/ajax/player/search", {query: query}, function(result) {
                populaResultado(result);
            });
        } else {
            alert('Preencha o campo de busca!');
        }
    });

});


function atualizaVolume() {
    var volume = $("#volume").slider("value");
    volume = volume * 0.01;
    apiswf.rdio_setVolume(volume);
}
function populaResultado(result) {
    html = "";
    if (result.result.length > 0) {

        $.each(result.result, function(i, item) {
            addcss = "";
            if (i % 2 !== 0) {
                addcss = "result-second-column";
            }
            hitem = '<li class="result ' + addcss + '">\n\
                        <a href="javascript:;" onclick="playtrack(\'' + item.key + '\');" id="search_' + item.key + '" key="' + item.key + '" class="link">\n\
                        <img class="icon" src="http://rdio-c.cdn3.rdio.com/' + item.icon + '" />\n\
                        <span class="info">\n\
                        <span class="title">' + item.title + '</span>\n\
                        <span class="addinfo">' + item.additional_info + '</span>\n\
                        <span class="addinfo2">' + item.additional_info2 + '</span>\n\
                        <span class="duration">' + item.duration + '</span>\n\
                        </span>\n\
                        </a>\n\
                    </li>';
            html += hitem;
        });
    }
    $('#results-container .results').html(html);

}

String.prototype.replaceAll = function(de, para) {
    var str = this;
    var pos = str.indexOf(de);
    while (pos > -1) {
        str = str.replace(de, para);
        pos = str.indexOf(de);
    }
    return (str);
}

function playtrack(key) {
    if ($("#playlist_" + key).length > 0) {
        trackPlaying = key;
        apiswf.rdio_play(key);
    } else {
        tmp = $("#search_" + key).parent();
        hitem = $(tmp).wrap('<div>').parent().html();
        $(tmp).unwrap();
        hitem = hitem.replaceAll("search_", "playlist_");
        hitem = hitem.replaceAll("result-second-column", "");
        hitem = hitem.replaceAll("\"result", "\"item");
        $("#playlist .list").append(hitem);
        if (lastPlayState === 2) {
            trackPlaying = key;
            apiswf.rdio_play(key);
        }
    }

}

function nextTrack(loop) {
    if (trackPlaying !== "") {
        next = $("#playlist_" + trackPlaying).parent().next();
        if (next.length > 0) {
            if ($(next).find("a").attr('key') !== trackPlaying) {
                $(next).find("a").click();
            }
        } else if (loop === true) {
            next = $("#playlist .list .item:first");
            if (next.length > 0) {
                if ($(next).find("a").attr('key') !== trackPlaying) {
                    $(next).find("a").click();
                }
            }
        }
    }
}

function prevTrack(loop) {
    if (trackPlaying !== "") {
        prev = $("#playlist_" + trackPlaying).parent().prev();
        if (prev.length > 0) {
            if ($(prev).find("a").attr('key') !== trackPlaying) {
                $(prev).find("a").click();
            }
        } else if (loop === true) {
            prev = $("#playlist .list .item:last");
            if (prev.length > 0) {
                if ($(prev).find("a").attr('key') !== trackPlaying) {
                    $(prev).find("a").click();
                }
            }
        }
    }
}


function play() {
    apiswf.rdio_play();
}

function pause() {
    apiswf.rdio_pause();
}

function secondToTime(totalseconds) {
    var sec_num = parseInt(totalseconds, 10);
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    var time = minutes + ':' + seconds;
    return time;
}

// the global callback object
var callback_object = {};

callback_object.ready = function ready(user) {
    // Called once the API SWF has loaded and is ready to accept method calls.

    // find the embed/object element
    apiswf = $('#apiswf').get(0);

    apiswf.rdio_startFrequencyAnalyzer({
        frequencies: '10-band',
        period: 100
    });

    apiswf.rdio_setVolume(0.6);

}

callback_object.playingTrackChanged = function playingTrackChanged(playingTrack, sourcePosition) {
    // The currently playing track has changed.
    // Track metadata is provided as playingTrack and the position within the playing source as sourcePosition.
    if (playingTrack != null) {
        $("#progress-bar").progressbar("value", 0);
        $("#progress-bar").progressbar("option", "max", playingTrack.duration);

        $("#current-time").html(secondToTime(0));
        $("#total-time").html(secondToTime(playingTrack.duration));
        $("#name .first").html(playingTrack.name + " - " + playingTrack.artist);
        $("#name .second").html(playingTrack.album);

        $('.main .content .player-container .player .controls .buttons .button:not(#play)').button("option", "disabled", false);
        $('#volume').slider("option", "disabled", false);

    }
}

callback_object.positionChanged = function positionChanged(position) {
    //The position within the track changed to position seconds.
    // This happens both in response to a seek and during playback.
    $("#progress-bar").progressbar("value", position);
}


callback_object.playStateChanged = function playStateChanged(playState) {
    lastPlayState = playState;
    // The playback state has changed.
    // The state can be: 0 - paused, 1 - playing, 2 - stopped, 3 - buffering or 4 - paused.
    if (playState === 0 || playState === 4) {
        $('.main .content .player-container .player .controls .buttons .button:not(#pause)').button("option", "disabled", false);
        $('#pause').button("option", "disabled", true);
    } else if (playState === 1) {
        $('.main .content .player-container .player .controls .buttons .button:not(#play)').button("option", "disabled", false);
        $('#play').button("option", "disabled", true);
    } else {
        setTimeout(function() {
            if (lastPlayState === 2) {
                $('.main .content .player-container .player .controls .buttons .button').button("option", "disabled", true);
                $('#volume').slider("option", "disabled", true);
                nextTrack(false);
            }
        }, 1500);

    }
}