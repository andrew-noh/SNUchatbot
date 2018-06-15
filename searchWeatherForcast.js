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
  //var d2 = new Date(d.getTime() + 32400000);
  var d2 = new Date(d.getTime() + 0);
  var day = ("0" + d2.getDate()).slice(-2);
  var month = ("0" + (d.getMonth() + 1)).slice(-2);
  var year = d.getFullYear();
  return year + '-' + month + '-' + day;
}

function compareDays(source, target) {
  var source_day = parseInt(source.split("-")[2]);
  var target_day = parseInt(target.split("-")[2]);
  var target_month = parseInt(target.split("-")[1]);

  if (source_day === target_day) {
    return '오늘';
  } else if (source_day + 1 === target_day) {
    return '내일';
  } else {
    return target_month + '월' + target_day + '일';
  };
}

function getForcasts(body_data, start_index, end_index, step) {
  var body_parsed = JSON.parse(body_data);
  var today = getDateToday();
  var forcast_title = "일기예보";
  var forcast_text = '';

  for (var i = start_index; i <= end_index; i += step) {
    var forcast_date = body_parsed.list[i].dt_txt.slice(0, 10);
    var forcast_date_hr = body_parsed.list[i].dt_txt.slice(11, 13);
    var forcast_descr = body_parsed.list[i].weather[0].description;
    var forcast_temp = " (" + (body_parsed.list[i].main.temp - 273.15).toFixed(2) + "°C" + ")";
    var day_text = compareDays(today, forcast_date);
    var forcast =  '\n' + day_text + ' ' + forcast_date_hr + '시: ' + forcast_descr + forcast_temp;
    forcast_text = forcast_text + forcast;
  };

  return forcast_text;
}

req_forecast({
  uri: requestForecastURL
}, function(err, res, body) {
  var forcast_data = getForcasts(body, 2, 11, 1);

  console.log(forcast_data);

  //context.session.weatherForecast = forcast_data;
  //callback();

});
