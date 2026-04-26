import fetch from "node-fetch";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    const { name, email, message, page } = JSON.parse(event.body);

    /* ===============================
       1️⃣ SAVE TO GOOGLE SHEETS CRM
    ================================ */

    await fetch("https://script.google.com/macros/s/AKfycbwyaGCJTeoLkA4-dxBmbz3bQsJcLeqdhqkVXJaFU7UzlYnrm5MLKVblacGQMGRtwLZZvQ/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        message,
        page,
      }),
    });

    /* ===============================
       2️⃣ TELEGRAM ALERT
    ================================ */

    await fetch("https://api.telegram.org/bot8785815614:AAFgHPLPs0uMpt4uw5OH5zGMNE-SQ_q0K90/sendMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: "5189362049",
        text: `🔥 New ServioNest Lead

Name: ${name}
Email: ${email}
Message: ${message}
Page: ${page}`,
      }),
    });

    /* ===============================
       3️⃣ SEND CONFIRMATION EMAIL (RESEND)
    ================================ */

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "ServioNest <support@servionest.com>",
        to: email,
        subject: "💙 We received your message!",
        html: `
          <h2>Hi ${name},</h2>
          <p>Thanks for contacting ServioNest.</p>
          <p>We received your message and will respond shortly.</p>
          <br/>
          <strong>Your Message:</strong>
          <p>${message}</p>
          <br/>
          <p>🚀 ServioNest Team</p>
        `,
      }),
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
}
