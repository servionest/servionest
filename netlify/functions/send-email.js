const { Resend } = require('resend');

exports.handler = async (event) => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { name, email, message } = JSON.parse(event.body);

    // 1️⃣ Send notification to admin
    await resend.emails.send({
      from: 'ServioNest <support@servionest.com>',
      to: 'support@servionest.com',
      subject: 'New ServioNest Contact Message',
      html: `
        <strong>Name:</strong> ${name}<br>
        <strong>Email:</strong> ${email}<br>
        <strong>Message:</strong><br>${message}
      `,
    });

    // 2️⃣ Send auto-reply to user
    await resend.emails.send({
      from: 'ServioNest <support@servionest.com>',
      to: email,
      subject: 'We received your message 🚀',
      html: `
        <h2>Hi ${name},</h2>
        <p>Thank you for contacting ServioNest.</p>
        <p>We’ve received your message and will get back to you shortly.</p>
        <br>
        <p>— ServioNest Team</p>
      `,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
