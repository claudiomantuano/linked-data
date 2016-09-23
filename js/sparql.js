
  'use scrict';

  function Sparql(dataset, $http){
    this.dataset = dataset;
    this.$http = $http;

    this.search = function(query, cb){
      var q = this.dataset.url+'?query='+query+'&format='+this.dataset.format+'&callback=JSON_CALLBACK';
      this.$http.jsonp( q ).success( cb);
    };
  }
  
