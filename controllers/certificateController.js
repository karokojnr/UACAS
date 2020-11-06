const Certificate = require("../models/Certificate")
const Institution = require("../models/Institution")
const Course = require("../models/Course")

exports.getAddCertificate = (req, res) => {
    Institution.find({}).then(institutions => {
        Course.find({}).then(courses => {
            res.render("add-certificate", { institutions: institutions, courses: courses })
        })
    }).catch(err => console.log(err));
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