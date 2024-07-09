/**
 * Precision reference:
 *
 * Decimal Places   Aprox. Distance
 * 1                10 kilometers
 * 2                1 kilometer
 * 3                100 meters
 * 4                10 meters
 * 5                1 meter
 * 6                10 centimeters
 * 7                1.0 centimeter 
 * 8                1.0 millimeter 
 */

const DEFAULT_COORDINATE_PRECISION = 4; // Fine for most buildings

export const splitCoordinates = (
  coordinates: string
): { latitude: string; longitude: string } => {
  const splitsedCoordinates = coordinates.split(",");
  return {
    latitude: splitsedCoordinates[0].trim(),
    longitude: splitsedCoordinates[1].trim(),
  };
};

export const checkCoordinatesFormat = (
  latitude: string,
  longitude: string
): { latitude: string; longitude: string } => {
  return {
    latitude: formatLatitude(latitude),
    longitude: formatLongitude(longitude),
  };
};

export const formatLatitude = (latitude: string | number, precision?: number): string => {
  let symbol;
  let newLatitude: string;

  if (typeof latitude === 'number') {
    newLatitude = truncateCoordinate(latitude.toString(), precision);
  } else {
    newLatitude = truncateCoordinate(latitude, precision);

    if (newLatitude.match(/^[+-]{1}[0-9.]*/)) {
      symbol = newLatitude.substring(1, -1);
      newLatitude = newLatitude.substring(1);
    }
  }
  
  newLatitude = addZerosToCoordinates(newLatitude, "latitude");
  newLatitude = `${symbol ?? "+"}${newLatitude}`; //TODO: This assumes the coordinate will always be in the + half
  return newLatitude;
};

export const formatLongitude = (longitude: string | number, precision?: number): string => {
  let symbol;
  let newLongitude: string;

  if (typeof longitude === 'number') {
    newLongitude = truncateCoordinate(longitude.toString(), precision);
  } else {
    newLongitude = truncateCoordinate(longitude, precision);

    if (newLongitude.match(/^[+-]{1}[0-9.]*/)) {
      symbol = newLongitude.substring(1, -1);
      newLongitude = newLongitude.substring(1);
    }
  }

  newLongitude = addZerosToCoordinates(newLongitude, "longitude");
  newLongitude = `${symbol ?? "+"}${newLongitude}`; //TODO: This assumes the coordinate will always be in the + half
  return newLongitude;
};

const addZerosToCoordinates = (
  coordinate: string,
  type: "latitude" | "longitude"
) => {
  const numberOfDigits = type === "latitude" ? 2 : 3;

  const coordinatesNumberOfDigits = coordinate.split(".")?.[0]?.length;
  const difference = numberOfDigits - coordinatesNumberOfDigits;
  if (difference > 0) {
    return `${"0".repeat(difference)}${coordinate}`;
  } else {
    return coordinate;
  }
};

function truncateCoordinate(coordinate: string, precision?: number) {
  console.log(coordinate)
  var re = new RegExp(`^([+-]?\\d+\.\\d{0,${precision ? precision : DEFAULT_COORDINATE_PRECISION}})\\d+$`);
  console.log(coordinate.match(re))
  return coordinate.match(re)[1];
}
