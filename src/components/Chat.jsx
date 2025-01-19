import React, { useState } from 'react';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const maxChars = 10000;

  const handleSend = async () => {
    if (input.trim()) {
      const timestamp = new Date().toLocaleTimeString();
      setMessages([...messages, { text: input, sender: 'user', timestamp }]);
      setInput('');
      setCharCount(0);
      setLoading(true);

      try {
        const response = await fetch('http://localhost:3001/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: input }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        
        const aiTimestamp = new Date().toLocaleTimeString();
        setMessages((prev) => [
          ...prev,
          { text: data.response, sender: 'ai', timestamp: aiTimestamp },
        ]);
      } catch (error) {
        console.error('Error:', error);
        const aiTimestamp = new Date().toLocaleTimeString();
        setMessages((prev) => [
          ...prev,
          {
            text: error instanceof Error ? error.message : 'Sorry, an error occurred. Please try again.',
            sender: 'ai',
            timestamp: aiTimestamp
          },
        ]);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-500 py-20">
     <div className="chat-container w-full max-w-[50%] flex flex-col items-center bg-gray-300 p-4 rounded-lg shadow-lg">
     <div className="h-screen overflow-y-auto mb-4 w-full ml-16">
          {messages.map((msg, index) => (
                <div
                key={index}
                className={`message ${msg.sender === 'user' ? 'user-message' : 'ai-message'} p-2 mb-2 rounded ${
                  msg.sender === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-800'
                }`}
              >
              {msg.sender === 'ai' ? (
                <div className="ai-message-container">
                  <div>{msg.text}</div>
                  <div className="timestamp text-xs text-gray-500">{msg.timestamp}</div>
                </div>
              ) : (
                <>
                  <div>{msg.text}</div>
                  <div className="timestamp text-xs text-gray-500">{msg.timestamp}</div>
                </>
              )}
            </div>
          ))}
          {loading && <div className="loading-indicator text-gray-500">Loading...</div>}
        </div>
        <div className="input-area w-full flex items-center space-x-2">
          <input
            type="text"
            className="h-14 rounded border border-gray-300 w-full"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setCharCount(e.target.value.length);
            }}
            placeholder="Type your message..."
            maxLength={maxChars}
          />
          <button
            className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
        <div className="text-gray-400 text-sm mt-2">
          {charCount}/{maxChars} characters
        </div>
      </div>
    </div>
  );
};

export default Chat;