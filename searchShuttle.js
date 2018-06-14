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
// Timezone correction
//var d2 = new Date(d.getTime() + 32400000);

var d2 = new Date(d.getTime() + 0);

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
          //context.session.shuttleTime = "현재 시각에 배차 간격은" + parsed_object[bus].time_window + "분이고, 서울대 입구역에서 출발시 약 " + mins_left + "분 남았어!!";
          console.log("현재 시각에 배차 간격은" + parsed_object[bus].time_window + "분이고, 서울대 입구역에서 출발시 약 " + mins_left + "분 남았어!!");
        };
      };
    }
  } else if (current_time >= 19 * 60 && current_time < 23 * 60 + 10) {
    if (current_time >= zone_start_time && current_time < zone_end_time) {
      var cur_time_min = d2.getMinutes();
      // Calculate minutes left
      var mins_left = zone_end_time - current_time;
      //context.session.shuttleTime = end_hour + "시" + end_minute + "분 야간 셔틀이" + mins_left + " 분 남았어! 오늘 하루도 수고했구나~~";
      console.log(end_hour + "시" + end_minute + "분 야간 셔틀이" + mins_left + " 분 남았어! 오늘 하루도 수고했구나~~");
    }
  } else {
    //context.session.shuttleTime = "운행 중인 셔틀이 없어ㅠㅠ";
    console.log("운행 중인 셔틀이 없어ㅠㅠ");
    break;
  }
}

//callback();
