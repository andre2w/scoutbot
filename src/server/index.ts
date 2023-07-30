import { createServer } from "http";

const server = createServer((req, res) => {
    let body = "";
    req.on("data", chunk => {
        body += chunk;
    });
    req.on("end", () => {
        console.log(JSON.parse(body));
        res.writeHead(204);
        res.end();
    });
});

server.listen(4433);