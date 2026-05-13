# AI-Powered Clinical Data Extraction System

An AI-powered full-stack system that converts unstructured medical documents such as prescriptions, lab reports, and discharge summaries into structured digital medical records.

The system allows users/doctors to upload medical images or PDFs, extracts raw text using OCR, identifies medical entities using NLP/BioMedical NER + regex, stores the extracted data in MongoDB, and displays patient medical history as a timeline.

---

# AI-Powered Clinical Data Extraction System
<img width="835" height="586" alt="image" src="https://github.com/user-attachments/assets/4ee6b6f8-98ff-433a-9d2d-618dab986dfb" />

## System Demo
<img width="858" height="934" alt="image" src="https://github.com/user-attachments/assets/20deabdd-c852-4567-ab47-dcf2af0a24c4" />

<img width="1805" height="935" alt="image" src="https://github.com/user-attachments/assets/c30e84b5-0c0d-4ba3-a540-9004fcf3de95" />

<img width="1415" height="792" alt="image" src="https://github.com/user-attachments/assets/a1a7c871-19c4-4807-944c-94f91fdf2998" />

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Backend API Flow](#backend-api-flow)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [AI Extraction Pipeline](#ai-extraction-pipeline)
- [Frontend Features](#frontend-features)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [How to Run the Project](#how-to-run-the-project)
- [Testing with Postman](#testing-with-postman)
- [Limitations](#limitations)
- [Future Improvements](#future-improvements)
- [Interview Explanation](#interview-explanation)

---

## Project Overview

Medical data is often stored in unstructured formats such as handwritten prescriptions, scanned lab reports, and discharge summaries. Manually reading and digitizing these documents is time-consuming and error-prone.

This project solves that problem by building an AI-assisted clinical data extraction system.

The system performs the following operations:

1. User creates a patient profile.
2. User uploads a medical document.
3. Node.js backend stores the uploaded file.
4. Backend sends the file path to the Python FastAPI AI microservice.
5. AI service extracts raw text using OCR.
6. NLP and regex extract structured medical data.
7. Extracted data is saved in MongoDB.
8. Doctors can view patient history as a timeline.
9. Doctors can search records by disease or medicine.

---

## Key Features

### Patient Management

- Create patient profiles
- Store patient details such as name, age, and gender
- Link every medical record to a specific patient

### Medical Document Upload

- Upload prescription images
- Upload PDF medical documents
- Store uploaded files locally using Multer
- Process uploaded files through an AI microservice

### AI-Based Medical Data Extraction

- Extract raw text from images/PDFs using OCR
- Extract diseases, medicines, dosage, frequency, and duration
- Use biomedical NER model for entity extraction
- Use regex for prescription-specific fields
- Detect basic drug interaction alerts

### Patient Medical Timeline

- View all medical records of a patient chronologically
- Track past medicines and diseases
- Helps doctors understand patient history quickly

### Search Medical Records

- Search records by medicine
- Search records by disease
- Useful for doctor/admin analysis

### React Frontend

- Dashboard for patient creation and document upload
- Extracted data preview
- Patient timeline page
- Search records page

---

## System Architecture

```txt
                  ┌──────────────────────────┐
                  │      React Frontend       │
                  │  Dashboard / Timeline /   │
                  │        Search UI          │
                  └─────────────┬────────────┘
                                │
                                │ HTTP API Calls
                                ▼
                  ┌──────────────────────────┐
                  │   Node.js Express Backend │
                  │  API Gateway + File Upload│
                  └─────────────┬────────────┘
                                │
                 ┌──────────────┼──────────────┐
                 │              │              │
                 ▼              ▼              ▼
          ┌────────────┐ ┌──────────────┐ ┌──────────────┐
          │  MongoDB   │ │ Local Uploads│ │ FastAPI AI   │
          │ Database   │ │   Folder     │ │ Microservice │
          └────────────┘ └──────────────┘ └──────┬───────┘
                                                  │
                                                  ▼
                                      ┌─────────────────────┐
                                      │ OCR + NLP Pipeline   │
                                      │ Tesseract/EasyOCR    │
                                      │ BioMedical NER       │
                                      │ Regex Extraction     │
                                      └─────────────────────┘
```

---

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Axios
- React Router DOM

### Node.js Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Multer
- Axios
- CORS
- dotenv

### Python AI Microservice

- FastAPI
- Uvicorn
- pytesseract
- EasyOCR
- Pillow
- OpenCV
- Hugging Face Transformers
- Biomedical NER model
- Regex-based extraction

### Database

- MongoDB

---

## Folder Structure

```txt
AI Clinical Data System/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── uploads/
│   └── src/
│       ├── app.js
│       ├── config/
│       │   └── db.js
│       ├── controllers/
│       │   ├── uploadController.js
│       │   └── patientController.js
│       ├── middleware/
│       │   └── uploadMiddleware.js
│       ├── models/
│       │   ├── Patient.js
│       │   └── Record.js
│       ├── routes/
│       │   ├── uploadRoutes.js
│       │   └── patientRoutes.js
│       └── services/
│           └── aiService.js
│
├── ai-service/
│   ├── requirements.txt
│   └── app/
│       ├── main.py
│       ├── routes/
│       │   └── process.py
│       └── services/
│           ├── ocr_service.py
│           ├── nlp_service.py
│           ├── drug_service.py
│           └── tesseract_config.py
│
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── api/
        │   └── api.js
        ├── components/
        │   ├── Navbar.jsx
        │   ├── PatientForm.jsx
        │   ├── UploadForm.jsx
        │   ├── ExtractedDataCard.jsx
        │   └── TimelineCard.jsx
        ├── pages/
        │   ├── Dashboard.jsx
        │   ├── PatientTimeline.jsx
        │   └── SearchRecords.jsx
        ├── App.jsx
        ├── main.jsx
        └── index.css
```

---

## Backend API Flow

```txt
1. React frontend sends document + patientId to Node.js backend.

2. Node.js backend receives file using Multer.

3. File is stored in backend/uploads.

4. Node.js backend sends file path to FastAPI AI service.

5. FastAPI AI service performs:
   - OCR
   - NLP entity extraction
   - Regex extraction
   - Drug interaction checking

6. AI service returns structured JSON.

7. Node.js backend stores the result in MongoDB.

8. Frontend displays extracted data and timeline.
```

---

## API Endpoints

### Health Check

```http
GET /
```

Returns backend/server status if implemented.

---

### Create Patient

```http
POST /api/patient
```

#### Request Body

```json
{
  "name": "Ajay Sharma",
  "age": 45,
  "gender": "Male"
}
```

#### Response

```json
{
  "_id": "patient_id",
  "name": "Ajay Sharma",
  "age": 45,
  "gender": "Male",
  "createdAt": "2026-05-14T00:00:00.000Z"
}
```

---

### Upload Medical Document

```http
POST /api/upload
```

#### Body Type

```txt
form-data
```

#### Form Data

```txt
file: prescription image/pdf
patientId: MongoDB patient id
```

#### Response

```json
{
  "message": "File processed and saved successfully",
  "data": {
    "_id": "record_id",
    "patientId": "patient_id",
    "filePath": "uploaded_file_path",
    "rawText": "Extracted OCR text",
    "structuredData": {
      "diseases": [],
      "medicines": ["Paracetamol"],
      "dosage": ["500mg"],
      "frequency": ["twice daily"],
      "duration": ["5 days"]
    },
    "drugAlerts": []
  }
}
```

---

### Get Patient Timeline

```http
GET /api/patient/:patientId/timeline
```

#### Example

```http
GET /api/patient/665f1234567890abcdef1234/timeline
```

#### Response

```json
{
  "patient": {
    "_id": "patient_id",
    "name": "Ajay Sharma",
    "age": 45,
    "gender": "Male"
  },
  "timeline": [
    {
      "recordId": "record_id",
      "date": "2026-05-14T00:00:00.000Z",
      "diseases": [],
      "medicines": ["Paracetamol"],
      "dosage": ["500mg"],
      "frequency": ["twice daily"],
      "duration": ["5 days"],
      "drugAlerts": []
    }
  ]
}
```

---

### Search Records by Medicine

```http
GET /api/search?medicine=paracetamol
```

---

### Search Records by Disease

```http
GET /api/search?disease=diabetes
```

---

### AI Service Process Endpoint

```http
POST http://localhost:8000/process
```

#### Request Body

```json
{
  "file_path": "C:/path/to/backend/uploads/sample.png"
}
```

#### Response

```json
{
  "raw_text": "Tab Paracetamol 500mg twice daily for 5 days",
  "structured_data": {
    "diseases": [],
    "medicines": ["Paracetamol"],
    "dosage": ["500mg"],
    "frequency": ["twice daily"],
    "duration": ["5 days"]
  },
  "drug_alerts": []
}
```

---

## Database Models

### Patient Model

```js
{
  name: String,
  age: Number,
  gender: String,
  createdAt: Date
}
```

### Record Model

```js
{
  patientId: ObjectId,
  filePath: String,
  rawText: String,
  structuredData: {
    diseases: [String],
    medicines: [String],
    dosage: [String],
    frequency: [String],
    duration: [String]
  },
  drugAlerts: [String],
  createdAt: Date
}
```

---

## AI Extraction Pipeline

The AI microservice uses a hybrid extraction approach.

```txt
Medical Image/PDF
        ↓
OCR Extraction
        ↓
Raw Text Cleaning
        ↓
Biomedical NER Model
        ↓
Regex-Based Extraction
        ↓
Drug Interaction Check
        ↓
Structured JSON Response
```

### OCR Layer

OCR extracts text from uploaded prescriptions, reports, and discharge summaries.

Supported OCR tools:

- Tesseract OCR
- EasyOCR

Tesseract works better for printed documents. EasyOCR can be used as a fallback for noisy or handwritten-like images.

### NLP Layer

The NLP layer extracts medical entities from OCR text.

Extracted entities include:

- Diseases
- Medicines
- Symptoms if supported by model
- Medical terms

### Regex Layer

Regex is used to extract structured prescription-specific patterns.

Examples:

```txt
Dosage:
500mg, 5ml, 2 tablets

Frequency:
once daily, twice daily, every 8 hours

Duration:
5 days, 2 weeks, 1 month
```

### Drug Interaction Layer

The drug service checks basic rule-based drug interactions.

Example:

```txt
Aspirin + Ibuprofen may increase bleeding risk
```

This can later be replaced by a real drug interaction API or medical database.

---

## Frontend Features

### Dashboard Page

- Create patient
- Upload prescription/report
- View extracted OCR text
- View structured extracted data
- View drug alerts

### Patient Timeline Page

- Enter patient ID
- Fetch medical history
- Display records chronologically
- Show medicines, diseases, dosage, frequency, duration, and alerts

### Search Records Page

- Search by medicine
- Search by disease
- View matching records
- View raw OCR text for each record

---

## Setup Instructions

### Prerequisites

Install the following:

- Node.js
- npm
- Python 3.10+
- MongoDB
- Tesseract OCR
- Poppler for PDF support

---

## Environment Variables

Create a `.env` file inside the `backend` folder.

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/clinical-data-system
AI_SERVICE_URL=http://localhost:8000/process
```

---

## How to Run the Project

### 1. Start MongoDB

Make sure MongoDB is running locally.

If using MongoDB locally:

```bash
mongod
```

---

### 2. Start Python AI Service

```bash
cd ai-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

AI service will run on:

```txt
http://localhost:8000
```

---

### 3. Start Node.js Backend

```bash
cd backend
npm install
npm run dev
```

Backend will run on:

```txt
http://localhost:5000
```

---

### 4. Start React Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on:

```txt
http://localhost:5173
```

---

## Testing with Postman

### Step 1: Create Patient

```http
POST http://localhost:5000/api/patient
```

Body:

```json
{
  "name": "Ajay Sharma",
  "age": 45,
  "gender": "Male"
}
```

Copy the returned `_id`.

---

### Step 2: Upload Document

```http
POST http://localhost:5000/api/upload
```

Use `form-data`:

```txt
file      → select image/pdf
patientId → paste copied patient _id
```

---

### Step 3: Get Patient Timeline

```http
GET http://localhost:5000/api/patient/PASTE_PATIENT_ID/timeline
```

---

### Step 4: Search by Medicine

```http
GET http://localhost:5000/api/search?medicine=paracetamol
```

---

### Step 5: Search by Disease

```http
GET http://localhost:5000/api/search?disease=diabetes
```

---

## Example Extracted Output

```json
{
  "rawText": "Tab Paracetamol 500mg twice daily for 5 days",
  "structuredData": {
    "diseases": [],
    "medicines": ["Paracetamol"],
    "dosage": ["500mg"],
    "frequency": ["twice daily"],
    "duration": ["5 days"]
  },
  "drugAlerts": []
}
```

---

## Limitations

- Handwritten prescriptions may not always be extracted accurately.
- OCR quality depends on image clarity, lighting, angle, and handwriting.
- Current drug interaction checking is rule-based and limited.
- Current extraction does not include medical confidence scores.
- Fine-tuned medical NER is not yet implemented.
- Files are currently stored locally instead of cloud storage.
- Authentication and role-based access are not yet implemented.

---

## Future Improvements

- Add JWT authentication
- Add doctor/admin roles
- Add cloud file storage using AWS S3 or Cloudinary
- Add OCR confidence score
- Add manual verification workflow
- Add ICD-10 disease mapping
- Add real drug interaction database/API
- Add async job queue using BullMQ or RabbitMQ
- Add Docker support
- Add production deployment
- Add audit logs for medical record access
- Add patient report export as PDF
- Add better handwritten prescription recognition using vision-language models

---

## Interview Explanation

This project follows a modular microservice-based architecture.

The Node.js backend acts as the main API gateway. It handles patient APIs, file uploads, MongoDB storage, and communication with the Python AI microservice. The Python FastAPI service handles AI-heavy tasks such as OCR, biomedical NER, regex extraction, and drug interaction checking.

The reason for separating Node.js and Python is that Node.js is good for API handling and web backend logic, while Python has stronger AI/ML and OCR ecosystem support.

The extraction pipeline is hybrid:

```txt
OCR + Biomedical NER + Regex + Rule-Based Validation
```

This is better than using only one model because medical prescriptions contain both natural language and structured patterns such as dosage, frequency, and duration.

The patient timeline feature makes the project useful in real healthcare workflows because doctors can quickly review previous diagnoses, medicines, and treatments.

---

## Resume Description

**AI-Powered Clinical Data Extraction System**  
*React, Node.js, Express.js, MongoDB, FastAPI, OCR, BioMedical NER, Hugging Face, Tailwind CSS*

- Built a full-stack AI system to convert prescriptions, lab reports, and discharge summaries into structured digital medical records.
- Developed a Node.js API gateway for file uploads, patient management, record storage, medical timeline generation, and search.
- Integrated a Python FastAPI AI microservice using OCR, biomedical NER, regex extraction, and rule-based drug interaction alerts.
- Designed a React dashboard to upload documents, view extracted medical data, search records, and visualize patient history chronologically.

---

## Author

**Sahil Chaudhari**

