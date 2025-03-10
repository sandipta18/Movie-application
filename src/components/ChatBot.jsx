import React, { useState, useRef, useEffect } from 'react';
import { FaComments } from 'react-icons/fa';

const ChatBot = ({ movies, onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! I can help recommend movies. Tell me what genre you like or search by title.' },
  ]);
  const messagesEndRef = useRef(null);


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
    "science fiction": 878,
    "tv movie": 10770,
    thriller: 53,
    war: 10752,
    western: 37,
  };


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userText = input.trim();
    setMessages(prev => [...prev, { from: 'user', text: userText }]);
    setInput('');
    
    setTimeout(() => {
      const lowerInput = userText.toLowerCase();
      const genreId = genreMap[lowerInput];

      if (genreId) {
        const recommendations = movies.filter(movie =>
          movie.genre_ids.includes(genreId)
        );
        if (recommendations.length > 0) {
          const titles = recommendations.slice(0, 3).map(movie => movie.title);
          const botResponse = (Math.random() > 0.5 
            ? 'How about: ' 
            : 'I recommend: ') + titles.join(', ');
          setMessages(prev => [...prev, { from: 'bot', text: botResponse }]);
        } else {
          setMessages(prev => [...prev, { from: 'bot', text: "Sorry, I couldn't find any movies for that genre." }]);
        }
      } else {
        const API_ENDPOINT = 'https://api.themoviedb.org/3';
        const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
        const API_OPTIONS = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_KEY}`
          }
        };

        fetch(`${API_ENDPOINT}/search/movie?query=${encodeURIComponent(userText)}`, API_OPTIONS)
          .then(response => response.json())
          .then(data => {
            if (data.results && data.results.length > 0) {
              const movie = data.results[0];
              // Return the full overview without truncation.
              const botResponse = `I found "${movie.title}": ${movie.overview}`;
              setMessages(prev => [...prev, { from: 'bot', text: botResponse }]);
            } else {
              setMessages(prev => [...prev, { from: 'bot', text: "Sorry, I couldn't find any movies matching that title." }]);
            }
          })
          .catch(err => {
            setMessages(prev => [...prev, { from: 'bot', text: "An error occurred while searching for movies." }]);
          });
      }
    }, 1000);
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
        <div ref={messagesEndRef} />
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
