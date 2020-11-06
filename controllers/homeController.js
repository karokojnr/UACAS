exports.getHome = (req, res) => {
    res.render("dashboard", {
        // //user accessed after login
        // name: req.user.firstname,
        // fullname: req.user.firstname + " " + "" + req.user.lastname,
        // ebooks: ebooks,
        // pageTitle: "Publisher eBooks",
        // ebooksNumber: ebooksNumber,
        // ebooksAllNumber: ebooksAllNumber,
    });
}