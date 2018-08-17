const ExpDateHelper = {
  extractValueFromVisualValue(value) {
    let result = value.replace(/\s*/g, '').replace(/\//g, '');
    [result] = new RegExp(/\d*/).exec(result);
    if (result.length === 1 && result >= '2' && result <= '9') {
      result = `0${result}`;
    }
    result = {
      month: result.substr(0, 2),
      year: result.substr(2, 2),
    };
    return result;
  },
};

export default ExpDateHelper;
