const Institution = require("../models/Institution")
exports.getAddInstitution = (req, res) => {
    res.render("add-institution");
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