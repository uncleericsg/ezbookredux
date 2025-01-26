/**
 * Location calculation utilities
 * 
 * Contains safe-to-modify versions of location calculations
 * that can be used instead of the protected services/locations functions
 */

export function calculateDistanceWeight(distance: number, minDistance: number, maxDistance: number): number {
  if (distance < minDistance) {
    return 1;
  } else if (distance > maxDistance) {
    return 0;
  } else {
    // Correct linear scaling formula:
    // Weight decreases linearly from 1 at minDistance to 0 at maxDistance
    return 1 - ((distance - minDistance) / (maxDistance - minDistance));
  }
}