/**
 * @questions 1.访问页面后判断用户没有登录，会出现页面出来现象？按理说不应显示页面，直接跳到登录页，这个整么处理
 */
const doms = {
  main: {
    container: $('.chat-container'),
    form: $('.msg-container'),
    txtMsg: $('#txtMsg')
  },
  aside: {
    img: $(".aside-avatar"),
    nickname: $("#nickname"),
    loginId: $("#loginId")
  },
  close: $(".close")
}
const parse = new DOMParser();

// 1.怎么进去 获取个人信息，判断是否登录
async function getUserInfo() {
  const resp = await API.profile();
  if (resp.code === 401) {
    alert(resp.msg);
    location.href = "./login.html"
  } else {
    const { nickname, loginId } = resp.data;
    doms.aside.nickname.innerText = nickname;
    doms.aside.loginId.innerText = loginId;
  }
}
getUserInfo();
// 2.获取聊天记录，展示，聊天记录显示到底部
async function getHistoryList() {
  const { data } = await API.getHistory();
  data.forEach(item => {
    createChatItem(item);
  });
  chatContainerScrollToBottom();
}
/**
 * 创建一个对话item
 * @param {*} data 
 */
function createChatItem(data) {
  const chatTimeStr = `
        <div class="chat-item ${data.from ? 'me' : ''}">
          <img class="chat-avatar" src="./asset/${data.from ? 'avatar.png' : 'robot-avatar.jpg'}" />
          <div class="chat-content">${data.content}</div>
          <div class="chat-date">${formatTime(data.createdAt)}</div>
        </div>
      `;
  const chatTimeDom = parse.parseFromString(chatTimeStr, 'text/html').querySelector(".chat-item");
  doms.main.container.append(chatTimeDom);
}
/**
 * 时间格式化
 * @param {*} timestamp 
 * @returns {String} YYYY-MM-DD HH:mm:ss
 */
function formatTime(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDay().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
/***
 * chat-container 内容滚动到底部
 */
function chatContainerScrollToBottom() {
  const chatContainer = doms.main.container;
  const clientHeight = chatContainer.clientHeight;
  const scrollHeight = chatContainer.scrollHeight;
  chatContainer.scrollTo(0, scrollHeight - clientHeight);
}
getHistoryList();

// 3.发送聊天记录，怎么发送，怎么接收，发送后要处理什么
async function sendMessage() {
  const content = doms.main.txtMsg.value.trim();
  if (!content) return;
  const msg = {
    content,
    createdAt: Date.now(),
    from: doms.aside.loginId.innerText,
    to: null
  }
  createChatItem(msg);
  chatContainerScrollToBottom();
  const resp = await API.sendChat(content);
  if (resp.code === 0) {
    const reply = {
      content: resp.data.content,
      createdAt: resp.data.createdAt,
      from: null,
      to: doms.aside.loginId.innerText
    }
    createChatItem(reply);
    chatContainerScrollToBottom();
  }
}
doms.main.form.onsubmit = function (e) {
  e.preventDefault();
  sendMessage();
  doms.main.txtMsg.value = "";
}
// 4.退出登录，点击×号，注销，跳转登录页
doms.close.onclick = () => {
  API.loginOut();
  location.href = "./login.html"
}