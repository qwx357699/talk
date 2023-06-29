const API = (function () {
  const BASE_URL2 = "https://study.duyiedu.com";
  const TOKEN = "token";

  /**
   * 
   * @param {*} url 
   * @returns 返回响应体，想要数据，需要.json()等方式获取
   */
  async function get(url) {
    const headers = getHeaders();
    return await fetch(BASE_URL2 + url, { headers });
  }
  async function post(url, bodyObj) {
    const headers = getHeaders();
    headers.append("Content-Type", "application/json");
    return await fetch(BASE_URL2 + url, {
      method: "POST",
      headers,
      body: JSON.stringify(bodyObj)
    })
  }
  /**
   * headers 请求前处理，添加认证token
   * @returns headers
   */
  function getHeaders() {
    const headers = new Headers();
    const token = localStorage.getItem(TOKEN);
    if (token) {
      headers.append("authorization", 'Bearer ' + token);
    }
    return headers;
  }

  /**
   * 注册
   * @param {*} userInfo 用户信息
   * @param {String} userInfo.loginId 账号
   * @param {String} userInfo.nickname 昵称 
   * @param {String} userInfo.loginPwd 密码
   */
  async function reg(userInfo) {
    const resp = await post("/api/user/reg", {
      "loginId": userInfo.loginId,
      "nickname": userInfo.nickname,
      "loginPwd": userInfo.loginPwd
    })
    return await resp.json();
  }
  /**
   * 登录
   * @param {Object} loginInfo 账户信息
   * @param {String} loginInfo.loginId 账户
   * @param {String} loginInfo.loginPwd 密码
   * @returns 服务器信息
   */
  async function login(loginInfo) {
    const resp = await post('/api/user/login', {
      loginId: loginInfo.loginId,
      loginPwd: loginInfo.loginPwd
    });
    const res = await resp.json();
    if (res.code === 0) {
      localStorage.setItem("token", resp.headers.get("authorization"))
    }
    return res;
  }
  /**
   * 用户是否存在
   * @param {*} loginId 
   * @returns 
   */
  async function exists(loginId) {
    return await (await get('/api/user/exists?loginId=' + loginId)).json();
  }

  /**
   * 
   * @returns 用户信息
   */
  async function profile() {
    // return await (await get("/api/user/profile")).json();
    const resp = await get("/api/user/profile");
    const r = await resp.json();
    console.log(r);
    return r;
  }
  /**
   * 发送聊天内容
   * @param {*} content 
   * @returns 
   */
  async function sendChat(content) {
    return await (await post("/api/chat", { content })).json();
  }
  /**
   * 获取所有聊天记录
   * @returns 
   */
  async function getHistory() {
    return await (await get("/api/chat/history")).json();
  }
  /**
   * 退出登录
   */
  function loginOut() {
    localStorage.removeItem(TOKEN);
  }
  return {
    reg,
    login,
    exists,
    profile,
    sendChat,
    getHistory,
    loginOut
  }
})()