
// Deployment helpers
export const dec = (val: number, scale: number) => {
    const zerosCount = scale;

    const strVal = val.toString();
    const strZeros = ('0').repeat(zerosCount);

    return strVal.concat(strZeros);
  }


