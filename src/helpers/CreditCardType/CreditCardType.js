const types = {};
const VISA = 'visa';
const MASTERCARD = 'mc';
const AMERICAN_EXPRESS = 'amex';
const DINERS_CLUB = 'diners-club';
const DISCOVER = 'discover';
const JCB = 'jcb';
const UNIONPAY = 'unionpay';
const MAESTRO = 'maestro';
const CVV = 'CVV';
const CID = 'CID';
const CVC = 'CVC';
const CVN = 'CVN';

const clone = (x) => {
  let pattern, dupe;

  if (!x) { return null; }

  pattern = x.pattern.source;
  dupe = JSON.parse(JSON.stringify(x));
  dupe.pattern = pattern;

  return dupe;
};

types[VISA] = {
  niceType: 'Visa',
  type: VISA,
  pattern: /^4\d*$/,
  gaps: [4, 8, 12],
  lengths: [16],
  code: {
    name: CVV,
    size: 3
  }
};

types[MASTERCARD] = {
  niceType: 'MasterCard',
  type: MASTERCARD,
  pattern: /^(5|5[1-5]\d*|2|22|222|222[1-9]\d*|2[3-6]\d*|27[0-1]\d*|2720\d*)$/,
  gaps: [4, 8, 12],
  lengths: [16],
  code: {
    name: CVC,
    size: 3
  }
};

types[AMERICAN_EXPRESS] = {
  niceType: 'American Express',
  type: AMERICAN_EXPRESS,
  pattern: /^3([47]\d*)?$/,
  isAmex: true,
  gaps: [4, 10],
  lengths: [15],
  code: {
    name: CID,
    size: 4
  }
};

types[DINERS_CLUB] = {
  niceType: 'Diners Club',
  type: DINERS_CLUB,
  pattern: /^3((0([0-5]\d*)?)|[689]\d*)?$/,
  gaps: [4, 10],
  lengths: [14],
  code: {
    name: CVV,
    size: 3
  }
};

types[DISCOVER] = {
  niceType: 'Discover',
  type: DISCOVER,
  pattern: /^6(0|01|011\d*|5\d*|4|4[4-9]\d*)?$/,
  gaps: [4, 8, 12],
  lengths: [16, 19],
  code: {
    name: CID,
    size: 3
  }
};

types[JCB] = {
  niceType: 'JCB',
  type: JCB,
  pattern: /^((2|21|213|2131\d*)|(1|18|180|1800\d*)|(3|35\d*))$/,
  gaps: [4, 8, 12],
  lengths: [16],
  code: {
    name: CVV,
    size: 3
  }
};

types[UNIONPAY] = {
  niceType: 'UnionPay',
  type: UNIONPAY,
  pattern: /^6(2\d*)?$/,
  gaps: [4, 8, 12],
  lengths: [16, 17, 18, 19],
  code: {
    name: CVN,
    size: 3
  }
};

types[MAESTRO] = {
  niceType: 'Maestro',
  type: MAESTRO,
  pattern: /^((5((0|[6-9])\d*)?)|(6|6[37]\d*))$/,
  gaps: [4, 8, 12],
  lengths: [12, 13, 14, 15, 16, 17, 18, 19],
  code: {
    name: CVC,
    size: 3
  }
};

const CreditCardType = (cardNumber) => {
  let type, value;
  const result = [];

  if (!(typeof cardNumber === 'string' || cardNumber instanceof String)) {
    return result;
  }

  for (type in types) {
    if (!types.hasOwnProperty(type)) { continue; }

    value = types[type];

    if (cardNumber.length === 0 || value.pattern.test(cardNumber)) {
      result.push(clone(value));
    }
  }

  return result;
};

CreditCardType.getTypeInfo = function (type) {
  return clone(types[type]);
};

CreditCardType.types = {
  VISA: VISA,
  MASTERCARD: MASTERCARD,
  AMERICAN_EXPRESS: AMERICAN_EXPRESS,
  DINERS_CLUB: DINERS_CLUB,
  DISCOVER: DISCOVER,
  JCB: JCB,
  UNIONPAY: UNIONPAY,
  MAESTRO: MAESTRO
};

export default CreditCardType;
