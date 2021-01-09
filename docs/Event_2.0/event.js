var li_elements = document.querySelectorAll("nav form a");
var item_elements = document.querySelectorAll(".item");
for (var i = 0; i < li_elements.length; i++) {
  li_elements[i].addEventListener("click", function() {
    // li_elements.forEach(function(li) {
    //   li.classList.remove("active");
    // });
    // this.classList.add("active");
    var li_value = this.getAttribute("data-li");
    item_elements.forEach(function(item) {
      item.style.display = "none";
    });
    if (li_value == "previous") {
      document.querySelector("." + li_value).style.display = "block";
    } else if (li_value == "upcoming") {
      document.querySelector("." + li_value).style.display = "block";
    } 
    else {
      console.log("");
    }
  });
}