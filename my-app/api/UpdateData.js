const sql = require('mssql');
const axios = require('axios');

module.exports = async function (context, myTimer) {
    var timeStamp = new Date().toISOString();
    
    if (myTimer.isPastDue) {
        context.log('Timer function is running late!');
    }

    context.log('Timer trigger function ran!', timeStamp);

    // API 호출 설정
    const apiUrl = "https://apis.data.go.kr/1160100/service/GetMarketIndexInfoService/getStockMarketIndex";
    const serviceKey = "rrWnWSoV+UD3GJSWP2AN8JrM5Osx07OcwmULkv1OBshBYMRu3h0EL40CHuogRs2jegzcmLFPXCfkVdpw6Lvg1A=="; // Decoded 일반 인증키

    try {
        const response = await axios.get(apiUrl, {
            params: {
                serviceKey: serviceKey,
                resultType: 'json',
                numOfRows: 100, // 원하는 데이터 개수 설정
                pageNo: 1
            }
        });

        const data = response.data.response.body.items.item;

        // SQL Database 연결
        const pool = await sql.connect({
            user: 'opr01',
            password: '1q2w#E$R',
            server: 'labdbserver.database.windows.net',
            database: 'labdb',
            options: {
                encrypt: true
            }
        });

        // 기존 데이터 삭제
        await pool.request().query('DELETE FROM MarketIndex');

        // 새로운 데이터 삽입
        for (let item of data) {
            await pool.request()
                .input('basDt', sql.Date, item.basDt)
                .input('idxNm', sql.NVarChar, item.idxNm)
                .input('clpr', sql.Float, item.clpr)
                .input('vs', sql.Float, item.vs)
                .input('fltRt', sql.Float, item.fltRt)
                .input('mkp', sql.Float, item.mkp)
                .input('hipr', sql.Float, item.hipr)
                .input('lopr', sql.Float, item.lopr)
                .input('trqu', sql.BigInt, item.trqu)
                .input('trPrc', sql.BigInt, item.trPrc)
                .input('lstgMrktTotAmt', sql.BigInt, item.lstgMrktTotAmt)
                .input('lsYrEdVsFltRg', sql.Float, item.lsYrEdVsFltRg)
                .input('lsYrEdVsFltRt', sql.Float, item.lsYrEdVsFltRt)
                .input('yrWRcrdHgst', sql.Float, item.yrWRcrdHgst)
                .input('yrWRcrdHgstDt', sql.Date, item.yrWRcrdHgstDt)
                .input('yrWRcrdLwst', sql.Float, item.yrWRcrdLwst)
                .input('yrWRcrdLwstDt', sql.Date, item.yrWRcrdLwstDt)
                .query(`INSERT INTO MarketIndex (basDt, idxNm, clpr, vs, fltRt, mkp, hipr, lopr, trqu, trPrc, lstgMrktTotAmt, lsYrEdVsFltRg, lsYrEdVsFltRt, yrWRcrdHgst, yrWRcrdHgstDt, yrWRcrdLwst, yrWRcrdLwstDt) 
                        VALUES (@basDt, @idxNm, @clpr, @vs, @fltRt, @mkp, @hipr, @lopr, @trqu, @trPrc, @lstgMrktTotAmt, @lsYrEdVsFltRg, @lsYrEdVsFltRt, @yrWRcrdHgst, @yrWRcrdHgstDt, @yrWRcrdLwst, @yrWRcrdLwstDt)`);
        }

        context.log('Data updated successfully');
        
    } catch (err) {
        context.log('Error: ', err);
    }
};