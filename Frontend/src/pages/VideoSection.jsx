import { useState } from 'react'
import VideoCard from '../components/VideoCard'
import videos from '../data/videos.json'
 
const VideoSection= () => {
  const [category, setCategory] = useState('All')
 
  const categories = ['All', 'Nature', 'Cities', 'Travel', 'Music', 'Gaming', 'Sports']
 
  const filteredVideos = category === 'All'
    ? videos
    : videos.filter(video => video.category === category)
 
  return (
<div className="bg-dark min-vh-100 text-white">
<div className="container py-5">
        {/* Category Filter Buttons */}
<div className="d-flex overflow-auto mb-4 pb-2">
          {categories.map(cat => (
<button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`btn me-2 rounded-pill ${
                category === cat 
                  ? 'btn-danger text-white' 
                  : 'btn-secondary'
              }`}
>
              {cat}
</button>
          ))}
</div>
 
        <h1 className="h3 fw-bold mb-4">
          {category === 'All' ? 'Recommended Videos' : `${category} Videos`}
</h1>
 
        {/* Video Grid */}
<div className="row g-3">
          {filteredVideos.map(video => (
<div key={video.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
<VideoCard video={video} />
</div>
          ))}
</div>
</div>
</div>
  )
}
 
export default VideoSection