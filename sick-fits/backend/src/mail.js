const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: 'a4bc30e6ca1f65',
    pass: 'fe0b079cb6d9e5',
  },
});

exports.sendPasswordResetEmail = (email, resetToken) => {
  const resetLink = `${
    process.env.FRONTEND_URL
  }/reset?resetToken=${resetToken}`;

  return transport.sendMail({
    from: 'noreply@sick-fits.test',
    to: email,
    subject: 'Your Password Reset',
    html: `
      <div class="email" style="
        border: 1px solid grey;
        padding: 30px;
        font-size: 20px;
      ">
        <h2>Hello There!</h2>
        <p>You or somebody has requested to reset your password!</p>
        <p>If it was you then click <a href="${resetLink}">here</a>. Otherwise just ignore this letter!</p>
      </div>
    `,
  });
};
