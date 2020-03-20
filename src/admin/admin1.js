module.exports = app => {
    //Router setup:
    app.get('/my-params1/:action/:id', (req, res) => {
        res.json(req.params);
    });
    app.get(/^\/mobile\/09\d{2}-?\d{3}-?\d{3}$/, (req, res) => {
        let m = req.url.slice(8);
        m = m.split('?')[0];
        m = m.split('-').join();
        res.json({ url: m });
    });
    app.get('/dick/*/*?', (req, res) => {
        res.json(req.params);
    });
}

