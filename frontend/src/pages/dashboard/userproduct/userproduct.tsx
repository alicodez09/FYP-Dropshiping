import { Sidebar } from "@/components/sidebar"
import axios from "axios"
import { useEffect, useState } from "react"

interface ProductDetails {
    _id: string
    name: string
    price: number
    description: string
    // Add other product fields as needed
}

interface Product {
    _id: string
    product: string
    expectedPrice: string
    shippingAddress: string
    phoneNumber: string
    status: boolean
    quantity: any
    details?: ProductDetails
}

interface UserData {
    _id: string
    name: string
    email: string
    phone: string
    products: Product[]
}

const UserProducts = () => {
    const [users, setUsers] = useState<UserData[]>([])
    console.log(users, "users")
    const [loading, setLoading] = useState(true)
    const [toastMessage, setToastMessage] = useState<{
        show: boolean
        message: string
        type: "success" | "error"
    }>({
        show: false,
        message: "",
        type: "success",
    })

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const response = await axios.get(
                `http://localhost:8082/api/v1/auth/get-user`,
            )
            const usersData = response.data.data

            // Fetch product details for each user's products
            const usersWithProductDetails = await Promise.all(
                usersData.map(async (user: UserData) => {
                    const productsWithDetails = await Promise.all(
                        user.products.map(async (product) => {
                            try {
                                const productResponse = await axios.get(
                                    `http://localhost:8082/api/v1/product/get-product-details/${product.product}`,
                                )
                                console.log(productResponse, "productResponse")
                                return {
                                    ...product,
                                    details: productResponse.data.product,
                                }
                            } catch (error) {
                                console.error(
                                    `Error fetching product ${product.product} details:`,
                                    error,
                                )
                                return product
                            }
                        }),
                    )
                    return {
                        ...user,
                        products: productsWithDetails,
                    }
                }),
            )

            setUsers(usersWithProductDetails)
        } catch (error) {
            console.error("Error fetching users:", error)
            showToast("Failed to fetch users data", "error")
        } finally {
            setLoading(false)
        }
    }

    const handleApproveAllProducts = async (userId: string) => {
        try {
            const user = users.find((u) => u._id === userId)

            if (!user || user.products.length === 0) {
                showToast("No products to approve", "error")
                return
            }

            // Send all product IDs and their details in one request
            await axios.post(
                `http://localhost:8082/api/v1/auth/approve-all-products`,
                {
                    userId,
                    products: user.products.map((product) => ({
                        productId: product._id,
                        shippingAddress: product.shippingAddress,
                        phoneNumber: product.phoneNumber,
                        expectedPrice: product.expectedPrice,
                        quantity: product.quantity,
                    })),
                },
            )

            // Remove all products for this user from local state
            setUsers((prevUsers) =>
                prevUsers.map((user) => {
                    if (user._id === userId) {
                        return {
                            ...user,
                            products: [],
                        }
                    }
                    return user
                }),
            )

            showToast("All products approved successfully", "success")
        } catch (error) {
            console.error("Error approving all products:", error)
            showToast("Failed to approve products", "error")
        }
    }
    const showToast = (message: string, type: "success" | "error") => {
        setToastMessage({
            show: true,
            message,
            type,
        })

        // Hide toast after 3 seconds
        setTimeout(() => {
            setToastMessage((prev) => ({ ...prev, show: false }))
        }, 3000)
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    return (
        <Sidebar>
            <div className="min-h-screen bg-white p-6">
                {/* Toast notification */}
                {toastMessage.show && (
                    <div
                        className={`fixed right-4 top-4 z-50 rounded-md px-4 py-2 shadow-lg ${
                            toastMessage.type === "success"
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
                        }`}
                    >
                        {toastMessage.message}
                    </div>
                )}

                <div className="mb-6">
                    <h1 className="text-2xl font-bold">
                        User Products Management
                    </h1>
                    <p className="text-gray-500">
                        Approve configured products for users
                    </p>
                </div>

                {loading ? (
                    <div className="flex h-64 items-center justify-center">
                        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        {users.map((user) => (
                            <div
                                key={user._id}
                                className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md"
                            >
                                {/* User Header */}
                                <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                                    <div className="p-6">
                                        <div className="flex flex-col gap-6 md:flex-row md:items-start">
                                            {/* Avatar Section */}
                                            <div className="flex items-start gap-4">
                                                <div className="rounded-full bg-gray-100 p-3">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-6 w-6 text-gray-600"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                        />
                                                    </svg>
                                                </div>

                                                {/* User Info */}
                                                <div>
                                                    <h2 className="text-xl font-bold text-gray-800">
                                                        {user.name}
                                                    </h2>
                                                    <p className="text-gray-600">
                                                        {user.email}
                                                    </p>
                                                    <div className="mt-2 flex gap-2">
                                                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                                                            Active User
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Product Section - Showing only index 0 */}
                                            <div className="flex-1">
                                                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                                                    Shipping Details
                                                </h3>

                                                {user?.products?.length > 0 ? (
                                                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                                                        {user.products[0]
                                                            ?.details && (
                                                            <div className="mb-3"></div>
                                                        )}

                                                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                            <div className="text-sm">
                                                                <span className="font-medium text-gray-500">
                                                                    Price:
                                                                </span>
                                                                <span className="ml-2 text-gray-700">
                                                                    {user
                                                                        .products[0]
                                                                        .expectedPrice ||
                                                                        "Not specified"}
                                                                </span>
                                                            </div>
                                                            <div className="text-sm">
                                                                <span className="font-medium text-gray-500">
                                                                    Phone:
                                                                </span>
                                                                <span className="ml-2 text-gray-700">
                                                                    {user
                                                                        .products[0]
                                                                        .phoneNumber ||
                                                                        "Not provided"}
                                                                </span>
                                                            </div>
                                                            <div className="text-sm sm:col-span-2">
                                                                <span className="font-medium text-gray-500">
                                                                    Shipping
                                                                    Address:
                                                                </span>
                                                                <span className="ml-2 text-gray-700">
                                                                    {user
                                                                        .products[0]
                                                                        .shippingAddress ||
                                                                        "Not provided"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="mx-auto h-8 w-8 text-gray-400"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={
                                                                    1.5
                                                                }
                                                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                                            />
                                                        </svg>
                                                        <p className="mt-2 text-sm font-medium text-gray-600">
                                                            No Shipping Details
                                                        </p>
                                                        <p className="mt-1 text-xs text-gray-500">
                                                            User hasn't set up
                                                            any products yet
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* User Content */}
                                <div className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="mb-2">
                                            <p className="text-sm text-gray-500">
                                                Phone:{" "}
                                                {user.phone || "Not provided"}
                                            </p>

                                            <div className="mt-2 flex items-center">
                                                <span className="mr-2 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                                    {user?.products?.length}{" "}
                                                    Products
                                                </span>
                                            </div>
                                        </div>
                                        {user?.products?.length > 0 && (
                                            <button
                                                onClick={() =>
                                                    handleApproveAllProducts(
                                                        user._id,
                                                    )
                                                }
                                                className="mb-4 inline-flex items-center rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="mr-1 h-4 w-4"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                                Approve Products
                                            </button>
                                        )}
                                    </div>

                                    {user?.products?.length > 0 ? (
                                        <div className="mt-4 space-y-3">
                                            <h3 className="text-sm font-medium">
                                                Configured Products
                                            </h3>
                                            {user?.products?.map((product) => (
                                                <div
                                                    key={product?._id}
                                                    className="flex flex-col rounded-md bg-gray-50 p-3"
                                                >
                                                    <div className="mb-2 flex items-start justify-between">
                                                        <div>
                                                            {product?.details && (
                                                                <div className="mt-2 text-xl font-bold text-red-600">
                                                                    <p className="mt-1 line-clamp-2">
                                                                        {product
                                                                            ?.details
                                                                            ?.name ||
                                                                            "No name available"}
                                                                    </p>
                                                                </div>
                                                            )}
                                                            <p className="text-xs text-gray-500">
                                                                Status:{" "}
                                                                {product?.status
                                                                    ? "Approved"
                                                                    : "Pending"}
                                                            </p>

                                                            <p className="text-xs text-gray-500">
                                                                Quantity:{" "}
                                                                {
                                                                    product?.quantity
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="mt-4 rounded-md bg-gray-50 p-3 text-center text-gray-500">
                                            No configured products
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {users.length === 0 && (
                            <div className="col-span-2 rounded-lg bg-gray-50 p-8 text-center">
                                <p className="text-gray-500">No users found</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Sidebar>
    )
}

export default UserProducts
