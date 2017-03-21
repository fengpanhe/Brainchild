// var aa = JSON.parse("{\"name\": \"ACME\", \"shares\": 100, \"price\": 542.23}");
var aa = 'id=ida&roomTitle=roomTitle&topicIntro=topicIntr'
console.log(aa.slice(aa.search('=')+1,aa.search('&')))