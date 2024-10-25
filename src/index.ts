// src/index.ts
export interface Env {
	// If you have environment variables, define them here
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

		if (url.hostname === 'nextblock1.mylo.dev') {
			url.hostname = 'joinnextblock.com';
			url.pathname = '/advetisers';
		} else if (url.hostname === 'nextblock2.mylo.dev') {
			url.hostname = 'joinnextblock.com';
			url.pathname = '/developers';
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
