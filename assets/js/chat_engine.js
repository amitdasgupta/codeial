class ChatEngine {
  constructor(chatBoxId, userEmail) {
    console.log(chatBoxId, userEmail, "-------------------------->");
    this.chatBox = $(`.${chatBoxId}`);
    this.userEmail = userEmail;
    this.socket = io.connect("http://localhost:5000");
    if (this.userEmail) {
      this.connectionHandler();
    }
  }

  connectionHandler() {
    let self = this;
    this.socket.on("connect", function() {
      console.log("connection established using sockets...!");

      self.socket.emit("join_room", {
        user_email: self.userEmail,
        chatroom: "codeial"
      });

      self.socket.on("user_joined", function(data) {
        console.log("a user  joined!", data);
      });
      $(".chat-box>form>input[type=button]").click(function(e) {
        e.preventDefault();
        let msg = $(".chat-box>form>input[type=text]").val();
        if (msg != "") {
          self.socket.emit("send_message", {
            message: msg,
            user_email: self.userEmail,
            chatroom: "codeial"
          });
        }
      });
    });
    self.socket.on("receive_message", function(data) {
      // console.log("current user:", self.userEmail, "sender:", data.user_email);
      let messageType = "other-message";
      if (data.user_email == self.userEmail) {
        messageType = "self-message";
      }
      $(".chat-box>.messages").append(`<div class="message ${messageType}">
          ${data.message}
        </div>`);
    });
  }
}
