const crypto = require("crypto");

/**
 * Calculate HMAC
 *
 * @param secret Merchant shared secret
 * @param params Headers or query string parameters
 * @param body Request body or empty string for GET requests
 */
const calculateHmac = (secret: string, params: any, body: object | string) => {
   const hmacPayload = Object.keys(params)
      .sort()
      .map((key) => [key, params[key]].join(":"))
      .concat(body ? JSON.stringify(body) : "")
      .join("\n");

   return crypto.createHmac("sha256", secret).update(hmacPayload).digest("hex");
};

export default calculateHmac;
