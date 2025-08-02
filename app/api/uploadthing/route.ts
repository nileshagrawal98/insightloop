import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core"; // now local to API route

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
