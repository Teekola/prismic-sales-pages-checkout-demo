import { linkResolver, createClient } from "../../prismicio";
import { setPreviewData, redirectToPreviewURL } from "@prismicio/next";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
   req: NextApiRequest,
   res: NextApiResponse
) {
   const client = createClient({ req });
   await setPreviewData({ req, res });
   await redirectToPreviewURL({ req, res, client, linkResolver });
}
