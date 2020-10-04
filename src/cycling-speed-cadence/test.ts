import { fromHex } from '../utils';
import { cscMeasurement, CyclingSpeedCadenceParser } from './index';

test('can parse a value', () => {
  const rawValue = '03200000 006ab40b 00aaaf';
  const output = new CyclingSpeedCadenceParser().parse(fromHex(rawValue));
  expect(output.lastCrankTime).toBeDefined;
});

describe('parses multiple values', () => {
  ['031d0000 00c4ab0a 00b3a7', '031c0000 00caa80a 00b3a7'].map((raw) =>
    test(raw, () => {
      const output = new CyclingSpeedCadenceParser().parse(fromHex(raw));
      expect(output.lastCrankTime).toBeGreaterThan(0);
      expect(output.lastWheelTime).toBeGreaterThan(0);
      expect(output.totalCrankRevolutions).toBeGreaterThan(0);
      expect(output.totalWheelRevolutions).toBeGreaterThan(0);
    })
  );
});

describe('measurement', () => {
  test('one', () => {
    const [prev, current] = [
      '031c0000 00caa80a 00b3a7',
      '031d0000 00c4ab0a 00b3a7',
    ]
      .map((raw) => fromHex(raw))
      .map((dv) => new CyclingSpeedCadenceParser().parse(dv));
    const meas = cscMeasurement(prev, current);
    expect(meas.speed).toBeGreaterThanOrEqual(-1);
    expect(meas.speed).toBeLessThan(30);
    expect(meas.cadence).toBeGreaterThanOrEqual(-1);
    expect(meas.cadence).toBeLessThan(150);
  });
  test('two', () => {
    const [prev, current] = [
      '031d0000 00c4ab0a 00b3a7',
      '031e0000 00adae0b 00aaaf',
    ]
      .map((raw) => fromHex(raw))
      .map((dv) => new CyclingSpeedCadenceParser().parse(dv));
    const meas = cscMeasurement(prev, current);
    expect(meas.speed).toBeGreaterThanOrEqual(-1);
    expect(meas.speed).toBeLessThan(30);
    expect(meas.cadence).toBeGreaterThanOrEqual(-1);
    expect(meas.cadence).toBeLessThan(150);
  });
});
