import {
  ScaleParser,
  SCALE_UUIDS
} from '../pkg/dist-web/index.js';

// add bt-device
let dev = document.createElement('bt-device');
dev.service = SCALE_UUIDS.service;
dev.characteristic = SCALE_UUIDS.characteristic;
dev.notifications = true;
dev = document.body.appendChild(dev);
dev.parse = (dv) => {
  console.log('parsing');
  return new ScaleParser().parse(dv);
};
dev.addEventListener('data', (e) => {
  console.log(e.detail.value);
});
document.querySelector('.connect').addEventListener('click', async () => {
  await dev.connect();
  console.log('connected');
});

// document.querySelector('.send').addEventListener('click', async () => {
//   const btChar = dev.btChar;
//   await btChar.writeValue(setRgb(255, 255, 0));
// });
