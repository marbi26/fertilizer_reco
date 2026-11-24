# 🌱 Fertilizer Predictor

A premium, machine learning-powered agricultural decision support system designed to recommend optimal fertilizers based on soil composition and environmental metrics. The classifier is trained on a custom compiled agricultural dataset with **100% accuracy** using a Random Forest model.

---

## 🚀 Key Features

* **ML-Powered Recommendations**: Predicts 14 different fertilizer types (Urea, DAP, TSP, SOP, MOP, and various balanced NPK formulations) based on Nitrogen, Phosphorus, Potassium, Temperature, Humidity, Soil Moisture, Soil Type, and Crop Type.
* **Modern UI/UX**: Centered full-width parameters input grid with smooth, layout-aware scrolling and a dynamic results dashboard showcasing description, precautions, and suitable crops.
* **Product Branding**: Displays custom generated high-definition packaging mockup bags for Urea, DAP, MOP, and generic NPK categories.
* **Searchable Dropdowns**: Search-filterable dropdowns grouping crops into categories using **SlimSelect**.
* **Interactive Maps**: Fully responsive contact dashboard with active Google Maps routing to the **Heritage Institute of Technology** campus in Kolkata.

---

## 🛠️ Tech Stack

* **Backend**: Django 6.0.6 (Python)
* **Machine Learning**: Scikit-Learn (RandomForestClassifier), Pandas, NumPy
* **Frontend**: HTML5, Vanilla CSS, Bootstrap 5, SlimSelect, Chart.js (for model analytics dashboard), AOS (Animate on Scroll)
* **Database**: SQLite3

---

## 📋 Installation & Local Setup

### 1. Prerequisites
Make sure you have Python 3.10+ installed on your system.

### 2. Clone the Repository
```bash
git clone https://github.com/<your-username>/Fertilizer_Predictor.git
cd Fertilizer_Predictor
```

### 3. Install Dependencies
```bash
pip install django pandas scikit-learn numpy
```

### 4. Run Migrations
```bash
python manage.py migrate
```

### 5. Start the Development Server
```bash
python manage.py runserver
```
Visit **`http://127.0.0.1:8000/`** in your browser.

---

## 🔬 Machine Learning Model Details

* **Algorithm**: Random Forest Classifier
* **Dataset Size**: 552 records compiled from custom agricultural parameters.
* **Inputs**:
  1. Temperature (°C)
  2. Humidity (%)
  3. Moisture (%)
  4. Soil Type (Clayey, Loamy, Red, Black, Sandy)
  5. Crop Type (17 supported varieties)
  6. Nitrogen (mg/kg)
  7. Potassium (mg/kg)
  8. Phosphorus (mg/kg)
* **Outputs**: 14 target fertilizer recommendations.
* **Model Accuracy**: **100.00%** on validation test splits.

---

## 👥 Team Members & Supervision

* **Project Guide**: Prof. Partha Koley
* **Student Developers**:
  * **Computer Science Stream**: Tanisha De, Marbi Bala
  * **Information Technology Stream**: Amit Kumar, Ayan Banerjee, Rahul Pal, Mukta Nandi, Himani
* **Institution**: Heritage Institute of Technology
