var appRouter = function(app) {

    app.get("/", function(req, res) {
        res.send("Hello World");
    });

    app.post("/account", function(req, res) {

        return res.send(req.body);
    });
    //
    // app.get("/getAllBooks", function (req, res) {
    //     dbo.
    // });

    // app.post("/addNewBook", function (req, res) {
    //
    // });
    //
    // app.put("/updateExistingBook/:bookISBN", function (req, res) {
    //
    // });
    //
    // app.delete("/deleteBook/:bookISBN", function (req, res) {
    //
    // });
    //
    // app.get("/bookSearch/:ISBN Number", function (req, res) {
    //
    // });
    //
    // app.get("bookSearchByText/:searchText", function (req, res) {
    //
    // });
    //

};

module.exports = appRouter;