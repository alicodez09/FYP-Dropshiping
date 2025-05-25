import type React from "react"
import {
    TruckIcon,
    PackageIcon,
    CreditCardIcon,
    ShoppingCartIcon,
    UsersIcon,
} from "lucide-react"

const About: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
                <div className="container mx-auto px-4 py-20 md:py-32">
                    <h1 className="mb-6 text-center text-4xl font-bold md:text-5xl">
                        About Our Dropshipping Service
                    </h1>
                    <p className="mx-auto max-w-3xl text-center text-xl opacity-90 md:text-2xl">
                        Empowering entrepreneurs to build successful online
                        businesses without inventory hassles
                    </p>
                </div>
            </div>

            {/* What is Dropshipping */}
            <div className="container mx-auto px-4 py-16 md:py-24">
                <div className="mx-auto max-w-4xl">
                    <h2 className="mb-8 text-center text-3xl font-bold text-gray-800 md:text-4xl">
                        What is Dropshipping?
                    </h2>
                    <div className="mb-12 rounded-xl bg-gray-50 p-8 shadow-sm">
                        <p className="mb-6 text-lg text-gray-700">
                            Dropshipping is a retail fulfillment method where a
                            store doesn't keep the products it sells in stock.
                            Instead, when a store sells a product using the
                            dropshipping model, it purchases the item from a
                            third party and has it shipped directly to the
                            customer.
                        </p>
                        <p className="text-lg text-gray-700">
                            This means the seller doesn't have to handle the
                            product directly or manage inventory. The biggest
                            difference between dropshipping and the standard
                            retail model is that the selling merchant doesn't
                            stock or own inventory—they act as the middleman.
                        </p>
                    </div>
                </div>
            </div>

            {/* How Dropshipping Works */}
            <div className="bg-gray-50 py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <h2 className="mb-12 text-center text-3xl font-bold text-gray-800 md:text-4xl">
                        How Dropshipping Works
                    </h2>

                    <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
                        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                                <ShoppingCartIcon className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="mb-4 text-xl font-semibold text-gray-800">
                                1. Customer Orders
                            </h3>
                            <p className="text-gray-600">
                                A customer places an order through your online
                                store and pays you the retail price.
                            </p>
                        </div>

                        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                                <CreditCardIcon className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="mb-4 text-xl font-semibold text-gray-800">
                                2. Order Forwarding
                            </h3>
                            <p className="text-gray-600">
                                You forward the order details to your supplier
                                and pay the wholesale price.
                            </p>
                        </div>

                        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                                <TruckIcon className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="mb-4 text-xl font-semibold text-gray-800">
                                3. Supplier Ships
                            </h3>
                            <p className="text-gray-600">
                                The supplier packages and ships the product
                                directly to your customer under your brand.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Benefits of Dropshipping */}
            <div className="container mx-auto px-4 py-16 md:py-24">
                <h2 className="mb-12 text-center text-3xl font-bold text-gray-800 md:text-4xl">
                    Benefits of Dropshipping
                </h2>

                <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
                    <div className="flex gap-4">
                        <div className="flex-shrink-0">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                                <PackageIcon className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                        <div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-800">
                                No Inventory Management
                            </h3>
                            <p className="text-gray-600">
                                You don't need to stock products, manage
                                warehouse space, or track inventory levels.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-shrink-0">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                                <CreditCardIcon className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                        <div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-800">
                                Low Startup Costs
                            </h3>
                            <p className="text-gray-600">
                                Start an online business with minimal upfront
                                investment and overhead costs.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-shrink-0">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                                <UsersIcon className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                        <div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-800">
                                Location Independence
                            </h3>
                            <p className="text-gray-600">
                                Run your business from anywhere with an internet
                                connection, giving you freedom and flexibility.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-shrink-0">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                                <ShoppingCartIcon className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                        <div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-800">
                                Wide Product Selection
                            </h3>
                            <p className="text-gray-600">
                                Offer a broad range of products to your
                                customers without purchasing inventory upfront.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Why Choose Us */}
            <div className="bg-gray-50 py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-4xl">
                        <h2 className="mb-8 text-center text-3xl font-bold text-gray-800 md:text-4xl">
                            Why Choose Our Platform
                        </h2>
                        <div className="rounded-xl bg-white p-8 shadow-sm">
                            <p className="mb-6 text-lg text-gray-700">
                                Our dropshipping platform provides everything
                                you need to launch and grow a successful online
                                business:
                            </p>
                            <ul className="space-y-4 text-gray-700">
                                <li className="flex items-start">
                                    <span className="mr-3 mt-1 rounded-full bg-green-100 p-1 text-green-800">
                                        ✓
                                    </span>
                                    <span>
                                        Curated selection of high-quality,
                                        trending products from reliable
                                        suppliers
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3 mt-1 rounded-full bg-green-100 p-1 text-green-800">
                                        ✓
                                    </span>
                                    <span>
                                        Seamless integration with major
                                        e-commerce platforms like Shopify,
                                        WooCommerce, and more
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3 mt-1 rounded-full bg-green-100 p-1 text-green-800">
                                        ✓
                                    </span>
                                    <span>
                                        Automated order processing and
                                        fulfillment tracking
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3 mt-1 rounded-full bg-green-100 p-1 text-green-800">
                                        ✓
                                    </span>
                                    <span>
                                        Dedicated support team to help you every
                                        step of the way
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3 mt-1 rounded-full bg-green-100 p-1 text-green-800">
                                        ✓
                                    </span>
                                    <span>
                                        Comprehensive resources, tutorials, and
                                        marketing tools to grow your business
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="container mx-auto px-4 py-16 md:py-24">
                <h2 className="mb-12 text-center text-3xl font-bold text-gray-800 md:text-4xl">
                    Frequently Asked Questions
                </h2>

                <div className="mx-auto max-w-4xl space-y-6">
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <h3 className="mb-3 text-xl font-semibold text-gray-800">
                            Is dropshipping profitable in 2023?
                        </h3>
                        <p className="text-gray-700">
                            Yes, dropshipping remains profitable in 2023 when
                            done correctly. Success depends on choosing the
                            right niche, building a professional store, and
                            implementing effective marketing strategies. While
                            competition has increased, so has the overall
                            e-commerce market size.
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <h3 className="mb-3 text-xl font-semibold text-gray-800">
                            How much money do I need to start dropshipping?
                        </h3>
                        <p className="text-gray-700">
                            You can start dropshipping with as little as
                            $100-$500. This covers basic expenses like a domain
                            name, e-commerce platform subscription, and initial
                            marketing costs. As your business grows, you can
                            reinvest profits to scale your operations.
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <h3 className="mb-3 text-xl font-semibold text-gray-800">
                            Do I need a business license to dropship?
                        </h3>
                        <p className="text-gray-700">
                            Business license requirements vary by location. In
                            most places, you'll need a business license, sales
                            tax permit, and possibly an employer identification
                            number (EIN). We recommend consulting with a local
                            business attorney or accountant to ensure compliance
                            with all regulations.
                        </p>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 py-16 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                        Ready to Start Your Dropshipping Journey?
                    </h2>
                    <p className="mx-auto mb-8 max-w-3xl text-xl opacity-90">
                        Join thousands of successful entrepreneurs who have
                        built profitable online businesses with our platform.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default About
