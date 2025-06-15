import type React from "react"
import { useState, useEffect } from "react"
import { X, Plus, Edit, Trash2, Calendar, Tag } from "lucide-react"
import axios from "axios"

const API_BASE_URL = "http://localhost:8082/api/v1/tickets"

interface Ticket {
    _id: string
    subject: string
    description: string
    status: "open" | "in-progress" | "resolved" | "closed"
    createdAt: string
    user_id: any
}

interface TicketFormData {
    subject: string
    description: string
    status: Ticket["status"]
    user_id: any
}

const UserTickets = () => {
    const storedAuth = localStorage.getItem("dropshipping_auth")
    const parsedData = storedAuth ? JSON.parse(storedAuth) : null
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [formData, setFormData] = useState<TicketFormData>({
        subject: "",
        description: "",
        status: "open",
        user_id: parsedData?.user?._id,
    })

    const [editingId, setEditingId] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchTickets()
    }, [])

    const fetchTickets = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(`${API_BASE_URL}/get`)
            // Ensure we always set an array
            console.log(response.data, "tickets")
            setTickets(
                Array.isArray(response?.data?.jobs) ? response.data?.jobs : [],
            )
            setError(null)
        } catch (err) {
            setError(
                axios.isAxiosError(err)
                    ? err.response?.data?.message || "Failed to fetch tickets"
                    : "Failed to fetch tickets",
            )
            setTickets([])
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            if (editingId) {
                // Update existing ticket
                await axios.put(`${API_BASE_URL}/update/${editingId}`, formData)
            } else {
                // Create new ticket
                await axios.post(`${API_BASE_URL}/create`, formData)
            }
            await fetchTickets()
            setFormData({
                subject: "",
                description: "",
                status: "open",
                user_id: parsedData?.user?._id,
            })
            setEditingId(null)
            setIsModalOpen(false)
            setError(null)
        } catch (err) {
            setError(
                axios.isAxiosError(err)
                    ? err.response?.data?.message || "Failed to save ticket"
                    : "Failed to save ticket",
            )
        } finally {
            setIsLoading(false)
        }
    }

    const handleEdit = (ticket: Ticket) => {
        setFormData({
            subject: ticket.subject,
            description: ticket.description,
            status: ticket.status,
            user_id: parsedData?.user?._id,
        })
        setEditingId(ticket?._id)
        setIsModalOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this ticket?")) return

        try {
            await axios.delete(`${API_BASE_URL}/delete/${id}`)
            await fetchTickets()
        } catch (err) {
            setError(
                axios.isAxiosError(err)
                    ? err.response?.data?.message || "Failed to delete ticket"
                    : "Failed to delete ticket",
            )
        }
    }

    const handleStatusChange = async (
        id: string,
        newStatus: Ticket["status"],
    ) => {
        try {
            await axios.put(`${API_BASE_URL}/update/${id}`, {
                status: newStatus,
            })
            await fetchTickets()
        } catch (err) {
            setError(
                axios.isAxiosError(err)
                    ? err.response?.data?.message || "Failed to update status"
                    : "Failed to update status",
            )
        }
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setEditingId(null)

        setFormData({
            subject: "",
            description: "",
            status: "open",
            user_id: parsedData?.user?._id,
        })
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "open":
                return "bg-blue-100 text-blue-800 border-blue-200"
            case "in-progress":
                return "bg-yellow-100 text-yellow-800 border-yellow-200"
            case "resolved":
                return "bg-green-100 text-green-800 border-green-200"
            case "closed":
                return "bg-gray-100 text-gray-800 border-gray-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    return (
        <div className="min-h-screen bg-white text-black">
            <div className="mx-auto max-w-7xl p-6">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-black">
                            Support Tickets
                        </h1>
                        <p className="mt-1 text-gray-600">
                            Manage and track your support requests
                        </p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 rounded-lg bg-black px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-gray-800"
                        disabled={isLoading}
                    >
                        <Plus className="h-4 w-4" />
                        New Ticket
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
                        <p className="font-medium text-red-800">{error}</p>
                    </div>
                )}

                {/* Tickets Grid */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-black"></div>
                        <span className="ml-3 text-gray-600">
                            Loading tickets...
                        </span>
                    </div>
                ) : tickets?.length === 0 ? (
                    <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-12 text-center">
                        <div className="mx-auto max-w-md">
                            <Tag className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                            <h3 className="mb-2 text-lg font-medium text-gray-900">
                                No tickets yet
                            </h3>
                            <p className="mb-4 text-gray-600">
                                Get started by creating your first support
                                ticket
                            </p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="rounded-lg bg-black px-4 py-2 text-white transition-colors duration-200 hover:bg-gray-800"
                            >
                                Create Ticket
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {tickets?.map((ticket) => (
                            <div
                                key={ticket?._id}
                                className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow duration-200 hover:shadow-lg"
                            >
                                <div className="mb-4 flex items-start justify-between">
                                    <h3 className="line-clamp-2 text-lg font-semibold text-black">
                                        {ticket.subject}
                                    </h3>
                                    <div className="ml-2 flex gap-1">
                                        <button
                                            onClick={() =>
                                                handleDelete(ticket._id)
                                            }
                                            className="rounded-lg p-2 text-gray-500 transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
                                            disabled={isLoading}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="mb-4 line-clamp-3 text-sm text-gray-600">
                                        {ticket.description}
                                    </p>
                                    <div className="mb-4">
                                        <span
                                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                                ticket.status === "open"
                                                    ? "bg-amber-100 text-amber-900 ring-1 ring-amber-500/30"
                                                    : ticket.status ===
                                                        "in-progress"
                                                      ? "bg-sky-100 text-sky-900 ring-1 ring-sky-500/30"
                                                      : "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-500/30"
                                            }`}
                                        >
                                            {ticket.status ===
                                                "in-progress" && (
                                                <svg
                                                    className="mr-1.5 h-2 w-2 animate-pulse"
                                                    fill="currentColor"
                                                    viewBox="0 0 8 8"
                                                >
                                                    <circle
                                                        cx="4"
                                                        cy="4"
                                                        r="3"
                                                    />
                                                </svg>
                                            )}
                                            {ticket.status === "open" && (
                                                <svg
                                                    className="mr-1.5 h-2 w-2"
                                                    fill="currentColor"
                                                    viewBox="0 0 8 8"
                                                >
                                                    <circle
                                                        cx="4"
                                                        cy="4"
                                                        r="3"
                                                    />
                                                </svg>
                                            )}
                                            {ticket.status
                                                .charAt(0)
                                                .toUpperCase() +
                                                ticket.status
                                                    .slice(1)
                                                    .replace("-", " ")}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">
                                            {new Date(
                                                ticket.createdAt,
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                        <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white shadow-xl">
                            <div className="flex items-center justify-between border-b border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-black">
                                    {editingId
                                        ? "Edit Ticket"
                                        : "Create New Ticket"}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="rounded-lg p-2 text-gray-400 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-600"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-4 p-6"
                            >
                                <div>
                                    <label
                                        htmlFor="subject"
                                        className="mb-2 block text-sm font-medium text-black"
                                    >
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
                                        placeholder="Enter ticket subject"
                                        required
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="description"
                                        className="mb-2 block text-sm font-medium text-black"
                                    >
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-black focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
                                        placeholder="Describe your issue in detail"
                                        required
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 rounded-lg bg-black px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {isLoading
                                            ? "Saving..."
                                            : editingId
                                              ? "Update"
                                              : "Create"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default UserTickets
