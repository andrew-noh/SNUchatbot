// Temporary variables
var temp_date = '오늘';
var temp_store = '서당골(4식당)';

// Temporary variables
if (temp_date === '오늘') {
  var requestDate = 'today';
} else {
  var requestDate = 'tomorrow';
}

var searchQuery = temp_store // User input query preset

//==========================================================

// Get dependency
var request = require('request');


// Chatbot variables
/*
if (context.session.dateQuery === '오늘') {
  var requestDate = 'today';
} else {
  var requestDate = 'tomorrow';
}

var searchQuery = context.session.storeQuery // User input query preset
*/


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
    'Accesstoken': '#'
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

    //context.session.result = searchQuery + '\n' + stringDate(requestDate) + '\n' + menuPresenter(body.store.menus);
    console.log(searchQuery + '\n' + stringDate(requestDate) + '\n' + menuPresenter(body.store.menus));
  }

  //callback();

});
