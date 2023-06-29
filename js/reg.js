const validateTxtLoginField = new FieldValidator("txtLoginId", async function (val) {
  if (!val) return "请填写账号";
  const result = await API.exists(val);
  console.log(result);
  if (result.data) return "该账号已存在";
})
const validateTxtNickNameField = new FieldValidator("txtNickname", function (val) {
  if (!val) return "请填写昵称";
})
const validateTxtLoginPwdField = new FieldValidator("txtLoginPwd", function (val) {
  if (!val) return "请填写密码";
})
const validateTxtLoginPwdConfirmField = new FieldValidator("txtLoginPwdConfirm", function (val) {
  if (!val) return "请再一次填写密码";
  if (validateTxtLoginPwdField.input.value !== val) return "两次填写密码不一致"
})

const form = $(".user-form");
form.onsubmit = async (e) => {
  e.preventDefault();
  const res = await FieldValidator.validate(validateTxtLoginField, validateTxtNickNameField, validateTxtLoginPwdField, validateTxtLoginPwdConfirmField);
  if (!res) return;
  const formData = new FormData(form);// 传入表单dom，得到一个表单数据对象
  const param = Object.fromEntries(formData.entries());
  console.log(formData);
  const result = await API.reg(param);
  if (result.code === 0) {
    alert("注册成功，点击确定跳转登录");
    location.href = "./login.html"
  }
}