const express = require("express");
const app = express();

const homeController = require("../controllers/homeController");
const certificateController = require("../controllers/certificateController")
const institutionController = require("../controllers/institutionController")
const adminController = require("../controllers/adminController")
const courseController = require("../controllers/courseController")
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");


app.get("/", ensureAuthenticated, homeController.getHome);
app.get("/add-certificate", ensureAuthenticated, certificateController.getAddCertificate)
app.get("/add-institution", ensureAuthenticated, institutionController.getAddInstitution)
app.get("/add-course", ensureAuthenticated, courseController.getAddCourse)
app.get("/get-login", forwardAuthenticated, adminController.getLogin)
app.get("/get-register", forwardAuthenticated, adminController.getRegister)
app.get("/logout", adminController.getLogout);
app.post("/post-add-certificate", ensureAuthenticated, certificateController.postAddCertiificate)
app.post("/post-add-institution", ensureAuthenticated, institutionController.postAddInstitution)
app.post("/post-add-course", ensureAuthenticated, courseController.postAddCourse)

app.post("/login", adminController.postLogin)
app.post("/register", adminController.registerAdmin)
module.exports = app;
