import React, { useState } from "react"
import { toast } from "react-hot-toast"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const Register: React.FC = () => {
    const [name, setName] = useState<string>("")

    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [phone, setPhone] = useState<string>("")

    const navigate = useNavigate()
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || !password || !name) {
            setError("Please fill in all fields")
            return
        }

        try {
            const response = await axios.post(
                `http://localhost:8082/api/v1/auth/register`,
                {
                    name,
                    email,
                    password,
                    phone,
                },
            )

            if (response.data.success) {
                toast.success("Register successful!")

                navigate("/login")
            } else {
                toast.error("Invalid credentials, please try again.")
            }
        } catch (err) {
            console.error("Error register in:", err)
            toast.error("An error occurred, please try again later.")
        }

        setError(null)
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg">
                <h2 className="text-center text-2xl font-bold text-gray-800">
                    Register
                </h2>

                {error && (
                    <div className="text-center text-red-500">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-gray-700">
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            autoComplete="name"
                            value={name}
                            style={{ color: "black" }}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-2 w-full rounded-md border border-gray-300 p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-gray-700">
                            Email Address
                        </label>

                        <input
                            id="email"
                            type="text"
                            autoComplete="email"
                            value={email}
                            style={{ color: "black" }}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-2 w-full rounded-md border border-gray-300 p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-gray-700"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            autoComplete="password"
                            value={password}
                            style={{ color: "black" }}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-2 w-full rounded-md border border-gray-300 p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-gray-700">
                            Phone
                        </label>

                        <input
                            id="phone"
                            type="phone"
                            value={phone}
                            style={{ color: "black" }}
                            onChange={(e) => setPhone(e.target.value)}
                            className="mt-2 w-full rounded-md border border-gray-300 p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="w-full rounded-md bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Register
                        </button>
                    </div>
                </form>

                <div className="mt-4 text-center text-sm text-gray-600">
                    have an account?{" "}
                    <a
                        href="/login"
                        className="text-blue-500 hover:text-blue-700"
                    >
                        Login
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Register
