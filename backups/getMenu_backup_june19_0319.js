

          var request = require('request');
          var cheerio = require('cheerio');

          // Variables
          if (context.session.dateQuery === '오늘') {
            var requestDate = 'today';
          } else {
            var requestDate = 'tomorrow';
          };

          var searchQuery = context.session.storeQuery; // User input query preset

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
            var today = new Date(d.getTime() + 32400000); // Timezone offset
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
            };
          }

          function stringDate(todayOrTomorrow) {
            var d = new Date();
            var today = new Date(d.getTime() + 32400000);
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
            };
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
                  };
                  menu_string = menu_string + servingTime + '\n' + menuName + ' (' + menuDescription + '): ' + menuPrice + '원\n';
                } else if (!!value.description == true && !!value.name == false) {
                  // Case only description
                  var servingTime = getMenuTime(value.time);
                  var menuDescription = value.description;
                  if (!value.price) {
                    var menuPrice = '-';
                  } else {
                    var menuPrice = value.price;
                  };
                  menu_string = menu_string + servingTime + '\n' + menuDescription + ': ' + menuPrice + '원\n';
                } else if (!!value.name == true && !!value.description == false) {
                  // Case only name
                  var servingTime = getMenuTime(value.time);
                  var menuName = value.name;
                  if (!value.price) {
                    var menuPrice = '-';
                  } else {
                    var menuPrice = value.price;
                  };
                  menu_string = menu_string + servingTime + '\n' + menuName + ': ' + menuPrice + '원\n';
                };
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
                };
                menu_string = menu_string + servingTime + '\n' + menuName + ' (' + menuDescription + '): ' + menuPrice + '원\n';
              } else if (!!menuList.description == true && !!menuList.name == false) {
                // Case only description
                var servingTime = getMenuTime(menuList.time);
                var menuDescription = menuList.description;
                if (!value.price) {
                  var menuPrice = '-';
                } else {
                  var menuPrice = value.price;
                };
                menu_string = menu_string + servingTime + '\n' + menuDescription + ': ' + menuPrice + '원\n';
              } else if (!!menuList.name == true && !!menuList.description == false) {
                // Case only name
                var servingTime = getMenuTime(menuList.time);
                var menuName = menuList.name;
                if (!value.price) {
                  var menuPrice = '-';
                } else {
                  var menuPrice = value.price;
                };
                menu_string = menu_string + servingTime + '\n' + menuName + ': ' + menuPrice + '원\n';
              };
            };
            return removeDuplicated(menu_string);
          }

          function removeDuplicated(source_text) {
            var temp_arr = source_text.split(/\r?\n/);
            var new_set = new Set(temp_arr);
            let array = Array.from(new_set);
            return array.join('\n');
          }

          function receiveMenu(body_raw) {
            var body = JSON.parse(body_raw);
            if (body.store.menus.length > 0) {
              body.store.menus.forEach(function(value) {
                delete value.type;
                delete value.date;
                if (value.description === '#' || !value.description) {
                  delete value.description;
                };
                if (value.name === '#' || !value.name) {
                  delete value.name;
                };
              });
              return menuPresenter(body.store.menus);
            } else {
              return '메뉴가 업로드되지 않았습니다ㅠ';
            };
          }

          function formatDate_Gamgol(todayOrTomorrow) {
            var d = new Date();
            var today = new Date(d.getTime() + 32400000); // +32400000;
            var dPlus2 = new Date(today.getTime() + 86400000);

            var day = today.getDate();
            var tomorrow = dPlus2.getDate();
            var month = today.getMonth() + 1;
            var year = today.getFullYear();

            if (todayOrTomorrow === 'today') {
              return year + '-' + month + '-' + day;
            } else if (todayOrTomorrow === 'tomorrow') {
              return year + '-' + month + '-' + tomorrow;
            } else {
              return year + '-' + month + '-' + day;
            };
          }

          function checkGamgolRestaurant(raw_string) {
            //Check if right restaurant
            if (raw_string.slice(0, 4) == '감골식당') {
              return true;
            } else {
              return false;
            };
          }

          function getGamgolMenu(html_menu) {
            var menu_preprocess_1 = html_menu.replace(/-|-/g, '');
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
                menu_list[i] = 'ⓚ채식 (5000원)';
              }
            };

            var gamgol_menu = menu_list.join('\n');
            return gamgol_menu;
          }

          // Check if request for Gamgol
          if (searchQuery != '감골식당') {

            // Get regular cafeteria menus
            var dateReq = formatDate(requestDate);

            //Query
            var queryObject = {
              date: dateReq //Date
            };

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

                //console.log(err.message);
                context.session.result = err.message;

              } else {

                //var outputText = searchQuery + '\n' + stringDate(requestDate) + '\n' + receiveMenu(body);
                //console.log(outputText);
                context.session.result = searchQuery + '\n' + stringDate(requestDate) + '\n' + receiveMenu(body);

              };

              callback();

            });
          } else {

            var url_gamgol = 'http://mini.snu.kr/cafe/set/';
            var gamgol_day_request = formatDate_Gamgol(requestDate);
            var url_day_gamgol = url_gamgol + gamgol_day_request;

            request({
              method: 'POST',
              url: url_day_gamgol
            }, function(err, res, body) {
              if (err) return console.error(err);

              let menu_data_gamgol = cheerio.load(body);

              //Check if right restaurant
              if (checkGamgolRestaurant(menu_data_gamgol('table tr:nth-child(11)').text()) === true) {
                var gamgol_menu_final = menu_data_gamgol('table tr:nth-child(11)').text();
                var gamgol_menu_text = searchQuery + '\n' + stringDate(requestDate) + '\n' + getGamgolMenu(gamgol_menu_final);

                //console.log(gamgol_menu_text);
                context.session.result = gamgol_menu_text;

              } else if (checkGamgolRestaurant(menu_data_gamgol('table tr:nth-child(10)').text()) === true) {
                var gamgol_menu_final = menu_data_gamgol('table tr:nth-child(10)').text();
                var gamgol_menu_text = searchQuery + '\n' + stringDate(requestDate) + '\n' + getGamgolMenu(gamgol_menu_final);

                //console.log(gamgol_menu_text);
                context.session.result = gamgol_menu_text;

              } else {

                //console.log('메뉴가 없습니다.');
                context.session.result = '메뉴가 없습니다.';
              };

              callback();

            });
          };
