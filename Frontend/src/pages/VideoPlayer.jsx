import { useParams, Link } from 'react-router-dom'
import { useRef } from 'react'
import ReactPlayer from 'react-player'
import videos from '../data/videos.json'
import { ArrowLeft } from 'react-bootstrap-icons'
 
const VideoPlayer = () => {
  const { id } = useParams()
  const video = videos.find(v => v.id === parseInt(id))
  const playerRef = useRef(null)
 
  if (!video) {
    return <div className="text-center text-white py-5">Video not found</div>
  }
 
  return (
<div className="bg-dark min-vh-100 text-white">
<div className="container py-4">
<Link to="/videosection" className="d-flex align-items-center text-light mb-4 text-decoration-none">
<ArrowLeft className="me-2" />
          Back to videos
</Link>
 
        <div className="mb-4 ratio ratio-16x9 bg-black rounded overflow-hidden">
<ReactPlayer
            ref={playerRef}
            url={video.videoUrl}
            controls
            playing
            width="100%"
            height="100%"
            config={{
              file: {
                attributes: {
                  controlsList: 'nodownload'
                }
              }
            }}
          />
</div>
 
        <div className="mx-auto" style={{ maxWidth: '960px' }}>
<h1 className="h3 fw-bold mb-3">{video.title}</h1>
 
          <div className="d-flex align-items-center justify-content-between mb-4">
<div className="d-flex align-items-center">
<div className="rounded-circle bg-secondary me-3" style={{ width: '40px', height: '40px' }}></div>
<div>
<div className="fw-medium">Channel Name</div>
<small className="text-muted">1.2M subscribers</small>
</div>
</div>
 
            <div className="d-flex gap-2">
<button className="btn btn-secondary d-flex align-items-center">
                👍 <span className="ms-1">12K</span>
</button>
<button className="btn btn-secondary d-flex align-items-center">
                👎 <span className="ms-1">34</span>
</button>
<button className="btn btn-secondary">Share</button>
</div>
</div>
 
          <div className="bg-secondary p-3 rounded mb-5">
<div className="mb-2">
<small className="text-light me-3">{video.views} views</small>
<small className="text-light">{video.timestamp}</small>
</div>
<p className="text-light">{video.description}</p>
</div>
 
          <h2 className="h5 fw-semibold mb-4">More Videos</h2>
<div className="row g-3">
            {videos
              .filter(v => v.id !== video.id)
              .slice(0, 4)
              .map(v => (
<div key={v.id} className="col-md-6">
<div className="d-flex bg-secondary rounded overflow-hidden">
<Link to={`/video/${v.id}`} className="flex-shrink-0">
<img 
                        src={v.thumbnail}
                        alt={v.title}
                        className="img-fluid"
                        style={{ width: '160px', height: '100px', objectFit: 'cover' }}
                      />
</Link>
<div className="p-2">
<Link to={`/video/${v.id}`} className="text-light fw-medium text-decoration-none d-block">
                        {v.title}
</Link>
<small className="text-light">{v.views} views</small>
</div>
</div>
</div>
              ))}
</div>
</div>
</div>
</div>
  )
}
 
export default VideoPlayer