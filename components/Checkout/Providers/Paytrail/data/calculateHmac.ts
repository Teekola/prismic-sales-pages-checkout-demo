const crypto = require("crypto");
/**
 * Calculate HMAC
 *
 * @param {string} secret Merchant shared secret
 * @param {object} params Headers or query string parameters
 * @param {object|undefined} body Request body or empty string for GET requests
 */
type Params = Partial<{
   [key: string]: string | string[];
}>;
const calculateHmac = (secret: string, params: Params, body?: object | undefined) => {
   const hmacPayload = Object.keys(params)
      .sort()
      .map((key) => [key, params[key]].join(":"))
      .concat(body ? JSON.stringify(body) : "")
      .join("\n");

   return crypto.createHmac("sha256", secret).update(hmacPayload).digest("hex");
};

export default calculateHmac;
