import CreditCardType from "helpers/CreditCardType";

describe("Credit card type:", () => {

  const VISA = 'visa';
  const MASTERCARD = 'mc';
  const AMERICAN_EXPRESS = 'amex';
  const DINERS_CLUB = 'diners-club';
  const DISCOVER = 'discover';
  const JCB = 'jcb';
  const UNIONPAY = 'unionpay';
  const MAESTRO = 'maestro'
  const CVV = 'CVV';
  const CID = 'CID';
  const CVC = 'CVC';
  const CVN = 'CVN';

  it("Expect VISA card to be correct", () => {
    const visaCard = CreditCardType.getTypeInfo(VISA);
    const visaExpected = {
      "code": {"name": "CVV", "size": 3},
      "gaps": [4, 8, 12],
      "lengths": [16],
      "niceType": "Visa",
      "pattern": "^4\\d*$",
      "type": "visa"
    }
    expect(visaCard).toEqual(visaExpected);
  });

  it("Expect MASTERCARD card to be correct", () => {
    const masterCard = CreditCardType.getTypeInfo(MASTERCARD);
    const masterCardExpected = {
      "code": {"name": "CVC", "size": 3},
      "gaps": [4, 8, 12],
      "lengths": [16],
      "niceType": "MasterCard",
      "pattern": "^(5|5[1-5]\\d*|2|22|222|222[1-9]\\d*|2[3-6]\\d*|27[0-1]\\d*|2720\\d*)$",
      "type": "mc"
    }
    expect(masterCard).toEqual(masterCardExpected);
  });

  it("Expect AMERICAN EXPRESS card to be correct", () => {
    const americanExpressCard = CreditCardType.getTypeInfo(AMERICAN_EXPRESS);
    const americanExpressCardExpected = {
      "code": {"name": "CID", "size": 4},
      "gaps": [4, 10],
      "isAmex": true,
      "lengths": [15],
      "niceType": "American Express",
      "pattern": "^3([47]\\d*)?$",
      "type": "amex"
    }
    expect(americanExpressCard).toEqual(americanExpressCardExpected);
  });

  it("Expect DINERS CLUB card to be correct", () => {
    const dinersClubCard = CreditCardType.getTypeInfo(DINERS_CLUB);
    const dinersClubCardExpected = {
      "code": {"name": "CVV", "size": 3},
      "gaps": [4, 10],
      "lengths": [14],
      "niceType": "Diners Club",
      "pattern": "^3((0([0-5]\\d*)?)|[689]\\d*)?$",
      "type": "diners-club"
    }
    expect(dinersClubCard).toEqual(dinersClubCardExpected);
  });

  it("Expect DISCOVER card to be correct", () => {
    const discoverCard = CreditCardType.getTypeInfo(DISCOVER);
    const discoverCardExpected = {
      "code": {"name": "CID", "size": 3},
      "gaps": [4, 8, 12],
      "lengths": [16, 19],
      "niceType": "Discover",
      "pattern": "^6(0|01|011\\d*|5\\d*|4|4[4-9]\\d*)?$",
      "type": "discover"
    }
    expect(discoverCard).toEqual(discoverCardExpected);
  });

  it("Expect JVC card to be correct", () => {
    const jvcCard = CreditCardType.getTypeInfo(JCB);
    const jvcCardExpected = {
      "code": {"name": "CVV", "size": 3},
      "gaps": [4, 8, 12],
      "lengths": [16],
      "niceType": "JCB",
      "pattern": "^((2|21|213|2131\\d*)|(1|18|180|1800\\d*)|(3|35\\d*))$",
      "type": "jcb"
    }
    expect(jvcCard).toEqual(jvcCardExpected);
  });

  it("Expect UNIONPAY card to be correct", () => {
    const unionplayCard = CreditCardType.getTypeInfo(UNIONPAY);
    const unionplayCardCardExpected = {
      "code": {"name": "CVN", "size": 3},
      "gaps": [4, 8, 12],
      "lengths": [16, 17, 18, 19],
      "niceType": "UnionPay",
      "pattern": "^6(2\\d*)?$",
      "type": "unionpay"
    }
    expect(unionplayCard).toEqual(unionplayCardCardExpected);
  });

  it("Expect MAESTRO card to be correct", () => {
    const maestroCard = CreditCardType.getTypeInfo(MAESTRO);
    const maestroCardCardExpected = {
      "code": {"name": "CVC", "size": 3},
      "gaps": [4, 8, 12],
      "lengths": [12, 13, 14, 15, 16, 17, 18, 19],
      "niceType": "Maestro",
      "pattern": "^((5((0|[6-9])\\d*)?)|(6|6[37]\\d*))$",
      "type": "maestro"
    }
    expect(maestroCard).toEqual(maestroCardCardExpected);
  });

});