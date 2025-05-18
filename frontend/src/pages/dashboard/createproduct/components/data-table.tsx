import { useState } from "react"
import { FaTrash } from "react-icons/fa"
import EditModal from "./edit-model"
import { HiPencil } from "react-icons/hi2"
import CreateModal from "./create-model"
import axios from "axios"

export type FieldType =
    | "text"
    | "textarea"
    | "number"
    | "date"
    | "email"
    | "select"
    | "image"

export interface Field {
    name: string
    label: string
    type: FieldType
    required?: boolean
    options?: string[]
}

export interface DataItem {
    id: string
    _id?: string
    [key: string]: any
}

interface DataTableProps {
    modelName: string
    fields: Field[]
    data: DataItem[]
    onUpdate: (id: string, updatedData: any) => void
    onCreate?: (newData: any) => void
    onDelete?: (id: string) => void
    onRefresh?: () => void
}

export default function DataTable({
    modelName,
    fields,
    data,
    onDelete,
    onRefresh,
}: DataTableProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [currentItem, setCurrentItem] = useState<DataItem | null>(null)

    const handleEdit = (item: DataItem) => {
        setCurrentItem(item)
        setIsEditModalOpen(true)
    }

    const handleCreate = () => {
        const emptyItem: DataItem = { id: "" }
        fields.forEach((field) => {
            emptyItem[field.name] = ""
        })
        setCurrentItem(emptyItem)
        setIsCreateModalOpen(true)
    }

    const handleDelete = async (id: string) => {
        try {
            const response = await axios.delete(
                `http://localhost:8082/api/v1/product/delete-product/${id}`,
            )
            if (response.data.success && onRefresh) {
                onRefresh()
            }
        } catch (error) {
            console.error("Error deleting item:", error)
        }
    }

    const getDisplayValue = (value: any, fieldType: FieldType) => {
        if (value === null || value === undefined) return ""

        if (fieldType === "date" && value) {
            return new Date(value).toLocaleDateString()
        }

        if (fieldType === "textarea" && value) {
            return value.length > 80 ? value.slice(0, 80) + "..." : value
        }

        if (typeof value === "object") {
            return value.name || JSON.stringify(value)
        }

        return value
    }

    return (
        <div className="w-full overflow-hidden rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between bg-gray-50 px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-800">
                    {modelName}
                </h2>
                <button
                    onClick={handleCreate}
                    className="rounded-lg bg-blue-600 px-4 py-1 text-white hover:bg-blue-700 hover:shadow-lg"
                >
                    Create
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            {fields
                                .filter((field) => field.name !== "image")
                                .map((field) => (
                                    <th
                                        key={field.name}
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700"
                                    >
                                        {field.label}
                                    </th>
                                ))}

                            <th
                                scope="col"
                                className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-700"
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {data?.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={fields.length + 1}
                                    className="px-6 py-4 text-center text-sm text-gray-500"
                                >
                                    No data available
                                </td>
                            </tr>
                        ) : (
                            data?.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    {fields
                                        .filter(
                                            (field) => field.name !== "image",
                                        )
                                        .map((field) => (
                                            <td
                                                key={`${item.id}-${field.name}`}
                                                className="whitespace-nowrap px-6 py-4 text-sm text-gray-700"
                                            >
                                                {getDisplayValue(
                                                    item[field.name],
                                                    field.type,
                                                )}
                                            </td>
                                        ))}

                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-2">
                                            {/* <button
                                                onClick={() => handleEdit(item)}
                                                className="rounded p-1 text-blue-600 hover:bg-blue-100"
                                            >
                                                <HiPencil />
                                            </button> */}
                                            <button
                                                onClick={() =>
                                                    handleDelete(item.id)
                                                }
                                                className="rounded p-1 text-red-600 hover:bg-red-100"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {isEditModalOpen && currentItem && (
                <EditModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    fields={fields}
                    data={currentItem}
                    onRefresh={onRefresh}
                />
            )}

            {isCreateModalOpen && currentItem && (
                <CreateModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    fields={fields}
                    data={currentItem}
                    onRefresh={onRefresh}
                />
            )}
        </div>
    )
}
