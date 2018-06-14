//Load modules
var req_weather = require('request');

var key = '#';
var appId = '&appid=' + key;
var url = 'http://api.openweathermap.org/data/2.5/weather?lat=37.459814&lon=126.953166';
var requestURL = url + appId + "&lang=kr";

req_weather({
  uri: requestURL
}, function(err, res, body) {
  var body = JSON.parse(body);
  var title = "서울대 현재 날씨";
  var description;
  if (body.weather[0].description == '연무') {
    description = '약간 안개';
  } else {
    description = body.weather[0].description;
  };
  var summary = description + " (" + (body.main.temp - 273.15).toFixed(2) + "°C" + ")";
  var humidity = "습도: " + body.main.humidity + "%";
  var wind = "풍속: " + body.wind.speed + "m/s";
  //var weather_text = title + '\n' + summary + '\n' + humidity + '\n' + wind;

  //context.session.weatherSnu = title + '\n' + summary + '\n' + humidity + '\n' + wind;
  console.log(title + '\n' + summary + '\n' + humidity + '\n' + wind);

  //callback();

});
