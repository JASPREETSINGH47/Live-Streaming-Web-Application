import { useState, useEffect } from 'react';
import axios from 'axios';

const Following = () => {
  const [liveStreams, setLiveStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStream, setSelectedStream] = useState(null);

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const res = await axios.get('http://localhost:8001/users/get_stream_content');

        const mappedStreams = (res.data || []).map(item => ({
          id: item.id,
          title: item.title,
          streamer: item.description,
          game: item.category,
          viewers: item.views,
          thumbnail: item.thumbnail,
          duration: item.duration,
          stream_video: item.stream_video,
        }));

        setLiveStreams(mappedStreams);
      } catch (error) {
        console.error('Failed to fetch live streams:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStreams();
  }, []);

  const defaultStreams = [
    { id: 1, title: 'VALORANT CHAMPIONS TOUR 2023', streamer: 'valorant', game: 'VALORANT', viewers: '124.5K' },
    { id: 2, title: 'League of Legends World Championship', streamer: 'riotgames', game: 'League of Legends', viewers: '98.2K' },
    { id: 3, title: 'Just chatting with viewers!', streamer: 'pokimane', game: 'Just Chatting', viewers: '32.7K' },
    { id: 4, title: 'Speedrunning Mario 64', streamer: 'simply', game: 'Super Mario 64', viewers: '18.4K' },
    { id: 5, title: 'Minecraft Hardcore Day 100!', streamer: 'dream', game: 'Minecraft', viewers: '45.1K' },
    { id: 6, title: 'GTA RP with friends', streamer: 'xqc', game: 'Grand Theft Auto V', viewers: '78.3K' },
    { id: 7, title: 'Apex Legends Ranked', streamer: 'aceu', game: 'Apex Legends', viewers: '22.3K' },
    { id: 8, title: 'Counter-Strike 2 Tournament', streamer: 'esl_csgo', game: 'Counter-Strike 2', viewers: '56.8K' },
  ];

  const streamsToUse = liveStreams.length > 0 ? liveStreams : defaultStreams;

  const handleStreamClick = (stream) => {
    setSelectedStream(stream);
  };

  const handleBack = () => {
    setSelectedStream(null);
  };

  if (selectedStream) {
    return (
      <div className="container py-4">
        <button className="btn btn-sm btn-outline-secondary mb-3" onClick={handleBack}>← Back to Streams</button>
        <h2>{selectedStream.title}</h2>
        <p className="text-muted">{selectedStream.streamer} · {selectedStream.game}</p>
        <video
          width="100%"
          height="auto"
          controls
          src={`http://localhost:8001/images/${selectedStream.stream_video}`}
        >
          Your browser does not support the video tag.
        </video>
        <div className="mt-3">
          <strong>Views:</strong> {selectedStream.viewers}<br />
          <strong>Duration:</strong> {selectedStream.duration}
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Following</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-outline-secondary">All</button>
          <button className="btn btn-sm btn-outline-secondary">Live</button>
          <button className="btn btn-sm btn-outline-secondary">Offline</button>
        </div>
      </div>

      {/* Live Section */}
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">Live channels you follow</h4>
          <span className="badge bg-danger">LIVE</span>
        </div>

        {loading ? (
          <div className="text-center py-5">Loading...</div>
        ) : streamsToUse.length > 0 ? (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
            {streamsToUse.slice(0, 6).map(stream => (
              <div className="col" key={stream.id}>
                <div className="card h-100">
                  <img
                    src={`http://localhost:8001/images/${stream.thumbnail}`}
                    className="card-img-top"
                    alt={stream.title}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{stream.title}</h5>
                    <p className="card-text">{stream.streamer}</p>
                    <p className="text-muted">Live · {stream.viewers}</p>
                    <button className="btn btn-sm btn-primary mt-2" onClick={() => handleStreamClick(stream)}>
                      ▶ Play Stream
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5 bg-dark bg-opacity-10 rounded">
            <h5>No live channels</h5>
            <p className="text-muted">The channels you follow aren't live right now</p>
          </div>
        )}
      </div>

      {/* Recommended Section */}
      <div className="mb-5">
        <h4 className="mb-3">Recommended channels</h4>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
          {streamsToUse.slice(6).map(stream => (
            <div className="col" key={stream.id}>
              <div className="card h-100">
                <img
                  src={`http://localhost:8001/images/${stream.thumbnail}`}
                  className="card-img-top"
                  alt={stream.title}
                />
                <div className="card-body">
                  <h5 className="card-title">{stream.title}</h5>
                  <p className="card-text">{stream.streamer}</p>
                  <p className="text-muted">Live · {stream.viewers}</p>
                  <button className="btn btn-sm btn-primary mt-2" onClick={() => handleStreamClick(stream)}>
                    ▶ Play Stream
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="mb-4">
        <h4 className="mb-3">Categories you might like</h4>
        <div className="d-flex flex-wrap gap-3">
          <button className="btn btn-sm btn-outline-secondary">Just Chatting</button>
          <button className="btn btn-sm btn-outline-secondary">VALORANT</button>
          <button className="btn btn-sm btn-outline-secondary">League of Legends</button>
          <button className="btn btn-sm btn-outline-secondary">Minecraft</button>
          <button className="btn btn-sm btn-outline-secondary">GTA V</button>
        </div>
      </div>

      {/* Offline Section */}
      <div>
        <h4 className="mb-3">Recently offline</h4>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
          {streamsToUse.slice(2, 6).map(stream => (
            <div className="col" key={`offline-${stream.id}`}>
              <div className="card h-100">
                <img
                  src={`http://localhost:8001/images/${stream.thumbnail}`}
                  className="card-img-top opacity-50"
                  alt={stream.title}
                />
                <div className="card-body">
                  <h5 className="card-title">{stream.title}</h5>
                  <p className="card-text">{stream.streamer}</p>
                  <p className="text-muted">Offline · {stream.viewers}</p>
                  <button className="btn btn-sm btn-primary mt-2" onClick={() => handleStreamClick(stream)}>
                    ▶ Play Stream
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Following;
