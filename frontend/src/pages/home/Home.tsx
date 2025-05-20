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
} from "lucide-react"
import { motion } from "framer-motion"
import axios from "axios"
import NewsFeed from "../neewsfeed/NewsFeed"

const Home = () => {
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

    useEffect(() => {
        const getJobData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8082/api/v1/job/get`,
                )
                setJobs(response.data.jobs)
                console.log(response.data.jobs, "jobs")
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
                            Check Products
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

            {/* Team/Jobs Section */}
            <section className="mx-auto max-w-7xl px-4 py-16">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 text-center"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mb-2 inline-flex items-center justify-center rounded-full bg-rose-100 px-3 py-1 text-sm font-medium text-rose-600"
                    >
                        <Briefcase className="mr-1 h-4 w-4" />
                        Our Team
                    </motion.div>
                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-3xl font-bold text-gray-900 md:text-4xl"
                    >
                        Meet Our Experts
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
                    {jobs.map((job: any, index) => (
                        <motion.div
                            key={job?._id}
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
                                        {job.name}
                                    </h3>
                                    <span className="ml-2 rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-600">
                                        {job.type}
                                    </span>
                                </div>
                                <p className="mb-4 text-gray-600">
                                    {job.description}
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
                                        <Mail className="mr-2 h-4 w-4 text-rose-500" />
                                        <span>{job.email}</span>
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
                                        <Phone className="mr-2 h-4 w-4 text-rose-500" />
                                        <span>{job.phone}</span>
                                    </motion.div>
                                    <motion.a
                                        href={job.linkedin}
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
                                        <Linkedin className="mr-2 h-4 w-4" />
                                        <span>LinkedIn Profile</span>
                                    </motion.a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* FAQ Section */}
            <section className="mx-auto max-w-7xl px-4 py-16">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 text-center"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mb-2 inline-flex items-center justify-center rounded-full bg-rose-100 px-3 py-1 text-sm font-medium text-rose-600"
                    >
                        <HelpCircle className="mr-1 h-4 w-4" />
                        Support
                    </motion.div>
                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-3xl font-bold text-gray-900 md:text-4xl"
                    >
                        Frequently Asked Questions
                    </motion.h2>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mx-auto mt-4 max-w-2xl text-lg text-gray-600"
                    >
                        Find answers to common questions about our services
                    </motion.p>
                </motion.div>

                <div className="mx-auto max-w-3xl">
                    {faqs.map((faq: any, index) => (
                        <motion.div
                            key={faq?._id}
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="mb-4"
                        >
                            <motion.button
                                onClick={() => toggleFaq(index)}
                                className={`flex w-full items-center justify-between rounded-lg p-5 text-left font-medium transition-all duration-300 ${
                                    expandedFaq === index
                                        ? "bg-rose-600 text-white"
                                        : "bg-white text-gray-900 hover:bg-rose-50"
                                }`}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                <span>{faq.question}</span>
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
                                initial={{ height: 0, opacity: 0 }}
                                animate={{
                                    height: expandedFaq === index ? "auto" : 0,
                                    opacity: expandedFaq === index ? 1 : 0,
                                }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="rounded-b-lg border-x border-b border-gray-200 bg-white p-5 text-gray-700">
                                    {faq.answer}
                                </div>
                            </motion.div>
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

            {/* Footer */}
            <footer className="bg-gray-900 px-4 py-12 text-white">
                <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-4">
                    <div>
                        <h3 className="mb-4 text-xl font-bold">DropShip</h3>
                        <p className="mb-4 text-gray-400">
                            Your one-stop shop for amazing products at
                            unbeatable prices.
                        </p>
                        <div className="flex space-x-4">
                            {/* Social Media Icons */}
                            {[
                                "facebook",
                                "twitter",
                                "instagram",
                                "youtube",
                            ].map((social) => (
                                <a
                                    key={social}
                                    href="#"
                                    className="text-gray-400 transition-colors duration-300 hover:text-white"
                                >
                                    <span className="sr-only">{social}</span>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800">
                                        <svg
                                            className="h-4 w-4"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10z" />
                                        </svg>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-4 text-lg font-semibold">Shop</h3>
                        <ul className="space-y-2">
                            {[
                                "All Products",
                                "New Arrivals",
                                "Best Sellers",
                                "Deals",
                                "Categories",
                            ].map((item) => (
                                <li key={item}>
                                    <a
                                        href="#"
                                        className="text-gray-400 transition-colors duration-300 hover:text-white"
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-lg font-semibold">
                            Customer Service
                        </h3>
                        <ul className="space-y-2">
                            {[
                                "Contact Us",
                                "FAQs",
                                "Shipping & Returns",
                                "Track Order",
                                "Privacy Policy",
                            ].map((item) => (
                                <li key={item}>
                                    <a
                                        href="#"
                                        className="text-gray-400 transition-colors duration-300 hover:text-white"
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-lg font-semibold">Contact</h3>
                        <address className="not-italic text-gray-400">
                            <p>123 Commerce St.</p>
                            <p>Anytown, AN 12345</p>
                            <p className="mt-2">support@shopdrop.com</p>
                            <p>(123) 456-7890</p>
                        </address>
                    </div>
                </div>

                <div className="mx-auto mt-8 max-w-7xl border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
                    <p>
                        &copy; {new Date().getFullYear()} ShopDrop. All rights
                        reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default Home
