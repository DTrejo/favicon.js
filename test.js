var favicon = require('./favicon');

// testing
var domains = ['google.com', 'amazon.com', 'getzazu.com', 'brown.edu'];
console.log('testing on');
console.log(domains);
for (var i in domains){
  favicon.get(domains[i], function(err, furl) {
    console.log('>', furl);
  }); 
}