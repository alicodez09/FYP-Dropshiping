"use client"

import { useState, useEffect } from "react"
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react"
import { motion } from "framer-motion"
import axios from "axios"
import ChatbotWrapper from "@/components/chatbot-wrapper"
import Footer from "@/components/footer"

const Faq = () => {
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
    const [faqs, setFaqs] = useState<any[]>([])

    useEffect(() => {
        const getFaqData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8082/api/v1/faq/get-faq`,
                )
                setFaqs(response.data.faqs)
                console.log(response.data.faqs, "faqs")
            } catch (error) {
                console.error("Error fetching FAQs:", error)
            }
        }

        getFaqData()
    }, [])

    const toggleFaq = (index: number) => {
        setExpandedFaq(expandedFaq === index ? null : index)
    }

    return (
        <>
            <div className="min-h-screen bg-white">
                {/* FAQ Header */}
                <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 lg:px-8">
                    <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mb-4 inline-flex items-center justify-center rounded-full bg-rose-100 px-3 py-1 text-sm font-medium text-rose-600"
                    >
                        <HelpCircle className="mr-1 h-4 w-4" />
                        Support
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl"
                    >
                        Frequently Asked Questions
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mx-auto max-w-2xl text-lg text-gray-600"
                    >
                        Find answers to common questions about our products and
                        services. If you can't find what you're looking for,
                        please contact our support team.
                    </motion.p>
                </div>

                {/* FAQ Items */}
                <div className="mx-auto max-w-3xl space-y-6 px-4 pb-16 sm:px-6 lg:px-8">
                    {faqs.length > 0 ? (
                        faqs.map((faq, index) => (
                            <motion.div
                                key={faq._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.1,
                                }}
                                className="overflow-hidden rounded-lg border border-gray-200 shadow-sm"
                            >
                                <motion.button
                                    onClick={() => toggleFaq(index)}
                                    className={`flex w-full items-center justify-between p-6 text-left font-medium transition-all duration-200 ${
                                        expandedFaq === index
                                            ? "bg-rose-600 text-white"
                                            : "bg-white text-gray-900 hover:bg-rose-50"
                                    }`}
                                    whileHover={{ scale: 1.005 }}
                                    whileTap={{ scale: 0.995 }}
                                >
                                    <span className="text-lg">
                                        {faq.question}
                                    </span>
                                    {expandedFaq === index ? (
                                        <ChevronUp
                                            className={`h-5 w-5 ${expandedFaq === index ? "text-white" : "text-rose-500"}`}
                                        />
                                    ) : (
                                        <ChevronDown
                                            className={`h-5 w-5 ${expandedFaq === index ? "text-white" : "text-rose-500"}`}
                                        />
                                    )}
                                </motion.button>

                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{
                                        height:
                                            expandedFaq === index ? "auto" : 0,
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="bg-white p-6 leading-relaxed text-gray-700">
                                        {faq.answer}
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="py-10 text-center">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="text-gray-500"
                            >
                                Loading FAQs...
                            </motion.div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <Footer />
            </div>
            <ChatbotWrapper />
        </>
    )
}

export default Faq
