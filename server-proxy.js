import express from "express";
import fetch from "node-fetch";
import { createProxyMiddleware } from "http-proxy-middleware";
import { spawn } from "child_process";

const app = express();
const SHOPIFY_PORT = 9292;
const LOCAL_PORT = 4000;

// ===== 1. API PROXY (bảo mật header, gọi API ngoài) =====
app.use("/api", async (req, res) => {
  const url = new URL(req.url, "https://api.example.com"); // thay link API ngoài của bạn

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: "Bearer YOUR_SECRET_TOKEN",
        "X-Custom-Header": "abc123",
      },
    });

    const data = await response.json();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(data);
  } catch (err) {
    console.error("❌ Lỗi khi fetch API ngoài:", err);
    res.status(500).json({ error: "External API failed" });
  }
});

// ===== 2. PROXY TO SHOPIFY THEME SERVER =====
app.use(
  "/",
  createProxyMiddleware({
    target: `http://127.0.0.1:${SHOPIFY_PORT}`,
    changeOrigin: true,
    ws: true,
  })
);

// ===== 3. CHẠY SHOPIFY CLI NGẦM =====
const shopifyProcess = spawn("shopify", ["theme", "dev", "-e", "development"], {
  stdio: "inherit",
});

// ===== 4. CHẠY SERVER LOCAL PORT 4000 =====
app.listen(LOCAL_PORT, () => {
  console.log(`✅ All-in-one server running: http://localhost:${LOCAL_PORT}`);
  console.log(`➡️  Proxying theme from Shopify port ${SHOPIFY_PORT}`);
  console.log(`➡️  API proxy available at /api`);
});
