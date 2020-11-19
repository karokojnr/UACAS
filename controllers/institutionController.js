const Certificate = require("../models/Certificate")
const Institution = require("../models/Institution")
const Course = require("../models/Course")
const Employer = require("../models/Employer")

exports.getAddInstitution = async (req, res) => {
    const institutions = await Institution.find();
    const courses = await Course.find();
    const certificates = await Certificate.find();
    const employers = await Employer.find();
    const employersLength = employers.length;
    const certificatesLength = certificates.length;
    const institutionsLength = institutions.length;
    const coursesLength = courses.length;
    res.render("add-institution", {
        editing: false,
        name: req.user.username,
        certificatesNumber: certificatesLength,
        institutionsNumber: institutionsLength,
        coursesNumber: coursesLength,
        employersNumber: employersLength
    });
}

exports.postAddInstitution = (req, res) => {
    const { institutionName } = req.body;
    let errors = [];

    if (!institutionName) {
        errors.push({ msg: 'Please enter all fields' });
    }


    if (errors.length > 0) {
        res.render('add-institution', {
            errors,
            institutionName
        });
    } else {
        Institution.findOne({ institutionName: institutionName }).then(existingInstitution => {
            if (existingInstitution) {
                errors.push({ msg: 'Institution already exists' });
                res.render('add-institution', {
                    errors,
                    institutionName
                });
            } else {
                const newInstitution = new Institution({
                    //destructuring
                    institutionName
                });
                newInstitution
                    .save()
                    .then(institution => {
                        req.flash(
                            'success_msg',
                            'Instituion added successfully...'
                        );
                        res.redirect('/institutions');
                    })
                    .catch(err => console.log(err));
            }
        }).catch(err => console.log(err))
    }
}
exports.getInstitutions = async (req, res) => {
    const institutions = await Institution.find();
    const courses = await Course.find();
    const certificates = await Certificate.find();
    const employers = await Employer.find();
    const employersLength = employers.length;
    const certificatesLength = certificates.length;
    const institutionsLength = institutions.length;
    const coursesLength = courses.length;
    res.render("institutions", {
        name: req.user.username,
        institutions: institutions,
        institutionsLength: institutions.length,
        certificatesNumber: certificatesLength,
        institutionsNumber: institutionsLength,
        coursesNumber: coursesLength,
        employersNumber: employersLength

    })
}
exports.getEditInstitution = async (req, res, next) => {
    const institutions = await Institution.find();
    const courses = await Course.find();
    const certificates = await Certificate.find();
    const employers = await Employer.find();
    const employersLength = employers.length;
    const certificatesLength = certificates.length;
    const institutionsLength = institutions.length;
    const coursesLength = courses.length;
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect("/");
    }
    const institutionId = req.params.institutionId;
    Institution.findById(institutionId).then(institution => {
        if (!institution) {
            return res.redirect("/");
        }
        res.render("add-institution", {
            pageTitle: "Edit Institution",
            path: "add-institution",
            editing: editMode,
            institution: institution,
            hasError: false,
            errorMessage: null,
            validationErrors: [],
            name: req.user.username,
            institutions: institutions,
            institutionsLength: institutions.length,
            certificatesNumber: certificatesLength,
            institutionsNumber: institutionsLength,
            coursesNumber: coursesLength,
            employersNumber: employersLength
        })
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}
exports.postEditInstitution = (req, res, next) => {
    const { institutionId, institutionName } = req.body;
    Institution.findById(institutionId)
        .then(institution => {
            institution.institutionName = institutionName;
            return institution.save().then(result => {
                console.log("UPDATED institution!");
                res.redirect("/institutions");
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}
exports.deleteInstitution = (req, res, next) => {
    const institutionId = req.params.institutionId;
    Institution.findById(institutionId)
        .then(institution => {
            if (!institution) {
                return next(new Error("Institution not found."));
            }
            return Institution.deleteOne({ _id: institutionId });
        })
        .then(() => {
            console.log("DESTROYED INSTITUTION");
            res.redirect("/institutions");
        })
        .catch(err => {
            res.status(500).json({ message: "Deleting institution failed." });
        });
};
exports.activateInstitution = (req, res) => {
    const institutionId = req.params.id;
    Institution.findById(institutionId)
        .then((institution) => {
            if (institution.isInstitution === "YES") {
                req.flash("error_msg", "The Institution is already activated.");
                res.redirect("/institutions");
            }
            institution.isInstitution = "YES";
            institution.save().then((updatedInstitution) => {
                req.flash("success_msg", "Success! Institution activated.");
                res.redirect("/institutions");
            });
        })
        .catch((e) => {
            console.log(e.message);
        });
};
exports.deactivateInstitution = (req, res) => {
    const institutionId = req.params.id;
    Institution.findById(institutionId)
        .then((institution) => {
            if (institution.isInstitution === "NO") {
                req.flash("error_msg", "The Institution is already deactivated.");
                res.redirect("/institutions");
            }
            institution.isInstitution = "NO";

            institution.save().then((updatedInstitution) => {
                req.flash("success_msg", "Success! Institution deactivated.");
                res.redirect("/institutions");
            });
        })
        .catch((e) => {
            console.log(e.message);
        });
};