import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3000/user/userdetails')
      .then(res => setUsers(res.data))
      .catch(err => console.error('Error fetching users:', err));
  }, []);

  const handleSelect = async (e) => {
    const selectedId = e.target.value;
    setSelectedUser(selectedId);

    const user = users.find(u => u._id === selectedId);
    if (!user) return;

    try {
      const response = await axios.post('http://localhost:5000/predict', user); // Flask runs on 5000
      setPrediction(response.data);
    } catch (err) {
      console.error('Error predicting:', err);
      setPrediction({ error: 'Prediction failed' });
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Select a User</h2>
      <select value={selectedUser} onChange={handleSelect} required>
        <option value="">-- Select User --</option>
        {users.map(user => (
          <option key={user._id} value={user._id}>
            {`${user.name}`}
          </option>
        ))}
      </select>

      {prediction && (
        <div className="prediction-result">
          {prediction.error ? (
            <p style={{ color: 'red' }}>{prediction.error}</p>
          ) : (
            <>
              <h3>Prediction: {prediction.prediction === 1 ? "✅ Will Show Up" : "❌ No-Show"}</h3>
              <p>Confidence: {Math.round(prediction.probability * 100)}%</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
