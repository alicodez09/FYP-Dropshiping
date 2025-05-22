"use client"

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

    const handleApproveProduct = async (userId: string, productId: string) => {
        try {
            await axios.post(
                `http://localhost:8082/api/v1/auth/approve-product`,
                {
                    userId,
                    productId,
                },
            )

            setUsers((prevUsers) =>
                prevUsers.map((user) => {
                    if (user._id === userId) {
                        return {
                            ...user,
                            products: user.products.filter(
                                (product) => product._id !== productId,
                            ),
                        }
                    }
                    return user
                }),
            )

            showToast("Product approved successfully", "success")
        } catch (error) {
            console.error("Error approving product:", error)
            showToast("Failed to approve product", "error")
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
                                <div className="border-b border-gray-200 p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="rounded-full bg-gray-100 p-2">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-gray-600"
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
                                        <div>
                                            <h2 className="text-lg font-semibold">
                                                {user.name}
                                            </h2>
                                            <p className="text-sm text-gray-500">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* User Content */}
                                <div className="p-4">
                                    <div className="mb-2">
                                        <p className="text-sm text-gray-500">
                                            Phone:{" "}
                                            {user.phone || "Not provided"}
                                        </p>
                                        <div className="mt-2 flex items-center">
                                            <span className="mr-2 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                                {user.products.length} Products
                                            </span>
                                        </div>
                                    </div>

                                    {user.products.length > 0 ? (
                                        <div className="mt-4 space-y-3">
                                            <h3 className="text-sm font-medium">
                                                Configured Products
                                            </h3>
                                            {user?.products.map((product) => (
                                                <div
                                                    key={product._id}
                                                    className="flex flex-col rounded-md bg-gray-50 p-3"
                                                >
                                                    <div className="mb-2 flex items-start justify-between">
                                                        <div>
                                                            {product?.details && (
                                                                <div className="mt-2 text-xl font-bold text-red-600">
                                                                    <p className="mt-1 line-clamp-2">
                                                                        {product
                                                                            .details
                                                                            .name ||
                                                                            "No name available"}
                                                                    </p>
                                                                </div>
                                                            )}
                                                            <p className="text-xs text-gray-500">
                                                                Status:{" "}
                                                                {product.status
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
                                                        <button
                                                            onClick={() =>
                                                                handleApproveProduct(
                                                                    user._id,
                                                                    product._id,
                                                                )
                                                            }
                                                            className="inline-flex items-center rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
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
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M5 13l4 4L19 7"
                                                                />
                                                            </svg>
                                                            Approve
                                                        </button>
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
