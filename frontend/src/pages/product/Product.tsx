"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import {
    Search,
    Sliders,
    X,
    ShoppingCart,
    Briefcase,
    User,
    Mail,
    Phone,
    Linkedin,
    Globe,
} from "lucide-react"
import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"

// Define TypeScript interfaces
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

interface AuthData {
    success: boolean
    message: string
    user: UserData
    token: string
}

interface UserData {
    _id: string
    products: { product: string; status: boolean }[]
    cart: CartItem[]
    [key: string]: any
}

interface CartItem {
    product: Product
    quantity: number
    _id?: string
}

const Product = () => {
    const router = useNavigate()
    const [products, setProducts] = useState<Product[]>([])
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null,
    )
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
    const [showFilters, setShowFilters] = useState(false)
    const [loading, setLoading] = useState(true)
    const [cart, setCart] = useState<CartItem[]>([])
    const [showCart, setShowCart] = useState(false)
    const [authData, setAuthData] = useState<AuthData | null>(null)

    useEffect(() => {
        const storedAuth = localStorage.getItem("zain_auth")
        if (storedAuth) {
            try {
                const parsedData = JSON.parse(storedAuth)
                setAuthData(parsedData)
                fetchCart(parsedData.user._id)
            } catch (error) {
                console.error("Error parsing auth data:", error)
            }
        }
    }, [])

    const fetchCart = async (userId: string) => {
        try {
            const response = await axios.get(
                `http://localhost:8082/api/v1/auth/${userId}/cart`,
            )
            setCart(response.data.cart)
        } catch (error) {
            console.error("Error fetching cart:", error)
        }
    }

    const addToCart = async (productId: string) => {
        if (!authData?.user?._id) {
            alert("Please login to add products to cart")
            router("/login")
            return
        }

        try {
            await axios.put(
                `http://localhost:8082/api/v1/auth/${authData.user._id}/add-to-cart`,
                { productId },
            )
            fetchCart(authData.user._id)
            alert("Product added to cart!")
        } catch (error) {
            console.error("Error adding to cart:", error)
            alert("Failed to add to cart")
        }
    }

    const removeFromCart = async (productId: string) => {
        try {
            await axios.delete(
                `http://localhost:8082/api/v1/auth/${authData?.user?._id}/remove-from-cart/${productId}`,
            )
            fetchCart(authData?.user?._id || "")
        } catch (error) {
            console.error("Error removing from cart:", error)
        }
    }

    const updateQuantity = async (productId: string, newQuantity: number) => {
        try {
            await axios.put(
                `http://localhost:8082/api/v1/auth/${authData?.user?._id}/update-cart/${productId}`,
                { quantity: newQuantity },
            )
            fetchCart(authData?.user?._id || "")
        } catch (error) {
            console.error("Error updating cart:", error)
        }
    }

    const checkout = async () => {
        try {
            await axios.post(
                `http://localhost:8082/api/v1/auth/${authData?.user?._id}/checkout`,
            )
            setCart([])
            setShowCart(false)
            alert("Checkout successful! Your order is now pending.")
        } catch (error) {
            console.error("Error during checkout:", error)
            alert("Checkout failed")
        }
    }

    // Fetch products from API
    const getData = async () => {
        try {
            setLoading(true)
            const response = await axios.get(
                `http://localhost:8082/api/v1/product/get-product`,
            )
            const productsData = response?.data?.products || []
            setProducts(productsData)
            setFilteredProducts(productsData)

            // Extract unique categories
            const uniqueCategories = Array.from(
                new Set(
                    productsData.map((product: Product) =>
                        JSON.stringify(product.category),
                    ),
                ),
            ).map((cat: any) => JSON.parse(cat))

            setCategories(uniqueCategories)
            setLoading(false)
        } catch (error) {
            console.error("Error fetching products:", error)
            setLoading(false)
        }
    }

    useEffect(() => {
        getData()
    }, [])

    // Apply filters whenever filter criteria change
    useEffect(() => {
        applyFilters()
    }, [searchQuery, selectedCategory, priceRange, products])

    const applyFilters = () => {
        let filtered = [...products]

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(
                (product) =>
                    product.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    product.description
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()),
            )
        }

        // Apply category filter
        if (selectedCategory) {
            filtered = filtered.filter(
                (product) => product.category._id === selectedCategory,
            )
        }

        // Apply price filter
        filtered = filtered.filter((product) => {
            const productPrice = Number.parseInt(product.price)
            return (
                productPrice >= priceRange[0] && productPrice <= priceRange[1]
            )
        })

        setFilteredProducts(filtered)
    }

    const resetFilters = () => {
        setSearchQuery("")
        setSelectedCategory(null)
        setPriceRange([0, 10000])
        setFilteredProducts(products)
    }

    const formatPrice = (price: string) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
        }).format(Number.parseInt(price))
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header>
                <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Products
                    </h1>

                    <div className="flex items-center gap-4">
                        {/* Search Bar */}
                        <div className="relative w-full md:w-64">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                style={{ color: "black" }}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                            />
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>

                        {/* Cart Button */}
                        <button
                            onClick={() => setShowCart(true)}
                            className="relative rounded-lg bg-gray-100 p-2 text-gray-700 hover:bg-gray-200"
                        >
                            <ShoppingCart className="h-5 w-5" />
                            {cart.length > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs text-white">
                                    {cart.reduce(
                                        (total, item) => total + item.quantity,
                                        0,
                                    )}
                                </span>
                            )}
                        </button>

                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200 md:hidden"
                        >
                            <Sliders className="h-4 w-4" />
                            Filters
                        </button>
                    </div>
                </div>
            </header>

            {/* Cart Modal */}
            {showCart && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-white p-4">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-xl font-bold">Your Cart</h2>
                        <button
                            onClick={() => setShowCart(false)}
                            className="rounded-full p-2 hover:bg-gray-100"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {cart.length === 0 ? (
                        <div className="py-8 text-center">
                            <p className="text-gray-600">Your cart is empty</p>
                        </div>
                    ) : (
                        <div
                            style={{
                                marginLeft: "5rem",
                                marginRight: "5rem",
                            }}
                        >
                            <Link
                                to="/"
                                className="transition-color rounded-lg bg-blue-600 px-3 py-1.5 text-lg font-medium text-white"
                            >
                                Go Back
                            </Link>
                            <div className="mt-8 space-y-14">
                                {cart.map((item) => (
                                    <div
                                        key={item.product._id}
                                        className="flex items-center justify-between border-b pb-4"
                                    >
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={
                                                    item.product.image[0] ||
                                                    "/placeholder.svg"
                                                }
                                                alt={item.product.name}
                                                className="h-16 w-16 rounded object-cover"
                                            />
                                            <div>
                                                <h3
                                                    className="font-medium"
                                                    style={{ color: "black" }}
                                                >
                                                    {item.product.name}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {formatPrice(
                                                        item.product.price,
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.product._id,
                                                        item.quantity - 1,
                                                    )
                                                }
                                                disabled={item.quantity <= 1}
                                                className="h-8 w-8 rounded border bg-black disabled:opacity-50"
                                            >
                                                -
                                            </button>
                                            <span style={{ color: "black" }}>
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.product._id,
                                                        item.quantity + 1,
                                                    )
                                                }
                                                className="h-8 w-8 rounded border bg-black"
                                            >
                                                +
                                            </button>
                                            <button
                                                onClick={() =>
                                                    removeFromCart(
                                                        item.product._id,
                                                    )
                                                }
                                                className="ml-2 text-red-500 hover:text-red-700"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 border-t pt-4">
                                <div className="flex justify-between font-bold">
                                    <span>Total:</span>
                                    <span>
                                        {formatPrice(
                                            cart
                                                .reduce(
                                                    (total, item) =>
                                                        total +
                                                        Number(
                                                            item.product.price,
                                                        ) *
                                                            item.quantity,
                                                    0,
                                                )
                                                .toString(),
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-center">
                                    <button
                                        onClick={checkout}
                                        className="mt-4 w-44 rounded-lg bg-purple-600 py-2 font-medium text-white hover:bg-purple-700"
                                    >
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col gap-8 md:flex-row">
                    {/* Filters - Mobile */}
                    {showFilters && (
                        <div className="fixed inset-0 z-40 overflow-y-auto bg-white p-4 md:hidden">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-xl font-bold">Filters</h2>
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="rounded-full p-2 hover:bg-gray-100"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            {renderFilters()}

                            <div className="mt-6 flex gap-4">
                                <button
                                    onClick={() => {
                                        resetFilters()
                                        setShowFilters(false)
                                    }}
                                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                                >
                                    Reset
                                </button>
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Filters - Desktop */}
                    <div className="hidden w-64 flex-shrink-0 md:block">
                        <div className="sticky top-8 rounded-lg bg-white p-6 shadow-sm">
                            <h2 className="mb-6 text-lg font-semibold">
                                Filters
                            </h2>

                            {renderFilters()}

                            <button
                                onClick={resetFilters}
                                className="mt-6 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="grid animate-pulse grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {[1, 2, 3, 4, 5, 6].map((item) => (
                                    <div
                                        key={item}
                                        className="h-80 overflow-hidden rounded-lg bg-white shadow-sm"
                                    >
                                        <div className="h-48 bg-gray-200"></div>
                                        <div className="p-4">
                                            <div className="mb-2 h-4 w-3/4 rounded bg-gray-200"></div>
                                            <div className="mb-4 h-4 w-1/2 rounded bg-gray-200"></div>
                                            <div className="h-6 w-1/4 rounded bg-gray-200"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {filteredProducts.map((product) => (
                                    <div
                                        key={product._id}
                                        className="overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md"
                                    >
                                        <div className="h-48 overflow-hidden">
                                            <img
                                                src={
                                                    product.image[0] ||
                                                    "/placeholder.svg"
                                                }
                                                alt={product.name}
                                                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <div className="mb-2 flex items-start justify-between">
                                                <h3 className="line-clamp-1 text-lg font-medium text-gray-900">
                                                    {product.name}
                                                </h3>
                                                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                                                    {product.category.name}
                                                </span>
                                            </div>
                                            <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                                                {product.description}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-lg font-bold text-gray-900">
                                                    {formatPrice(product.price)}
                                                </span>
                                                {authData?.user?.products?.some(
                                                    (item) =>
                                                        item.product ===
                                                            product._id &&
                                                        item.status === false,
                                                ) ? (
                                                    <span className="rounded-lg bg-yellow-500 px-3 py-1.5 text-xs font-medium text-white">
                                                        Pending
                                                    </span>
                                                ) : (
                                                    <button
                                                        className="rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-purple-700"
                                                        onClick={() =>
                                                            addToCart(
                                                                product._id,
                                                            )
                                                        }
                                                    >
                                                        Add to Cart
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-lg bg-white p-8 text-center">
                                <h3 className="mb-2 text-lg font-medium text-gray-900">
                                    No products found
                                </h3>
                                <p className="mb-4 text-gray-600">
                                    Try adjusting your filters or search query
                                </p>
                                <button
                                    onClick={resetFilters}
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )

    function renderFilters() {
        return (
            <>
                {/* Category Filter */}
                <div className="mb-6">
                    <h3 className="mb-3 text-sm font-medium text-gray-900">
                        Categories
                    </h3>
                    <div className="space-y-2">
                        {categories.map((category) => (
                            <div
                                key={category._id}
                                className="flex items-center"
                            >
                                <input
                                    id={`category-${category._id}`}
                                    type="radio"
                                    name="category"
                                    checked={selectedCategory === category._id}
                                    onChange={() =>
                                        setSelectedCategory(category._id)
                                    }
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label
                                    htmlFor={`category-${category._id}`}
                                    className="ml-2 text-sm text-gray-700"
                                >
                                    {category.name}
                                </label>
                            </div>
                        ))}
                        {categories.length > 0 && (
                            <div className="flex items-center">
                                <input
                                    id="category-all"
                                    type="radio"
                                    name="category"
                                    checked={selectedCategory === null}
                                    onChange={() => setSelectedCategory(null)}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label
                                    htmlFor="category-all"
                                    className="ml-2 text-sm text-gray-700"
                                >
                                    All Categories
                                </label>
                            </div>
                        )}
                    </div>
                </div>

                {/* Price Range Filter */}
                <div className="mb-6">
                    <h3 className="mb-3 text-sm font-medium text-gray-900">
                        Price Range
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">
                                {formatPrice(priceRange[0].toString())}
                            </span>
                            <span className="text-sm text-gray-500">
                                {formatPrice(priceRange[1].toString())}
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="10000"
                            step="100"
                            value={priceRange[1]}
                            onChange={(e) =>
                                setPriceRange([
                                    priceRange[0],
                                    Number.parseInt(e.target.value),
                                ])
                            }
                            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
                        />
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <label htmlFor="min-price" className="sr-only">
                                    Minimum Price
                                </label>
                                <input
                                    id="min-price"
                                    type="number"
                                    min="0"
                                    max={priceRange[1]}
                                    value={priceRange[0]}
                                    onChange={(e) =>
                                        setPriceRange([
                                            Number.parseInt(e.target.value),
                                            priceRange[1],
                                        ])
                                    }
                                    className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                                    placeholder="Min"
                                />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="max-price" className="sr-only">
                                    Maximum Price
                                </label>
                                <input
                                    id="max-price"
                                    type="number"
                                    min={priceRange[0]}
                                    max="10000"
                                    value={priceRange[1]}
                                    onChange={(e) =>
                                        setPriceRange([
                                            priceRange[0],
                                            Number.parseInt(e.target.value),
                                        ])
                                    }
                                    className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                                    placeholder="Max"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default Product
