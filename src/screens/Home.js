import React from 'react';

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-green-600 text-white p-6">
                <div className="container mx-auto">
                    <h1 className="text-3xl font-bold">FarmIt</h1>
                    <p className="mt-2">Connecting Farmers & Community</p>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto p-6">
                <section className="mt-6">
                    <h2 className="text-2xl font-semibold mb-4">Welcome to FarmIt!</h2>
                    <p className="text-gray-700 mb-6">
                        Discover a community of farmers and resources to help you grow your business. 
                        Join us today and be part of a thriving agricultural network!
                    </p>

                    <h3 className="text-xl font-semibold mb-4">Featured Farms</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Example Farm Card */}
                        <div className="bg-white shadow-md rounded-lg p-4">
                            <h4 className="font-bold text-lg">Sunny Acres</h4>
                            <p className="text-gray-600">Organic Vegetables</p>
                            <p className="text-gray-500">Location: Springfield</p>
                        </div>

                        <div className="bg-white shadow-md rounded-lg p-4">
                            <h4 className="font-bold text-lg">Green Valley</h4>
                            <p className="text-gray-600">Dairy Farm</p>
                            <p className="text-gray-500">Location: Riverdale</p>
                        </div>

                        <div className="bg-white shadow-md rounded-lg p-4">
                            <h4 className="font-bold text-lg">Harvest Moon</h4>
                            <p className="text-gray-600">Fruit Orchard</p>
                            <p className="text-gray-500">Location: Hilltop</p>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white p-4">
                <div className="container mx-auto text-center">
                    <p>&copy; 2025 FarmIt. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;