var box_item = document.querySelectorAll(".box-item");
var item_elements = document.querySelectorAll(".item");
for (var i = 0; i < box_item.length; i++) {
    box_item[i].addEventListener("click", function() {
        box_item.forEach(function(li) {
      li.classList.remove("active");
    });
    this.classList.add("active");
    var li_value = this.getAttribute("data-value");
    item_elements.forEach(function(item) {
      item.style.display = "none";
    });
    if (li_value == "video") {
      document.querySelector("." + li_value).style.display = "block";
    } else if (li_value == "pdf") {
      document.querySelector("." + li_value).style.display = "block";
    } else if (li_value == "link") {
      document.querySelector("." + li_value).style.display = "block";
    }else {
      console.log("");
    }
  });
}