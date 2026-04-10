const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT || 3000;
const ERP_BASE = process.env.ERP_BASE_URL || "https://erpcoe.c.erpnext.com";
const ERP_TOKEN = process.env.ERP_TOKEN || "token 5eeeb697cabb58b:15a1c848d2a25f1";

// Página inicial
app.get("/", (req, res) => {
  res.send("ERPNext open proxy online");
});

// Health check
app.get("/health", async (req, res) => {
  try {
    const response = await axios.get(
      `${ERP_BASE}/api/method/frappe.auth.get_logged_user`,
      {
        headers: {
          Authorization: ERP_TOKEN
        },
        timeout: 30000
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({
      error: err.message,
      details: err.response?.data || null
    });
  }
});

// Proxy genérico para tudo
app.all("/erp/*", async (req, res) => {
  try {
    const erpPath = req.originalUrl.replace(/^\/erp/, "");

    const response = await axios({
      method: req.method,
      url: `${ERP_BASE}${erpPath}`,
      headers: {
        Authorization: ERP_TOKEN,
        "Content-Type": "application/json"
      },
      params: req.query,
      data: req.body,
      timeout: 30000,
      validateStatus: () => true
    });

    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({
      error: err.message,
      details: err.response?.data || null
    });
  }
});

app.listen(PORT, () => {
  console.log(`ERP proxy rodando na porta ${PORT}`);
});
