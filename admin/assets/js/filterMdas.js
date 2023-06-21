
$("#active").on('click',  () => {
        var input, filter, table, tr, td, i;
        input = document.getElementById("active");
        filter = input.value.toUpperCase();
        table = document.querySelector("table");
        tr = table.getElementsByTagName("tr");
        for (var i = 0; i < tr.length; i++) {
          var tds = tr[i].getElementsByTagName("td");
          var flag = false;
          for(var j = 0; j < tds.length; j++){
            var td = tds[j];
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
              flag = true;
            } 
          }
          if(flag){
              tr[i].style.display = "";
          }
          else {
              tr[i].style.display = "none";
          }
        }
})

$("#inactive").on('click',  () => {
    var input, filter, table, tr, td, i;
    input = document.getElementById("inactive");
    filter = input.value.toUpperCase();
    table = document.querySelector("table");
    tr = table.getElementsByTagName("tr");
    for (var i = 0; i < tr.length; i++) {
      var tds = tr[i].getElementsByTagName("td");
      var flag = false;
      for(var j = 0; j < tds.length; j++){
        var td = tds[j];
        if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
          flag = true;
        } 
      }
      if(flag){
          tr[i].style.display = "";
      }
      else {
          tr[i].style.display = "none";
      }
    }
})