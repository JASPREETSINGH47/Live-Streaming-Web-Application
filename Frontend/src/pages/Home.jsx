import { Link } from 'react-router-dom';
import StreamCard from '../components/StreamCard';
import CategoryCard from '../components/CategoryCard';

const Home = () => {
    const featuredStreams = [
        { id: 1, title: 'VALORANT CHAMPIONS TOUR 2023', streamer: 'valorant', game: 'VALORANT', viewers: '124.5K' },
        { id: 2, title: 'League of Legends World Championship', streamer: 'riotgames', game: 'League of Legends', viewers: '98.2K' },
        { id: 3, title: 'Just chatting with viewers!', streamer: 'pokimane', game: 'Just Chatting', viewers: '32.7K' },
    ];

    const recommendedCategories = [
        { id: 1, name: 'Just Chatting', viewers: '302K', tags: ['IRL'] },
        { id: 2, name: 'League of Legends', viewers: '178K', tags: ['MOBA', 'Action'] },
        { id: 3, name: 'VALORANT', viewers: '152K', tags: ['FPS', 'Shooter'] },
    ];

    return (
        <div className="container-fluid p-0">
            {/* Hero Section */}
            <div
                className="hero-section position-relative mb-4 overflow-hidden"
                style={{
                    height: '400px',
                    borderRadius: '8px'  // Added rounded corners
                }}
            >
                {/* Background image from Unsplash (gaming themed) */}
                <img
                    src="https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Gaming background"
                    className="w-100 h-100 object-cover"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        objectFit: 'cover'
                    }}
                />

                {/* Gradient overlay (darker at bottom) */}
                <div
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)'
                    }}
                ></div>

                {/* Content */}
                <div
                    className="position-absolute bottom-0 start-0 p-4 text-white"
                    style={{
                        maxWidth: '800px',
                        zIndex: 2
                    }}
                >
                    <h1 className="display-5 fw-bold mb-3">Welcome to Hell Cast</h1>
                    <p className="lead mb-4" style={{ fontSize: '1.25rem' }}>
                        Watch your favorite streamers and discover amazing gaming content from around the world
                    </p>
                    <div className="d-flex gap-3">
                        <Link
                            to="/following"
                            className="btn btn-purple px-4 py-2 fw-bold"
                            style={{
                                backgroundColor: 'var(--twitch-purple)',
                                border: 'none',
                                fontSize: '1rem'
                            }}
                        >
                            Following
                        </Link>
                        <Link
                            to="/browse"
                            className="btn btn-outline-light px-4 py-2 fw-bold"
                            style={{
                                borderWidth: '2px',
                                fontSize: '1rem'
                            }}
                        >
                            Browse Categories
                        </Link>
                        <Link
                            to="/liveStream"
                            className="btn btn-outline-light px-4 py-2 fw-bold"
                            style={{
                                borderWidth: '2px',
                                fontSize: '1rem'
                            }}
                        >
                            🔴Live
                        </Link>
                    </div>
                </div>
            </div>

            <div className="px-4">
                {/* Featured Live Streams */}
                <div className="mb-5">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2 className="mb-0">Featured Live Streams</h2>
                        <Link to="/browse" className="text-purple text-decoration-none">
                            See all →
                        </Link>
                    </div>
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        {featuredStreams.map(stream => (
                            <div className="col" key={stream.id}>
                                <StreamCard stream={stream} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recommended Categories */}
                <div className="mb-5">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2 className="mb-0">Recommended Categories</h2>
                        <Link to="/browse" className="text-purple text-decoration-none">
                            See all →
                        </Link>
                    </div>
                    <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 row-cols-xl-6 g-4">
                        {recommendedCategories.map(category => (
                            <div className="col" key={category.id}>
                                <CategoryCard category={category} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center py-5">
                    <h3 className="mb-3">Ready to explore more?</h3>
                    <Link to="/browse" className="btn btn-purple btn-lg px-5">
                        Browse All Categories
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;