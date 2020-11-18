const Employer = require("../models/Employer")
const Course = require("../models/Course")
const Institution = require("../models/Institution")
const Certificate = require("../models/Certificate")

exports.getEmployers = async (req, res) => {
    const institutions = await Institution.find();
    const courses = await Course.find();
    const certificates = await Certificate.find();
    const employers = await Employer.find();
    const employersLength = employers.length;
    const certificatesLength = certificates.length;
    const institutionsLength = institutions.length;
    const coursesLength = courses.length;
    res.render("employers", {
        name: req.user.username,
        institutions: institutions,
        employers: employers,
        institutionsLength: institutions.length,
        certificatesNumber: certificatesLength,
        institutionsNumber: institutionsLength,
        employersNumber: employersLength,
        coursesNumber: coursesLength
    })
}

exports.activateEmployer = (req, res) => {
    const employerId = req.params.id;
    Employer.findById(employerId)
        .then((employer) => {
            if (employer.isEmployer === "YES") {
                req.flash("error_msg", "The Employer is already activated.");
                res.redirect("/employers");
            }
            employer.isEmployer = "YES";
            employer.save().then((updatedEmployer) => {
                req.flash("success_msg", "Success! Employer activated.");
                res.redirect("/employers");
            });
        })
        .catch((e) => {
            console.log(e.message);
        });
};
exports.deactivateEmployer = (req, res) => {
    const employerId = req.params.id;
    Employer.findById(employerId)
        .then((employer) => {
            if (employer.isEmployer === "NO") {
                req.flash("error_msg", "The Employer is already deactivated.");
                res.redirect("/employers");
            }
            employer.isEmployer = "NO";

            employer.save().then((updatedEmployer) => {
                req.flash("success_msg", "Success! Employer deactivated.");
                res.redirect("/employers");
            });
        })
        .catch((e) => {
            console.log(e.message);
        });
};