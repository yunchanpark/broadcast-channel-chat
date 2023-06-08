import React, { useState, useEffect, useRef } from "react";
import chatStore from "./stores/chat";
import channelStore from "./stores/channel";
import { BroadcastChannel } from "broadcast-channel";

function App() {
    const { channel, tabId, initChannel } = channelStore();
    const { messages, setMessages } = chatStore();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        if (channel === null) {
            initChannel(new BroadcastChannel("chat_channel"));
        }

        return () => {
            if (channel?.close) {
                channel.close();
            }
        };
    }, [channel, initChannel]);

    useEffect(() => {
        const element = scrollRef.current;
        if (element) {
            element.scrollTop = element.scrollHeight;
        }
    }, []);

    useEffect(() => {
        const element = scrollRef.current;
        if (element) {
            element.scrollTo({
                top: element.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages]);

    // 채널 초기화
    useEffect(() => {
        if (channel === null) {
            return;
        }

        channel.onmessage = (jsonMessage) => {
            const message = JSON.parse(jsonMessage);
            if (message.sender !== tabId) {
                setMessages(message);
            }
        };
        console.log(tabId);
    }, [setMessages, tabId, channel]);

    // 메시지 보내기
    const sendMessage = () => {
        if (channel === null || newMessage === "") {
            return;
        }

        const message = { sender: tabId, text: newMessage };
        channel.postMessage(JSON.stringify(message));
        setMessages(message); // 메시지를 배열에 추가
        setNewMessage("");
    };

    return (
        <div style={{ height: "100vh" }}>
            <div
                style={{
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#9bbbd4",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        borderBottom: "1px solid white",
                    }}
                >
                    <div></div>
                    <h2>Chat</h2>
                    <div></div>
                </div>
                <div
                    ref={scrollRef}
                    style={{
                        flex: 1,
                        padding: "0 30px 10px 30px",
                        overflowY: "scroll",
                    }}
                >
                    {messages.map(({ sender, text }, index) => (
                        <div
                            key={index}
                            style={{
                                marginTop: "10px",
                                height: "auto",
                                textAlign: sender === tabId ? "right" : "left",
                            }}
                        >
                            <span
                                style={{
                                    maxWidth: "100%",
                                    display: "inline-block",
                                    padding: "10px",
                                    backgroundColor:
                                        sender === tabId ? "yellow" : "white",
                                    borderRadius: "5px",
                                    whiteSpace: "pre-wrap",
                                    wordWrap: "break-word",
                                }}
                            >
                                {text}
                            </span>
                        </div>
                    ))}
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        padding: "5px 20px 5px 20px",
                        backgroundColor: "white",
                    }}
                >
                    <input
                        value={newMessage}
                        style={{
                            flex: 1,
                            height: "30px",
                            border: "none",
                            borderRadius: 15,
                            padding: "3px 6px",
                            backgroundColor: "lightgray",
                            outline: "none",
                            marginRight: 5,
                        }}
                        onKeyUp={(e) => {
                            if (e.key === "Enter") {
                                sendMessage();
                            }
                        }}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button
                        onClick={sendMessage}
                        style={{
                            fontSize: 16,
                            fontWeight: 600,
                            borderRadius: 5,
                            backgroundColor: "yellow",
                            border: "1px solid yellow",
                        }}
                    >
                        전송
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;
