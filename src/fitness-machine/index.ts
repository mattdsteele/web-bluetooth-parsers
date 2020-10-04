import { CharacteristicParser } from '../utils';

interface IndoorBikeDataElements {
  averageCadence: number;
  averagePower: number;
  averageSpeed: number;
  elapsedTime: number;
  energyPerHour: number;
  energyPerMinute: number;
  heartRate: number;
  instantaneousCadence: number;
  instantaneousPower: number;
  instantaneousSpeed: number;
  metabolicEquivalent: number;
  remainingTime: number;
  resistanceLevel: number;
  totalDistance: number;
  totalEnergy: number;
}

enum Flags {
  AverageCadencePresent = 3,
  AveragePowerPresent = 7,
  AverageSpeedPresent = 1,
  ElapsedTimePresent = 11,
  ExpendedEnergyPresent = 8,
  HeartRatePresent = 9,
  InstantaneousCadencePresent = 2,
  InstantaneousPowerPresent = 6,
  MetabolicEquivalentPresent = 10,
  MoreData = 0,
  RemainingTimePresent = 12,
  ResistanceLevelPresent = 5,
  TotalDistancePresent = 4,
}

type IndoorBikeData = Partial<IndoorBikeDataElements>;

const contains = (flags: number, flag: number) => (flags & (1 << flag)) !== 0;
const getFlags = (meas: DataView) => meas.getUint16(0, true);

class IndoorBikeDataParser implements CharacteristicParser<IndoorBikeData> {
  parse(dataView: DataView): IndoorBikeData {
    const flags = getFlags(dataView);
    const view = dataView;

    let offset = 2;
    const bikeData: IndoorBikeData = {};

    if (contains(flags, Flags.MoreData)) {
      bikeData.instantaneousSpeed = view.getUint16(offset, true) / 100;
      offset += 4;
    } else {
      offset += 2;
    }

    if (contains(flags, Flags.AverageSpeedPresent)) {
      bikeData.averageSpeed = view.getUint16(offset, true) / 2;
      offset += 2;
    }
    if (contains(flags, Flags.InstantaneousCadencePresent)) {
      bikeData.instantaneousCadence = view.getUint16(offset, true) / 2;
      offset += 2;
    }
    if (contains(flags, Flags.AverageCadencePresent)) {
      bikeData.averageCadence = view.getUint16(offset, true) / 2;
      offset += 2;
    }
    if (contains(flags, Flags.TotalDistancePresent)) {
      bikeData.totalDistance = view.getUint32(offset, true);
      offset += 3;
    }
    if (contains(flags, Flags.ResistanceLevelPresent)) {
      bikeData.resistanceLevel = view.getUint16(offset, true);
      offset += 2;
    }
    if (contains(flags, Flags.InstantaneousPowerPresent)) {
      bikeData.instantaneousPower = view.getInt16(offset, true);
      offset += 2;
    }
    if (contains(flags, Flags.AveragePowerPresent)) {
      bikeData.averagePower = view.getUint16(offset, true);
      offset += 2;
    }
    return bikeData;
  }
}

export { IndoorBikeDataParser };
