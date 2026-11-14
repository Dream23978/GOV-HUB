/**
 * Service pengiriman email resmi GOV-HUB menggunakan Resend API
 */
export async function sendOtpEmail({
  to,
  otpCode,
}: {
  to: string;
  otpCode: string;
}): Promise<{ success: boolean; error?: string }> {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.warn(
      "[RESEND NOTICE] RESEND_API_KEY belum disetel di .env.local. Email tidak terkirim."
    );
    return {
      success: false,
      error: "RESEND_API_KEY belum disetel di file .env.local",
    };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "GOV-HUB <onboarding@resend.dev>", // Alamat pengirim default terverifikasi Resend
        to: [to],
        subject: `Kode Verifikasi Lupa Password GOV-HUB: ${otpCode}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; rounded: 16px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #1a237e; margin: 0; font-size: 24px;">GOV-<span style="color: #2563eb;">HUB</span></h2>
              <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Satu NIK, Satu Akses Layanan Publik</p>
            </div>
            
            <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 20px; text-align: center;">
              <p style="color: #334155; font-size: 14px; margin-bottom: 12px;">Anda meminta pengaturan ulang kata sandi akun GOV-HUB. Masukkan kode verifikasi 5 digit berikut pada layar:</p>
              
              <div style="display: inline-block; letter-spacing: 8px; font-size: 32px; font-weight: bold; color: #1e40af; background: #dbeafe; padding: 12px 28px; border-radius: 10px; margin: 8px 0;">
                ${otpCode}
              </div>
              
              <p style="color: #64748b; font-size: 12px; margin-top: 12px;">Kode OTP ini berlaku selama <strong>15 menit</strong>. Jangan berikan kode ini kepada siapa pun.</p>
            </div>
            
            <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 0;">
              Jika Anda tidak meminta pengaturan ulang kata sandi ini, abaikan email ini dengan aman.
            </p>
          </div>
        `,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("[RESEND ERROR]", data);
      return {
        success: false,
        error: data.message || "Gagal mengirim email verifikasi.",
      };
    }

    console.log(`[RESEND SUCCESS] Email OTP berhasil dikirim ke: ${to}`);
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Kesalahan server";
    console.error("[RESEND EXCEPTION]", message);
    return { success: false, error: message };
  }
}
