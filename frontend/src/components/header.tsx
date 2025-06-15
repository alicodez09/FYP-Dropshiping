"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Menu, X, User, LogOut, ShoppingBag } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

interface UserData {
    _id: string
    name: string
    email: string
    role: number
}

interface AuthData {
    success: boolean
    message: string
    user: UserData
    token: string
}

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [user, setUser] = useState<UserData | null>(null)
    const location = useLocation()
    console.log(user, "user")

    useEffect(() => {
        // Check if user is logged in
        const authData = localStorage.getItem("dropshipping_auth")
        if (authData) {
            try {
                const parsedData: AuthData = JSON.parse(authData)
                if (parsedData.success && parsedData.user) {
                    setUser(parsedData.user)
                }
            } catch (error) {
                console.error("Error parsing auth data:", error)
            }
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("dropshipping_auth")
        setUser(null)
        // Redirect to home page if needed
        window.location.href = "/"
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMenuOpen(false)
    }, [location.pathname])

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <ShoppingBag className="h-8 w-8 text-blue-600" />
                        <span className="text-xl font-bold text-gray-900">
                            Dropship
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden items-center space-x-8 md:flex">
                        <NavLink to="/" active={location.pathname === "/"}>
                            Home
                        </NavLink>
                        <NavLink
                            to="/about"
                            active={location.pathname === "/about"}
                        >
                            About
                        </NavLink>
                        <NavLink
                            to="/team"
                            active={location.pathname === "/team"}
                        >
                            Team
                        </NavLink>
                        <NavLink
                            to="/faqs"
                            active={location.pathname === "/faqs"}
                        >
                            FAQ's
                        </NavLink>
                        <NavLink
                            to="/products"
                            active={location.pathname === "/products"}
                        >
                            Products
                        </NavLink>
                        {user && user.role === 0 && (
                            <NavLink
                                to="/order"
                                active={location.pathname === "/order"}
                            >
                                Orders
                            </NavLink>
                        )}
                        {user && user.role === 0 && (
                            <NavLink
                                to="/user_tickets"
                                active={location.pathname === "/user_tickets"}
                            >
                                User Tickets
                            </NavLink>
                        )}
                        {/* 
                        <NavLink
                            to="/categories"
                            active={location.pathname === "/categories"}
                        >
                            Categories
                        </NavLink> */}

                        {/* <NavLink
                            to="/contact"
                            active={location.pathname === "/contact"}
                        >
                            Contact
                        </NavLink> */}
                        {user && user.role === 1 && (
                            <NavLink
                                to="/admin/users"
                                active={location.pathname === "/admin/users"}
                            >
                                Dashboard
                            </NavLink>
                        )}
                    </nav>

                    {/* Auth Buttons / User Info */}
                    <div className="hidden items-center space-x-4 md:flex">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                        <User className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-900">
                                            Hello, {user.name.split(" ")[0]}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {user.role === 1
                                                ? "Admin"
                                                : "Customer"}
                                        </span>
                                    </div>
                                </div>
                                {user.role === 1 && (
                                    <Link
                                        to="/admin/users"
                                        className="rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-purple-700"
                                    >
                                        Admin Panel
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-1 text-sm text-gray-700 transition-colors hover:text-red-600"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMenu}
                        className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 focus:outline-none md:hidden"
                    >
                        {isMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="border-t border-gray-100 bg-white px-4 py-4 shadow-lg md:hidden">
                    <nav className="flex flex-col space-y-4">
                        <MobileNavLink
                            to="/"
                            active={location.pathname === "/"}
                        >
                            Home
                        </MobileNavLink>
                        {/* <MobileNavLink
                            to="/products"
                            active={location.pathname === "/products"}
                        >
                            Products
                        </MobileNavLink>
                        <MobileNavLink
                            to="/categories"
                            active={location.pathname === "/categories"}
                        >
                            Categories
                        </MobileNavLink> */}
                        <MobileNavLink
                            to="/about"
                            active={location.pathname === "/about"}
                        >
                            About
                        </MobileNavLink>
                        {/* <MobileNavLink
                            to="/contact"
                            active={location.pathname === "/contact"}
                        >
                            Contact
                        </MobileNavLink> */}
                        {user && user.role === 1 && (
                            <MobileNavLink
                                to="/admin/users"
                                active={location.pathname === "/admin/users"}
                            >
                                Manage Users
                            </MobileNavLink>
                        )}

                        <div className="border-t border-gray-100 pt-4">
                            {user ? (
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                                            <User className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {user.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                    {user.role === 1 && (
                                        <Link
                                            to="/admin/users"
                                            className="flex w-full items-center justify-center space-x-2 rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
                                        >
                                            <span>Admin Panel</span>
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="flex w-full items-center justify-center space-x-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col space-y-3">
                                    <Link
                                        to="/login"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-center text-gray-700 transition-colors hover:bg-gray-50"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-center text-white transition-colors hover:bg-blue-700"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    )
}

// Helper components for navigation links
const NavLink = ({
    children,
    to,
    active,
}: {
    children: React.ReactNode
    to: string
    active: boolean
}) => {
    return (
        <Link
            to={to}
            className={`text-sm font-medium transition-colors ${
                active ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
            }`}
        >
            {children}
        </Link>
    )
}

const MobileNavLink = ({
    children,
    to,
    active,
}: {
    children: React.ReactNode
    to: string
    active: boolean
}) => {
    return (
        <Link
            to={to}
            className={`rounded-md px-2 py-1 text-base font-medium ${
                active
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            }`}
        >
            {children}
        </Link>
    )
}

export default Header
