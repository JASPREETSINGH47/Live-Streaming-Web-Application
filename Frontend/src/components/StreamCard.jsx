const StreamCard = ({ stream }) => {
    return (
        <div className="text1 card border-0 mb-3" style={{ backgroundColor: 'transparent' }}>
            <div className="position-relative">
                <img
                    // src={`https://picsum.photos/320/180?random=${stream.id}`}
                    src={`http://localhost:8001/images/${stream.thumbnail}`}
                    className="card-img-top rounded"
                    alt={stream.title}
                />
                <div
                    className="position-absolute bottom-0 start-0 darkLight viewers-opacity px-2 py-1 rounded-end"
                    style={{ fontSize: '12px' }}
                >
                    {stream.viewers} viewers
                </div>
            </div>
            <div className="card-body p-0 pt-2">
                <div className="d-flex">
                    <div className="flex-shrink-0">
                        <img
                            src={`https://picsum.photos/40/40?random=${stream.id + 100}`}
                            className="rounded-circle"
                            width="40"
                            height="40"
                            alt={stream.streamer}
                        />
                    </div>
                    <div className="flex-grow-1 ms-2 overflow-hidden">
                        <h6 className="card-title mb-0 text-truncate" style={{ fontSize: '14px' }}>{stream.title}</h6>
                        <p className="card-text mb-0" style={{ color: 'var(--twitch-text-secondary)', fontSize: '13px' }}>
                            {stream.streamer}
                        </p>
                        <p className="card-text" style={{ color: 'var(--twitch-text-secondary)', fontSize: '13px' }}>
                            {stream.game}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StreamCard;