import React, { useState } from "react"
import { toast } from "react-hot-toast"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>("")

    const [password, setPassword] = useState<string>("")
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email || !password) {
            setError("Please fill in all fields")
            return
        }

        try {
            const response = await axios.post(
                `http://localhost:8082/api/v1/auth/login`,
                {
                    email,
                    password,
                },
            )

            if (response.data.success) {
                toast.success("Login successful!")

                localStorage.setItem("zain_auth", JSON.stringify(response.data))

                window.location.href = "/"
            } else {
                toast.error("Invalid credentials, please try again.")
            }
        } catch (err) {
            console.error("Error logging in:", err)
            toast.error("An error occurred, please try again later.")
        }

        // Reset error after submission
        setError(null)
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg">
                <h2 className="text-center text-2xl font-bold text-gray-800">
                    Login
                </h2>

                {error && (
                    <div className="text-center text-red-500">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-gray-700">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ color: "black" }}
                            className="mt-2 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ color: "black" }}
                            className="mt-2 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="w-full rounded-md bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Log In
                        </button>
                    </div>
                </form>

                <div className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <a
                        href="/register"
                        className="text-blue-500 hover:text-blue-700"
                    >
                        Register
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Login
