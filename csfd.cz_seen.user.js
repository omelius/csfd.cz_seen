// ==UserScript==
// @name		csfd.cz_seen
// @namespace	csfd.cz
// @description	Hide already seen movies on csfd.cz
// @version		5
// @author		Marian Omelka
// @match		https://www.csfd.cz/televize/*
// @require		https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant		GM_getValue
// @grant		GM_setValue
// ==/UserScript==

// Hide floating div with Seen / Unseen button
function hideBox(){
	jQuery('div.floatingPanel').remove();
}

// Function used to iterate over every movie in the page
function parseCsfd(){
	var movieId = jQuery(this).attr('href').split('/')[2].split('-')[0];
	var seenMovies = JSON.parse(GM_getValue('seenMovies','[]'));
	if(seenMovies.includes(movieId)){
		jQuery(this).parent('div.name').parent('div.right').parent('li').addClass('seenMovie');
		jQuery(this).parent('span.name').parent('div.text').parent('div.box').addClass('seenMovie');
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
	if(jQuery(this).hasClass('seenMovie'))	{
		jQuery(this).append('<div class="floatingPanel"><input type="button" movieId="' + movieId + '" id="alreadySeen" value="Unseen" /></div>');
	} else {
		jQuery(this).append('<div class="floatingPanel"><input type="button" movieId="' + movieId + '" id="alreadySeen" value="Seen" /></div>');
	}
	jQuery('#alreadySeen').click(toggleMovie);
}

// Toggle movie between Seen and Unseen state
function toggleMovie(){
	var movieId = jQuery(this).attr('movieId');
	var seenMovies = JSON.parse(GM_getValue('seenMovies','[]'));
	if(jQuery(this).val() === 'Seen'){
		seenMovies.push(movieId);
		seenMovies.sort();
	} else {
		seenMovies.splice(seenMovies.indexOf(movieId),1);
	}
	GM_setValue('seenMovies',JSON.stringify(seenMovies));
	location.reload();
}

// Toggle view state of Seen movies
function toggleShowSeenMovies(){
	GM_setValue('showSeenMovies',jQuery(this).is(':checked'));
	location.reload();
}

// Top left settings menu
jQuery('body').append('<fieldset style="position:fixed;top:0;border:.1em solid black;padding:.2em;margin:1em;"><legend>Seen Movies Settings</legend><input type="checkbox" id="showSeenMovies" />Show seen movies</fieldset>');
if(GM_getValue('showSeenMovies') === true){
	jQuery('#showSeenMovies').prop('checked',true);
}
jQuery('#showSeenMovies').change(toggleShowSeenMovies);

// CSS styles for seen movies
if(GM_getValue('showSeenMovies') === true){
	jQuery('head').append('<style type="text/css">.seenMovie{opacity:.33;}.seenMovie:hover{opacity:.66;}</style>');
}

// Log array of seen movies
console.log('Seen movies: ' + GM_getValue('seenMovies','[]'));

// Iterate over all films
jQuery('a.film.c0,a.film.c1,a.film.c2,a.film.c3').each(parseCsfd);
