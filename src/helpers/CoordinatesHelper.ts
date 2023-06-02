export const splitCoordinates = (
  coordinates: string
): { latitude: number; longitude: number } => {
  const splitsedCoordinates = coordinates.split(",");
  return {
    latitude: Number.parseFloat(splitsedCoordinates[0]),
    longitude: Number.parseFloat(splitsedCoordinates[1]),
  };
};
