const sql = require('mssql');

module.exports = async function (context, req) {
    const keyword = req.query.keyword || (req.body && req.body.keyword);

    if (!keyword) {
        context.res = {
            status: 400,
            body: "Please pass a keyword on the query string or in the request body"
        };
        return;
    }

    try {
        const pool = await sql.connect({
            user: 'opr01',
            password: '1q2w#E$R',
            server: 'labdbserver.database.windows.net',
            database: 'labdb',
            options: {
                encrypt: true
            }
        });

        const result = await pool.request()
            .input('keyword', sql.NVarChar, '%' + keyword + '%')
            .query('SELECT * FROM MarketIndex WHERE idxNm LIKE @keyword');

        context.res = {
            status: 200,
            body: result.recordset
        };

        sql.close();
    } catch (err) {
        context.res = {
            status: 500,
            body: "Error: " + err
        };
    }
};