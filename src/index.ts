// src/index.ts
export interface Env {
	// If you have environment variables, define them here
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		const originalHost = url.hostname;
		let targetPath = '';

		if (url.hostname === 'pubkey-domain-1.mylo.dev') {
			url.hostname = 'multi-domain-1.framer.ai';
			targetPath = '/bar/nyc/home';
		} else if (url.hostname === 'pubkey-domain-2.mylo.dev') {
			url.hostname = 'multi-domain-1.framer.ai';
			targetPath = '/corporate/home';
		} else if (url.hostname === 'multi-domain-1.framer.ai') {
			// block direct access to main domain
			return new Response('Not Found', { status: 404 });
		}

		const canonicalUrl = new URL(request.url);
		canonicalUrl.pathname = targetPath;
		url.pathname = targetPath;

		const headers = new Headers(request.headers);
		headers.set('host', url.hostname);
		headers.set('Link', `<${canonicalUrl.toString()}>; rel="canonical"`);
		headers.set('Referrer-Policy', 'no-referrer');
		headers.delete('X-Robots-Tag');
		headers.delete('robots');

		const modifiedRequest = new Request(url.toString(), {
			...request,
			headers,
		});

		const response = await fetch(modifiedRequest).catch((err) => {
			console.error('DEBUG proxy error:', err);
			return new Response('Proxy Error', { status: 500 });
		});

		const newHeaders = new Headers(response.headers);
		newHeaders.set('X-Frame-Options', 'SAMEORIGIN');
		newHeaders.set(
			'Content-Security-Policy',
			`
			default-src * 'unsafe-inline' 'unsafe-eval';
			frame-ancestors 'self';
			referrer no-referrer;
			block-all-mixed-content;
		`
				.replace(/\s+/g, ' ')
				.trim()
		);
		newHeaders.set('Referrer-Policy', 'no-referrer');
		newHeaders.delete('X-Robots-Tag');
		newHeaders.delete('robots');
		// prevent any origin exposure
		newHeaders.delete('Server');
		newHeaders.delete('X-Powered-By');
		newHeaders.delete('Via');

		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: newHeaders,
		});
	},
};
