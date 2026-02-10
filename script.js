 const inputt = document.getElementById("searchInput");
  const sendBtnn = document.getElementById("sendBtn");

  inputt.addEventListener("input", () => {
    sendBtnn.disabled = inputt.value.trim() === "";
  });

inputt.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !sendBtnn.disabled) {
    sendBtnn.click();
  }
});





  const input = document.getElementById("searchInput");
  const sendBtn = document.getElementById("sendBtn");
  const chat = document.getElementById("chat");
  const hero = document.getElementById("hero");

  // Enable / disable send button
  input.addEventListener("input", () => {
    sendBtn.disabled = input.value.trim() === "";
  });

 function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  // Hide intro UI on first message
  hero.classList.add("hidden");
  document.getElementById("chips").classList.add("hidden");
  document.getElementById("features").classList.add("hidden");

  /* ---------- USER MESSAGE ---------- */
  const userMsg = document.createElement("div");
  userMsg.className = "message";
  userMsg.textContent = text;
  chat.appendChild(userMsg);

  // ✅ SAVE USER MESSAGE
  saveMessage("user", text);

// 🔓 Unlock New Chat AFTER first message
if (isNewChatLocked) {
  isNewChatLocked = false;
  newChatBtn.disabled = false;
  newChatBtn.style.opacity = "1";
}


  input.value = "";
  sendBtn.disabled = true;
  chat.scrollTop = chat.scrollHeight;

  /* ---------- AI RESPONSE ---------- */
  setTimeout(() => {
    const reply = getBotReply(text);

    const botMsg = document.createElement("div");
    botMsg.className = "message ai";
    botMsg.textContent = reply;
    chat.appendChild(botMsg);

    // ✅ SAVE AI MESSAGE
    saveMessage("ai", reply);

    chat.scrollTop = chat.scrollHeight;
  }, 600);
}


function getBotReply(userText) {
  const msg = userText.toLowerCase();

  // Greetings
  if (
    msg === "hi" ||
    msg === "hello" ||
    msg === "hey" ||
    msg === "whatsup" ||
    msg === "what's up"
  ) {
    const greetings = [
      "Hey 👋 What are you shopping for today?",
      "Hello! 😊 Tell me what you’re looking for.",
      "Hi there! I can help you find anything online.",
      "What’s up! 🔍 Search for an item to get started."
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // Default fallback
  return "Nice 👍 Type the product you want and I’ll find the best options for you.";
}


  // Button click
  sendBtn.addEventListener("click", sendMessage);

  // Enter key
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !sendBtn.disabled) {
      sendMessage();
    }
  });

  const navi = document.getElementById("navi");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  // Open sidebar
  navi.addEventListener("click", () => {
    sidebar.classList.add("active");
    overlay.classList.add("active");
    navi.style.display = "none";
  });

  // Close sidebar when touching screen
  overlay.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
    navi.style.display = "block";
  });


let chats = JSON.parse(localStorage.getItem("findit_chats")) || [];
let currentChatId = null;

const recentContainer = document.getElementById("recent");

/* ---------- RENDER RECENT ---------- */
function renderRecent() {
  document.querySelectorAll(".recent-item").forEach(e => e.remove());

  chats.forEach(chatItem => {
    const div = document.createElement("div");
    div.className = "recent-item";

    const title = document.createElement("span");
    title.textContent = "🕒 " + chatItem.title;
    title.style.flex = "1";
    title.onclick = () => loadChat(chatItem.id);

    /* ACTIONS */
    const actions = document.createElement("div");
    actions.className = "actions";

    // Delete button
    const delBtn = document.createElement("button");
    delBtn.innerHTML = "🗑";
    delBtn.onclick = (e) => {
      e.stopPropagation();
      deleteChat(chatItem.id);
    };

    // Menu button
    const menuBtn = document.createElement("button");
    menuBtn.innerHTML = "⋮";
    menuBtn.onclick = (e) => {
      e.stopPropagation();
      showContextMenu(e.pageX, e.pageY, chatItem.id);
    };

    actions.appendChild(menuBtn);
    actions.appendChild(delBtn);

    div.appendChild(title);
    div.appendChild(actions);

    // RIGHT CLICK
    div.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      showContextMenu(e.pageX, e.pageY, chatItem.id);
    });

    recentContainer.appendChild(div);
  });
}


/* ---------- LOAD CHAT ---------- */
function loadChat(id) {
  const chatData = chats.find(c => c.id === id);
  if (!chatData) return;

  chat.innerHTML = "";
  currentChatId = id;

  hero.classList.add("hidden");
  document.getElementById("chips").classList.add("hidden");
  document.getElementById("features").classList.add("hidden");

  chatData.messages.forEach(msg => {
    const div = document.createElement("div");
    div.className = msg.sender === "ai" ? "message ai" : "message";
    div.textContent = msg.text;
    chat.appendChild(div);
  });

  chat.scrollTop = chat.scrollHeight;
}

/* ---------- SAVE CHAT ---------- */
function saveMessage(sender, text) {
  if (!currentChatId) {
    currentChatId = Date.now().toString();

    chats.unshift({
      id: currentChatId,
      title: text.split(" ").slice(0, 4).join(" "),
      messages: []
    });
  }

  const chatObj = chats.find(c => c.id === currentChatId);
  chatObj.messages.push({ sender, text });

  localStorage.setItem("findit_chats", JSON.stringify(chats));
  renderRecent();
}


const newChatBtn = document.getElementById("newChatBtn");
let isNewChatLocked = false;

// Start a new chat
newChatBtn.addEventListener("click", () => {
  if (isNewChatLocked) return;

  // Clear chat UI
  chat.innerHTML = "";

  // Reset intro UI
  hero.classList.remove("hidden");
  document.getElementById("chips").classList.remove("hidden");
  document.getElementById("features").classList.remove("hidden");

  // Reset chat state
  currentChatId = null;
  isNewChatLocked = true;

  // Lock button visually
  newChatBtn.disabled = true;
  newChatBtn.style.opacity = "0.6";
});

/* ---------- DELETE CHAT ---------- */
function deleteChat(id) {
  chats = chats.filter(c => c.id !== id);
  localStorage.setItem("findit_chats", JSON.stringify(chats));

  if (currentChatId === id) {
    chat.innerHTML = "";
    currentChatId = null;
  }

  renderRecent();
  removeContextMenu();
}

/* ---------- CONTEXT MENU ---------- */
function showContextMenu(x, y, chatId) {
  removeContextMenu();

  const menu = document.createElement("div");
  menu.className = "context-menu";
  menu.style.top = y + "px";
  menu.style.left = x + "px";

  const del = document.createElement("div");
  del.textContent = "Delete chat";
  del.onclick = () => deleteChat(chatId);

  menu.appendChild(del);
  document.body.appendChild(menu);
}

/* Remove menu on click anywhere */
function removeContextMenu() {
  document.querySelectorAll(".context-menu").forEach(m => m.remove());
}

document.addEventListener("click", removeContextMenu);
