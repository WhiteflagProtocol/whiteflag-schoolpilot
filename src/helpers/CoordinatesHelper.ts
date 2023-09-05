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
    latitude: checkLatitudeFormat(latitude),
    longitude: checkLongitudeFormat(longitude),
  };
};

export const checkLatitudeFormat = (latitude: string): string => {
  var symbol;
  var newLatitude = latitude;

  newLatitude = Number.parseFloat(newLatitude).toFixed(5).toString();

  if (newLatitude.match(/^[+-]{1}[0-9.]*/)) {
    symbol = newLatitude.substring(1, -1);
    newLatitude = newLatitude.substring(1);
  }
  newLatitude = addZerosToCoordinates(newLatitude, "latitude");
  newLatitude = `${symbol ?? "+"}${newLatitude}`;
  return newLatitude;
};

export const checkLongitudeFormat = (longitude: string): string => {
  var symbol;
  var newLongitude = longitude;

  newLongitude = Number.parseFloat(newLongitude).toFixed(5).toString();

  if (newLongitude.match(/^[+-]{1}[0-9.]*/)) {
    symbol = newLongitude.substring(1, -1);
    newLongitude = newLongitude.substring(1);
  }

  newLongitude = addZerosToCoordinates(newLongitude, "longitude");
  newLongitude = `${symbol ?? "+"}${newLongitude}`;
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
