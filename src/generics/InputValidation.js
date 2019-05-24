
export default class InputValidation {

  constructor(classContext) {
    this.context = classContext;
  }

  empty = (field_name, str) => {
    let empty = {...this.context.state.empty};
    empty[field_name] = str !== ""
    this.context.setState({empty});
  }

  validateType = (field_name, str, func) => {
    let validType = {...this.context.state.validType};
    validType[field_name] = func(str)
    this.context.setState({validType});
  }

  setAndValidate = (funcs) => (field_name, str) => {
    let o = {}
    o[field_name] = str
    this.context.setState({...o});
    funcs.forEach(f => {f(field_name, str)});
  }

  isValidated = (states) => states.every(x => this.validateObj(x));
  validateObj = (obj) => Object.keys(obj).every(x => obj[x]);

  checkValid = (field_name) => this.context.state.valid[field_name] ? "" : "Ugyldig verdi"
  checkNotEmpty = (field_name) => this.context.state.empty[field_name] ? "" : "Må fylles ut"

  validateEmpty = this.setAndValidate([this.empty]);

}
