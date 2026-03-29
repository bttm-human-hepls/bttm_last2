module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'B.T.T.M Backend'
    });
};