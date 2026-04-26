const { Resend } = require('resend');

exports.handler = async (event) => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { name, email, message } = JSON.parse(event.body);

    /* ===============================
       1️⃣ SEND ADMIN NOTIFICATION
    =============================== */

    await resend.emails.send({
      from: 'ServioNest <support@servionest.com>',
      to: 'support@servionest.com',
      subject: '🚀 New ServioNest Contact Message',
      html: `
      <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
        <div style="max-width:600px; margin:auto; background:white; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
          
          <div style="background:#0f172a; padding:20px; text-align:center;">
            <h2 style="color:white; margin:0;">New ServioNest Lead 🚀</h2>
          </div>

          <div style="padding:20px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>

            <p><strong>Message:</strong></p>
            <div style="background:#f1f5f9; padding:15px; border-radius:6px;">
              ${message}
            </div>

            <br>

            <p style="font-size:12px; color:#64748b;">
              Received via ServioNest Contact Form
            </p>
          </div>

        </div>
      </div>
      `
    });

    /* ===============================
       2️⃣ SEND AUTO REPLY
    =============================== */

    await resend.emails.send({
      from: 'ServioNest <support@servionest.com>',
      to: email,
      subject: '💙 We received your message!',
      html: `
      <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
        <div style="max-width:600px; margin:auto; background:white; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

          <div style="background:#0f172a; padding:20px; text-align:center;">
            <h2 style="color:white; margin:0;">Thank You for Contacting ServioNest 💙</h2>
          </div>

          <div style="padding:20px;">
            <p>Hi ${name},</p>

            <p>We’ve received your message and our team will get back to you shortly.</p>

            <p>If your inquiry is urgent, feel free to reply directly to this email.</p>

            <div style="text-align:center; margin:30px 0;">
              <a href="https://servionest.com"
                 style="background:#22c55e; color:white; padding:12px 24px; text-decoration:none; border-radius:6px; font-weight:bold;">
                 Visit ServioNest
              </a>
            </div>

            <p style="font-size:12px; color:#64748b;">
              ServioNest — AI-Powered Growth Platform for Modern Businesses
            </p>
          </div>

        </div>
      </div>
      `
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Message sent successfully! 🚀' }),
    };

  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Something went wrong.' }),
    };
  }
};
