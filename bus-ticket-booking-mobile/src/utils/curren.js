import _ from 'lodash';


export function numberFormat(string) {
  return _.isEmpty(string) ? 0 : Number(string?.replace(/\./g, ''));
}

export function currencyFormat(value, currencyUnit) {
  if (value !== undefined) {
    return value?.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') + `${currencyUnit}`;
  } else {
    return `0 ${currencyUnit}`;
  }
}

export const currencyMark = (num) => {
  let value = num;
  value = value?.replace(/\D/g, '');
  value = value?.replace(/(\d)(\d{3})$/, '$1.$2');
  value = value?.replace(/(?=(\d{3})+(\D))\B/g, '.');
  num = value;
  return num;
};

export const convertCurrency = (num) => `${num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}đ`;
