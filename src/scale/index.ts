import { CharacteristicParser } from "../index";

export const SCALE_UUIDS = {
  service: "1bc50001-0200-0aa5-e311-24cb004a98c5",
  characteristic: "1bc50002-0200-0aa5-e311-24cb004a98c5",
};
type ScaleValues = Partial<{
  weightInGrams: number;
}>;

export class ScaleParser implements CharacteristicParser<ScaleValues> {
  parse(dataView: DataView): ScaleValues {
    const hex = dataView.getInt32(0, true);
    const weight = hex / 1000;
    return {
      weightInGrams: weight,
    };
  }
}
