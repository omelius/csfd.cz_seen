// ==UserScript==
// @name		csfd.cz_seen
// @namespace	csfd.cz
// @description	Hide already seen movies on csfd.cz
// @version		6
// @author		Marian Omelka
// @match		https://www.csfd.cz/televize/*
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
		jQuery(this).parent('div.name').parent('div.right').parent('li').addClass('hiddenMovie');
		jQuery(this).parent('span.name').parent('div.text').parent('div.box').addClass('hiddenMovie');
		if(GM_getValue('showHiddenMovies') !== true){
			jQuery(this).parent('div.name').parent('div.right').parent('li').hide();
			jQuery(this).parent('span.name').parent('div.text').parent('div.box').hide();
		}
	}
	if(hiddenMovies.includes(movieId + '/' + episodeId)){
		jQuery(this).parent('div.name').parent('div.right').parent('li').addClass('hiddenEpisode');
		jQuery(this).parent('span.name').parent('div.text').parent('div.box').addClass('hiddenEpisode');
		if(GM_getValue('showHiddenMovies') !== true){
			jQuery(this).parent('div.name').parent('div.right').parent('li').hide();
			jQuery(this).parent('span.name').parent('div.text').parent('div.box').hide();
		}
	}
	if(seenMovies.includes(movieId)){
		jQuery(this).parent('div.name').parent('div.right').parent('li').addClass('seenMovie');
		jQuery(this).parent('span.name').parent('div.text').parent('div.box').addClass('seenMovie');
		if(GM_getValue('showSeenMovies') !== true){
			jQuery(this).parent('div.name').parent('div.right').parent('li').hide();
			jQuery(this).parent('span.name').parent('div.text').parent('div.box').hide();
		}
	}
	if(seenMovies.includes(movieId + '/' + episodeId)){
		jQuery(this).parent('div.name').parent('div.right').parent('li').addClass('seenEpisode');
		jQuery(this).parent('span.name').parent('div.text').parent('div.box').addClass('seenEpisode');
		if(GM_getValue('showSeenMovies') !== true){
			jQuery(this).parent('div.name').parent('div.right').parent('li').hide();
			jQuery(this).parent('span.name').parent('div.text').parent('div.box').hide();
		}
	}
	jQuery(this).parent('div.name').parent('div.right').parent('li').hover(showBox,hideBox);
	jQuery(this).parent('span.name').parent('div.text').parent('div.box').hover(showBox,hideBox);
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
		if(episodeId){
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
jQuery('body').append('<fieldset style="position:fixed;top:0;border:.1em solid black;padding:.2em;margin:1em;"><legend>Seen Movies Settings</legend><input type="checkbox" id="showHiddenMovies" />Show hidden movies<br /><input type="checkbox" id="showSeenMovies" />Show seen movies</fieldset>');
if(GM_getValue('showHiddenMovies') === true){
	jQuery('#showHiddenMovies').prop('checked',true);
}
if(GM_getValue('showSeenMovies') === true){
	jQuery('#showSeenMovies').prop('checked',true);
}
jQuery('#showHiddenMovies').change(toggleShowHiddenMovies);
jQuery('#showSeenMovies').change(toggleShowSeenMovies);

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
jQuery('a.film.c0,a.film.c1,a.film.c2,a.film.c3').each(parseCsfd);
