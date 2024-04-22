/* eslint-disable @typescript-eslint/no-explicit-any */

export const CommonUtil = {
  isEmpty,
  isNotEmpty,
  isExistAll,
  dateFilter,
  round,
};

function isEmpty(value: any) {
  if (
    value === '' ||
    value == null ||
    value == undefined ||
    (value != null && typeof value == 'object' && !Object.keys(value).length)
  ) {
    return true;
  }
  return false;
}

function isNotEmpty(value: any) {
  return !isEmpty(value);
}

function isExistAll(...values: any[]) {
  for (const item of values) {
    if (isEmpty(item)) return false;
  }
  return true;
}

function dateFilter(value: Date, division: string) {
  const datetime = new Date(value);
  const year = datetime.getFullYear();
  const month =
    datetime.getMonth() + 1 < 10
      ? '0' + (datetime.getMonth() + 1).toString()
      : (datetime.getMonth() + 1).toString();
  const date =
    datetime.getDate() < 10
      ? '0' + datetime.getDate()
      : datetime.getDate().toString();

  return year + division + month + division + date;
}

/**
 * 특정 자리에서 반올림
 * @param value
 * @param point 반올림할 자릿수 위치 (3: 소숫점 셋째자리에서 반올림, -2: 십의자리에서 반올림, -1: 일의자리에서 반올림)
 * @returns
 */
function round(value: number, point: number) {
  if (point > 0) {
    point = point - 1;
    return Math.round(value * 10 ** point) / 10 ** point;
  } else if (point < 0) {
    point = point * -1;
    return Math.round(value / 10 ** point) * 10 ** point;
  } else {
    return value;
  }
}
