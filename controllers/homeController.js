const Certificate = require("../models/Certificate")
const Institution = require("../models/Institution")
const Course = require("../models/Course")


exports.getHome = async (req, res) => {
    const allCertificates = await Certificate.find();
    const allInstitutions = await Institution.find();
    const allCourses = await Course.find();
    const certificatesLength = allCertificates.length;
    const institutionsLength = allInstitutions.length;
    const coursesLength = allCourses.length;
    const name = req.user.username;
    res.render("dashboard", {
        // //user accessed after login
        name: req.user.username,
        // : ,
        // pageTitle: "",
        certificatesNumber: certificatesLength,
        institutionsNumber: institutionsLength,
        coursesNumber: coursesLength
    });
}