/**
 * Basic script for wiki api-interaction
 * 
 */

const data = require("./config.json")

const MWBot = require('mwbot');
const bot = new MWBot({ apiUrl: data.url });

var lista = [];

bot.request({
	action: 'query',
	list: 'allpages',
	apfrom: 'B',
	apto: 'Z',
	aplimit: '500',
	apfilterredir: 'nonredirects'
}).then((response) =>{

	for(let i = 0; i < response.query.allpages.length; i++){
		lista.push(response.query.allpages[i].title);

		bot.request({
			action: 'parse',
			page: lista[i],
			prop: 'wikitext',
			formatversion: 2
		}).then((response) =>{

			let text = response.parse.wikitext;


			(async(i) =>{

				setTimeout(() =>{

					bot.getEditToken().then((response) =>{

						bot.edit(lista[i], data.text + text, 'Yo!').then((response) =>{

							console.log('Edição bem sucedida:', response);
							
						})
						.catch((err) =>{
							console.log(err);
						});
					});

				}, i * 10000);

			})(i);
		});
	}
});