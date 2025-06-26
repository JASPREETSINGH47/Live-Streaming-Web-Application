import { React, useState, useEffect, useRef } from 'react';
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Container,
  ProgressBar,
} from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { ReactMediaRecorder } from 'react-media-recorder';

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isRecording, setIsRecording] = useState(false);
  const [streamid, setstreamid] = useState("");
  
  const [stream, setStream] = useState({
    title: '',
    description: '',
    thumbnail: [],
    videoUrl: '',
    duration: '',
    views: '',
    timestamp: '',
    category: '',
  });

  const localPlayerRef = useRef(null);
  const clientRef = useRef(null);

  const APP_ID = 'f6bdee12e56b4587a5b3dec906141766';
  const CHANNEL = 'hell cast';
  const TOKEN = '007eJxTYLBgWzL9eEfJFsNz0t3+jJsc5ifrfgz3nurG+nz7rATJ9ZkKDGlmSSmpq...'; // Your Token

  const localTracks = useRef({
    videoTrack: null,
    audioTrack: null,
  });

  const handleScreenShare = async () => {
    if (localTracks.current.videoTrack) {
      await clientRef.current.unpublish(localTracks.current.videoTrack);
      localTracks.current.videoTrack.stop();
      localTracks.current.videoTrack.close();
    }

    localTracks.current.videoTrack = await AgoraRTC.createScreenVideoTrack(
      { encoderConfig: '1440p_1' },
      'auto'
    );

    localTracks.current.videoTrack.play(localPlayerRef.current);
    await clientRef.current.publish(localTracks.current.videoTrack);
    console.log('Publishing screen stream...');
  };

  useEffect(() => {
    const startAgora = async () => {
      clientRef.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      await clientRef.current.join(APP_ID, CHANNEL, TOKEN, null);
    };
    startAgora();

    return () => {
      if (clientRef.current) {
        clientRef.current.leave();
      }
    };
  }, []);

  const uploadRecordedVideo = async (blob) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('video', blob, `recording_${Date.now()}.webm`);
      formData.append('streamid', streamid); 

      const response = await axios.post(
        'http://localhost:8001/users/upload_stream_video',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      
      
      // Update the stream state with the new video URL
      setStream(prev => ({
        ...prev,
        videoUrl: response.data.videoUrl
      }));
      
      return response.data.videoUrl;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleStream = (e) => {
    const { name, value } = e.target;
    setStream({ ...stream, [name]: value });
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const uniqueFiles = newFiles.filter(
      (newFile) => !files.some((existingFile) => existingFile.name === newFile.name)
    );
    setFiles([...files, ...uniqueFiles]);
  };

  const uploadImage = async () => {
    if (files.length === 0) {
      alert('Please select at least one file to upload.');
      return;
    }

    try {
      setIsUploading(true);
      const uploadedFileNames = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('thumbnail', file);

        const response = await axios.post(
          'http://localhost:8001/users/upload_image',
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: (progressEvent) => {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress((prev) => ({ ...prev, [file.name]: progress }));
            },
          }
        );

        uploadedFileNames.push(response.data.thumbnail[0]);
      }

      setStream((prev) => ({
        ...prev,
        thumbnail: [...prev.thumbnail, ...uploadedFileNames],
      }));
      alert('Thumbnail uploaded successfully!');
      setFiles([]);
      setUploadProgress({});
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      alert('Image upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleStreamSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...stream,
      thumbnail: JSON.stringify(stream.thumbnail),
    };

    let token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        'http://localhost:8001/users/create_stream',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

setstreamid(response.data.hellCastStreamContent.id)
      console.log(response.data.hellCastStreamContent.id, "-----------hellCastStreamContent--")

      alert('Stream created');
      console.log(response.data);

      setStream({
        title: '',
        description: '',
        thumbnail: [],
        videoUrl: '',
        duration: '',
        views: '',
        timestamp: '',
        category: '',
      });
      setFiles([]);
    } catch (error) {
      console.error('Error creating stream', error.response?.data || error.message);
      alert('Stream not created');
    }
  };

  return (
    <>
      <Container className="p-4">
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <Card className="shadow-sm">
              <Card.Header>
                <Card.Title as="h5">Upload New Stream</Card.Title>
              </Card.Header>
              <Card.Body>

                <Form onSubmit={handleStreamSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={stream.title}
                      onChange={handleStream}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      value={stream.description}
                      onChange={handleStream}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Thumbnail</Form.Label>
                    <Form.Control type="file" multiple onChange={handleFileChange} />
                    {files.length > 0 && (
                      <Button
                        variant="primary"
                        className="mt-2"
                        onClick={uploadImage}
                        disabled={isUploading}
                      >
                        {isUploading ? 'Uploading...' : 'Upload Thumbnail(s)'}
                      </Button>
                    )}
                    {files.map((file) => (
                      <div key={file.name} className="mt-2">
                        <small>{file.name}</small>
                        <ProgressBar
                          now={uploadProgress[file.name] || 0}
                          label={`${uploadProgress[file.name] || 0}%`}
                          animated
                          striped
                        />
                      </div>
                    ))}
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Video URL</Form.Label>
                    <Form.Control
                      type="text"
                      name="videoUrl"
                      value={stream.videoUrl}
                      onChange={handleStream}
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Duration</Form.Label>
                        <Form.Control
                          type="text"
                          name="duration"
                          value={stream.duration}
                          onChange={handleStream}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Views</Form.Label>
                        <Form.Control
                          type="text"
                          name="views"
                          value={stream.views}
                          onChange={handleStream}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Timestamp</Form.Label>
                    <Form.Control
                      type="text"
                      name="timestamp"
                      value={stream.timestamp}
                      onChange={handleStream}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                      type="text"
                      name="category"
                      value={stream.category}
                      onChange={handleStream}
                    />
                  </Form.Group>

                  <Button type="submit" className="btn btn-primary w-100">
                    Create Stream
                  </Button>
                </Form>

              </Card.Body>
            </Card>
          </Col>
        </Row>

        <ReactMediaRecorder
          screen
          video={{ mimeType: 'video/webm' }}
          onStart={() => {
            setIsRecording(true);
            handleScreenShare();
          }}
          onStop={async (blobUrl, blob) => {
            setIsRecording(false);
            try {
              const videoUrl = await uploadRecordedVideo(blob);
              setStream(prev => ({ ...prev, videoUrl }));
              alert('Recording uploaded successfully!');
            } catch (error) {
              alert('Failed to upload recording');
            }
          }}
          render={({ startRecording, stopRecording, mediaBlobUrl }) => (
            <div className="mt-5 text-center">
              <h4>Live Streaming</h4>
              <div className="mb-3">
                <Button
                  variant={isRecording ? 'danger' : 'success'}
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isUploading}
                >
                  {isRecording ? 'Stop Streaming' : 'Start Streaming'}
                </Button>
              </div>
              <div
                ref={localPlayerRef}
                style={{
                  width: '100%',
                  height: '400px',
                  backgroundColor: 'black',
                }}
              />
              {mediaBlobUrl && (
                <div className="mt-4">
                  <h5>Recording Preview:</h5>
                  <video
                    src={mediaBlobUrl}
                    controls
                    style={{ width: '100%', maxHeight: '400px' }}
                  />
                </div>
              )}
              {isUploading && (
                <div className="mt-3">
                  <ProgressBar animated now={100} label="Uploading..." />
                </div>
              )}
            </div>
          )}
        />
      </Container>
    </>
  );
};

export default Dashboard;