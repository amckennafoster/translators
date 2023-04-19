{
	"translatorID": "16d8f32c-5ee2-4ab5-9de5-389c69e552a8",
	"label": "EDI Repository",
	"creator": "Andrew Mckenna-Foster",
	"target": "https://portal.edirepository.org/",
	"minVersion": "",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "gcsibv",
	"lastUpdated": "2023-04-19 16:25:41"
}

/*
    ***** BEGIN LICENSE BLOCK *****

    Copyright © 2022 Andrew Mckenna-Foster

    This file is part of Zotero.

    Zotero is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Zotero is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with Zotero. If not, see <http://www.gnu.org/licenses/>.

    ***** END LICENSE BLOCK *****
*/


function detectWeb(doc, url) {
	// TODO: adjust the logic here
	if (url.includes('/mapbrowse=')) {
		return 'dataset';
	}
	else if (getSearchResults(doc, true)) {
		return 'multiple';
	}
	return false;
}

function getSearchResults(doc, checkOnly) {
	var items = {};
	var found = false;
	// TODO: adjust the CSS selector
	var rows = doc.querySelectorAll('h2 > a.title[href*="/article/"]');
	for (let row of rows) {
		// TODO: check and maybe adjust
		let href = row.href;
		// TODO: check and maybe adjust
		let title = ZU.trimInternal(row.textContent);
		if (!href || !title) continue;
		if (checkOnly) return true;
		found = true;
		items[href] = title;
	}
	return found ? items : false;
}

async function doWeb(doc, url) {
	if (detectWeb(doc, url) == 'multiple') {
		let items = await Zotero.selectItems(getSearchResults(doc, false));
		if (!items) return;
		for (let url of Object.keys(items)) {
			await scrape(await requestDocument(url));
		}
	}
	else {
		await scrape(doc, url);
	}
}

async function scrape(doc, url = doc.location.href) {
	let doi = text(doc,'#citation');
	// TODO: implement or add a scrape function template
	let translate = Z.loadTranslator('search');    
	translate.setSearch({ DOI: ZU.cleanDOI(doi) });                                          
	translate.setTranslator('b28d0d42-8549-4c6d-83fc-8382874a5cb9'); // DOI Content Negotiation                                          
	translate.setHandler("itemDone", function (obj, item) {                                                 
	// supplement metadata here                                                
	item.complete();
	item.identifier = 1294.1;
	item.abstractNote = 
	});                                          
	await translate.translate();
	}/** BEGIN TEST CASES **/
var testCases = [
	{
		"type": "web",
		"url": "about:blank",
		"detectedItemType": false,
		"items": []
	}
]
/** END TEST CASES **/
