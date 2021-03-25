# date-picker
    js plugs
# date word of chinese character
  星期一 星期二 星期三 星期四 星期五 星期六 星期日
# you can use it like this
```
<link rel="stylesheet" href="lib/date-picker/index.css">
<script src="lib/date-picker/index.js"></script>
<div id="demo"></div>
<script>
 let change = (element,date) =>{
  console.log(element)
  console.log(date)
 }
 let name = 'begain'
 let init0 = new datePicker({ id : 'demo',type : 'double',change ,name });
 init0.Render();
</script>
```
