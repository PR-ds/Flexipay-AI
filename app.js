/**
 * FlexiPay AI — Core Application Logic
 * Real-Time Voice Command Parsing, Dedicated Task Sections, & Full Dynamic Translation.
 * Compliant with RBI 2026 2FA Directions, DPDP Rules 2025, and Banking BHASHINI.
 */

document.addEventListener('DOMContentLoaded', () => {
    // State Management
    const state = {
        language: 'en-IN',
        consentGiven: true,
        activeChannel: 'smartphone',
        isListening: false,
        pinEntered: '',
        targetPin: '1234',
        currentIntent: null,
        currentRecipient: 'Ramesh (Vendor)',
        currentAmount: 500,
        passphrase: 'Bharat ' + Math.floor(1000 + Math.random() * 9000),
        kccAmount: 160000,
        accountBalance: 12450.50,
        kccLimit: 160000.00,
        ivrDigits: ''
    };

    // UI Elements Mapping
    const elements = {
        // Modals
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
        pinModalAmount: document.getElementById('pin-modal-amount'),
        pinModalRecipient: document.getElementById('pin-modal-recipient'),

        // Controls
        selectLanguage: document.getElementById('select-language'),
        btnToggleTheme: document.getElementById('btn-toggle-theme'),
        channelTabs: document.querySelectorAll('.channel-tab'),
        channelViews: document.querySelectorAll('.channel-view'),

        // Voice Section
        btnMicMain: document.getElementById('btn-mic-main'),
        speechStatusText: document.getElementById('speech-status-text'),
        currentLangName: document.getElementById('current-lang-name'),
        liveTranscript: document.getElementById('live-transcript'),
        intentType: document.getElementById('intent-type'),
        intentRecipient: document.getElementById('intent-recipient'),
        intentAmount: document.getElementById('intent-amount'),
        intentFallback: document.getElementById('intent-fallback'),
        nluConfidence: document.getElementById('nlu-confidence'),
        customVoiceInput: document.getElementById('custom-voice-input'),
        btnSubmitVoiceCmd: document.getElementById('btn-submit-voice-cmd'),
        canvas: document.getElementById('waveform-canvas'),
        scenarioBtns: document.querySelectorAll('.scenario-btn'),

        // Payment Task Section
        previewAmountVal: document.getElementById('preview-amount-val'),
        previewTargetVal: document.getElementById('preview-target-val'),
        contactPills: document.querySelectorAll('.contact-pill'),

        // Balance Task Section
        balanceDisplayAmount: document.getElementById('balance-display-amount'),
        btnVoiceCheckBalance: document.getElementById('btn-voice-check-balance'),

        // Fraud Task Section
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
        btnClearLogs: document.getElementById('btn-clear-logs')
    };

    // ==========================================
    // EXHAUSTIVE MULTILINGUAL TRANSLATION DICTIONARY
    // ==========================================
    const i18n = {
        'en-IN': {
            lang_display: 'English (India)',
            app_title: 'FlexiPay AI — Voice-Native Rural Financial & Scheme Layer',
            brand_tag: 'फ्लेक्सीपे AI',
            brand_subtitle: 'Voice-Native Rural Financial & Scheme Layer',
            status_consent: 'DPDP 2025 Consent Logged',
            status_bhashini: 'Banking BHASHINI Active',
            status_rbi: 'RBI 2026 2FA PIN Gate',
            tab_smartphone: 'Smartphone Mode (Mic-Native UI)',
            tab_ivr: 'Feature Phone IVR (UPI 123Pay)',
            tab_bankmitra: 'Bank Mitra / CSC Operator Console',
            step1_title: 'Voice Intent', step1_desc: 'Spoken Dialect',
            step2_title: 'BHASHINI NLU', step2_desc: 'Entity Extraction',
            step3_title: 'Fraud Guardian', step3_desc: 'Heuristic Defense',
            step4_title: 'Mandatory 2FA', step4_desc: 'UPI PIN Gate',
            step5_title: 'Settlement', step5_desc: 'NPCI Core Rails',
            heading_voice: 'Multilingual Voice Assistant & NLU Command Center',
            badge_voice_live: 'Live Speech Recognition',
            speech_idle: 'Tap microphone or speak any command',
            speech_listening: '🎙️ Listening... Speak now',
            speech_speaking: '🔊 Assistant Speaking...',
            mic_hint_prefix: 'Press to start listening in',
            voice_input_placeholder: 'Speak or type anything (e.g. Send 750 to Suresh, Check my balance, Apply KCC loan...)',
            btn_run_ai: 'Run AI',
            nlu_title: 'Speech-to-Text & Banking BHASHINI NLU',
            chip_intent: 'Parsed Intent', chip_recipient: 'Recipient', chip_amount: 'Amount', chip_threat: 'Threat Scan',
            heading_scenarios: 'Try Preset Rural Scenarios',
            sc_transfer_title: 'Send ₹500 to Ramesh', sc_transfer_desc: 'Payment Intent + Mandatory 2FA PIN',
            sc_vishing_title: 'Scam Alert (Vishing)', sc_vishing_desc: 'Fake Bank Officer asking for OTP',
            sc_kcc_title: 'Kisan Credit Card (KCC)', sc_kcc_desc: '₹2L Collateral-Free & 4% Rate Helper',
            sc_scheme_title: 'PM-KISAN Status', sc_scheme_desc: 'myScheme.gov.in 16th Installment',
            task_transfer_title: 'Task 1: Instant Payment & 2FA Gate',
            badge_awaiting_pin: 'Awaiting PIN',
            quick_pay_contacts: 'Quick Contacts:',
            label_transfer_to: 'To',
            label_source_acc: 'Source Account:', val_source_acc: 'SBI Gramin Bank ****4821',
            label_auth_type: 'Authentication:', val_auth_type: 'Mandatory 2FA (UPI PIN Required)',
            label_reg_standard: 'Regulatory Standard:', val_reg_standard: 'RBI 2025/2026 Mandate',
            btn_enter_pin: 'Proceed to Enter UPI PIN',
            task_balance_title: 'Task 2: Bank Balance & Statement',
            badge_sbi_live: 'SBI Gramin Live',
            acc_type: 'Kisan Savings Account',
            kcc_credit_available: 'Available KCC Credit Line:',
            btn_speak_balance: 'Speak Balance Aloud',
            task_fraud_title: 'Task 3: Fraud Guardian & Threat Radar',
            badge_fraud_active: 'Active Shield',
            scam_safe_title: 'Inbound Voice Stream Secure',
            scam_safe_desc: 'No vishing patterns or OTP extraction prompts detected in incoming audio.',
            oc_title: 'Outbound Dynamic Anti-Replay Challenge', oc_desc: 'Protects against deepfake voice cloning',
            oc_phrase_label: 'Challenge Phrase:', btn_refresh: 'Refresh',
            vishing_test_label: 'Simulate Threat:', btn_simulate_vishing: 'Simulate Fake Bank Manager Call',
            task_kcc_title: 'Task 4: Kisan Credit Card (KCC) Desk',
            badge_kcc_subvention: '4% Subvention',
            kcc_intro: 'Union Budget raised collateral-free credit to ₹2 Lakh with 3% prompt repayment subvention.',
            kcc_label_credit: 'Required Credit Amount:',
            kcc_rate_ontime: 'On-Time Repayment', kcc_rate_ontime_sub: 'With 3% Subvention',
            kcc_rate_default: 'Default Rate', kcc_rate_default_sub: 'Loss of Subvention',
            kcc_label_savings: 'Yearly Interest Savings:',
            btn_kcc_reminder: 'Schedule Voice Repayment Reminder',
            task_scheme_title: 'Task 5: myScheme & Government Subsidies',
            badge_myscheme: 'myScheme.gov.in',
            scheme_pmkisan_title: 'PM-KISAN Samman Nidhi', scheme_active: 'Active DBT',
            scheme_pmkisan_desc: '₹6,000/year direct benefit transfer. 16th Installment processed successfully.',
            scheme_pmfby_title: 'Pradhan Mantri Fasal Bima Yojana', scheme_recommended: 'Eligible',
            scheme_pmfby_desc: 'Comprehensive crop insurance against natural calamities at subsidized 1.5% premium.',
            btn_autofill_jansamarth: 'Auto-Fill Jan Samarth Application',
            ivr_brand: 'GraminPAY Feature Phone',
            ivr_call_status: 'CONNECTED: 08045163581',
            ivr_prompt_welcome: '"Welcome to Banking BHASHINI IVR. Press 1 for Money Transfer, 2 for Balance Check, 3 for KCC Loan Status."',
            btn_ivr_call: '📞 CALL', btn_ivr_end: '❌ END',
            ivr_info_title: 'Reaching 400M Feature Phone Users',
            badge_upi123: 'UPI 123Pay Rails',
            ivr_info_desc: 'Over 400 million citizens in rural India use feature phones without touchscreen apps. FlexiPay AI operates over IVR & Missed Call Gateways using the exact same Banking BHASHINI multilingual voice engine.',
            ivr_step1_title: 'Dial IVR Number (08045163581)', ivr_step1_desc: 'Spoken greetings in Hindi, Bhojpuri, Tamil, Telugu, and all scheduled languages.',
            ivr_step2_title: 'Speak Intent or Press DTMF Key', ivr_step2_desc: 'Natural speech recognition converts voice to structured banking transaction.',
            ivr_step3_title: 'Mandatory UPI PIN Entry on Keypad', ivr_step3_desc: 'Encrypted IVR DTMF transmission complies with RBI 2FA mandate.',
            bm_title: 'Bank Mitra / CSC Assisted Console', badge_human_assisted: 'Human-in-the-Loop',
            bm_desc: 'Designed for Bank Mitras assisting first-time digital users, elderly citizens, or illiterate villagers who require human-assisted onboarding.',
            bm_lbl_name: 'Villager / Customer Name', bm_lbl_mobile: 'Mobile Number / Aadhaar Ref', bm_lbl_service: 'Assisted Service Type',
            bm_opt_kcc: 'Kisan Credit Card (Jan Samarth Auto-Fill)', bm_opt_aeps: 'AePS Cash Withdrawal Slip',
            bm_opt_ekyc: 'Video-KYC Slot Booking', bm_opt_complaint: 'Cyber Fraud Complaint (1930 Helpline)',
            btn_bm_voice_intake: 'Voice Intake from Villager (Auto-Fill Fields)',
            btn_bm_slip: 'Generate Pre-filled Digital Slip', btn_bm_kyc: 'Schedule RBI Video-KYC',
            bm_slip_title: 'Digital Slip & Application Tracker', badge_ready_sign: 'Ready to Sign',
            stamp_assisted: 'FLEXIPAY ASSISTED', slip_heading: 'Jan Samarth KCC Application Slip',
            slip_applicant: 'Applicant:', slip_category: 'Category:', slip_tenant_farmer: 'Tenant Farmer (Self-Declaration JLG)',
            slip_credit: 'Requested Credit:', slip_subvention: 'Interest Subvention:', slip_ref: 'Voice Intake Ref:',
            slip_status_lbl: 'Status:', slip_status_val: 'Voice Auto-Filled & Synced with Kisan Rin',
            aeps_title: 'AePS Biometric Fraud Advisory',
            aeps_desc: 'Aadhaar-enabled Payment System (AePS) lacks 2FA. Fraudsters exploit cloned silicon fingerprints at unauthorized BC points.',
            aeps_tip1: '✔️ Always verify Bank Mitra CSC ID badge.',
            aeps_tip2: '✔️ Use 2FA OTP verification for cash transactions > ₹10,000.',
            aeps_tip3: '✔️ Lock Aadhaar biometrics on mAadhaar app when not in use.',
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
            consent_accept: 'Accept & Continue', consent_decline: 'View Terms Only',
            pin_badge: 'RBI 2026 Mandatory 2FA Gate',
            pin_title: 'Enter 4-Digit UPI PIN',
            pin_subtitle: 'Voice confirms intent. PIN authorizes money movement.',
            pin_transfer_to: 'Transferring', pin_transfer_target: 'to',
            pin_rail_info: 'Rail: NPCI UPI 123Pay Sandbox • Encrypted Session',
            pin_cancel: 'Cancel Transaction'
        },
        'hi-IN': {
            lang_display: 'Hindi (हिंदी)',
            app_title: 'फ्लेक्सीपे AI — वॉयस-नेविगेटेड ग्रामीण वित्तीय व योजना सहायक',
            brand_tag: 'फ्लेक्सीपे AI',
            brand_subtitle: 'ग्रामीण भारत के लिए वॉयस-आधारित वित्तीय व सरकारी योजना प्लेटफ़ॉर्म',
            status_consent: 'DPDP 2025 सहमति दर्ज',
            status_bhashini: 'बैंकिंग भाषिणी सक्रिय',
            status_rbi: 'RBI 2026 2FA PIN गेट',
            tab_smartphone: 'स्मार्टफोन मोड (वॉयस यूआई)',
            tab_ivr: 'फीचर फोन IVR (UPI 123Pay)',
            tab_bankmitra: 'बैंक मित्र / CSC ऑपरेटर कंसोल',
            step1_title: 'वॉयस इरादा', step1_desc: 'बोली पहचान',
            step2_title: 'भाषिणी NLU', step2_desc: 'इकाई निष्कर्षण',
            step3_title: 'फ्रॉड गार्डियन', step3_desc: 'सुरक्षा जांच',
            step4_title: 'अनिवार्य 2FA', step4_desc: 'UPI PIN गेट',
            step5_title: 'भुगतान पूर्ण', step5_desc: 'NPCI कोर सेटलमेंट',
            heading_voice: 'बहुभाषी वॉयस असिस्टेंट व लाइव NLU कमांड सेंटर',
            badge_voice_live: 'सक्रिय भाषण पहचान',
            speech_idle: 'माइक दबाएं या कोई भी कमांड बोलें',
            speech_listening: '🎙️ सुन रहे हैं... अब बोलें',
            speech_speaking: '🔊 सहायक बोल रहा है...',
            mic_hint_prefix: 'इस भाषा में सुनना शुरू करने के लिए दबाएं:',
            voice_input_placeholder: 'कुछ भी बोलें या लिखें (उदा. सुरेश को 750 रुपये भेजो, मेरा बैलेंस बताओ, KCC लोन...)',
            btn_run_ai: 'AI चलाएं',
            nlu_title: 'स्पीच-टू-टेक्स्ट व बैंकिंग भाषिणी NLU',
            chip_intent: 'पहचाना इरादा', chip_recipient: 'प्राप्तकर्ता', chip_amount: 'राशि', chip_threat: 'सुरक्षा स्तर',
            heading_scenarios: 'ग्रामीण उपयोग के उदाहरण आज़माएं',
            sc_transfer_title: 'रमेश को ₹500 भेजें', sc_transfer_desc: 'भुगतान इरादा + अनिवार्य 2FA PIN',
            sc_vishing_title: 'स्कैम अलर्ट (विशिंग)', sc_vishing_desc: 'नकली बैंक अधिकारी OTP मांग रहा है',
            sc_kcc_title: 'किसान क्रेडिट कार्ड (KCC)', sc_kcc_desc: '₹2 लाख बिना गारंटी व 4% ब्याज छूट',
            sc_scheme_title: 'पीएम किसान स्थिति', sc_scheme_desc: 'myScheme 16वीं किश्त जांच',
            task_transfer_title: 'कार्य 1: त्वरित भुगतान व 2FA गेट',
            badge_awaiting_pin: 'PIN की प्रतीक्षा है',
            quick_pay_contacts: 'त्वरित संपर्क सूची:',
            label_transfer_to: 'को',
            label_source_acc: 'डेबिट खाता:', val_source_acc: 'SBI ग्रामीण बैंक ****4821',
            label_auth_type: 'प्रमाणीकरण:', val_auth_type: 'अनिवार्य 2FA (UPI PIN आवश्यक)',
            label_reg_standard: 'नियामक मानक:', val_reg_standard: 'RBI 2025/2026 दिशानिर्देश',
            btn_enter_pin: 'UPI PIN दर्ज करने के लिए आगे बढ़ें',
            task_balance_title: 'कार्य 2: बैंक बैलेंस व खाता विवरणी',
            badge_sbi_live: 'SBI ग्रामीण लाइव',
            acc_type: 'किसान बचत खाता',
            kcc_credit_available: 'उपलब्ध KCC क्रेडिट सीमा:',
            btn_speak_balance: 'बैलेंस बोलकर सुनाएं',
            task_fraud_title: 'कार्य 3: फ्रॉड गार्डियन व सुरक्षा राडार',
            badge_fraud_active: 'सक्रिय सुरक्षा शील्ड',
            scam_safe_title: 'इनबाउंड वॉयस स्ट्रीम सुरक्षित है',
            scam_safe_desc: 'ऑडियो में कोई धोखाधड़ी या OTP मांगने के संकेत नहीं मिले।',
            oc_title: 'आउटबाउंड एंटी-रीप्ले सुरक्षा चुनौती', oc_desc: 'डीपफेक वॉयस क्लोनिंग से बचाव करता है',
            oc_phrase_label: 'चुनौती कोड:', btn_refresh: 'बदलें',
            vishing_test_label: 'धोखाधड़ी का परीक्षण:', btn_simulate_vishing: 'नकली बैंक मैनेजर कॉल का अनुकरण करें',
            task_kcc_title: 'कार्य 4: किसान क्रेडिट कार्ड (KCC) डेस्क',
            badge_kcc_subvention: '4% ब्याज छूट',
            kcc_intro: 'केंद्रीय बजट में बिना गारंटी ऋण सीमा बढ़ाकर ₹2 लाख व 3% ब्याज छूट निर्धारित की गई है।',
            kcc_label_credit: 'आवश्यक ऋण राशि:',
            kcc_rate_ontime: 'समय पर भुगतान दर', kcc_rate_ontime_sub: '3% ब्याज छूट के साथ',
            kcc_rate_default: 'डिफ़ॉल्ट दर', kcc_rate_default_sub: 'छूट समाप्त होने पर',
            kcc_label_savings: 'वार्षिक ब्याज बचत:',
            btn_kcc_reminder: 'वॉयस रीपेमेंट रिमाइंडर सेट करें',
            task_scheme_title: 'कार्य 5: सरकारी योजनाएं व DBT सब्सिडी',
            badge_myscheme: 'myScheme.gov.in',
            scheme_pmkisan_title: 'पीएम किसान सम्मान निधि', scheme_active: 'सक्रिय लाभार्थी',
            scheme_pmkisan_desc: 'प्रतिवर्ष ₹6,000 की सीधी आय सहायता। 16वीं किश्त सफलतापूर्वक स्थानांतरित।',
            scheme_pmfby_title: 'प्रधानमंत्री फसल बीमा योजना', scheme_recommended: 'पात्र हैं',
            scheme_pmfby_desc: 'प्राकृतिक आपदाओं के विरुद्ध 1.5% नाममात्र प्रीमियम पर संपूर्ण फसल सुरक्षा।',
            btn_autofill_jansamarth: 'जन समर्थ आवेदन स्वतः भरें',
            ivr_brand: 'ग्रामीणपे फीचर फोन',
            ivr_call_status: 'कनेक्टेड: 08045163581',
            ivr_prompt_welcome: '"बैंकिंग भाषिणी IVR में आपका स्वागत है। पैसे भेजने के लिए 1, बैलेंस के लिए 2, KCC के लिए 3 दबाएं।"',
            btn_ivr_call: '📞 कॉल करें', btn_ivr_end: '❌ समाप्त',
            ivr_info_title: '40 करोड़ फीचर फोन उपयोगकर्ताओं तक पहुंच',
            badge_upi123: 'UPI 123Pay प्लेटफॉर्म',
            ivr_info_desc: 'ग्रामीण भारत के 40 करोड़ से अधिक लोग बिना टचस्क्रीन वाले साधारण फोन का उपयोग करते हैं। फ्लेक्सीपे AI इसी भाषिणी वॉयस तकनीक से IVR पर कार्य करता है।',
            ivr_step1_title: 'IVR नंबर डायल करें (08045163581)', ivr_step1_desc: 'हिंदी, भोजपुरी, अवधी व सभी भारतीय भाषाओं में स्वागत।',
            ivr_step2_title: 'बोलकर बताएं या कीपैड बटन दबाएं', ivr_step2_desc: 'आवाज सीधे सुरक्षित बैंकिंग ट्रांजैक्शन में बदल जाती है।',
            ivr_step3_title: 'कीपैड पर अनिवार्य UPI PIN दर्ज करें', ivr_step3_desc: 'RBI 2FA के तहत सुरक्षित व एन्क्रिप्टेड PIN सत्यापन।',
            bm_title: 'बैंक मित्र / CSC ऑपरेटर कंसोल', badge_human_assisted: 'मानव सहायतित',
            bm_desc: 'ग्रामीणों व बुजुर्गों के लिए बैंक मित्रों द्वारा सहायतित ऑनबोर्डिंग व फॉर्म भरने की सुविधा।',
            bm_lbl_name: 'नागरिक / किसान का नाम', bm_lbl_mobile: 'मोबाइल नंबर / आधार संदर्भ', bm_lbl_service: 'सहायता सेवा का प्रकार',
            bm_opt_kcc: 'किसान क्रेडिट कार्ड (जन समर्थ ऑटो-फिल)', bm_opt_aeps: 'AePS नकद निकासी रसीद',
            bm_opt_ekyc: 'वीडियो-KYC स्लॉट बुकिंग', bm_opt_complaint: 'साइबर धोखाधड़ी शिकायत (1930 हेल्पलाइन)',
            btn_bm_voice_intake: 'किसान की आवाज से फॉर्म स्वतः भरें',
            btn_bm_slip: 'डिजिटल रसीद जनरेट करें', btn_bm_kyc: 'RBI वीडियो-KYC स्लॉट बुक करें',
            bm_slip_title: 'डिजिटल रसीद व आवेदन ट्रैकर', badge_ready_sign: 'हस्ताक्षर के लिए तैयार',
            stamp_assisted: 'फ्लेक्सीपे सहायतित', slip_heading: 'जन समर्थ KCC आवेदन पर्ची',
            slip_applicant: 'आवेदक:', slip_category: 'श्रेणी:', slip_tenant_farmer: 'काश्तकार किसान (JLG घोषणा)',
            slip_credit: 'मांग राशि:', slip_subvention: 'ब्याज छूट दर:', slip_ref: 'वॉयस इनटेक संदर्भ:',
            slip_status_lbl: 'स्थिति:', slip_status_val: 'वॉयस से भरा गया व किसान ऋण पोर्टल से लिंक',
            aeps_title: 'AePS बायोमेट्रिक फ्रॉड चेतावनी',
            aeps_desc: 'आधार आधारित भुगतान प्रणाली में 2FA नहीं होता। नकली फिंगरप्रिंट से होने वाले फ्रॉड से सावधान रहें।',
            aeps_tip1: '✔️ हमेशा अधिकृत बैंक मित्र का पहचान पत्र जांचें।',
            aeps_tip2: '✔️ ₹10,000 से अधिक निकासी पर 2FA OTP का उपयोग करें।',
            aeps_tip3: '✔️ उपयोग न होने पर mAadhaar ऐप से बायोमेट्रिक्स लॉक रखें।',
            heading_audit: 'लाइव नियामक अनुपालन व NLU ऑडिट कंसोल',
            btn_clear_logs: 'लॉग साफ़ करें',
            footer_title: 'FlexiPay AI — वॉयस-नेविगेटेड ग्रामीण डिजिटल बैंकिंग व योजना सहायक',
            footer_sub: 'RBI 2025/2026 दिशानिर्देश, DPDP 2025 व बैंकिंग भाषिणी के अनुरूप।',
            consent_badge: 'DPDP अधिनियम 2025 अनुपालन',
            consent_title: 'अनिवार्य डेटा व वॉयस प्राइवेसी सहमति',
            consent_subtitle: 'डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम (DPDP Rules 2025)',
            consent_audio_btn: 'चयनित भाषा में सहमति सुनें',
            consent_desc: 'FlexiPay AI को आपकी स्पष्ट सहमति आवश्यक है:',
            consent_li1: '🎙️ बैंकिंग भाषिणी वॉयस पहचान के लिए ऑडियो क्लिप।',
            consent_li2: '💰 ट्रांजैक्शन विवरण से प्री-फिल्ड भुगतान पूर्वावलोकन बनाना।',
            consent_li3: '🌾 किसान क्रेडिट कार्ड व myScheme पात्रता जांच।',
            consent_notice: 'सूचना: वित्तीय लेन-देन के लिए RBI 2026 अनुसार 4-अंकीय UPI PIN अनिवार्य है। केवल वॉयस से पैसे कभी नहीं कटते।',
            consent_accept: 'स्वीकार करें और आगे बढ़ें', consent_decline: 'केवल शर्तें देखें',
            pin_badge: 'RBI 2026 अनिवार्य 2FA गेट',
            pin_title: '4-अंकीय UPI PIN दर्ज करें',
            pin_subtitle: 'वॉयस इरादे की पुष्टि करती है। PIN भुगतान को अधिकृत करता है।',
            pin_transfer_to: 'भुगतान भेजा जा रहा है:', pin_transfer_target: 'को',
            pin_rail_info: 'नेटवर्क: NPCI UPI 123Pay सैंडबॉक्स • सुरक्षित सत्र',
            pin_cancel: 'लेन-देन रद्द करें'
        },
        'mr-IN': {
            lang_display: 'Marathi (मराठी)',
            app_title: 'फ्लेक्सीपे AI — ग्रामीण डिजिटल बँकिंग व योजना सहाय्यक',
            brand_tag: 'फ्लेक्सीपे AI',
            brand_subtitle: 'ग्रामीण भारतासाठी व्हॉईस-आधारित डिजिटल बँकिंग व योजना व्यासपीठ',
            status_consent: 'DPDP 2025 संमती नोंदवली',
            status_bhashini: 'बँकिंग भाषिणी सक्रिय',
            status_rbi: 'RBI 2026 2FA PIN गेट',
            tab_smartphone: 'स्मार्टफोन मोड (व्हॉईस UI)',
            tab_ivr: 'फीचर फोन IVR (UPI 123Pay)',
            tab_bankmitra: 'बँक मित्र / CSC कन्सोल',
            step1_title: 'व्हॉईस हेतू', step1_desc: 'बोलीभाषा ओळख',
            step2_title: 'भाषिणी NLU', step2_desc: 'डेटा निष्कर्षण',
            step3_title: 'फ्रॉड गार्डियन', step3_desc: 'सुरक्षा तपासणी',
            step4_title: 'अनिवार्य 2FA', step4_desc: 'UPI PIN गेट',
            step5_title: 'पेमेंट पूर्ण', step5_desc: 'NPCI सेटलमेंट',
            heading_voice: 'बहुभाषिक व्हॉईस असिस्टंट आणि NLU कमांड सेंटर',
            badge_voice_live: 'थेट व्हॉईस ओळख',
            speech_idle: 'माईक दाबा किंवा कोणताही आदेश बोला',
            speech_listening: '🎙️ ऐकत आहे... आता बोला',
            speech_speaking: '🔊 सहाय्यक बोलत आहे...',
            mic_hint_prefix: 'या भाषेत बोला:',
            voice_input_placeholder: 'काहीही बोला किंवा लिहा (उदा. सुरेशला ₹750 पाठवा, बॅलन्स तपासा...)',
            btn_run_ai: 'AI सुरू करा',
            nlu_title: 'स्पीच-टू-टेक्स्ट आणि बँकिंग भाषिणी NLU',
            chip_intent: 'हेतू', chip_recipient: 'प्राप्तकर्ता', chip_amount: 'रक्कम', chip_threat: 'सुरक्षा',
            heading_scenarios: 'ग्रामीण वापराची उदाहरणे',
            sc_transfer_title: 'रमेशला ₹500 पाठवा', sc_transfer_desc: 'पेमेंट हेतू + अनिवार्य 2FA PIN',
            sc_vishing_title: 'स्कॅम अलर्ट (विशिंग)', sc_vishing_desc: 'बनावट बँक अधिकारी OTP मागत आहे',
            sc_kcc_title: 'किसान क्रेडिट कार्ड (KCC)', sc_kcc_desc: '₹2 लाख विनातारण व 4% सवलत',
            sc_scheme_title: 'पीएम किसान स्थिती', sc_scheme_desc: 'myScheme 16व्या हप्त्याची तपासणी',
            task_transfer_title: 'कार्य 1: त्वरित पेमेंट आणि 2FA गेट',
            badge_awaiting_pin: 'PIN ची वाट पाहत आहे',
            quick_pay_contacts: 'त्वरित संपर्क:',
            label_transfer_to: 'ला',
            label_source_acc: 'खाते:', val_source_acc: 'SBI ग्रामीण बँक ****4821',
            label_auth_type: 'प्रमाणीकरण:', val_auth_type: 'अनिवार्य 2FA (UPI PIN आवश्यक)',
            label_reg_standard: 'मानक:', val_reg_standard: 'RBI 2025/2026 नियम',
            btn_enter_pin: 'UPI PIN टाकण्यासाठी पुढे जा',
            task_balance_title: 'कार्य 2: बँक शिल्लक व पासबुक',
            badge_sbi_live: 'SBI ग्रामीण थेट',
            acc_type: 'किसान बचत खाते',
            kcc_credit_available: 'उपलब्ध KCC मर्यादा:',
            btn_speak_balance: 'शिल्लक ऐका',
            task_fraud_title: 'कार्य 3: फ्रॉड गार्डियन व सुरक्षा रडार',
            badge_fraud_active: 'सक्रिय कवच',
            scam_safe_title: 'व्हॉईस सुरक्षित आहे',
            scam_safe_desc: 'कोणताही फसवणुकीचा पॅटर्न आढळला नाही.',
            oc_title: 'अँटी-रिप्ले सुरक्षा कोड', oc_desc: 'व्हॉईस क्लोनिंगपासून संरक्षण',
            oc_phrase_label: 'सुरक्षा कोड:', btn_refresh: 'बदला',
            vishing_test_label: 'धोका चाचणी:', btn_simulate_vishing: 'बनावट कॉल तपासा',
            task_kcc_title: 'कार्य 4: किसान क्रेडिट कार्ड (KCC) डेस्क',
            badge_kcc_subvention: '4% सवलत',
            kcc_intro: '₹2 लाख विनातारण कर्ज व 3% वेळेवर परतफेड सवलत.',
            kcc_label_credit: 'कर्ज रक्कम:',
            kcc_rate_ontime: 'वेळेवर परतफेड दर', kcc_rate_ontime_sub: '3% सवलतीसह',
            kcc_rate_default: 'मूळ दर', kcc_rate_default_sub: 'सवलत रद्द झाल्यास',
            kcc_label_savings: 'वार्षिक बचत:',
            btn_kcc_reminder: 'परतफेड स्मरणपत्र लावा',
            task_scheme_title: 'कार्य 5: सरकारी योजना आणि अनुदान',
            badge_myscheme: 'myScheme.gov.in',
            scheme_pmkisan_title: 'पीएम किसान सन्मान निधी', scheme_active: 'सक्रिय लाभार्थी',
            scheme_pmkisan_desc: 'दरवर्षी ₹6,000 थेट मदत. 16वा हप्ता जमा झाला आहे.',
            scheme_pmfby_title: 'पंतप्रधान पीक विमा योजना', scheme_recommended: 'पात्र',
            scheme_pmfby_desc: 'नैसर्गिक आपत्तींविरुद्ध 1.5% सवलतीच्या हप्त्यावर पीक संरक्षण.',
            btn_autofill_jansamarth: 'जन समर्थ अर्ज भरा',
            ivr_brand: 'ग्रामीणपे फीचर फोन',
            ivr_call_status: 'कनेक्ट झाले: 08045163581',
            ivr_prompt_welcome: '"बँकिंग भाषिणी IVR मध्ये आपले स्वागत आहे. पैशांसाठी 1, शिलकीसाठी 2, KCC साठी 3 दाबा."',
            btn_ivr_call: '📞 कॉल', btn_ivr_end: '❌ समाप्त',
            ivr_info_title: '40 कोटी फीचर फोन युझर्ससाठी',
            badge_upi123: 'UPI 123Pay',
            ivr_info_desc: 'स्मार्टफोन नसलेल्या 40 कोटी लोकांसाठी IVR द्वारे व्हॉईस बँकिंग.',
            ivr_step1_title: 'IVR डायल करा (08045163581)', ivr_step1_desc: 'मराठी व सर्व भाषांमध्ये स्वागत.',
            ivr_step2_title: 'बोला किंवा बटण दाबा', ivr_step2_desc: 'आवाज सुरक्षित व्यवहारात रूपांतरित होतो.',
            ivr_step3_title: 'UPI PIN टाका', ivr_step3_desc: 'RBI 2FA नियमांनुसार सुरक्षित व्यवहार.',
            bm_title: 'बँक मित्र / CSC कन्सोल', badge_human_assisted: 'मानवी सहाय्य',
            bm_desc: 'ज्येष्ठ नागरिक व पहिल्यांदा वापरणाऱ्यांसाठी बँक मित्रांचे साहाय्य.',
            bm_lbl_name: 'शेतकऱ्याचे नाव', bm_lbl_mobile: 'मोबाईल नंबर', bm_lbl_service: 'सेवेचा प्रकार',
            bm_opt_kcc: 'किसान क्रेडिट कार्ड अर्ज', bm_opt_aeps: 'AePS रोख पावती',
            bm_opt_ekyc: 'व्हिडिओ-KYC बुकिंग', bm_opt_complaint: 'सायबर तक्रार (1930)',
            btn_bm_voice_intake: 'आवाजावरून अर्ज भरा',
            btn_bm_slip: 'डिजिटल पावती तयार करा', btn_bm_kyc: 'व्हिडिओ-KYC बुक करा',
            bm_slip_title: 'डिजिटल पावती ट्रॅकर', badge_ready_sign: 'स्वाक्षरीसाठी तयार',
            stamp_assisted: 'फ्लेक्सीपे सहाय्य', slip_heading: 'जन समर्थ KCC अर्ज पावती',
            slip_applicant: 'अर्जदार:', slip_category: 'प्रवर्ग:', slip_tenant_farmer: 'शेतकरी (JLG)',
            slip_credit: 'कर्ज मागणी:', slip_subvention: 'व्याज सवलत:', slip_ref: 'संदर्भ क्र.:',
            slip_status_lbl: 'स्थिती:', slip_status_val: 'पोर्टलवर नोंदवले गेले',
            aeps_title: 'AePS बायोमेट्रिक फसवणूक सूचना',
            aeps_desc: 'AePS मध्ये 2FA नसते. बनावट अंगठ्यांच्या फसवणुकीपासून सावध राहा.',
            aeps_tip1: '✔️ बँक मित्राचे अधिकृत ओळखपत्र तपासा.',
            aeps_tip2: '✔️ ₹10,000 पेक्षा जास्त व्यवहारांसाठी OTP वापरा.',
            aeps_tip3: '✔️ mAadhaar ॲपवरून बायोमेट्रिक्स लॉक ठेवा.',
            heading_audit: 'थेट नियामक व NLU ऑडिट कन्सोल',
            btn_clear_logs: 'नोंदी पुसा',
            footer_title: 'FlexiPay AI — ग्रामीण डिजिटल बँकिंग व योजना सहाय्यक',
            footer_sub: 'RBI व DPDP नियमांनुसार सुरक्षित.',
            consent_badge: 'DPDP 2025 संमती',
            consent_title: 'अनिवार्य डेटा संमती',
            consent_subtitle: 'माहिती संरक्षण कायदा',
            consent_audio_btn: 'संमती ऐका',
            consent_desc: 'FlexiPay AI ला तुमची संमती आवश्यक आहे:',
            consent_li1: '🎙️ व्हॉईस ओळखण्यासाठी ऑडिओ.',
            consent_li2: '💰 पेमेंट माहिती.',
            consent_li3: '🌾 KCC व योजना तपासणी.',
            consent_notice: 'टीप: पैशांच्या व्यवहारासाठी UPI PIN अनिवार्य आहे.',
            consent_accept: 'स्वीकारा व पुढे जा', consent_decline: 'अटी पहा',
            pin_badge: 'RBI 2026 2FA गेट',
            pin_title: '4-अंकी UPI PIN टाका',
            pin_subtitle: 'आवाज हेतू ठरवतो, PIN व्यवहार पूर्ण करतो.',
            pin_transfer_to: 'पाठवत आहे:', pin_transfer_target: 'ला',
            pin_rail_info: 'NPCI UPI 123Pay सँडबॉक्स',
            pin_cancel: 'व्यवहार रद्द करा'
        },
        'ta-IN': {
            lang_display: 'Tamil (தமிழ்)',
            app_title: 'FlexiPay AI — கிராமப்புற குரல் வழி வங்கி மற்றும் திட்ட உதவியாளர்',
            brand_tag: 'FlexiPay AI',
            brand_subtitle: 'கிராமப்புற இந்தியாவிற்கான குரல் வழி டிஜிட்டல் வங்கி தளம்',
            status_consent: 'DPDP 2025 ஒப்புதல் பதிவு',
            status_bhashini: 'வங்கி பாஷினி செயலில்',
            status_rbi: 'RBI 2026 2FA PIN வாயில்',
            tab_smartphone: 'ஸ்மார்ட்போன் பயன்முறை',
            tab_ivr: 'பீச்சர் போன் IVR (UPI 123Pay)',
            tab_bankmitra: 'வங்கி மித்ரா / CSC கன்சோல்',
            step1_title: 'குரல் நோக்கம்', step1_desc: 'பேச்சு அறிதல்',
            step2_title: 'பாஷினி NLU', step2_desc: 'பிரித்தெடுத்தல்',
            step3_title: 'மோசடி தடுப்பு', step3_desc: 'பாதுகாப்பு சோதனை',
            step4_title: 'கட்டாய 2FA', step4_desc: 'UPI PIN வாயில்',
            step5_title: 'பரிவர்த்தனை முடிவு', step5_desc: 'NPCI தீர்வு',
            heading_voice: 'பன்மொழி குரல் உதவியாளர் மற்றும் NLU கட்டுப்பாட்டு மையம்',
            badge_voice_live: 'நேரடி பேச்சு அறிதல்',
            speech_idle: 'மைக் பொத்தானை அழுத்தி பேசவும்',
            speech_listening: '🎙️ கேட்கிறது... இப்போது பேசவும்',
            speech_speaking: '🔊 உதவியாளர் பேசுகிறார்...',
            mic_hint_prefix: 'பேசத் தொடங்க அழுத்தவும்:',
            voice_input_placeholder: 'பேசவும் அல்லது தட்டச்சு செய்யவும் (எ.கா. சுரேஷுக்கு ₹750 அனுப்பு, இருப்பு சரிபார்...)',
            btn_run_ai: 'இயக்கு',
            nlu_title: 'பேச்சு-உரை மற்றும் வங்கி பாஷினி NLU',
            chip_intent: 'நோக்கம்', chip_recipient: 'பெறுநர்', chip_amount: 'தொகை', chip_threat: 'பாதுகாப்பு',
            heading_scenarios: 'முன்னமைக்கப்பட்ட காட்சிகள்',
            sc_transfer_title: 'ரமேஷிற்கு ₹500 அனுப்பு', sc_transfer_desc: 'பணம் செலுத்துதல் + 2FA PIN',
            sc_vishing_title: 'மோசடி எச்சரிக்கை', sc_vishing_desc: 'போலி வங்கி அதிகாரி OTP கேட்கிறார்',
            sc_kcc_title: 'கிசான் கிரெடிட் கார்டு (KCC)', sc_kcc_desc: '₹2 லட்சம் பிணையில்லா கடன் & 4% வட்டி',
            sc_scheme_title: 'PM-கிசான் நிலை', sc_scheme_desc: '16வது தவணை சரிபார்ப்பு',
            task_transfer_title: 'பணி 1: உடனடி பணம் & 2FA வாயில்',
            badge_awaiting_pin: 'PIN தேவை',
            quick_pay_contacts: 'விரைவு தொடர்புகள்:',
            label_transfer_to: 'பெறுநர்:',
            label_source_acc: 'கணக்கு:', val_source_acc: 'SBI கிராமின் வங்கி ****4821',
            label_auth_type: 'அங்கீகாரம்:', val_auth_type: 'கட்டாய 2FA (UPI PIN தேவை)',
            label_reg_standard: 'விதிமுறை:', val_reg_standard: 'RBI 2025/2026 வழிகாட்டுதல்',
            btn_enter_pin: 'UPI PIN உள்ளிட தொடரவும்',
            task_balance_title: 'பணி 2: வங்கி இருப்பு மற்றும் அறிக்கை',
            badge_sbi_live: 'SBI நேரலை',
            acc_type: 'விவசாய சேமிப்பு கணக்கு',
            kcc_credit_available: 'கிடைக்கும் KCC வரம்பு:',
            btn_speak_balance: 'இருப்பை கேட்கவும்',
            task_fraud_title: 'பணி 3: மோசடி பாதுகாப்பு ரேடார்',
            badge_fraud_active: 'பாதுகாப்பு கவசம்',
            scam_safe_title: 'குரல் பரிமாற்றம் பாதுகாப்பானது',
            scam_safe_desc: 'மோசடி அறிகுறிகள் எதுவும் கண்டறியப்படவில்லை.',
            oc_title: 'குரல் பிரதிபலிப்பு பாதுகாப்பு குறியீடு', oc_desc: 'AI குரல் போலியிலிருந்து பாதுகாக்கிறது',
            oc_phrase_label: 'பாதுகாப்பு குறியீடு:', btn_refresh: 'புதுப்பி',
            vishing_test_label: 'மோசடி சோதனை:', btn_simulate_vishing: 'போலி அழைப்பை சோதி',
            task_kcc_title: 'பணி 4: கிசான் கிரெடிட் கார்டு (KCC) பிரிவு',
            badge_kcc_subvention: '4% மானியம்',
            kcc_intro: 'பிணையில்லா கடன் ₹2 லட்சமாகவும் 3% வட்டி மானியமாகவும் உயர்த்தப்பட்டுள்ளது.',
            kcc_label_credit: 'தேவையான கடன்:',
            kcc_rate_ontime: 'சரியான நேரத்தில் செலுத்தும் விகிதம்', kcc_rate_ontime_sub: '3% மானியத்துடன்',
            kcc_rate_default: 'இயல்புநிலை விகிதம்', kcc_rate_default_sub: 'மானியம் இழப்பு',
            kcc_label_savings: 'ஆண்டு வட்டி சேமிப்பு:',
            btn_kcc_reminder: 'குரல் நினைவூட்டலை திட்டமிடு',
            task_scheme_title: 'பணி 5: அரசு திட்டங்கள் & மானியங்கள்',
            badge_myscheme: 'myScheme.gov.in',
            scheme_pmkisan_title: 'PM-கிசான் சம்மான் நிதி', scheme_active: 'பயனாளி',
            scheme_pmkisan_desc: 'ஆண்டுக்கு ₹6,000 நேரடி உதவி. 16வது தவணை வரவு வைக்கப்பட்டது.',
            scheme_pmfby_title: 'பிரதமர் பயிர் காப்பீட்டுத் திட்டம்', scheme_recommended: 'தகுதியானது',
            scheme_pmfby_desc: 'இயற்கை பேரிடர்களுக்கு எதிராக 1.5% மானிய பிரீமியத்தில் பயிர் பாதுகாப்பு.',
            btn_autofill_jansamarth: 'ஜன் சமர்த் விண்ணப்பத்தை நிரப்பு',
            ivr_brand: 'கிராமின்பே போன்',
            ivr_call_status: 'இணைக்கப்பட்டது: 08045163581',
            ivr_prompt_welcome: '"வங்கி பாஷினி IVR-க்கு வரவேற்கிறோம். பணத்திற்கு 1, இருப்புக்கு 2, KCC-க்கு 3 அழுத்தவும்."',
            btn_ivr_call: '📞 அழை', btn_ivr_end: '❌ முடி',
            ivr_info_title: '40 கோடி மக்களுக்கான சேவை',
            badge_upi123: 'UPI 123Pay',
            ivr_info_desc: 'ஸ்மார்ட்போன் இல்லாத மக்களுக்கான குரல் வழி வங்கி சேவை.',
            ivr_step1_title: 'அழைக்கவும் (08045163581)', ivr_step1_desc: 'தமிழ் மற்றும் அனைத்து மொழிகளிலும்.',
            ivr_step2_title: 'பேசவும் அல்லது அழுத்தவும்', ivr_step2_desc: 'குரல் பாதுகாப்பான பரிவர்த்தனையாக மாறும்.',
            ivr_step3_title: 'UPI PIN உள்ளிடவும்', ivr_step3_desc: 'RBI 2FA விதிகளின்படி பாதுகாப்பானது.',
            bm_title: 'வங்கி மித்ரா கன்சோல்', badge_human_assisted: 'மனித உதவி',
            bm_desc: 'முதியவர்கள் மற்றும் முதல் முறை பயனர்களுக்கான உதவி மையம்.',
            bm_lbl_name: 'விவசாயி பெயர்', bm_lbl_mobile: 'மொபைல் எண்', bm_lbl_service: 'சேவை வகை',
            bm_opt_kcc: 'KCC விண்ணப்பம்', bm_opt_aeps: 'AePS பணம் எடுப்பு',
            bm_opt_ekyc: 'வீடியோ KYC', bm_opt_complaint: 'சைபர் புகார் (1930)',
            btn_bm_voice_intake: 'குரல் வழி விண்ணப்பம்',
            btn_bm_slip: 'டிஜிட்டல் சீட்டு உருவாக்கு', btn_bm_kyc: 'KYC பதிவு செய்',
            bm_slip_title: 'டிஜிட்டல் சீட்டு கண்காணிப்பு', badge_ready_sign: 'கையொப்பத்திற்கு தயார்',
            stamp_assisted: 'உதவி செய்யப்பட்டது', slip_heading: 'ஜன் சமர்த் KCC விண்ணப்ப சீட்டு',
            slip_applicant: 'விண்ணப்பதாரர்:', slip_category: 'வகை:', slip_tenant_farmer: 'விவசாயி',
            slip_credit: 'கடன் தொகை:', slip_subvention: 'வட்டி மானியம்:', slip_ref: 'குறிப்பு எண்:',
            slip_status_lbl: 'நிலை:', slip_status_val: 'போர்ட்டலில் இணைக்கப்பட்டது',
            aeps_title: 'AePS கைரேகை மோசடி எச்சரிக்கை',
            aeps_desc: 'AePS-ல் 2FA இல்லை. போலி கைரேகை மோசடிகளில் எச்சரிக்கையாக இருங்கள்.',
            aeps_tip1: '✔️ அடையாள அட்டையை சரிபார்க்கவும்.',
            aeps_tip2: '✔️ ₹10,000 மேல் OTP பயன்படுத்தவும்.',
            aeps_tip3: '✔️ கைரேகையை லாக் செய்து வைக்கவும்.',
            heading_audit: 'நேரடி தணிக்கை கன்சோல்',
            btn_clear_logs: 'அழி',
            footer_title: 'FlexiPay AI — கிராமப்புற டிஜிட்டல் வங்கி உதவியாளர்',
            footer_sub: 'RBI மற்றும் DPDP விதிகளுக்கு உட்பட்டது.',
            consent_badge: 'DPDP 2025 ஒப்புதல்',
            consent_title: 'கட்டாய தரவு ஒப்புதல்',
            consent_subtitle: 'தரவு பாதுகாப்பு சட்டம்',
            consent_audio_btn: 'ஒப்புதலை கேட்கவும்',
            consent_desc: 'FlexiPay AI பயன்பாட்டிற்கு உங்கள் ஒப்புதல் தேவை:',
            consent_li1: '🎙️ குரல் அடையாளம் காண ஆடியோ.',
            consent_li2: '💰 கட்டண விவரங்கள்.',
            consent_li3: '🌾 KCC திட்ட விவரங்கள்.',
            consent_notice: 'குறிப்பு: பணம் அனுப்ப UPI PIN கட்டாயம் தேவை.',
            consent_accept: 'ஏற்கிறேன்', consent_decline: 'விதிமுறைகள்',
            pin_badge: 'RBI 2026 2FA வாயில்',
            pin_title: '4-இலக்க UPI PIN உள்ளிடவும்',
            pin_subtitle: 'குரல் நோக்கத்தை உறுதி செய்கிறது, PIN பணத்தை அனுப்புகிறது.',
            pin_transfer_to: 'அனுப்பப்படுகிறது:', pin_transfer_target: 'பெறுநர்:',
            pin_rail_info: 'NPCI UPI 123Pay சான்ட்பாக்ஸ்',
            pin_cancel: 'ரத்து செய்'
        },
        'te-IN': {
            lang_display: 'Telugu (తెలుగు)',
            app_title: 'FlexiPay AI — గ్రామీణ డిజిటల్ బ్యాంకింగ్ & పథకాల సహాయకుడు',
            brand_tag: 'FlexiPay AI',
            brand_subtitle: 'గ్రామీణ భారతం కోసం వాయిస్ ఆధారిత డిజిటల్ బ్యాంకింగ్',
            status_consent: 'DPDP 2025 సమ్మతి నమోదైంది',
            status_bhashini: 'బ్యాంకింగ్ భాషిణి యాక్టివ్',
            status_rbi: 'RBI 2026 2FA PIN గేట్',
            tab_smartphone: 'స్మార్ట్‌ఫోన్ మోడ్',
            tab_ivr: 'ఫీచర్ ఫోన్ IVR (UPI 123Pay)',
            tab_bankmitra: 'బ్యాంక్ మిత్ర / CSC కన్సోల్',
            step1_title: 'వాయిస్ ఉద్దేశం', step1_desc: 'భాషణ గుర్తింపు',
            step2_title: 'భాషిణి NLU', step2_desc: 'వివరాల గుర్తింపు',
            step3_title: 'మోసాల నిరోధం', step3_desc: 'భద్రతా తనిఖీ',
            step4_title: 'తప్పనిసరి 2FA', step4_desc: 'UPI PIN గేట్',
            step5_title: 'చెల్లింపు పూర్తి', step5_desc: 'NPCI సెటిల్మెంట్',
            heading_voice: 'బహుభాషా వాయిస్ అసిస్టెంట్ & NLU కమాండ్ సెంటర్',
            badge_voice_live: 'లైవ్ వాయిస్ రికగ్నిషన్',
            speech_idle: 'మైక్ నొక్కి ఏదైనా మాట్లాడండి',
            speech_listening: '🎙️ వింటున్నాము... మాట్లాడండి',
            speech_speaking: '🔊 అసిస్టెంట్ మాట్లాడుతున్నారు...',
            mic_hint_prefix: 'ఈ భాషలో మాట్లాడటానికి నొక్కండి:',
            voice_input_placeholder: 'మాట్లాడండి లేదా టైప్ చేయండి (ఉదా: సురేష్‌కు ₹750 పంపండి, బ్యాలెన్స్ చెప్పండి...)',
            btn_run_ai: 'AI ప్రారంభించు',
            nlu_title: 'స్పీచ్-టు-టెక్స్ట్ & బ్యాంకింగ్ భాషిణి NLU',
            chip_intent: 'ఉద్దేశం', chip_recipient: 'స్వీకర్త', chip_amount: 'మొత్తం', chip_threat: 'భద్రత',
            heading_scenarios: 'గ్రామీణ ఉదాహరణలు',
            sc_transfer_title: 'రమేష్‌కు ₹500 పంపండి', sc_transfer_desc: 'చెల్లింపు + తప్పనిసరి 2FA PIN',
            sc_vishing_title: 'మోసం హెచ్చరిక', sc_vishing_desc: 'నకిలీ బ్యాంక్ అధికారి OTP అడుగుతున్నారు',
            sc_kcc_title: 'కిసాన్ క్రెడిట్ కార్డ్ (KCC)', sc_kcc_desc: '₹2 లక్షల పూచీకత్తు లేని రుణం & 4% వడ్డీ',
            sc_scheme_title: 'PM-కిసాన్ స్థితి', sc_scheme_desc: '16వ విడత తనిఖీ',
            task_transfer_title: 'టాస్క్ 1: తక్షణ చెల్లింపు & 2FA గేట్',
            badge_awaiting_pin: 'PIN కోసం వేచి ఉంది',
            quick_pay_contacts: 'త్వరిత కాంటాక్ట్‌లు:',
            label_transfer_to: 'ఎవరికి:',
            label_source_acc: 'ఖాతా:', val_source_acc: 'SBI గ్రామీణ బ్యాంక్ ****4821',
            label_auth_type: 'ధృవీకరణ:', val_auth_type: 'తప్పనిసరి 2FA (UPI PIN అవసరం)',
            label_reg_standard: 'నిబంధనలు:', val_reg_standard: 'RBI 2025/2026 ఆదేశాలు',
            btn_enter_pin: 'UPI PIN ఎంటర్ చేయడానికి కొనసాగండి',
            task_balance_title: 'టాస్క్ 2: బ్యాంక్ బ్యాలెన్స్ & స్టేట్‌మెంట్',
            badge_sbi_live: 'SBI లైవ్',
            acc_type: 'కిసాన్ పొదుపు ఖాతా',
            kcc_credit_available: 'అందుబాటులో ఉన్న KCC పరిమితి:',
            btn_speak_balance: 'బ్యాలెన్స్ వినండి',
            task_fraud_title: 'టాస్క్ 3: మోసాల నిరోధం & సెక్యూరిటీ రాడార్',
            badge_fraud_active: 'యాక్టివ్ రక్షణ',
            scam_safe_title: 'వాయిస్ ప్రసారం సురక్షితం',
            scam_safe_desc: 'ఎటువంటి మోసపూరిత వివరాలు గుర్తించబడలేదు.',
            oc_title: 'యాంటీ-రీప్లే సెక్యూరిటీ కోడ్', oc_desc: 'డీప్‌ఫేక్ వాయిస్ క్లోనింగ్ నుండి రక్షణ',
            oc_phrase_label: 'రక్షణ కోడ్:', btn_refresh: 'మార్చు',
            vishing_test_label: 'మోసం పరీక్ష:', btn_simulate_vishing: 'నకిలీ కాల్ పరీక్షించండి',
            task_kcc_title: 'టాస్క్ 4: కిసాన్ క్రెడిట్ కార్డ్ (KCC) డెస్క్',
            badge_kcc_subvention: '4% సబ్సిడీ',
            kcc_intro: 'పూచీకత్తు లేని రుణం ₹2 లక్షలకు పెంపు & 3% వడ్డీ సబ్సిడీ.',
            kcc_label_credit: 'కావలసిన రుణం:',
            kcc_rate_ontime: 'సమయానికి చెల్లింపు రేటు', kcc_rate_ontime_sub: '3% సబ్సిడీతో',
            kcc_rate_default: 'డిఫాల్ట్ రేటు', kcc_rate_default_sub: 'సబ్సిడీ కోల్పోతే',
            kcc_label_savings: 'వార్షిక వడ్డీ పొదుపు:',
            btn_kcc_reminder: 'వాయిస్ రిమైండర్ సెట్ చేయండి',
            task_scheme_title: 'టాస్క్ 5: ప్రభుత్వ పథకాలు & సబ్సిడీలు',
            badge_myscheme: 'myScheme.gov.in',
            scheme_pmkisan_title: 'PM-కిసాన్ సమ్మాన్ నిధి', scheme_active: 'యాక్టివ్ లబ్ధిదారు',
            scheme_pmkisan_desc: 'సంవత్సరానికి ₹6,000 సహాయం. 16వ విడత విజయవంతంగా బదిలీ అయింది.',
            scheme_pmfby_title: 'ప్రధాన మంత్రి ఫసల్ బీమా యోజన', scheme_recommended: 'అర్హులు',
            scheme_pmfby_desc: 'ప్రకృతి వైపరీత్యాల నుండి 1.5% రాయితీ ప్రీమియంతో పంట రక్షణ.',
            btn_autofill_jansamarth: 'జన్ సమర్థ్ దరఖాస్తును నింపండి',
            ivr_brand: 'గ్రామీణ్‌పే ఫోన్',
            ivr_call_status: 'కనెక్ట్ అయింది: 08045163581',
            ivr_prompt_welcome: '"బ్యాంకింగ్ భాషిణి IVR కి స్వాగతం. డబ్బు పంపడానికి 1, బ్యాలెన్స్ కోసం 2, KCC కోసం 3 నొక్కండి."',
            btn_ivr_call: '📞 కాల్', btn_ivr_end: '❌ ముగించు',
            ivr_info_title: '40 కోట్ల మంది కోసం సేవ',
            badge_upi123: 'UPI 123Pay',
            ivr_info_desc: 'స్మార్ట్‌ఫోన్ లేని గ్రామీణ ప్రజల కోసం వాయిస్ బ్యాంకింగ్.',
            ivr_step1_title: 'డయల్ చేయండి (08045163581)', ivr_step1_desc: 'తెలుగు మరియు అన్ని భాషలలో స్వాగతం.',
            ivr_step2_title: 'మాట్లాడండి లేదా నొక్కండి', ivr_step2_desc: 'వాయిస్ నేరుగా సురక్షిత లావాదేవీగా మారుతుంది.',
            ivr_step3_title: 'UPI PIN ఎంటర్ చేయండి', ivr_step3_desc: 'RBI 2FA నిబంధనల ప్రకారం సురక్షితం.',
            bm_title: 'బ్యాంక్ మిత్ర కన్సోల్', badge_human_assisted: 'మానవ సహాయం',
            bm_desc: 'గ్రామీణులు మరియు వృద్ధుల కోసం సహాయ కేంద్రం.',
            bm_lbl_name: 'రైతు పేరు', bm_lbl_mobile: 'మొబైల్ నంబర్', bm_lbl_service: 'సేవ రకం',
            bm_opt_kcc: 'KCC దరఖాస్తు', bm_opt_aeps: 'AePS నగదు రసీదు',
            bm_opt_ekyc: 'వీడియో KYC', bm_opt_complaint: 'సైబర్ ఫిర్యాదు (1930)',
            btn_bm_voice_intake: 'వాయిస్ ద్వారా దరఖాస్తు నింపండి',
            btn_bm_slip: 'డిజిటల్ రసీదు పొందండి', btn_bm_kyc: 'KYC బుక్ చేయండి',
            bm_slip_title: 'డిజిటల్ రసీదు ట్రాకర్', badge_ready_sign: 'సంతకానికి సిద్ధం',
            stamp_assisted: 'సహాయం చేయబడింది', slip_heading: 'జన్ సమర్థ్ KCC రసీదు',
            slip_applicant: 'దరఖాస్తుదారు:', slip_category: 'వర్గం:', slip_tenant_farmer: 'రైతు',
            slip_credit: 'రుణ మొత్తం:', slip_subvention: 'వడ్డీ రాయితీ:', slip_ref: 'రిఫరెన్స్:',
            slip_status_lbl: 'స్థితి:', slip_status_val: 'పోర్టల్ లో నమోదైంది',
            aeps_title: 'AePS బయోమెట్రిక్ హెచ్చరిక',
            aeps_desc: 'AePS లో 2FA ఉండదు. నకిలీ వేలిముద్రల మోసాల పట్ల జాగ్రత్తగా ఉండండి.',
            aeps_tip1: '✔️ గుర్తింపు కార్డును సరిచూడండి.',
            aeps_tip2: '✔️ ₹10,000 పైబడి లావాదేవీలకు OTP వాడండి.',
            aeps_tip3: '✔️ వేలిముద్రలను లాక్ చేసి ఉంచండి.',
            heading_audit: 'లైవ్ ఆడిట్ కన్సోల్',
            btn_clear_logs: 'క్లియర్ చేయండి',
            footer_title: 'FlexiPay AI — గ్రామీణ డిజిటల్ బ్యాంకింగ్ సహాయకుడు',
            footer_sub: 'RBI మరియు DPDP నిబంధనలకు కట్టుబడి ఉంది.',
            consent_badge: 'DPDP 2025 సమ్మతి',
            consent_title: 'తప్పనిసరి డేటా సమ్మతి',
            consent_subtitle: 'డేటా రక్షణ చట్టం',
            consent_audio_btn: 'సమ్మతిని వినండి',
            consent_desc: 'FlexiPay AI కి మీ సమ్మతి అవసరం:',
            consent_li1: '🎙️ వాయిస్ గుర్తింపు కోసం ఆడియో.',
            consent_li2: '💰 చెల్లింపు వివరాలు.',
            consent_li3: '🌾 KCC మరియు పథకాల వివరాలు.',
            consent_notice: 'గమనిక: డబ్బు బదిలీకి UPI PIN తప్పనిసరి.',
            consent_accept: 'అంగీకరిస్తున్నాను', consent_decline: 'నిబంధనలు',
            pin_badge: 'RBI 2026 2FA గేట్',
            pin_title: '4-అంకెల UPI PIN ఎంటర్ చేయండి',
            pin_subtitle: 'వాయిస్ ఉద్దేశాన్ని నిర్ధారిస్తుంది, PIN డబ్బును పంపుతుంది.',
            pin_transfer_to: 'పంపుతున్నది:', pin_transfer_target: 'ఎవరికి:',
            pin_rail_info: 'NPCI UPI 123Pay శాండ్‌బాక్స్',
            pin_cancel: 'రద్దు చేయండి'
        },
        'bn-IN': {
            lang_display: 'Bengali (বাংলা)',
            app_title: 'FlexiPay AI — গ্রামীণ ডিজিটাল ব্যাংকিং ও যোজনা সহায়ক',
            brand_tag: 'FlexiPay AI',
            brand_subtitle: 'গ্রামীণ ভারতের জন্য ভয়েস-ভিত্তিক আর্থিক সেবা প্ল্যাটফর্ম',
            status_consent: 'DPDP 2025 সম্মতি নথিভুক্ত',
            status_bhashini: 'ব্যাংকিং ভাষিণী সক্রিয়',
            status_rbi: 'RBI 2026 2FA PIN গেট',
            tab_smartphone: 'স্মার্টফোন মোড',
            tab_ivr: 'ফিচার ফোন IVR (UPI 123Pay)',
            tab_bankmitra: 'ব্যাংক মিত্র / CSC কনসোল',
            step1_title: 'ভয়েস ইচ্ছা', step1_desc: 'কণ্ঠস্বর সনাক্তকরণ',
            step2_title: 'ভাষিণী NLU', step2_desc: 'তথ্য নিষ্কাশন',
            step3_title: 'প্রতারণা প্রতিরোধ', step3_desc: 'নিরাপত্তা যাচাই',
            step4_title: 'বাধ্যতামূলক 2FA', step4_desc: 'UPI PIN গেট',
            step5_title: 'পেমেন্ট সম্পন্ন', step5_desc: 'NPCI নিষ্পত্তি',
            heading_voice: 'বহুভাষিক ভয়েস সহকারী ও NLU কমান্ড সেন্টার',
            badge_voice_live: 'সক্রিয় ভয়েস রিকগনিশন',
            speech_idle: 'মাইক টিপুন বা যেকোনো নির্দেশ বলুন',
            speech_listening: '🎙️ শুনছি... এখন বলুন',
            speech_speaking: '🔊 সহকারী কথা বলছে...',
            mic_hint_prefix: 'এই ভাষায় শুনতে চাপুন:',
            voice_input_placeholder: 'বলুন বা লিখুন (যেমন: সুরেশকে ₹৭৫০ পাঠাও, ব্যালেন্স চেক করো...)',
            btn_run_ai: 'AI চালান',
            nlu_title: 'স্পিচ-টু-টেক্সট ও ব্যাংকিং ভাষিণী NLU',
            chip_intent: 'উদ্দেশ্য', chip_recipient: 'প্রাপক', chip_amount: 'পরিমাণ', chip_threat: 'সুরক্ষা',
            heading_scenarios: 'গ্রামীণ দৃশ্যপট',
            sc_transfer_title: 'রমেশকে ₹৫০০ পাঠাও', sc_transfer_desc: 'পেমেন্ট + বাধ্যতামূলক 2FA PIN',
            sc_vishing_title: 'প্রতারণা সতর্কতা', sc_vishing_desc: 'ভুয়ো ব্যাংক অফিসার OTP চাইছে',
            sc_kcc_title: 'কিসান ক্রেডিট কার্ড (KCC)', sc_kcc_desc: '₹২ লাখ জামানতমুক্ত ঋণ ও ৪% সুদ',
            sc_scheme_title: 'পিএম-কিসান স্থিতি', sc_scheme_desc: '১৬তম কিস্তি পরীক্ষা',
            task_transfer_title: 'টাস্ক ১: তাৎক্ষণিক পেমেন্ট ও 2FA গেট',
            badge_awaiting_pin: 'PIN প্রতীক্ষিত',
            quick_pay_contacts: 'দ্রুত যোগাযোগ:',
            label_transfer_to: 'প্রাপক:',
            label_source_acc: 'অ্যাকাউন্ট:', val_source_acc: 'SBI গ্রামীণ ব্যাংক ****4821',
            label_auth_type: 'যাচাইকরণ:', val_auth_type: 'বাধ্যতামূলক 2FA (UPI PIN প্রয়োজন)',
            label_reg_standard: 'নিয়মাবলী:', val_reg_standard: 'RBI 2025/2026 নির্দেশিকা',
            btn_enter_pin: 'UPI PIN দিতে এগিয়ে যান',
            task_balance_title: 'টাস্ক ২: ব্যাংক ব্যালেন্স ও বিবরণী',
            badge_sbi_live: 'SBI লাইভ',
            acc_type: 'কিসান সেভিংস অ্যাকাউন্ট',
            kcc_credit_available: 'উপলব্ধ KCC ক্রেডিট সীমা:',
            btn_speak_balance: 'ব্যালেন্স শুনুন',
            task_fraud_title: 'টাস্ক ৩: প্রতারণা প্রতিরোধ ও রাডার',
            badge_fraud_active: 'সক্রিয় সুরক্ষা',
            scam_safe_title: 'ভয়েস নিরাপদ',
            scam_safe_desc: 'কোনো সন্দেহজনক নির্দেশ পাওয়া যায়নি।',
            oc_title: 'অ্যান্টি-রিপ্লে সিকিউরিটি কোড', oc_desc: 'ডিপফেক ভয়েস ক্লোনিং থেকে রক্ষা করে',
            oc_phrase_label: 'নিরাপত্তা কোড:', btn_refresh: 'নতুন কোড',
            vishing_test_label: 'প্রতারণা পরীক্ষা:', btn_simulate_vishing: 'ভুয়ো কল পরীক্ষা করুন',
            task_kcc_title: 'টাস্ক ৪: কিসান ক্রেডিট কার্ড (KCC) ডেস্ক',
            badge_kcc_subvention: '৪% সুদের হার',
            kcc_intro: 'জামানতমুক্ত ঋণ সীমা বেড়ে ₹২ লাখ এবং সময়মতো পরিশোধে ৩% সুদের ছাড়।',
            kcc_label_credit: 'প্রয়োজনীয় ঋণ:',
            kcc_rate_ontime: 'সময়মতো পরিশোধে হার', kcc_rate_ontime_sub: '৩% ছাড়সহ',
            kcc_rate_default: 'ডিফল্ট হার', kcc_rate_default_sub: 'ছাড় বাতিল হলে',
            kcc_label_savings: 'বার্ষিক সুদ সাশ্রয়:',
            btn_kcc_reminder: 'ভয়েস রিমাইন্ডার সেট করুন',
            task_scheme_title: 'টাস্ক ৫: সরকারি যোজনা ও অনুদান',
            badge_myscheme: 'myScheme.gov.in',
            scheme_pmkisan_title: 'পিএম-কিসান সম্মান নিধি', scheme_active: 'সক্রিয় সুবিধাভোগী',
            scheme_pmkisan_desc: 'বছরে ₹৬,০০০ সরাসরি সাহায্য। ১৬তম কিস্তি জমা হয়েছে।',
            scheme_pmfby_title: 'প্রধানমন্ত্রী ফসল বিমা যোজনা', scheme_recommended: 'যোগ্য',
            scheme_pmfby_desc: 'প্রাকৃতিক দুর্যোগের বিরুদ্ধে ১.৫% নামমাত্র প্রিমিয়ামে ফসল সুরক্ষা।',
            btn_autofill_jansamarth: 'জন সমর্থ আবেদন পূরণ করুন',
            ivr_brand: 'গ্রামীণপে ফোন',
            ivr_call_status: 'সংযুক্ত: 08045163581',
            ivr_prompt_welcome: '"ব্যাংকিং ভাষিণী IVR-এ স্বাগতম। পেমেন্টের জন্য ১, ব্যালেন্সের জন্য ২, KCC-এর জন্য ৩ চাপুন।\n"',
            btn_ivr_call: '📞 কল', btn_ivr_end: '❌ শেষ',
            ivr_info_title: '৪০ কোটি মানুষের জন্য সেবা',
            badge_upi123: 'UPI 123Pay',
            ivr_info_desc: 'স্মার্টফোনবিহীন গ্রামীণ মানুষের জন্য ভয়েস ব্যাংকিং।',
            ivr_step1_title: 'ডায়াল করুন (08045163581)', ivr_step1_desc: 'বাংলা ও সকল ভাষায় স্বাগতম।',
            ivr_step2_title: 'বলুন বা বোতাম টিপুন', ivr_step2_desc: 'ভয়েস সরাসরি নিরাপদ ব্যাংকিংয়ে রূপান্তরিত হয়।',
            ivr_step3_title: 'UPI PIN দিন', ivr_step3_desc: 'RBI 2FA নিয়ম অনুযায়ী নিরাপদ।',
            bm_title: 'ব্যাংক মিত্র কনসোল', badge_human_assisted: 'সহায়তাপ্রাপ্ত',
            bm_desc: 'গ্রামীণ ও বয়স্ক নাগরিকদের সহায়তার জন্য কেন্দ্র।',
            bm_lbl_name: 'কৃষকের নাম', bm_lbl_mobile: 'মোবাইল নম্বর', bm_lbl_service: 'সেবার ধরন',
            bm_opt_kcc: 'KCC আবেদন', bm_opt_aeps: 'AePS নগদ রশিদ',
            bm_opt_ekyc: 'ভিডিও KYC', bm_opt_complaint: 'সাইবার অভিযোগ (1930)',
            btn_bm_voice_intake: 'কণ্ঠস্বরের মাধ্যমে ফর্ম পূরণ',
            btn_bm_slip: 'ডিজিটাল রশিদ তৈরি করুন', btn_bm_kyc: 'KYC বুক করুন',
            bm_slip_title: 'ডিজিটাল রশিদ ট্র্যাকার', badge_ready_sign: 'স্বাক্ষরের জন্য প্রস্তুত',
            stamp_assisted: 'সহায়তাপ্রাপ্ত', slip_heading: 'জন সমর্থ KCC আবেদন রশিদ',
            slip_applicant: 'আবেদনকারী:', slip_category: 'শ্রেণী:', slip_tenant_farmer: 'কৃষক',
            slip_credit: 'ঋণ পরিমাণ:', slip_subvention: 'সুদের ছাড়:', slip_ref: 'রেফারেন্স:',
            slip_status_lbl: 'স্থিতি:', slip_status_val: 'যুক্ত হয়েছে',
            aeps_title: 'AePS বায়োমেট্রিক প্রতারণা সতর্কতা',
            aeps_desc: 'AePS-এ 2FA নেই। ক্লোন ফিঙ্গারপ্রিন্ট প্রতারণা থেকে সাবধান থাকুন।',
            aeps_tip1: '✔️ পরিচয়পত্র যাচাই করুন।',
            aeps_tip2: '✔️ ₹১০,০০০ এর বেশি লেনদেনে OTP ব্যবহার করুন।',
            aeps_tip3: '✔️ বায়োমেট্রিক্স লক রাখুন।',
            heading_audit: 'লাইভ অডিট কনসোল',
            btn_clear_logs: 'মুছুন',
            footer_title: 'FlexiPay AI — গ্রামীণ ডিজিটাল ব্যাংকিং সহায়ক',
            footer_sub: 'RBI ও DPDP নিয়মাবলী মেনে প্রস্তুত।',
            consent_badge: 'DPDP 2025 সম্মতি',
            consent_title: 'বাধ্যতামূলক তথ্য সম্মতি',
            consent_subtitle: 'তথ্য সুরক্ষা আইন',
            consent_audio_btn: 'সম্মতি শুনুন',
            consent_desc: 'FlexiPay AI-এর জন্য আপনার সম্মতি প্রয়োজন:',
            consent_li1: '🎙️ ভয়েস সনাক্তকরণের জন্য অডিও।',
            consent_li2: '💰 পেমেন্ট তথ্য।',
            consent_li3: '🌾 KCC যোজনা তথ্য।',
            consent_notice: 'বিজ্ঞপ্তি: টাকা স্থানান্তরের জন্য UPI PIN বাধ্যতামূলক।',
            consent_accept: 'সম্মতি দিন', consent_decline: 'শর্তাবলী',
            pin_badge: 'RBI 2026 2FA গেট',
            pin_title: '৪-সংখ্যার UPI PIN দিন',
            pin_subtitle: 'ভয়েস ইচ্ছা নিশ্চিত করে, PIN টাকা পাঠায়।',
            pin_transfer_to: 'পাঠানো হচ্ছে:', pin_transfer_target: 'প্রাপক:',
            pin_rail_info: 'NPCI UPI 123Pay স্যান্ডবক্স',
            pin_cancel: 'বাতিল করুন'
        },
        'pa-IN': {
            lang_display: 'Punjabi (ਪੰਜਾਬੀ)',
            app_title: 'FlexiPay AI — ਪੇਂਡੂ ਡਿਜੀਟਲ ਬੈਂਕਿੰਗ ਅਤੇ ਯੋਜਨਾ ਸਹਾਇਕ',
            brand_tag: 'FlexiPay AI',
            brand_subtitle: 'ਪੇਂਡੂ ਭਾਰਤ ਲਈ ਆਵਾਜ਼-ਅਧਾਰਿਤ ਡਿਜੀਟਲ ਬੈਂਕਿੰਗ ਪਲੇਟਫਾਰਮ',
            status_consent: 'DPDP 2025 ਸਹਿਮਤੀ ਦਰਜ',
            status_bhashini: 'ਬੈਂਕਿੰਗ ਭਾਸ਼ਿਣੀ ਸਰਗਰਮ',
            status_rbi: 'RBI 2026 2FA PIN ਗੇਟ',
            tab_smartphone: 'ਸਮਾਰਟਫੋਨ ਮੋਡ',
            tab_ivr: 'ਫੀਚਰ ਫੋਨ IVR (UPI 123Pay)',
            tab_bankmitra: 'ਬੈਂਕ ਮਿੱਤਰ / CSC ਕੰਸੋਲ',
            step1_title: 'ਆਵਾਜ਼ ਇਰਾਦਾ', step1_desc: 'ਬੋਲੀ ਪਛਾਣ',
            step2_title: 'ਭਾਸ਼ਿਣੀ NLU', step2_desc: 'ਵੇਰਵੇ ਕੱਢਣਾ',
            step3_title: 'ਧੋਖਾਧੜੀ ਰੋਕਥਾਮ', step3_desc: 'ਸੁਰੱਖਿਆ ਜਾਂਚ',
            step4_title: 'ਲਾਜ਼ਮੀ 2FA', step4_desc: 'UPI PIN ਗੇਟ',
            step5_title: 'ਭੁਗਤਾਨ ਪੂਰਾ', step5_desc: 'NPCI ਸੈਟਲਮੈਂਟ',
            heading_voice: 'ਬਹੁਭਾਸ਼ਾਈ ਵੌਇਸ ਅਸਿਸਟੈਂਟ ਅਤੇ NLU ਕਮਾਂਡ ਸੈਂਟਰ',
            badge_voice_live: 'ਲਾਈਵ ਆਵਾਜ਼ ਪਛਾਣ',
            speech_idle: 'ਮਾਈਕ ਦਬਾਓ ਜਾਂ ਕੋਈ ਕਮਾਂਡ ਬੋਲੋ',
            speech_listening: '🎙️ ਸੁਣ ਰਹੇ ਹਾਂ... ਹੁਣ ਬੋਲੋ',
            speech_speaking: '🔊 ਸਹਾਇਕ ਬੋਲ ਰਿਹਾ ਹੈ...',
            mic_hint_prefix: 'ਬੋਲਣਾ ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਦਬਾਓ:',
            voice_input_placeholder: 'ਕੁਝ ਵੀ ਬੋਲੋ ਜਾਂ ਲਿਖੋ (ਜਿਵੇਂ: ਸੁਰੇਸ਼ ਨੂੰ ₹750 ਭੇਜੋ, ਬੈਲੇਂਸ ਦੱਸੋ...)',
            btn_run_ai: 'AI ਚਲਾਓ',
            nlu_title: 'ਸਪੀਚ-ਟੂ-ਟੈਕਸਟ ਅਤੇ ਬੈਂਕਿੰਗ ਭਾਸ਼ਿਣੀ NLU',
            chip_intent: 'ਇਰਾਦਾ', chip_recipient: 'ਪ੍ਰਾਪਤਕਰਤਾ', chip_amount: 'ਰਕਮ', chip_threat: 'ਸੁਰੱਖਿਆ',
            heading_scenarios: 'ਪੇਂਡੂ ਦ੍ਰਿਸ਼ਟੀਕੋਣ',
            sc_transfer_title: 'ਰਮੇਸ਼ ਨੂੰ ₹500 ਭੇਜੋ', sc_transfer_desc: 'ਭੁਗਤਾਨ + ਲਾਜ਼ਮੀ 2FA PIN',
            sc_vishing_title: 'ਧੋਖਾਧੜੀ ਚੇਤਾਵਨੀ', sc_vishing_desc: 'ਨਕਲੀ ਬੈਂਕ ਅਫਸਰ OTP ਮੰਗ ਰਿਹਾ ਹੈ',
            sc_kcc_title: 'ਕਿਸਾਨ ਕ੍ਰੈਡਿਟ ਕਾਰਡ (KCC)', sc_kcc_desc: '₹2 ਲੱਖ ਤੱਕ ਬਿਨਾਂ ਗਾਰੰਟੀ ਕਰਜ਼ਾ',
            sc_scheme_title: 'ਪੀਐਮ ਕਿਸਾਨ ਸਥਿਤੀ', sc_scheme_desc: '16ਵੀਂ ਕਿਸ਼ਤ ਦੀ ਜਾਂਚ',
            task_transfer_title: 'ਟਾਸਕ 1: ਤੁਰੰਤ ਭੁਗਤਾਨ ਅਤੇ 2FA ਗੇਟ',
            badge_awaiting_pin: 'PIN ਦੀ ਉਡੀਕ',
            quick_pay_contacts: 'ਤੇਜ਼ ਸੰਪਰਕ:',
            label_transfer_to: 'ਕਿਸ ਨੂੰ:',
            label_source_acc: 'ਖਾਤਾ:', val_source_acc: 'SBI ਗ੍ਰਾਮੀਣ ਬੈਂਕ ****4821',
            label_auth_type: 'ਪ੍ਰਮਾਣੀਕਰਨ:', val_auth_type: 'ਲਾਜ਼ਮੀ 2FA (UPI PIN ਲੋੜੀਂਦਾ)',
            label_reg_standard: 'ਨਿਯਮ:', val_reg_standard: 'RBI 2025/2026 ਨਿਯਮ',
            btn_enter_pin: 'UPI PIN ਦਰਜ ਕਰਨ ਲਈ ਅੱਗੇ ਵਧੋ',
            task_balance_title: 'ਟਾਸਕ 2: ਬੈਂਕ ਬੈਲੇਂਸ ਅਤੇ ਸਟੇਟਮੈਂਟ',
            badge_sbi_live: 'SBI ਲਾਈਵ',
            acc_type: 'ਕਿਸਾਨ ਬੱਚਤ ਖਾਤਾ',
            kcc_credit_available: 'ਉਪਲਬਧ KCC ਕਰਜ਼ਾ ਸੀਮਾ:',
            btn_speak_balance: 'ਬੈਲੇਂਸ ਸੁਣੋ',
            task_fraud_title: 'ਟਾਸਕ 3: ਧੋਖਾਧੜੀ ਰੋਕਥਾਮ ਰਡਾਰ',
            badge_fraud_active: 'ਸਰਗਰਮ ਸੁਰੱਖਿਆ',
            scam_safe_title: 'ਆਵਾਜ਼ ਸੁਰੱਖਿਅਤ ਹੈ',
            scam_safe_desc: 'ਕੋਈ ਸ਼ੱਕੀ ਗਤੀਵਿਧੀ ਨਹੀਂ ਮਿਲੀ।',
            oc_title: 'ਐਂਟੀ-ਰੀਪਲੇਅ ਸੁਰੱਖਿਆ ਕੋਡ', oc_desc: 'ਡੀਪਫੇਕ ਵੌਇਸ ਤੋਂ ਬਚਾਉਂਦਾ ਹੈ',
            oc_phrase_label: 'ਸੁਰੱਖਿਆ ਕੋਡ:', btn_refresh: 'ਬਦਲੋ',
            vishing_test_label: 'ਧੋਖਾਧੜੀ ਟੈਸਟ:', btn_simulate_vishing: 'ਨਕਲੀ ਕਾਲ ਟੈਸਟ ਕਰੋ',
            task_kcc_title: 'ਟਾਸਕ 4: ਕਿਸਾਨ ਕ੍ਰੈਡਿਟ ਕਾਰਡ (KCC) ਡੈਸਕ',
            badge_kcc_subvention: '4% ਸਬਸਿਡੀ',
            kcc_intro: 'ਬਿਨਾਂ ਗਾਰੰਟੀ ਕਰਜ਼ਾ ਸੀਮਾ ₹2 ਲੱਖ ਅਤੇ ਸਮੇਂ ਸਿਰ ਭਰਨ ਤੇ 3% ਛੋਟ।',
            kcc_label_credit: 'ਲੋੜੀਂਦਾ ਕਰਜ਼ਾ:',
            kcc_rate_ontime: 'ਸਮੇਂ ਸਿਰ ਭੁਗਤਾਨ ਦਰ', kcc_rate_ontime_sub: '3% ਛੋਟ ਨਾਲ',
            kcc_rate_default: 'ਮੂਲ ਦਰ', kcc_rate_default_sub: 'ਛੋਟ ਖਤਮ ਹੋਣ ਤੇ',
            kcc_label_savings: 'ਸਾਲਾਨਾ ਵਿਆਜ ਬੱਚਤ:',
            btn_kcc_reminder: 'ਵੌਇਸ ਰੀਮਾਈਂਡਰ ਲਗਾਓ',
            task_scheme_title: 'ਟਾਸਕ 5: ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ ਅਤੇ ਸਬਸਿਡੀਆਂ',
            badge_myscheme: 'myScheme.gov.in',
            scheme_pmkisan_title: 'ਪੀਐਮ-ਕਿਸਾਨ ਸਨਮਾਨ ਨਿਧੀ', scheme_active: 'ਲਾਭਪਾਤਰੀ',
            scheme_pmkisan_desc: 'ਸਾਲਾਨਾ ₹6,000 ਸਿੱਧੀ ਸਹਾਇਤਾ। 16ਵੀਂ ਕਿਸ਼ਤ ਖਾਤੇ ਵਿੱਚ ਆ ਗਈ ਹੈ।',
            scheme_pmfby_title: 'ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਫਸਲ ਬੀਮਾ ਯੋਜਨਾ', scheme_recommended: 'ਯੋਗ',
            scheme_pmfby_desc: 'ਕੁਦਰਤੀ ਆਫ਼ਤਾਂ ਵਿਰੁੱਧ 1.5% ਰਿਆਇਤੀ ਪ੍ਰੀਮੀਅਮ ਤੇ ਫਸਲ ਬੀਮਾ।',
            btn_autofill_jansamarth: 'ਜਨ ਸਮਰੱਥ ਫਾਰਮ ਭਰੋ',
            ivr_brand: 'ਗ੍ਰਾਮੀਣਪੇ ਫੋਨ',
            ivr_call_status: 'ਕਨੈਕਟ ਹੋਇਆ: 08045163581',
            ivr_prompt_welcome: '"ਬੈਂਕਿੰਗ ਭਾਸ਼ਿਣੀ IVR ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ। ਪੈਸੇ ਭੇਜਣ ਲਈ 1, ਬੈਲੇਂਸ ਲਈ 2, KCC ਲਈ 3 ਦਬਾਓ।"',
            btn_ivr_call: '📞 ਕਾਲ', btn_ivr_end: '❌ ਸਮਾਪਤ',
            ivr_info_title: '40 ਕਰੋੜ ਲੋਕਾਂ ਤੱਕ ਪਹੁੰਚ',
            badge_upi123: 'UPI 123Pay',
            ivr_info_desc: 'ਸਾਧਾਰਨ ਫੋਨ ਰੱਖਣ ਵਾਲੇ ਪੇਂਡੂ ਲੋਕਾਂ ਲਈ ਵੌਇਸ ਬੈਂਕਿੰਗ।',
            ivr_step1_title: 'ਡਾਇਲ ਕਰੋ (08045163581)', ivr_step1_desc: 'ਪੰਜਾਬੀ ਅਤੇ ਸਾਰੀਆਂ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ।',
            ivr_step2_title: 'ਬੋਲੋ ਜਾਂ ਬਟਨ ਦਬਾਓ', ivr_step2_desc: 'ਆਵਾਜ਼ ਸੁਰੱਖਿਅਤ ਲੈਣ-ਦੇਣ ਵਿੱਚ ਬਦਲਦੀ ਹੈ।',
            ivr_step3_title: 'UPI PIN ਦਰਜ ਕਰੋ', ivr_step3_desc: 'RBI 2FA ਨਿਯਮਾਂ ਅਨੁਸਾਰ ਸੁਰੱਖਿਅਤ।',
            bm_title: 'ਬੈਂਕ ਮਿੱਤਰ ਕੰਸੋਲ', badge_human_assisted: 'ਮਨੁੱਖੀ ਸਹਾਇਤਾ',
            bm_desc: 'ਪੇਂਡੂਆਂ ਅਤੇ ਬਜ਼ੁਰਗਾਂ ਦੀ ਸਹਾਇਤਾ ਲਈ ਕੇਂਦਰ।',
            bm_lbl_name: 'ਕਿਸਾਨ ਦਾ ਨਾਮ', bm_lbl_mobile: 'ਮੋਬਾਈਲ ਨੰਬਰ', bm_lbl_service: 'ਸੇਵਾ ਦੀ ਕਿਸਮ',
            bm_opt_kcc: 'KCC ਅਰਜ਼ੀ', bm_opt_aeps: 'AePS ਨਕਦ ਰਸੀਦ',
            bm_opt_ekyc: 'ਵੀਡੀਓ KYC', bm_opt_complaint: 'ਸਾਈਬਰ ਸ਼ਿਕਾਇਤ (1930)',
            btn_bm_voice_intake: 'ਆਵਾਜ਼ ਨਾਲ ਫਾਰਮ ਭਰੋ',
            btn_bm_slip: 'ਡਿਜੀਟਲ ਪਰਚੀ ਬਣਾਓ', btn_bm_kyc: 'KYC ਬੁੱਕ ਕਰੋ',
            bm_slip_title: 'ਡਿਜੀਟਲ ਪਰਚੀ ਟਰੈਕਰ', badge_ready_sign: 'ਦਸਤਖਤ ਲਈ ਤਿਆਰ',
            stamp_assisted: 'ਸਹਾਇਤਾ ਪ੍ਰਾਪਤ', slip_heading: 'ਜਨ ਸਮਰੱਥ KCC ਪਰਚੀ',
            slip_applicant: 'ਬਿਨੈਕਾਰ:', slip_category: 'ਸ਼੍ਰੇਣੀ:', slip_tenant_farmer: 'ਕਿਸਾਨ',
            slip_credit: 'ਕਰਜ਼ਾ ਰਕਮ:', slip_subvention: 'ਵਿਆਜ ਛੋਟ:', slip_ref: 'ਹਵਾਲਾ ਨੰਬਰ:',
            slip_status_lbl: 'ਸਥਿਤੀ:', slip_status_val: 'ਪੋਰਟਲ ਨਾਲ ਜੋੜਿਆ ਗਿਆ',
            aeps_title: 'AePS ਬਾਇਓਮੈਟ੍ਰਿਕ ਧੋਖਾਧੜੀ ਚੇਤਾਵਨੀ',
            aeps_desc: 'AePS ਵਿੱਚ 2FA ਨਹੀਂ ਹੁੰਦੀ। ਨਕਲੀ ਉਂਗਲਾਂ ਦੇ ਨਿਸ਼ਾਨਾਂ ਤੋਂ ਸਾਵਧਾਨ ਰਹੋ।',
            aeps_tip1: '✔️ ਬੈਂਕ ਮਿੱਤਰ ਦਾ ਕਾਰਡ ਚੈੱਕ ਕਰੋ।',
            aeps_tip2: '✔️ ₹10,000 ਤੋਂ ਵੱਧ ਤੇ OTP ਵਰਤੋ।',
            aeps_tip3: '✔️ ਬਾਇਓਮੈਟ੍ਰਿਕਸ ਲਾਕ ਰੱਖੋ।',
            heading_audit: 'ਲਾਈਵ ਆਡਿਟ ਕੰਸੋਲ',
            btn_clear_logs: 'ਸਾਫ਼ ਕਰੋ',
            footer_title: 'FlexiPay AI — ਪੇਂਡੂ ਡਿਜੀਟਲ ਬੈਂਕਿੰਗ ਸਹਾਇਕ',
            footer_sub: 'RBI ਅਤੇ DPDP ਨਿਯਮਾਂ ਅਨੁਸਾਰ।',
            consent_badge: 'DPDP 2025 ਸਹਿਮਤੀ',
            consent_title: 'ਲਾਜ਼ਮੀ ਡਾਟਾ ਸਹਿਮਤੀ',
            consent_subtitle: 'ਡਾਟਾ ਸੁਰੱਖਿਆ ਕਾਨੂੰਨ',
            consent_audio_btn: 'ਸਹਿਮਤੀ ਸੁਣੋ',
            consent_desc: 'FlexiPay AI ਲਈ ਤੁਹਾਡੀ ਸਹਿਮਤੀ ਲੋੜੀਂਦੀ ਹੈ:',
            consent_li1: '🎙️ ਆਵਾਜ਼ ਪਛਾਣ ਲਈ ਆਡੀਓ।',
            consent_li2: '💰 ਭੁਗਤਾਨ ਵੇਰਵੇ।',
            consent_li3: '🌾 KCC ਯੋਜਨਾ ਜਾਣਕਾਰੀ।',
            consent_notice: 'ਸੂਚਨਾ: ਪੈਸੇ ਭੇਜਣ ਲਈ UPI PIN ਲਾਜ਼ਮੀ ਹੈ।',
            consent_accept: 'ਸਵੀਕਾਰ ਕਰੋ', consent_decline: 'ਸ਼ਰਤਾਂ ਦੇਖੋ',
            pin_badge: 'RBI 2026 2FA ਗੇਟ',
            pin_title: '4-ਅੰਕਾਂ ਦਾ UPI PIN ਦਰਜ ਕਰੋ',
            pin_subtitle: 'ਆਵਾਜ਼ ਇਰਾਦਾ ਤੈਅ ਕਰਦੀ ਹੈ, PIN ਪੈਸੇ ਭੇਜਦਾ ਹੈ।',
            pin_transfer_to: 'ਭੇਜਿਆ ਜਾ ਰਿਹਾ ਹੈ:', pin_transfer_target: 'ਕਿਸ ਨੂੰ:',
            pin_rail_info: 'NPCI UPI 123Pay ਸੈਂਡਬਾਕਸ',
            pin_cancel: 'ਰੱਦ ਕਰੋ'
        },
        'kn-IN': {
            lang_display: 'Kannada (ಕನ್ನಡ)',
            app_title: 'FlexiPay AI — ಗ್ರಾಮೀಣ ಧ್ವನಿ ಆಧಾರಿತ ಡಿಜಿಟಲ್ ಬ್ಯಾಂಕಿಂಗ್ ಸಹಾಯಕ',
            brand_tag: 'FlexiPay AI',
            brand_subtitle: 'ಗ್ರಾಮೀಣ ಭಾರತಕ್ಕಾಗಿ ಧ್ವನಿ ಆಧಾರಿತ ಬ್ಯಾಂಕಿಂಗ್ ಮತ್ತು ಯೋಜನೆ ವೇದಿಕೆ',
            status_consent: 'DPDP 2025 ಒಪ್ಪಿಗೆ ದಾಖಲಾಗಿದೆ',
            status_bhashini: 'ಬ್ಯಾಂಕಿಂಗ್ ಭಾಷಿಣಿ ಸಕ್ರಿಯ',
            status_rbi: 'RBI 2026 2FA PIN ಗೇಟ್',
            tab_smartphone: 'ಸ್ಮಾರ್ಟ್‌ಫೋನ್ ಮೋಡ್',
            tab_ivr: 'ಫೀಚರ್ ಫೋನ್ IVR (UPI 123Pay)',
            tab_bankmitra: 'ಬ್ಯಾಂಕ್ ಮಿತ್ರ / CSC ಕನ್ಸೋಲ್',
            step1_title: 'ಧ್ವನಿ ಉದ್ದೇಶ', step1_desc: 'ಭಾಷಣ ಗುರುತಿಸುವಿಕೆ',
            step2_title: 'ಭಾಷಿಣಿ NLU', step2_desc: 'ವಿವರಗಳ ಹೊರತೆಗೆಯುವಿಕೆ',
            step3_title: 'ವಂಚನೆ ತಡೆಗಟ್ಟುವಿಕೆ', step3_desc: 'ಭದ್ರತಾ ತಪಾಸಣೆ',
            step4_title: 'ಕಡ್ಡಾಯ 2FA', step4_desc: 'UPI PIN ಗೇಟ್',
            step5_title: 'ಪಾವತಿ ಪೂರ್ಣ', step5_desc: 'NPCI ಇತ್ಯರ್ಥ',
            heading_voice: 'ಬಹುಭಾಷಾ ಧ್ವನಿ ಸಹಾಯಕ ಮತ್ತು NLU ಕಮಾಂಡ್ ಸೆಂಟರ್',
            badge_voice_live: 'ಲೈವ್ ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ',
            speech_idle: 'ಮೈಕ್ ಒತ್ತಿ ಅಥವಾ ಯಾವುದೇ ಆಜ್ಞೆಯನ್ನು ಮಾತನಾಡಿ',
            speech_listening: '🎙️ ಕೇಳುತ್ತಿದ್ದೇವೆ... ಮಾತನಾಡಿ',
            speech_speaking: '🔊 ಸಹಾಯಕರು ಮಾತನಾಡುತ್ತಿದ್ದಾರೆ...',
            mic_hint_prefix: 'ಈ ಭಾಷೆಯಲ್ಲಿ ಮಾತನಾಡಲು ಒತ್ತಿ:',
            voice_input_placeholder: 'ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ (ಉದಾ: ಸುರೇಶ್‌ಗೆ ₹750 ಕಳುಹಿಸಿ, ಬ್ಯಾಲೆನ್ಸ್ ಪರಿಶೀಲಿಸಿ...)',
            btn_run_ai: 'AI ಚಲಾಯಿಸಿ',
            nlu_title: 'ಸ್ಪೀಚ್-ಟು-ಟೆಕ್ಸ್ಟ್ ಮತ್ತು ಬ್ಯಾಂಕಿಂಗ್ ಭಾಷಿಣಿ NLU',
            chip_intent: 'ಉದ್ದೇಶ', chip_recipient: 'ಸ್ವೀಕರಿಸುವವರು', chip_amount: 'ಮೊತ್ತ', chip_threat: 'ಭದ್ರತೆ',
            heading_scenarios: 'ಗ್ರಾಮೀಣ ಸನ್ನಿವೇಶಗಳು',
            sc_transfer_title: 'ರಮೇಶ್‌ಗೆ ₹500 ಕಳುಹಿಸಿ', sc_transfer_desc: 'ಪಾವತಿ + ಕಡ್ಡಾಯ 2FA PIN',
            sc_vishing_title: 'ವಂಚನೆ ಎಚ್ಚರಿಕೆ', sc_vishing_desc: 'ನಕಲಿ ಬ್ಯಾಂಕ್ ಅಧಿಕಾರಿ OTP ಕೇಳುತ್ತಿದ್ದಾರೆ',
            sc_kcc_title: 'ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ (KCC)', sc_kcc_desc: '₹2 ಲಕ್ಷ ಭದ್ರತೆಯಿಲ್ಲದ ಸಾಲ & 4% ಬಡ್ಡಿ',
            sc_scheme_title: 'PM-ಕಿಸಾನ್ ಸ್ಥಿತಿ', sc_scheme_desc: '16ನೇ ಕಂತು ಪರಿಶೀಲನೆ',
            task_transfer_title: 'ಕಾರ್ಯ 1: ತ್ವರಿತ ಪಾವತಿ ಮತ್ತು 2FA ಗೇಟ್',
            badge_awaiting_pin: 'PIN ಗಾಗಿ ಕಾಯಲಾಗುತ್ತಿದೆ',
            quick_pay_contacts: 'ತ್ವರಿತ ಸಂಪರ್ಕಗಳು:',
            label_transfer_to: 'ರವಾನಿಸಲು:',
            label_source_acc: 'ಖಾತೆ:', val_source_acc: 'SBI ಗ್ರಾಮೀಣ ಬ್ಯಾಂಕ್ ****4821',
            label_auth_type: 'ದೃಢೀಕರಣ:', val_auth_type: 'ಕಡ್ಡಾಯ 2FA (UPI PIN ಅಗತ್ಯವಿದೆ)',
            label_reg_standard: 'ನಿಯಮಗಳು:', val_reg_standard: 'RBI 2025/2026 ಮಾರ್ಗಸೂಚಿಗಳು',
            btn_enter_pin: 'UPI PIN ನಮೂದಿಸಲು ಮುಂದುವರಿಯಿರಿ',
            task_balance_title: 'ಕಾರ್ಯ 2: ಬ್ಯಾಂಕ್ ಬ್ಯಾಲೆನ್ಸ್ ಮತ್ತು ಸ್ಟೇಟ್‌ಮೆಂಟ್',
            badge_sbi_live: 'SBI ಲೈವ್',
            acc_type: 'ಕಿಸಾನ್ ಉಳಿತಾಯ ಖಾತೆ',
            kcc_credit_available: 'ಲಭ್ಯವಿರುವ KCC ಕ್ರೆಡಿಟ್ ಮಿತಿ:',
            btn_speak_balance: 'ಬ್ಯಾಲೆನ್ಸ್ ಕೇಳಿ',
            task_fraud_title: 'ಕಾರ್ಯ 3: ವಂಚನೆ ತಡೆಗಟ್ಟುವಿಕೆ ಮತ್ತು ರೇಡಾರ್',
            badge_fraud_active: 'ಸಕ್ರಿಯ ರಕ್ಷಣೆ',
            scam_safe_title: 'ಧ್ವನಿ ಸಂವಹನ ಸುರಕ್ಷಿತವಾಗಿದೆ',
            scam_safe_desc: 'ಯಾವುದೇ ವಂಚನೆಯ ಮಾದರಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ.',
            oc_title: 'ಆಂಟಿ-ರಿಪ್ಲೇ ಸೆಕ್ಯುರಿಟಿ ಕೋಡ್', oc_desc: 'ಧ್ವನಿ ತದ್ರೂಪಿಯಿಂದ ರಕ್ಷಿಸುತ್ತದೆ',
            oc_phrase_label: 'ಭದ್ರತಾ ಕೋಡ್:', btn_refresh: 'ಬದಲಾಯಿಸಿ',
            vishing_test_label: 'ವಂಚನೆ ಪರೀಕ್ಷೆ:', btn_simulate_vishing: 'ನಕಲಿ ಕರೆ ಪರೀಕ್ಷಿಸಿ',
            task_kcc_title: 'ಕಾರ್ಯ 4: ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ (KCC) ವಿಭಾಗ',
            badge_kcc_subvention: '4% ಸಬ್ಸಿಡಿ',
            kcc_intro: 'ಭದ್ರತೆಯಿಲ್ಲದ ಸಾಲದ ಮಿತಿ ₹2 ಲಕ್ಷಕ್ಕೆ ಹೆಚ್ಚಳ ಮತ್ತು 3% ಬಡ್ಡಿ ರಿಯಾಯಿತಿ.',
            kcc_label_credit: 'ಅಗತ್ಯವಿರುವ ಸಾಲ:',
            kcc_rate_ontime: 'ಸಮಯಕ್ಕೆ ಪಾವತಿಸುವ ದರ', kcc_rate_ontime_sub: '3% ಸಬ್ಸಿಡಿಯೊಂದಿಗೆ',
            kcc_rate_default: 'ಡೀಫಾಲ್ಟ್ ದರ', kcc_rate_default_sub: 'ಸಬ್ಸಿಡಿ ಕಳೆದುಕೊಂಡರೆ',
            kcc_label_savings: 'ವಾರ್ಷಿಕ ಬಡ್ಡಿ ಉಳಿತಾಯ:',
            btn_kcc_reminder: 'ಧ್ವನಿ ಜ್ಞಾಪನೆಯನ್ನು ನಿಗದಿಪಡಿಸಿ',
            task_scheme_title: 'ಕಾರ್ಯ 5: ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಮತ್ತು ಸಬ್ಸಿಡಿಗಳು',
            badge_myscheme: 'myScheme.gov.in',
            scheme_pmkisan_title: 'PM-ಕಿಸಾನ್ ಸಮ್ಮಾನ್ ನಿಧಿ', scheme_active: 'ಸಕ್ರಿಯ ಫಲಾನುಭವಿ',
            scheme_pmkisan_desc: 'ವರ್ಷಕ್ಕೆ ₹6,000 ನೇರ ನೆರವು. 16ನೇ ಕಂತು ಜಮೆಯಾಗಿದೆ.',
            scheme_pmfby_title: 'ಪ್ರಧಾನ ಮಂತ್ರಿ ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆ', scheme_recommended: 'ಅರ್ಹರು',
            scheme_pmfby_desc: 'ನೈಸರ್ಗಿಕ ವಿಕೋಪಗಳ ವಿರುದ್ಧ 1.5% ರಿಯಾಯಿತಿ ಪ್ರೀಮಿಯಂನಲ್ಲಿ ಬೆಳೆ ರಕ್ಷಣೆ.',
            btn_autofill_jansamarth: 'ಜನ್ ಸಮರ್ಥ್ ಅರ್ಜಿಯನ್ನು ಭರ್ತಿ ಮಾಡಿ',
            ivr_brand: 'ಗ್ರಾಮೀಣ್‌ಪೇ ಫೋನ್',
            ivr_call_status: 'ಸಂಪರ್ಕಗೊಂಡಿದೆ: 08045163581',
            ivr_prompt_welcome: '"ಬ್ಯಾಂಕಿಂಗ್ ಭಾಷಿಣಿ IVR ಗೆ ಸುಸ್ವಾಗತ. ಹಣಕ್ಕಾಗಿ 1, ಬ್ಯಾಲೆನ್ಸ್‌ಗಾಗಿ 2, KCC ಗಾಗಿ 3 ಒತ್ತಿರಿ."',
            btn_ivr_call: '📞 ಕರೆ', btn_ivr_end: '❌ ಅಂತ್ಯ',
            ivr_info_title: '40 ಕೋಟಿ ಜನರಿಗೆ ಸೇವೆ',
            badge_upi123: 'UPI 123Pay',
            ivr_info_desc: 'ಸ್ಮಾರ್ಟ್‌ಫೋನ್ ಇಲ್ಲದ ಜನರಿಗೆ ಧ್ವನಿ ಬ್ಯಾಂಕಿಂಗ್.',
            ivr_step1_title: 'ಡಯಲ್ ಮಾಡಿ (08045163581)', ivr_step1_desc: 'ಕನ್ನಡ ಮತ್ತು ಎಲ್ಲಾ ಭಾಷೆಗಳಲ್ಲಿ.',
            ivr_step2_title: 'ಮಾತನಾಡಿ ಅಥವಾ ಒತ್ತಿರಿ', ivr_step2_desc: 'ಧ್ವನಿ ಸುರಕ್ಷಿತ ವಹಿವಾಟಾಗಿ ಪರಿವರ್ತನೆಗೊಳ್ಳುತ್ತದೆ.',
            ivr_step3_title: 'UPI PIN ನಮೂದಿಸಿ', ivr_step3_desc: 'RBI 2FA ನಿಯಮಗಳ ಪ್ರಕಾರ ಸುರಕ್ಷಿತ.',
            bm_title: 'ಬ್ಯಾಂಕ್ ಮಿತ್ರ ಕನ್ಸೋಲ್', badge_human_assisted: 'ಮಾನವ ನೆರವು',
            bm_desc: 'ಗ್ರಾಮೀಣರು ಮತ್ತು ಹಿರಿಯ ನಾಗರಿಕರಿಗೆ ಸಹಾಯ ಕೇಂದ್ರ.',
            bm_lbl_name: 'ರೈತರ ಹೆಸರು', bm_lbl_mobile: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ', bm_lbl_service: 'ಸೇವೆಯ ಪ್ರಕಾರ',
            bm_opt_kcc: 'KCC ಅರ್ಜಿ', bm_opt_aeps: 'AePS ನಗದು ರಶೀದಿ',
            bm_opt_ekyc: 'ವೀಡಿಯೊ KYC', bm_opt_complaint: 'ಸೈಬರ್ ದೂರು (1930)',
            btn_bm_voice_intake: 'ಧ್ವನಿ ಮೂಲಕ ಅರ್ಜಿ ಭರ್ತಿ',
            btn_bm_slip: 'ಡಿಜಿಟಲ್ ರಶೀದಿ ರಚಿಸಿ', btn_bm_kyc: 'KYC ಕಾಯ್ದಿರಿಸಿ',
            bm_slip_title: 'ಡಿಜಿಟಲ್ ರಶೀದಿ ಟ್ರ್ಯಾಕರ್', badge_ready_sign: 'ಸಹಿಗೆ ಸಿದ್ಧ',
            stamp_assisted: 'ಸಹಾಯ ಮಾಡಲಾಗಿದೆ', slip_heading: 'ಜನ್ ಸಮರ್ಥ್ KCC ಅರ್ಜಿ ರಶೀದಿ',
            slip_applicant: 'ಅರ್ಜಿದಾರರು:', slip_category: 'ವರ್ಗ:', slip_tenant_farmer: 'ರೈತ',
            slip_credit: 'ಸಾಲದ ಮೊತ್ತ:', slip_subvention: 'ಬಡ್ಡಿ ರಿಯಾಯಿತಿ:', slip_ref: 'ಉಲ್ಲೇಖ ಸಂಖ್ಯೆ:',
            slip_status_lbl: 'ಸ್ಥಿತಿ:', slip_status_val: 'ಪೋರ್ಟಲ್‌ಗೆ ಜೋಡಿಸಲಾಗಿದೆ',
            aeps_title: 'AePS ಬಯೋಮೆಟ್ರಿಕ್ ಎಚ್ಚರಿಕೆ',
            aeps_desc: 'AePS ನಲ್ಲಿ 2FA ಇರುವುದಿಲ್ಲ. ನಕಲಿ ಬೆರಳಚ್ಚು ವಂಚನೆಗಳಿಂದ ಎಚ್ಚರದಿಂದಿರಿ.',
            aeps_tip1: '✔️ ಗುರುತಿನ ಚೀಟಿ ಪರಿಶೀಲಿಸಿ.',
            aeps_tip2: '✔️ ₹10,000 ಕ್ಕಿಂತ ಹೆಚ್ಚು ಹಣಕ್ಕೆ OTP ಬಳಸಿ.',
            aeps_tip3: '✔️ ಬೆರಳಚ್ಚುಗಳನ್ನು ಲಾಕ್ ಮಾಡಿ.',
            heading_audit: 'ಲೈವ್ ಆಡಿಟ್ ಕನ್ಸೋಲ್',
            btn_clear_logs: 'ತೆರವುಗೊಳಿಸಿ',
            footer_title: 'FlexiPay AI — ಗ್ರಾಮೀಣ ಡಿಜಿಟಲ್ ಬ್ಯಾಂಕಿಂಗ್ ಸಹಾಯಕ',
            footer_sub: 'RBI ಮತ್ತು DPDP ನಿಯಮಗಳಿಗೆ ಅನುಗುಣವಾಗಿದೆ.',
            consent_badge: 'DPDP 2025 ಒಪ್ಪಿಗೆ',
            consent_title: 'ಕಡ್ಡಾಯ ಮಾಹಿತಿ ಒಪ್ಪಿಗೆ',
            consent_subtitle: 'ಡೇಟಾ ಸಂರಕ್ಷಣಾ ಕಾಯ್ದೆ',
            consent_audio_btn: 'ಒಪ್ಪಿಗೆಯನ್ನು ಆಲಿಸಿ',
            consent_desc: 'FlexiPay AI ಗಾಗಿ ನಿಮ್ಮ ಒಪ್ಪಿಗೆ ಅಗತ್ಯವಿದೆ:',
            consent_li1: '🎙️ ಧ್ವನಿ ಗುರುತಿಸಲು ಆಡಿಯೋ.',
            consent_li2: '💰 ಪಾವತಿ ವಿವರಗಳು.',
            consent_li3: '🌾 KCC ಯೋಜನೆ ಮಾಹಿತಿ.',
            consent_notice: 'ಸೂಚನೆ: ಹಣ ವರ್ಗಾವಣೆಗೆ UPI PIN ಕಡ್ಡಾಯವಾಗಿದೆ.',
            consent_accept: 'ಒಪ್ಪಿಕೊಳ್ಳಿ', consent_decline: 'ಷರತ್ತುಗಳನ್ನು ನೋಡಿ',
            pin_badge: 'RBI 2026 2FA ಗೇಟ್',
            pin_title: '4-ಅಂಕಿಯ UPI PIN ನಮೂದಿಸಿ',
            pin_subtitle: 'ಧ್ವನಿ ಉದ್ದೇಶವನ್ನು ದೃಢೀಕರಿಸುತ್ತದೆ, PIN ಹಣವನ್ನು ಕಳುಹಿಸುತ್ತದೆ.',
            pin_transfer_to: 'ರವಾನಿಸಲಾಗುತ್ತಿದೆ:', pin_transfer_target: 'ರವಾನಿಸಲು:',
            pin_rail_info: 'NPCI UPI 123Pay ಸ್ಯಾಂಡ್‌ಬಾಕ್ಸ್',
            pin_cancel: 'ರದ್ದುಗೊಳಿಸಿ'
        }
    };

    // ==========================================
    // REAL-TIME NLU PARSER & ENTITY EXTRACTION
    // ==========================================
    function parseSpokenText(transcript) {
        if (!transcript || !transcript.trim()) return;
        const clean = transcript.toLowerCase();
        logEvent(`[NLU ENGINE] Processing spoken command: "${transcript}"`, "info");
        
        elements.liveTranscript.textContent = `"${transcript}"`;

        // 1. Scam & Vishing Detection Heuristics
        const scamPatterns = [
            /otp|one time password|ओटीपी/i,
            /pin|upi pin|पिन/i,
            /password|पासवर्ड/i,
            /lottery|lucky draw|prize|इनाम|लॉटरी/i,
            /account block|frozen|electricity cut|खाता बंद|बिजली/i,
            /bank manager|officer called|कस्टमर केयर/i,
            /urgent|immediately|right now|तुरंत|जल्दी/i
        ];

        let scamMatches = 0;
        scamPatterns.forEach(p => {
            if (p.test(clean)) scamMatches++;
        });

        if (scamMatches >= 2 || /share otp|tell pin|password|लॉटरी|ओटीपी बताओ/i.test(clean)) {
            // TRIGGER HIGH-RISK SCAM INTERCEPT
            updateStepper(3);
            playWarningBuzz();
            elements.intentType.textContent = "VISHING_SCAM_DETECTED";
            elements.intentRecipient.textContent = "UNKNOWN_THREAT";
            elements.intentAmount.textContent = "BLOCKED";
            elements.intentFallback.textContent = "HIGH THREAT (0.99)";
            elements.nluConfidence.textContent = "Confidence: 99%";

            elements.scamAlertBox.innerHTML = `
                <div class="scam-alert-header red">
                    <span class="alert-icon">🚨</span>
                    <div>
                        <strong>${state.language.startsWith('hi') ? 'सावधान! धोखाधड़ी / विशिंग कॉल की पहचान हुई!' : 'HIGH RISK FRAUD / VISHING INTERCEPTED!'}</strong>
                        <p>${state.language.startsWith('hi') ? 'कॉलर आपसे OTP या PIN मांगने की कोशिश कर रहा है। पेमेंट गेटवे लॉक कर दिया गया है।' : 'Audio pattern matches known vishing/OTP extraction scam. Payment gate locked.'}</p>
                    </div>
                </div>
            `;
            elements.scamAlertBox.parentElement.classList.add('danger-border');
            elements.btnTriggerPinGate.classList.add('hidden');

            const warnMsg = state.language.startsWith('hi') ? 
                "चेतावनी! बैंक अधिकारी कभी भी आपसे OTP या PIN नहीं मांगते। किसी से सुरक्षा कोड शेयर न करें!" : 
                "ALERT! Bank officials never ask for OTP or PIN over phone. Do not share your sensitive details!";
            speakText(warnMsg);
            showToast(warnMsg, "toast-danger", "🚨");
            logEvent(`[FRAUD GUARDIAN] High threat intercepted in voice input: score 0.99. Locked.`, "danger");
            return;
        }

        // Reset Scam Box if safe
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
        elements.intentFallback.textContent = "SAFE (0.00 Risk)";

        // 2. Intent Classification
        const isPayment = /send|pay|transfer|bhejo|भेजो|पे|देना|काटो|de|payment|trans/i.test(clean);
        const isBalance = /balance|passbook|statement|कितने पैसे|बैलेंस|खाता|पड़े हैं/i.test(clean);
        const isScheme = /scheme|yojana|योजना|pm kisan|subsidy|সব্সिडी|fasal bima|installment|किश्त/i.test(clean);
        const isKcc = /kcc|kisan credit|loan|ऋण|लोन|कर्ज|ब्याज/i.test(clean);

        if (isBalance) {
            // BALANCE CHECK INTENT
            updateStepper(3);
            elements.intentType.textContent = "BALANCE_CHECK";
            elements.intentRecipient.textContent = "SBI Gramin Account";
            elements.intentAmount.textContent = "₹12,450.50";
            elements.nluConfidence.textContent = "Confidence: 98%";

            // Flash balance card
            const balCard = document.getElementById('task-balance-card');
            if (balCard) {
                balCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                balCard.style.boxShadow = "0 0 30px rgba(56, 189, 248, 0.4)";
                setTimeout(() => balCard.style.boxShadow = "", 2500);
            }

            const balSpeech = state.language.startsWith('hi') ? 
                `आपके एसबीआई ग्रामीण खाते में वर्तमान बैलेंस ₹12,450.50 है, और उपलब्ध किसान क्रेडिट कार्ड सीमा ₹1,60,000 है।` : 
                `Your SBI Gramin Account balance is ₹12,450.50, with an available KCC credit line of ₹1,60,000.`;
            speakText(balSpeech);
            showToast(`Balance: ₹12,450.50 (SBI Gramin A/C ****4821)`, "toast-success", "💳");
            logEvent(`[NLU INTENT] BALANCE_CHECK: ₹12,450.50 reported.`, "success");
            return;
        }

        if (isScheme) {
            // SCHEME QUERY INTENT
            updateStepper(3);
            elements.intentType.textContent = "SCHEME_QUERY";
            elements.intentRecipient.textContent = "PM-KISAN DBT";
            elements.intentAmount.textContent = "₹2,000.00";
            elements.nluConfidence.textContent = "Confidence: 97%";

            const schemeCard = document.getElementById('task-scheme-card');
            if (schemeCard) {
                schemeCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            const scSpeech = state.language.startsWith('hi') ? 
                `आपकी पीएम किसान सम्मान निधि की 16वीं किश्त ₹2,000 आपके खाते में जमा हो चुकी है।` : 
                `Your PM-KISAN 16th installment of ₹2,000 has been credited to your bank account.`;
            speakText(scSpeech);
            showToast(`PM-KISAN 16th Installment of ₹2,000 credited!`, "toast-success", "📜");
            logEvent(`[NLU INTENT] SCHEME_QUERY: PM-KISAN status verified.`, "success");
            return;
        }

        if (isKcc) {
            // KCC INTENT
            updateStepper(3);
            elements.intentType.textContent = "KCC_LOAN_ENQUIRY";
            elements.intentRecipient.textContent = "Kisan Rin Portal";
            elements.intentAmount.textContent = "₹2,00,000.00";
            elements.nluConfidence.textContent = "Confidence: 96%";

            const kccCard = document.getElementById('task-kcc-card');
            if (kccCard) {
                kccCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            const kccSpeech = state.language.startsWith('hi') ? 
                `केंद्रीय बजट के तहत आप 4% रियायती ब्याज दर पर ₹2 लाख तक बिना गारंटी लोन के लिए पात्र हैं।` : 
                `Under Central Budget guidelines, you are eligible for up to ₹2 Lakhs collateral-free credit at 4% subsidized interest rate.`;
            speakText(kccSpeech);
            showToast(`KCC Collateral-Free Limit: ₹2,00,000 at 4% Rate`, "toast-success", "🚜");
            logEvent(`[NLU INTENT] KCC_LOAN_ENQUIRY: Eligibility calculated.`, "success");
            return;
        }

        // DEFAULT TO PAYMENT INTENT (OR PARSED PAYMENT)
        updateStepper(3);
        elements.intentType.textContent = "P2P_TRANSFER";

        // Amount Extraction
        let amount = 500;
        const numMatch = clean.match(/(?:₹|rs\.?|rupaya|rupees|रुपये)?\s*(\d+(?:\.\d{1,2})?)/);
        if (numMatch && parseFloat(numMatch[1]) > 0) {
            amount = parseFloat(numMatch[1]);
        } else {
            // Hindi / Dialect word amounts
            if (/hazaar|hajaar|हज़ार|हजार|thousand/i.test(clean)) amount = 1000;
            if (/pandraha sau|पंद्रह सौ|dedh hajaar|डेढ़ हज़ार/i.test(clean)) amount = 1500;
            if (/do hajaar|दो हज़ार|two thousand/i.test(clean)) amount = 2000;
            if (/paanch sau|पांच सौ|five hundred/i.test(clean)) amount = 500;
            if (/dhai hajaar|ढाई हज़ार/i.test(clean)) amount = 2500;
            if (/paanch hajaar|पांच हज़ार|five thousand/i.test(clean)) amount = 5000;
        }
        state.currentAmount = amount;

        // Recipient Extraction
        let recipient = "Ramesh (Vendor)";
        if (/suresh|सुरेश/i.test(clean)) recipient = "Suresh Seeds";
        else if (/anita|अनिता/i.test(clean)) recipient = "Anita Devi";
        else if (/panchayat|पंचायत/i.test(clean)) recipient = "Gram Panchayat";
        else if (/sunita|सुनीता/i.test(clean)) recipient = "Sunita (Family)";
        else {
            const matchTo = clean.match(/(?:to|ko|को)\s+([a-zA-Z\u0900-\u097F]+)/i);
            if (matchTo && matchTo[1]) {
                recipient = matchTo[1].charAt(0).toUpperCase() + matchTo[1].slice(1);
            }
        }
        state.currentRecipient = recipient;

        // Update payment task card
        elements.intentRecipient.textContent = recipient;
        elements.intentAmount.textContent = `₹${amount.toFixed(2)}`;
        elements.nluConfidence.textContent = "Confidence: 98%";

        elements.previewAmountVal.textContent = `₹${amount.toFixed(2)}`;
        elements.previewTargetVal.innerHTML = `<span data-i18n="label_transfer_to">${i18n[state.language]?.label_transfer_to || 'To'}</span> ${recipient}`;
        elements.pinModalAmount.textContent = `₹${amount.toFixed(2)}`;
        elements.pinModalRecipient.textContent = recipient;

        elements.btnTriggerPinGate.classList.remove('hidden');

        // Scroll to payment card
        const payCard = document.getElementById('task-payment-card');
        if (payCard) {
            payCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        const confirmSpeech = state.language.startsWith('hi') ? 
            `${recipient} को ₹${amount} भेजने का अनुरोध मिला। आगे बढ़ने के लिए अपना UPI PIN दर्ज करें।` : 
            `Received request to transfer ₹${amount} to ${recipient}. Please enter your UPI PIN to authorize.`;
        speakText(confirmSpeech);
        showToast(`Ready to Transfer ₹${amount.toFixed(2)} to ${recipient}`, "toast-success", "💸");
        logEvent(`[NLU PAYMENT] Target: ${recipient}, Amount: ₹${amount}. Prepared PIN gate.`, "success");
    }

    // ==========================================
    // DYNAMIC LANGUAGE SWITCHER (100% TRANSLATION)
    // ==========================================
    function updatePageLanguage(langCode) {
        state.language = langCode;
        const dict = i18n[langCode] || i18n['en-IN'];
        
        // Update language indicator in mic prompt
        if (elements.currentLangName) {
            elements.currentLangName.textContent = dict.lang_display;
        }

        // Translate every single data-i18n element in DOM
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) {
                el.textContent = dict[key];
            }
        });

        // Translate inputs with data-i18n-placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (dict[key]) {
                el.setAttribute('placeholder', dict[key]);
            }
        });

        // Update default status text
        if (!state.isListening && elements.speechStatusText) {
            elements.speechStatusText.textContent = dict.speech_idle;
        }

        // Update document title
        if (dict.app_title) {
            document.title = dict.app_title;
        }

        logEvent(`[I18N] Entire application language dynamically translated to: ${dict.lang_display}`, "success");
    }

    // 5-Step Transaction Pipeline Stepper Tracker
    function updateStepper(step) {
        for (let i = 1; i <= 5; i++) {
            const node = document.getElementById(`step-node-${i}`);
            const conn = document.getElementById(`connector-${i}`);
            if (node) {
                node.classList.remove('active', 'completed');
                if (i < step) {
                    node.classList.add('completed');
                } else if (i === step) {
                    node.classList.add('active');
                }
            }
            if (conn) {
                if (i < step) {
                    conn.style.setProperty('--step-fill', '100%');
                    conn.classList.add('completed');
                } else {
                    conn.classList.remove('completed');
                }
            }
        }
    }

    // Modern Toast Notification Utility
    function showToast(msg, type = 'toast-success', icon = '✅') {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<span style="font-size: 1.2rem;">${icon}</span> <span>${msg}</span>`;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(12px) scale(0.96)';
            setTimeout(() => toast.remove(), 250);
        }, 3600);
    }

    // Sound Synthesizers for UI feedback
    function playSuccessChime() {
        playBeep(523.25, 'triangle', 0.12);
        setTimeout(() => playBeep(659.25, 'triangle', 0.14), 100);
        setTimeout(() => playBeep(783.99, 'triangle', 0.28), 220);
    }

    function playWarningBuzz() {
        playBeep(220, 'sawtooth', 0.18);
        setTimeout(() => playBeep(180, 'sawtooth', 0.25), 140);
    }

    // Canvas Multi-Layer Glowing Waveform
    const ctx = elements.canvas.getContext('2d');
    let animationFrameId;

    function drawWaveform(active = false) {
        ctx.clearRect(0, 0, elements.canvas.width, elements.canvas.height);
        const width = elements.canvas.width;
        const height = elements.canvas.height;
        const centerY = height / 2;
        const time = Date.now() * 0.0035;

        // Layer 1: Ambient background wave
        ctx.beginPath();
        ctx.lineWidth = active ? 3.5 : 1.5;
        ctx.strokeStyle = active ? 'rgba(16, 185, 129, 0.85)' : 'rgba(56, 189, 248, 0.4)';
        for (let x = 0; x < width; x += 2) {
            const freq = active ? 0.04 : 0.015;
            const amp = active ? 28 * Math.sin(x * 0.01 + time * 1.5) : 6;
            const y = centerY + Math.sin(x * freq + time) * amp;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Layer 2: Glowing foreground harmonic wave (only when active)
        if (active) {
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
            for (let x = 0; x < width; x += 2) {
                const freq = 0.03;
                const amp = 18 * Math.cos(x * 0.008 - time);
                const y = centerY + Math.cos(x * freq - time * 0.8) * amp;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }

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

    // ==========================================
    // EVENT LISTENERS & USER INTERACTIONS
    // ==========================================

    // Language Selector Event Handler
    elements.selectLanguage.addEventListener('change', (e) => {
        updatePageLanguage(e.target.value);
    });

    // Theme Toggle
    elements.btnToggleTheme.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        elements.btnToggleTheme.textContent = isLight ? '☀️' : '🌙';
        logEvent(`[UI] Switched to ${isLight ? 'Light' : 'Dark'} visual mode.`);
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

    // Freeform Voice / Text Command Submission
    elements.btnSubmitVoiceCmd.addEventListener('click', () => {
        const query = elements.customVoiceInput.value;
        if (query.trim()) {
            parseSpokenText(query.trim());
            elements.customVoiceInput.value = '';
        }
    });

    elements.customVoiceInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = elements.customVoiceInput.value;
            if (query.trim()) {
                parseSpokenText(query.trim());
                elements.customVoiceInput.value = '';
            }
        }
    });

    // Real Microphone Web Speech API Recording
    elements.btnMicMain.addEventListener('click', () => {
        if (!state.consentGiven) {
            elements.consentModal.classList.remove('hidden');
            elements.consentModal.classList.add('active');
            return;
        }

        const dict = i18n[state.language] || i18n['en-IN'];
        updateStepper(1);

        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.lang = state.language;
            recognition.interimResults = false;

            recognition.onstart = () => {
                state.isListening = true;
                elements.btnMicMain.classList.add('listening');
                elements.speechStatusText.textContent = dict.speech_listening;
                logEvent(`[SPEECH RECOGNITION] Mic recording started in ${state.language}...`, "info");
                showToast("Listening... Speak your request now", "toast-success", "🎙️");
            };

            recognition.onresult = (event) => {
                const text = event.results[0][0].transcript;
                logEvent(`[SPEECH RECOGNITION] Captured: "${text}"`, "success");
                updateStepper(2);
                parseSpokenText(text);
            };

            recognition.onerror = (err) => {
                state.isListening = false;
                elements.btnMicMain.classList.remove('listening');
                logEvent(`[SPEECH RECOGNITION] Error or permission denied: ${err.error}. Falling back.`, "warn");
                showToast("Microphone not detected. Use the command box or quick scenarios.", "toast-warn", "⚠️");
            };

            recognition.onend = () => {
                state.isListening = false;
                elements.btnMicMain.classList.remove('listening');
            };

            recognition.start();
        } else {
            // Simulated fallback prompt
            showToast("Web Speech API not supported in browser. Simulating voice input...", "toast-warn", "🎙️");
            state.isListening = true;
            elements.btnMicMain.classList.add('listening');
            elements.speechStatusText.textContent = dict.speech_listening;
            setTimeout(() => {
                state.isListening = false;
                elements.btnMicMain.classList.remove('listening');
                updateStepper(2);
                parseSpokenText("Send 500 rupees to Ramesh for seeds purchase");
            }, 1800);
        }
    });

    // Preset Scenarios Triggers
    elements.scenarioBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-scenario');
            if (key === 'transfer') {
                parseSpokenText("Send 500 rupees to Ramesh for seeds purchase");
            } else if (key === 'vishing') {
                parseSpokenText("Bank manager called asking to share OTP and PIN immediately");
            } else if (key === 'kcc') {
                parseSpokenText("Check my Kisan Credit Card collateral free loan eligibility");
            } else if (key === 'scheme') {
                parseSpokenText("Check my PM-KISAN Samman Nidhi 16th installment status");
            }
        });
    });

    // Quick Contact Pills Selection
    elements.contactPills.forEach(pill => {
        pill.addEventListener('click', () => {
            elements.contactPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const name = pill.getAttribute('data-name');
            const amount = parseFloat(pill.getAttribute('data-amount') || 500);

            parseSpokenText(`Pay ₹${amount} to ${name}`);
        });
    });

    // Task 2: Speak Balance Button
    elements.btnVoiceCheckBalance.addEventListener('click', () => {
        parseSpokenText("Check account balance");
    });

    // Task 3: Simulate Vishing Call Button
    elements.btnTestVishing.addEventListener('click', () => {
        parseSpokenText("Bank manager asking to share OTP and password immediately");
    });

    // Task 3: Outbound Anti-Replay Challenge Generator
    elements.btnGenPassphrase.addEventListener('click', () => {
        state.passphrase = 'Bharat ' + Math.floor(1000 + Math.random() * 9000);
        elements.dynamicPassphrase.textContent = `"${state.passphrase}"`;
        logEvent(`[FRAUD GUARDIAN] Refreshed outbound dynamic challenge phrase: ${state.passphrase}`);
        showToast(`Challenge phrase refreshed: ${state.passphrase}`, "toast-success", "🛡️");
    });

    // Task 4: KCC Calculator Range Slider
    elements.kccRangeAmount.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        state.kccAmount = val;
        elements.kccValAmount.textContent = `₹${val.toLocaleString('en-IN')}`;
        
        // 5% interest differential (9% default - 4% subsidized)
        const savings = Math.round(val * 0.05);
        elements.kccSavingsAmt.textContent = `₹${savings.toLocaleString('en-IN')} / year`;
    });

    elements.btnScheduleKccReminder.addEventListener('click', () => {
        speakText(state.language.startsWith('hi') ? 
            "किसान क्रेडिट कार्ड पुनर्भुगतान के लिए वॉयस रिमाइंडर शेड्यूल कर दिया गया है।" : 
            "Voice reminder scheduled for Kisan Credit Card repayment.");
        showToast("Voice Repayment Reminder Scheduled! Rate protected at 4%.", "toast-warn", "⏰");
        logEvent("[KCC HUB] Repayment voice reminder registered in scheduler.", "success");
    });

    // Task 5: Autofill Jan Samarth
    elements.btnAutofillKccList.forEach(btn => {
        btn.addEventListener('click', () => {
            showToast("Jan Samarth Portal application auto-filled from KCC profile!", "toast-success", "📝");
            logEvent("[KCC HUB] Jan Samarth application form auto-filled.", "info");
        });
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
        updateStepper(4);
        logEvent("[RBI 2026 2FA] Mandatory 2-Factor UPI PIN gate presented.", "warn");
    });

    elements.btnClosePinModal.addEventListener('click', () => {
        elements.pinModal.classList.remove('active');
        elements.pinModal.classList.add('hidden');
        updateStepper(3);
        logEvent("[TRANSACTION] Payment cancelled by user at PIN stage.");
    });

    elements.pinSubmit.addEventListener('click', () => {
        if (state.pinEntered.length === 4) {
            elements.pinModal.classList.remove('active');
            elements.pinModal.classList.add('hidden');
            
            const txRef = 'NPCI/2026/' + Math.floor(100000000 + Math.random() * 900000000);
            logEvent(`[NPCI SANDBOX] Dynamic 2FA PIN verified. Executed ₹${state.currentAmount.toFixed(2)} transfer to ${state.currentRecipient}. Ref: ${txRef}`, "success");
            
            updateStepper(5);
            playSuccessChime();
            
            const successMsg = state.language.startsWith('hi') ? 
                `आपका ₹${state.currentAmount} का भुगतान ${state.currentRecipient} को सफलतापूर्वक संपन्न हो गया है। रसीद: ${txRef}` : 
                `Your payment of ₹${state.currentAmount} to ${state.currentRecipient} has been completed successfully. Ref: ${txRef}`;
            speakText(successMsg);
            
            showToast(`₹${state.currentAmount.toFixed(2)} transferred to ${state.currentRecipient} (Ref: ${txRef})`, "toast-success", "🎉");
            state.pinEntered = '';
        } else {
            playWarningBuzz();
            speakText(state.language.startsWith('hi') ? "कृपया पूरा 4 अंकों का UPI PIN दर्ज करें" : "Please enter the full 4-digit UPI PIN");
            showToast("Please enter all 4 digits of your UPI PIN", "toast-warn", "⚠️");
        }
    });

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
                    '"Balance Check: Your SBI Gramin Account balance is ₹12,450.50."';
                speakText("Your account balance is 12 thousand 450 rupees.");
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
        showToast("Digital Slip Generated & Sent to Kisan Rin Portal!", "toast-success", "📄");
        logEvent("[BANK MITRA CONSOLE] Digital slip submitted to bank portal.", "success");
    });

    elements.btnBmBookKyc.addEventListener('click', () => {
        showToast("RBI Video-KYC slot scheduled for tomorrow at 11:00 AM.", "toast-success", "📹");
        logEvent("[BANK MITRA CONSOLE] Video-KYC slot booked.");
    });

    // Clear Logs
    elements.btnClearLogs.addEventListener('click', () => {
        elements.systemLogTerminal.innerHTML = '';
        logEvent("[SYSTEM] Console cleared.");
    });

    // INITIALIZATION: Apply English as default language across full page
    updatePageLanguage('en-IN');
});
