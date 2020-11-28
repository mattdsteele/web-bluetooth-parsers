import {
  LIGHT_STRIP_UUIDS,
  LIGHT_STRIP_CONNECT_OPTIONS,
  setRgb,
} from '../pkg/dist-web/index.js';

const { shortCharacteristic, shortService } = LIGHT_STRIP_UUIDS;
// add bt-device
let dev = document.createElement('bt-device');
dev.service = shortService;
dev.characteristic = shortCharacteristic;
dev.connectOptions = LIGHT_STRIP_CONNECT_OPTIONS;
// dev.notifications = true;
dev = document.body.appendChild(dev);
// dev.parse = (dv) => {
//   console.log('parsing');
//   return new IndoorBikeDataParser().parse(dv);
// };
// dev.addEventListener('data', (e) => {
//   console.log(e.detail.value);
// });

document.querySelector('.connect').addEventListener('click', async () => {
  await dev.connect();
  console.log('connected');
});

document.querySelector('.send').addEventListener('click', async () => {
  const btChar = dev.btChar;
  await btChar.writeValue(setRgb(255, 255, 0));
});
