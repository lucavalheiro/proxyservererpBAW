const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json({ limit: "10mb" }));

// CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS,PATCH");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

const PORT = process.env.PORT || 3000;
const ERP_BASE = process.env.ERP_BASE_URL || "https://erpcoe.c.erpnext.com";
const ERP_TOKEN = process.env.ERP_TOKEN || "token 5eeeb697cabb58b:15a1c848d2a25f1";

const OPENAPI_SPEC = {
  "openapi": "3.0.0",
  "info": {
    "title": "ERPNext O2C Complete API via Railway Proxy",
    "version": "1.0.3"
  },
  "servers": [{ "url": "https://proxyservererpbaw-production.up.railway.app" }],
  "paths": {
    "/erp/sales-order/last": {
      "get": {
        "operationId": "getLastSalesOrder",
        "summary": "Get the last created Sales Order (no params needed)",
        "responses": {
          "200": { "description": "Last Sales Order", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/DocResponse" } } } }
        }
      }
    },
    "/erp/api/resource/Sales%20Order": {
      "get": {
        "operationId": "listSalesOrders",
        "summary": "List Sales Orders",
        "parameters": [
          { "name": "fields", "in": "query", "schema": { "type": "string" } },
          { "name": "filters", "in": "query", "schema": { "type": "string" } },
          { "name": "limit", "in": "query", "schema": { "type": "integer" } },
          { "name": "order_by", "in": "query", "schema": { "type": "string" } }
        ],
        "responses": { "200": { "description": "List", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ListResponse" } } } } }
      },
      "post": {
        "operationId": "createSalesOrder",
        "summary": "Create Sales Order",
        "requestBody": { "required": true, "content": { "application/json": { "schema": { "$ref": "#/components/schemas/SalesOrderInput" } } } },
        "responses": { "200": { "description": "Created", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/DocResponse" } } } } }
      }
    },
    "/erp/api/resource/Sales%20Order/{name}": {
      "get": {
        "operationId": "getSalesOrder",
        "summary": "Get Sales Order by ID",
        "parameters": [{ "name": "name", "in": "path", "required": true, "schema": { "type": "string" } }],
        "responses": { "200": { "description": "Sales Order", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/DocResponse" } } } } }
      },
      "put": {
        "operationId": "updateSalesOrder",
        "summary": "Update Sales Order",
        "parameters": [{ "name": "name", "in": "path", "required": true, "schema": { "type": "string" } }],
        "requestBody": { "required": true, "content": { "application/json": { "schema": { "$ref": "#/components/schemas/SalesOrderInput" } } } },
        "responses": { "200": { "description": "Updated" } }
      },
      "delete": {
        "operationId": "deleteSalesOrder",
        "summary": "Delete Sales Order",
        "parameters": [{ "name": "name", "in": "path", "required": true, "schema": { "type": "string" } }],
        "responses": { "202": { "description": "Deleted" } }
      }
    },
    "/erp/api/resource/Delivery%20Note": {
      "get": {
        "operationId": "listDeliveryNotes",
        "summary": "List Delivery Notes",
        "parameters": [
          { "name": "fields", "in": "query", "schema": { "type": "string" } },
          { "name": "filters", "in": "query", "schema": { "type": "string" } },
          { "name": "limit", "in": "query", "schema": { "type": "integer" } }
        ],
        "responses": { "200": { "description": "List", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ListResponse" } } } } }
      },
      "post": {
        "operationId": "createDeliveryNote",
        "summary": "Create Delivery Note",
        "requestBody": { "required": true, "content": { "application/json": { "schema": { "$ref": "#/components/schemas/DeliveryNoteInput" } } } },
        "responses": { "200": { "description": "Created", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/DocResponse" } } } } }
      }
    },
    "/erp/api/resource/Delivery%20Note/{name}": {
      "get": {
        "operationId": "getDeliveryNote",
        "summary": "Get Delivery Note by ID",
        "parameters": [{ "name": "name", "in": "path", "required": true, "schema": { "type": "string" } }],
        "responses": { "200": { "description": "Delivery Note", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/DocResponse" } } } } }
      },
      "put": {
        "operationId": "updateDeliveryNote",
        "summary": "Update Delivery Note",
        "parameters": [{ "name": "name", "in": "path", "required": true, "schema": { "type": "string" } }],
        "requestBody": { "required": true, "content": { "application/json": { "schema": { "$ref": "#/components/schemas/DeliveryNoteInput" } } } },
        "responses": { "200": { "description": "Updated" } }
      },
      "delete": {
        "operationId": "deleteDeliveryNote",
        "summary": "Delete Delivery Note",
        "parameters": [{ "name": "name", "in": "path", "required": true, "schema": { "type": "string" } }],
        "responses": { "202": { "description": "Deleted" } }
      }
    },
    "/erp/api/resource/Sales%20Invoice": {
      "get": {
        "operationId": "listSalesInvoices",
        "summary": "List Sales Invoices",
        "parameters": [
          { "name": "fields", "in": "query", "schema": { "type": "string" } },
          { "name": "filters", "in": "query", "schema": { "type": "string" } },
          { "name": "limit", "in": "query", "schema": { "type": "integer" } }
        ],
        "responses": { "200": { "description": "List", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ListResponse" } } } } }
      },
      "post": {
        "operationId": "createSalesInvoice",
        "summary": "Create Sales Invoice",
        "requestBody": { "required": true, "content": { "application/json": { "schema": { "$ref": "#/components/schemas/SalesInvoiceInput" } } } },
        "responses": { "200": { "description": "Created", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/DocResponse" } } } } }
      }
    },
    "/erp/api/resource/Sales%20Invoice/{name}": {
      "get": {
        "operationId": "getSalesInvoice",
        "summary": "Get Sales Invoice by ID",
        "parameters": [{ "name": "name", "in": "path", "required": true, "schema": { "type": "string" } }],
        "responses": { "200": { "description": "Sales Invoice", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/DocResponse" } } } } }
      },
      "put": {
        "operationId": "updateSalesInvoice",
        "summary": "Update Sales Invoice",
        "parameters": [{ "name": "name", "in": "path", "required": true, "schema": { "type": "string" } }],
        "requestBody": { "required": true, "content": { "application/json": { "schema": { "$ref": "#/components/schemas/SalesInvoiceInput" } } } },
        "responses": { "200": { "description": "Updated" } }
      },
      "delete": {
        "operationId": "deleteSalesInvoice",
        "summary": "Delete Sales Invoice",
        "parameters": [{ "name": "name", "in": "path", "required": true, "schema": { "type": "string" } }],
        "responses": { "202": { "description": "Deleted" } }
      }
    },
    "/erp/api/resource/Payment%20Entry": {
      "get": {
        "operationId": "listPaymentEntries",
        "summary": "List Payment Entries",
        "parameters": [
          { "name": "fields", "in": "query", "schema": { "type": "string" } },
          { "name": "filters", "in": "query", "schema": { "type": "string" } },
          { "name": "limit", "in": "query", "schema": { "type": "integer" } }
        ],
        "responses": { "200": { "description": "List", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ListResponse" } } } } }
      },
      "post": {
        "operationId": "createPaymentEntry",
        "summary": "Create Payment Entry",
        "requestBody": { "required": true, "content": { "application/json": { "schema": { "$ref": "#/components/schemas/PaymentEntryInput" } } } },
        "responses": { "200": { "description": "Created", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/DocResponse" } } } } }
      }
    },
    "/erp/api/resource/Payment%20Entry/{name}": {
      "get": {
        "operationId": "getPaymentEntry",
        "summary": "Get Payment Entry by ID",
        "parameters": [{ "name": "name", "in": "path", "required": true, "schema": { "type": "string" } }],
        "responses": { "200": { "description": "Payment Entry", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/DocResponse" } } } } }
      },
      "put": {
        "operationId": "updatePaymentEntry",
        "summary": "Update Payment Entry",
        "parameters": [{ "name": "name", "in": "path", "required": true, "schema": { "type": "string" } }],
        "requestBody": { "required": true, "content": { "application/json": { "schema": { "$ref": "#/components/schemas/PaymentEntryInput" } } } },
        "responses": { "200": { "description": "Updated" } }
      },
      "delete": {
        "operationId": "deletePaymentEntry",
        "summary": "Delete Payment Entry",
        "parameters": [{ "name": "name", "in": "path", "required": true, "schema": { "type": "string" } }],
        "responses": { "202": { "description": "Deleted" } }
      }
    },
    "/erp/api/resource/Customer": {
      "get": {
        "operationId": "listCustomers",
        "summary": "List Customers",
        "parameters": [
          { "name": "fields", "in": "query", "schema": { "type": "string" } },
          { "name": "limit", "in": "query", "schema": { "type": "integer" } }
        ],
        "responses": { "200": { "description": "List", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ListResponse" } } } } }
      }
    },
    "/erp/api/resource/Customer/{name}": {
      "get": {
        "operationId": "getCustomer",
        "summary": "Get Customer by ID",
        "parameters": [{ "name": "name", "in": "path", "required": true, "schema": { "type": "string" } }],
        "responses": { "200": { "description": "Customer", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/DocResponse" } } } } }
      }
    },
    "/erp/api/resource/Item": {
      "get": {
        "operationId": "listItems",
        "summary": "List Items",
        "parameters": [
          { "name": "fields", "in": "query", "schema": { "type": "string" } },
          { "name": "limit", "in": "query", "schema": { "type": "integer" } }
        ],
        "responses": { "200": { "description": "List", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ListResponse" } } } } }
      }
    },
    "/erp/api/resource/Item/{name}": {
      "get": {
        "operationId": "getItem",
        "summary": "Get Item by ID",
        "parameters": [{ "name": "name", "in": "path", "required": true, "schema": { "type": "string" } }],
        "responses": { "200": { "description": "Item", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/DocResponse" } } } } }
      }
    },
    "/erp/api/resource/Bin": {
      "get": {
        "operationId": "listBin",
        "summary": "List Stock levels",
        "parameters": [
          { "name": "fields", "in": "query", "schema": { "type": "string" } },
          { "name": "filters", "in": "query", "schema": { "type": "string" } },
          { "name": "limit", "in": "query", "schema": { "type": "integer" } }
        ],
        "responses": { "200": { "description": "Stock", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ListResponse" } } } } }
      }
    },
    "/erp/api/method/frappe.auth.get_logged_user": {
      "get": {
        "operationId": "checkAuth",
        "summary": "Check authentication",
        "responses": { "200": { "description": "Logged user" } }
      }
    }
  },
  "components": {
    "schemas": {
      "ListResponse": { "type": "object", "properties": { "data": { "type": "array", "items": { "type": "object" } } } },
      "DocResponse": { "type": "object", "properties": { "data": { "type": "object" } } },
      "SalesOrderInput": {
        "type": "object",
        "properties": {
          "customer": { "type": "string" }, "delivery_date": { "type": "string" },
          "selling_price_list": { "type": "string" },
          "items": { "type": "array", "items": { "type": "object", "properties": {
            "item_code": { "type": "string" }, "qty": { "type": "number" },
            "rate": { "type": "number" }, "warehouse": { "type": "string" }, "delivery_date": { "type": "string" }
          }}}
        }
      },
      "DeliveryNoteInput": {
        "type": "object",
        "properties": {
          "customer": { "type": "string" }, "posting_date": { "type": "string" },
          "items": { "type": "array", "items": { "type": "object", "properties": {
            "item_code": { "type": "string" }, "qty": { "type": "number" },
            "against_sales_order": { "type": "string" }, "warehouse": { "type": "string" }
          }}}
        }
      },
      "SalesInvoiceInput": {
        "type": "object",
        "properties": {
          "customer": { "type": "string" }, "posting_date": { "type": "string" },
          "items": { "type": "array", "items": { "type": "object", "properties": {
            "item_code": { "type": "string" }, "qty": { "type": "number" },
            "rate": { "type": "number" }, "sales_order": { "type": "string" }, "delivery_note": { "type": "string" }
          }}}
        }
      },
      "PaymentEntryInput": {
        "type": "object",
        "properties": {
          "payment_type": { "type": "string" }, "party_type": { "type": "string" },
          "party": { "type": "string" }, "paid_amount": { "type": "number" },
          "received_amount": { "type": "number" }, "paid_from": { "type": "string" },
          "paid_to": { "type": "string" }, "reference_no": { "type": "string" },
          "reference_date": { "type": "string" }
        }
      }
    }
  }
};

// OpenAPI spec
app.get("/", (req, res) => { res.json(OPENAPI_SPEC); });
app.get("/openapi.json", (req, res) => { res.json(OPENAPI_SPEC); });

// ✅ CORREÇÃO: Retorna a última Sales Order com objeto simplificado
// O problema anterior era que detailResp.data retornava o documento completo do ERPNext
// com dezenas de campos e arrays aninhados, e o BAW não conseguia deserializar
// para o tipo DocResponse (JSONObject). Agora retorna só os campos essenciais.
app.get("/erp/sales-order/last", async (req, res) => {
  try {
    const listResp = await axios.get(`${ERP_BASE}/api/resource/Sales Order`, {
      headers: { Authorization: ERP_TOKEN, "Content-Type": "application/json" },
      params: {
        fields: '["name","customer","transaction_date","delivery_date","grand_total","status"]',
        limit: 1,
        order_by: "creation desc"
      },
      timeout: 30000
    });
    const items = listResp.data?.data;
    if (!items || items.length === 0) return res.status(404).json({ error: "No Sales Orders found" });

    // Retorna objeto simplificado dentro de "data" (não array)
    res.json({ data: items[0] });
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message, details: err.response?.data || null });
  }
});

// Health check
app.get("/health", async (req, res) => {
  try {
    const r = await axios.get(`${ERP_BASE}/api/method/frappe.auth.get_logged_user`,
      { headers: { Authorization: ERP_TOKEN }, timeout: 30000 });
    res.json(r.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Proxy genérico
app.all("/erp/*", async (req, res) => {
  try {
    const erpPath = req.originalUrl.replace(/^\/erp/, "");
    const response = await axios({
      method: req.method,
      url: `${ERP_BASE}${erpPath}`,
      headers: { Authorization: ERP_TOKEN, "Content-Type": "application/json" },
      params: req.query,
      data: req.body,
      timeout: 30000,
      validateStatus: () => true
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`ERP proxy rodando na porta ${PORT}`));
