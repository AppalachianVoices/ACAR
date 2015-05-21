/*
 * The script that does the distance analysis:
 * https://ee-api.appspot.com/c3e68b1a9c2b6287cfefb15fb5b1d5e1
 */


/*
00 ACAR - Area-Distance Analysis

This Script generates a full analysis by county of mined areas
and distance to mining for communities in the "Appalachian 
Communities at Risk" application for iLoveMountains.org
*/

var start_year = 1984;
var end_year = 2014;
var metersToMile = 1609;
var CountySelect = 'WV-Logan';


/*
Get the map of mined areas
*/

var MinedAreas = 
  ee.FeatureCollection(
    'ft:1Lq_8UbfchhhuEdbkGwvpB7wM-DjKlVH87vDqF4po')
    .filterMetadata('county', 'equals', CountySelect); 

var PopPlaces = 
  ee.FeatureCollection(
    'ft:19h17oltHKf-X4OfU7jN1EPHsG1pF-yFfP06gt236'); 
var place_distance = PopPlaces.distance(10000);

Map.addLayer(place_distance,
             {min: 0, max: 10000, palette: ['FFFF00', '0000FF']});


for(var loop_year = start_year; loop_year <= end_year; loop_year = loop_year +3){

    var FilteredMines = MinedAreas.filterMetadata('year', 'equals', loop_year);
    var FlatMines = FilteredMines.geometry(25);
  
    var clip_distance = place_distance.clip(FlatMines);
    var mean_distance = clip_distance.reduceRegion(ee.Reducer.mean(), FlatMines, 25);
    
    if (loop_year == start_year){
      var datalayer = mean_distance;
    }
//    var datalayer_all = datalayer_all.merge(mean_distance);

    print(mean_distance.getInfo().distance);  
    Map.addLayer(FlatMines, {color: 'FF0000'}, 'Active Surface Mining');
}

//print(datalayer.getDownloadURL('csv');



