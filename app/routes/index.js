module.exports = (app) => {
    app.get("/", (req, res) => {
        res.status(200);
        res.render("index");
    });

    app.post("/", (req, res) => {
        res.status(201);
        res.send(req.body)
    });
}