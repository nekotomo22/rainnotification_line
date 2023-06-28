const CHANNEL_ACCESS_TOKEN = "ここにトークンを入力"; // チャネルアクセストークンを設定
const LINE_USER_ID = "ここにユーザーIDを入力"; // 送信先のLINEユーザーIDを設定

function weatherForecast() {
  const weatherAPIUrl = 'https://weather.tsukumijima.net/api/forecast/city/270000'; // city_id : 270000(大阪)
  //https://www.jma.go.jp/bosai/common/const/area.jsonから任意の地域コードを確認し、city/の後にコードを入力
  const response = UrlFetchApp.fetch(weatherAPIUrl);
  const weatherData = JSON.parse(response.getContentText());
  const todayInfo = weatherData.forecasts[0];
  const tomorrowInfo = weatherData.forecasts[1];

  let message = `【今日は雨です☔】\n■${todayInfo["date"].replace(/-/g, "/")} ${weatherData.location.city}
天気: ${todayInfo.telop}
■${tomorrowInfo["date"].replace(/-/g, "/")} ${weatherData.location.city}
天気: ${tomorrowInfo.telop} \n\n■詳しい天気はコチラ\n https://weathernews.jp/onebox/34.69/135.50/temp=c`;

  // 今日の天気が雨、雷、暴風、雪の場合、メッセージを送信
  if (todayInfo.telop.includes("雨") || todayInfo.telop.includes("雷") ||
    todayInfo.telop.includes("暴") || todayInfo.telop.includes("雪")) {
    sendToLine(message);
  }
}

// LINE送信処理
function sendToLine(text) {
  const options = {
    'method': 'post',
    'headers': {
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
      'Content-Type': 'application/json'
    },
    'payload': JSON.stringify({
      'to': LINE_USER_ID,
      'messages': [
        {
          'type': 'text',
          'text': text
        }
      ]
    })
  };

  UrlFetchApp.fetch('https://api.line.me/v2/bot/message/push', options);
}
