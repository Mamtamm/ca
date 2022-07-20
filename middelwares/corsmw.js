exports.corsmw = (req, res, next) => {
  res.set(
    "Access-Control-Allow-Origin",
    req.header.origin ? req.header.origin : "*"
  );
  res.set("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    // Send response to OPTIONS requests
    res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.set("Access-Control-Max-Age", "3600");
    res.status(204).send("");
  } else {
    next();
  }
};
