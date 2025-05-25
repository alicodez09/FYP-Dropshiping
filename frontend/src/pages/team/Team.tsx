"use client"

import { useState, useEffect } from "react"
// import Image from "next/image"
import {
    ChevronLeft,
    ChevronRight,
    ShoppingBag,
    Truck,
    Shield,
    Clock,
    Briefcase,
    HelpCircle,
    ChevronDown,
    ChevronUp,
    User,
    Mail,
    Phone,
    Linkedin,
    Globe,
    PhoneCall,
    MailCheck,
} from "lucide-react"
import { motion } from "framer-motion"
import axios from "axios"
import NewsFeed from "../neewsfeed/NewsFeed"
import { FaLinkedin } from "react-icons/fa"
import Footer from "@/components/footer"
import ChatbotWrapper from "@/components/chatbot-wrapper"

const Team = () => {
    // State for the image slider
    const [currentSlide, setCurrentSlide] = useState(0)
    const [jobs, setJobs] = useState([])
    const [faqs, setFaqs] = useState([])
    const [expandedFaq, setExpandedFaq] = useState(null)

    // Slider images
    const sliderImages = [
        "https://pixabay.com/get/gbf4eedfd256a5d0c5ffeda96ca8f8812b056f6a4e6e6ed55cac96bd3c55fd9190732dff631ac9fa257db9e39a6bc551a.jpg",
        "https://pixabay.com/get/gd7a1aa5458e3317f7bc11af29a603f45e654cd1824a412a2d1eb82d4a8a9587787b97606a54409d23533c9ee1cddbda8.jpg",
        "https://pixabay.com/get/g7f0b9623df67150d6eb6caaec1492b90fc44296547b631fb7f199faefc8b8fc3ed8b763452fb49cb8a3739324a8201dd68d414888308b7cd1a38a996a31425f0_1920.jpg",
    ]

    // Auto-advance the slider
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) =>
                prev === sliderImages.length - 1 ? 0 : prev + 1,
            )
        }, 5000)

        return () => clearInterval(interval)
    }, [sliderImages.length])

    // Navigate to the previous slide
    const prevSlide = () => {
        setCurrentSlide((prev) =>
            prev === 0 ? sliderImages.length - 1 : prev - 1,
        )
    }

    // Navigate to the next slide
    const nextSlide = () => {
        setCurrentSlide((prev) =>
            prev === sliderImages.length - 1 ? 0 : prev + 1,
        )
    }
    const [nonSellerUsers, setnonSellerUsers] = useState([])
    useEffect(() => {
        const getJobData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8082/api/v1/auth/get-non-seller`,
                )
                setnonSellerUsers(response.data.data)
                console.log(response.data.data, "non-seller")
            } catch (error) {
                console.error("Error fetching jobs:", error)
            }
        }

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

        getJobData()
        getFaqData()
    }, [])

    const toggleFaq = (index: any) => {
        setExpandedFaq(expandedFaq === index ? null : index)
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            {/* Team/Jobs Section */}
            <section className="mx-auto max-w-7xl px-4 py-16">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 text-center"
                >
                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-3xl font-bold text-gray-900 md:text-4xl"
                    >
                        Meet Experts
                    </motion.h2>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mx-auto mt-4 max-w-2xl text-lg text-gray-600"
                    >
                        Our talented professionals are ready to help you succeed
                    </motion.p>
                </motion.div>

                <div className="grid gap-8 md:grid-cols-2">
                    {nonSellerUsers.map((user: any, index) => (
                        <motion.div
                            key={user._id}
                            initial={{ y: 50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.6,
                                delay: index * 0.2,
                                type: "spring",
                                stiffness: 100,
                            }}
                            whileHover={{
                                y: -5,
                                boxShadow:
                                    "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                            }}
                            className="group overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-300"
                        >
                            <div className="flex flex-col items-start">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600 transition-all duration-300 group-hover:bg-rose-600 group-hover:text-white">
                                    <User className="h-8 w-8" />
                                </div>
                                <div className="mb-2 flex items-center">
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {user.name}
                                    </h3>
                                    <span className="ml-2 rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-600">
                                        {user.user_type}
                                    </span>
                                </div>
                                <p className="mb-4 text-gray-600">
                                    {user.user_type_data?.description ||
                                        "No description provided"}
                                </p>

                                <div className="mt-2 grid w-full gap-2 text-sm text-gray-600">
                                    <motion.div
                                        className="flex items-center"
                                        initial={{ x: -10, opacity: 0 }}
                                        whileInView={{ x: 0, opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            duration: 0.4,
                                            delay: 0.3 + index * 0.1,
                                        }}
                                    >
                                        <MailCheck className="mr-2 h-4 w-4 text-rose-500" />
                                        <span>{user.email}</span>
                                    </motion.div>
                                    <motion.div
                                        className="flex items-center"
                                        initial={{ x: -10, opacity: 0 }}
                                        whileInView={{ x: 0, opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            duration: 0.4,
                                            delay: 0.4 + index * 0.1,
                                        }}
                                    >
                                        <PhoneCall className="mr-2 h-4 w-4 text-rose-500" />
                                        <span>{user.phone}</span>
                                    </motion.div>
                                    {user.user_type_data?.linkedin && (
                                        <motion.a
                                            href={user.user_type_data.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center text-rose-500 hover:text-rose-600"
                                            initial={{ x: -10, opacity: 0 }}
                                            whileInView={{ x: 0, opacity: 1 }}
                                            viewport={{ once: true }}
                                            transition={{
                                                duration: 0.4,
                                                delay: 0.5 + index * 0.1,
                                            }}
                                        >
                                            <FaLinkedin className="mr-2 h-4 w-4" />
                                            <span>LinkedIn Profile</span>
                                        </motion.a>
                                    )}
                                    {user.user_type_data?.portfolio && (
                                        <motion.a
                                            href={user.user_type_data.portfolio}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center text-rose-500 hover:text-rose-600"
                                            initial={{ x: -10, opacity: 0 }}
                                            whileInView={{ x: 0, opacity: 1 }}
                                            viewport={{ once: true }}
                                            transition={{
                                                duration: 0.4,
                                                delay: 0.6 + index * 0.1,
                                            }}
                                        >
                                            <Globe className="mr-2 h-4 w-4" />

                                            <span>Portfolio Website</span>
                                        </motion.a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            <Footer />
            <ChatbotWrapper />
        </div>
    )
}

export default Team
