
/**
 * autor rcq
 * 公共js
 */

$(document).ready(function() {
  htmlLoad()
})
/*
  加载公共html代码
*/
function htmlLoad() {
  $(".headerpage").load("header.html");
  $(".footerpage").load("footer.html");
}