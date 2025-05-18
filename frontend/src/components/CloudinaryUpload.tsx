import type React from "react"
import { useState, useEffect } from "react"
import { X, Upload, Loader2 } from "lucide-react"

interface CloudinaryUploadProps {
    onUploadSuccess: (urls: string[]) => void
    multiple?: boolean
    existingImages?: string[]
    onImageRemove?: (url: string) => void
}

export const CloudinaryUpload: React.FC<CloudinaryUploadProps> = ({
    onUploadSuccess,
    multiple = false,
    existingImages = [],
    onImageRemove,
}) => {
    const [newImageUrls, setNewImageUrls] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Track if this is the first render to avoid unnecessary callbacks
    const [isInitialized, setIsInitialized] = useState(false)

    useEffect(() => {
        // Only set initialized after the first render
        setIsInitialized(true)
    }, [])

    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const files = event.target.files
        if (!files || files.length === 0) return

        setLoading(true)
        setError(null)

        try {
            const uploadPromises = Array.from(files).map((file) => {
                const data = new FormData()
                data.append("file", file)
                data.append("upload_preset", "Sync_Lab_Fyp")
                data.append("cloud_name", "dopn0fv6u")

                return fetch(
                    "https://api.cloudinary.com/v1_1/dopn0fv6u/image/upload",
                    {
                        method: "POST",
                        body: data,
                    },
                )
            })

            const responses = await Promise.all(uploadPromises)
            const results = await Promise.all(
                responses.map((res) => res.json()),
            )

            const uploadedUrls = results.map((result) => result.secure_url)

            const updatedNewUrls = [...newImageUrls, ...uploadedUrls]
            setNewImageUrls(updatedNewUrls)

            onUploadSuccess([...existingImages, ...updatedNewUrls])
        } catch (err) {
            setError("Failed to upload one or more images")
            console.error(err)
        } finally {
            setLoading(false)

            if (event.target) {
                event.target.value = ""
            }
        }
    }

    const removeImage = (url: string) => {
        if (existingImages.includes(url)) {
            onImageRemove?.(url)
        } else {
            const updatedUrls = newImageUrls.filter((imgUrl) => imgUrl !== url)
            setNewImageUrls(updatedUrls)
            onUploadSuccess([...existingImages, ...updatedUrls])
        }
    }

    const allImages = [...existingImages, ...newImageUrls]

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-3">
                <label
                    className={`relative flex h-9 cursor-pointer items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 ${loading ? "cursor-not-allowed opacity-70" : ""}`}
                >
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                    ) : (
                        <Upload className="h-4 w-4 text-gray-500" />
                    )}
                    <span>{multiple ? "Upload Images" : "Upload Image"}</span>
                    <input
                        type="file"
                        onChange={handleFileUpload}
                        accept="image/*"
                        disabled={loading}
                        className="sr-only"
                        multiple={multiple}
                    />
                </label>
                {loading && (
                    <span className="text-sm text-gray-500">Uploading...</span>
                )}
            </div>

            {error && (
                <p className="text-sm font-medium text-red-500">{error}</p>
            )}

            {allImages.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {allImages.map((url, index) => (
                        <div
                            key={`${url}-${index}`}
                            className="group relative aspect-square overflow-hidden rounded-md border border-gray-200 bg-gray-50"
                        >
                            <img
                                src={url || "/placeholder.svg"}
                                alt={`Image ${index + 1}`}
                                className="h-full w-full object-cover transition-opacity group-hover:opacity-75"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(url)}
                                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 p-1 text-white opacity-0 transition-all hover:bg-red-600 group-hover:opacity-100"
                                aria-label="Remove image"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
