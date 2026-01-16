import type { APIRoute } from 'astro';

// export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { name, email, message } = body;

        const BREVO_API_KEY = import.meta.env.BREVO_API_KEY;
        const RECIPIENT_EMAIL = import.meta.env.CONTACT_RECIPIENT_EMAIL || 'admin@example.com';

        if (!BREVO_API_KEY) {
            return new Response(JSON.stringify({ error: 'Mail server configuration missing' }), { status: 500 });
        }

        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: { name: 'App Jupter Contact', email: 'no-reply@appjupter.web' },
                to: [{ email: RECIPIENT_EMAIL, name: 'Admin' }],
                replyTo: { email: email, name: name },
                subject: `[Contacto Web] Nuevo mensaje de ${name}`,
                htmlContent: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #2563eb;">Nuevo mensaje de contacto</h2>
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Mensaje:</strong></p>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 4px; border-left: 4px solid #3b82f6;">
              ${message.replace(/\n/g, '<br/>')}
            </div>
            <hr style="margin-top: 20px; border: 0; border-top: 1px solid #e2e8f0;" />
            <p style="font-size: 12px; color: #64748b;">Enviado desde el formulario de contacto de APP_Jupter.</p>
          </div>
        `
            })
        });

        if (response.ok) {
            return new Response(JSON.stringify({ success: true }), { status: 200 });
        } else {
            const errorData = await response.json();
            console.error('Brevo API Error:', errorData);
            return new Response(JSON.stringify({ error: 'Error al enviar el email' }), { status: 500 });
        }
    } catch (error) {
        console.error('Contact API Error:', error);
        return new Response(JSON.stringify({ error: 'Error interno del servidor' }), { status: 500 });
    }
};
