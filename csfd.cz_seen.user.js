// ==UserScript==
// @name		csfd.cz_seen
// @namespace	csfd.cz
// @description	Hide already seen movies on csfd.cz
// @version		2
// @author		Marian Omelka
// @match		https://www.csfd.cz/*
// @require		https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant		GM_getValue
// @grant		GM_setValue
// ==/UserScript==
function hideBox()
{
	jQuery('div.floatingPanel').remove();
}
function hideFilm()
{
	var filmId = jQuery(this).attr('filmId');
	try
	{
		var seenMovies = JSON.parse(GM_getValue('seenMovies'));
	}
	catch(e)
	{
		var seenMovies = new Array();
	}
	if(jQuery(this).val() == 'Seen')
	{
		seenMovies.push(filmId);
	}
	else
	{
		seenMovies.splice(seenMovies.indexOf(filmId),1);
	}
	GM_setValue('seenMovies',JSON.stringify(seenMovies));
	location.reload();
}
function parseCsfd()
{
	var filmId = jQuery(this).attr('href').split('/')[2].split('-')[0];
	try
	{
		var seenMovies = JSON.parse(GM_getValue('seenMovies'));
	}
	catch(e)
	{
		var seenMovies = new Array();
	}
	if(seenMovies.includes(filmId))
	{
		jQuery(this).parent('div.name').parent('div.right').parent('li').addClass('seenFilm');
		jQuery(this).parent('span.name').parent('div.text').parent('div.box').addClass('seenFilm');
		if(GM_getValue('showSeenMovies') !== true)
		{
			jQuery(this).parent('div.name').parent('div.right').parent('li').hide();
			jQuery(this).parent('span.name').parent('div.text').parent('div.box').hide();
		}
	}
	jQuery(this).parent('div.name').parent('div.right').parent('li').hover(showBox,hideBox);
	jQuery(this).parent('span.name').parent('div.text').parent('div.box').hover(showBox,hideBox);
}
function showBox()
{
	var filmId = jQuery(this).find('a.film.c0,a.film.c1,a.film.c2,a.film.c3').attr('href').split('/')[2].split('-')[0];
	if(jQuery(this).hasClass('seenFilm'))
	{
		jQuery(this).append('<div class="floatingPanel"><input type="button" filmId="' + filmId + '" id="alreadySeen" value="Unseen" /></div>');
	}
	else
	{
		jQuery(this).append('<div class="floatingPanel"><input type="button" filmId="' + filmId + '" id="alreadySeen" value="Seen" /></div>');
	}
	jQuery('#alreadySeen').click(hideFilm);
}

jQuery('body').append('<fieldset style="position:fixed;top:0;border:.1em solid black;padding:.2em;margin:1em;"><legend>Seen Movies Settings</legend><input type="checkbox" id="showSeenMovies" />Show seen movies</fieldset>');
console.log('Seen movies: ' + GM_getValue('seenMovies'));
if(GM_getValue('showSeenMovies') === true)
{
	jQuery('#showSeenMovies').prop('checked',true);
}
jQuery('#showSeenMovies').change(function(){GM_setValue('showSeenMovies',jQuery(this).is(':checked'));location.reload();});
jQuery('a.film.c0,a.film.c1,a.film.c2,a.film.c3').each(parseCsfd);