/**
 * Wheel geometry shared by RouletteWheel and tests (SPK2-10 / T09).
 * Sector 0 starts at 3 o'clock; the pointer sits at 12 o'clock (-90°).
 */

export const POINTER_ANGLE_DEG = -90;
const FULL_TURN_DEG = 360;

export function getSectorCenterAngle(index: number, count: number): number {
  const anglePerSector = FULL_TURN_DEG / count;
  return index * anglePerSector + anglePerSector / 2;
}

/**
 * Next absolute rotation so that the winning sector's centre stops under the
 * pointer after at least `minFullRotationsDeg` of travel.
 */
export function computeTargetRotation(
  currentRotation: number,
  winningIndex: number,
  count: number,
  minFullRotationsDeg: number,
): number {
  const targetRotation = POINTER_ANGLE_DEG - getSectorCenterAngle(winningIndex, count);
  const currentOffset = currentRotation % FULL_TURN_DEG;
  // Normalise into [0, 360) so the wheel always moves forward.
  const forwardDelta = (((targetRotation - currentOffset) % FULL_TURN_DEG) + FULL_TURN_DEG) % FULL_TURN_DEG;
  return currentRotation + minFullRotationsDeg + forwardDelta;
}

/** Which sector index lies under the pointer for a given absolute rotation. */
export function getIndexUnderPointer(rotation: number, count: number): number {
  const anglePerSector = FULL_TURN_DEG / count;
  const wheelAngle = (((POINTER_ANGLE_DEG - rotation) % FULL_TURN_DEG) + FULL_TURN_DEG) % FULL_TURN_DEG;
  return Math.floor(wheelAngle / anglePerSector) % count;
}
