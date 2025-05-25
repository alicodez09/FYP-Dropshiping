import { Sidebar } from "@/components/sidebar"
import axios from "axios"
import { useEffect, useState } from "react"

interface Product {
    _id: string
    name: string
    description: string
    price: string
    category: {
        _id: string
        name: string
        description: string
        slug: string
        __v: number
    }
    image: string[]
    createdAt: string
    updatedAt: string
    __v: number
}

interface OrderItem {
    product: string
    quantity: number
    _id: string
}

interface User {
    _id: string
    name: string
    email: string
    phone: string
    password: string
    user_type: string
    user_type_data: {
        description: string
        linkedin: string
        portfolio: string
    }
    role: number
    products: Array<{
        product: string
        status: boolean
        expectedPrice: string
        shippingAddress: string
        phoneNumber: string
        quantity: number
        _id: string
    }>
    createdAt: string
    updatedAt: string
    __v: number
    cart: any[]
}

interface Order {
    _id: string
    user: User
    shippingAddress: string
    phoneNumber: string
    expectedPrice: string
    cartItems: OrderItem[]
    status: string
    createdAt: string
    updatedAt: string
    __v: number
}

const Order = () => {
    const [orders, setOrders] = useState<Order[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordersResponse, productsResponse] = await Promise.all([
                    axios.get<{ data: Order[] }>(
                        "http://localhost:8082/api/v1/auth/all-orders-admin",
                    ),
                    axios.get<{ products: Product[] }>(
                        "http://localhost:8082/api/v1/product/get-product",
                    ),
                ])

                setOrders(ordersResponse.data.data)
                setProducts(productsResponse.data.products)
            } catch (error) {
                console.error("Error fetching data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const getProductById = (id: string) => {
        return products.find((product) => product._id === id)
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
            </div>
        )
    }

    return (
        <Sidebar>
            <div className="container mx-auto bg-gray-50 px-4 py-8">
                <h1 className="mb-8 text-3xl font-bold text-gray-800">
                    Admin Analytics Dashboard
                </h1>

                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="rounded-lg bg-white p-6 shadow">
                        <h2 className="mb-2 text-xl font-semibold text-gray-700">
                            Total Orders
                        </h2>
                        <p className="text-3xl font-bold text-blue-600">
                            {orders.length}
                        </p>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow">
                        <h2 className="mb-2 text-xl font-semibold text-gray-700">
                            Pending Orders
                        </h2>
                        <p className="text-3xl font-bold text-yellow-600">
                            {
                                orders.filter(
                                    (order) => order.status === "pending",
                                ).length
                            }
                        </p>
                    </div>
                </div>

                <div className="mb-8 overflow-hidden rounded-lg bg-white shadow">
                    <h2 className="border-b p-6 text-2xl font-semibold text-gray-800">
                        Recent Orders
                    </h2>

                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="border-b p-6 last:border-b-0"
                        >
                            <div className="mb-4 flex items-start justify-between">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Order #{order._id.slice(-6)}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Date:{" "}
                                        {new Date(
                                            order.createdAt,
                                        ).toLocaleDateString()}
                                    </p>
                                    <p
                                        className={`text-sm font-medium ${
                                            order.status === "pending"
                                                ? "text-yellow-600"
                                                : "text-green-600"
                                        }`}
                                    >
                                        Status:{" "}
                                        {order.status.charAt(0).toUpperCase() +
                                            order.status.slice(1)}
                                    </p>
                                </div>
                                <div className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                                    ${order.expectedPrice}
                                </div>
                            </div>

                            <div className="mb-4">
                                <h4 className="mb-2 font-medium text-gray-900">
                                    Customer Details
                                </h4>
                                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                                    <div>
                                        <p className="text-black">
                                            <span className="font-medium">
                                                Name:
                                            </span>{" "}
                                            {order.user.name}
                                        </p>
                                        <p className="text-black">
                                            <span className="font-medium">
                                                Email:
                                            </span>{" "}
                                            {order.user.email}
                                        </p>
                                        <p className="text-black">
                                            <span className="font-medium">
                                                Phone:
                                            </span>{" "}
                                            {order.user.phone}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-black">
                                            <span className="font-medium">
                                                Shipping Address:
                                            </span>{" "}
                                            {order.shippingAddress}
                                        </p>
                                        <p className="text-black">
                                            <span className="font-medium">
                                                Contact Phone:
                                            </span>{" "}
                                            {order.phoneNumber}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="mb-2 font-medium text-gray-900">
                                    Ordered Products
                                </h4>
                                <div className="space-y-4">
                                    {order.cartItems.map((item) => {
                                        const product = getProductById(
                                            item.product,
                                        )
                                        return product ? (
                                            <div
                                                key={item._id}
                                                className="flex items-start rounded-lg border p-3"
                                            >
                                                <img
                                                    src={product.image[0]}
                                                    alt={product.name}
                                                    className="mr-4 h-16 w-16 rounded object-cover"
                                                />
                                                <div className="flex-1">
                                                    <h5 className="font-medium text-gray-900">
                                                        {product.name}
                                                    </h5>
                                                    <p className="line-clamp-1 text-sm text-gray-500">
                                                        {product.description}
                                                    </p>
                                                    <div className="mt-1 flex items-center justify-between">
                                                        <span className="text-sm font-medium">
                                                            ${product.price}
                                                        </span>
                                                        <span className="text-sm text-gray-500">
                                                            Qty: {item.quantity}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : null
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Sidebar>
    )
}

export default Order
