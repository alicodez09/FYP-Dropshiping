import axios from "axios"
import React, { useEffect, useState } from "react"

// Interface definitions
interface User {
    _id: string
    // Add other user properties if needed
}

interface Category {
    _id: string
    name: string
    description: string
    slug: string
    __v: number
}

interface Product {
    _id: string
    name: string
    description: string
    price: string
    category: Category
    image: string[]
    createdAt: string
    updatedAt: string
    __v: number
}

interface CartItem {
    product: string
    quantity: number
    _id: string
}

interface Order {
    _id: string
    user: string
    shippingAddress: string
    phoneNumber: string
    expectedPrice: string
    cartItems: CartItem[]
    status: string
    createdAt: string
    updatedAt: string
    __v: number
}

interface OrderWithProducts extends Order {
    products: Product[]
}

const Order: React.FC = () => {
    const [orders, setOrders] = useState<OrderWithProducts[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const storedAuth = localStorage.getItem("zain_auth")
    const parsedData = storedAuth ? JSON.parse(storedAuth) : null

    useEffect(() => {
        if (!parsedData?.user?._id) {
            setError("User not authenticated")
            setLoading(false)
            return
        }

        const fetchData = async () => {
            try {
                setLoading(true)

                // Fetch orders and products in parallel
                const [ordersResponse, productsResponse] = await Promise.all([
                    axios.get<{ data: Order[] }>(
                        `http://localhost:8082/api/v1/auth/user-orders/${parsedData.user._id}`,
                    ),
                    axios.get<{ products: Product[] }>(
                        `http://localhost:8082/api/v1/product/get-product`,
                    ),
                ])

                // Combine orders with their products
                const ordersWithProducts = ordersResponse.data.data.map(
                    (order) => {
                        const products = order.cartItems
                            .map((item) => {
                                return productsResponse.data.products.find(
                                    (product) => product._id === item.product,
                                ) as Product
                            })
                            .filter(Boolean)

                        return {
                            ...order,
                            products,
                        }
                    },
                )

                setOrders(ordersWithProducts)
            } catch (err) {
                setError("Failed to fetch data")
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [parsedData?.user?._id])

    const formatDate = (dateString: string): string => {
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }
        return new Date(dateString).toLocaleDateString(undefined, options)
    }

    const getStatusColor = (status: string): string => {
        switch (status.toLowerCase()) {
            case "pending":
                return "bg-yellow-100 text-yellow-800"
            case "completed":
                return "bg-green-100 text-green-800"
            case "cancelled":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
                    <p className="mt-4 text-gray-600">Loading your orders...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="mx-auto max-w-md rounded-lg bg-white p-6 text-center shadow-md">
                    <div className="mb-4 text-red-500">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mx-auto h-12 w-12"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h2 className="mb-2 text-xl font-semibold text-gray-800">
                        Error Loading Orders
                    </h2>
                    <p className="mb-4 text-gray-600">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="rounded bg-blue-500 px-4 py-2 text-white transition duration-200 hover:bg-blue-600"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    if (orders.length === 0) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="mx-auto max-w-md p-6 text-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mx-auto h-16 w-16 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                    </svg>
                    <h2 className="mt-4 text-xl font-semibold text-gray-800">
                        No Orders Found
                    </h2>
                    <p className="mt-2 text-gray-600">
                        You haven't placed any orders yet.
                    </p>
                    <button
                        onClick={() => (window.location.href = "/")}
                        className="mt-4 rounded bg-blue-500 px-4 py-2 text-white transition duration-200 hover:bg-blue-600"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">
                        My Orders
                    </h1>
                    <p className="mt-2 text-gray-600">
                        View your order history and status
                    </p>
                </div>

                <div className="space-y-6">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="overflow-hidden rounded-lg bg-white shadow"
                        >
                            <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                                            Order #
                                            {order._id.slice(-6).toUpperCase()}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Placed on{" "}
                                            {formatDate(order.createdAt)}
                                        </p>
                                    </div>
                                    <div className="mt-2 sm:mt-0">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(order.status)}`}
                                        >
                                            {order.status
                                                .charAt(0)
                                                .toUpperCase() +
                                                order.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="px-4 py-5 sm:p-6">
                                <h4 className="text-md mb-4 font-medium text-gray-900">
                                    Order Details
                                </h4>

                                <div className="mb-6">
                                    <h5 className="text-gray-900">
                                        Shipping Address:{" "}
                                        {order.shippingAddress}
                                    </h5>
                                    {/* <p className="text-gray-900">
                                        {order.shippingAddress}
                                    </p> */}
                                    <p className="text-gray-900">
                                        Phone: {order.phoneNumber}
                                    </p>
                                </div>

                                <div className="border-t border-gray-200 pt-4">
                                    <h5 className="mb-3 text-sm font-medium text-gray-500">
                                        Products
                                    </h5>
                                    <ul className="divide-y divide-gray-200">
                                        {order.products.map(
                                            (product, index) => (
                                                <li
                                                    key={product._id}
                                                    className="py-4"
                                                >
                                                    <div className="flex items-center">
                                                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                                                            <img
                                                                src={
                                                                    product
                                                                        .image[0]
                                                                }
                                                                alt={
                                                                    product.name
                                                                }
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="ml-4 flex-1">
                                                            <div className="flex items-center justify-between">
                                                                <h4 className="text-sm font-medium text-gray-900">
                                                                    {
                                                                        product.name
                                                                    }
                                                                </h4>
                                                                <p className="ml-4 text-sm font-medium text-gray-900">
                                                                    $
                                                                    {
                                                                        product.price
                                                                    }
                                                                </p>
                                                            </div>
                                                            <p className="mt-1 text-sm text-gray-500">
                                                                {
                                                                    product
                                                                        .category
                                                                        .name
                                                                }
                                                            </p>
                                                            <p className="mt-1 text-sm text-gray-500">
                                                                Qty:{" "}
                                                                {order
                                                                    .cartItems[
                                                                    index
                                                                ]?.quantity ||
                                                                    1}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>

                                <div className="mt-6 flex justify-end border-t border-gray-200 pt-4">
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">
                                            Proposed Price
                                        </p>
                                        <p className="text-xl font-semibold text-gray-900">
                                            ${order.expectedPrice}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Order
