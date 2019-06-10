const json = obj => JSON.stringify(obj);

export async function post(req, res) {
  const idToken = req.body.idToken.toString();
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
  res.writeHead(200, {
    "Content-Type": "application/json"
  });

  try {
    const sessionCookie = await admin
      .auth()
      .createSessionCookie(idToken, { expiresIn });
    const options = { maxAge: expiresIn, httpOnly: true, secure: true };
    res.cookie("session", sessionCookie, options);
  } catch (error) {
    res.status(401).send("UNAUTHORIZED REQUEST!");
  }
}
