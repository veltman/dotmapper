var rbush = require("rbush"),
    rbush = require("rbush-knn"),
    extent = require("turf-extent"),
    pip = require("point-in-polygon");

module.exports = function(geojson,sets) {

  if (!geojson || geojson.type !== "FeatureCollection" || !Array.isArray(geojson.features)) {
    throw new TypeError("Expected a FeatureCollection");
  }

  var results = {};

  for (var key in sets) {
    results[key] = generatePoints(geojson,typeof sets[key] === "function" ? sets[key] : pluck(sets[key]));
  }

  return results;

};

function pluck(key) {
  return function(properties) {
    return +(properties[key] || 0);
  };
}

function generatePoints(geojson,fn) {

  var points = [];

  geojson.features.forEach(function(feature){

    var bbox = extent(feature),
        numPoints = fn(feature.properties) || 0,
        numAttempts = 0,
        numGenerated = 0,
        maxAttempts = numPoints * 500,
        p;

    while (numAttempts < maxAttempts && numGenerated < numPoints) {

      numAttempts++;

      // generate a new point
      p = randomWithin(bbox);

      if (inGeometry(p,feature.geometry)) {
        numGenerated++;
        points.push(p);
      }

    }

    if (numGenerated < numPoints) {
      throw new Error("Couldn't generate enough points, check geometry validity.");
    }

    return points;

  });

  return points;

};

function randomWithin(bbox) {

  return [
    bbox[0] + Math.random() * (bbox[2] - bbox[0]),
    bbox[1] + Math.random() * (bbox[3] - bbox[1])
  ];

}

function inGeometry(point,geometry) {

  var polys = [];

  var inside = function(ring){
    return pip(point,ring);
  };

  if (geometry.type === "Polygon") {
    polys = [geometry.coordinates];
  } else if (geometry.type === "MultiPolygon") {
    polys = geometry.coordinates;
  } else {
    throw new TypeError("Geometries must be Polygons or MultiPolygons.");
  }

  return polys.some(function(poly){
    return inside(poly[0]) && !poly.slice(1).some(inside);
  });

}
