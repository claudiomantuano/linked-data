Linked-data demo for Romajs
===========================

You can use this example to navigate from [http://dati.camera.it](http://dati.camera.it) to [http://it.dbpedia.org](http://it.dbpedia.org) dataset.
You just have to open index.html into browser and type the text in the main field.


Queries
-------
The first query retrieves data from [http://dati.camera.it/sparql](http://dati.camera.it/sparql).

```sql
SELECT DISTINCT ?id ?aic ?primoFirmatario ?title ?dbpedia
WHERE {
      # chooses an ocd:aic resource
    ?aic a ocd:aic;
      # retrieving title, description, id, primoFirmatario properties
     dc:title ?title;
     dc:description ?desc;
     dc:identifier ?id;
     ocd:primo_firmatario ?primoFirmatario.
      # with dc:description containing following text
    FILTER regex(?desc, "....").
      # where ?primoFirmatario is a ocd:deputato resource
    ?primoFirmatario a ocd:deputato;
     ocd:rif_mandatoCamera ?mandato.
      # where ?persona is the same in the ?rif_mandatoCamera
    ?persona a foaf:Person;
     ocd:rif_mandatoCamera ?mandato;
      # retrieving ?dbpedia (link to dbpedia dataset)
     owl:sameAs ?dbpedia
    }
OFFSET 0 LIMIT 100'
```

The second query gets person data from [http://it.dbpedia.org/sparql](http://it.dbpedia.org/sparql) using uri specified into property.
 ```javascript
owl:sameAs
```

```sql
SELECT ?person ?luogoNascita ?image ?name
WHERE {
     # chooses an dbpedia resource where uri is the same of previous query
     ?uri <http://dbpedia.org/ontology/wikiPageID> ?id.
      FILTER (?uri = <'...'>).
     # retrieving ?luogoNascita ?image and ?name from person
     ?person a foaf:Person
      FILTER regex(?person, ?uri).
     ?person <http://it.dbpedia.org/property/luogoNascita> ?luogoNascita.
     ?person foaf:depiction ?image.
     ?person rdfs:label ?name.
}
```
The third query gets data about birth place of the person.

