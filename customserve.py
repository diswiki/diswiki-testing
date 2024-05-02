from http.server import SimpleHTTPRequestHandler, HTTPServer
import os

PORT = 3000
NOT_FOUND_PAGE = '404.html'

class CustomHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        root = os.path.join(os.path.dirname(os.path.abspath(__file__)))
        if self.path == '/':
            self.path = '/index.html'
        try:
            f = open(os.path.join(root, self.path[1:]), 'rb')

            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()

            self.wfile.write(f.read())
            f.close()
        except IOError:
            f = open(os.path.join(root, NOT_FOUND_PAGE), 'rb')
            self.send_response(404)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(f.read())
            f.close()

httpd = HTTPServer(('localhost', PORT), CustomHandler)
print(f'Server running at http://localhost:{PORT}/')

httpd.serve_forever()
