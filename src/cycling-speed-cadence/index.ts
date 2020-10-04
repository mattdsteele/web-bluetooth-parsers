import { CharacteristicParser } from '../index';

export const CSC_UUIDS = {
  service: 'cycling_speed_and_cadence',
  characteristic: {
    cscMeasurement: 'csc_measurement',
  },
};

type CyclingSpeedCadenceValues = Partial<{
  totalWheelRevolutions: number;
  lastWheelTime: number;
  totalCrankRevolutions: number;
  lastCrankTime: number;
}>;

class CyclingSpeedCadenceParser
  implements CharacteristicParser<CyclingSpeedCadenceValues> {
  parse(data: DataView): CyclingSpeedCadenceValues {
    const output: CyclingSpeedCadenceValues = {};
    const flags = data.getUint8(0);
    const wheelDataPresent = flags & 0x1;
    const crankDataPresent = flags & 0x2;

    if (wheelDataPresent) {
      output.totalWheelRevolutions = data.getUint32(1, true);
      output.lastWheelTime = data.getUint16(5, true) / 1024;
    }

    if (crankDataPresent) {
      output.totalCrankRevolutions = data.getUint16(7, true);
      output.lastCrankTime = data.getUint16(9, true) / 1024;
    }

    return output;
  }
}

export { CyclingSpeedCadenceParser };

const calculateSpeed = (
  prev: CyclingSpeedCadenceValues,
  current: CyclingSpeedCadenceValues
) => {
  const revDelta = current.totalWheelRevolutions! - prev.totalWheelRevolutions!;
  let timeDelta = current.lastWheelTime! - prev.lastWheelTime!;
  if (timeDelta < 0) {
    timeDelta = current.lastWheelTime! + 64 - current.lastWheelTime!;
  }

  if (revDelta === 0) {
    return -1;
  }

  const wheelSize = 622; // mm; 700C
  const wheelCircumference = Math.PI * wheelSize;

  const rpm = revDelta * (60 / timeDelta);
  const rph = rpm * 60;
  const mmph = rph * wheelCircumference;
  const kph = mmph / 1e6;
  return kph;
};
const calculateCadence = (
  prev: CyclingSpeedCadenceValues,
  current: CyclingSpeedCadenceValues
) => {
  const revDelta = current.totalCrankRevolutions! - prev.totalCrankRevolutions!;
  const timeDelta = current.lastCrankTime! - prev.lastCrankTime!;
  if (revDelta > 0) {
    const minuteRatio = 60 / timeDelta;
    return revDelta * minuteRatio;
  }
  return -1;
};
export const cscMeasurement = (
  prev: CyclingSpeedCadenceValues,
  current: CyclingSpeedCadenceValues
) => {
  //speed
  const speed = calculateSpeed(prev, current);
  const cadence = calculateCadence(prev, current);
  const measurement = {
    speed,
    cadence,
  };
  return measurement;
};
