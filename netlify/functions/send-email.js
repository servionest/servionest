const { Resend } = require('resend');

exports.handler = async (event) => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { to, subject, message } = JSON.parse(event.body);

    const data = await resend.emails.send({
      from: 'ServioNest <support@servionest.com>',
      to: to,
      subject: subject,
      html: `<p>${message}</p>`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
