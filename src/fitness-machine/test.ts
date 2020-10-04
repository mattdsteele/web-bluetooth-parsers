import { fromHex } from '../utils';
import { FitnessMachineFeatureParser, IndoorBikeDataParser } from './index';

describe('indoor bike data', () => {
  [
    '4400540998006f00',
    '440074099a007300',
    '440074099a007300',
    '44007609a6007400',
    '44007009a6007300',
    '44006d09a6007300',
    '44006109a6007100',
    '44005409a6006f00',
    '44005e09a6007100',
    '44006009a6007100',
    '44008309a6007500',
    '44007909a6007400',
    '44003e099a006d00',
    '440075089a005600',
    '4400ba079a004400',
    '4400130700003500',
    '44007d0600002800',
    '4400f30500001e00',
  ].map((h) =>
    test(h, () => {
      const res = new IndoorBikeDataParser().parse(fromHex(h));
      expect(res.instantaneousCadence).toBeDefined();
      expect(res.instantaneousPower).toBeDefined();
    })
  );
});

describe('fitness machine feature', () => {
  it('parses inride', () => {
    const inride = '02400000 00800000';
    const data = new FitnessMachineFeatureParser().parse(fromHex(inride));
    expect(data.averageSpeedSupported).toBe(false);
    expect(data.powerMeasurementSupported).toBe(true);
    expect(data.spinDownControlSupported).toBe(true);
  });
});
