import requests
import pymssql

# 공공 데이터 API 호출
api_url = "https://apis.data.go.kr/1160100/service/GetMarketIndexInfoService/getStockMarketIndex"
service_key = "rrWnWSoV+UD3GJSWP2AN8JrM5Osx07OcwmULkv1OBshBYMRu3h0EL40CHuogRs2jegzcmLFPXCfkVdpw6Lvg1A=="
params = {
    'serviceKey': service_key,
    'resultType': 'json',
    'numOfRows': 100,
    'pageNo': 1,
}

response = requests.get(api_url, params=params)
data = response.json().get('response', {}).get('body', {}).get('items', {}).get('item', [])

# Azure SQL Database 연결
conn = pymssql.connect(
    server='labdbserver.database.windows.net',
    user='opr01',
    password='1q2w#E$R',
    database='labdb'
)
cursor = conn.cursor()

# 기존 데이터 삭제
cursor.execute('DELETE FROM MarketIndex')

# 새로운 데이터 삽입
for item in data:
    cursor.execute(
        "INSERT INTO MarketIndex (basDt, idxNm, clpr, vs, fltRt) VALUES (%s, %s, %s, %s, %s)",
        (item['basDt'], item['idxNm'], item['clpr'], item['vs'], item['fltRt'])
    )

conn.commit()
conn.close()