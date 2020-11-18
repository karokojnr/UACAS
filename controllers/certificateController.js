const Certificate = require("../models/Certificate")
const Institution = require("../models/Institution")
const Course = require("../models/Course")

exports.getAddCertificate = async (req, res) => {
    const institutions = await Institution.find();
    const courses = await Course.find();
    const certificates = await Certificate.find();
    const certificatesLength = certificates.length;
    const institutionsLength = institutions.length;
    const coursesLength = courses.length;
    res.render("add-certificate", {
        editing: false,
        institutions: institutions, courses: courses,
        certificatesNumber: certificatesLength,
        institutionsNumber: institutionsLength,
        coursesNumber: coursesLength
    });
}
exports.postAddCertiificate = (req, res) => {

    const { certificateNumber, surname, otherNames, institution, regNumber, course } = req.body;
    console.log("Required Body")
    console.log(req.body)
    let errors = [];

    if (!certificateNumber || !surname || !institution || !otherNames || !regNumber || !course) {
        errors.push({ msg: 'Please enter all fields' });
    }


    if (errors.length > 0) {
        res.render('add-certificate', {
            editing: false,
            errors,
            certificateNumber,
            surname,
            otherNames,
            institution,
            regNumber,
            course
        });
    } else {
        Certificate.findOne({ certificateNumber: certificateNumber }).then(existingCertificate => {
            if (existingCertificate) {
                errors.push({ msg: 'Certificate already exists' });
                res.render('add-certificate', {
                    editing: false,
                    errors,
                    certificateNumber,
                    surname,
                    otherNames,
                    institution,
                    regNumber,
                    course
                });
            } else {
                const newCertificate = new Certificate({
                    //destructuring
                    certificateNumber,
                    surname,
                    otherNames,
                    institution,
                    regNumber,
                    course,
                    // date
                });
                newCertificate
                    .save()
                    .then(certificate => {
                        req.flash(
                            'success_msg',
                            'Certificate added successfully...'
                        );
                        res.redirect('/');
                    })
                    .catch(err => console.log(err));
            }
        }).catch(err => console.log(err))
    }
}
exports.getCertificates = async (req, res) => {
    const institutions = await Institution.find();
    const courses = await Course.find();
    const certificates = await Certificate.find();
    const certificatesLength = certificates.length;
    const institutionsLength = institutions.length;
    const coursesLength = courses.length;

    Certificate.find({}).populate("institution").populate("course").then(certificates => {
        res.render("certificates", {
            certificates: certificates,
            certificatesLength: certificates.length,
            certificatesNumber: certificatesLength,
            institutionsNumber: institutionsLength,
            coursesNumber: coursesLength
        })

    }).catch(err => {
        console.log(err);
    });
}
exports.getEditCertificate = async (req, res, next) => {
    const allCertificates = await Certificate.find();
    const institutions = await Institution.find();
    const courses = await Course.find();
    const certificatesLength = allCertificates.length;
    const institutionsLength = institutions.length;
    const coursesLength = courses.length;
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect("/");
    }
    const certificateId = req.params.certificateId;
    Certificate.findById(certificateId)
        .then(certificate => {
            if (!certificate) {
                return res.redirect("/");
            }
            res.render("add-certificate", {
                pageTitle: "Edit Certificate",
                path: "add-certificate",
                editing: editMode,
                certificate: certificate,
                hasError: false,
                errorMessage: null,
                validationErrors: [],
                certificatesNumber: certificatesLength,
                institutionsNumber: institutionsLength,
                coursesNumber: coursesLength,
                institutions: institutions,
                courses: courses,


            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};
exports.postEditCertificate = (req, res, next) => {
    const { certificateId, certificateNumber, surname, otherNames, institution, regNumber, course } = req.body;

    Certificate.findById(certificateId)
        .then(certificate => {
            certificate.certificateNumber = certificateNumber;
            certificate.surname = surname;
            certificate.otherNames = otherNames;
            certificate.institution = institution;
            certificate.regNumber = regNumber;
            certificate.course = course;

            return certificate.save().then(result => {
                console.log("UPDATED certificate!");
                res.redirect("/certificates");
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}
exports.deleteCertificate = (req, res, next) => {
    const certificateId = req.params.certificateId;
    Certificate.findById(certificateId)
        .then(certificate => {
            if (!certificate) {
                return next(new Error("Certificate not found."));
            }
            return Certificate.deleteOne({ _id: certificateId });
        })
        .then(() => {
            console.log("DESTROYED CERTIFICATE");
            res.redirect("/certificates");
        })
        .catch(err => {
            res.status(500).json({ message: "Deleting certificate failed." });
        });
};
