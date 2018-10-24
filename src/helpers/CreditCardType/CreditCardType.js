import * as constants from '@Constants/creditCard';
import copies from '@Copies/cardNumberInput';

const types = {};
const notSupportedTypes = {};

const clone = (x) => {
  if (!x) { return null; }

  const pattern = x.pattern.source;
  const dupe = JSON.parse(JSON.stringify(x));
  dupe.pattern = pattern;

  return dupe;
};

// SUPPORTED TYPES
types[constants.VISA] = {
  niceType: 'Visa',
  type: constants.VISA,
  pattern: /^4(?!(51416)|(38935)|(0117[8-9])|(5763[1-2])|(57393)|(31274)|(02934))\d*$/,
  gaps: [4, 8, 12],
  lengths: [16],
  code: {
    name: constants.CVV,
    size: 3,
  },
};

types[constants.MASTERCARD] = {
  niceType: 'MasterCard',
  type: constants.MASTERCARD,
  pattern: /^5(?!(06699)|(0670[7-8])|(06715)|(0671[7-9])|(0672[0-1])|(0672[4-9])|(0673[0-3])|(06739)|(0674[0-8])|(0675[0-3])|(0677[4-8])|(0900[0-9])|(0901[3-9])|(0902[0-9])|(0903[1-5])|(0903[8-9])|(0904[0-9])|(0905[0-9])|(0906[0-4])|(0906[6-9])|(0907[0-2])|(0907[4-5])|(04175)|(0907[6-9])|(0908[0-9])|(30032)|(22499)|(09[0-7][0-9]{2})|(09[8]0[0-9])|509810)\d*$/,
  gaps: [4, 8, 12],
  lengths: [16],
  code: {
    name: constants.CVC,
    size: 3,
  },
};

types[constants.AMERICAN_EXPRESS] = {
  niceType: 'American Express',
  type: constants.AMERICAN_EXPRESS,
  pattern: /^3[47]\d*$/,
  isAmex: true,
  gaps: [4, 10],
  lengths: [15],
  code: {
    name: constants.CID,
    size: 4,
  },
};

types[constants.ELO] = {
  niceType: 'Elo',
  type: constants.ELO,
  pattern: /^((509091)|(636368)|(636297)|(504175)|(438935)|(40117[8-9])|(45763[1-2])|(457393)|(431274)|(50990[0-2])|(5099[7-9][0-9])|(50996[4-9])|(509[1-8][0-9][0-9])|(5090(0[0-2]|0[4-9]|1[2-9]|[24589][0-9]|3[1-9]|6[0-46-9]|7[0-24-9]))|(506699)|(5067(0[0-24-8]|1[0-24-9]|2[014-9]|3[0-379]|4[0-9]|5[0-3]|6[0-5]|7[0-8]))|(6504(0[5-9]|1[0-9]|2[0-9]|3[0-9]))|(6504(8[5-9]|9[0-9])|6505(0[0-9]|1[0-9]|2[0-9]|3[0-8]))|(6505(4[1-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-8]))|(6507(0[0-9]|1[0-8]))|(65072[0-7])|(6509(0[1-9]|1[0-9]|20))|(6516(5[2-9]|6[0-9]|7[0-9]))|(6550(0[0-9]|1[0-9]))|(6550(2[1-9]|3[0-9]|4[0-9]|5[0-8])))\d*$/,
  gaps: [4, 8, 12],
  lengths: [16],
  code: {
    name: constants.CVE,
    size: 3,
  },
};


// NOT SUPPORTED TYPES
notSupportedTypes[constants.DINERS_CLUB] = {
  niceType: 'Diners Club',
  type: constants.DINERS_CLUB,
  pattern: /^3(0[0-5]|[68][0-9])\d*$/,
  gaps: [4, 10],
  lengths: [14],
  code: {
    name: constants.CVV,
    size: 3,
  },
};

notSupportedTypes[constants.DISCOVER] = {
  niceType: 'Discover',
  type: constants.DISCOVER,
  pattern: /^6(011|44|5)\d*$/,
  gaps: [4, 8, 12],
  lengths: [16, 19],
  code: {
    name: constants.CID,
    size: 3,
  },
};

notSupportedTypes[constants.JCB] = {
  niceType: 'JCB',
  type: constants.JCB,
  pattern: /^(2131|1800|35)\d*$/,
  gaps: [4, 8, 12],
  lengths: [16],
  code: {
    name: constants.CVV,
    size: 3,
  },
};

notSupportedTypes[constants.UNIONPAY] = {
  niceType: 'UnionPay',
  type: constants.UNIONPAY,
  pattern: /^62\d*$/,
  gaps: [4, 8, 12],
  lengths: [16, 17, 18, 19],
  code: {
    name: constants.CVN,
    size: 3,
  },
};

notSupportedTypes[constants.MAESTRO] = {
  niceType: 'Maestro',
  type: constants.MAESTRO,
  pattern: /^((5((0|[6-9])\d*)?)|(6|6[37]\d*))$/,
  gaps: [4, 8, 12],
  lengths: [12, 13, 14, 15, 16, 17, 18, 19],
  code: {
    name: constants.CVC,
    size: 3,
  },
};

const CreditCardType = {

  getCardType(cardNumber) {
    let cards = [];
    const result = {
      cardType: false,
      maxLength: constants.DEFAULT_MAX_LENGTH,
      minLength: constants.DEFAULT_MIN_LENGTH,
    };

    if (!(typeof cardNumber === 'string' || cardNumber instanceof String)) {
      return result;
    }

    cards = Object.values(types)
      .filter(type => (cardNumber.length === 0 || type.pattern.test(cardNumber)));

    result.cardType = (cards.length === 1) ? cards[0] : false;
    result.maxLength = CreditCardType.getMaxLength(cards);
    result.minLength = CreditCardType.getMinLength(cards);

    return result;
  },

  getTypeInfo(type) {
    return clone(types[type]);
  },

  getMaxLength(cards) {
    const maxLength = (cards && cards.length > 0)
      ? Math.max(...cards.map(card => card.lengths[card.lengths.length - 1]))
      : constants.DEFAULT_MAX_LENGTH;
    return maxLength;
  },

  getMinLength(cards) {
    const minLength = (cards && cards.length > 0)
      ? Math.min(...cards.map(card => card.lengths[0]))
      : constants.DEFAULT_MIN_LENGTH;
    return minLength;
  },

  removeGaps(value) {
    let result = value.replace(/\s*/g, '');
    [result] = new RegExp(/\d*/).exec(result);
    return result.toString();
  },

  addGaps(value, type) {
    const gaps = type && type.gaps
      ? type.gaps.sort((a, b) => a - b).reverse()
      : constants.DEFAULT_GAPS;
    const tmpArr = value.split('');
    gaps.forEach((gap) => {
      if (gap < value.length) {
        tmpArr.splice(gap, 0, ' ');
      }
    });
    return tmpArr.join('');
  },

  isLuhnValid(value) {
    const backwardsValueArr = value.split('').reverse();
    const checkDigit = parseInt(backwardsValueArr[0], 10);
    const luhnSum = backwardsValueArr.reduce((sum, element, index) => {
      let result = parseInt(element, 10);
      if (index % 2 === 1) {
        result = (result * 2 >= 10) ? ((result * 2) % 10) + 1 : result * 2;
      }
      return sum + result;
    }, 0);
    const luhnCheck = checkDigit === ((luhnSum - checkDigit) * 9) % 10;
    return luhnCheck && (luhnSum % 10 === 0);
  },

  validateInput(lang, value) {
    let error = '';
    if (value.length === 0) {
      error = copies.errors.required[lang];
    } else if (!CreditCardType.isLuhnValid(value)) {
      error = copies.errors.pattern[lang];
    }
    return error;
  },
};

export default CreditCardType;
