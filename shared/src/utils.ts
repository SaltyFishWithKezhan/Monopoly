export function updatePlainObject(origin: any, source: any): void {
  for (let key in source) {
    if (typeof source[key] === 'object') {
      if (!(key in origin) || typeof origin[key] !== 'object') {
        origin[key] = {};
      }

      updatePlainObject(origin[key], source[key]);
    } else {
      origin[key] = source[key];
    }
  }
}
