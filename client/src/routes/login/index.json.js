import * as admin from "firebase-admin";

export async function post(req, res) {
  const idToken = req.body.token.toString();
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
  try {
    const sessionCookie = await admin
      .auth()
      .createSessionCookie(idToken, { expiresIn });

    // FIXME: secure should be true for security
    const options = { maxAge: expiresIn, httpOnly: true, secure: false };
    res.cookie("session", sessionCookie, options);
    res.status(200).end();
  } catch (error) {
    console.log(error);
    res.status(401).send("UNAUTHORIZED");
  }
}
