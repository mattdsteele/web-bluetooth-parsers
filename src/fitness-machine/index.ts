import { CharacteristicParser } from '../utils';

const FTMS_UUIDS = {
  service: 'fitness_machine',
  characteristic: {
    indoorBikeData: 'indoor_bike_data',
    fitnessMachineFeature: 'fitness_machine_feature',
  },
};
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

type flagField = { [T: string]: number };
type flagsSupportedField<T> = { [P in keyof T]?: boolean };
const fitnessMachineFeaturesFields = {
  averageSpeedSupported: 0,
  cadenceSupported: 1,
  totalDistanceSupported: 2,
  inclinationSupported: 3,
  elevationGainSupported: 4,
  paceSupported: 5,
  stepCountSupported: 6,
  resistanceLevelSupported: 7,
  strideCountSupported: 8,
  expendedEnergySupported: 9,
  heartRateMeasurementSupported: 10,
  metabolicEquivalentSupported: 11,
  elapsedTimeSupported: 12,
  remainingTimeSupported: 13,
  powerMeasurementSupported: 14,
  forceonBeltandPowerOutputSupported: 15,
  userDataRetentionSupported: 16,
};
const targetSettingsFields = {
  speedTargetSettingSupported: 0,
  inclinationTargetSettingSupported: 1,
  resistanceTargetSettingSupported: 2,
  powerTargetSettingSupported: 3,
  heartRateTargetSettingSupported: 4,
  targetedExpendedEnergyConfigurationSupported: 5,
  targetedStepNumberConfigurationSupported: 6,
  targetedStrideNumberConfigurationSupported: 7,
  targetedDistanceConfigurationSupported: 8,
  targetedTrainingTimeConfigurationSupported: 9,
  targetedTimeinTwoHeartRateZonesConfigurationSupported: 10,
  targetedTimeinThreeHeartRateZonesConfigurationSupported: 11,
  targetedTimeinFiveHeartRateZonesConfigurationSupported: 12,
  indoorBikeSimulationParametersSupported: 13,
  wheelCircumferenceConfigurationSupported: 14,
  spinDownControlSupported: 15,
  targetedCadenceConfigurationSupported: 16,
};

type fmfSupports = flagsSupportedField<typeof fitnessMachineFeaturesFields>;
type targetSettingsSupports = flagsSupportedField<typeof targetSettingsFields>;

type FitnessMachineFeatureFeature = fmfSupports & targetSettingsSupports;
class FitnessMachineFeatureParser
  implements CharacteristicParser<FitnessMachineFeatureFeature> {
  parse(dataView: DataView): FitnessMachineFeatureFeature {
    const featureFlags = dataView.getUint32(0, true);
    const targetSettings = dataView.getUint32(4, true);

    const supportedOptions: FitnessMachineFeatureFeature = {};
    Object.entries(fitnessMachineFeaturesFields).forEach(([key, flag]) => {
      (supportedOptions as any)[key] = contains(featureFlags, flag);
    });
    Object.entries(targetSettingsFields).forEach(([key, flag]) => {
      (supportedOptions as any)[key] = contains(targetSettings, flag);
    });
    return supportedOptions;
  }
}

export { IndoorBikeDataParser, FitnessMachineFeatureParser, FTMS_UUIDS };
