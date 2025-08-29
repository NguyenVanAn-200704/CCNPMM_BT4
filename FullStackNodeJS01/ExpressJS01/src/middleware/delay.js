module.exports =
  (ms = 300) =>
  (req, res, next) =>
    setTimeout(next, ms);
