# dotmapper
Auto-generate random points in GeoJSON features.

```
var dotmapper = require("dotmapper");

// Define a dict of point sets you want
// Values should be either:
// key names - will generate feature.properties[key] points in each feature
// functions - will generate function(feature.properties) points in each feature

var pointSets = {
  republicans: function(properties) {
    return +properties.REPUBLICANS_MESSY_FIELD_NAME;
  },
  democrats: "DEMOCRATS_MESSY_FIELD_NAME"
};

var myPoints = dotmapper(myFeatureCollection,pointSets);

// myPoints is a dict with the same keys, and the values are arrays of points

/*
{
  republicans: [
    [lng,lat],
    [lng,lat],
    [lng,lat]
    ...
  ],
  democrats: [
    [lng,lat],
    [lng,lat],
    [lng,lat]
  ]
}
*/
