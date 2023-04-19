{
	"translatorID": "18e2ccd8-3f4d-40d2-971c-779e00cc665a",
	"label": "figshare2",
	"creator": "Andrew Mckenna-Foster",
	"target": "",
	"minVersion": "5.0",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "gcsibv",
	"lastUpdated": "2023-04-19 20:46:18"
}

/*
    ***** BEGIN LICENSE BLOCK *****

    Copyright © 2022 YOUR_NAME <- TODO

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
/*
	***** BEGIN LICENSE BLOCK *****
	Figshare translator Copyright © 2013-2016 Sebastian Karcher
	This file is part of Zotero.
	Zotero is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	Zotero is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.
	You should have received a copy of the GNU Affero General Public License
	along with Zotero.  If not, see <http://www.gnu.org/licenses/>.
	***** END LICENSE BLOCK *****
*/


function detectWeb(doc, url) {
	if ((url.indexOf("search?q") != -1 || url.indexOf("/browse") != -1 || url.indexOf("/categories/") != -1) && getSearchResults(doc, true)) {
		return "multiple";
	} else if (url.indexOf("/dataset") != -1) {
		//no great item type here - switch once we have dataset.
		return "dataset";
	}
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

function apiRequest(url, cb) {
	ZU.doGet(url, function(text){
		var obj;
		try {
			obj = JSON.parse(text);
		} catch (e) {
			throw('Failed parsing JSON from ' + url + '.json');
		}
		cb(obj.doi);
	});
}

async function scrape(doc, url) {
	//Get the item id from the URL
	var parts = url.split("/");
	var item_id = parts[parts.length - 1]; //
	//var version = ZU.xpath(doc, '//*[contains(concat( " ", @class, " " ), concat( " ", "xRCLL", " " ))]');
	//var risURL = 'https://figshare.com/articles/' + item_id + '/1/citations/reference_manager'
	//let doi = ZU.xpathText(doc, '//*[@id="modal"]/div[2]/div/div/div[1]/div[2]/span/text()');
	//Call the figshare API by assembling the URL with the item_id
//	apiRequest('https://api.figshare.com/v2/articles/'+ toString(item_id), function(apiResponse)) {
//		var m = apiResponse.doi;
//		let doi = m;
//		}
	apiRequest('https://api.figshare.com/v2/articles/'+ toString(item_id), function(cb){});
	let doi = cb;

	let translate = Z.loadTranslator('search');    
	translate.setSearch({ DOI: ZU.cleanDOI(doi) });                                          
	translate.setTranslator('b28d0d42-8549-4c6d-83fc-8382874a5cb9'); // DOI Content Negotiation                                          
	translate.setHandler("itemDone", function (obj, item) {                                                 
	// supplement metadata here                                                
	item.complete();                                          
	});
}            
/*
await translate.translate();
	var risURL = ZU.xpathText(doc, '//div[@class="exports-wrap section"]/div/a[contains(text(), "Ref. manager")]/@href');
	Z.debug(risURL)
	ZU.HTTP.doGet(risURL, function (text) {
		//Z.debug(text)
		text = text.trim()
		text = text.replace(/L4 - .+/g, "");
		var translator = Zotero.loadTranslator("import");
		translator.setTranslator("32d59d2d-b65a-4da4-b0a3-bdd3cfb979e7");
		translator.setString(text);
		translator.setHandler("itemDone", function (obj, item) {
			//Authors are firstName LastName - fix
			for (i = 0; i<item.creators.length; i++) {
				//sometimes there _is_ a comma delimiter
				if (!item.creators[i].firstName) {
					item.creators[i] = ZU.cleanAuthor(item.creators[i].lastName, "author");
				}
			}
			//Remove period at end of title
			item.title = item.title.replace(/\.\s*$/, "");
			item.attachments.push({
				document: doc,
				title: "Figshare Snapshot",
				mimeType: "text/html"
			});
			
			item.complete();
		});
		translator.translate();
	});
}
*/
/** BEGIN TEST CASES **/
var testCases = [
	{
		"type": "web",
		"url": "http://figshare.com/articles/browse#thumb",
		"defer": true,
		"items": "multiple"
	},
	{
		"type": "web",
		"url": "https://figshare.com/articles/_Number_of_reported_pertussis_cases_per_week_in_Japan_from_2002_to_2012_/815480",
		"items": [
			{
				"itemType": "document",
				"title": "Number of reported pertussis cases per week in Japan from 2002 to 2012",
				"creators": [
					{
						"firstName": "Yusuke",
						"lastName": "Miyaji",
						"creatorType": "author"
					},
					{
						"firstName": "Nao",
						"lastName": "Otsuka",
						"creatorType": "author"
					},
					{
						"firstName": "Hiromi",
						"lastName": "Toyoizumi-Ajisaka",
						"creatorType": "author"
					},
					{
						"firstName": "Keigo",
						"lastName": "Shibayama",
						"creatorType": "author"
					},
					{
						"firstName": "Kazunari",
						"lastName": "Kamachi",
						"creatorType": "author"
					}
				],
				"date": "October 4, 2013",
				"abstractNote": "Pertussis cases are shown by the black line, with each value representing a week of the year. The percentage of adolescent and adult cases (≥15 years old) per year is shown in red circles. The data were obtained from the Ministry of Health, Labor and Welfare of Japan Infectious Disease Surveillance data. Data regarding the number of adolescent and adult cases in 2012 were not available.",
				"extra": "DOI: 10.1371/journal.pone.0077165.g001",
				"libraryCatalog": "Figshare",
				"url": "https://figshare.com/articles/_Number_of_reported_pertussis_cases_per_week_in_Japan_from_2002_to_2012_/815480",
				"attachments": [
					{
						"title": "Figshare Snapshot",
						"mimeType": "text/html"
					}
				],
				"tags": [
					"2002",
					"cases",
					"japan",
					"pertussis"
				],
				"notes": [],
				"seeAlso": []
			}
		]
	},
	{
		"type": "web",
		"url": "https://figshare.com/search?q=labor&quick=1&x=0&y=0",
		"defer": true,
		"items": "multiple"
	},
	{
		"type": "web",
		"url": "https://figshare.com/categories/Biological_Sciences/48",
		"defer": true,
		"items": "multiple"
	}
]
/** END TEST CASES **/

/*
    ***** BEGIN LICENSE BLOCK *****

    Copyright © 2022 YOUR_NAME <- TODO

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



/** BEGIN TEST CASES **/
var testCases = [
]
/** END TEST CASES **/
