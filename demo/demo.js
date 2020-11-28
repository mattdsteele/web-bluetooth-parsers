import { IndoorBikeDataParser, FTMS_UUIDS } from '../pkg/dist-web/index.js';

const { characteristic, service } = FTMS_UUIDS;
// add bt-device
let dev = document.createElement('bt-device');
dev.service = service;
dev.characteristic = characteristic.indoorBikeData;
dev.notifications = true;
dev = document.body.appendChild(dev);
dev.parse = (dv) => {
  console.log('parsing')
  return new IndoorBikeDataParser().parse(dv);
}
dev.addEventListener('data', (e) => {
  console.log(e.detail.value);
});

document.querySelector('.connect').addEventListener('click', async () => {
  await dev.connect();
});
