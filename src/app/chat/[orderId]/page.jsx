"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { IoArrowBack } from "react-icons/io5";
import { FiSend, FiPlus } from "react-icons/fi";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";

export default function ChatScreen() {
  const { orderId } = useParams();
  const router = useRouter();
  const bottomRef = useRef(null);

  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  /* 🔐 AUTH */
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user);
    });
  }, []);

  /* 📥 FETCH MESSAGES */
  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel("chat-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_with_admin" },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
          scrollBottom();
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("chat_with_admin")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: true });

    setMessages(data || []);
    scrollBottom();
  };

  const scrollBottom = () =>
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);

  /* 📤 SEND MESSAGE */
  const sendMessage = async () => {
    if (!text && !image) return;

    let imageUrl = null;

    if (image) {
      const fileName = `${Date.now()}-${image.name}`;
      await supabase.storage.from("chat").upload(fileName, image);
      const { data } = supabase.storage.from("chat").getPublicUrl(fileName);
      imageUrl = data.publicUrl;
    }

    await supabase.from("chat_with_admin").insert({
      order_id: orderId,
      sender_id: user.id,
      sender_role: "user",
      message: text,
    //   image_url: imageUrl,
    });

    setText("");
    setImage(null);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()}>
            <IoArrowBack className="text-xl" />
          </button>
          <h2 className="text-lg font-semibold text-red-500">User Support</h2>
        </div>
        <button className="border px-4 py-1 rounded-full text-red-500">
          Chat with us
        </button>
      </div>

      {/* CHAT BODY */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender_role === "user";
          return (
            <div
              key={msg.id}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs p-3 rounded-xl text-sm ${
                  isUser
                    ? "bg-red-400 text-white rounded-br-none"
                    : "bg-red-300 text-white rounded-bl-none"
                }`}
              >
                {msg.message && <p>{msg.message}</p>}
                {msg.image_url && (
                  <Image
                    src={msg.image_url}
                    alt="chat"
                    width={150}
                    height={150}
                    className="rounded mt-2"
                  />
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="p-3 border-t flex items-center gap-3">
        <label className="cursor-pointer">
          <FiPlus />
          <input
            type="file"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your message"
          className="flex-1 border rounded-full px-4 py-2 text-sm outline-none"
        />

        <button
          onClick={sendMessage}
          className="bg-red-500 p-3 rounded-full text-white"
        >
          <FiSend />
        </button>
      </div>
    </div>
  );
}
