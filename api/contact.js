export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'noreply@vnta.xyz',
        to: 'studio@vnta.xyz',
        subject: `New Enquiry: ${role} - ${name}`,
        html: `<p><strong>${name}</strong></p><p>Email: ${email}</p><p>Role: ${role}</p>`
      })
    });

    if (!response.ok) {
      throw new Error('Resend API error');
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email' });
  }
}
