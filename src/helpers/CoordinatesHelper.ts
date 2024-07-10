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

const DEFAULT_COORDINATE_PRECISION = 5; // Fine for most buildings

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
    latitude: formatCoordinate('latitude', latitude),
    longitude: formatCoordinate('longitude', longitude),
  };
};

export const formatCoordinate = (
  type: 'latitude' | 'longitude', 
  coordinate: string | number, 
  addSymbol?: boolean, 
  precision?: number
): string => {
  let symbol;
  let newCoordinate: string;

  if (typeof coordinate === 'number') {
    newCoordinate = truncateCoordinate(coordinate.toString(), precision);
  } else {
    newCoordinate = truncateCoordinate(coordinate, precision);

    if (newCoordinate.match(/^[+-]{1}[0-9.]*/)) {
      symbol = newCoordinate.substring(1, -1);
      newCoordinate = newCoordinate.substring(1);
    }
  }
  
  newCoordinate = addZerosToCoordinate(newCoordinate, type);
  

  if (addSymbol) {
    newCoordinate = `${symbol ? symbol : '+'}${newCoordinate}`;
  }

  return newCoordinate;
}

const addZerosToCoordinate = (
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
  var re = new RegExp(`^([+-]?\\d+\.\\d{0,${precision ? precision : DEFAULT_COORDINATE_PRECISION}})(\\d+)?$`);
  return coordinate.match(re)[1];
}
