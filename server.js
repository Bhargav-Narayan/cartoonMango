var express = require('express');

var request = require('request');
var path = require('path');

var cheerio = require('cheerio');
var bodyparser = require('body-parser');
var app = express();

app.use(bodyparser.urlencoded({
    extended: false
}));

app.set('view engine', 'ejs');

app.use(express.static('/public'));

app.use(express.static(path.join(__dirname, 'public')));

app.engine('html', require("ejs").renderFile);

app.use('public/stylesheets', express.static(path.join(__dirname, 'public/stylesheets')));

app.get('/', function(req, res) {
    res.sendfile("views/home.html");
})

var film = [];
var i = 0;
var url = "http://www.imdb.com/find?q=Batman&s=tt&ref_=fn_al_tt_mr";


request(url, function(error, response, html) {
    if (!error) {
        var $ = cheerio.load(html);

        var title, link;
        var dynamicURL;

        $('.result_text').filter(function() {
            var data = $(this);

            title = data.children().first().text();
            link = data.children().attr("href");

            film.push({
                name: title,
                anchor: link
            });
                    
        });
    }
});


app.get('/process', function(req, res) {

    res.send(film);
});
    

app.get('/details/:id',function(req,res){   
    console.log('req:',req.params.id);
    


    request('http://www.imdb.com'+req.params.id, function(error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            var title = $('.header').children().text();
            var rate = $('.star-box-giga-star').text();
            var desc = $('#overview-top p').text();
            var imageLink = $('.image a img').attr('src');
            console.log('Name:'+$('.header').children().text());
            console.log('rate:'+$('.star-box-giga-star').text());
            console.log('description:'+$('#overview-top p').text());
            console.log('image link:'+$('.image a img').attr('src'));

            res.send([title,rate,desc,imageLink]);
        }
    });

    
    
});




var port = Number(process.env.PORT||4334)
app.listen(port);
console.log(port);
