interface CharacteristicParser<T> {
  parse(dataView: DataView): T;
}

export { CharacteristicParser };

export function fromHex(hex: string) {
  hex = hex.replace(/ /g, '');
  if (typeof hex !== 'string') {
    throw new TypeError('Expected input to be a string');
  }

  if (hex.length % 2 !== 0) {
    throw new RangeError('Expected string to be an even number of characters');
  }

  var view = new Uint8Array(hex.length / 2);

  for (var i = 0; i < hex.length; i += 2) {
    view[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }

  return new DataView(view.buffer);
}
