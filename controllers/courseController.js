const Course = require("../models/Course")
const Institution = require("../models/Institution")
const Certificate = require("../models/Certificate")
const Employer = require("../models/Employer")

exports.getAddCourse = async (req, res) => {
    const institutions = await Institution.find();
    const courses = await Course.find();
    const certificates = await Certificate.find();
    const employers = await Employer.find();
    const employersLength = employers.length;
    const certificatesLength = certificates.length;
    const institutionsLength = institutions.length;
    const coursesLength = courses.length;
    res.render("add-course", {
        editing: false,
        name: req.user.username,
        certificatesNumber: certificatesLength,
        institutionsNumber: institutionsLength,
        coursesNumber: coursesLength,
        employersNumber: employersLength
    });
}

exports.postAddCourse = (req, res) => {
    const { courseName } = req.body;
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
                        res.redirect('/courses');
                    })
                    .catch(err => console.log(err));
            }
        }).catch(err => console.log(err))
    }
}
exports.getCourses = async (req, res) => {
    const institutions = await Institution.find();
    const courses = await Course.find();
    const certificates = await Certificate.find();
    const employers = await Employer.find();
    const employersLength = employers.length;
    const certificatesLength = certificates.length;
    const institutionsLength = institutions.length;
    const coursesLength = courses.length;
    res.render("courses", {
        name: req.user.username,
        courses: courses,
        coursesLength: courses.length,
        certificatesNumber: certificatesLength,
        institutionsNumber: institutionsLength,
        coursesNumber: coursesLength,
        employersNumber: employersLength
    });
}
exports.getEditCourse = async (req, res, next) => {
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
    const courseId = req.params.courseId;
    Course.findById(courseId).then(course => {
        if (!course) {
            return res.redirect("/");
        }
        res.render("add-course", {
            pageTitle: "Edit Course",
            path: "add-course",
            editing: editMode,
            course: course,
            hasError: false,
            errorMessage: null,
            validationErrors: [],
            name: req.user.username,
            certificatesNumber: certificatesLength,
            institutionsNumber: institutionsLength,
            coursesNumber: coursesLength,
            employersNumber: employersLength
        });
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}
exports.postEditCourse = (req, res, next) => {
    const { courseId, courseName } = req.body;
    Course.findById(courseId)
        .then(course => {
            course.courseName = courseName;
            return course.save().then(result => {
                console.log("UPDATED course!");
                res.redirect("/courses");
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}
exports.deleteCourse = (req, res, next) => {
    const courseId = req.params.courseId;
    Course.findById(courseId)
        .then(course => {
            if (!course) {
                return next(new Error("Course not found."));
            }
            return Course.deleteOne({ _id: courseId });
        })
        .then(() => {
            console.log("DESTROYED COURSE");
            res.redirect("/courses");
        })
        .catch(err => {
            res.status(500).json({ message: "Deleting course failed." });
        });
};
