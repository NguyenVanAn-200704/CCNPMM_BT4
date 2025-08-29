const svc = require("../services/userService");

module.exports.register = async (req, res) => {
  try {
    const result = await svc.register(req.body);
    if (!result.ok) return res.status(400).json({ error: result.error });
    res.json(result.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

module.exports.login = async (req, res) => {
  try {
    const result = await svc.login(req.body);
    if (!result.ok) return res.status(400).json({ error: result.error });
    res.json(result.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

module.exports.homepage = async (req, res) => {
  try {
    const result = await svc.homepage(req.user.sub);
    res.json(result.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

module.exports.forgotPassword = async (req, res) => {
  try {
    const result = await svc.forgotPassword(req.body.email);
    if (!result.ok) return res.status(400).json({ error: result.error });
    res.json(result.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

module.exports.resetPassword = async (req, res) => {
  try {
    const result = await svc.resetPassword(req.body);
    if (!result.ok) return res.status(400).json({ error: result.error });
    res.json(result.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
