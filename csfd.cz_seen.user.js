// ==UserScript==
// @name		csfd.cz_seen
// @namespace	csfd.cz
// @description	Hide already seen movies on csfd.cz
// @version		1
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
		var hiddenFilms = JSON.parse(GM_getValue("hiddenFilms"));
	}
	catch(e)
	{
		var hiddenFilms = new Array();
	}
	hiddenFilms.push(filmId);
	GM_setValue("hiddenFilms",JSON.stringify(hiddenFilms));
	location.reload();
}
function showBox()
{
	var filmId = jQuery(this).find('a.film.c0,a.film.c1,a.film.c2,a.film.c3').attr('href').split('/')[2].split('-')[0];
	jQuery(this).append('<div class="floatingPanel"><input type="button" filmId="' + filmId + '" id="alreadySeen" value="Seen" /></div>');
	jQuery("#alreadySeen").click(hideFilm);
}

jQuery('a.film.c0,a.film.c1,a.film.c2,a.film.c3').each(
	function()
	{
		var filmId = jQuery(this).attr('href').split('/')[2].split('-')[0];
		try
		{
			var hiddenFilms = JSON.parse(GM_getValue("hiddenFilms"));
		}
		catch(e)
		{
			var hiddenFilms = new Array();
		}
		if(hiddenFilms.includes(filmId))
		{
			jQuery(this).parent('div.name').parent('div.right').parent('li').hide();
			jQuery(this).parent('span.name').parent('div.text').parent('div.box').hide();
		}
		else
		{
			jQuery(this).parent('div.name').parent('div.right').parent('li').hover(showBox,hideBox);
			jQuery(this).parent('span.name').parent('div.text').parent('div.box').find('div.text').hover(showBox,hideBox);
		}
	}
);