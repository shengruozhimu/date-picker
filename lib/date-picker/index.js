"use strict"

const datePicker = (function(){
    function  DatePicker({ id , name, change, type }){
        if(!id){
            throw '未定义选择器id'
        }
        this.id = id;
        if(name){
            this.Name = name;   
        }
        if(type){
            this.Type = type
        }
        this.Change = change;
        let now = new Date();
        this.Date = new Date(`${now.getFullYear()}-${now.getMonth()+1}-1`);
        this.show = this.GenerateShow()
        this.input = this.GenerateInput()
        this.el = this.GeneratePannel()
        document.getElementById(id).appendChild(this.show)
        document.getElementById(id).appendChild(this.input)  
        document.getElementById(id).appendChild(this.el)
        document.getElementById(id).setAttribute('role','application')
        this.ShowValue()
    }
    DatePicker.prototype.Name = "__date_picker__";
    DatePicker.prototype.Format = "yyyy-MM-dd";
    DatePicker.prototype.Type = 'single'; //single , double
    DatePicker.prototype.ChooseArr = new Array(2);
    DatePicker.prototype.ChooseArrIndex = 0;
    DatePicker.prototype.MonthArr = [31,28,31,30,31,30,31,31,30,31,30,31];
    DatePicker.prototype.WeekArr = ['星期一','星期二','星期三','星期四','星期五','星期六','星期天'];
    DatePicker.prototype.isGregorianLeapYear = function(year) {
        let isLeap = false;
        if (year%4==0) isLeap = true;
        if (year%100==0) isLeap = false;
        if (year%400==0) isLeap = true;
        return isLeap;
    };
    DatePicker.prototype.daysInGregorianMonth = function(y, m) {
        let d = this.MonthArr[m-1];
        if (m==2 && this.isGregorianLeapYear(y)) d++;
        return d;      
    }
    DatePicker.prototype.formatDate = function(date, fmt) {
        if (/(y+)/.test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        let o = {
          'y+':date.getFullYear(),
          'M+': date.getMonth() + 1,
          'd+': date.getDate(),
          'h+': date.getHours(),
          'm+': date.getMinutes(),
          's+': date.getSeconds()
        }
        function padLeftZero(str) {
          return ('00' + str).substr(str.length)
        }
        for (let k in o) {
          if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + ''
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str))
          }
        }
        return fmt
      }
    DatePicker.prototype.GenerateCalendar = function(){
        let now = this.Date;
        let days = this.daysInGregorianMonth(now.getFullYear(),now.getMonth() + 1);
        let begain = new Date(`${now.getFullYear()}-${now.getMonth() + 1}-1`);
        let end = new Date(`${now.getFullYear()}-${now.getMonth() + 1}-${days}`);
        let calendar = [];
        while(begain.getDay() != 1){
            begain = new Date(begain.getTime() - 24 * 60 * 60 * 1000);
            calendar.unshift({ date : begain.getDate() , diff : true,time : begain })
        }   
        for(var i = 1; i <= days;i++){
            calendar.push({ date : i , diff : false ,time : new Date(`${this.Date.getFullYear()}-${this.Date.getMonth() + 1}-${i}`)  })
        }
        while(end.getDay() != 0){
            end = new Date(end.getTime() + 24 * 60 * 60 * 1000);
            calendar.push({ date : end.getDate() , diff : true,time : end })
        }
        return calendar;
    }
    DatePicker.prototype.GenerateShow = function(){
        let show = document.createElement('div')
        show.classList.add('datepicker-dailog-show')
        let self = this
        show.addEventListener('click',function(e){
            if(self.el.classList.contains('hide')){
                self.el.classList.remove('hide')
            }else{
                self.el.classList.add('hide')
            }
        })
        return show
    }
    DatePicker.prototype.GenerateInput = function(){
        let inputs = document.createElement('div')
        inputs.style.display = 'none'
        return inputs
    }
    DatePicker.prototype.GeneratePannel = function(){
        let pannel = document.createElement('div')
        pannel.classList.add('datepicker-dailog-pannel')
        pannel.classList.add('hide')
        return pannel
    }
    DatePicker.prototype.ClearPannel = function(){
        this.el.innerHTML = ''
    }
    DatePicker.prototype.Render = function(){
        this.ClearPannel();
        let calendar = this.GenerateCalendar();
        this.el.appendChild(this.RenderHeading())
        this.el.appendChild(this.RenderWeekGrid())
        this.el.appendChild(this.RenderDayGrid(calendar))
        this.el.appendChild(this.RenderBtnGroup())
        this.ShowValue()
    }
    DatePicker.prototype.RenderHeading = function(){
        let heading = document.createElement('div')
        heading.classList.add('heading')
        heading.setAttribute('role','heading')
        heading.appendChild(this.RenderHeadingLeftBtn())
        heading.appendChild(this.RenderHeadingTitle())
        heading.appendChild(this.RenderHeadingRightBtn())   
        return heading
    }
    DatePicker.prototype.RenderHeadingLeftBtn = function(){
        let leftBtn = document.createElement('div')
        leftBtn.innerHTML = '<'
        leftBtn.classList.add('pre')
        let self = this;
        leftBtn.onclick = function(e){
            if(self.Date.getMonth() == 1){
                self.Date = new Date(`${self.Date.getFullYear() - 1}-12-1`);   
            }else{
                self.Date = new Date(`${self.Date.getFullYear()}-${self.Date.getMonth()}-1`);   
            }
            self.Render();
        }
        return leftBtn;
    }
    DatePicker.prototype.RenderHeadingRightBtn = function(){
        let rightBtn = document.createElement('div')
        rightBtn.innerHTML = '>'
        rightBtn.classList.add('next')
        let self = this;
        rightBtn.onclick = function(){
            if(self.Date.getMonth() == 11){
                self.Date = new Date(`${self.Date.getFullYear() + 1}-1-1`);   
            }else{
                self.Date = new Date(`${self.Date.getFullYear()}-${self.Date.getMonth() + 2}-1`);   
            }
            self.Render();
        }
        return rightBtn
    }
    DatePicker.prototype.RenderHeadingTitle = function(){
        let title = document.createElement('div')
        title.innerHTML = `${this.Date.getFullYear()}-${this.Date.getMonth() + 1}`
        title.classList.add('title')
        return title;
    }
    DatePicker.prototype.RenderWeekGrid = function(){
        let grid = document.createElement('div')
        grid.setAttribute('role','grid')
        grid.classList.add('weeks')
        for(var index in this.WeekArr){
            grid.appendChild(this.RenderWeekGridCell(this.WeekArr[index]));
        }
        return grid;
    }
    DatePicker.prototype.RenderWeekGridCell = function(week){
        let cell = document.createElement('div')
        cell.innerHTML = week;
        cell.classList.add('week')
        return cell;
    }
    DatePicker.prototype.RenderDayGrid = function(calendar){
        let grid = document.createElement('div')
        grid.setAttribute('role','grid')
        grid.classList.add('days')
        grid.style.cssText = `
        grid-template-rows: repeat(${!!(calendar.length % 7) + Math.floor(calendar.length / 7)},minmax(80px,1fr));
        `;
        for(var index in calendar){
            grid.appendChild(this.RenderDayGridCell(index,calendar[index]));
        }
        this._ds = grid.children;
        return grid;
    }
    DatePicker.prototype.RenderDayGridCell = function(i,item){
        let gridcell = document.createElement('div')
        gridcell.classList.add('day')
        gridcell.innerHTML = item.date
        gridcell.setAttribute('tabindex',i)
        gridcell.setAttribute('data-time',item.time.getTime())
        gridcell.setAttribute('role','gridcell')
        if(item.diff){
            gridcell.classList.add('not-current-month')
        }else{
            gridcell.classList.add('current-month')
        }
        let self = this;
        if(!item.diff){
            gridcell.addEventListener('click',function(e){
                self.SetValue(item.time)
                typeof(self.Change) == 'function'  &&  self.Change(this,item.date)
            })
        }
        return gridcell
    }
    DatePicker.prototype.RenderBtnGroup = function(){
        let btnGroup = document.createElement('div')
        btnGroup.className = 'btn-group'
        let btnComfirm = document.createElement('div')
        btnComfirm.className = 'btn-comfirm'
        btnComfirm.innerText = '确认'
        let btnReset = document.createElement('div') 
        btnReset.className = 'btn-reset'
        btnReset.innerText = '清空'
        let self = this
        btnComfirm.addEventListener('click',function(){
            let inputStr = ''
            if(self.Type == 'single'){
                if(self.Choose){
                    let value = self.formatDate(self.Choose,self.Format)
                    self.show.innerText = value
                    inputStr += `<input name="${self.Name}" value="${value}">`
                }else{
                    self.show.innerText = ''
                }
                 
            }else if(self.Type == 'double'){
                let comment = ''
                if(self.ChooseArr[0]){
                    let v1 = self.formatDate(self.ChooseArr[0],self.Format);
                    comment += v1
                    inputStr+= `<input name="${self.Name}" value="${v1}" type="checkbox" checked>`
                }
                if(self.ChooseArr[1]){
                    let v2 = self.formatDate(self.ChooseArr[1],self.Format);
                    comment+= '~'
                    comment += v2
                    inputStr+= `<input name="${self.Name}" value="${v2}" type="checkbox" checked>`
                }
                self.show.innerText = comment

            }else{
    
            }
            self.input.innerHTML = inputStr
        })
        btnReset.addEventListener('click',function(){
            self.show.innerText = ''
            if(self.Type == 'single'){
                delete self.Choose
            }else if(self.Type == 'double'){
                self.ChooseArr = new Array(2)
                self.ChooseArrIndex = 0
            }else{
    
            }
            self.input.innerHTML = ''
            self.ShowValue()
        })
        btnGroup.appendChild(btnComfirm)
        btnGroup.appendChild(btnReset)
        return btnGroup
    }
    DatePicker.prototype.SetValue = function(time){
        if(this.Type == 'single'){
            this.Choose = time;
        }else if(this.Type == 'double'){
            if(this.ChooseArrIndex >= 2){
                this.ChooseArrIndex = 0;
                this.ChooseArr = new Array(2)
            }
            this.ChooseArr[this.ChooseArrIndex] = time;
            this.ChooseArrIndex++
            if(this.ChooseArr[0] && this.ChooseArr[1]){
                if(this.ChooseArr[0] >= this.ChooseArr[1]){
                    let temp = this.ChooseArr[0]
                    this.ChooseArr[0] = this.ChooseArr[1]
                    this.ChooseArr[1] = temp
                }
            }
        }else{

        }
        this.ShowValue()
    }
    DatePicker.prototype.ShowValue = function(){
        let dayArr = this._ds
        if(!dayArr) return
        if(this.Type == 'single'){
            if(this.Choose){
                for(var day of dayArr){
                    if(day.getAttribute('data-time') == this.Choose.getTime()){
                        day.classList.add('active')
                    }else{
                        day.classList.remove('active')
                    }
                }
            }else{
                for(var day of dayArr){
                    day.classList.remove('active')
                }
            }
        }else{
            if(this.ChooseArr[0] && this.ChooseArr[1])
            {
                for(var day of dayArr){
                    if(day.getAttribute('data-time') >=  this.ChooseArr[0].getTime() && day.getAttribute('data-time') <= this.ChooseArr[1].getTime()){
                        day.classList.add('active')
                    }else{
                        day.classList.remove('active')
                    }
                }

            }else if(this.ChooseArr[0]){
                for(var day of dayArr){
                    if(day.getAttribute('data-time') == this.ChooseArr[0].getTime()){
                        day.classList.add('active')
                    }else{
                        day.classList.remove('active')
                    }
                }

            }else{
                for(var day of dayArr){
                    day.classList.remove('active')
                }
            }
        }
    }
    return DatePicker;
}());