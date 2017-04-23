require('babel-polyfill');

export default function* () {
  if (this >= 0) {
    for (let i = 0; i <= this; i++) {
      yield i;
    }
  } else {
    for (let i = 0; i >= this; i--) {
      yield i;
    }
  }
}
