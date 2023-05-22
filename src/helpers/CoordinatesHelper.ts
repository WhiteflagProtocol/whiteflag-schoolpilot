export const splitCoordinates = (
  coordinates: string
): { latitude: number; longitude: number } => {
  const splitsedCoordinates = coordinates.split(",");
  return {
    latitude: Number.parseInt(splitsedCoordinates[0]),
    longitude: Number.parseInt(splitsedCoordinates[1]),
  };
};
