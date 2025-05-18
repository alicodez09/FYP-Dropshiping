import { useEffect, useState } from "react"
import DataTable, { type Field, type DataItem } from "./components/data-table"
import axios from "axios"
import { Sidebar } from "@/components/sidebar"

const newsFields: Field[] = [
    { name: "name", label: "Name", type: "text", required: true },
    {
        name: "description",
        label: "Description",
        type: "textarea",
        required: true,
    },
]

export default function createcategory() {
    const [newsData, setNewsData] = useState<DataItem[]>([])

    const getData = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8082/api/v1/category/get-category`,
            )
            setNewsData(response.data.category)
        } catch (error) {
            console.error("Error fetching newsfeed:", error)
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
                    Category Management
                </h1>

                <DataTable
                    modelName="Category"
                    fields={newsFields}
                    data={newsData}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                    onRefresh={handleRefresh} // 👈 pass refresh handler
                />
            </div>
        </Sidebar>
    )
}
