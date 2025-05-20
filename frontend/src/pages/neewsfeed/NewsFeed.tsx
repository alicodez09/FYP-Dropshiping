import axios from "axios"
import { useEffect, useState } from "react"

interface NewsFeedItem {
    _id: string
    name: string
    description: string
    date: string
    image: string[]
}

interface GroupedFeed {
    date: string
    entries: NewsFeedItem[]
}

interface MediaItem {
    type: "image" | "video"
    url: string
}

const NewsFeed = () => {
    const [feeds, setFeeds] = useState<GroupedFeed[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([])
    const [showMediaModal, setShowMediaModal] = useState<boolean>(false)
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0)

    useEffect(() => {
        const getData = async () => {
            try {
                setLoading(true)
                const response = await axios.get(
                    `http://localhost:8082/api/v1/newsfeed/get`,
                )
                const data = response.data.data
                if (Array.isArray(data)) {
                    setFeeds(groupFeedsByDate(data))
                } else {
                    setError("Unexpected data format from API")
                }
            } catch (err) {
                setError("Failed to fetch news feed data")
                console.error("Error fetching news feed:", err)
            } finally {
                setLoading(false)
            }
        }
        getData()
    }, [])

    const groupFeedsByDate = (feeds: NewsFeedItem[]): GroupedFeed[] => {
        const grouped: { [key: string]: GroupedFeed } = {}
        feeds.forEach((feed) => {
            const date = feed.date
            if (!grouped[date]) {
                grouped[date] = {
                    date: date,
                    entries: [],
                }
            }
            grouped[date].entries.push(feed)
        })
        return Object.values(grouped).sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime()
        })
    }

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const handleMediaClick = (media: MediaItem[], index: number): void => {
        setSelectedMedia(media)
        setShowMediaModal(true)
        setCurrentMediaIndex(index)
    }

    const extractYouTubeId = (url: string): string | null => {
        const regExp =
            /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
        const match = url.match(regExp)
        return match && match[2].length === 11 ? match[2] : null
    }

    const renderMediaGallery = (item: NewsFeedItem) => {
        const allMedia: MediaItem[] = []

        // Add images
        if (item.image && item.image.length > 0) {
            item.image.forEach((imageUrl) => {
                allMedia.push({ type: "image", url: imageUrl })
            })
        }

        if (allMedia.length === 0) return null

        // Adjust the grid height based on number of images
        const gridHeight = allMedia.length <= 2 ? "25rem" : "20rem"
        const singleItemHeight = allMedia.length === 1 ? "25rem" : "100%"

        // Single media item
        if (allMedia.length === 1) {
            const media = allMedia[0]
            return (
                <div className="mt-3 w-full" style={{ height: gridHeight }}>
                    <div
                        className="h-full w-full cursor-pointer overflow-hidden bg-gray-100"
                        onClick={() => handleMediaClick(allMedia, 0)}
                    >
                        <img
                            src={media.url || "/placeholder.svg"}
                            alt="Post content"
                            className="h-full w-full object-contain"
                        />
                    </div>
                </div>
            )
        }

        // Two media items
        if (allMedia.length === 2) {
            return (
                <div className="mt-3 w-full" style={{ height: gridHeight }}>
                    <div className="grid h-full w-full grid-cols-2 gap-1">
                        {allMedia.map((media, idx) => (
                            <div
                                key={idx}
                                className="relative h-full cursor-pointer overflow-hidden bg-gray-100"
                                onClick={() => handleMediaClick(allMedia, idx)}
                            >
                                <img
                                    src={media.url || "/placeholder.svg"}
                                    alt={`Post content ${idx + 1}`}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )
        }

        // Multiple media items (3 or more)
        const visibleMedia = allMedia.slice(0, 4)
        const remainingCount = allMedia.length - 4

        return (
            <div className="mt-3 w-full" style={{ height: gridHeight }}>
                <div className="grid h-full w-full grid-cols-2 gap-1">
                    {visibleMedia.map((media, idx) => (
                        <div
                            key={idx}
                            className={`relative ${allMedia.length === 3 && idx === 2 ? "col-span-2" : ""} h-full cursor-pointer overflow-hidden bg-gray-100`}
                            onClick={() => handleMediaClick(allMedia, idx)}
                        >
                            <img
                                src={media.url || "/placeholder.svg"}
                                alt={`Post content ${idx + 1}`}
                                className="h-full w-full object-cover"
                            />
                            {idx === 3 && remainingCount > 0 && (
                                <div
                                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-lg font-bold text-white"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleMediaClick(allMedia, idx)
                                    }}
                                >
                                    +{remainingCount}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-xl font-semibold text-gray-700">
                    Loading news feed...
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-xl font-semibold text-red-600">
                    {error}
                </div>
            </div>
        )
    }

    return (
        <div className="relative bg-white">
            <div className="mx-72 p-4" style={{ minHeight: "100vh" }}>
                <h1 className="mb-4 text-4xl font-bold text-gray-800">
                    News Feed
                </h1>

                {/* Feed Items */}
                <div className="space-y-6">
                    {feeds.length === 0 && !loading && (
                        <div className="text-center text-lg text-gray-600">
                            No news feed items available
                        </div>
                    )}
                    {feeds.map((feedGroup, groupIdx) => (
                        <div key={groupIdx} className="mb-8">
                            <h2 className="mb-4 text-lg font-semibold text-gray-600">
                                {formatDate(feedGroup.date)}
                            </h2>

                            <div className="my-10 space-y-10">
                                {feedGroup.entries.map((item) => (
                                    <div
                                        key={item._id}
                                        className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md"
                                    >
                                        {/* Post Content */}
                                        <div className="px-4 pb-3">
                                            <h3 className="mb-2 mt-5 text-3xl font-semibold text-gray-800">
                                                {item.name}
                                            </h3>
                                            <div
                                                className="prose mb-3 max-w-none text-gray-700"
                                                dangerouslySetInnerHTML={{
                                                    __html: item.description,
                                                }}
                                            />

                                            {/* Media Gallery */}
                                            {renderMediaGallery(item)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Media Modal */}
                {showMediaModal && (
                    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black p-4 md:p-6">
                        {/* Close Button */}
                        <button
                            className="absolute right-4 top-4 z-50 text-3xl text-white transition-colors hover:text-gray-300 md:right-5 md:top-5 md:text-4xl"
                            onClick={() => setShowMediaModal(false)}
                        >
                            &times;
                        </button>

                        {/* Media Wrapper */}
                        <div className="relative flex h-[80vh] w-full max-w-5xl items-center justify-center sm:h-[75vh] md:h-[85vh]">
                            {selectedMedia.map((media, idx) => (
                                <div
                                    key={idx}
                                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
                                        currentMediaIndex === idx
                                            ? "opacity-100"
                                            : "pointer-events-none opacity-0"
                                    }`}
                                >
                                    {media.type === "image" ? (
                                        <img
                                            src={
                                                media.url || "/placeholder.svg"
                                            }
                                            alt={`Post content ${idx + 1}`}
                                            className="max-h-full max-w-full rounded-lg object-contain shadow-lg"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="h-full w-full">
                                            {extractYouTubeId(media.url) && (
                                                <iframe
                                                    width="100%"
                                                    height="100%"
                                                    src={`https://www.youtube.com/embed/${extractYouTubeId(media.url)}?autoplay=1&rel=0`}
                                                    title="YouTube video player"
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    className="rounded-lg shadow-lg"
                                                ></iframe>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Navigation Controls */}
                        {selectedMedia.length > 1 && (
                            <>
                                <div className="absolute inset-x-0 top-1/2 flex items-center justify-between px-4">
                                    <button
                                        onClick={() =>
                                            setCurrentMediaIndex((prev) =>
                                                Math.max(0, prev - 1),
                                            )
                                        }
                                        disabled={currentMediaIndex === 0}
                                        className="rounded-full bg-gray-700 bg-opacity-70 p-3 text-white transition-all hover:bg-gray-600 disabled:opacity-30"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-8 w-8 md:h-10 md:w-10"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 19l-7-7 7-7"
                                            />
                                        </svg>
                                    </button>

                                    <button
                                        onClick={() =>
                                            setCurrentMediaIndex((prev) =>
                                                Math.min(
                                                    selectedMedia.length - 1,
                                                    prev + 1,
                                                ),
                                            )
                                        }
                                        disabled={
                                            currentMediaIndex ===
                                            selectedMedia.length - 1
                                        }
                                        className="rounded-full bg-gray-700 bg-opacity-70 p-3 text-white transition-all hover:bg-gray-600 disabled:opacity-30"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-8 w-8 md:h-10 md:w-10"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </button>
                                </div>

                                {/* Media Counter */}
                                <div className="absolute bottom-20 text-lg text-gray-300 md:bottom-16">
                                    {currentMediaIndex + 1} /{" "}
                                    {selectedMedia.length}
                                </div>

                                {/* Thumbnail Preview */}
                                <div className="absolute bottom-4 left-1/2 flex max-w-full -translate-x-1/2 transform space-x-2 overflow-x-auto rounded-lg bg-black bg-opacity-50 p-2 md:bottom-8">
                                    {selectedMedia.map((media, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() =>
                                                setCurrentMediaIndex(idx)
                                            }
                                            className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-transform duration-300 ${
                                                currentMediaIndex === idx
                                                    ? "scale-105 border-blue-500"
                                                    : "border-transparent"
                                            }`}
                                        >
                                            {media.type === "image" ? (
                                                <img
                                                    src={
                                                        media.url ||
                                                        "/placeholder.svg"
                                                    }
                                                    alt={`Thumbnail ${idx + 1}`}
                                                    className="h-full w-full rounded-md object-cover shadow-md"
                                                />
                                            ) : (
                                                <div className="relative h-full w-full">
                                                    {extractYouTubeId(
                                                        media.url,
                                                    ) && (
                                                        <img
                                                            src={`https://img.youtube.com/vi/${extractYouTubeId(media.url)}/hqdefault.jpg`}
                                                            alt="Video thumbnail"
                                                            className="h-full w-full object-cover"
                                                        />
                                                    )}
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <svg
                                                            className="h-6 w-6 text-white"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default NewsFeed
