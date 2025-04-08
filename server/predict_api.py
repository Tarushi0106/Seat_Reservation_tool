from flask import Flask, request, jsonify
import joblib
import pandas as pd
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS so frontend on port 3000 can access this

model_path = "no_show_model.pkl"

try:
    if os.path.exists(model_path):
        model = joblib.load(model_path)
        print("✅ Model loaded successfully.")
    else:
        raise FileNotFoundError(f"Model file '{model_path}' not found in the current directory.")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded properly."}), 500

    try:
        data = request.get_json()
        print("📥 Data received:", data)

        df = pd.DataFrame([data])
        prediction = model.predict(df)[0]
        probability = model.predict_proba(df)[0][1]

        print(f"🔮 Prediction: {prediction}, Probability: {probability}")
        return jsonify({
            "prediction": int(prediction),
            "probability": round(probability, 2)
        })

    except Exception as e:
        print(f"❌ Prediction error: {e}")
        return jsonify({"error": "Prediction failed", "details": str(e)}), 400

if __name__ == '__main__':
    print("🚀 Starting Flask server on http://localhost:3000")
    app.run(host='0.0.0.0', port=3000, debug=True)
