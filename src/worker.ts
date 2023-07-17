/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	//
	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
	// MY_QUEUE: Queue;
}

import { Router, status } from 'itty-router'

// Create a new router
const router = Router()

/*
Index route, [] With all Routes.
*/
router.get("/", () => {

	const routes = [];

	routes.push("/");
	routes.push("wsdl");
	routes.push("getAllSpaseObservatories");

	return new Response(JSON.stringify({ Routes: routes, statusCode: status, statusMessage: "OK" }));
})

router.get("/wsdl", async () => {

	const url = "https://sscweb.gsfc.nasa.gov/WS/ssc/2/SatelliteSituationCenterService?wsdl"

	const response = await fetch(url)

	const content = await response.text()

	return new Response(content, { status: response.status, headers: response.headers });
})

router.get("/getAllSpaseObservatories", async () => {

	try {

		const url = "https://sscweb.gsfc.nasa.gov/WS/ssc/2/SatelliteSituationCenterService?wsdl"
		const xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ssc="http://ssc.spdf.gsfc.nasa.gov/"><soapenv:Header/><soapenv:Body><ssc:getAllSpaseObservatories/></soapenv:Body></soapenv:Envelope>';
		const headers = new Headers();
		headers.append('Content-Type', 'text/xml; charset=utf-8');

		const response = await fetch(url, {
			body: xml,
			method: 'POST',
			headers: headers,
		});

		return new Response(await response.text(), { status: response.status, headers: response.headers, statusText: response.statusText });

	} catch (error) {
		TextDecoder
		return new Response(
			JSON.stringify({ message: error }),
			{
				status: 400
			});
	}


});
/*
This is the last route we define, it will match anything that hasn't hit a route we've defined
above, therefore it's useful as a 404 (and avoids us hitting worker exceptions, so make sure to include it!).

Visit any page that doesn't exist (e.g. /foobar) to see it in action.
*/
router.all("*", () => new Response("404 NOT FOUND ¯\_(ツ)_/¯", { status: 404 }))


export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {

		return router.handle(request)
	},


};


