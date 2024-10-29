// src/index.ts
export interface Env {
	// If you have environment variables, define them here
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

		if (url.hostname === 'pubkey-domain-1.mylo.dev') {
			url.hostname = 'multi-domain-1.framer.ai';
			url.pathname = '/bar/home';
		} else if (url.hostname === 'pubkey-domain-2.mylo.dev') {
			url.hostname = 'multi-domain-1.framer.ai';
			url.pathname = '/corporate/home';
		}

		// preserve original headers but update host
		const headers = new Headers(request.headers);
		headers.set('host', url.hostname);

		const modifiedRequest = new Request(url.toString(), {
			...request,
			headers,
		});

		return fetch(modifiedRequest).catch((err) => {
			console.error('DEBUG proxy error:', err);
			return new Response('Proxy Error', { status: 500 });
		});
	},
};
