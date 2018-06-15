
var user_input = '오늘';

//Load modules
var request = require('request');
var cheerio = require('cheerio');

function formatDate(todayOrTomorrow) {
  var d = new Date();
  var d2 = new Date(d.getTime() + 0); // +32400000;
  var dPlus2 = new Date(d2.getTime() + 86400000);

  var day = d2.getDate();
  var tomorrow = dPlus2.getDate();
  var month = d2.getMonth() + 1;
  var year = d2.getFullYear();

  if (todayOrTomorrow === '오늘') {
    return year + '-' + month + '-' + day;
  } else if (todayOrTomorrow === '내일') {
    return year + '-' + month + '-' + tomorrow;
  } else {
    return year + '-' + month + '-' + day;
  };
}

function checkRestaurant(raw_string) {
  //Check if right restaurant
  if (raw_string.slice(0, 4) == '감골식당') {
    return true;
  } else {
    return false;
  };
}

var url = 'http://mini.snu.kr/cafe/set/';
var day_request = formatDate(user_input);
var url_day = url + day_request;


request({
  method: 'POST',
  url: url_day
}, function(err, res, body) {
  if (err) return console.error(err);

  let menu_data = cheerio.load(body);
  var gamgol_menu_raw = menu_data('table tr:nth-child(10)').text();

  //Check if right restaurant
  if (checkRestaurant(gamgol_menu_raw) === true) {

    var menu_preprocess_1 = gamgol_menu_raw.replace(/-|-/g, '');
    var menu_preprocess_2 = menu_preprocess_1.replace(/\n|,/g, ' ');
    var menu_preprocess_3 = menu_preprocess_2.replace('감골식당', '');
    var menu_preprocess_4 = menu_preprocess_3.replace(/ +(?= )/g, '');
    var menu_preprocess_5 = menu_preprocess_4.slice(1);
    var menu_list = menu_preprocess_5.split(' ');

    for (i = 0; i < menu_list.length; i++) {
      if (menu_list[i].match(/^\d\d/)) {
        var price = menu_list[i].slice(0, 2) + '00원';
        var menu_name = menu_list[i].slice(2);
        var final_menu = menu_name + ' (' + price + ')';
        menu_list[i] = final_menu;
      }
      if (menu_list[i] == 'ⓚ채식') {
        menu_list[i] = 'ⓚ채식: 5000원';
      }
    };

    var gamgol_menu = menu_list.join('\n');
    console.log(gamgol_menu);

    //context.session.gamgolMenu = gamgol_menu;

  } else {
    console.log('메뉴가 없습니다.');
  }
});

//callback();
