import express from "express";
import cors from "cors";
import webpush from "web-push";
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const app = express();
app.use(cors());
app.use(express.json());

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT;

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

app.post("/subscribe", async (req, res) => {
  const { user_id, endpoint, p256dh, auth, user_agent } = req.body;

  if (!user_id || !endpoint || !p256dh || !auth) {
    return res.status(400).json({ error: "missing user bits" });
  }

  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      user_id,
      endpoint,
      p256dh,
      auth,
      user_agent,
    },
    { onConflict: "user_id,endpoint" },
  );

  if (error) {
    console.error("supabase upsert failed:", error);
    return res.status(500).json({ error: error.message });
  }

  res.sendStatus(201);
});

app.post("/send", async (req, res) => {
  const user_id = req.body?.user_id;

  if (!user_id) {
    return res.status(400).json({ error: "user_id missing" });
  }

  const payload = JSON.stringify({
    title: req.body?.title,
    body: req.body?.body,
  });

  const { data: subs, error } = await supabase
    .from("push_subscriptions")
    .select("id,endpoint,p256dh,auth")
    .eq("user_id", user_id);

  if (error) {
    console.error("supabase select failed:", error);
    return res.status(500).json({ error: error.message });
  }

  const results = await Promise.allSettled(
    subs.map((row) =>
      webpush.sendNotification(
        {
          endpoint: row.endpoint,
          keys: { p256dh: row.p256dh, auth: row.auth },
        },
        payload,
      ),
    ),
  );

  res.json({
    sent: results.filter((r) => r.status === "fulfilled").length,
    total: results.length,
  });
});

app.listen(3001, () => {
  console.log("Push server running on http://localhost:3001");
});
