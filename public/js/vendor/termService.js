/* RMIT University Vietnam
Course: COSC2430 Web Programming
Semester: 2023A
Assessment: Assignment 2
Author: Vu Loc
ID: S3891483
Acknowledgement: https://github.com/codingmarket07/Terms-and-Condition-Section-Tabs-In-HTML-CSS-and-Javascript.git 
*/

var tab_lists = document.querySelectorAll(".tabs_list ul li");
var tab_items = document.querySelectorAll(".tab_item");

tab_lists.forEach(function (list) {
  list.addEventListener("click", function () {
    var tab_data = list.getAttribute("data-tc");

    tab_lists.forEach(function (list) {
      list.classList.remove("active");
    });
    list.classList.add("active");

    tab_items.forEach(function (item) {
      var tab_class = item.getAttribute("class").split(" ");
      if (tab_class.includes(tab_data)) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  });
});
