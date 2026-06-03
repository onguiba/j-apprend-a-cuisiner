const { getPool } = require('../../lib/db');
const { handleCors } = require('../../lib/cors');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
  }

  const pool = getPool();

  try {
    const { email } = req.body;

    const result = await pool.query('SELECT id, nom, email FROM users WHERE email = $1', [email]);

    // Pour la sécurité, on répond toujours la même chose
    if (result.rows.length === 0) {
      return res.json({ success: true, message: 'Si cet email existe, un lien de réinitialisation a été envoyé' });
    }

    const user = result.rows[0];
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 heure

    // Supprimer anciens tokens
    await pool.query('DELETE FROM password_reset_tokens WHERE user_id = $1 AND used = FALSE', [user.id]);

    // Sauvegarder nouveau token
    await pool.query(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, hashedToken, expiresAt]
    );

    // Envoyer l'email si configuré
    if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: parseInt(process.env.EMAIL_PORT) || 587,
          secure: false,
          auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD }
        });

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

        await transporter.sendMail({
          from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
          to: user.email,
          subject: "Réinitialisation de votre mot de passe",
          html: `
            <h2>Bonjour ${user.nom},</h2>
            <p>Vous avez demandé une réinitialisation de mot de passe.</p>
            <p><a href="${resetUrl}" style="background:#e67e22;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Réinitialiser mon mot de passe</a></p>
            <p>Ce lien expire dans 1 heure.</p>
            <p>Si vous n'avez pas fait cette demande, ignorez cet email.</p>
          `
        });
      } catch (emailError) {
        console.error('Erreur email:', emailError);
        // Ne pas bloquer la réponse
      }
    }

    return res.json({ success: true, message: 'Si cet email existe, un lien de réinitialisation a été envoyé' });
  } catch (error) {
    console.error('Erreur forgot-password:', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};
