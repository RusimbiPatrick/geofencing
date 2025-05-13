import {getDistance as geoLibDistance} from 'geolib';

export const getDistance = (from, to) => {
  return geoLibDistance(from, to); // in meters
};
