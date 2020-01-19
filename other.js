const cheerio = require('cheerio')

var request = require("request");
var fs = require('fs');

var country = 'WORLD-CUP';

var countryFolder = country.toLowerCase();

var escudosFirstPart = 'escudos/'+countryFolder+'/';
var listaFirstPart = 'listas/'+countryFolder+'/';

if (!fs.existsSync(escudosFirstPart)){
    fs.mkdirSync(escudosFirstPart);
}
if (!fs.existsSync(listaFirstPart)){
    fs.mkdirSync(listaFirstPart);
}
var options = { method: 'GET',
  url: 'http://www.sportslogos.net/teams/list_by_league/71/FIFA_World_Cup/World_Cup/logos/',
  headers: 
   {'Cache-Control': 'no-cache' } };
   var lista = [];
request(options, function (error, response, body) {
  if (error) throw new Error(error);

//   console.log(body);

  const $ = cheerio.load(body);


  var times = $('.logoWall a').each(function(){

      var one = this;
      var two = this['img']
    var item = $(one).attr('title');
    // var img = $(two).attr('src');
    var img = $(this).find('img').attr('src')
    console.log(item);
    console.log(img);
    // var posicao = $('table b .sobe').text();
    
    
    // console.log(posicao);

    var download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);

        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
    };

    item = item.replace('Logos','');
    item = item.trim();

    var mItem = item.replace(/\s/g,'');

    
    

    download(img, escudosFirstPart+mItem+'-m.jpg', function(){
    console.log('done');
    });

    lista.push({nome: item, escudo: escudosFirstPart+mItem+'-m.jpg', pais: country})

    
})
fs.writeFile("listas/"+countryFolder+"/lista.json", JSON.stringify(lista), function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); 
});



