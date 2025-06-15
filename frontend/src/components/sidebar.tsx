import { useState } from "react"
import type React from "react"
import {
    ArrowLeftOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
    TagIcon,
    CubeIcon,
    UsersIcon,
    Cog6ToothIcon,
    DocumentTextIcon,
    UserIcon,
    ChartBarIcon,
} from "./icons"
import { Link, useNavigate } from "react-router-dom"

interface SidebarProps {
    children: React.ReactNode
}

export function Sidebar({ children }: SidebarProps) {
    const [isOpen, setIsOpen] = useState(true)
    const navigate = useNavigate()

    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const handleLogout = () => {
        localStorage.removeItem("dropshipping_auth")
        navigate("/login")
    }

    const toggleSidebar = () => {
        setIsOpen(!isOpen)
    }

    const toggleMobileSidebar = () => {
        setIsMobileOpen(!isMobileOpen)
    }

    return (
        <div className="flex h-screen w-full overflow-hidden bg-gray-50">
            <div
                className={`hidden flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out md:flex ${
                    isOpen ? "w-64" : "w-20"
                }`}
            >
                <div className="flex items-center justify-between border-b border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        {isOpen && (
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold">
                                    Admin Panel
                                </span>
                                <span className="text-xs text-gray-500">
                                    Management System
                                </span>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={toggleSidebar}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        {isOpen ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Sidebar Navigation */}
                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1 px-3">
                        <li>
                            <Link
                                to="/admin/order_anayltics"
                                className="flex items-center rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            >
                                <ChartBarIcon className="h-5 w-5" />
                                {isOpen && (
                                    <span className="ml-3">
                                        Order Anayltics
                                    </span>
                                )}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/users"
                                className="flex items-center rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            >
                                <UsersIcon className="h-5 w-5" />
                                {isOpen && <span className="ml-3">Users</span>}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/create-category"
                                className="flex items-center rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            >
                                <TagIcon className="h-5 w-5" />
                                {isOpen && (
                                    <span className="ml-3">
                                        Create Category
                                    </span>
                                )}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/create-product"
                                className="flex items-center rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            >
                                <CubeIcon className="h-5 w-5" />
                                {isOpen && (
                                    <span className="ml-3">Create Product</span>
                                )}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/create-newsfeed"
                                className="flex items-center rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            >
                                <Cog6ToothIcon className="h-5 w-5" />
                                {isOpen && (
                                    <span className="ml-3">
                                        Create Newsfeed
                                    </span>
                                )}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/create-faq"
                                className="flex items-center rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            >
                                <DocumentTextIcon className="h-5 w-5" />
                                {isOpen && (
                                    <span className="ml-3">Create Faq</span>
                                )}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/user_product"
                                className="flex items-center rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            >
                                <UserIcon className="h-5 w-5" />
                                {isOpen && (
                                    <span className="ml-3">User Product</span>
                                )}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/tickets"
                                className="flex items-center rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            >
                                <Cog6ToothIcon className="h-5 w-5" />
                                {isOpen && (
                                    <span className="ml-3">Tickets</span>
                                )}
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* Sidebar Footer */}
                <div className="border-t border-gray-200 p-4">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center rounded-md px-3 py-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                        <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                        {isOpen && <span className="ml-3">Logout</span>}
                    </button>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
                    onClick={toggleMobileSidebar}
                ></div>
            )}

            {/* Mobile Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white transition duration-300 ease-in-out md:hidden ${
                    isMobileOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex items-center justify-between border-b border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-900 text-white">
                            <span className="text-lg font-bold">A</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold">
                                Admin Panel
                            </span>
                            <span className="text-xs text-gray-500">
                                Management System
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={toggleMobileSidebar}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1 px-3">
                        <li>
                            <Link
                                to="/admin/order_anayltics"
                                className="flex items-center rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            >
                                <ChartBarIcon className="h-5 w-5" />
                                <span className="ml-3">Order Anayltics</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/users"
                                className="flex items-center rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            >
                                <UsersIcon className="h-5 w-5" />
                                <span className="ml-3">Users</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/create-category"
                                className="flex items-center rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            >
                                <TagIcon className="h-5 w-5" />
                                <span className="ml-3">Create Category</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/create-product"
                                className="flex items-center rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            >
                                <CubeIcon className="h-5 w-5" />
                                <span className="ml-3">Create Product</span>
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className="border-t border-gray-200 p-4">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center rounded-md px-3 py-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                        <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                        {isOpen && <span className="ml-3">Logout</span>}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Header */}
                <header className="flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-6">
                    <button
                        onClick={toggleMobileSidebar}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none md:hidden"
                    >
                        <Bars3Icon className="h-6 w-6" />
                    </button>
                    <h1 className="text-xl font-semibold">Admin Dashboard</h1>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-auto p-6">{children}</main>
            </div>
        </div>
    )
}
