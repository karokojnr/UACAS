const Certificate = require("../models/Certificate")
const Institution = require("../models/Institution")
const Course = require("../models/Course")
exports.getAddInstitution = async (req, res) => {
    const institutions = await Institution.find();
    const courses = await Course.find();
    const certificates = await Certificate.find();
    const certificatesLength = certificates.length;
    const institutionsLength = institutions.length;
    const coursesLength = courses.length;
    res.render("add-institution", {
        certificatesNumber: certificatesLength,
        institutionsNumber: institutionsLength,
        coursesNumber: coursesLength
    });
}

exports.postAddInstitution = (req, res) => {
    const { institutionName } = req.body;
    console.log("Required Body")
    console.log(req.body)
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
                        res.redirect('/');
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
    const certificatesLength = certificates.length;
    const institutionsLength = institutions.length;
    const coursesLength = courses.length;
    res.render("institutions", {
        institutions: institutions,
        institutionsLength: institutions.length,
        certificatesNumber: certificatesLength,
        institutionsNumber: institutionsLength,
        coursesNumber: coursesLength
    })
}
exports.getEditInstitution = async (req, res, next) => {
    const institutions = await Institution.find();
    const courses = await Course.find();
    const certificates = await Certificate.find();
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
            institutions: institutions,
            institutionsLength: institutions.length,
            certificatesNumber: certificatesLength,
            institutionsNumber: institutionsLength,
            coursesNumber: coursesLength
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