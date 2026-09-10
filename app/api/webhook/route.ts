export async function POST(request: Request) {
	await request.text()

	return Response.json({ received: true })
}
