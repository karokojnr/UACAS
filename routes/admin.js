const express = require("express");
const app = express();

const homeController = require("../controllers/homeController");
const certificateController = require("../controllers/certificateController")
const institutionController = require("../controllers/institutionController")
const adminController = require("../controllers/adminController")
const courseController = require("../controllers/courseController")
const employerController = require("../controllers/employerController")
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");


app.get("/", ensureAuthenticated, homeController.getHome);
app.get("/add-certificate", ensureAuthenticated, certificateController.getAddCertificate)
app.get("/add-institution", ensureAuthenticated, institutionController.getAddInstitution)
app.get("/add-course", ensureAuthenticated, courseController.getAddCourse)
app.get("/get-login", forwardAuthenticated, adminController.getLogin)
app.get("/get-register", forwardAuthenticated, adminController.getRegister)
app.get("/logout", adminController.getLogout);
app.get("/certificates", ensureAuthenticated, certificateController.getCertificates)
app.get("/courses", ensureAuthenticated, courseController.getCourses)
app.get("/institutions", ensureAuthenticated, institutionController.getInstitutions)
app.get("/employers", ensureAuthenticated, employerController.getEmployers)
app.get("/get-edit-certificate/:certificateId", ensureAuthenticated, certificateController.getEditCertificate);
app.get("/get-edit-course/:courseId", ensureAuthenticated, courseController.getEditCourse);
app.get("/get-edit-institution/:institutionId", ensureAuthenticated, institutionController.getEditInstitution);
app.post("/post-add-certificate", ensureAuthenticated, certificateController.postAddCertiificate)
app.post("/post-add-institution", ensureAuthenticated, institutionController.postAddInstitution)
app.post("/post-add-course", ensureAuthenticated, courseController.postAddCourse)
app.post("/post-edit-certificate", ensureAuthenticated, certificateController.postEditCertificate);
app.post("/post-edit-course", ensureAuthenticated, courseController.postEditCourse);
app.post("/post-edit-institution", ensureAuthenticated, institutionController.postEditInstitution);
app.post("/login", adminController.postLogin)
app.post("/register", adminController.registerAdmin)
app.delete("/delete-certificate/:certificateId", ensureAuthenticated, certificateController.deleteCertificate);
app.delete("/delete-institution/:institutionId", ensureAuthenticated, institutionController.deleteInstitution);
app.delete("/delete-course/:courseId", ensureAuthenticated, courseController.deleteCourse);
app.put("/activate-institution/:id", ensureAuthenticated, institutionController.activateInstitution);
app.put("/deactivate-institution/:id", ensureAuthenticated, institutionController.deactivateInstitution);
app.put("/activate-employer/:id", ensureAuthenticated, employerController.activateEmployer);
app.put("/deactivate-employer/:id", ensureAuthenticated, employerController.deactivateEmployer);
module.exports = app;
