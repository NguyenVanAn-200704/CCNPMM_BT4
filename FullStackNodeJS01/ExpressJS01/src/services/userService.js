const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");

async function register({ name, email, password }) {
  const existed = await User.findOne({ where: { email } });
  if (existed) return { ok: false, error: "Email đã tồn tại" };

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });
  return { ok: true, data: { id: user.id, name: user.name, email: user.email } };
}

async function login({ email, password }) {
  const user = await User.findOne({ where: { email } });
  if (!user) return { ok: false, error: "Sai email hoặc mật khẩu" };

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return { ok: false, error: "Sai email hoặc mật khẩu" };

  const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return { ok: true, data: { token } };
}

async function homepage(userId) {
  const user = await User.findByPk(userId);
  return { ok: true, data: { message: `Xin chào ${user?.name || "bạn"}`, email: user?.email } };
}

// Yêu cầu bài tập: ForgotPassword (slide 36). Ta tạo token lưu DB, trả link reset (môi trường dev).
async function forgotPassword(email) {
  const user = await User.findOne({ where: { email } });
  // Không tiết lộ tài khoản có tồn tại hay không (best practice)
  if (!user) return { ok: true, data: { message: "Nếu email tồn tại, liên kết reset đã được tạo." } };

  const token = crypto.randomBytes(20).toString("hex");
  const exp = new Date(Date.now() + 15 * 60 * 1000); // 15 phút
  await user.update({ resetToken: token, resetTokenExp: exp });

  const resetLink = `${
    process.env.FRONTEND_URL || "http://localhost:5173"
  }/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
  return { ok: true, data: { resetLink } };
}

async function resetPassword({ email, token, newPassword }) {
  const user = await User.findOne({ where: { email, resetToken: token } });
  if (!user || !user.resetTokenExp || user.resetTokenExp < new Date())
    return { ok: false, error: "Token không hợp lệ hoặc đã hết hạn" };

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await user.update({ passwordHash, resetToken: null, resetTokenExp: null });
  return { ok: true, data: { message: "Đổi mật khẩu thành công" } };
}

module.exports = { register, login, homepage, forgotPassword, resetPassword };
