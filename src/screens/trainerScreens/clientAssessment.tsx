import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, } from 'react-router-dom';
import { X } from 'lucide-react';

// to be replace with real data from appointment/assessment
const initialMessages = [
  {
    id: 1,
    sender: 'user',
    text: 'Hey, tell me how to burn my body stomach fat',
    time: '2:20pm',
  },
  {
    id: 2,
    sender: 'trainer',
    text: 'Hey, daily wakeup early in the morning and go for running—',
    time: '2:40pm',
  },
  {
    id: 3,
    sender: 'user',
    text: 'OKay👍🏻',
    time: '2:20pm',
  },
  {
    id: 4,
    sender: 'trainer',
    text: 'Hey. Check my exercise videos',
    time: '2:29pm',
    video: '/exercise_nutrition.jpg', // Replace with real video thumbnail
  },
  {
    id: 5,
    sender: 'user',
    text: 'OKay👍🏻',
    time: '2:29pm',
  },
];

const ClientAssessment: React.FC = () => {
  const navigate = useNavigate();

  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleClose = () => {
    navigate(-1); // Go back to previous screen
  };

  const handleSend = () => {
    if (input.trim() === '') return;
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [
      ...prev,
      {
        id: prev.length + 1,
        sender: 'user',
        text: input,
        time,
      },
    ]);
    setInput('');
    if (inputRef.current) inputRef.current.focus();
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col z-50">

      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <button
          onClick={handleClose}
          className="p-2 hover:bg-gray-100 rounded-full"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-900" />
        </button>
        <h2 className="text-lg font-bold ddc-hardware tracking-wide">APPOINTMENT 3</h2>
        <div className="w-8" /> 
      </div>

      <div ref={chatBodyRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-6 bg-white scrollbar-hide">
        {messages.map((msg, idx) => (
          <div key={msg.id} className="flex flex-col items-start">
            {/* Unread marker */}
            {idx === 3 && (
              <div className="w-full flex items-center my-4">
                <div className="flex-1 border-t border-gray-200" />
                <span className="mx-2 text-xs text-gray-400">Unread messages</span>
                <div className="flex-1 border-t border-gray-200" />
              </div>
            )}
            {/* Message bubble */}
            <div
              className={`max-w-[80%] rounded-lg px-4 py-3 mb-1 text-sm shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-white border border-gray-200 self-end ml-auto'
                  : 'bg-yellow-50 border border-yellow-200 self-start'
              }`}
            >
              {msg.text}
              {msg.video && (
                <div className="mt-2">
                  <img
                    src={msg.video}
                    alt="Video thumbnail"
                    className="rounded-lg w-48 h-28 object-cover border border-gray-200"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Play icon overlay if needed */}
                  </div>
                </div>
              )}
            </div>
            <span className="text-xs text-gray-400 mt-1 ml-1">{msg.time}</span>
          </div>
        ))}
      </div>

      {/* Input Bar */}
      <div className="border-t border-gray-200 px-4 py-3 flex items-center bg-white">
        <input
          ref={inputRef}
          type="text"
          placeholder="Type your message..."
          className="flex-1 border-none outline-none bg-transparent text-base placeholder-gray-400"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          autoFocus
        />
        <button
          className={`ml-2 p-2 rounded-full bg-black text-white hover:bg-gray-900 transition-colors ${input.trim() ? '' : 'opacity-50 cursor-not-allowed'}`}
          onClick={handleSend}
          disabled={!input.trim()}
          aria-label="Send message"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ClientAssessment;
