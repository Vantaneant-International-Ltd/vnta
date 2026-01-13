export const POST = async ({ request }) => {
  const formData = await request.formData();
  // handle email / logic
  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
