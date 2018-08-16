const ExpDateHelper = {
  extractValueFromVisualValue(value) {
    value=value.replace(/\s*/g, '').replace(/\//g, '');
    value=new RegExp(/\d*/).exec(value)[0];
    if (value.length === 1 && '2' <= value && value <= '9') {
      value=`0${value}`;
    }
    value={
      month: value.substr(0,2),
      year: value.substr(2,2)
    };
    return value;
  }
}

export default ExpDateHelper;