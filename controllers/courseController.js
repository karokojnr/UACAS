const Course = require("../models/Course")
exports.getAddCourse = (req, res) => {
    res.render("add-course");
}

exports.postAddCourse = (req, res) => {
    const { courseName } = req.body;
    console.log("Required Body")
    console.log(req.body)
    let errors = [];

    if (!courseName) {
        errors.push({ msg: 'Please enter all fields' });
    }


    if (errors.length > 0) {
        res.render('add-course', {
            errors,
            courseName
        });
    } else {
        Course.findOne({ courseName: courseName }).then(existingCourse => {
            if (existingCourse) {
                errors.push({ msg: 'Course already exists' });
                res.render('add-course', {
                    errors,
                    courseName
                });
            } else {
                const newCourse = new Course({
                    //destructuring
                    courseName
                });
                newCourse
                    .save()
                    .then(course => {
                        req.flash(
                            'success_msg',
                            'Course added successfully...'
                        );
                        res.redirect('/');
                    })
                    .catch(err => console.log(err));
            }
        }).catch(err => console.log(err))
    }
}