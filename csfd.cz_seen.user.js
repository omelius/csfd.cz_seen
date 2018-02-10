// ==UserScript==
// @name		csfd.cz_seen
// @namespace	csfd.cz
// @description	Hide already seen movies on csfd.cz
// @version		8
// @author		Marian Omelka
// @match		https://www.csfd.cz/*
// @require		https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant		GM_deleteValue
// @grant		GM_getValue
// @grant		GM_listValues
// @grant		GM_setValue
// ==/UserScript==

// Log all variables
let keys = GM_listValues();
for(let key of keys){
	console.log(key + ' - ' + JSON.stringify(GM_getValue(key)));
}

// Hide floating div with Seen / Unseen button
function hideBox(){
	jQuery('div.floatingPanel').remove();
}

// Function used to iterate over every movie in the page
function parseCsfd(){
	var movieId = jQuery(this).attr('href').split('/')[2].split('-')[0];
	var episodeId = jQuery(this).attr('href').split('/')[3].split('-')[0];
	var hiddenMovies = JSON.parse(GM_getValue('hiddenMovies','[]'));
	var seenMovies = JSON.parse(GM_getValue('seenMovies','[]'));
	if(hiddenMovies.includes(movieId)){
		var addClass = 'hiddenMovie';
		if(GM_getValue('showHiddenMovies') !== true){
			var hide = true;
		}
	}
	else if(hiddenMovies.includes(movieId + '/' + episodeId)){
		var addClass = 'hiddenEpisode';
		if(GM_getValue('showHiddenMovies') !== true){
			var hide = true;
		}
	}
	else if(seenMovies.includes(movieId)){
		var addClass = 'seenMovie';
		if(GM_getValue('showSeenMovies') !== true){
			var hide = true;
		}
	}
	else if(seenMovies.includes(movieId + '/' + episodeId)){
		var addClass = 'seenEpisode';
		if(GM_getValue('showSeenMovies') !== true){
			var hide = true;
		}
	}
	jQuery(this).parent('div.name').parent('div.right').parent('li').addClass(addClass);
	jQuery(this).parent('span.name').parent('div.text').parent('div.box').addClass(addClass);
	jQuery(this).parent('h3.subject').parent('div').parent('li').addClass(addClass);
	jQuery(this).parent('td.film').parent('tr').addClass(addClass);

	if(hide){
		jQuery(this).parent('div.name').parent('div.right').parent('li').hide();
		jQuery(this).parent('span.name').parent('div.text').parent('div.box').hide();
		jQuery(this).parent('h3.subject').parent('div').parent('li').hide();
		jQuery(this).parent('td.film').parent('tr').hide();
	}

	jQuery(this).parent('div.name').parent('div.right').parent('li').hover(showBox,hideBox);
	jQuery(this).parent('span.name').parent('div.text').parent('div.box').hover(showBox,hideBox);
	jQuery(this).parent('h3.subject').parent('div').parent('li').hover(showBox,hideBox);
	jQuery(this).parent('td.film').parent('tr').hover(showBox,hideBox);
}

// Show floating div with Seen / Unseen button
function showBox(){
	var movieId = jQuery(this).find('a.film.c0,a.film.c1,a.film.c2,a.film.c3').attr('href').split('/')[2].split('-')[0];
	var episodeId = jQuery(this).find('a.film.c0,a.film.c1,a.film.c2,a.film.c3').attr('href').split('/')[3].split('-')[0];
	if(jQuery(this).hasClass('hiddenMovie') || jQuery(this).hasClass('hiddenEpisode') || jQuery(this).hasClass('seenMovie') || jQuery(this).hasClass('seenEpisode')){
		if(jQuery(this).hasClass('hiddenMovie')){
			jQuery(this).append('<div class="floatingPanel"><input type="button" movieId="' + movieId + '" class="alreadySeen" value="Unhide Movie" /></div>');
		} else if(jQuery(this).hasClass('hiddenEpisode')){
			jQuery(this).append('<div class="floatingPanel"><input type="button" movieId="' + movieId + '/' + episodeId + '" class="alreadySeen" value="Unhide Episode" /></div>');
		} else if(jQuery(this).hasClass('seenMovie')){
			jQuery(this).append('<div class="floatingPanel"><input type="button" movieId="' + movieId + '" class="alreadySeen" value="Unseen Movie" /></div>');
		} else if(jQuery(this).hasClass('seenEpisode')){
			jQuery(this).append('<div class="floatingPanel"><input type="button" movieId="' + movieId + '/' + episodeId + '" class="alreadySeen" value="Unseen Episode" /></div>');
		}
	} else {
		jQuery(this).append('<div class="floatingPanel"><input type="button" movieId="' + movieId + '" class="alreadySeen" value="Hide Movie" /></div>');
		jQuery(this).append('<div class="floatingPanel"><input type="button" movieId="' + movieId + '" class="alreadySeen" value="Seen Movie" /></div>');
		if(episodeId > 0){
			jQuery(this).append('<div class="floatingPanel"><input type="button" movieId="' + movieId + '/' + episodeId + '" class="alreadySeen" value="Hide Episode" /></div>');
			jQuery(this).append('<div class="floatingPanel"><input type="button" movieId="' + movieId + '/' + episodeId + '" class="alreadySeen" value="Seen Episode" /></div>');
		}
	}
	jQuery('.alreadySeen').click(toggleMovie);
}

// Toggle movie between Seen and Unseen state
function toggleMovie(){
	var movieId = jQuery(this).attr('movieId');
	var hiddenMovies = JSON.parse(GM_getValue('hiddenMovies','[]'));
	var seenMovies = JSON.parse(GM_getValue('seenMovies','[]'));
	if(jQuery(this).val() === 'Hide Movie' || jQuery(this).val() === 'Hide Episode'){
		hiddenMovies.push(movieId);
		hiddenMovies.sort();
	} else if(jQuery(this).val() === 'Seen Movie' || jQuery(this).val() === 'Seen Episode'){
		seenMovies.push(movieId);
		seenMovies.sort();
	} else if(jQuery(this).val() === 'Unhide Movie' || jQuery(this).val() === 'Unhide Episode'){
		var indexValue = hiddenMovies.indexOf(movieId);
		if(indexValue > -1){
			hiddenMovies.splice(indexValue,1);
		}
	} else if(jQuery(this).val() === 'Unseen Movie' || jQuery(this).val() === 'Unseen Episode'){
		var indexValue = seenMovies.indexOf(movieId);
		if(indexValue > -1){
			seenMovies.splice(indexValue,1);
		}
	}
	GM_setValue('hiddenMovies',JSON.stringify(hiddenMovies));
	GM_setValue('seenMovies',JSON.stringify(seenMovies));
	location.reload();
}

// Toggle view state of Hidden movies
function toggleShowHiddenMovies(){
	GM_setValue('showHiddenMovies',jQuery(this).is(':checked'));
	location.reload();
}

// Toggle view state of Seen movies
function toggleShowSeenMovies(){
	GM_setValue('showSeenMovies',jQuery(this).is(':checked'));
	location.reload();
}

// Top left settings menu
jQuery('body').append(`
	<fieldset id='settings' style='position:fixed;top:0;border:.1em solid black;padding:.2em;margin:1em;'>
		<legend>Seen Movies Settings</legend>
		<input type='checkbox' id='showHiddenMovies' />Show hidden movies<br />
		<input type='checkbox' id='showSeenMovies' />Show seen movies
		<input type='hidden' id='settingsItem' />
	</fieldset>`);
if(GM_getValue('showHiddenMovies') === true){
	jQuery('#showHiddenMovies').prop('checked',true);
}
if(GM_getValue('showSeenMovies') === true){
	jQuery('#showSeenMovies').prop('checked',true);
}
jQuery('#showHiddenMovies').change(toggleShowHiddenMovies);
jQuery('#showSeenMovies').change(toggleShowSeenMovies);

if(document.location.pathname.startsWith('/film/')){
	var movieId = document.location.pathname.split('/')[2].split('-')[0];
	var episodeId = document.location.pathname.split('/')[3].split('-')[0];
	var hiddenMovies = JSON.parse(GM_getValue('hiddenMovies','[]'));
	var seenMovies = JSON.parse(GM_getValue('seenMovies','[]'));

	if(hiddenMovies.includes(movieId)){
		jQuery('#settingsItem').addClass('hiddenMovie');
	}
	if(hiddenMovies.includes(movieId + '/' + episodeId)){
		jQuery('#settingsItem').addClass('hiddenEpisode');
	}
	if(seenMovies.includes(movieId)){
		jQuery('#settingsItem').addClass('seenMovie');
	}
	if(seenMovies.includes(movieId + '/' + episodeId)){
		jQuery('#settingsItem').addClass('seenEpisode');
	}

	if(jQuery('#settings').hasClass('hiddenMovie') || jQuery('#settingsItem').hasClass('hiddenEpisode') || jQuery('#settingsItem').hasClass('seenMovie') || jQuery('#settingsItem').hasClass('seenEpisode')){
		if(jQuery('#settingsItem').hasClass('hiddenMovie')){
			jQuery('fieldset#settings').append('<div class="floatingPanel"><input type="button" movieId="' + movieId + '" class="alreadySeen" value="Unhide Movie" /></div>');
		} else if(jQuery('#settingsItem').hasClass('hiddenEpisode')){
			jQuery('fieldset#settings').append('<div class="floatingPanel"><input type="button" movieId="' + movieId + '/' + episodeId + '" class="alreadySeen" value="Unhide Episode" /></div>');
		} else if(jQuery('#settingsItem').hasClass('seenMovie')){
			jQuery('fieldset#settings').append('<div class="floatingPanel"><input type="button" movieId="' + movieId + '" class="alreadySeen" value="Unseen Movie" /></div>');
		} else if(jQuery('#settingsItem').hasClass('seenEpisode')){
			jQuery('fieldset#settings').append('<div class="floatingPanel"><input type="button" movieId="' + movieId + '/' + episodeId + '" class="alreadySeen" value="Unseen Episode" /></div>');
		}
	} else {
		jQuery('fieldset#settings').append('<div class="floatingPanel"><input type="button" movieId="' + movieId + '" class="alreadySeen" value="Hide Movie" /></div>');
		jQuery('fieldset#settings').append('<div class="floatingPanel"><input type="button" movieId="' + movieId + '" class="alreadySeen" value="Seen Movie" /></div>');
		if(episodeId > 0){
			jQuery('fieldset#settings').append('<div class="floatingPanel"><input type="button" movieId="' + movieId + '/' + episodeId + '" class="alreadySeen" value="Hide Episode" /></div>');
			jQuery('fieldset#settings').append('<div class="floatingPanel"><input type="button" movieId="' + movieId + '/' + episodeId + '" class="alreadySeen" value="Seen Episode" /></div>');
		}
	}
	jQuery('.alreadySeen').click(toggleMovie);
} else {
	// CSS styles for seen movies
	if(GM_getValue('showHiddenMovies') === true){
		jQuery('head').append('<style type="text/css">.hiddenMovie{opacity:.33;}.hiddenMovie:hover{opacity:.66;}</style>');
		jQuery('head').append('<style type="text/css">.hiddenEpisode{opacity:.33;}.hiddenEpisode:hover{opacity:.66;}</style>');
	}
	if(GM_getValue('showSeenMovies') === true){
		jQuery('head').append('<style type="text/css">.seenMovie{opacity:.33;}.seenMovie:hover{opacity:.66;}</style>');
		jQuery('head').append('<style type="text/css">.seenEpisode{opacity:.33;}.seenEpisode:hover{opacity:.66;}</style>');
	}

	// Iterate over all films
	jQuery('a.film.c0,a.film.c1,a.film.c2,a.film.c3,td.film a').each(parseCsfd);
}