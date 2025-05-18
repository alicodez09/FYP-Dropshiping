"use client"

import Chatbot from "./chatbot"

// This wrapper component is used to safely handle the API key
// In a production environment, you should handle API keys on the server side
const ChatbotWrapper = () => {
    // The API key should ideally be stored in environment variables
    // and accessed through a secure backend endpoint
    const apiKey = "AIzaSyBS9wth5aGE53Rr9FlN9qx-HyTYkOJHkDM"

    return <Chatbot apiKey={apiKey} />
}

export default ChatbotWrapper
