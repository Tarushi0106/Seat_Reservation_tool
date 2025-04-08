const axios = require('axios');

const getPrediction = async (req, res) => {
  try {
    const flaskURL = 'http://localhost:3000/predict'; // Your Flask server
    const response = await axios.post(flaskURL, req.body);

    console.log('✅ Prediction response from Flask:', response.data);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('❌ Error communicating with Flask server:', error.message);
    res.status(500).json({
      error: 'Prediction failed',
      details: error.message
    });
  }
};

module.exports = { getPrediction };
