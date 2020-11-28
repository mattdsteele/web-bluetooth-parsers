const LIGHT_STRIP_UUIDS = {
  shortService: 0xffe5,
  shortCharacteristic: 0xffe9,
};
const LIGHT_STRIP_CONNECT_OPTIONS = {
  optionalServices: ['0000ffe5-0000-1000-8000-00805f9b34fb'],
  filters: [{ namePrefix: 'LED' }],
};

const setRgb = (red: number, green: number, blue: number) => {
  const r = new Uint8Array([0x56, green, red, blue, 0x00, 0xaa]);
  return r;
};

const commands = [
  'Green pulse',
  'Red pulse',
  'Blue pulse',
  'Yellow pulse',
  'Pink pulse',
  'Teal pulse',
  'White pulse',
  'Green/Red',
  'Green/Blue',
  'Blue/Red',
  'All Color 💥',
  'Green',
  'Red',
  'Blue',
  'Yellow',
  'Teal',
];

const setCommand = (commandNumber: number) => {
  const speed = 0x10;
  const command = commandNumber + 0x26;
  const r = new Uint8Array([0xbb, command, speed, 0x44]);
  return r;
};

export {
  LIGHT_STRIP_UUIDS,
  LIGHT_STRIP_CONNECT_OPTIONS,
  commands,
  setCommand,
  setRgb,
};
