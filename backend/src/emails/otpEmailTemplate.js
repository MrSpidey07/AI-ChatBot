export const otpEmailTemplate = (otp) => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Email Verification</title>
    </head>
    <body style="
      margin: 0;
      padding: 0;
      font-family: Arial, Helvetica, sans-serif;
      background-color: #f4f6f8;
    ">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table width="420" cellpadding="0" cellspacing="0" style="
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              overflow: hidden;
            ">
              <tr>
                <td style="
                  background-color: #0f172a;
                  padding: 20px;
                  text-align: center;
                  color: #ffffff;
                  font-size: 20px;
                  font-weight: bold;
                ">
                  Eliora AI
                </td>
              </tr>

              <tr>
                <td style="padding: 30px; color: #333333;">
                  <p style="font-size: 16px; margin: 0 0 16px;">
                    Hello 👋,
                  </p>

                  <p style="font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
                    Use the OTP below to verify your email address for
                    <strong>Eliora AI</strong>. This OTP is valid for 10 minutes only.
                  </p>

                  <div style="
                    text-align: center;
                    margin: 30px 0;
                  ">
                    <span style="
                      display: inline-block;
                      font-size: 28px;
                      letter-spacing: 6px;
                      font-weight: bold;
                      color: #0f172a;
                      background-color: #e5e7eb;
                      padding: 14px 24px;
                      border-radius: 6px;
                    ">
                      ${otp}
                    </span>
                  </div>

                  <p style="font-size: 13px; color: #555;">
                    If you did not request this verification, please ignore
                    this email.
                  </p>

                  <p style="
                    font-size: 13px;
                    color: #777;
                    margin-top: 24px;
                  ">
                    — Team Eliora AI
                  </p>
                </td>
              </tr>

              <tr>
                <td style="
                  background-color: #f1f5f9;
                  padding: 14px;
                  text-align: center;
                  font-size: 12px;
                  color: #666;
                ">
                  © ${new Date().getFullYear()} Eliora AI. All rights reserved.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
};
