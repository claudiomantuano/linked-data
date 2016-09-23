
  'use scrict';

  var romajsODApp = angular.module('romajsODApp', []);

  romajsODApp.controller("opendata", function($scope, $http){

    var datasets = {
      camera: {
        url: 'http://dati.camera.it/sparql',
        format: 'json',
        limit: '100'
      },
      dbpedia: {
        url: 'http://it.dbpedia.org/sparql',
        format: 'json',
        limit: '100'
      }
    };

    var sparqlCamera = new Sparql(datasets.camera, $http);

    var sparqlDbpedia = new Sparql(datasets.dbpedia, $http);


    $scope.results = [];

    $scope.dbpediaResults = [];

    $scope.places = [];

    $scope.wanted = '';

    $scope.selected = '';


    $scope.clean = function(){
      $scope.results = [];
      $scope.dbpediaResults = [];
      $scope.places = [];
      $scope.wanted = '';
      $scope.progress = '';
      $scope.selected = '';
    };

    $scope.search = function(){
      $scope.results = [];
      $scope.progress = '...searching';

      var q = 'SELECT DISTINCT ?id ?aic ?primoFirmatario ?title ?dbpedia '+
              'WHERE { '+
              	'?aic a ocd:aic; '+
              	'dc:title ?title; '+
                'dc:description ?desc; '+
                'dc:identifier ?id; '+
                'ocd:primo_firmatario ?primoFirmatario. '+
                'FILTER regex(?desc, "'+$scope.wanted+'"). '+
                '?primoFirmatario a ocd:deputato; '+
              	'ocd:rif_mandatoCamera ?mandato. '+
                '?persona a foaf:Person; '+
                'ocd:rif_mandatoCamera ?mandato; '+
                'owl:sameAs ?dbpedia '+
              '} '+
              'OFFSET 0 LIMIT 100';

      sparqlCamera.search(q, function(response){

          if (response.results.bindings.length===0){
            $scope.progress = 'No results';
          }else{
            $scope.progress = '';
            $scope.results = response.results.bindings;
          }
      });
    };

    $scope.dbpediaSearch = function(id, dbpediaUri){

      $scope.selected = id;
      $scope.progress = '...searching';

      sparqlDbpedia.search(
          'SELECT ?person ?luogoNascita ?image ?name '+
          'WHERE { '+
               '?uri <http://dbpedia.org/ontology/wikiPageID> ?id. '+
               'FILTER (?uri = <'+dbpediaUri+'>). '+
               '?person a foaf:Person '+
               'FILTER regex(?person, ?uri). '+
               '?person <http://it.dbpedia.org/property/luogoNascita> ?luogoNascita. '+
               '?person foaf:depiction ?image. '+
               '?person rdfs:label ?name. '+
          '}',
          function(response){
            var bindings = response.results.bindings[0];
            if (bindings){
              if (bindings.length===0){
                $scope.progress = 'No results';
              }else{
                $scope.progress = '';
              }

              $scope.dbpediaResults[id]={
                uri: dbpediaUri,
                image: bindings.image ? bindings.image.value: '',
                luogoNascita: bindings.luogoNascita ? bindings.luogoNascita.value: '',
                name: bindings.name.value
              };
            }
      });
    };

    $scope.place = function(id, placeUri){

      $scope.selected = id;
      $scope.progress = '...searching';

      sparqlDbpedia.search(
          'PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos%23> '+
          'PREFIX dbp: <http://it.dbpedia.org/property/> '+
          'SELECT ?place ?name ?thumbnail ?stato ?image ?lat ?long '+
          'WHERE { '+
               '?uri <http://dbpedia.org/ontology/wikiPageID> ?id. '+
               'FILTER (?uri = <'+placeUri+'>) '+
               '?place a <http://dbpedia.org/ontology/Place> '+
               'FILTER regex(?place, ?uri). '+
               '?place <http://dbpedia.org/ontology/thumbnail> ?thumbnail; '+
               'dbp:stato ?stato '+
               'FILTER regex(?stato, "ITA"). '+
               '?place foaf:depiction ?image; '+
               'foaf:name ?name. '+
               'OPTIONAL { '+
   	              '?place geo:lat ?lat; '+
                  'geo:long ?long '+
                '} '+
          '}',
          function(response){
            var bindings = response.results.bindings[0];
            if (bindings){
              if (bindings.length===0){
                $scope.progress = 'No results';
              }else{
                $scope.progress = '';
              }

              $scope.places[id]={
                uri: placeUri,
                name: bindings.name ? bindings.name.value: '',
                thumbnail: bindings.thumbnail ? bindings.thumbnail.value: '',
                lat: bindings.lat ? bindings.lat.value: '',
                long: bindings.long ? bindings.long.value: '',
              };
              console.log($scope.places);
            }
      });
    };

  });
