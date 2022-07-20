const routes = require("express").Router();

//auth
routes.post(`/auth/login`, require("./routes/auth/auth_login"));
routes.put(`/auth/password`, require("./routes/auth/auth_create_password"));
routes.put(`/auth/resetpassword`, require("./routes/auth/auth_reset_password"));

//user
routes.post(`/user/register`, require("./routes/user/user_create"));
routes.get(`/user/profile`, require("./routes/user/user_profile"));
routes.get(`/user/:id(\\d+)/`, require("./routes/user/user_get_by_id"));
routes.get(`/user`, require("./routes/user/user_get_all"));
// routes.post(`/user/edit`, require("./routes/user/create_user"));

module.exports = routes;
