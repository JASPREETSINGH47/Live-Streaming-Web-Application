import StreamCard from '../components/StreamCard';
import CategoryCard from '../components/CategoryCard';

const Browse = () => {

    const liveStreams = [
        { id: 1, title: 'VALORANT CHAMPIONS TOUR 2023', streamer: 'valorant', game: 'VALORANT', viewers: '124.5K' },
        { id: 2, title: 'League of Legends World Championship', streamer: 'riotgames', game: 'League of Legends', viewers: '98.2K' },
        { id: 3, title: 'Just chatting with viewers!', streamer: 'pokimane', game: 'Just Chatting', viewers: '32.7K' },
        { id: 4, title: 'Speedrunning Mario 64', streamer: 'simply', game: 'Super Mario 64', viewers: '18.4K' },
        { id: 5, title: 'Minecraft Hardcore Day 100!', streamer: 'dream', game: 'Minecraft', viewers: '45.1K' },
        { id: 6, title: 'GTA RP with friends', streamer: 'xqc', game: 'Grand Theft Auto V', viewers: '78.3K' },
    ];

    const categories = [
        { id: 1, name: 'Just Chatting', viewers: '302K', tags: ['IRL'] },
        { id: 2, name: 'League of Legends', viewers: '178K', tags: ['MOBA', 'Action'] },
        { id: 3, name: 'VALORANT', viewers: '152K', tags: ['FPS', 'Shooter'] },
        { id: 4, name: 'Minecraft', viewers: '98K', tags: ['Adventure', 'Open World'] },
        { id: 5, name: 'Grand Theft Auto V', viewers: '87K', tags: ['Action', 'Adventure'] },
        { id: 6, name: 'Fortnite', viewers: '76K', tags: ['Battle Royale', 'Shooter'] },
    ];

    return (
        <div className="container-fluid p-4">
            <h4 className="mb-3">Categories you might like</h4>
            <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 row-cols-xl-6 g-4">
                {categories.map(category => (
                    <div className="col" key={category.id}>
                        <CategoryCard category={category} />
                    </div>
                ))}
            </div>

            <h4 className="mb-3 mt-5">Live channels we think you'll like</h4>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
                {liveStreams.map(stream => (
                    <div className="col" key={stream.id}>
                        <StreamCard stream={stream} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Browse;