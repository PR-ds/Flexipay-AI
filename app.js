/**
 * FlexiPay AI — Core Application Logic
 * Compliant with RBI 2026 2FA Directions, DPDP Rules 2025, and Banking BHASHINI MoU.
 */

document.addEventListener('DOMContentLoaded', () => {
    // State Management (Default Language: English en-IN)
    const state = {
        language: 'en-IN',
        consentGiven: true, // DPDP consent state
        activeChannel: 'smartphone',
        isListening: false,
        pinEntered: '',
        targetPin: '1234',
        currentIntent: null,
        passphrase: 'Bharat ' + Math.floor(1000 + Math.random() * 9000),
        logCount: 0,
        kccAmount: 160000,
        ivrStep: 0,
        ivrDigits: ''
    };

    // UI Elements
    const elements = {
        consentModal: document.getElementById('consent-modal'),
        btnConsentAccept: document.getElementById('btn-consent-accept'),
        btnConsentDecline: document.getElementById('btn-consent-decline'),
        btnPlayConsentAudio: document.getElementById('btn-play-consent-audio'),
        consentStatusText: document.getElementById('consent-status-text'),
        
        pinModal: document.getElementById('pin-modal'),
        pinDots: [
            document.getElementById('dot-1'),
            document.getElementById('dot-2'),
            document.getElementById('dot-3'),
            document.getElementById('dot-4')
        ],
        pinSubmit: document.getElementById('pin-submit'),
        pinClear: document.getElementById('pin-clear'),
        btnClosePinModal: document.getElementById('btn-close-pin-modal'),
        btnTriggerPinGate: document.getElementById('btn-trigger-pin-gate'),

        selectLanguage: document.getElementById('select-language'),
        btnToggleTheme: document.getElementById('btn-toggle-theme'),
        channelTabs: document.querySelectorAll('.channel-tab'),
        channelViews: document.querySelectorAll('.channel-view'),

        btnMicMain: document.getElementById('btn-mic-main'),
        speechStatusText: document.getElementById('speech-status-text'),
        currentLangName: document.getElementById('current-lang-name'),
        liveTranscript: document.getElementById('live-transcript'),
        intentType: document.getElementById('intent-type'),
        intentRecipient: document.getElementById('intent-recipient'),
        intentAmount: document.getElementById('intent-amount'),
        intentFallback: document.getElementById('intent-fallback'),
        nluConfidence: document.getElementById('nlu-confidence'),
        
        scenarioBtns: document.querySelectorAll('.scenario-btn'),
        btnTestVishing: document.getElementById('btn-test-vishing'),
        scamAlertBox: document.getElementById('scam-alert-box'),
        scamTitle: document.getElementById('scam-title'),
        scamDesc: document.getElementById('scam-desc'),
        dynamicPassphrase: document.getElementById('dynamic-passphrase'),
        btnGenPassphrase: document.getElementById('btn-gen-passphrase'),

        // IVR Elements
        ivrEnteredDigits: document.getElementById('ivr-entered-digits'),
        ivrScreenContent: document.getElementById('ivr-screen-content'),
        ivrKeyDigits: document.querySelectorAll('.key-digit'),
        ivrBtnCall: document.getElementById('ivr-btn-call'),
        ivrBtnEnd: document.getElementById('ivr-btn-end'),

        // Bank Mitra Elements
        btnBmVoiceIntake: document.getElementById('btn-bm-voice-intake'),
        btnBmGenerateSlip: document.getElementById('btn-bm-generate-slip'),
        btnBmBookKyc: document.getElementById('btn-bm-book-kyc'),
        bmSlipDisplay: document.getElementById('bm-slip-display'),

        // KCC Calculator Elements
        kccRangeAmount: document.getElementById('kcc-range-amount'),
        kccValAmount: document.getElementById('kcc-val-amount'),
        kccSavingsAmt: document.getElementById('kcc-savings-amt'),
        btnScheduleKccReminder: document.getElementById('btn-schedule-kcc-reminder'),
        btnAutofillKccList: document.querySelectorAll('.btn-autofill-kcc'),

        // Log Terminal
        systemLogTerminal: document.getElementById('system-log-terminal'),
        btnClearLogs: document.getElementById('btn-clear-logs'),
        canvas: document.getElementById('waveform-canvas')
    };

    // Full Multilingual i18n Translation Dictionary
    const i18n = {
        'en-IN': {
            lang_display: 'English (India)',
            brand_subtitle: 'Voice-Native Rural Financial & Scheme Layer',
            status_consent: 'DPDP 2025 Consent Logged',
            status_bhashini: 'Banking BHASHINI Active',
            status_rbi: 'RBI 2026 2FA PIN Gate',
            tab_smartphone: 'Smartphone Mode (Mic-Native UI)',
            tab_ivr: 'Feature Phone IVR (UPI 123Pay)',
            tab_bankmitra: 'Bank Mitra / CSC Operator Console',
            heading_voice: 'Multilingual Voice Assistant',
            speech_idle: 'Tap microphone or scenario card to speak',
            speech_listening: '🎙️ Listening... Speak now',
            speech_speaking: '🔊 Assistant Speaking...',
            mic_hint_prefix: 'Press to start listening in',
            nlu_title: 'Speech-to-Text & Banking BHASHINI NLU',
            heading_scenarios: 'Try Preset Rural Scenarios',
            heading_preview: 'Visual + Audio Form Preview',
            badge_awaiting_pin: 'Awaiting PIN',
            heading_scam_guardian: 'Scam Guardian Fraud Intercept Engine',
            heading_kcc: 'Kisan Credit Card (KCC) Hub',
            kcc_subtitle: 'Central Budget 2025-26 Scheme Matching',
            kcc_label_credit: 'Required Credit Amount:',
            kcc_label_savings: 'Yearly Interest Subvention Savings:',
            btn_kcc_reminder: 'Schedule Voice Repayment Reminder',
            heading_audit: 'Live Regulatory Compliance & NLU Audit Console',
            btn_clear_logs: 'Clear Logs',
            footer_title: 'FlexiPay AI — Grounded Voice-Native Rural Digital Banking & Scheme Assistant',
            footer_sub: 'Designed for RBI 2025/2026 Directions, DPDP Rules 2025, Banking BHASHINI & NPCI UPI 123Pay Rails.',
            consent_badge: 'DPDP Act 2025 Compliance',
            consent_title: 'Mandatory Data & Voice Privacy Consent',
            consent_subtitle: 'Digital Personal Data Protection Act (DPDP Rules 2025)',
            consent_audio_btn: 'Listen to Consent in Selected Language',
            consent_desc: 'FlexiPay AI requires your explicit, informed consent to capture:',
            consent_li1: '🎙️ Voice audio clips for Banking BHASHINI speech recognition.',
            consent_li2: '💰 Transaction intent & UPI details to generate pre-filled payment previews.',
            consent_li3: '🌾 Land & occupation details for Kisan Credit Card (KCC) & myScheme.gov.in matching.',
            consent_notice: 'Notice: Your financial transactions require mandatory 2-Factor UPI PIN verification under RBI 2026 guidelines. Voice alone is never used to move funds.',
            consent_accept: 'Accept & Continue',
            consent_decline: 'View Terms Only',
            pin_title: 'Enter 4-Digit UPI PIN',
            pin_subtitle: 'Voice confirms intent. PIN authorizes money movement.',
            pin_cancel: 'Cancel Transaction',
            scenarios: {
                transfer: {
                    title: 'Send ₹500 to Ramesh',
                    desc: 'Payment Intent + Mandatory 2FA PIN',
                    transcript: 'Send 500 rupees to Ramesh for seeds purchase',
                    speech: 'Received request to send ₹500 to Ramesh. As per RBI 2026 guidelines, please enter your UPI PIN to authorize.'
                },
                vishing: {
                    title: 'Scam Alert (Vishing)',
                    desc: 'Fake Bank Officer asking for OTP',
                    transcript: 'Bank manager called asking to share OTP and password immediately',
                    speech: 'WARNING! Bank officials never ask for your OTP or UPI PIN over the phone. This is a fraud call. Do not share your code!'
                },
                kcc: {
                    title: 'Kisan Credit Card (KCC)',
                    desc: '₹2L Collateral-Free & 4% Rate Helper',
                    transcript: 'Can I get a 2 Lakh collateral-free loan from Kisan Credit Card?',
                    speech: 'Yes! Under Central Budget guidelines, you are eligible for up to ₹2 Lakhs collateral-free credit at a 4% subsidized interest rate.'
                },
                scheme: {
                    title: 'PM-KISAN Status',
                    desc: 'myScheme.gov.in 16th Installment',
                    transcript: 'Check status for my PM Kisan Samman Nidhi 16th installment',
                    speech: 'Your PM Kisan 16th installment of ₹2,000 has been successfully credited to your SBI account.'
                }
            }
        },
        'hi-IN': {
            lang_display: 'Hindi (हिंदी)',
            brand_subtitle: 'वॉयस-नेविगेटेड ग्रामीण वित्तीय व योजना सहायक',
            status_consent: 'DPDP 2025 सहमति दर्ज',
            status_bhashini: 'बैंकिंग भषिणी सक्रिय',
            status_rbi: 'RBI 2026 2FA PIN गेट',
            tab_smartphone: 'स्मार्टफोन मोड (वॉयस यूआई)',
            tab_ivr: 'फीचर फोन IVR (UPI 123Pay)',
            tab_bankmitra: 'बैंक मित्र / सीएससी ऑपरेटर कंसोल',
            heading_voice: 'बहुभाषी वॉयस असिस्टेंट',
            speech_idle: 'बोलने के लिए माइक या सिनेरियो कार्ड पर टैप करें',
            speech_listening: '🎙️ सुन रहे हैं... अब बोलें',
            speech_speaking: '🔊 सहायक बोल रहा है...',
            mic_hint_prefix: 'सुनना शुरू करने के लिए दबाएं:',
            nlu_title: 'स्पीच-टू-टेक्स्ट व बैंकिंग भषिणी NLU',
            heading_scenarios: 'ग्रामीण उपयोग के उदाहरण आज़माएं',
            heading_preview: 'दृश्य व श्रव्य फॉर्म पूर्वावलोकन',
            badge_awaiting_pin: 'PIN की प्रतीक्षा है',
            heading_scam_guardian: 'स्कैम गार्डियन फ्रॉड इंटरसेप्ट इंजन',
            heading_kcc: 'किसान क्रेडिट कार्ड (KCC) हब',
            kcc_subtitle: 'केंद्रीय बजट 2025-26 योजना मिलान',
            kcc_label_credit: 'आवश्यक ऋण राशि:',
            kcc_label_savings: 'वार्षिक ब्याज छूट बचत:',
            btn_kcc_reminder: 'वॉयस रीपेमेंट रिमाइंडर सेट करें',
            heading_audit: 'लाइव नियामक अनुपालन व NLU ऑडिट कंसोल',
            btn_clear_logs: 'लॉग साफ़ करें',
            footer_title: 'FlexiPay AI — ग्रामीण डिजिटल बैंकिंग व योजना सहायक',
            footer_sub: 'RBI 2025/2026 दिशानिर्देश, DPDP 2025 व बैंकिंग भषिणी के अनुरूप।',
            consent_badge: 'DPDP अधिनियम 2025 अनुपालन',
            consent_title: 'अनिवार्य डेटा व वॉयस प्राइवेसी सहमति',
            consent_subtitle: 'डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम (DPDP Rules 2025)',
            consent_audio_btn: 'चयनित भाषा में सहमति सुनें',
            consent_desc: 'FlexiPay AI को आपकी सहमति आवश्यक है:',
            consent_li1: '🎙️ बैंकिंग भषिणी वॉयस पहचान के लिए ऑडियो क्लिप।',
            consent_li2: '💰 ट्रांजैक्शन विवरण से प्री-फिल्ड भुगतान पूर्वावलोकन बनाना।',
            consent_li3: '🌾 किसान क्रेडिट कार्ड व myScheme पात्रता जांच।',
            consent_notice: 'सूचना: वित्तीय लेन-देन के लिए RBI 2026 अनुसार 4-अंकीय UPI PIN अनिवार्य है। केवल वॉयस से पैसे कभी नहीं कटते।',
            consent_accept: 'स्वीकार करें और आगे बढ़ें',
            consent_decline: 'केवल शर्तें देखें',
            pin_title: '4-अंकीय UPI PIN दर्ज करें',
            pin_subtitle: 'वॉयस इरादे की पुष्टि करती है। PIN भुगतान को अधिकृत करता है।',
            pin_cancel: 'लेन-देन रद्द करें',
            scenarios: {
                transfer: {
                    title: 'रमेश को ₹500 भेजें',
                    desc: 'भुगतान इरादा + अनिवार्य 2FA PIN',
                    transcript: 'रमेश को बीज खरीदने के लिए 500 रुपये भेजो',
                    speech: 'रमेश को ₹500 भेजने का अनुरोध प्राप्त हुआ। भुगतान पूरा करने के लिए अपना UPI PIN दर्ज करें।'
                },
                vishing: {
                    title: 'स्कैम अलर्ट (विशिंग)',
                    desc: 'नकली बैंक अधिकारी OTP मांग रहा है',
                    transcript: 'बैंक मैनेजर का कॉल आया है, पूछ रहे हैं कि तुरंत OTP और पासवर्ड बताओ',
                    speech: 'सावधान! बैंक का कोई अधिकारी आपसे फोन पर OTP या PIN नहीं मांगता। अपना कोड किसी से शेयर न करें!'
                },
                kcc: {
                    title: 'किसान क्रेडिट कार्ड (KCC)',
                    desc: '₹2 लाख बिना गारंटी व 4% ब्याज छूट',
                    transcript: 'क्या मुझे किसान क्रेडिट कार्ड से 2 लाख रुपये का कोलैटरल-फ्री लोन मिल सकता है?',
                    speech: 'हाँ! आप 4 प्रतिशत रियायती ब्याज दर पर ₹2 लाख तक बिना गारंटी लोन प्राप्त कर सकते हैं।'
                },
                scheme: {
                    title: 'पीएम किसान स्थिति',
                    desc: 'myScheme 16वीं किश्त जांच',
                    transcript: 'मेरी पीएम किसान सम्मान निधि की 16वीं किश्त का स्टेटस चेक करो',
                    speech: 'आपकी पीएम किसान की 16वीं किश्त ₹2,000 आपके खाते में भेज दी गई है।'
                }
            }
        },
        'mr-IN': {
            lang_display: 'Marathi (मराठी)',
            brand_subtitle: 'ग्रामीण डिजिटल बँकिंग आणि योजना सहाय्यक',
            status_consent: 'DPDP 2025 संमती नोंदवली',
            status_bhashini: 'बँकिंग भाषिणी सक्रिय',
            status_rbi: 'RBI 2026 2FA PIN गेट',
            tab_smartphone: 'स्मार्टफोन मोड (व्हॉईस UI)',
            tab_ivr: 'फीचर फोन IVR (UPI 123Pay)',
            tab_bankmitra: 'बँक मित्र / CSC ऑपरेटर कन्सोल',
            heading_voice: 'बहुभाषिक व्हॉईस असिस्टंट',
            speech_idle: 'बोलण्यासाठी मायक्रोफोनवर टॅप करा',
            speech_listening: '🎙️ ऐकत आहे... आता बोला',
            speech_speaking: '🔊 सहाय्यक बोलत आहे...',
            mic_hint_prefix: 'या भाषेत बोला:',
            nlu_title: 'स्पीच-टू-टेक्स्ट आणि बँकिंग भाषिणी NLU',
            heading_scenarios: 'ग्रामीण वापराची उदाहरणे',
            heading_preview: 'दृश्य आणि श्राव्य पूर्वावलोकन',
            badge_awaiting_pin: 'PIN ची वाट पाहत आहे',
            heading_scam_guardian: 'स्कॅम गार्डियन फ्रॉड इंटरसेप्ट',
            heading_kcc: 'किसान क्रेडिट कार्ड (KCC) हब',
            kcc_subtitle: 'केंद्रीय अर्थसंकल्प 2025-26 योजना जुळणी',
            kcc_label_credit: 'आवश्यक कर्ज रक्कम:',
            kcc_label_savings: 'वार्षिक व्याज सवलत बचत:',
            btn_kcc_reminder: 'व्हॉईस रिपेमेंट रिमाइंडर सेट करा',
            heading_audit: 'थेट अनुपालन आणि NLU ऑडिट कन्सोल',
            btn_clear_logs: 'लॉग साफ करा',
            footer_title: 'FlexiPay AI — ग्रामीण डिजिटल बँकिंग आणि योजना सहाय्यक',
            footer_sub: 'RBI 2025/2026 मार्गदर्शक तत्त्वे आणि DPDP 2025 नुसार.',
            consent_badge: 'DPDP कायदा 2025 पालन',
            consent_title: 'डेटा आणि व्हॉईस गोपनीयता संमती',
            consent_subtitle: 'डिजिटल वैयक्तिक डेटा संरक्षण कायदा (DPDP Rules 2025)',
            consent_audio_btn: 'निवडलेल्या भाषेत संमती ऐका',
            consent_desc: 'FlexiPay AI ला तुमची संमती आवश्यक आहे:',
            consent_li1: '🎙️ भाषिणी आवाज ओळखीसाठी व्हॉईस क्लिप.',
            consent_li2: '💰 व्यवहाराचे तपशील आणि पूर्व-भरलेला पूर्वावलोकन.',
            consent_li3: '🌾 किसान क्रेडिट कार्ड आणि योजनेची पात्रता.',
            consent_notice: 'सूचना: व्यवहारासाठी RBI 2026 नुसार 4-अंकी UPI PIN अनिवार्य आहे.',
            consent_accept: 'स्वीकारा आणि पुढे जा',
            consent_decline: 'फक्त अटी पहा',
            pin_title: '4-अंकी UPI PIN टाका',
            pin_subtitle: 'आवाज हेतूची पुष्टी करतो. PIN व्यवहारास अधिकृत करतो.',
            pin_cancel: 'व्यवहार रद्द करा',
            scenarios: {
                transfer: {
                    title: 'रमेशला ₹500 पाठवा',
                    desc: 'पेमेंट हेतू + अनिवार्य 2FA PIN',
                    transcript: 'रमेशला बियाण्यांसाठी 500 रुपये पाठवा',
                    speech: 'रमेशला ₹500 पाठवण्याची विनंती प्राप्त झाली. कृपया तुमचा UPI PIN प्रविष्ट करा.'
                },
                vishing: {
                    title: 'स्कॅम अलर्ट (विशिंग)',
                    desc: 'खोटा बँक अधिकारी OTP मागत आहे',
                    transcript: 'बँक मॅनेजरचा फोन आला आहे, OTP मागत आहेत',
                    speech: 'सावधान! बँक अधिकारी कधीही फोनवर OTP मागत नाहीत. तुमचा कोड शेअर करू नका!'
                },
                kcc: {
                    title: 'किसान क्रेडिट कार्ड (KCC)',
                    desc: '₹2 लाख बिनव्याजी/सवलतीचे कर्ज',
                    transcript: 'मला किसान क्रेडिट कार्डवरून 2 लाख रुपयांचे विनातारण कर्ज मिळेल का?',
                    speech: 'होय! तुम्ही 4 टक्के सवलतीच्या दरात ₹2 लाखांपर्यंत विनातारण कर्ज मिळवू शकता.'
                },
                scheme: {
                    title: 'पीएम किसान स्थिती',
                    desc: '16 वा हप्ता तपासणी',
                    transcript: 'माझ्या पीएम किसान योजनेच्या 16 व्या हप्त्याची स्थिती तपासा',
                    speech: 'तुमचा पीएम किसानचा 16 वा हप्ता ₹2,000 खात्यात जमा झाला आहे.'
                }
            }
        },
        'ta-IN': {
            lang_display: 'Tamil (தமிழ்)',
            brand_subtitle: 'கிராமப்புற டிஜிட்டல் வங்கி மற்றும் திட்ட உதவி',
            status_consent: 'DPDP 2025 ஒப்புதல் பெறப்பட்டது',
            status_bhashini: 'வங்கி பாஷினி செயலில் உள்ளது',
            status_rbi: 'RBI 2026 2FA PIN கேட்',
            tab_smartphone: 'ஸ்மார்ட்போன் பயன்முறை',
            tab_ivr: 'சாதாரண போன் IVR (UPI 123Pay)',
            tab_bankmitra: 'வங்கி மித்ரா கன்சோல்',
            heading_voice: 'பல்மொழி குரல் உதவி',
            speech_idle: 'பேச மைக்ரோஃபோனைத் தொடவும்',
            speech_listening: '🎙️ கேட்கிறது... இப்போது பேசுங்கள்',
            speech_speaking: '🔊 உதவி பேசுகிறது...',
            mic_hint_prefix: 'பேச அழுத்தவும்:',
            nlu_title: 'குரல்-உரை & வங்கி பாஷினி NLU',
            heading_scenarios: 'மாதிரி குரல் கட்டளைகள்',
            heading_preview: 'படிவ முன்னோட்டம்',
            badge_awaiting_pin: 'PIN தேவை',
            heading_scam_guardian: 'மோசடி தடுப்பு பாதுகாப்பு',
            heading_kcc: 'கிசான் கிரெடிட் கார்டு (KCC) மையம்',
            kcc_subtitle: 'மத்திய பட்ஜெட் 2025-26 திட்டங்கள்',
            kcc_label_credit: 'தேவைப்படும் கடன் தொகை:',
            kcc_label_savings: 'வருடாந்திர வட்டி சேமிப்பு:',
            btn_kcc_reminder: 'குரல் நினைவூட்டல் அமைக்கவும்',
            heading_audit: 'நிகழ்நேர தணிக்கை கன்சோல்',
            btn_clear_logs: 'பதிவுகளை நீக்கு',
            footer_title: 'FlexiPay AI — கிராமப்புற டிஜிட்டல் வங்கி உதவி',
            footer_sub: 'RBI 2025/2026 மற்றும் DPDP 2025 விதிகளின் படி.',
            consent_badge: 'DPDP 2025 விதிமுறை',
            consent_title: 'தரவு மற்றும் குரல் தனியுரிமை ஒப்புதல்',
            consent_subtitle: 'டிஜிட்டல் தனிநபர் தரவு பாதுகாப்பு சட்டம்',
            consent_audio_btn: 'ஒப்புதலை தமிழில் கேட்கவும்',
            consent_desc: 'FlexiPay AI பயன்படுத்த உங்கள் ஒப்புதல் தேவை:',
            consent_li1: '🎙️ பாஷினி குரல் உணர்தலுக்கான குரல் பதிவு.',
            consent_li2: '💰 பணப்பரிவர்த்தனை விவரங்கள்.',
            consent_li3: '🌾 கிசான் கிரெடிட் கார்டு தகுதி சரிபார்ப்பு.',
            consent_notice: 'அறிவிப்பு: பரிவர்த்தனைக்கு 4 இலக்க UPI PIN கட்டாயம்.',
            consent_accept: 'ஏற்றுக்கொண்டு தொடரவும்',
            consent_decline: 'விதிமுறைகளை மட்டும் காண்க',
            pin_title: '4-இலக்க UPI PIN உள்ளிடவும்',
            pin_subtitle: 'PIN பணப்பரிமாற்றத்தை உறுதி செய்கிறது.',
            pin_cancel: 'பரிவர்த்தனையை ரத்து செய்',
            scenarios: {
                transfer: {
                    title: 'ரமேஷிற்கு ₹500 அனுப்பவும்',
                    desc: 'பணப்பரிமாற்றம் + UPI PIN',
                    transcript: 'ரமேஷிற்கு விதை வாங்க ₹500 அனுப்பு',
                    speech: 'ரமேஷிற்கு ₹500 அனுப்ப கோரிக்கை பெறப்பட்டது. UPI PIN உள்ளிடவும்.'
                },
                vishing: {
                    title: 'மோசடி எச்சரிக்கை (Vishing)',
                    desc: 'போலி வங்கி அதிகாரி OTP கேட்கிறார்',
                    transcript: 'வங்கி மேலாளர் பேசுகிறேன் என்று OTP கேட்கிறார்கள்',
                    speech: 'எச்சரிக்கை! வங்கி அதிகாரிகள் ஒருபோதும் OTP கேட்க மாட்டார்கள். கொடுக்காதீர்கள்!'
                },
                kcc: {
                    title: 'கிசான் கிரெடிட் கார்டு (KCC)',
                    desc: '₹2 லட்சம் வரை பிணையில்லா கடன்',
                    transcript: 'எனக்கு KCC மூலம் ₹2 லட்சம் கடன் கிடைக்குமா?',
                    speech: 'ஆம்! 4% மானிய வட்டியில் ₹2 லட்சம் வரை கடன் பெறலாம்.'
                },
                scheme: {
                    title: 'பிஎம் கிசான் நிலை',
                    desc: '16வது தவணை சரிபார்ப்பு',
                    transcript: 'பிஎம் கிசான் 16வது தவணை நிலை பார்க்கவும்',
                    speech: 'உங்கள் பிஎம் கிசான் 16வது தவணை ₹2,000 கணக்கில் செலுத்தப்பட்டது.'
                }
            }
        },
        'te-IN': {
            lang_display: 'Telugu (తెలుగు)',
            brand_subtitle: 'గ్రామీణ డిజిటల్ బ్యాంకింగ్ & పథకాల సహాయకం',
            status_consent: 'DPDP 2025 సమ్మతి నమోదైంది',
            status_bhashini: 'బ్యాంకింగ్ భాషిణి యాక్టివ్',
            status_rbi: 'RBI 2026 2FA PIN గేట్',
            tab_smartphone: 'స్మార్ట్‌ఫోన్ మోడ్ (వాయిస్ UI)',
            tab_ivr: 'ఫీచర్ ఫోన్ IVR (UPI 123Pay)',
            tab_bankmitra: 'బ్యాంక్ మిత్ర కన్సోల్',
            heading_voice: 'బహుభాషా వాయిస్ అసిస్టెంట్',
            speech_idle: 'మాట్లాడటానికి మైక్రోఫోన్‌ను నొక్కండి',
            speech_listening: '🎙️ వింటోంది... ఇప్పుడు మాట్లాడండి',
            speech_speaking: '🔊 అసిస్టెంట్ మాట్లాడుతోంది...',
            mic_hint_prefix: 'మాట్లాడటానికి నొక్కండి:',
            nlu_title: 'స్పీచ్-టు-టెక్స్ట్ & బ్యాంకింగ్ భాషిణి NLU',
            heading_scenarios: 'మాదిరి వాయిస్ ఆదేశాలు',
            heading_preview: 'ఫారమ్ పూర్వావలోకనం',
            badge_awaiting_pin: 'PIN కోసం నిరీక్షణ',
            heading_scam_guardian: 'మోసం నిరోధక రక్షణ',
            heading_kcc: 'కిసాన్ క్రెడిట్ కార్డ్ (KCC) హబ్',
            kcc_subtitle: 'కేంద్ర బడ్జెట్ 2025-26 పథకాలు',
            kcc_label_credit: 'కావలసిన రుణం మొత్తం:',
            kcc_label_savings: 'వార్షిక వడ్డీ తగ్గింపు పొదుపు:',
            btn_kcc_reminder: 'వాయిస్ రిమైండర్‌ను సెట్ చేయండి',
            heading_audit: 'లైవ్ ఆడిట్ కన్సోల్',
            btn_clear_logs: 'లాగ్‌లను క్లియర్ చేయండి',
            footer_title: 'FlexiPay AI — గ్రామీణ డిజిటల్ బ్యాంకింగ్ అసిస్టెంట్',
            footer_sub: 'RBI 2025/2026 & DPDP 2025 నిబంధనలకు అనుగుణంగా.',
            consent_badge: 'DPDP 2025 సమ్మతి',
            consent_title: 'డేటా మరియు వాయిస్ గోప్యతా సమ్మతి',
            consent_subtitle: 'డిజిటల్ వ్యక్తిగత డేటా రక్షణ చట్టం',
            consent_audio_btn: 'సమ్మతిని తెలుగులో వినండి',
            consent_desc: 'FlexiPay AI వినియోగానికి మీ సమ్మతి అవసరం:',
            consent_li1: '🎙️ భాషిణి వాయిస్ గుర్తింపు కోసం వాయిస్ క్లిప్.',
            consent_li2: '💰 లావాదేవీ వివరాలు.',
            consent_li3: '🌾 కిసాన్ క్రెడిట్ కార్డ్ అర్హత.',
            consent_notice: 'గమనిక: లావాదేవీకి 4-అంకెల UPI PIN తప్పనిసరి.',
            consent_accept: 'ఆమోదించండి & కొనసాగించండి',
            consent_decline: 'నిబంధనలు మాత్రమే చూడండి',
            pin_title: '4-అంకెల UPI PIN నమోదు చేయండి',
            pin_subtitle: 'PIN నగదు బదిలీని అధికరిస్తుంది.',
            pin_cancel: 'లావాదేవీని రద్దు చేయండి',
            scenarios: {
                transfer: {
                    title: 'రమేష్‌కి ₹500 పంపండి',
                    desc: 'లావాదేవీ + UPI PIN',
                    transcript: 'రమేష్‌కి విత్తనాల కోసం ₹500 పంపండి',
                    speech: 'రమేష్‌కి ₹500 పంపే అభ్యర్థన స్వీకరించబడింది. UPI PIN నమోదు చేయండి.'
                },
                vishing: {
                    title: 'మోసం హెచ్చరిక (Vishing)',
                    desc: 'నకిలీ బ్యాంక్ అధికారి OTP అడుగుతున్నారు',
                    transcript: 'బ్యాంక్ మేనేజర్ ఫోన్ చేసి OTP అడుగుతున్నారు',
                    speech: 'హెచ్చరిక! బ్యాంక్ అధికారులు ఎప్పుడూ OTP అడగరు. ఇవ్వకండి!'
                },
                kcc: {
                    title: 'కిసాన్ క్రెడిట్ కార్డ్ (KCC)',
                    desc: '₹2 లక్షల వరకు షూరిటీ లేని రుణం',
                    transcript: 'నాకు KCC ద్వారా ₹2 లక్షల రుణం వస్తుందా?',
                    speech: 'అవును! 4% వడ్డీ సబ్సిడీతో ₹2 లక్షల వరకు రుణం పొందవచ్చు.'
                },
                scheme: {
                    title: 'పిఎం కిసాన్ స్థితి',
                    desc: '16వ విడత తనిఖీ',
                    transcript: 'నా పిఎం కిసాన్ 16వ విడత స్థితి చూడండి',
                    speech: 'మీ పిఎం కిసాన్ 16వ విడత ₹2,000 ఖాతాలో జమ చేయబడింది.'
                }
            }
        },
        'kn-IN': {
            lang_display: 'Kannada (ಕನ್ನಡ)',
            brand_subtitle: 'ಗ್ರಾಮೀಣ ಡಿಜಿಟಲ್ ಬ್ಯಾಂಕಿಂಗ್ ಮತ್ತು ಯೋಜನೆ ಸಹಾಯಕ',
            status_consent: 'DPDP 2025 ಸಮ್ಮತಿ ದಾಖಲಾಗಿದೆ',
            status_bhashini: 'ಬ್ಯಾಂಕಿಂಗ್ ಭಾಷಿಣಿ ಸಕ್ರಿಯ',
            status_rbi: 'RBI 2026 2FA PIN ಗೇಟ್',
            tab_smartphone: 'ಸ್ಮಾರ್ಟ್‌ಫೋನ್ ಮೋಡ್',
            tab_ivr: 'ಫೀಚರ್ ಫೋನ್ IVR (UPI 123Pay)',
            tab_bankmitra: 'ಬ್ಯಾಂಕ್ ಮಿತ್ರ ಕನ್ಸೋಲ್',
            heading_voice: 'ಬಹುಭಾಷಾ ಧ್ವನಿ ಸಹಾಯಕ',
            speech_idle: 'ಮಾತನಾಡಲು ಮೈಕ್ರೋಫೋನ್ ಟ್ಯಾಪ್ ಮಾಡಿ',
            speech_listening: '🎙️ ಆಲಿಸುತ್ತಿದೆ... ಈಗ ಮಾತನಾಡಿ',
            speech_speaking: '🔊 ಸಹಾಯಕ ಮಾತನಾಡುತ್ತಿದ್ದಾನೆ...',
            mic_hint_prefix: 'ಮಾತನಾಡಲು ಒತ್ತಿ:',
            nlu_title: 'ಧ್ವನಿ-ಪಠ್ಯ & ಬ್ಯಾಂಕಿಂಗ್ ಭಾಷಿಣಿ NLU',
            heading_scenarios: 'ಮಾದರಿ ಧ್ವನಿ ಆದೇಶಗಳು',
            heading_preview: 'ಪೂರ್ವವೀಕ್ಷಣೆ',
            badge_awaiting_pin: 'PIN ಅಗತ್ಯವಿದೆ',
            heading_scam_guardian: 'ವಂಚನೆ ತಡೆಗಟ್ಟುವಿಕೆ',
            heading_kcc: 'ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ (KCC) ಹಬ್',
            kcc_subtitle: 'ಕೇಂದ್ರ ಬಜೆಟ್ 2025-26 ಯೋಜನೆಗಳು',
            kcc_label_credit: 'ಅಗತ್ಯವಿರುವ ಸಾಲದ ಮೊತ್ತ:',
            kcc_label_savings: 'वार्षिक ಬಡ್ಡಿ ರಿಯಾಯಿತಿ ಉಳಿತಾಯ:',
            btn_kcc_reminder: 'ಧ್ವನಿ ಜ್ಞಾಪನೆ ಹೊಂದಿಸಿ',
            heading_audit: 'ಲೈವ್ ಆಡಿಟ್ ಕನ್ಸೋಲ್',
            btn_clear_logs: 'ಲಾಗ್ ತೆರವುಗೊಳಿಸಿ',
            footer_title: 'FlexiPay AI — ಗ್ರಾಮೀಣ ಡಿಜಿಟಲ್ ಬ್ಯಾಂಕಿಂಗ್ ಸಹಾಯಕ',
            footer_sub: 'RBI 2025/2026 & DPDP 2025 ನಿಯಮಗಳ ಅನುಸಾರ.',
            consent_badge: 'DPDP 2025 ಸಮ್ಮತಿ',
            consent_title: 'ಡೇಟಾ ಮತ್ತು ಧ್ವನಿ ಗೌಪ್ಯತೆ ಸಮ್ಮತಿ',
            consent_subtitle: 'ಡಿಜಿಟಲ್ ವೈಯಕ್ತಿಕ ಡೇಟಾ ರಕ್ಷಣೆ ಕಾಯಿದೆ',
            consent_audio_btn: 'ಸಮ್ಮತಿಯನ್ನು ಕನ್ನಡದಲ್ಲಿ ಕೇಳಿ',
            consent_desc: 'FlexiPay AI ಬಳಸಲು ನಿಮ್ಮ ಸಮ್ಮತಿ ಅಗತ್ಯವಿದೆ:',
            consent_li1: '🎙️ ಭಾಷಿಣಿ ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆಗೆ ಧ್ವನಿ ತುಣುಕು.',
            consent_li2: '💰 ವಹಿವಾಟು ವಿವರಗಳು.',
            consent_li3: '🌾 ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ ಅರ್ಹತೆ.',
            consent_notice: 'ಸೂಚನೆ: ವಹಿವಾಟಿಗೆ 4-ಅಂಕಿಯ UPI PIN ಕಡ್ಡಾಯವಾಗಿದೆ.',
            consent_accept: 'ಸಮ್ಮತಿಸಿ ಮತ್ತು ಮುಂದುವರಿಯಿರಿ',
            consent_decline: 'ನಿಯಮಗಳನ್ನು ಮಾತ್ರ ನೋಡಿ',
            pin_title: '4-ಅಂಕಿಯ UPI PIN ನಮೂದಿಸಿ',
            pin_subtitle: 'PIN ಹಣ ರವಾನೆಯನ್ನು ಅಧಿಕೃತಗೊಳಿಸುತ್ತದೆ.',
            pin_cancel: 'ವಹಿವಾಟು ರದ್ದುಗೊಳಿಸಿ',
            scenarios: {
                transfer: {
                    title: 'ರಮೇಶ್‌ಗೆ ₹500 ಕಳುಹಿಸಿ',
                    desc: 'ವಹಿವಾಟು + UPI PIN',
                    transcript: 'ರಮೇಶ್‌ಗೆ ಬೀಜಗಳಿಗಾಗಿ ₹500 ಕಳುಹಿಸಿ',
                    speech: 'ರಮೇಶ್‌ಗೆ ₹500 ಕಳುಹಿಸಲು ವಿನಂತಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆ. UPI PIN ನಮೂದಿಸಿ.'
                },
                vishing: {
                    title: 'ವಂಚನೆ ಎಚ್ಚರಿಕೆ (Vishing)',
                    desc: 'ನಕಲಿ ಬ್ಯಾಂಕ್ ಅಧಿಕಾರಿ OTP ಕೇಳುತ್ತಿದ್ದಾನೆ',
                    transcript: 'ಬ್ಯಾಂಕ್ ಮ್ಯಾನೇಜರ್ ಕರೆ ಮಾಡಿ OTP ಕೇಳುತ್ತಿದ್ದಾರೆ',
                    speech: 'ಎಚ್ಚರಿಕೆ! ಬ್ಯಾಂಕ್ ಅಧಿಕಾರಿಗಳು ಎಂದಿಗೂ OTP ಕೇಳುವುದಿಲ್ಲ. ನೀಡಬೇಡಿ!'
                },
                kcc: {
                    title: 'ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ (KCC)',
                    desc: '₹2 ಲಕ್ಷದವರೆಗೆ ಜಮಾನತು ರಹಿತ ಸಾಲ',
                    transcript: 'ನನಗೆ KCC ಮೂಲಕ ₹2 ಲಕ್ಷ ಸಾಲ ಸಿಗುತ್ತದೆಯೇ?',
                    speech: 'ಹೌದು! 4% ಬಡ್ಡಿ ರಿಯಾಯಿತಿಯಲ್ಲಿ ₹2 ಲಕ್ಷದವರೆಗೆ ಸಾಲ ಪಡೆಯಬಹುದು.'
                },
                scheme: {
                    title: 'ಪಿಎಂ ಕಿಸಾನ್ ಸ್ಥಿತಿ',
                    desc: '16 ನೇ ಕಂತು ಪರಿಶೀಲನೆ',
                    transcript: 'ನನ್ನ ಪಿಎಂ ಕಿಸಾನ್ 16 ನೇ ಕಂತಿನ ಸ್ಥಿತಿ ನೋಡಿ',
                    speech: 'ನಿಮ್ಮ ಪಿಎಂ ಕಿಸಾನ್ 16 ನೇ ಕಂತು ₹2,000 ಖಾತೆಗೆ ಜಮೆಯಾಗಿದೆ.'
                }
            }
        },
        'bn-IN': {
            lang_display: 'Bengali (বাংলা)',
            brand_subtitle: 'গ্রামীণ ডিজিটাল ব্যাংকিং ও প্রকল্প সহকারী',
            status_consent: 'DPDP 2025 সম্মতি নথিভুক্ত',
            status_bhashini: 'ব্যাংকিং ভাষিণী সক্রিয়',
            status_rbi: 'RBI 2026 2FA PIN গেট',
            tab_smartphone: 'স্মার্টফোন মোড (ভয়েস UI)',
            tab_ivr: 'ফিচার ফোন IVR (UPI 123Pay)',
            tab_bankmitra: 'ব্যাংক মিত্র কনসোল',
            heading_voice: 'বহুভাষিক ভয়েস সহকারী',
            speech_idle: 'কথা বলতে মাইক্রোফোনে ট্যাপ করুন',
            speech_listening: '🎙️ শুনছি... এখন বলুন',
            speech_speaking: '🔊 সহকারী কথা বলছে...',
            mic_hint_prefix: 'কথা বলতে চাপুন:',
            nlu_title: 'ভয়েস-টু-টেক্সট ও ব্যাংকিং ভাষিণী NLU',
            heading_scenarios: 'নমুনা ভয়েস কমান্ড',
            heading_preview: 'ফর্ম পূর্বরূপ',
            badge_awaiting_pin: 'PIN প্রয়োজন',
            heading_scam_guardian: 'জালিয়াতি প্রতিরোধ সুরক্ষা',
            heading_kcc: 'কিষাণ ক্রেডিট কার্ড (KCC) হাব',
            kcc_subtitle: 'কেন্দ্রীয় বাজেট 2025-26 প্রকল্পসমূহ',
            kcc_label_credit: 'প্রয়োজনীয় ঋণের পরিমাণ:',
            kcc_label_savings: 'বার্ষিক সুদের ছাড় সঞ্চয়:',
            btn_kcc_reminder: 'ভয়েস রিমাইন্ডার সেট করুন',
            heading_audit: 'লাইভ অডিট কনসোল',
            btn_clear_logs: 'লগ মুছুন',
            footer_title: 'FlexiPay AI — গ্রামীণ ডিজিটাল ব্যাংকিং সহকারী',
            footer_sub: 'RBI 2025/2026 এবং DPDP 2025 বিধি মেনে গঠিত।',
            consent_badge: 'DPDP 2025 সম্মতি',
            consent_title: 'ডাটা ও ভয়েস গোপনীয়তা সম্মতি',
            consent_subtitle: 'ডিজিটাল ব্যক্তিগত ডাটা সুরক্ষা আইন',
            consent_audio_btn: 'বাংলায় সম্মতি শুনুন',
            consent_desc: 'FlexiPay AI ব্যবহারের জন্য সম্মতি আবশ্যক:',
            consent_li1: '🎙️ ভাষিণী ভয়েস স্বীকৃতির জন্য ভয়েস রেকর্ড।',
            consent_li2: '💰 লেনদেনের বিবরণ।',
            consent_li3: '🌾 কিষাণ ক্রেডিট কার্ডের যোগ্যতা।',
            consent_notice: 'বিজ্ঞপ্তি: লেনদেনের জন্য ৪ সংখ্যার UPI PIN বাধ্যতামূলক।',
            consent_accept: 'সম্মত হন এবং এগিয়ে যান',
            consent_decline: 'শুধুমাত্র শর্তাবলী দেখুন',
            pin_title: '৪ সংখ্যার UPI PIN দিন',
            pin_subtitle: 'PIN অর্থ স্থানান্তর অনুমোদন করে।',
            pin_cancel: 'লেনদেন বাতিল করুন',
            scenarios: {
                transfer: {
                    title: 'রমেশকে ₹৫০০ পাঠান',
                    desc: 'লেনদেন + UPI PIN',
                    transcript: 'রমেশকে বীজের জন্য ৫০০ টাকা পাঠাও',
                    speech: 'রমেশকে ৫০০ টাকা পাঠানোর অনুরোধ গৃহীত হয়েছে। UPI PIN দিন।'
                },
                vishing: {
                    title: 'জালিয়াতি সতর্কতা (Vishing)',
                    desc: 'ভুয়া ব্যাংক কর্মকর্তা OTP চাচ্ছে',
                    transcript: 'ব্যাংক ম্যানেজার ফোন করে OTP চাচ্ছেন',
                    speech: 'সতর্কতা! ব্যাংক কর্মকর্তারা কখনো ফোনে OTP চান না। দেবেন না!'
                },
                kcc: {
                    title: 'কিষাণ ক্রেডিট কার্ড (KCC)',
                    desc: '₹২ লাখ পর্যন্ত জামানতহীন ঋণ',
                    transcript: 'আমি কি KCC থেকে ২ লাখ টাকা ঋণ পাব?',
                    speech: 'হ্যাঁ! ৪% সুদে ২ লাখ টাকা পর্যন্ত জামানতহীন ঋণ পেতে পারেন।'
                },
                scheme: {
                    title: 'পিএম কিষাণ অবস্থা',
                    desc: '১৬তম কিস্তি পরীক্ষা',
                    transcript: 'আমার পিএম কিষাণ ১৬তম কিস্তির অবস্থা দেখুন',
                    speech: 'আপনার পিএম কিষাণের ১৬তম কিস্তি ₹২,০০০ অ্যাকাউন্টে জমা হয়েছে।'
                }
            }
        },
        'pa-IN': {
            lang_display: 'Punjabi (ਪੰਜਾਬੀ)',
            brand_subtitle: 'ਗ੍ਰਾਮੀਣ ਡਿਜੀਟਲ ਬੈਂਕਿੰਗ ਅਤੇ ਯੋਜਨਾ ਸਹਾਇਕ',
            status_consent: 'DPDP 2025 ਸਹਿਮਤੀ ਦਰਜ',
            status_bhashini: 'ਬੈਂਕਿੰਗ ਭਾਸ਼ਿਣੀ ਸਰਗਰਮ',
            status_rbi: 'RBI 2026 2FA PIN ਗੇਟ',
            tab_smartphone: 'ਸਮਾਰਟਫੋਨ ਮੋਡ',
            tab_ivr: 'ਫੀਚਰ ਫੋਨ IVR (UPI 123Pay)',
            tab_bankmitra: 'ਬੈਂਕ ਮਿੱਤਰ ਕੰਸੋਲ',
            heading_voice: 'ਬਹੁਭਾਸ਼ਾਈ ਆਵਾਜ਼ ਸਹਾਇਕ',
            speech_idle: 'ਬੋਲਣ ਲਈ ਮਾਈਕ੍ਰੋਫੋਨ ਤੇ ਟੈਪ ਕਰੋ',
            speech_listening: '🎙️ ਸੁਣ ਰਿਹਾ ਹੈ... ਹੁਣ ਬੋਲੋ',
            speech_speaking: '🔊 ਸਹਾਇਕ ਬੋਲ ਰਿਹਾ ਹੈ...',
            mic_hint_prefix: 'ਬੋਲਣ ਲਈ ਦਬਾਓ:',
            nlu_title: 'ਆਵਾਜ਼-ਤੋਂ-ਟੈਕਸਟ & ਭਾਸ਼ਿਣੀ NLU',
            heading_scenarios: 'ਨਮੂਨਾ ਆਵਾਜ਼ ਕਮਾਂਡਾਂ',
            heading_preview: 'ਫਾਰਮ ਪੂਰਵਦਰਸ਼ਨ',
            badge_awaiting_pin: 'PIN ਦੀ ਲੋੜ ਹੈ',
            heading_scam_guardian: 'ਧੋਖਾਧੜੀ ਰੋਕਥਾਮ ਸੁਰੱਖਿਆ',
            heading_kcc: 'ਕਿਸਾਨ ਕ੍ਰੈਡਿਟ ਕਾਰਡ (KCC) ਹੱਬ',
            kcc_subtitle: 'ਕੇਂਦਰੀ ਬਜਟ 2025-26 ਯੋਜਨਾਵਾਂ',
            kcc_label_credit: 'ਲੋੜੀਂਦੀ ਕਰਜ਼ਾ ਰਕਮ:',
            kcc_label_savings: 'ਸਾਲਾਨਾ ਵਿਆਜ ਛੋਟ ਬੱਚਤ:',
            btn_kcc_reminder: 'ਆਵਾਜ਼ ਰੀਮਾਈਂਡਰ ਸੈੱਟ ਕਰੋ',
            heading_audit: 'ਲਾਈਵ ਆਡਿਟ ਕੰਸੋਲ',
            btn_clear_logs: 'ਲੌਗ ਸਾਫ਼ ਕਰੋ',
            footer_title: 'FlexiPay AI — ਗ੍ਰਾਮੀਣ ਡਿਜੀਟਲ ਬੈਂਕਿੰਗ ਸਹਾਇਕ',
            footer_sub: 'RBI 2025/2026 ਅਤੇ DPDP 2025 ਨਿਯਮਾਂ ਅਨੁਸਾਰ।',
            consent_badge: 'DPDP 2025 ਸਹਿਮਤੀ',
            consent_title: 'ਡੇਟਾ ਅਤੇ ਆਵਾਜ਼ ਗੋਪਨੀਯਤਾ ਸਹਿਮਤੀ',
            consent_subtitle: 'ਡਿਜੀਟਲ ਨਿੱਜੀ ਡੇਟਾ ਸੁਰੱਖਿਆ ਕਾਨੂੰਨ',
            consent_audio_btn: 'ਪੰਜਾਬੀ ਵਿੱਚ ਸਹਿਮਤੀ ਸੁਣੋ',
            consent_desc: 'FlexiPay AI ਵਰਤਣ ਲਈ ਸਹਿਮਤੀ ਲਾਜ਼ਮੀ ਹੈ:',
            consent_li1: '🎙️ ਭਾਸ਼ਿਣੀ ਆਵਾਜ਼ ਪਛਾਣ ਲਈ ਆਡੀਓ।',
            consent_li2: '💰 ਲੈਣ-ਦੇਣ ਦੇ ਵੇਰਵੇ।',
            consent_li3: '🌾 ਕਿਸਾਨ ਕ੍ਰੈਡਿਟ ਕਾਰਡ ਯੋਗਤਾ।',
            consent_notice: 'ਨੋਟਿਸ: ਲੈਣ-ਦੇਣ ਲਈ 4-ਅੰਕਾਂ ਦਾ UPI PIN ਲਾਜ਼ਮੀ ਹੈ।',
            consent_accept: 'ਸਵੀਕਾਰ ਕਰੋ ਅਤੇ ਅੱਗੇ ਵਧੋ',
            consent_decline: 'ਸਿਰਫ਼ ਸ਼ਰਤਾਂ ਦੇਖੋ',
            pin_title: '4-ਅੰਕਾਂ ਦਾ UPI PIN ਦਰਜ ਕਰੋ',
            pin_subtitle: 'PIN ਰਕਮ ਟ੍ਰਾਂਸਫਰ ਨੂੰ ਅਧਿਕਾਰਤ ਕਰਦਾ ਹੈ।',
            pin_cancel: 'ਲੈਣ-ਦੇਣ ਰੱਦ ਕਰੋ',
            scenarios: {
                transfer: {
                    title: 'ਰਮੇਸ਼ ਨੂੰ ₹500 ਭੇਜੋ',
                    desc: 'ਲੈਣ-ਦੇਣ + UPI PIN',
                    transcript: 'ਰਮੇਸ਼ ਨੂੰ ਬੀਜਾਂ ਲਈ ₹500 ਭੇਜੋ',
                    speech: 'ਰਮੇਸ਼ ਨੂੰ ₹500 ਭੇਜਣ ਦੀ ਬੇਨਤੀ ਮਿਲੀ ਹੈ। UPI PIN ਦਰਜ ਕਰੋ।'
                },
                vishing: {
                    title: 'ਧੋਖਾਧੜੀ ਚੇਤਾਵਨੀ (Vishing)',
                    desc: 'ਨਕਲੀ ਬੈਂਕ ਅਧਿਕਾਰੀ OTP ਮੰਗ ਰਿਹਾ ਹੈ',
                    transcript: 'ਬੈਂਕ ਮੈਨੇਜਰ ਦਾ ਫੋਨ ਆਇਆ ਹੈ OTP ਮੰਗ ਰਹੇ ਹਨ',
                    speech: 'ਚੇਤਾਵਨੀ! ਬੈਂਕ ਅਧਿਕਾਰੀ ਕਦੇ ਫੋਨ ਤੇ OTP ਨਹੀਂ ਮੰਗਦੇ। ਨਾ ਦਿਓ!'
                },
                kcc: {
                    title: 'ਕਿਸਾਨ ਕ੍ਰੈਡਿਟ ਕਾਰਡ (KCC)',
                    desc: '₹2 ਲੱਖ ਤੱਕ ਬਿਨਾਂ ਗਾਰੰਟੀ ਕਰਜ਼ਾ',
                    transcript: 'ਕੀ ਮੈਨੂੰ KCC ਤੋਂ ₹2 ਲੱਖ ਦਾ ਕਰਜ਼ਾ ਮਿਲੇਗਾ?',
                    speech: 'ਹਾਂ! 4% ਵਿਆਜ ਦਰ ਤੇ ₹2 ਲੱਖ ਤੱਕ ਕਰਜ਼ਾ ਮਿਲ ਸਕਦਾ ਹੈ।'
                },
                scheme: {
                    title: 'ਪੀਐਮ ਕਿਸਾਨ ਸਥਿਤੀ',
                    desc: '16ਵੀਂ ਕਿਸ਼ਤ ਦੀ ਜਾਂਚ',
                    transcript: 'ਮੇਰੀ ਪੀਐਮ ਕਿਸਾਨ 16ਵੀਂ ਕਿਸ਼ਤ ਦੀ ਸਥਿਤੀ ਦੇਖੋ',
                    speech: 'ਤੁਹਾਡੀ ਪੀਐਮ ਕਿਸਾਨ ਦੀ 16ਵੀਂ ਕਿਸ਼ਤ ₹2,000 ਖਾਤੇ ਵਿੱਚ ਆ ਗਈ ਹੈ।'
                }
            }
        }
    };

    // Full Dynamic Page Translation Engine
    function updatePageLanguage(langCode) {
        state.language = langCode;
        const dict = i18n[langCode] || i18n['en-IN'];
        
        // Update current language indicator badge
        if (elements.currentLangName) {
            elements.currentLangName.textContent = dict.lang_display;
        }

        // Translate all data-i18n tagged elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) {
                el.textContent = dict[key];
            }
        });

        // Translate status text if listening/idle
        if (!state.isListening && elements.speechStatusText) {
            elements.speechStatusText.textContent = dict.speech_idle;
        }

        // Translate Quick Scenario Cards in real time
        const scenarioBtns = document.querySelectorAll('.scenario-btn');
        scenarioBtns.forEach(btn => {
            const scenarioKey = btn.getAttribute('data-scenario');
            if (dict.scenarios && dict.scenarios[scenarioKey]) {
                const sData = dict.scenarios[scenarioKey];
                const strongTag = btn.querySelector('strong');
                const smallTag = btn.querySelector('small');
                if (strongTag) strongTag.textContent = sData.title;
                if (smallTag) smallTag.textContent = sData.desc;
            }
        });

        // Update default transcript view
        if (dict.scenarios && dict.scenarios.transfer && elements.liveTranscript) {
            elements.liveTranscript.textContent = `"${dict.scenarios.transfer.transcript}"`;
        }

        logEvent(`[I18N] Entire application language dynamically updated to: ${dict.lang_display}`, "success");
    }

    // Canvas Waveform Animation Setup
    const ctx = elements.canvas.getContext('2d');
    let animationFrameId;

    function drawWaveform(active = false) {
        ctx.clearRect(0, 0, elements.canvas.width, elements.canvas.height);
        const width = elements.canvas.width;
        const height = elements.canvas.height;
        const centerY = height / 2;

        ctx.beginPath();
        ctx.lineWidth = active ? 3 : 1.5;
        ctx.strokeStyle = active ? '#10b981' : '#3b82f6';

        const time = Date.now() * 0.005;
        for (let x = 0; x < width; x += 2) {
            const freq = active ? 0.05 : 0.02;
            const amp = active ? 25 * Math.sin(x * 0.01 + time) : 5;
            const y = centerY + Math.sin(x * freq + time) * amp;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        animationFrameId = requestAnimationFrame(() => drawWaveform(state.isListening));
    }
    drawWaveform(false);

    // Audio Speech Synthesis Wrapper
    function speakText(text, lang = state.language) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            utterance.rate = 0.95;
            
            utterance.onstart = () => {
                state.isListening = true;
                const dict = i18n[state.language] || i18n['en-IN'];
                elements.speechStatusText.textContent = dict.speech_speaking;
            };
            utterance.onend = () => {
                state.isListening = false;
                const dict = i18n[state.language] || i18n['en-IN'];
                elements.speechStatusText.textContent = dict.speech_idle;
            };
            window.speechSynthesis.speak(utterance);
        }
    }

    // Sound Synthesizer for Keypad DTMF Beeps
    function playBeep(freq = 440, type = 'sine', duration = 0.15) {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const audioCtx = new AudioContext();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {
            // Audio context fallback
        }
    }

    // Logger Utility
    function logEvent(msg, type = 'info') {
        const time = new Date().toLocaleTimeString();
        const line = document.createElement('div');
        line.className = `log-line ${type}`;
        line.textContent = `[${time}] ${msg}`;
        elements.systemLogTerminal.appendChild(line);
        elements.systemLogTerminal.scrollTop = elements.systemLogTerminal.scrollHeight;
    }

    // DPDP Act Consent Modal Handlers
    elements.btnConsentAccept.addEventListener('click', () => {
        state.consentGiven = true;
        elements.consentModal.classList.remove('active');
        elements.consentModal.classList.add('hidden');
        const dict = i18n[state.language] || i18n['en-IN'];
        elements.consentStatusText.textContent = dict.status_consent;
        logEvent("[DPDP ACT 2025] Explicit voice & data consent granted by user. Hash logged.", "success");
        
        if (state.language.startsWith('hi')) {
            speakText("धन्यवाद। फ्लेक्सीपे AI में आपका स्वागत है। आप अपनी भाषा में बोल सकते हैं।");
        } else {
            speakText("Thank you. Welcome to FlexiPay AI. You can now speak in your selected language.");
        }
    });

    elements.btnConsentDecline.addEventListener('click', () => {
        elements.consentModal.classList.remove('active');
        elements.consentModal.classList.add('hidden');
        logEvent("[DPDP ACT 2025] Consent window dismissed. Read-only preview mode.", "warn");
    });

    elements.btnPlayConsentAudio.addEventListener('click', () => {
        if (state.language.startsWith('hi')) {
            speakText("फ्लेक्सीपे AI आपके वॉयस रिकॉर्डिंग और वित्तीय विवरण का उपयोग बैंकिंग भषिणी और योजना मैचिंग के लिए करता है। आपका पैसा बिना UPI PIN के ट्रांसफर नहीं होगा।");
        } else {
            speakText("FlexiPay AI captures your voice audio and financial details strictly for speech recognition and government scheme matching. Your money is never transferred without your 4-digit UPI PIN.");
        }
    });

    // Theme Toggle
    elements.btnToggleTheme.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        elements.btnToggleTheme.textContent = isLight ? '☀️' : '🌙';
        logEvent(`[UI] Switched to ${isLight ? 'Light' : 'Dark'} visual mode.`);
    });

    // Language Selector Event Handler - Dynamically translates entire page
    elements.selectLanguage.addEventListener('change', (e) => {
        const selectedLang = e.target.value;
        updatePageLanguage(selectedLang);
    });

    // Channel Switching
    elements.channelTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            elements.channelTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const targetChannel = tab.getAttribute('data-channel');
            state.activeChannel = targetChannel;

            elements.channelViews.forEach(view => {
                if (view.id === `channel-${targetChannel}`) {
                    view.classList.remove('hidden');
                    view.classList.add('active');
                } else {
                    view.classList.add('hidden');
                    view.classList.remove('active');
                }
            });

            logEvent(`[CHANNEL] Switched active access channel to: ${targetChannel.toUpperCase()}`);
        });
    });

    // Preset Rural Scenarios Engine (Multilingual)
    function triggerScenario(key) {
        const dict = i18n[state.language] || i18n['en-IN'];
        const scenarioConfig = dict.scenarios[key] || i18n['en-IN'].scenarios[key];
        if (!scenarioConfig) return;

        elements.liveTranscript.textContent = `"${scenarioConfig.transcript}"`;
        
        let intentCode = "P2P_TRANSFER";
        let recipientName = "Ramesh (Seeds Purchase)";
        let amountVal = "₹500.00";
        
        if (key === 'vishing') {
            intentCode = "VISHING_SCAM_DETECTED";
            recipientName = "UNKNOWN_CALLER (Threat)";
            amountVal = "N/A";
        } else if (key === 'kcc') {
            intentCode = "KCC_LOAN_ELIGIBILITY";
            recipientName = "Kisan Rin Portal";
            amountVal = "₹2,00,000.00";
        } else if (key === 'scheme') {
            intentCode = "MY_SCHEME_CHECK";
            recipientName = "PM-KISAN DBT Portal";
            amountVal = "₹2,000.00";
        }

        elements.intentType.textContent = intentCode;
        elements.intentRecipient.textContent = recipientName;
        elements.intentAmount.textContent = amountVal;
        elements.nluConfidence.textContent = `Confidence: 98%`;

        // Reset Scam alert box status
        if (key === 'vishing') {
            elements.scamAlertBox.innerHTML = `
                <div class="scam-alert-header red">
                    <span class="alert-icon">🚨</span>
                    <div>
                        <strong>${state.language.startsWith('hi') ? 'विशिंग हमला (VISHING ATTACK) पहचाना गया!' : 'VISHING ATTACK DETECTED!'}</strong>
                        <p>${state.language.startsWith('hi') ? 'कॉलर झूठ बोलकर OTP/PIN मांग रहा है। उच्च जोखिम!' : 'Caller is asking for OTP/PIN under false pretext. High fraud probability.'}</p>
                    </div>
                </div>
            `;
            elements.scamAlertBox.parentElement.classList.add('danger-border');
            logEvent(`[FRAUD GUARDIAN] Vishing threat detected in audio stream. Threat score: 99/100.`, "danger");
        } else {
            elements.scamAlertBox.innerHTML = `
                <div class="scam-alert-header green">
                    <span class="alert-icon">✅</span>
                    <div>
                        <strong>${state.language.startsWith('hi') ? 'इनबाउंड वॉयस सुरक्षित है' : 'Inbound Voice Stream Secure'}</strong>
                        <p>${state.language.startsWith('hi') ? 'आवाज में कोई फ्रॉड या OTP मांगने के पैटर्न नहीं मिले।' : 'No vishing patterns or OTP extraction prompts detected in incoming audio.'}</p>
                    </div>
                </div>
            `;
            elements.scamAlertBox.parentElement.classList.remove('danger-border');
        }

        speakText(scenarioConfig.speech);
        logEvent(`[BHASHINI NLU] Parsed voice intent: ${intentCode} (${amountVal})`, "info");

        // If transfer, pop up preview and prepare PIN modal
        if (key === 'transfer') {
            state.currentIntent = scenarioConfig;
            elements.btnTriggerPinGate.classList.remove('hidden');
        }
    }

    elements.scenarioBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const scenarioKey = btn.getAttribute('data-scenario');
            triggerScenario(scenarioKey);
        });
    });

    // Mic Recording Simulation / Web Speech API
    elements.btnMicMain.addEventListener('click', () => {
        if (!state.consentGiven) {
            elements.consentModal.classList.remove('hidden');
            elements.consentModal.classList.add('active');
            return;
        }

        const dict = i18n[state.language] || i18n['en-IN'];

        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.lang = state.language;
            recognition.interimResults = false;

            recognition.onstart = () => {
                state.isListening = true;
                elements.btnMicMain.classList.add('listening');
                elements.speechStatusText.textContent = dict.speech_listening;
                logEvent("[SPEECH RECOGNITION] Mic recording started.", "info");
            };

            recognition.onresult = (event) => {
                const text = event.results[0][0].transcript;
                elements.liveTranscript.textContent = `"${text}"`;
                logEvent(`[SPEECH RECOGNITION] Captured text: "${text}"`, "success");
                triggerScenario('transfer');
            };

            recognition.onerror = () => {
                state.isListening = false;
                elements.btnMicMain.classList.remove('listening');
                triggerScenario('transfer'); // Fallback simulated intent
            };

            recognition.onend = () => {
                state.isListening = false;
                elements.btnMicMain.classList.remove('listening');
            };

            recognition.start();
        } else {
            // Simulated Mic Trigger
            state.isListening = true;
            elements.btnMicMain.classList.add('listening');
            elements.speechStatusText.textContent = dict.speech_listening;
            setTimeout(() => {
                state.isListening = false;
                elements.btnMicMain.classList.remove('listening');
                triggerScenario('transfer');
            }, 1800);
        }
    });

    // Mandatory RBI 2026 PIN Modal Engine
    function updatePinDisplay() {
        elements.pinDots.forEach((dot, index) => {
            if (index < state.pinEntered.length) {
                dot.classList.add('filled');
            } else {
                dot.classList.remove('filled');
            }
        });
    }

    document.querySelectorAll('.pin-btn[data-val]').forEach(btn => {
        btn.addEventListener('click', () => {
            if (state.pinEntered.length < 4) {
                state.pinEntered += btn.getAttribute('data-val');
                playBeep(600, 'sine', 0.08);
                updatePinDisplay();
            }
        });
    });

    elements.pinClear.addEventListener('click', () => {
        state.pinEntered = '';
        playBeep(300, 'sine', 0.1);
        updatePinDisplay();
    });

    elements.btnTriggerPinGate.addEventListener('click', () => {
        state.pinEntered = '';
        updatePinDisplay();
        elements.pinModal.classList.remove('hidden');
        elements.pinModal.classList.add('active');
        logEvent("[RBI 2026 2FA] Mandatory 2-Factor UPI PIN gate presented.", "warn");
    });

    elements.btnClosePinModal.addEventListener('click', () => {
        elements.pinModal.classList.remove('active');
        elements.pinModal.classList.add('hidden');
        logEvent("[TRANSACTION] Payment cancelled by user at PIN stage.");
    });

    elements.pinSubmit.addEventListener('click', () => {
        if (state.pinEntered.length === 4) {
            elements.pinModal.classList.remove('active');
            elements.pinModal.classList.add('hidden');
            
            const txRef = 'NPCI/2026/' + Math.floor(100000000 + Math.random() * 900000000);
            logEvent(`[NPCI SANDBOX] Dynamic 2FA PIN verified. Executed ₹500 transfer. Ref: ${txRef}`, "success");
            
            if (state.language.startsWith('hi')) {
                speakText("आपका ₹500 का भुगतान सफलतापूर्वक संपन्न हो गया है। एनपीसीआई रसीद संख्या " + txRef);
            } else {
                speakText("Your payment of ₹500 has been completed successfully. NPCI receipt number " + txRef);
            }
            
            alert(`✅ Payment Successful!\n\nAmount: ₹500.00\nRecipient: Ramesh (Seeds Purchase)\nNPCI Ref: ${txRef}\nCompliance: RBI 2026 2FA Verified`);
            state.pinEntered = '';
        } else {
            speakText(state.language.startsWith('hi') ? "कृपया पूरा 4 अंकों का UPI PIN दर्ज करें" : "Please enter the full 4-digit UPI PIN");
        }
    });

    // Outbound Anti-Replay Challenge Generator
    elements.btnGenPassphrase.addEventListener('click', () => {
        state.passphrase = 'Bharat ' + Math.floor(1000 + Math.random() * 9000);
        elements.dynamicPassphrase.textContent = `"${state.passphrase}"`;
        logEvent(`[FRAUD GUARDIAN] Refreshed outbound dynamic challenge phrase: ${state.passphrase}`);
    });

    elements.btnTestVishing.addEventListener('click', () => {
        triggerScenario('vishing');
    });

    // Feature Phone IVR Simulator
    elements.ivrKeyDigits.forEach(btn => {
        btn.addEventListener('click', () => {
            const digit = btn.getAttribute('data-digit');
            playBeep(800 + parseInt(digit || 0) * 50, 'triangle', 0.12);
            state.ivrDigits += digit;
            elements.ivrEnteredDigits.textContent = `DTMF Input: ${state.ivrDigits}`;

            if (digit === '1') {
                elements.ivrScreenContent.querySelector('.ivr-prompt-display').innerHTML = 
                    '"Money Transfer selected. Enter Recipient 10-digit phone number or UPI ID."';
                speakText("Money transfer selected. Enter recipient phone number.");
            } else if (digit === '2') {
                elements.ivrScreenContent.querySelector('.ivr-prompt-display').innerHTML = 
                    '"Balance Check: Your SBI Gramin Account balance is ₹14,850.00."';
                speakText("Your account balance is 14 thousand 850 rupees.");
            } else if (digit === '3') {
                elements.ivrScreenContent.querySelector('.ivr-prompt-display').innerHTML = 
                    '"KCC Status: Active Collateral-Free limit ₹1,60,000 at 4% interest subvention."';
                speakText("Your Kisan Credit Card is active at 4 percent interest subvention.");
            }
            logEvent(`[UPI 123PAY IVR] DTMF key pressed: ${digit}`, "info");
        });
    });

    elements.ivrBtnCall.addEventListener('click', () => {
        state.ivrDigits = '';
        elements.ivrEnteredDigits.textContent = "DTMF Input: -";
        elements.ivrScreenContent.querySelector('.ivr-prompt-display').innerHTML = 
            '"Welcome to Banking BHASHINI IVR. Press 1 for Money Transfer, 2 for Balance Check, 3 for KCC Loan Status."';
        playBeep(523, 'sine', 0.3);
        speakText("Welcome to Banking BHASHINI IVR. Press 1 for Money Transfer, 2 for Balance Check, 3 for KCC Loan Status.");
        logEvent("[UPI 123PAY IVR] Call connected to 08045163581.", "success");
    });

    elements.ivrBtnEnd.addEventListener('click', () => {
        elements.ivrScreenContent.querySelector('.ivr-prompt-display').innerHTML = '"CALL ENDED"';
        state.ivrDigits = '';
        logEvent("[UPI 123PAY IVR] Call disconnected.");
    });

    // Bank Mitra Console Logic
    elements.btnBmVoiceIntake.addEventListener('click', () => {
        elements.bmSlipDisplay.innerHTML = `
            <div class="slip-stamp">FLEXIPAY ASSISTED</div>
            <h3>Jan Samarth KCC Application Slip</h3>
            <hr>
            <div class="p-row"><span>Applicant:</span> <strong>Sita Devi (Village Kherli)</strong></div>
            <div class="p-row"><span>Category:</span> <strong>Tenant Farmer (Self-Declaration JLG)</strong></div>
            <div class="p-row"><span>Requested Credit:</span> <strong>₹2,00,000 (Collateral-Free)</strong></div>
            <div class="p-row"><span>Interest Subvention:</span> <strong>4% Effective Rate (Jan Samarth)</strong></div>
            <div class="p-row"><span>Voice Intake Ref:</span> <strong>BHASHINI/INTAKE/94021</strong></div>
            <div class="p-row"><span>Status:</span> <span class="text-emerald">Voice Auto-Filled & Synced with Kisan Rin</span></div>
        `;
        logEvent("[BANK MITRA CONSOLE] Voice intake completed for Sita Devi. Form pre-filled.", "success");
        speakText("Sita Devi's Kisan Credit Card form has been auto-filled successfully.");
    });

    elements.btnBmGenerateSlip.addEventListener('click', () => {
        alert("📄 Digital Slip Generated & Sent to Kisan Rin Portal!");
        logEvent("[BANK MITRA CONSOLE] Digital slip submitted to bank portal.", "success");
    });

    elements.btnBmBookKyc.addEventListener('click', () => {
        alert("📹 RBI Video-KYC slot scheduled for tomorrow at 11:00 AM.");
        logEvent("[BANK MITRA CONSOLE] Video-KYC slot booked.");
    });

    // KCC Calculator Logic
    elements.kccRangeAmount.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        state.kccAmount = val;
        elements.kccValAmount.textContent = `₹${val.toLocaleString('en-IN')}`;
        
        // Yearly savings calculation (9% - 4% = 5% savings)
        const savings = Math.round(val * 0.05);
        elements.kccSavingsAmt.textContent = `₹${savings.toLocaleString('en-IN')} / year`;
    });

    elements.btnScheduleKccReminder.addEventListener('click', () => {
        speakText("Voice reminder scheduled for Kisan Credit Card repayment.");
        alert("⏰ Voice Repayment Reminder Scheduled 15 Days Before Due Date!\n\nThis protects your 3% interest subvention, keeping your rate at 4%.");
        logEvent("[KCC HUB] Repayment voice reminder registered in scheduler.", "success");
    });

    elements.btnAutofillKccList.forEach(btn => {
        btn.addEventListener('click', () => {
            alert("📝 Jan Samarth Portal application auto-filled from Kisan Credit Card profile!");
            logEvent("[KCC HUB] Jan Samarth application form auto-filled.", "info");
        });
    });

    // Clear Logs
    elements.btnClearLogs.addEventListener('click', () => {
        elements.systemLogTerminal.innerHTML = '';
        logEvent("[SYSTEM] Console cleared.");
    });

    // INITIALIZATION: Apply English as default language across full page
    updatePageLanguage('en-IN');
});
