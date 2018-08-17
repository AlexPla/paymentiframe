import * as constants from '@Constants/creditCard';

const types = {};

const clone = (x) => {
  if (!x) { return null; }

  const pattern = x.pattern.source;
  const dupe = JSON.parse(JSON.stringify(x));
  dupe.pattern = pattern;

  return dupe;
};

types[constants.VISA] = {
  niceType: 'Visa',
  type: constants.VISA,
  pattern: /^4\d*$/,
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
  pattern: /^(5|5[1-5]\d*|2|22|222|222[1-9]\d*|2[3-6]\d*|27[0-1]\d*|2720\d*)$/,
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
  pattern: /^3([47]\d*)?$/,
  isAmex: true,
  gaps: [4, 10],
  lengths: [15],
  code: {
    name: constants.CID,
    size: 4,
  },
};

types[constants.DINERS_CLUB] = {
  niceType: 'Diners Club',
  type: constants.DINERS_CLUB,
  pattern: /^3((0([0-5]\d*)?)|[689]\d*)?$/,
  gaps: [4, 10],
  lengths: [14],
  code: {
    name: constants.CVV,
    size: 3,
  },
};

types[constants.DISCOVER] = {
  niceType: 'Discover',
  type: constants.DISCOVER,
  pattern: /^6(0|01|011\d*|5\d*|4|4[4-9]\d*)?$/,
  gaps: [4, 8, 12],
  lengths: [16, 19],
  code: {
    name: constants.CID,
    size: 3,
  },
};

types[constants.JCB] = {
  niceType: 'JCB',
  type: constants.JCB,
  pattern: /^((2|21|213|2131\d*)|(1|18|180|1800\d*)|(3|35\d*))$/,
  gaps: [4, 8, 12],
  lengths: [16],
  code: {
    name: constants.CVV,
    size: 3,
  },
};

types[constants.UNIONPAY] = {
  niceType: 'UnionPay',
  type: constants.UNIONPAY,
  pattern: /^6(2\d*)?$/,
  gaps: [4, 8, 12],
  lengths: [16, 17, 18, 19],
  code: {
    name: constants.CVN,
    size: 3,
  },
};

types[constants.MAESTRO] = {
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

    cards = cards.length === 0 ? false : cards;
    result.cardType = (cards.length === 1) ? cards[0] : false;
    result.maxLength = CreditCardType.getMaxLength(cards);
    result.minLength = CreditCardType.getMinLength(cards);

    return result;
  },

  getTypeInfo(type) {
    return clone(types[type]);
  },

  getMaxLength(cards) {
    const maxLength = cards
      ? Math.max(...cards.map(card => card.lengths[card.lengths.length - 1]))
      : constants.DEFAULT_MAX_LENGTH;
    return maxLength;
  },

  getMinLength(cards) {
    const minLength = cards
      ? Math.min(...cards.map(card => card.lengths[0]))
      : constants.DEFAULT_MIN_LENGTH;
    return minLength;
  },

  removeGaps(value) {
    let result = value.replace(/\s*/g, '');
    result = new RegExp(/\d*/).exec(result);
    result = !result ? '' : result[0];
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
};

export default CreditCardType;
