import http.server
import socketserver
import urllib.parse
import io
from gtts import gTTS

PORT = 3000

LANG_MAP = {
    'en-IN': 'en',
    'en': 'en',
    'hi-IN': 'hi',
    'hi': 'hi',
    'mr-IN': 'mr',
    'mr': 'mr',
    'ta-IN': 'ta',
    'ta': 'ta',
    'te-IN': 'te',
    'te': 'te',
    'bn-IN': 'bn',
    'bn': 'bn',
    'kn-IN': 'kn',
    'kn': 'kn',
    'pa-IN': 'pa',
    'pa': 'pa'
}

class FlexiPayHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == '/api/tts':
            params = urllib.parse.parse_qs(parsed.query)
            text = params.get('text', [''])[0]
            raw_lang = params.get('lang', ['en-IN'])[0]
            lang = LANG_MAP.get(raw_lang, 'en')

            if not text.strip():
                self.send_error(400, "Missing text parameter")
                return

            try:
                # Generate Google Text-to-Speech audio in memory
                fp = io.BytesIO()
                tts = gTTS(text=text, lang=lang, slow=False)
                tts.write_to_fp(fp)
                audio_data = fp.getvalue()

                self.send_response(200)
                self.send_header('Content-Type', 'audio/mpeg')
                self.send_header('Content-Length', str(len(audio_data)))
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Cache-Control', 'public, max-age=3600')
                self.end_headers()
                self.wfile.write(audio_data)
            except Exception as e:
                print(f"[gTTS ERROR] Failed to synthesize: {e}")
                self.send_error(500, f"gTTS synthesis error: {e}")
        else:
            super().do_GET()

class ThreadedTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    daemon_threads = True
    allow_reuse_address = True

if __name__ == '__main__':
    with ThreadedTCPServer(("", PORT), FlexiPayHandler) as httpd:
        print(f"FlexiPay AI Threaded Server with gTTS active on port {PORT}...")
        httpd.serve_forever()
