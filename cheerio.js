const cheerio = require('cheerio')

var request = require("request");
var fs = require('fs');
var options = { method: 'GET',
  url: 'https://www.cbf.com.br/futebol-brasileiro/competicoes/campeonato-brasileiro-serie-a',
  headers: 
   {'Cache-Control': 'no-cache' } };
   var lista = [];
request(options, function (error, response, body) {
  if (error) throw new Error(error);

//   console.log(body);

  const $ = cheerio.load(body);


  var times = $('table .escudo').each(function(){
    var item = $(this).attr('title');
    var img = $(this).attr('src');
    // var posicao = $('table b .sobe').text();
    
    console.log(item);
    console.log(img);
    // console.log(posicao);

    var download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);

        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
    };

    var mItem = item.replace(/\s/g,'');

    // download(img, 'escudos/a/'+mItem+'-m.jpg', function(){
    // console.log('done');
    // });

    lista.push({nome: item, escudo: 'escudos/a/'+mItem+'-m.jpg', pais: 'BR'})

    
})
fs.writeFile("listas/br/lista.json", JSON.stringify(lista), function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); 
});



