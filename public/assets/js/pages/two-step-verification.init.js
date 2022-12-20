/*
Template Name: Velzon - Admin & Dashboard Template
Author: Themesbrand
Website: https://Themesbrand.com/
Contact: Themesbrand@gmail.com
File: Two step verification Init Js File
*/

// move next
function moveToNext(elem, count) {
    if (elem.value.length > 0) {
        document.getElementById("digit" + count + "-input").focus();
    }
}
// $(document).ready(function() {
//     let countDown = $('#countDown').text();
//     console.log("kkkkk",countDown);
//     if(countDown===-2){
//         document.getElementById("countDown").innerHTML = "0";
//     }
//     setInterval(function () {
//         if (countDown !== 0) {
//             document.getElementById("countDown").innerHTML = "countDown";
//         }
//     }, 1000);
//     alert("gcountDowngg")
// });