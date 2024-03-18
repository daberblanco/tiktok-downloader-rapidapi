const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//https://rapidapi.com/datauniverse/api/tiktok82/

// Claves de la API de RapidAPI
const key = 'YOUR_RAPIDAPI_KEY';
const host = 'tiktok82.p.rapidapi.com';

// Endpoint para obtener información del usuario
app.get('/user/:username', async (req, res) => {
  try {
    const username = req.params.username;
    console.log('Username enviado:', username); 
    const userInfoResponse = await axios.get('https://tiktok82.p.rapidapi.com/getProfile', {
      params: {
        username: username
      },
      headers: {
        'X-RapidAPI-Key': key,
        'X-RapidAPI-Host': host
      }
    });

    console.log(userInfoResponse.data);

    const userId = userInfoResponse.data.data.user.id;
    res.json({ success: true, userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al obtener información del usuario' });
  }
});


// Endpoint para obtener los videos del usuario por su ID
app.get('/videos/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const videosResponse = await axios.get('https://tiktok82.p.rapidapi.com/getUserVideos', {
        params: {
          user_id: userId,
          secUid: 'YOUR_SECUID',
        },
        headers: {
          'X-RapidAPI-Key': key,
          'X-RapidAPI-Host': host
        }
      });
  
      console.log('Videos response:', videosResponse.data); // Agregar este log para depurar
  
      const items = videosResponse.data.data.items;
      if (!items) {
        throw new Error('La propiedad "items" está indefinida en la respuesta');
      }
  
      const videoIds = items.map(video => video.id);
      res.json({ success: true, videoIds });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error al obtener videos del usuario' });
    }
  });
  
  
  
  

// Endpoint para obtener el enlace de descarga de un video por su URL
app.get('/download', async (req, res) => {
  try {
    const videoUrl = req.query.video_url;
    const downloadResponse = await axios.get('https://tiktok82.p.rapidapi.com/getDownloadVideo', {
      params: {
        video_url: videoUrl
      },
      headers: {
        'X-RapidAPI-Key': key,
        'X-RapidAPI-Host': host
      }
    });

    const downloadUrls = downloadResponse.data.url_list;
    res.json({ success: true, downloadUrls });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al obtener enlace de descarga del video' });
  }
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
