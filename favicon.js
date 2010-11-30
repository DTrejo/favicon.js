var httpAgent = require('http-agent')
  , jsdom  = require('jsdom').jsdom
  , request = require('request')
  , async = require('async')
  , favicon = exports;

function ok200(url, callback){
  try {
    var options = { uri: url };
    request(options, function (err, response, body) {
      if (err) callback(err);
      callback(null, response.statusCode == '200');
    });
  }
  catch (requestErr) {
    if (requestErr) callback(requestErr);
  }
}

// given a url and a callback, fetches that site's favicon URL and passes it as the second argument to the callback
// callback should be of form
// function(err, faviconUrl){};
favicon.get = function(url, callback) {
  var agent = httpAgent.create(url, '/');

  agent.addListener('next', function (err, agent) {
    if (err) throw err;

    // console.log('looking at ', agent.host + agent.url);
    
    var window = jsdom(agent.body).createWindow();
    
    // new instance each time
    // better way to do this?
    var $ = require('jquery').create(window);
    
    // used to make an element into a full URL
    function qualify(href){ 
      if (href.indexOf('/') == 0) href = href.substring(1,href.length); // take of the slash
      return 'http://' + agent.host + agent.url + href; 
    };

    var first = $('link[rel=icon]').get(0);
    var second = $('link[rel=shortcut icon]').get(0);
    var hrefs = [ first ? qualify(first.href) : undefined
                , second ? qualify(second.href) : undefined
                , qualify('favicon.ico')]
                .filter(function(href){ return href; }); // remove undefined

    // console.log('hrefs: ', hrefs);

    var tasks = [];
    for (var i in hrefs) {
      href = hrefs[i];
      tasks.push(function(callback) {
        ok200(href, callback);
      });
    }

    async.series(tasks, function(err, results) {
      // console.log('results: ', results);
      for (i in results) {
        result = results[i];
        if (result) {
          callback(null, hrefs[i]);
          agent.stop();
          return;
        } 
      }
      // if it got through all the urls, then just return my own sites favicon url
      callback(null, 'http://dtrejo.com/favicon.png');
      agent.stop();
    });
  
  });

  agent.addListener('stop', function (e, agent) {
     // console.log('all done visiting', url);
  });
  
  agent.start();
  
};