import type React from "react"
import axios from "axios"

import { useState, useEffect, useRef } from "react"
import { MessageSquare, Send, X, Loader2 } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface Message {
    id: string
    content: string
    role: "user" | "assistant"
    timestamp: Date
}

interface ChatbotProps {
    apiKey?: string
}

const Chatbot: React.FC<ChatbotProps> = ({ apiKey }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            content: "Hello! How can I help you today?",
            role: "assistant",
            timestamp: new Date(),
        },
    ])
    const [inputValue, setInputValue] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Scroll to bottom of messages when new message is added
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages])

    // Focus input when chat is opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isOpen])

    const toggleChat = () => {
        setIsOpen(!isOpen)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const handleSendMessage = async () => {
        if (inputValue.trim() === "" || isLoading) return

        const userMessage: Message = {
            id: Date.now().toString(),
            content: inputValue,
            role: "user",
            timestamp: new Date(),
        }

        // Add user message to chat
        setMessages((prev) => [...prev, userMessage])
        setInputValue("")
        setIsLoading(true)

        try {
            // Call backend API route using axios
            console.log(inputValue, "inputValue")
            const response = await axios.post(
                "http://localhost:8082/api/v1/auth/chatbot",
                {
                    message: inputValue,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            )

            console.log(response, "response")

            // Add bot response to chat
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                content:
                    response.data.data ||
                    "I couldn't process your request. Please try again.",
                role: "assistant",
                timestamp: new Date(),
            }

            setMessages((prev) => [...prev, botMessage])
        } catch (error) {
            console.error("Error calling chat API:", error)
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                content:
                    "Sorry, there was an error processing your request. Please try again later.",
                role: "assistant",
                timestamp: new Date(),
            }
            setMessages((prev) => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-80 rounded-lg bg-white shadow-xl sm:w-96">
                    {/* Chat Header */}
                    <div className="flex items-center justify-between rounded-t-lg bg-blue-600 px-4 py-3">
                        <div className="flex items-center">
                            <MessageSquare className="mr-2 h-5 w-5 text-white" />
                            <h3 className="text-lg font-medium text-white">
                                Chat Assistant
                            </h3>
                        </div>
                        <button
                            onClick={toggleChat}
                            className="rounded-full p-1 text-white hover:bg-blue-700 focus:outline-none"
                            aria-label="Close chat"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div className="h-80 overflow-y-auto p-4">
                        <div className="flex flex-col space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                            message.role === "user"
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-100 text-gray-800"
                                        }`}
                                    >
                                        {message.role === "assistant" ? (
                                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                                <ReactMarkdown>
                                                    {message.content}
                                                </ReactMarkdown>
                                            </div>
                                        ) : (
                                            <p className="text-sm">
                                                {message.content}
                                            </p>
                                        )}
                                        <span
                                            className={`mt-1 block text-right text-xs ${
                                                message.role === "user"
                                                    ? "text-blue-100"
                                                    : "text-gray-500"
                                            }`}
                                        >
                                            {formatTime(message.timestamp)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="max-w-[80%] rounded-lg bg-gray-100 px-4 py-2 text-gray-800">
                                        <div className="flex items-center space-x-2">
                                            <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                                            <p className="text-sm text-gray-500">
                                                Thinking...
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Chat Input */}
                    <div className="border-t border-gray-200 p-3">
                        <div className="flex items-center rounded-full border border-gray-300 bg-gray-50 px-3 py-2">
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Type your message..."
                                style={{ color: "black" }}
                                className="flex-grow bg-transparent text-sm focus:outline-none"
                                value={inputValue}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={inputValue.trim() === "" || isLoading}
                                className={`ml-2 rounded-full p-1 ${
                                    inputValue.trim() === "" || isLoading
                                        ? "text-gray-400"
                                        : "text-blue-600 hover:bg-blue-100"
                                }`}
                                aria-label="Send message"
                            >
                                <Send className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Chat Button */}
            <button
                onClick={toggleChat}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 focus:outline-none"
                aria-label={isOpen ? "Close chat" : "Open chat"}
            >
                {isOpen ? (
                    <X className="h-6 w-6" />
                ) : (
                    <MessageSquare className="h-6 w-6" />
                )}
            </button>
        </div>
    )
}

export default Chatbot
