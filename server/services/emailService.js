import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Configuración del transporter para Ethereal (Testing)
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Templates HTML mejorados
const templates = {
    verification: (name, link) => `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            .container { font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; color: #333; }
            .header { background-color: #f8f9fa; padding: 20px; text-align: center; border-bottom: 3px solid #007bff; }
            .content { padding: 30px 20px; background-color: #ffffff; }
            .button { background-color: #007bff; color: white !important; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin: 20px 0; }
            .footer { font-size: 12px; color: #666; text-align: center; padding: 20px; border-top: 1px solid #eee; }
            a { color: #007bff; text-decoration: none; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Verifica tu cuenta</h1>
            </div>
            <div class="content">
                <h2>¡Hola ${name}!</h2>
                <p>Gracias por registrarte en Tienda L&V. Para comenzar, por favor confirma tu dirección de correo electrónico.</p>
                <div style="text-align: center;">
                    <a href="${link}" class="button">Verificar mi Email</a>
                </div>
                <p>Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:</p>
                <p><a href="${link}">${link}</a></p>
                <p>⚠️ Este enlace expirará en 24 horas.</p>
            </div>
            <div class="footer">
                <p>Si no creaste esta cuenta, puedes ignorar este mensaje.</p>
                <p>&copy; ${new Date().getFullYear()} Tienda L&V. Todos los derechos reservados.</p>
            </div>
        </div>
    </body>
    </html>
    `,

    resetPassword: (name, link) => `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            .container { font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; color: #333; }
            .header { background-color: #f8f9fa; padding: 20px; text-align: center; border-bottom: 3px solid #dc3545; }
            .content { padding: 30px 20px; background-color: #ffffff; }
            .button { background-color: #dc3545; color: white !important; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin: 20px 0; }
            .footer { font-size: 12px; color: #666; text-align: center; padding: 20px; border-top: 1px solid #eee; }
            a { color: #dc3545; text-decoration: none; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Recuperación de Contraseña</h1>
            </div>
            <div class="content">
                <h2>Hola ${name},</h2>
                <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>
                <div style="text-align: center;">
                    <a href="${link}" class="button">Restablecer Contraseña</a>
                </div>
                <p>Si el botón no funciona, usa este enlace:</p>
                <p><a href="${link}">${link}</a></p>
                <p>⚠️ Este enlace es válido por 1 hora.</p>
                <p>Si no solicitaste este cambio, por favor ignora este correo. Tu cuenta sigue segura.</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Tienda L&V. Todos los derechos reservados.</p>
            </div>
        </div>
    </body>
    </html>
    `,

    passwordChanged: (name) => `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            .container { font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; color: #333; }
            .header { background-color: #f8f9fa; padding: 20px; text-align: center; border-bottom: 3px solid #28a745; }
            .content { padding: 30px 20px; background-color: #ffffff; }
            .footer { font-size: 12px; color: #666; text-align: center; padding: 20px; border-top: 1px solid #eee; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Contraseña Actualizada</h1>
            </div>
            <div class="content">
                <h2>Hola ${name},</h2>
                <p>✅ Tu contraseña ha sido actualizada exitosamente.</p>
                <p>Fecha: ${new Date().toLocaleString()}</p>
                <p>Si no fuiste tú quien realizó este cambio, por favor contacta a soporte inmediatamente.</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Tienda L&V. Todos los derechos reservados.</p>
            </div>
        </div>
    </body>
    </html>
    `
};

const sendEmail = async (mailOptions) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
            console.warn("⚠️  Credenciales de email faltantes en .env. Saltando envío real.");
            return false;
        }
        const info = await transporter.sendMail(mailOptions);

        // Log para Ethereal URL
        console.log("📨 Email enviado: %s", info.messageId);
        console.log("👀 Preview URL: %s", nodemailer.getTestMessageUrl(info));

        return true;
    } catch (error) {
        console.error("❌ Error enviando email:", error.message);
        return false;
    }
};

export const sendVerificationEmail = async (user, token) => {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const link = `${clientUrl}/auth/verify-email?token=${token}`;

    console.log("==========================================");
    console.log("📨  EMAIL DE VERIFICACIÓN (DEBUG)");
    console.log(`Para: ${user.email}`);
    console.log(`🔗 Link: ${link}`);
    console.log("==========================================");

    const mailOptions = {
        from: `Tienda L&V <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Verifica tu cuenta en Tienda L&V',
        html: templates.verification(user.name, link)
    };

    return await sendEmail(mailOptions);
};

export const sendPasswordResetEmail = async (user, token) => {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const link = `${clientUrl}/auth/reset-password?token=${token}`;

    console.log("==========================================");
    console.log("📨  EMAIL DE RECUPERACIÓN (DEBUG)");
    console.log(`Para: ${user.email}`);
    console.log(`🔗 Link: ${link}`);
    console.log("==========================================");

    const mailOptions = {
        from: `Tienda L&V <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Recupera tu contraseña - Tienda L&V',
        html: templates.resetPassword(user.name, link)
    };

    return await sendEmail(mailOptions);
};

export const sendPasswordChangedEmail = async (user) => {
    const mailOptions = {
        from: `Tienda L&V <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Tu contraseña ha sido actualizada',
        html: templates.passwordChanged(user.name)
    };

    return await sendEmail(mailOptions);
};
