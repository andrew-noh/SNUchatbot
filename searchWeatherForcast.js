//Load modules
var req_forecast = require('request');

var key = '#';
var appId = '&appid=' + key;
var url_forecast = 'http://api.openweathermap.org/data/2.5/forecast?lat=37.459814&lon=126.953166';
var requestForecastURL = url_forecast + "&lang=kr" + appId;

// English version
//var requestForecastURL = url_forecast + appId;


function getDateToday() {
  var d = new Date();
  var d2 = new Date(d.getTime() + 32400000);
  var day = ("0" + d2.getDate()).slice(-2);
  var month = ("0" + (d.getMonth() + 1)).slice(-2);
  var year = d.getFullYear();
  return year + '-' + month + '-' + day;
}

function compareDays(source, target) {
  if (source == target) {
    return '오늘';
  } else {
    return '내일';
  };
}

req_forecast({
  uri: requestForecastURL
}, function(err, res, body) {
  var body = JSON.parse(body);
  var today = getDateToday();
  var forcast_title = "일기예보";
  var forcast_date1 = body.list[3].dt_txt.slice(0, 10);
  var forcast_date1_hr = body.list[3].dt_txt.slice(11, 13);

  var forcast_date2 = body.list[7].dt_txt.slice(0, 10);
  var forcast_date2_hr = body.list[7].dt_txt.slice(11, 13);

  var forcast_today_descr = body.list[3].weather[0].description;
  var forcast_tomorrow_descr = body.list[7].weather[0].description;

  var forcast_today_temp = " (" + (body.list[3].main.temp - 273.15).toFixed(2) + "°C" + ")";
  var forcast_tomorrow_temp = " (" + (body.list[7].main.temp - 273.15).toFixed(2) + "°C" + ")";

  var day1_text = compareDays(forcast_date1, today);
  var day2_text = compareDays(forcast_date2, today);

  var forcast_text_today = day1_text + ' ' + forcast_date1_hr + '시: ' + forcast_today_descr + forcast_today_temp;
  var forcast_text_tomorrow = day2_text + ' ' + forcast_date2_hr + '시: ' + forcast_tomorrow_descr + forcast_tomorrow_temp;

  var forcast_total = "일기예보:\n" + forcast_text_today + '\n' + forcast_text_tomorrow;

  //context.session.weatherForecast = forcast_total;
  console.log(forcast_total);

  //callback();

});
