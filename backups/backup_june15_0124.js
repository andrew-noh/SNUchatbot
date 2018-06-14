module.exports = function(bot) {

  bot.setTask("defaultTask", {
    action: function(dialog, context, callback) {
      callback();
    }
  });

  bot.setTask('saveMenuDate', {
    action: function(dialog, context, callback) {
      context.session.dateQuery = dialog.userInput.text;
      callback();
    }
  });
  bot.setTask('saveMenuStore', {
    action: function(dialog, context, callback) {
      context.session.storeQuery = dialog.userInput.text;
      callback();
    }
  });
  bot.setTask('searchMenu', {
    action: function(dialog, context, callback) {
      var request = require('request');
      // Variables
      if (context.session.dateQuery === '오늘') {
        var requestDate = 'today';
      } else {
        var requestDate = 'tomorrow';
      }
      var searchQuery = context.session.storeQuery // User input query preset

      //Stores id
      var storesDict = {
        "학생회관 식당": "NTUzMDI1",
        "대학원 기숙사 식당": "MjEzNTQ4MDI1",
        "전망대(3식당)": "NTczMjQ5",
        "자하연 식당": "NjEzNzIx",
        "학부 기숙사 식당": "NTkzNDgx",
        "동원생활관식당(113동)": "NjAzNjAw",
        "220동 식당": "Njc0NDg5",
        "아름드리(예술계식당)": "NjU0MjI1",
        "서당골(4식당)": "NjQ0MDk2",
        "감골식당": "NTYzMTM2",
        "제2공학관식당(302동)": "NTgzMzY0",
        "두레미담": "NjIzODQ0",
        "제1공학관식당(301동)": "NjMzOTY5",
        "공대간이식당": "NzA0OTAw",
        "수의대식당": "MjEzNjA5ODA5"
      };

      var storeTag = storesDict[searchQuery];

      //Functions
      function formatDate(todayOrTomorrow) {
        var d = new Date();
        //var timezoneOffset = d.getTimezoneOffset() * 60000;
        var today = new Date(d.getTime() + 32400000);
        //var today = new Date(d.getTime() - timezoneOffset);
        var day = ("0" + today.getDate()).slice(-2);
        var dPlus2 = new Date(today.getTime() + 86400000);
        var tomorrow = ("0" + dPlus2.getDate()).slice(-2);
        var month = ("0" + (today.getMonth() + 1)).slice(-2);
        var year = today.getFullYear();
        if (todayOrTomorrow === 'today') {
          return year + '-' + month + '-' + day;
        } else if (todayOrTomorrow === 'tomorrow') {
          return year + '-' + month + '-' + tomorrow;
        } else {
          return year + '-' + month + '-' + day;
        }
      }

      function stringDate(todayOrTomorrow) {
        var d = new Date();
        //var timezoneOffset = d.getTimezoneOffset() * 60000;
        var today = new Date(d.getTime() + 32400000);
        //var today = new Date(d.getTime() - timezoneOffset);
        var day = ("0" + today.getDate()).slice(-2);
        var dPlus2 = new Date(today.getTime() + 86400000);
        var tomorrow = ("0" + dPlus2.getDate()).slice(-2);
        var month = ("0" + (today.getMonth() + 1)).slice(-2);
        var year = today.getFullYear();
        if (todayOrTomorrow === 'today') {
          return year + '년 ' + month + '월 ' + day + '일\n';
        } else if (todayOrTomorrow === 'tomorrow') {
          return year + '년 ' + month + '월 ' + tomorrow + '일\n';
        } else {
          return year + '년 ' + month + '월 ' + day + '일\n';
        }
      }

      function getMenuTime(num) {
        switch (num) {
          case 0:
            return '-아침-';
            break;
          case 1:
            return '--점심--';
            break;
          case 2:
            return '---저녁---';
            break;
          case 3:
            return '~종일~';
            break;
          case 4:
            return '기타';
            break;
          default:
            return '--점심--';
        }
      }

      function menuPresenter(menuList) {
        var menu_string = '';
        if (menuList.length > 1) {
          menuList.forEach(function(value) {
            if (!!value.name == true && !!value.description == true) {
              // Case have both
              var servingTime = getMenuTime(value.time);
              var menuName = value.name;
              var menuDescription = value.description;
              if (!value.price) {
                var menuPrice = '-';
              } else {
                var menuPrice = value.price;
              }
              menu_string = menu_string + servingTime + '\n' + menuName + ' (' + menuDescription + '): ' + menuPrice + '원\n';
            } else if (!!value.description == true && !!value.name == false) {
              // Case only description
              var servingTime = getMenuTime(value.time);
              var menuDescription = value.description;
              if (!value.price) {
                var menuPrice = '-';
              } else {
                var menuPrice = value.price;
              }
              menu_string = menu_string + servingTime + '\n' + menuDescription + ': ' + menuPrice + '원\n';
            } else if (!!value.name == true && !!value.description == false) {
              // Case only name
              var servingTime = getMenuTime(value.time);
              var menuName = value.name;
              if (!value.price) {
                var menuPrice = '-';
              } else {
                var menuPrice = value.price;
              }
              menu_string = menu_string + servingTime + '\n' + menuName + ': ' + menuPrice + '원\n';
            }
          });
          return removeDuplicated(menu_string);
        } else {
          if (!!menuList.name == true && !!menuList.description == true) {
            // Case have both
            var servingTime = getMenuTime(menuList.time);
            var menuName = menuList.name;
            var menuDescription = menuList.description;
            if (!value.price) {
              var menuPrice = '-';
            } else {
              var menuPrice = value.price;
            }
            menu_string = menu_string + servingTime + '\n' + menuName + ' (' + menuDescription + '): ' + menuPrice + '원\n';
          } else if (!!menuList.description == true && !!menuList.name == false) {
            // Case only description
            var servingTime = getMenuTime(menuList.time);
            var menuDescription = menuList.description;
            if (!value.price) {
              var menuPrice = '-';
            } else {
              var menuPrice = value.price;
            }
            menu_string = menu_string + servingTime + '\n' + menuDescription + ': ' + menuPrice + '원\n';
          } else if (!!menuList.name == true && !!menuList.description == false) {
            // Case only name
            var servingTime = getMenuTime(menuList.time);
            var menuName = menuList.name;
            if (!value.price) {
              var menuPrice = '-';
            } else {
              var menuPrice = value.price;
            }
            menu_string = menu_string + servingTime + '\n' + menuName + ': ' + menuPrice + '원\n';
          }
        }
        return removeDuplicated(menu_string);
      }

      function removeDuplicated(source_text) {
        var temp_arr = source_text.split(/\r?\n/);
        var new_set = new Set(temp_arr);
        let array = Array.from(new_set);
        return array.join('\n');
      }

      var dateReq = formatDate(requestDate);

      //Query
      var queryObject = {
        //type: "cafeteria",
        date: dateReq //Date
      }

      //API Access token
      let req = request.defaults({
        headers: {
          'Accesstoken': 'rJmmySxpKPHpgnCQho8R6LMZ65iCstLMQ81j4gWjwS7lmgmpCE'
        }
      });

      req({
        uri: 'https://bablabs.com/openapi/v1/campuses/spgIiBzSj0/stores/' + storeTag,
        qs: queryObject,
      }, function(err, res, body) {
        if (err) {
          context.session.result = err.message;
        } else {
          body = JSON.parse(body);
          body.store.menus.forEach(function(value) {
            delete value.type;
            delete value.date;
            if (value.description === '#' || !value.description) {
              delete value.description;
            }
            if (value.name === '#' || !value.name) {
              delete value.name;
            }
          });

          context.session.result = searchQuery + '\n' + stringDate(requestDate) + '\n' + menuPresenter(body.store.menus);
        }

        callback();

      });
    }
  });
bot.setTask('searchShuttleTime', {
  action: function(dialog, context, callback) {

    var shuttles = {

      "time_line_01": {
        "start_hour": 7,
        "start_min": 0,
        "end_hour": 8,
        "end_min": 0,
        "time_window": 15
      },

      "time_line_02": {
        "start_hour": 8,
        "start_min": 0,
        "end_hour": 8,
        "end_min": 30,
        "time_window": 5
      },
      "time_line_03": {
        "start_hour": 8,
        "start_min": 30,
        "end_hour": 10,
        "end_min": 0,
        "time_window": 3
      },

      "time_line_04": {
        "start_hour": 10,
        "start_min": 0,
        "end_hour": 11,
        "end_min": 0,
        "time_window": 5
      },

      "time_line_05": {
        "start_hour": 11,
        "start_min": 0,
        "end_hour": 15,
        "end_min": 30,
        "time_window": 10
      },

      "time_line_06": {
        "start_hour": 15,
        "start_min": 30,
        "end_hour": 17,
        "end_min": 0,
        "time_window": 4
      },

      "time_line_07": {
        "start_hour": 17,
        "start_min": 0,
        "end_hour": 18,
        "end_min": 0,
        "time_window": 4
      },

      "time_line_08": {
        "start_hour": 18,
        "start_min": 0,
        "end_hour": 19,
        "end_min": 0,
        "time_window": 6
      },

      "time_line_09": {
        "start_hour": 19,
        "start_min": 0,
        "end_hour": 21,
        "end_min": 10,
        "time_window": 1
      },
      "time_line_10": {
        "start_hour": 21,
        "start_min": 10,
        "end_hour": 21,
        "end_min": 40,
        "time_window": 6
      },
      "time_line_11": {
        "start_hour": 21,
        "start_min": 40,
        "end_hour": 22,
        "end_min": 10,
        "time_window": 6
      },
      "time_line_12": {
        "start_hour": 22,
        "start_min": 10,
        "end_hour": 22,
        "end_min": 40,
        "time_window": 6
      },
      "time_line_13": {
        "start_hour": 22,
        "start_min": 40,
        "end_hour": 23,
        "end_min": 10,
        "time_window": 6
      },
      "time_line_14": {
        "start_hour": 22,
        "start_min": 40,
        "end_hour": 23,
        "end_min": 10,
        "time_window": 6
      }
    };


    var d = new Date();
    var d2 = new Date(d.getTime() + 32400000);

    var parsed_object = JSON.parse(JSON.stringify(shuttles));


    function getTimeInMin() {
      var time_hr = d2.getHours();
      var minute_min = d2.getMinutes();
      var timeInMin = time2min(time_hr, minute_min);
      return timeInMin;
    }

    function time2min(hours, minutes) {
      var minutes_num = hours * 60 + minutes;
      return minutes_num
    }

    function generateSchedule(window_min) {
      var bus_times_min = 60 / window_min;
      var schedules = [];
      for (var min = 0; min < bus_times_min + 1; min++) {
        schedules.push(min * window_min);
      }
      return schedules;
    }

    var current_time = getTimeInMin();

    for (var bus in parsed_object) {
      var st_hour = shuttles[bus].start_hour;
      var st_minute = shuttles[bus].start_min;
      var end_hour = shuttles[bus].end_hour;
      var end_minute = shuttles[bus].end_min;
      var zone_start_time = time2min(st_hour, st_minute);
      var zone_end_time = time2min(end_hour, end_minute);
      //추가
      if (current_time >= 7 * 60 && current_time < 19 * 60) {
        if (current_time >= zone_start_time && current_time < zone_end_time) {
          var currentschedule_min = generateSchedule(parsed_object[bus].time_window);

          // Get time left
          var cur_time_min = d2.getMinutes();
          // Calculate minutes left
          for (var schedule = 0; schedule < currentschedule_min.length; schedule++) {
            if (cur_time_min > currentschedule_min[schedule] && cur_time_min < currentschedule_min[schedule + 1]) {
              var mins_left = currentschedule_min[schedule + 1] - cur_time_min;
              context.session.shuttleTime = "현재 시각에 배차 간격은" + parsed_object[bus].time_window + "분이고, 서울대 입구역에서 출발시 약 " + mins_left + "분 남았어!!";
            };
          };
        }
      } else if (current_time >= 19 * 60 && current_time < 23 * 60 + 10) {
        if (current_time >= zone_start_time && current_time < zone_end_time) {
          var cur_time_min = d2.getMinutes();
          // Calculate minutes left
          var mins_left = zone_end_time - current_time;
          context.session.shuttleTime = end_hour + "시" + end_minute + "분 야간 셔틀이" + mins_left + " 분 남았어! 오늘 하루도 수고했구나~~";
        }
      } else {
        context.session.shuttleTime = "운행 중인 셔틀이 없어ㅠㅠ";
        break;
      }
    }

    callback();

  }
});

	bot.setTask('searchWeather_new',
	{
		action: function (dialog, context, callback)
		{


        //Load modules
        var req_weather = require('request');

        var key = '77428235b3bf2576ca36a15f9692486f';
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

          context.session.weatherSnu = title + '\n' + summary + '\n' + humidity + '\n' + wind;
          //console.log(weather_text);
			callback();
        });

		}
	});

	bot.setTask('searchWeatherForcast',
	{
		action: function (dialog, context, callback)
		{

            //Load modules
            var req_forecast = require('request');

            var key = '77428235b3bf2576ca36a15f9692486f';
            var appId = '&appid=' + key;
            var url_forecast = 'http://api.openweathermap.org/data/2.5/forecast?lat=37.459814&lon=126.953166';
            var requestForecastURL = url_forecast + "&lang=kr" + appId;
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

              // console.log(forcast_total);
              context.session.weatherForecast = forcast_total;
              callback();
            });
		}
	});
};
