const validaTetxtLoginIdField = new FieldValidator("txtLoginId", function (val) {
  if (!val) return "请填写账号";
})
const validateTxtTxtLoginPwdField = new FieldValidator("txtLoginPwd", function (val) {
  if (!val) return "请填写密码";
})

const form = $(".user-form");
form.onsubmit = async (e) => {
  e.preventDefault();
  const res = await FieldValidator.validate(validaTetxtLoginIdField, validateTxtTxtLoginPwdField);
  if (!res) return;
  const formData = new FormData(form);
  const param = Object.fromEntries(formData.entries());
  console.log(formData);
  const result = await API.login(param);
  if (result.code === 0) {
    alert("登录成功，点击确定跳转聊天");
    location.href = "./index.html"
  } else {
    alert(result.msg);
  }
}