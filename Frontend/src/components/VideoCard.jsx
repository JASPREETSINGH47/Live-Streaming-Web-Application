import { Link } from 'react-router-dom'

const VideoCard = ({ video }) => {
  return (
    <div className="card bg-secondary border-0 h-100">
      <Link to={`/video/${video.id}`}>
        <div className="position-relative">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="card-img-top"
            style={{ height: '180px', objectFit: 'cover' }}
          />
          <span className="position-absolute bottom-0 end-0 m-2 bg-dark bg-opacity-75 text-white px-2 py-1 small rounded">
            {video.duration}
          </span>
        </div>
      </Link>
      <div className="card-body text-white d-flex flex-column">
        <Link to={`/video/${video.id}`} className="text-decoration-none text-white">
          <h5 className="card-title mb-2">{video.title}</h5>
        </Link>
        <p className="card-text text-light small flex-grow-1">
          {video.description}
        </p>
        <div className="d-flex justify-content-between text-muted small mt-2">
          <span>{video.views} views</span>
          <span>{video.timestamp}</span>
        </div>
      </div>
    </div>
  )
}

export default VideoCard