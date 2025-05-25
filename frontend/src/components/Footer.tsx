import React from "react"

const Footer = () => {
    return (
        <>
            {/* Footer */}
            <footer className="mt-36 bg-gray-900 px-4 py-12 text-white">
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
        </>
    )
}

export default Footer
