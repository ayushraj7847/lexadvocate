const sendEmail = async ({ to, subject, text, html }) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[EMAIL MOCK] To: ${to} | Subject: ${subject}`);
    return { success: true };
  }
  return { success: true };
};

module.exports = { sendEmail };
