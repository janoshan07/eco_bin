import React, { useState } from 'react';
import './Chatbox.css';

const Chatbox = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const wasteManagementResponses = {
        'what is smart waste management': 'Smart waste management uses technology to optimize waste collection, recycling, and disposal processes. It includes features like smart bins, route optimization, and data analytics to improve efficiency.',
        'how does smart waste management work': 'Smart waste management works through IoT sensors in bins, GPS tracking of collection vehicles, and data analytics to optimize collection routes and schedules.',
        'what are the benefits of smart waste management': 'Benefits include reduced operational costs, improved collection efficiency, better recycling rates, reduced environmental impact, and real-time monitoring of waste levels.',
        'what is a smart bin': 'A smart bin is a waste container equipped with sensors that can detect fill levels, temperature, and sometimes even sort waste automatically.',
        'how can i reduce waste': 'You can reduce waste by practicing the 3Rs: Reduce (buy less), Reuse (use items multiple times), and Recycle (properly sort recyclables). Also, consider composting organic waste.',
        'what can be recycled': 'Common recyclables include paper, cardboard, glass, metal cans, and certain types of plastics. Check local recycling guidelines for specific items.',
        'what is composting': 'Composting is the natural process of recycling organic matter (like food scraps and yard waste) into a valuable fertilizer that can enrich soil and plants.',
        'how can i start composting': 'Start by collecting food scraps, yard waste, and other organic materials in a compost bin. Layer green materials (food scraps) with brown materials (leaves, paper) and maintain proper moisture and aeration.',
        'what is e-waste': 'E-waste refers to discarded electronic devices and equipment. It should be properly recycled due to hazardous materials and valuable resources it contains.',
        'how to dispose of hazardous waste': 'Hazardous waste (like batteries, chemicals, and electronics) should be taken to designated collection centers or special collection events. Never dispose of them in regular trash.',
        'what is zero waste': 'Zero waste is a philosophy that encourages redesigning resource life cycles so that all products are reused, with no trash sent to landfills or incinerators.',
        'how can businesses implement smart waste management': 'Businesses can implement smart waste management by using smart bins, optimizing collection schedules, training staff, and using data analytics to track waste generation patterns.',
        'waste': 'Are you asking about waste management? I can help you with information about smart waste management, recycling, composting, or waste reduction.',
        'recycle': 'Recycling is the process of converting waste materials into new materials and objects. Common recyclables include paper, cardboard, glass, metal, and certain plastics.',
        'compost': 'Composting is a great way to reduce organic waste! Would you like to know how to start composting or what materials can be composted?',
        'smart': 'Smart waste management uses technology to make waste collection and recycling more efficient. Would you like to know more about how it works or its benefits?',
        'bin': 'Are you asking about smart bins? They are waste containers with sensors that can detect fill levels and help optimize waste collection.',
        'environment': 'Smart waste management helps protect the environment by reducing waste, improving recycling rates, and optimizing collection routes to reduce emissions.',
        'help': 'I can help you with information about smart waste management, recycling, composting, and waste reduction. What would you like to know?',
        'hello': 'Hello! I can help you with information about smart waste management, recycling, composting, and waste reduction. What would you like to know?',
        'hi': 'Hi! I can help you with information about smart waste management, recycling, composting, and waste reduction. What would you like to know?'
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        const userMessage = {
            text: newMessage,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString()
        };

        setMessages(prev => [...prev, userMessage]);
        
        // Generate bot response
        const botResponse = generateBotResponse(newMessage.toLowerCase());
        setTimeout(() => {
            setMessages(prev => [...prev, botResponse]);
        }, 500);

        setNewMessage('');
    };

    const generateBotResponse = (message) => {
        // First try exact matches
        for (const [key, value] of Object.entries(wasteManagementResponses)) {
            if (message === key) {
                return {
                    text: value,
                    sender: 'bot',
                    timestamp: new Date().toLocaleTimeString()
                };
            }
        }

        // Then try partial matches
        for (const [key, value] of Object.entries(wasteManagementResponses)) {
            if (message.includes(key)) {
                return {
                    text: value,
                    sender: 'bot',
                    timestamp: new Date().toLocaleTimeString()
                };
            }
        }

        // If no match found, look for keywords
        const keywords = Object.keys(wasteManagementResponses);
        for (const keyword of keywords) {
            if (message.includes(keyword)) {
                return {
                    text: wasteManagementResponses[keyword],
                    sender: 'bot',
                    timestamp: new Date().toLocaleTimeString()
                };
            }
        }

        // If still no match, provide a helpful response
        return {
            text: "I can help you with information about smart waste management, recycling, composting, and waste reduction. Try asking about any of these topics!",
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString()
        };
    };

    const toggleChatbox = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`chatbox-container ${isOpen ? 'open' : ''}`}>
            <div className="chatbox-header" onClick={toggleChatbox}>
                <h3>Smart Waste Management Support</h3>
                <span className="toggle-icon">{isOpen ? '▼' : '▲'}</span>
            </div>
            {isOpen && (
                <>
                    <div className="chatbox-messages">
                        {messages.map((message, index) => (
                            <div key={index} className={`message ${message.sender}`}>
                                <div className="message-content">
                                    <p>{message.text}</p>
                                    <span className="timestamp">{message.timestamp}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleSubmit} className="chatbox-input">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Ask about smart waste management..."
                        />
                        <button type="submit">Send</button>
                    </form>
                </>
            )}
        </div>
    );
};

export default Chatbox; 