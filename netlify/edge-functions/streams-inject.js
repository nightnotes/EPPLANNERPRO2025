
export default async (request, context) => {
  const res = await context.next();
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return res;
  const html = await res.text();
  const tag = '<script defer src="/streams-append.js"></script>';
  if (html.includes('/streams-append.js')) {
    return new Response(html, res);
  }
  let out = html;
  if (html.includes("</head>")) {
    out = html.replace("</head>", tag + "\n</head>");
  } else if (html.includes("</body>")) {
    out = html.replace("</body>", tag + "\n</body>");
  } else {
    out = html + tag;
  }
  return new Response(out, {
    status: res.status,
    headers: res.headers
  });
};
