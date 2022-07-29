import jwt from "jsonwebtoken";

const PUBLIC_KEY_BASE64 =
   process.env.SMARTUM_PUBLIC_KEY ||
   "LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlHYk1CQUdCeXFHU000OUFnRUdCU3VCQkFBakE0R0dBQVFBZThyR0g5NkVxdnFjSWcrRFEvOXE4Yk0rZkgxawovMzFQdzFrQ0VTeGRPUTBqeSt6SXBnWjNTTjNVOUk3YUJLdWdaZTFjZWp5Z0pCcEZOdk9SUHphSXpCRUFhSjM2Cjdmbk5aRzJjaGFiZEpFc1VXNXFjcmZmQ1FObGZjWVh2TWVaUGJwczNQM29md1krUWQyK2twYklVaStZNDhuK3gKZTlwRVZTNWRrSCsybGsxRFVRYz0KLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0t";
const PUBLIC_KEY = Buffer.from(PUBLIC_KEY_BASE64, "base64").toString("utf-8");

export default function calculateSmartumResponseJwt(responseJwt: string) {
   const decrypted = jwt.verify(responseJwt, PUBLIC_KEY, { algorithms: ["ES512"], complete: true });
   return decrypted;
}
