"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Field, DataItem } from "./data-table"
import axios from "axios"
import { CloudinaryUpload } from "@/components/CloudinaryUpload"

interface EditModalProps {
    isOpen: boolean
    onClose: () => void
    fields: Field[]
    data: DataItem
    onRefresh?: () => void
}

export default function EditModal({
    isOpen,
    onClose,
    fields,
    data,
    onRefresh,
}: EditModalProps) {
    const [formData, setFormData] = useState<any>({})
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        const initialData: Record<string, any> = {}
        fields.forEach((field) => {
            initialData[field.name] =
                data[field.name] || (field.type === "image" ? [] : "")
        })
        setFormData(initialData)
    }, [data, fields])

    const handleChange = (fieldName: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            [fieldName]: value,
        }))

        if (errors[fieldName]) {
            setErrors((prev) => {
                const newErrors = { ...prev }
                delete newErrors[fieldName]
                return newErrors
            })
        }
    }

    const handleImageRemove = (fieldName: string, url: string) => {
        const updatedImages = formData[fieldName].filter(
            (imgUrl: string) => imgUrl !== url,
        )
        handleChange(fieldName, updatedImages)
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        fields.forEach((field) => {
            if (field.required && !formData[field.name]) {
                newErrors[field.name] = `${field.label} is required`
            }

            if (
                field.required &&
                field.type === "image" &&
                formData[field.name]?.length === 0
            ) {
                newErrors[field.name] = `${field.label} is required`
            }

            if (field.type === "email" && formData[field.name]) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                if (!emailRegex.test(formData[field.name])) {
                    newErrors[field.name] = "Please enter a valid email address"
                }
            }

            if (field.type === "number" && formData[field.name]) {
                if (isNaN(Number(formData[field.name]))) {
                    newErrors[field.name] = "Please enter a valid number"
                }
            }
        })

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (validateForm()) {
            const updatedData = {
                ...formData,
            }
            const response = await axios.put(
                `http://localhost:8082/api/v1/newsfeed/update/${data._id}`,
                updatedData,
            )
            if (response.data.success) {
                onClose()
                if (onRefresh) onRefresh()
            }
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                        Edit Record
                    </h3>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                        ❌
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {fields.map((field) => (
                            <div key={field.name} className="space-y-1">
                                <label
                                    htmlFor={field.name}
                                    style={{ color: "black" }}
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    {field.label}{" "}
                                    {field.required && (
                                        <span className="text-red-500">*</span>
                                    )}
                                </label>

                                {field.type === "select" && field.options ? (
                                    <select
                                        id={field.name}
                                        name={field.name}
                                        style={{ color: "black" }}
                                        value={formData[field.name] || ""}
                                        onChange={(e) =>
                                            handleChange(
                                                field.name,
                                                e.target.value,
                                            )
                                        }
                                        className={`mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm ${
                                            errors[field.name]
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    >
                                        <option value="">
                                            Select {field.label}
                                        </option>
                                        {field.options.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                ) : field.type === "date" ? (
                                    <input
                                        type="date"
                                        id={field.name}
                                        name={field.name}
                                        style={{ color: "black" }}
                                        value={
                                            formData[field.name]
                                                ? new Date(formData[field.name])
                                                      .toISOString()
                                                      .split("T")[0]
                                                : ""
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                field.name,
                                                e.target.value,
                                            )
                                        }
                                        className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm ${
                                            errors[field.name]
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    />
                                ) : field.type === "textarea" ? (
                                    <textarea
                                        id={field.name}
                                        name={field.name}
                                        value={formData[field.name] || ""}
                                        onChange={(e) =>
                                            handleChange(
                                                field.name,
                                                e.target.value,
                                            )
                                        }
                                        rows={4}
                                        style={{ color: "black" }}
                                        className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm ${
                                            errors[field.name]
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    />
                                ) : field.type === "image" ? (
                                    <>
                                        <CloudinaryUpload
                                            onUploadSuccess={(urls) =>
                                                handleChange(field.name, urls)
                                            }
                                            multiple={true}
                                            existingImages={
                                                formData[field.name] || []
                                            }
                                            onImageRemove={(url) =>
                                                handleImageRemove(
                                                    field.name,
                                                    url,
                                                )
                                            }
                                        />
                                    </>
                                ) : (
                                    <input
                                        type={
                                            field.type === "number"
                                                ? "number"
                                                : field.type === "email"
                                                  ? "email"
                                                  : "text"
                                        }
                                        id={field.name}
                                        name={field.name}
                                        value={formData[field.name] || ""}
                                        style={{ color: "black" }}
                                        onChange={(e) =>
                                            handleChange(
                                                field.name,
                                                e.target.value,
                                            )
                                        }
                                        className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm ${
                                            errors[field.name]
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    />
                                )}

                                {errors[field.name] && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors[field.name]}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
