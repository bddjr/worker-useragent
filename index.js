export default {
  /**
   * @param {Request} request
   * @returns {Promise<Response>}
   */
  async fetch(request) {
    const url = new URL(request.url);

    switch (url.pathname) {
      case "/":
      case "/ua":
      case "/UA":
      case "/useragent":
      case "/UserAgent":
      case "/user-agent":
      case "/User-Agent":
        break;
      default:
        return new Response('404 Not Found', { status: 404 });
    }

    const ua = request.headers.get('user-agent') || '';

    // Accept 包含 text/html -> 返回 HTML
    if (request.headers.get('accept')?.includes('text/html')) {
      const body =
        `<meta name=viewport content=initial-scale=1>` +
        `<meta content="light dark"name=color-scheme>` +
        `<link rel=icon href=data:,>` +
        `<title>User-Agent</title>` +
        `<div style=white-space:pre-wrap>${escapeHtml(ua)}`;

      return new Response(body, {
        headers: {
          'Content-Type': 'text/html; charset=UTF-8',
          'Vary': 'Accept, User-Agent',
        },
      });
    }

    // 否则返回纯文本
    return new Response(ua, {
      headers: {
        'Content-Type': 'text/plain; charset=UTF-8',
        'Vary': 'Accept, User-Agent',
      },
    });
  },
};

/**
 * 转义 HTML 特殊字符，防止 User-Agent 中携带的尖括号等造成注入
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      default: return c;
    }
  });
}