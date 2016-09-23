Linked-data demo for Romajs
===========================
This is an example of navigation from [dati.camera.it](dati.camera.it) to [it.dbpedia.org](it.dbpedia.org).

Queries
-------
The first query retrieves data from [dati.camera.it/sparql](dati.camera.it/sparql)

```sql
SELECT DISTINCT ?id ?aic ?primoFirmatario ?title ?
WHERE {
      #choose an ocd:aic resource
    ?aic a ocd:aic;
    dc:title ?title;
    dc:description ?desc;
    dc:identifier ?id;
    ocd:primo_firmatario ?primoFirmatario.
      #with dc:description containing following text ...
    FILTER regex(?desc, "....").
    ?primoFirmatario a ocd:deputato;
    ocd:rif_mandatoCamera ?mandato.
    ?persona a foaf:Person;
    ocd:rif_mandatoCamera ?mandato;
    owl:sameAs ?dbpedia
    }
OFFSET 0 LIMIT 100'
```
