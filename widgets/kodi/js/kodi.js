/*
    kodi Widget-Set

    version: "0.0.3"

    Copyright 10.2015-2016 instalator<vvvalt@mail.ru>

*/
"use strict";

// add translations for edit mode
if (vis.editMode) {
    $.extend(true, systemDictionary, {
        "myColor":          {"en": "myColor",       "de": "mainColor",  "ru": "Мой цвет"},
        "myColor_tooltip":  {
            "en": "Description of\x0AmyColor",
            "de": "Beschreibung von\x0AmyColor",
            "ru": "Описание\x0AmyColor"
        },
        "htmlText":         {"en": "htmlText",      "de": "htmlText",   "ru": "htmlText"},
        "group_extraMyset": {"en": "extraMyset",    "de": "extraMyset", "ru": "extraMyset"},
        "extraAttr":        {"en": "extraAttr",     "de": "extraAttr",  "ru": "extraAttr"}
    });
}

// add translations for non-edit mode
$.extend(true, systemDictionary, {
    "Instance":  {"en": "Instance", "de": "Instanz", "ru": "Инстанция"}
});

// this code can be placed directly in kodi.html
vis.binds.kodi = {
    version: "0.0.3",
    showVersion: function () {
        if (vis.binds.kodi.version) {
            console.log('Version kodi: ' + vis.binds.kodi.version);
            vis.binds.kodi.version = null;
        }
    },
	states: {
		oid_seek:			{val: 0, selector: '', objName: 'oid_seek'},
		oid_curtimetotal:	{val: undefined, selector: '', objName: 'curtimetotal'}
	},
/***********************************************************************/	
Progress: function (widgetID, view, data, style) {
		var $div = $('#' + widgetID);
		
		if (!$div.length) {
            return setTimeout(function () {
                vis.binds.kodi.Progress(widgetID, view, data, style);
            }, 100);
        }
		
		$(function(){
			$("#progressbar").progressbar({
				value: 0
			});
		});
		
		$("#progressbar").on('click', function(e){
			var maxWidth = $($div).css("width").slice(0, -2);
			var left = $($div).css("left").slice(0, -2);
			var clickPos = e.pageX - this.offsetLeft - left;
			var percentage = clickPos / maxWidth * 100;
			vis.setValue(data.oid_seek, percentage);
			$('#progressbar').progressbar("option","value", percentage);
		});

		// subscribe on updates of value
		if (data.oid_seek) {
			vis.states.bind(data.oid_seek + '.val', function (e, newVal, oldVal) {
				$('#progressbar').progressbar("value", newVal);
			});
		}
	},
/**************************************************************************/
Button: function (widgetID, view, data, style) {
		var $div = $('#' + widgetID);
		
		if (!$div.length) {
            return setTimeout(function () {
                vis.binds.kodi.Button(widgetID, view, data, style);
            }, 100);
        }
		
		$("#kodicontrols .prev").on('click',function(){
			vis.setValue(data.oid_prev, '');
		});
		$("#kodicontrols .seekdn").on('click',function(){
			var seek = vis.states[data.oid_seek + '.val'];
			vis.setValue(data.oid_seek, seek-10);
		});
		$("#kodicontrols .playpause").on('click',function(){
			var speed = vis.states[data.oid_speed + '.val'];
			if (speed !== 0){
				vis.setValue(data.oid_speed, 0);
			} else {
				vis.setValue(data.oid_speed, 1);
			}
		});
		$("#kodicontrols .stop").on('click',function(){
			vis.setValue(data.oid_stop, '');
		});
		$("#kodicontrols .seekup").on('click',function(){
			var seek = vis.states[data.oid_seek + '.val'];
			vis.setValue(data.oid_seek, seek+10);
		});
		$("#kodicontrols .next").on('click',function(){
			vis.setValue(data.oid_next, '');
		});
		$("#kodicontrols .repeat").on('click',function(){
			var rpt = vis.states[data.oid_rpt + '.val'];
			if (rpt === 'off'){
				vis.setValue(data.oid_rpt, 'one');
			} else if (rpt === 'one'){
				vis.setValue(data.oid_rpt, 'all');
			} else if (rpt === 'all'){
				vis.setValue(data.oid_rpt, 'off');
			}
		});
		$("#kodicontrols .shuffle").on('click',function(){
			var shf = vis.states[data.oid_shf + '.val'];
			if (shf === false){
				vis.setValue(data.oid_shf, true);
			} else {
				vis.setValue(data.oid_shf, false);
			}
		});
		

		// subscribe on updates of value
		if (data.oid_speed) {
			vis.states.bind(data.oid_speed + '.val', function (e, newVal, oldVal) {
				var sp = $("#kodicontrols > .playpause");
				if (newVal == 0){
					sp.removeClass().addClass('playpause on');
				} else {
					sp.removeClass().addClass('playpause');
				}
			});
		}
		if (data.oid_rpt) {
			vis.states.bind(data.oid_rpt + '.val', function (e, newVal, oldVal) {
				var r = $("#kodicontrols > .repeat");
				if (newVal == 'off'){
					r.removeClass();
					r.addClass("repeat off");
				} else if (newVal == 'one'){
					r.removeClass();
					r.addClass("repeat one");
				} else if (newVal == 'all'){
					r.removeClass();
					r.addClass("repeat all");
				}
			});
		}
		if (data.oid_shf) {
			vis.states.bind(data.oid_shf + '.val', function (e, newVal, oldVal) {
				var s = $("#kodicontrols > .shuffle");
				if (newVal === true || newVal === 'true'){
					s.removeClass('off').addClass('on');
				} else {
					s.removeClass('on').addClass('off');
				}
			});
		}
	},
/**************************************************************************/
Playlist: function (widgetID, view, data, style) {
        var $div = $('#' + widgetID);
        // if nothing found => wait
        if (!$div.length) {
            return setTimeout(function () {
                vis.binds.kodi.Playlist(widgetID, view, data, style);
            }, 100);
        }

		function SetPlaylist(val){
			var playlist = JSON.parse(val);
			playlist = playlist.items;
			$("#playListContainer").empty();
			playlist.forEach(function(item, i, arr) {
				$("#playListContainer").append("<li class='item"+(i+1)+"'>"+(i+1)+' - '+playlist[i].label+"</li>");
			});
			$("#playListContainer .item"+(parseInt(vis.states[data.oid_position + '.val'])+1)).addClass("active");			
			$('#playListContainer').on('click', "li", function(){
				  var n=$(this).index();
				  vis.setValue(data.oid_position, n);
			});
		}
		// subscribe on updates of value
		if (data.oid_playlist) {
			vis.states.bind(data.oid_playlist + '.val', function (e, newVal, oldVal) {
				SetPlaylist(newVal);
			});
		}
		if (data.oid_position) {
			vis.states.bind(data.oid_position + '.val', function (e, newVal, oldVal) {
				$("#playListContainer li").removeClass("active");
				newVal++;
				$("#playListContainer .item"+newVal).addClass("active");
			});
		}
		if ($div.length){
			SetPlaylist(vis.states[data.oid_playlist + '.val']);
		}
		
	},
/************************************************************************/
CodecInfo: function (widgetID, view, data, style) {
        var $div = $('#' + widgetID);
        // if nothing found => wait
        if (!$div.length) {
            return setTimeout(function () {
                vis.binds.kodi.CodecInfo(widgetID, view, data, style);
            }, 100);
        }
		function SetCodecInfo(val){
			$('.kodiinfo > .codec').css('backgroundImage', 'url(./widgets/kodi/img/audio/'+val+'.png)');
		}
		// subscribe on updates of value
		if (data.oid_codec) {
			vis.states.bind(data.oid_codec + '.val', function (e, newVal, oldVal) {
				SetCodecInfo(newVal);
			});
		}
		if ($div.length){
			SetCodecInfo(vis.states[data.oid_codec + '.val']);
		}	
	},
/************************************************************************/
AspectInfo: function (widgetID, view, data, style) {
        var $div = $('#' + widgetID);
        // if nothing found => wait
        if (!$div.length) {
            return setTimeout(function () {
                vis.binds.kodi.AspectInfo(widgetID, view, data, style);
            }, 100);
        }
		function SetAspectInfo(val){
			val = parseFloat(val).toFixed(2);
			$('.kodiinfo > .aspect').css('backgroundImage', 'url(./widgets/kodi/img/aspectratio/'+val+'.png)');
		}
		// subscribe on updates of value
		if (data.oid_aspect) {
			vis.states.bind(data.oid_aspect + '.val', function (e, newVal, oldVal) {
				SetAspectInfo(newVal);
			});
		}
		if ($div.length){
			SetAspectInfo(vis.states[data.oid_aspect + '.val']);
		}	
	},
/************************************************************************/
ResolutInfo: function (widgetID, view, data, style) {
        var $div = $('#' + widgetID);
        // if nothing found => wait
        if (!$div.length) {
            return setTimeout(function () {
                vis.binds.kodi.ResolutInfo(widgetID, view, data, style);
            }, 100);
        }
		function SetResolutInfo(val){
			$('.kodiinfo > .resolut').css('backgroundImage', 'url(./widgets/kodi/img/video/'+val+'.png)');
		}
		// subscribe on updates of value
		if (data.oid_resolut) {
			vis.states.bind(data.oid_resolut + '.val', function (e, newVal, oldVal) {
				SetResolutInfo(newVal);
			});
		}
		if ($div.length){
			SetResolutInfo(vis.states[data.oid_resolut + '.val']);
		}	
	},
/************************************************************************/
ChannelInfo: function (widgetID, view, data, style) {
        var $div = $('#' + widgetID);
        // if nothing found => wait
        if (!$div.length) {
            return setTimeout(function () {
                vis.binds.kodi.ChannelInfo(widgetID, view, data, style);
            }, 100);
        }
		function SetResolutInfo(val){
			$('.kodiinfo > .channel').css('backgroundImage', 'url(./widgets/kodi/img/audio/'+val+'.png)');
		}
		// subscribe on updates of value
		if (data.oid_channel) {
			vis.states.bind(data.oid_channel + '.val', function (e, newVal, oldVal) {
				SetResolutInfo(newVal);
			});
		}
		if ($div.length){
			SetResolutInfo(vis.states[data.oid_channel + '.val']);
		}	
	},
/************************************************************************/
VideoCodec: function (widgetID, view, data, style) {
        var $div = $('#' + widgetID);
        // if nothing found => wait
        if (!$div.length) {
            return setTimeout(function () {
                vis.binds.kodi.VideoCodec(widgetID, view, data, style);
            }, 100);
        }
		function SetResolutInfo(val){
			$('.kodiinfo > .videocodec').css('backgroundImage', 'url(./widgets/kodi/img/video/'+val+'.png)');
		}
		// subscribe on updates of value
		if (data.oid_videocodec) {
			vis.states.bind(data.oid_videocodec + '.val', function (e, newVal, oldVal) {
				SetResolutInfo(newVal);
			});
		}
		if ($div.length){
			SetResolutInfo(vis.states[data.oid_videocodec + '.val']);
		}
	}
/***********************************************************************/

};
	/*if (vis.editMode) {
		vis.binds.kodi.changeOid = function (widgetID, view, newId, attr, isCss) {
			//console.log('---------: ' + widgetID +' - '+view+' - '+newId+' - '+attr+' - '+isCss);
			newId = newId ? newId.substring(0, newId.length - attr.length + 'oid_'.length) : '';
			var changed = [];
			for (var s in vis.binds.kodi.states) {
				if (s === 'oid_curtime' || !vis.binds.kodi.states[s].objName) continue;
				if (vis.objects[newId + vis.binds.kodi.states[s].objName]) {
					changed.push(s);
					vis.views[view].widgets[widgetID].data[s] 	= newId + vis.binds.kodi.states[s].objName;
					vis.widgets[widgetID].data[s] 				= newId + vis.binds.kodi.states[s].objName;
				}
			}
			return changed;
	};
}*/

vis.binds.kodi.showVersion();
