module.exports = (req, res) => {
        const { name = 'World' } = req.query
        console.log(req);
        res.send(`Hello ${name}!`)
}