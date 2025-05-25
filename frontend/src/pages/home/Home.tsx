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
import shoppingMall from "./shopping_mall.jpg"
import clothes from "./clothes.jpg"

import online from "./online.jpg"
import { NavLink } from "react-router-dom"
import Footer from "@/components/footer"

const Home = () => {
    // State for the image slider
    const [currentSlide, setCurrentSlide] = useState(0)
    const [jobs, setJobs] = useState([])
    const [faqs, setFaqs] = useState([])
    const [expandedFaq, setExpandedFaq] = useState(null)

    // Slider images
    const sliderImages = [shoppingMall, online, clothes]

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
            {/* Hero Section with Slider */}
            <section className="relative h-[600px] overflow-hidden">
                <div className="relative h-full w-full">
                    {sliderImages.map((image, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ${
                                index === currentSlide
                                    ? "opacity-100"
                                    : "opacity-0"
                            }`}
                        >
                            <img
                                src={image || "/placeholder.svg"}
                                alt={`Slide ${index + 1}`}
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30" />
                        </div>
                    ))}

                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white">
                        <motion.h1
                            className="mb-4 text-4xl font-bold md:text-6xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            Discover Amazing Products
                        </motion.h1>
                        <motion.p
                            className="mb-8 max-w-2xl text-xl md:text-2xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            High-quality items at unbeatable prices, delivered
                            straight to your door.
                        </motion.p>
                        <motion.button
                            className="transform rounded-full bg-rose-600 px-8 py-3 font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-rose-700"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <NavLink to="/products">Check Products</NavLink>
                        </motion.button>
                    </div>

                    {/* Slider Navigation */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white transition-all duration-300 hover:bg-white/40"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white transition-all duration-300 hover:bg-white/40"
                        aria-label="Next slide"
                    >
                        <ChevronRight size={24} />
                    </button>

                    {/* Slider Indicators */}
                    <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 space-x-2">
                        {sliderImages.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`h-3 w-3 rounded-full transition-all duration-300 ${
                                    index === currentSlide
                                        ? "scale-125 bg-white"
                                        : "bg-white/50"
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </section>
            <NewsFeed />

            {/* Features Section */}
            <section className="mx-auto max-w-7xl ">
                <motion.h2
                    className="mb-12 text-center text-3xl font-bold md:text-4xl"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{ color: "#000" }}
                >
                    Why Shop With Us
                </motion.h2>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {[
                        {
                            icon: (
                                <ShoppingBag className="h-10 w-10 text-rose-500" />
                            ),
                            title: "Curated Products",
                            description: "Handpicked for quality and value",
                        },
                        {
                            icon: <Truck className="h-10 w-10 text-rose-500" />,
                            title: "Fast Shipping",
                            description: "Quick delivery to your doorstep",
                        },
                        {
                            icon: (
                                <Shield className="h-10 w-10 text-rose-500" />
                            ),
                            title: "Secure Payments",
                            description: "Safe and protected transactions",
                        },
                        {
                            icon: <Clock className="h-10 w-10 text-rose-500" />,
                            title: "24/7 Support",
                            description: "Always here to help you",
                        },
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            className="rounded-xl bg-white p-6 text-center shadow-lg transition-all duration-300 hover:shadow-xl"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.6,
                                delay: index * 0.1,
                            }}
                            whileHover={{ y: -5 }}
                        >
                            <div className="mb-4 flex justify-center">
                                {feature.icon}
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="px-4 py-16">
                <div className="mx-auto max-w-7xl rounded-2xl bg-rose-600 p-8 text-white md:p-12">
                    <div className="grid items-center gap-8 md:grid-cols-2">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="mb-4 text-3xl font-bold">
                                Stay Updated
                            </h2>
                            <p className="mb-6">
                                Learn about business tips, eCommerce trends, and
                                how dropshipping can help you start a store
                                without inventory.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="rounded-xl bg-white/10 p-6 text-white">
                                <h3 className="mb-2 text-xl font-semibold">
                                    What is Dropshipping?
                                </h3>
                                <p className="text-white/90">
                                    Dropshipping is an online selling method
                                    where you don't keep products in stock. When
                                    someone buys from your store, the product is
                                    sent directly from the supplier to the
                                    customer. It's low-cost, beginner-friendly,
                                    and perfect for testing ideas without large
                                    investments.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    )
}

export default Home
