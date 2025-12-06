const http = require('http');
const url = require('url');
const querystring = require('querystring');

class MembershipHandler {

    constructor() {
        this.database = {}; // In-memory database
    }

    // Post: Create a new member
    create(id, value) {
        if (this.database.hasOwnProperty(id)) {
            return { [id]: "None"};
        } else {
            this.database[id] = value;
            return { [id]: this.database[id] };
        }
    }

    // GET: Read a member by ID
    read(id) {
        if (this.database.hasOwnProperty(id)) {
            return { [id]: this.database[id] };
        } else {
            return { [id]: "None" };
        }
    }

    // PUT: Update a member by ID
    update(id, value) {
        if (this.database.hasOwnProperty(id)) {
            this.database[id] = value;
            return { [id]: this.database[id] };
        } else {
            return { [id]: "None" };
        }
    }

    // DELETE: Remove a member by ID
    delete(id) {
        if (this.database.hasOwnProperty(id)) {
            delete this.database[id];
            return { [id]: "Removed"};
        } else {
            return { [id]: "None"};
        }
    }
}

const myManager = new MembershipHandler();


// HTTP Server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Match route: /membership_api/<id>
    const match = pathname.match(/^\/membership_api\/(.+)$/);
    if (!match) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Invalid endpoint" }));
        return
    }

    const member_id = match[1];

    // Handle GET request
    if (req.method === 'GET') {
        const result = myManager.read(member_id);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
    }

    // Handle DELETE request
    else if (req.method === 'DELETE') {
        const result = myManager.delete(member_id);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
    }

    // Handle POST and PUT requests
    else if (req.method === 'POST' || req.method === 'PUT') {
        let body = '';

        req.on ('data', chunk =>{
            body += chunk.toString();
        });

        req.on("end", () => {
            const form = querystring.parse(body);
            const value = form[member_id];

            let result;

            if (req.method === 'POST') {
                result = myManager.create (member_id, value);
            } else {
                result = myManager.update(member_id, value);
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
        });
    }

    // Invalid HTTP method
    else {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end (JSON.stringify({ error: "Method not allowed" }));
    }
});

// Start server
server.listen(3000, () => {
    console.log('Membership API server running at http://localhost:3000/');
});