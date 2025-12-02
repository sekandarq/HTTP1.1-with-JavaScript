const http = require('http');
const url = require('url');

class MyHttpHandler {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    print_http_request_detail(){
        console.log(`::Client address  : ${this.req.socket.remoteAddress}`);
        console.log(`::Client port     : ${this.req.socket.remotePort}`);
        console.log(`::Request command : ${this.req.method}`);
        console.log(`::Request line    : ${this.req.method} ${this.req.url} HTTP/${this.req.httpVersion}`);
        console.log(`::Request path    : ${url.parse(this.req.url).pathname}`);
        console.log(`::Request version : HTTP/${this.req.httpVersion}`);
    }

    send_http_response(){
        this.res.writeHead(200, {'Content-Type': 'text/html'});
    }

    do_GET(){
        console.log("## do_GET() activated.");

        this.print_http_request_detail();
        this.send_http_response();

        const parsedUrl = url.parse(this.req.url, true);

        // GET request with parameters
        if (parsedUrl.query.var1 && parsedUrl.query.var2) {
            const p1 = parsedUrl.query.var1;
            const p2 = parsedUrl.query.var2;
            const result = this.simple_calc(parseInt(p1), parseInt(p2));

            this.res.write("<html>");
            const msg = `GET request for calculation => ${p1} x ${p2} = ${result}`;
            this.res.write(msg);
            this.res.write("</html>");

            console.log(`## GET request for calculation => ${p1} x ${p2} = ${result}.`);
    }

    // GET directory request
    else {
        this.res.write("<html>");
        this.res.write(`<p>HTTP Request GET for Path: ${parsedUrl.pathname}</p>`);
        this.res.write("</html>");

        console.log(`## GET request for directory: ${parsedUrl.pathname}.`);
    }

        this.res.end();
    }

    do_POST(){
        console.log("## do_POST() activated.");

        this.print_http_request_detail();
        this.send_http_response_header();

        let body = "";

        this.req.on("data", chunk => {
            body += chunk.toString();
        });

        this.req.on("end", () => {
            const parameter = this.parameter_retrieval(body);
            const result = this.simple_calc(parameter[0], parameter[1]);

            const msg = `POST request for calculation => ${parameter[0]} x ${parameter[1]} = ${result}`;
            this.res.write(msg);

            console.log(`## POST request data => ${body}.`);
            console.log(`## POST request for calculation => ${parameter[0]} x ${parameter[1]} = ${result}.`);

            this.res.end();
        });
    }

    log_message(format, ...args){
        return;
    }

    simple_calc(para1, para2){
        return para1 * para2;
    }

    parameter_retrieval(msg){
        const fields = msg.split("&");
        const p1 = parseInt(fields[0].split("=")[1]);
        const p2 = parseInt(fields[1].split("=")[1]);
        return [p1, p2];
    }
}

// HTTP Server Setup
const server_name = "localhost";
const server_port = 8080;

const webServer = http.createServer((req, res) => {
    const handler = new MyHttpHandler(req, res);

    if (req.method === "GET") handler.do_GET();
    else if (req.method === "POST") handler.do_POST();
});

webServer.listen(server_port, server_name, () => {
    console.log(`## HTTP server started at http://${server_name}:${server_port}/`);
});

process.on('SIGINT', () => {
    webServer.close();
    console.log("HTTP server stopped.");
});