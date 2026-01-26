export default function HomeSimple() {
    return (
        <div className="min-h-screen bg-carbon-950 text-white flex items-center justify-center p-8">
            <div className="text-center max-w-2xl">
                <h1 className="text-6xl font-black italic mb-6 text-monza-red">MONZA</h1>
                <p className="text-2xl mb-8">Racing Parts - Test Page</p>
                <p className="text-gray-400 mb-4">If you see this, the basic routing is working!</p>
                <div className="flex gap-4 justify-center">
                    <a href="/catalog" className="bg-monza-red px-6 py-3 rounded-lg font-bold hover:bg-red-700">
                        Go to Catalog
                    </a>
                    <a href="/login" className="bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-200">
                        Login
                    </a>
                </div>
            </div>
        </div>
    );
}
