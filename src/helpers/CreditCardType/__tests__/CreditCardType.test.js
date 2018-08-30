import * as constants from '@Constants/creditCard';
import CreditCardType from '../CreditCardType';

describe('Credit card type:', () => {
  it('Expect null card to return no card info', () => {
    expect(CreditCardType.getTypeInfo()).toBeNull();
  });

  it('Expect VISA card to be correct', () => {
    const visaCard = CreditCardType.getTypeInfo(constants.VISA);
    const visaExpected = {
      code: { name: constants.CVV, size: 3 },
      gaps: [4, 8, 12],
      lengths: [16],
      niceType: 'Visa',
      pattern: '^4(?!(51416)|(38935)|(0117[8-9])|(5763[1-2])|(57393)|(31274)|(02934))\\d*$',
      type: constants.VISA,
    };
    expect(visaCard).toEqual(visaExpected);
  });

  it('Expect MASTERCARD card to be correct', () => {
    const masterCard = CreditCardType.getTypeInfo(constants.MASTERCARD);
    const masterCardExpected = {
      code: { name: constants.CVC, size: 3 },
      gaps: [4, 8, 12],
      lengths: [16],
      niceType: 'MasterCard',
      pattern: '^5(?!(0670[7-8])|(06715)|(0671[7-9])|(0672[0-1])|(0672[4-9])|(0673[0-3])|(06739)|(0674[0-8])|(0675[0-3])|(0677[4-8])|(0900[0-9])|(0901[3-9])|(0902[0-9])|(0903[1-5])|(0903[8-9])|(0904[0-9])|(0905[0-9])|(0906[0-4])|(0906[6-9])|(0907[0-2])|(0907[4-5])|(04175)|(0907[6-9])|(0908[0-9])|(30032)|(22499)|(09[0-7][0-9]{2})|(09[8]0[0-9])|509810)\\d*$',
      type: constants.MASTERCARD,
    };
    expect(masterCard).toEqual(masterCardExpected);
  });

  it('Expect AMERICAN EXPRESS card to be correct', () => {
    const americanExpressCard = CreditCardType.getTypeInfo(constants.AMERICAN_EXPRESS);
    const americanExpressCardExpected = {
      code: { name: constants.CID, size: 4 },
      gaps: [4, 10],
      isAmex: true,
      lengths: [15],
      niceType: 'American Express',
      pattern: '^3[47]\\d*$',
      type: constants.AMERICAN_EXPRESS,
    };
    expect(americanExpressCard).toEqual(americanExpressCardExpected);
  });

  it('Expect DINERS CLUB card to be correct', () => {
    const dinersClubCard = CreditCardType.getTypeInfo(constants.DINERS_CLUB);
    const dinersClubCardExpected = {
      code: { name: constants.CVV, size: 3 },
      gaps: [4, 10],
      lengths: [14],
      niceType: 'Diners Club',
      pattern: '^3(0[0-5]|[68][0-9])\\d*$',
      type: constants.DINERS_CLUB,
    };
    expect(dinersClubCard).toEqual(dinersClubCardExpected);
  });

  it('Expect ELO card to be correct', () => {
    const eloCard = CreditCardType.getTypeInfo(constants.ELO);
    const eloCardExpected = {
      code: { name: constants.CVE, size: 3 },
      gaps: [4, 8, 12],
      lengths: [16],
      niceType: 'Elo',
      pattern: '^((509091)|(636368)|(636297)|(504175)|(438935)|(40117[8-9])|(45763[1-2])|(457393)|(431274)|(50990[0-2])|(5099[7-9][0-9])|(50996[4-9])|(509[1-8][0-9][0-9])|(5090(0[0-2]|0[4-9]|1[2-9]|[24589][0-9]|3[1-9]|6[0-46-9]|7[0-24-9]))|(5067(0[0-24-8]|1[0-24-9]|2[014-9]|3[0-379]|4[0-9]|5[0-3]|6[0-5]|7[0-8]))|(6504(0[5-9]|1[0-9]|2[0-9]|3[0-9]))|(6504(8[5-9]|9[0-9])|6505(0[0-9]|1[0-9]|2[0-9]|3[0-8]))|(6505(4[1-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-8]))|(6507(0[0-9]|1[0-8]))|(65072[0-7])|(6509(0[1-9]|1[0-9]|20))|(6516(5[2-9]|6[0-9]|7[0-9]))|(6550(0[0-9]|1[0-9]))|(6550(2[1-9]|3[0-9]|4[0-9]|5[0-8])))\\d*$',
      type: constants.ELO,
    };
    expect(eloCard).toEqual(eloCardExpected);
  });

  it('should return card type', () => {
    const masterCardNumber = '5585558555855583';
    const masterCardType = {
      cardType: {
        code: { name: constants.CVC, size: 3 },
        gaps: [4, 8, 12],
        lengths: [16],
        niceType: 'MasterCard',
        pattern: /^5(?!(0670[7-8])|(06715)|(0671[7-9])|(0672[0-1])|(0672[4-9])|(0673[0-3])|(06739)|(0674[0-8])|(0675[0-3])|(0677[4-8])|(0900[0-9])|(0901[3-9])|(0902[0-9])|(0903[1-5])|(0903[8-9])|(0904[0-9])|(0905[0-9])|(0906[0-4])|(0906[6-9])|(0907[0-2])|(0907[4-5])|(04175)|(0907[6-9])|(0908[0-9])|(30032)|(22499)|(09[0-7][0-9]{2})|(09[8]0[0-9])|509810)\d*$/,
        type: constants.MASTERCARD,
      },
      maxLength: 16,
      minLength: 16,
    };
    expect(CreditCardType.getCardType(masterCardNumber)).toEqual(masterCardType);
  });

  it('should not return card type', () => {
    const integerCardNumber = 5585558555855583;
    const defaultType = {
      cardType: false,
      maxLength: constants.DEFAULT_MAX_LENGTH,
      minLength: constants.DEFAULT_MIN_LENGTH,
    };
    expect(CreditCardType.getCardType(integerCardNumber)).toEqual(defaultType);
  });

  it('should get default max and min lengths', () => {
    expect(CreditCardType.getMaxLength()).toEqual(constants.DEFAULT_MAX_LENGTH);
    expect(CreditCardType.getMinLength()).toEqual(constants.DEFAULT_MIN_LENGTH);
  });

  it('should remove and add gaps', () => {
    const cardNumberWithGaps = '5585 5585 5585 5583';
    const cardNumberWOGaps = '5585558555855583';
    expect(CreditCardType.removeGaps(cardNumberWithGaps)).toEqual(cardNumberWOGaps);
    expect(CreditCardType.addGaps(cardNumberWOGaps)).toEqual(cardNumberWithGaps);
  });

  it('should validate correct luhn', () => {
    const correctCardNumber = '5585558555855583';
    expect(CreditCardType.isLuhnValid(correctCardNumber)).toBeTruthy();
  });

  it('should validate incorrect luhn', () => {
    const incorrectCardNumber = '49927398717';
    expect(CreditCardType.isLuhnValid(incorrectCardNumber)).toBeFalsy();
  });
});
