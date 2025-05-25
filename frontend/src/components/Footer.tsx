const Footer = () => {
    return (
        <>
            <footer className="mt-36 bg-gray-900 px-4 py-12 text-white">
                <div className="">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="mb-4 text-xl font-bold">DropShip</h3>
                            <p className="mb-4 text-gray-400">
                                Your one-stop shop for amazing products at
                                unbeatable prices.
                            </p>
                        </div>

                        <div>
                            <h3 className="mb-4 text-lg font-semibold">
                                Contact
                            </h3>
                            <address className="not-italic text-gray-400">
                                <p>123 Commerce St.</p>
                                <p>GC University Fsd</p>
                                <p className="mt-2">support@shopdrop.com</p>
                                <p>Zain Ali:+92 306 0268594</p>
                                <p>Ali Anas:+92 305 1351769</p>
                            </address>
                        </div>
                    </div>
                </div>

                <div className="mx-auto mt-8 max-w-7xl border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
                    <p>
                        &copy; {new Date().getFullYear()} ShopDrop. All rights
                        reserved.
                    </p>
                </div>
            </footer>
        </>
    )
}

export default Footer
