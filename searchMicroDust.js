// Load dependencies
var request = require('request');
var location = '동작구';

// Request URL
var url = 'http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty';
var queryParams = '?' + encodeURIComponent('ServiceKey') + '=LQEeedADdiA6byfN6ia7PA%2FumVSCjlSD2fcAPmEOEBraTeuxFXxN8jlKHnCvy%2Bqswni1rTf0q6hYmBapF4Nsdg%3D%3D';
queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('1'); /* 한 페이지 결과 수 */
queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* 페이지 번호 */
queryParams += '&' + encodeURIComponent('stationName') + '=' + encodeURIComponent(location); /* 측정소 이름 */
queryParams += '&' + encodeURIComponent('dataTerm') + '=' + encodeURIComponent('DAILY'); /* 요청 데이터기간 (하루 : DAILY, 한달 : MONTH, 3달 : 3MONTH) */
queryParams += '&' + encodeURIComponent('ver') + '=' + encodeURIComponent('1.3'); /* 버전별 상세 결과 참고문서 참조 */

function stripHtmlTag(source_text, html_tag) {
  var start_tag = '<' + html_tag + '>';
  var end_tag = '</' + html_tag + '>';
  var clean_stage1 = source_text.replace(start_tag, '');
  var clean_value = parseInt(clean_stage1.replace(end_tag, ''));
  return clean_value;
}

function checkStatus(pmVal) {
  if (pmVal <= 30) {
    return '좋음';
  } else if (pmVal > 30 && pmVal <= 80) {
    return '보통';
  } else if (pmVal > 80 && pmVal <= 150) {
    return '나쁨';
  } else {
    return '매우 나쁨';
  };
}

function getMessage(value_string) {
  switch (value_string) {
    case "좋음":
        return "오늘 미세먼지 상태는 '좋음' 이구나.\n나들이 하기 딱 좋은 날씨구먼!\n시간 나면 자하연 와서 나를 보고 가려무나~\n\n";
        break;
    case "보통":
        return "오늘 미세먼지 상태는 '보통' 이구나. 마스크는 안 써도 되겠어\n";
        break;
    case "나쁨":
        return "오늘은 미세먼지 상태가 나쁘네.. 마스크를 쓰는게 좋겠군\n";
        break;
    case "매우 나쁨":
        return "오늘은 미세먼지 상태가 매우 나쁨이야!! 마스크를 꼭 쓰고 나가게~\n"
    };
}

request({
    url: url + queryParams,
    method: 'GET'
}, function (error, response, body) {
    var tag = '㎍/㎥';
    var microDust_xml = body.match(/<\s*pm10Value[^>]*>(.*?)<\s*\/\s*pm10Value>/g);
    var ultraMicroDust_xml = body.match(/<\s*pm25Value[^>]*>(.*?)<\s*\/\s*pm25Value>/g);
    var microDust = stripHtmlTag(microDust_xml[0], 'pm10Value');
    var ultraMicroDust = stripHtmlTag(ultraMicroDust_xml[0], 'pm25Value');

    var microDust_notif = '미세먼지: ' + microDust + tag;
    var ultraMicroDust_notif = '초미세먼지: ' + ultraMicroDust + tag;
    var footnote = '(' + location + ' 측정소)';

    var final_alert = getMessage(checkStatus(microDust)) + microDust_notif + '\n' + ultraMicroDust_notif + '\n' + footnote;
    console.log(final_alert);

    //callback();
});
