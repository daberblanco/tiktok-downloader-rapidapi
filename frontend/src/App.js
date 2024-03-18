import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Importamos un archivo CSS para los estilos

function App() {
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [videos, setVideos] = useState([]);
  const [downloadUrls, setDownloadUrls] = useState([]);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleSearchUser = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/user/${username}`);
      setUserId(response.data.userId);
    } catch (error) {
      console.error('Error searching user:', error);
    }
  };

  const handleGetVideos = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/videos/${userId}`);
      setVideos(response.data.videoIds);
    } catch (error) {
      console.error('Error getting videos:', error);
    }
  };

  const handleGetDownloadUrls = async () => {
    try {
      const downloadPromises = videos.map(async (videoId) => {
        const response = await axios.get('http://localhost:5000/download', {
          params: {
            video_url: `https://www.tiktok.com/@therock/video/${videoId}`
          }
        });
        return response.data.downloadUrls;
      });

      const downloadUrlsArray = await Promise.all(downloadPromises);
      setDownloadUrls(downloadUrlsArray.flat());
    } catch (error) {
      console.error('Error getting download URLs:', error);
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">TikTok Downloader</h1>
      <div className="input-container">
        <input type="text" className="username-input" placeholder="Enter TikTok username" value={username} onChange={handleUsernameChange} />
        <button className="search-button" onClick={handleSearchUser}>Search User</button>
      </div>
      {userId && (
        <div className="button-container">
          <button className="action-button" onClick={handleGetVideos}>Get Videos</button>
        </div>
      )}
      {videos.length > 0 && (
        <div className="button-container">
          <button className="action-button" onClick={handleGetDownloadUrls}>Get Download URLs</button>
        </div>
      )}
      {downloadUrls.length > 0 && (
        <div className="download-urls-container">
          <h2 className="download-header">Download URLs:</h2>
          <ul className="download-list">
            {downloadUrls.map((url, index) => (
              <li key={index} className="download-item">
                <a href={url} className="download-link" target="_blank" rel="noopener noreferrer">Download Video {index + 1}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
