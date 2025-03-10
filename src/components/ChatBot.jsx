import React, { useState } from 'react';
import { FaComments } from 'react-icons/fa';

const ChatBot = ({ movies, onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! I can help recommend movies. Tell me what genre you like!' },
  ]);


  const genreMap = {
    action: 28,
    adventure: 12,
    animation: 16,
    comedy: 35,
    crime: 80,
    documentary: 99,
    drama: 18,
    family: 10751,
    fantasy: 14,
    history: 36,
    horror: 27,
    music: 10402,
    mystery: 9648,
    romance: 10749,
    'science fiction': 878,
    'tv movie': 10770,
    thriller: 53,
    war: 10752,
    western: 37,
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = { from: 'user', text: input };
    const updatedMessages = [...messages, userMessage];


    const genreId = genreMap[input.toLowerCase()];
    let recommendations = [];

    if (genreId) {
      recommendations = movies.filter(movie =>
        movie.genre_ids.includes(genreId)
      );
    }


    if (recommendations.length === 0) {
      recommendations = movies.filter(movie =>
        movie.title.toLowerCase().includes(input.toLowerCase())
      );
    }

    let botResponse = '';
    if (recommendations.length > 0) {
      const titles = recommendations.slice(0, 3).map(movie => movie.title);
      botResponse = 'I recommend: ' + titles.join(', ');
    } else {
      botResponse = "Sorry, I couldn't find any movies matching that.";
    }

    updatedMessages.push({ from: 'bot', text: botResponse });
    setMessages(updatedMessages);
    setInput('');
  };

  return (
    <div className="chatbot fixed bottom-5 right-5 bg-gray-900 text-white p-4 rounded shadow-lg w-80">
      <div className="chatbot-header flex justify-between items-center mb-2">
        <div className="flex items-center">
          <FaComments className="mr-2 text-xl" />
          <h3 className="text-lg font-semibold">Movie Chatbot</h3>
        </div>
        <button onClick={onClose} className="text-white text-2xl">&times;</button>
      </div>
      <div className="chatbot-messages h-40 overflow-y-auto mb-2 space-y-2">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.from}`}>
            <p className="text-sm">{msg.text}</p>
          </div>
        ))}
      </div>
      <div className="chatbot-input flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSend() }}
          className="flex-grow p-2 rounded-l bg-gray-800 text-white outline-none"
          placeholder="Type your query..."
        />
        <button
          onClick={handleSend}
          className="bg-yellow-500 text-black p-2 rounded-r hover:bg-yellow-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
