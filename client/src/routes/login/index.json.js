export function get(req, res) {
  console.log(req.body);
  res.writeHead(200, {
    "Content-Type": "application/json"
  });

  res.end();
}
