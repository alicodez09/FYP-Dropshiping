import type React from "react"
import { useState, useEffect } from "react"
import { X, Plus, Edit, Trash2, Calendar, Tag } from "lucide-react"
import axios from "axios"
import { Sidebar } from "@/components/sidebar"

const API_BASE_URL = "http://localhost:8082/api/v1/tickets"

interface Ticket {
    _id: string
    subject: string
    description: string
    status: "open" | "in-progress" | "resolved" // Updated status types

    createdAt: string
    user_id: {
        _id: string
        name: string
        email: string
    }
}

const Tickets = () => {
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchTickets()
    }, [])

    const fetchTickets = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(`${API_BASE_URL}/get-ticketes`)
            setTickets(response.data.result || [])
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

    const handleStatusChange = async (
        id: string,
        newStatus: Ticket["status"],
    ) => {
        try {
            await axios.put(`${API_BASE_URL}/update-ticket/${id}`, {
                status: newStatus,
            })
            // Optimistic update
            setTickets((prevTickets) =>
                prevTickets.map((ticket) =>
                    ticket._id === id
                        ? { ...ticket, status: newStatus }
                        : ticket,
                ),
            )
        } catch (err) {
            setError(
                axios.isAxiosError(err)
                    ? err.response?.data?.message || "Failed to update status"
                    : "Failed to update status",
            )
            // Revert if error
            fetchTickets()
        }
    }
    const getStatusColor = (status: string) => {
        switch (status) {
            case "open":
                return "bg-blue-100 text-blue-800"
            case "in-progress":
                return "bg-yellow-100 text-yellow-800"
            case "resolved":
                return "bg-green-100 text-green-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }
    return (
        <Sidebar>
            <div className="min-h-screen bg-white text-black">
                <div className="mx-auto max-w-7xl p-6">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-black">
                            Support Tickets
                        </h1>
                        <p className="mt-1 text-gray-600">
                            Manage and track support requests
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
                            <p className="font-medium text-red-800">{error}</p>
                        </div>
                    )}

                    {/* Tickets Table */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-black"></div>
                            <span className="ml-3 text-gray-600">
                                Loading tickets...
                            </span>
                        </div>
                    ) : tickets.length === 0 ? (
                        <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-12 text-center">
                            <div className="mx-auto max-w-md">
                                <Tag className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                                <h3 className="mb-2 text-lg font-medium text-gray-900">
                                    No tickets found
                                </h3>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-lg border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Subject
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Created
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {tickets.map((ticket) => (
                                        <tr
                                            key={ticket._id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {ticket.subject}
                                                </div>
                                                <div className="line-clamp-2 text-sm text-gray-500">
                                                    {ticket.description}
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    {ticket.user_id?.name ||
                                                        "N/A"}
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="text-sm text-gray-500">
                                                    {ticket.user_id?.email ||
                                                        "N/A"}
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="text-sm text-gray-500">
                                                    {new Date(
                                                        ticket.createdAt,
                                                    ).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <select
                                                    value={ticket.status}
                                                    onChange={(e) =>
                                                        handleStatusChange(
                                                            ticket._id,
                                                            e.target
                                                                .value as Ticket["status"],
                                                        )
                                                    }
                                                    className={`rounded-md border px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-black ${getStatusColor(ticket.status)}`}
                                                >
                                                    <option value="open">
                                                        Open
                                                    </option>
                                                    <option value="in-progress">
                                                        In Progress
                                                    </option>
                                                    <option value="resolved">
                                                        Resolved
                                                    </option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </Sidebar>
    )
}

export default Tickets
