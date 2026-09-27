import os
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler

class CleanURLHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        # Resolve o caminho do sistema de arquivos
        clean_path = path.split('?')[0].split('#')[0]
        file_path = super().translate_path(clean_path)
        
        # Se não existe e não termina com barra, tenta achar arquivo .html
        if not os.path.exists(file_path):
            candidate = file_path.rstrip('/') + ".html"
            if os.path.isfile(candidate):
                return candidate
                
        return file_path

    def end_headers(self):
        # Desativa cache agressivo local para desenvolvimento
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def run(port=8080):
    server_address = ('0.0.0.0', port)
    httpd = HTTPServer(server_address, CleanURLHandler)
    print(f"Servidor OSP ativo em http://localhost:{port}/ com suporte a URLs limpas.")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    run(port)
