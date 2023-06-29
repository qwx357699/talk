/**
 * @class FieldValidator 表单单个校验器
 */
class FieldValidator {
  /**
   * 
   * @param {String} id 文本框id
   * @param {Function} validatorFunc 校验规则函数，当需要对输入验证时，会调用该函数，参数传入文本框的值，函数返回值为验证的错误消息，若没有返回，则表示无错误
   */
  constructor(id, validatorFunc) {
    this.input = $("#" + id);
    this.p = this.input.nextElementSibling;
    this.validatorFunc = validatorFunc;
    this.input.addEventListener("blur", (e) => {
      this.validate();
    })
  }
  /**
   * 验证，成功返回true,失败返回false
   */
  async validate() {
    const err = await this.validatorFunc(this.input.value);
    if (err) {
      // 有错误，没有操作err类，我认为是防止坍塌
      this.p.innerText = err;
      return false;
    } else {
      this.p.innerText = '';
      return true;
    }
  }
  /**
   * 校验所有的校验器，返回校验结果
   * @param  {...FieldValidator} validators 
   */
  static async validate(...validators) {
    const tasks = validators.map(validator => Promise.resolve(validator.validate()))
    const result = await Promise.all(tasks);
    return result.every(r => r);
  }
}
