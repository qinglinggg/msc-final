import React, { Component, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import iconMenubarGrey from "./images/menubarGrey.png";
import profilePicture from "./images/woman.jpg";
import backspaceIcon from "./images/backspaceIcon.png";
import axios from "axios";

function Message(props) {
  const [formMessages, setFormMessages] = useState([]);
  const [tempMessage, setTempMessage] = useState("");

  const BASE_URL = "http://localhost:8080";

  useEffect(() => {
    let body = document.getElementById("body");
    let menuBtn = document.getElementById("menu-icon");
    menuBtn.addEventListener("click", () => {
      body.classList.toggle("openMenu");
    });

    axios.get(`${BASE_URL}/api/v1/feedback`).then((res) => {
      const formMessages = res.data;
      setFormMessages(formMessages);
    });
  });

  const postDummyMessage = () => {
    try {
      axios({
        method: "post",
        url: `${BASE_URL}/api/v1/feedback/get-form-items/${formId}`,
      });
    } catch (error) {}

    let dummyFormMessages = [
      {
        userName: "Sari Sulaiman",
        messagesHistory: [
          {
            userID: 1,
            message:
              "Permisi, saya sudah dapat akses ke kuesioner ini. Mohon bantuannya.",
            timestamp: "3.45 PM",
          },
          {
            userID: 2,
            message:
              "Iya selamat siang, Ibu Sari. Baik, akan kami bantu dengan segenap hati.",
            timestamp: "3.46 PM",
          },
          {
            userID: 1,
            message: "Baiklah kalau begitu.",
            timestamp: "3.46 PM",
          },
          {
            userID: 1,
            message: "Akan saya kabari jika sudah isi ya :)",
            timestamp: "3.47 PM",
          },
          {
            userID: 1,
            message: "Apakah form ini akan ditutup pada tanggal 10 Oktober?",
            timestamp: "3.47 PM",
          },
        ],
        lastMessage: "Apakah form ini akan ditutup pada tanggal 10 Oktober?",
        timestamp: "6.00 PM",
        read: false,
        tag: "3",
      },
      {
        userName: "Alvina Putri",
        lastMessage:
          "Ingin bertanya untuk pertanyaan nomor 6 apakah konteksnya secara umum atau dalam biro?",
        timestamp: "5.25 PM",
        read: true,
        tag: "Sent",
      },
      {
        userName: "Averina Nugroho",
        lastMessage: "Baik, nanti akan kami input pesan anda. Terima kasih!",
        timestamp: "5.20 PM",
        read: true,
        tag: "Sent",
      },
      {
        userName: "Jeanette Suryadi",
        lastMessage: "Sent an attachment",
        timestamp: "5.10 PM",
        read: false,
        tag: "2",
      },
      {
        userName: "William Putra",
        lastMessage:
          "Baik, akan saya isi formnya nanti malam ya. Terima kasih.",
        timestamp: "4.30 PM",
        read: false,
        tag: "1",
      },
      {
        userName: "Celine Jadja",
        lastMessage: "Maksudnya biro diisi dengan divisinya?",
        timestamp: "4.20 PM",
        read: false,
        tag: "1",
      },
      {
        userName: "Elvin Tanjaya",
        lastMessage:
          "Informasi biodata dapat disampaikan secara singkat saja Pak.",
        timestamp: "4.20 PM",
        read: true,
        tag: "Sent",
      },
      {
        userName: "Albertus Hadi Saputra",
        lastMessage: "Siap Pak.",
        timestamp: "3.15 PM",
        read: true,
        tag: "Sent",
      },
    ];
  };

  const handleMessageInput = (e) => {
    setTempMessage(e.target.value);
  };

  const handleClickSend = () => {
    props.handleSendNewMessage(tempMessage);

    setTempMessage("");
    updateTextarea();
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") handleClickSend();
  };

  const updateTextarea = () => {
    let textarea = document.getElementById("message-input");
    if (textarea) {
      textarea.value = "";
    }
  };

  return (
    <React.Fragment>
      <div className="title-container">
        <div className="menu-icon" id="menu-icon">
          <img id="menu-icon-img" src={iconMenubarGrey} alt="" />
        </div>
        <div className="page-title" id="page-title-home">
          Chat
        </div>
      </div>
      <div id="page-content">
        <div id="message-container">
          <div id="message-header">
            <Link to="/item1/feedback">
              <img id="backspace-icon-img" src={backspaceIcon} alt="" />
            </Link>
            <div id="message-profile">
              {/* <div id="message-user-name"></div> */}
              {/* <div id="message-status"></div> */}
              <img
                className="profile-image"
                id="message-profile-image"
                src={profilePicture}
                alt=""
              />
              {props.messages.userName}
            </div>
          </div>
          <div className="message-line"></div>
          <div id="message-content-wrapper">
            {props.messages.messagesHistory.map((m) => {
              return (
                <React.Fragment>
                  <div className="message-content">
                    <div
                      className="message-content-2"
                      id={m.userID == 1 ? "message-user-1" : "message-user-2"}
                    >
                      <div className="message-single-bubble">
                        <div id="message-single-content">{m.message}</div>
                      </div>
                      <div id="message-single-timestamp">{m.timestamp}</div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
          <div className="message-line"></div>
          <div id="message-input-box">
            <input
              id="message-input"
              placeholder="Send a message..."
              onChange={(e) => {
                handleMessageInput(e);
              }}
              onKeyUp={(e) => {
                handleEnter(e);
              }}
            ></input>
            <div id="message-send" onClick={handleClickSend}>
              <ion-icon name="send-outline" id="send-icon"></ion-icon>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Message;
