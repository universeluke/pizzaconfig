import express from "express";
import cors from "cors";
import webpush from "web-push";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

const subscriptions = [];

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT;

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

app.post("/subscribe", (req, res) => {
  subscriptions.push(req.body);
  res.sendStatus(201);
});

app.post("/send", async (req, res) => {
  const payload = JSON.stringify({
    title: req.body?.title ?? "pizza update",
    body: req.body?.body ?? "your pizza is cooking!",
  });

  const results = await Promise.allSettled(
    subscriptions.map((sub) => webpush.sendNotification(sub, payload)),
  );

  results.forEach((result, index) => {
    if (result.status === "rejected")
      console.error("Push failed", index, result.reason);
    else console.log("Push OK", index);
  });

  res.json({
    sent: results.filter((result) => result.status === "fulfilled").length,
    total: results.length,
  });
});

app.listen(3001, () => {
  console.log("Push server running on http://localhost:3001");
});
