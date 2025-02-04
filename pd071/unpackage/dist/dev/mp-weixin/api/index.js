"use strict";
const api_quality = require("./quality.js");
const api_production = require("./production.js");
const api_supplier = require("./supplier.js");
const api_admin = require("./admin.js");
const api = {
  quality: api_quality.quality,
  production: api_production.production,
  supplier: api_supplier.supplier,
  admin: api_admin.admin
};
exports.api = api;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/index.js.map
