import { useEffect, useState } from "react"
import DataTable, { type Field, type DataItem } from "./components/data-table"
import axios from "axios"
import { Sidebar } from "@/components/sidebar"

const newsFields: Field[] = [
    { name: "category", label: "Category", type: "select", required: true },
    { name: "name", label: "Name", type: "text", required: true },
    { name: "price", label: "Price", type: "number", required: true },

    {
        name: "description",
        label: "Description",
        type: "textarea",
        required: true,
    },
    { name: "image", label: "Image", type: "image", required: true },
]

export default function CreateProduct() {
    const [newsData, setNewsData] = useState<DataItem[]>([])

    const getData = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8082/api/v1/product/get-product`,
            )
            const transformedData = response.data.products.map((item: any) => ({
                ...item,
                id: item._id,
                category: item.category?.name || "",
            }))
            setNewsData(transformedData)
        } catch (error) {
            console.error("Error fetching products:", error)
        }
    }

    useEffect(() => {
        getData()
    }, [])

    const handleRefresh = () => {
        getData()
    }

    const handleUpdate = (id: string, updatedData: any) => {
        setNewsData((prevData) =>
            prevData.map((item) => (item.id === id ? updatedData : item)),
        )
    }

    const handleDelete = (id: string) => {
        setNewsData((prevData) => prevData.filter((item) => item.id !== id))
    }

    return (
        <Sidebar>
            <div
                className="p-6"
                style={{ backgroundColor: "#fff", height: "100vh" }}
            >
                <h1 className="mb-6 text-2xl font-bold text-black">
                    Product Management
                </h1>

                <DataTable
                    modelName="Product"
                    fields={newsFields}
                    data={newsData}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                    onRefresh={handleRefresh}
                />
            </div>
        </Sidebar>
    )
}
