//Load modules
var request = require('request');
var cheerio = require('cheerio');

var url = 'http://libseat.snu.ac.kr/domain5_lib.asp';

function split_table_data(tableRow) {
  var total_seats = tableRow[0];
  var occupied_seats = tableRow[1];
  var free_seats = tableRow[2];
  var occupancy = tableRow[3];
  var line = '\n----------\n'
  return '전체 좌석수: ' + total_seats + '\n사용 좌석수: ' +  occupied_seats + '\n잔여 좌석수: ' + free_seats + '\n이용율: ' + occupancy + line;
}


request({
  method: 'POST',
  url: url
}, function(err, res, body) {
  if (err) return console.error(err);
  let lib_data = cheerio.load(body);
  var final_library_info = '';

  for (var i = 3; i < 13; i++) {
    var table_tag = 'table tr:nth-child(' + i + ')';
    var table_row = lib_data(table_tag).text();
    if (i < 9) {
      var room_name = table_row.slice(2, 11);
      var room_data = table_row.slice(12).split(' ');
      var room_info = split_table_data(room_data);
      var room_info_text = '<' + room_name + '>\n' + room_info;
      final_library_info += room_info_text;
    } else if (i > 8 && i < 12) {
      var room_name = table_row.slice(2, 12);
      var room_data = table_row.slice(13).split(' ');
      var room_info = split_table_data(room_data);
      var room_info_text = '<' + room_name + '>\n' + room_info;
      final_library_info += room_info_text;
    } else if (i == 12) {
      var room_name = table_row.slice(3, 13);
      var room_data = table_row.slice(14).split(' ');
      var room_info = split_table_data(room_data);
      var room_info_text = '<' + room_name + '>\n' + room_info;
      final_library_info += room_info_text;
    };
  }

  console.log(final_library_info);
  //callback();

});
