import { useEffect, useState } from "react"
import DataTable, { type Field, type DataItem } from "./components/data-table"
import axios from "axios"
import { Sidebar } from "@/components/sidebar"

const newsFields: Field[] = [
    {
        name: "type",
        label: "Type",
        type: "select",
        required: true,
        options: [
            "Graphic Designer",
            "Web Developer",
            "Digital Marketing",
            "Freelance",
        ], // Add your options here
    },
    { name: "name", label: "Name", type: "text", required: true },
    {
        name: "description",
        label: "Description",
        type: "textarea",
        required: true,
    },
    { name: "email", label: "Email", type: "text", required: true },
    { name: "phone", label: "Phone", type: "text", required: true },
    { name: "linkedin", label: "linkedin", type: "text", required: true },
]

export default function CreateProduct() {
    const [newsData, setNewsData] = useState<DataItem[]>([])

    const getData = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8082/api/v1/job/get`,
            )

            setNewsData(response.data.jobs)
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
                    Job Management
                </h1>

                <DataTable
                    modelName="Jobs"
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
