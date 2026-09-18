# FlexiPay AI (फ्लेक्सीपे AI) 🌾
> **Voice-Native Rural Financial & Scheme Layer** compliant with RBI Directions, DPDP Rules 2025, and Banking BHASHINI.

FlexiPay AI bridges the digital divide for rural and semi-urban India by providing a voice-first, dialect-aware interface for financial transfers, government scheme discovery, and proactive fraud defense.

---

## 🌟 Key Features

### 1. 🎙️ Multilingual Voice Engine (Banking BHASHINI)
- Native support for Indian languages & rural dialects (Hindi, Awadhi, Bhojpuri, Tamil, Telugu, Bengali, Marathi, Punjabi, Kannada).
- Real-time speech-to-text with entity extraction (recipient, amount, purpose, land holding).
- Conversational fallbacks and audio feedback for low-literacy users.

### 2. 🛡️ Two-Sided Fraud Guardian & Scam Defense
- **Inbound Threat Detection**: Heuristic & NLU-based detection of vishing patterns (fake bank officials, urgent transfer pressure, OTP/PIN requests, lottery scams).
- **Outbound Anti-Replay Challenge**: Dynamic challenge phrases (e.g. *"Bharat 8492"*) to mitigate generative AI deepfake voice cloning attacks.
- **Mandatory RBI 2FA Gate**: Strict separation of intent from execution. Voice captures intent, but fund movement strictly requires 4-digit UPI PIN entry.

### 3. 🌾 Kisan Credit Card (KCC) & Scheme Matcher Hub
- Dynamic interest subvention calculator (4% on-time repayment rate vs 9% default rate).
- Integration matching with **myScheme.gov.in** and **Kisan Rin Portal** based on farmer landholding and crop profile.
- Automated voice reminders for debt servicing to prevent loss of interest subventions.

### 4. 📱 Multi-Channel Omnipresence
- **Smartphone Web UI**: Mic-native, high-contrast dashboard with live audio visualizer.
- **Feature Phone IVR (UPI 123Pay)**: Dial-in gateway (08045163581 simulation) for 400M+ non-smartphone users.
- **Bank Mitra / CSC Console**: Human-in-the-loop assisted intake and digital application slip generation for elderly or first-time digital citizens.

---

## 🏗️ Architecture

```
                       +----------------------------------+
                       |      Multilingual User Input     |
                       | (Smartphone Mic / Feature Phone) |
                       +-----------------+----------------+
                                         |
                                         v
                         +-------------------------------+
                         |   Banking BHASHINI & NLU      |
                         | - Speech-to-Text              |
                         | - Dialect Normalization       |
                         | - Intent & Entity Extraction  |
                         +---------------+---------------+
                                         |
                       +-----------------+-----------------+
                       |                                   |
                       v                                   v
        +-----------------------------+     +-----------------------------+
        |   Fraud Guardian Defense    |     |  Scheme & Financial Matcher |
        | - Vishing & Urgency Scan    |     | - Landholding Heuristics    |
        | - Anti-Replay Challenge     |     | - KCC Subvention Engine     |
        | - High-Risk Auto-Lock       |     | - myScheme Recommendations  |
        +--------------+--------------+     +--------------+--------------+
                       |                                   |
                       +-----------------+-----------------+
                                         |
                                         v
                      +-------------------------------------+
                      | Mandatory RBI 2FA Gate (UPI PIN)   |
                      | - Voice captures intent             |
                      | - PIN authorizes money movement     |
                      +------------------+------------------+
                                         |
                                         v
                        +----------------------------------+
                        | NPCI UPI Rails / Core Banking DB |
                        +----------------------------------+
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Modern Web Browser (Chrome / Edge / Firefox)

### 1. Start the Backend Engine
```bash
cd backend
pip install fastapi uvicorn pydantic
uvicorn main:app --reload --port 8000
```
The API documentation will be available at `http://localhost:8000/docs`.

### 2. Launch the Client Interface
Simply open `index.html` in any web browser, or serve using a static server:
```bash
# Using Python
python -m http.server 3000
# Then visit http://localhost:3000
```

---

## ⚖️ Regulatory & Security Compliance
- **RBI Directions (2025/2026)**: Dynamic 2-Factor Authentication enforcement for all electronic fund movements.
- **DPDP Act (2025)**: Explicit, multi-lingual audio/visual consent prompts prior to recording biometric or financial intent.
- **Audit Trails**: Immutable SQLite/PostgreSQL transaction logs with threat categorization and confidence scoring.

---

## 📄 License
This project is open-source under the Apache 2.0 / MIT License.
