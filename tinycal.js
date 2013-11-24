/*
Copyright [yyyy] [name of copyright owner]

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

(function($){
    var g_dayNumOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var g_cn_weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    var g_cn_months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    var g_en_weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var g_en_months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	var g_today = new Date();
	
    var g_cn_format = function(year, month, day) {
        month++;
        return day ? (year + '-' + addZero(month) + '-' + addZero(day)) : (year + '-' + addZero(month));
    };
    var g_cn_parse = function(dtStr) {
        var ss = dtStr.split('-');
        var d = new Date();
        d.setYear(parseInt(ss[0]));
        d.setMonth(parseInt(ss[1]));
        if(ss[2]) {
            d.setDate(parseInt(ss[2]));
        } else {
            d.setDate(1);
        }
        return d;
    };
	
	function addZero(val) {
		if(val < 10) {
			return '0' + val;
		}
		return val;
	}
    
    var g_ok = function(checked, target) {
        var htm = [];
        for(var i in checked) {
			if(i > 0) {
				htm.push(',');
			}
            htm.push(checked[i].year + '-' + addZero(checked[i].month+1) + '-' + addZero(checked[i].day));
        }
		
		var targetObj = $(target);
		if(targetObj.attr('type')) {
			targetObj.val(htm.join(''));
		} else {
			targetObj.html(htm.join(''));
		}
        
        return true;
    };
    
    var default_settings = {
        lang:'cn',
        weekDays: g_cn_weekDays,
        months: g_cn_months,
        target: '',
		divName:'#_calendar_div',
        mode: 'single', /*range|single|multi*/
        format: g_cn_format,
        parse: g_cn_parse,
        ok:g_ok,
		records:[],
        num:1,
		width:250,
		height:260
    };
    
    function isLeapYear(year) {
        return ((year % 4 == 0 && year % 100 != 0) || (year % 400) == 0);
    }
    
    function isChecked(year, month, day, context) {
        var one;
        for(var i = 0, num = context.checked.length; i < num; i++) {
            one = context.checked[i];
            if(one.year == year && one.month == month && one.day == day) {
                return true;
            }
        }
        return false;
    }
	
    function removeChecked(year, month, day, context) {
        var one;
        for(var i = 0, num = context.checked.length; i < num; i++) {
            one = context.checked[i];
            if(one.year == year && one.month == month && one.day == day) {
				context.checked.splice(i, 1);
                return;
            }
        }
    }
    
	function isToday(y, m, d) {
		return (y == g_today.getFullYear()
 		        && m == g_today.getMonth()
				&& d == g_today.getDate());
	}
    
    var g_contexts = {};

    $.fn.calendar = function(settings) {
        var context = {checked:[]};
        $.extend(context, default_settings);
        $.extend(context, settings);
        
        if(context.lang == 'cn') {
            context.weekDays = g_cn_weekDays;
            context.months = g_cn_months;
        } else {
            context.weekDays = g_en_weekDays;
            context.months = g_en_months;
        }
        
        if($(context.divName).size() <= 0) {
            $('body').append('<div id="' + context.divName.substr(1) + '" class="calendar_body"/>');
        }
        if(context.records.length < context.num) {
			for(var i = context.records.length; i < context.num; i++) {
				context.records.push({year:g_today.getFullYear(), month:g_today.getMonth()});
			}
		}
        g_contexts[context.target] = context; //record context into global
        $(context.target).click({target:context.target}, function(event) {
            var context = g_contexts[event.data.target];
            if(context) {
				context.checked = [];
                genHtm(context)
            }
        });
        
        function genHtm(context) {
			//weekday of the first day in the month
            var target = context.target;
           
            // calculate number of days in month
            var monthDayNum = g_dayNumOfMonth[context.month];
            if (context.month == 1) { // February only!
                if(isLeapYear(context.year)){
                    monthDayNum = 29;
                }
            }

			var rec, monthDayNum, startDay;
            var htm = [];
			htm.push('<div style="height:16px;text-align:right;">');
			if(context.mode == 'multi') {
				htm.push('<span class="calendar_opr ok"></span>');
			}
			htm.push('<span class="calendar_opr close"></span></div>');
			
			for(var n = 0; n < context.num; n++) {
				rec = context.records[n];
				monthDayNum = g_dayNumOfMonth[rec.month];
				if (context.month == 1) { // February only!
					if(isLeapYear(rec.year)){
						monthDayNum = 29;
					}
				}
				
				startDay = new Date(rec.year, rec.month, 1).getDay(); 
				htm.push('<div style="float:left;width:',context.width,'px;">');
				htm.push('<div style="margin:5px;">');
				htm.push('<table class="calendar"><tr>'
						,'<td style="text-align:left;"><span class="calendar_btn foreYear" no="',n,'"></span>'
						,'&nbsp;<span class="calendar_btn foreMonth" no="',n,'"></span></td>'
						,'<td align="center">', context.format(rec.year, rec.month)
						,'</td><td style="text-align:right;"><span class="calendar_btn nextMonth" no="',n,'"></span>'
						,'&nbsp;<span class="calendar_btn nextYear" no="',n,'"></span></td>'
						,'</tr></table>');
				htm.push('<table class="calendar"><tr>');
				for(var i = 0; i < 7; i++ ){
					htm.push('<th>', context.weekDays[i], '</th>');
				}
				htm.push('</tr>');
				
				var day = 1;
				for (var i = 0; i < 6 && day <= monthDayNum; i++) {
					htm.push('<tr>');
					for (var j = 0; j < 7; j++) {
						htm.push('<td');
						if (day <= monthDayNum && (i > 0 || j >= startDay)) {
							if(isToday(rec.year, rec.month, day)) {
								htm.push(' class="today"');
							}
							htm.push(' align="center" valign="middle">');
							
							if(isChecked(rec.year, rec.month, day, context)) {
								htm.push('<div class="calendar_day selectedDay"');
							} else {
								htm.push('<div class="calendar_day day"');
							}
							htm.push(' day="',day,'" no="', n, '">', day, '</div>');
							day++;
						} else {
							htm.push('>');
						}
						htm.push('</td>');
					}
					htm.push('</tr>');
				}
				htm.push('</table>');
				htm.push('</div>');
				htm.push('</div>');
			}
			
            var calDiv = $(context.divName);
            calDiv.html(htm.join(''));
			calDiv.width(context.num * context.width);

			var targetObj = $(target);
			var offset = targetObj.offset();
			var x = offset.left;
			var y = offset.top;
			var h = targetObj.height();
			calDiv.css({
				'top':(y+h+6),
				'left':x,
				'z-index':1000,
			    'height':context.height+'px',
				'width':(context.width * context.num) +'px',
			}); 
            calDiv.fadeIn();
			
            $('span.calendar_btn.foreYear').click({target:target}, function(event) {
				var n = parseInt($(this).attr('no'));
                var context = g_contexts[event.data.target];
                if(context.records[n].year > 1900) {
                    context.records[n].year--;
                    genHtm(context);
                }
            });
			
            $('span.calendar_btn.foreMonth').click({target:target}, function(event) {
				var n = parseInt($(this).attr('no'));
                var context = g_contexts[event.data.target];
                if(context.records[n].month > 0) {
                    context.records[n].month--;
                    genHtm(context);
                } else if(context.records[n].year > 1900){
                    context.records[n].month = 11;
                    context.records[n].year--;
                    genHtm(context);
                }
            });
            
            $('span.calendar_btn.nextYear').click({target:target}, function(event) {
				var n = parseInt($(this).attr('no'));
                var context = g_contexts[event.data.target];
                if(context.records[n].year < 2200) {
                    context.records[n].year++;
                    genHtm(context);
                }
            });
            
            $('span.calendar_btn.nextMonth').click({target:target}, function(event) {
                var context = g_contexts[event.data.target];
				var n = parseInt($(this).attr('no'));
                if(context.records[n].month < 11) {
                    context.records[n].month++;
                    genHtm(context);
                } else if(context.records[n].year < 2200){
                    context.records[n].year++;
                    context.records[n].month = 0;
                    genHtm(context);
                }
            });
            
			$('div.calendar_day.day').click({target:target}, function(event) {
                var day = $(this).attr('day');
                if(!day) {
                    return;
                }
                
                day = parseInt(day);
				var n = parseInt($(this).attr('no'));
				var target = event.data.target;
                var context = g_contexts[target];
                var one = {year:context.records[n].year, month:context.records[n].month, day:day};
                if(context.mode == 'single') {
                    if(context.ok([one], target)) {
                        $(context.divName).fadeOut();
                    }
                } else if(context.mode == 'multi') {
                    context.checked.push(one);
					genHtm(context);
                } else /*range*/{
                    context.checked.push(one);
                    if(context.checked.length > 1) {
					    //simple sort
						var dt = context.checked[0];
						var dt1 = new Date(dt.year, dt.month, dt.day);
						
						var dt = context.checked[1];
						var dt2 = new Date(dt.year, dt.month, dt.day);
						
						if(dt1.getTime() > dt2.getTime()) {
							context.checked[0] = {year:dt2.getFullYear(), month:dt2.getMonth(), day:dt2.getDate()};
							context.checked[1] = {year:dt1.getFullYear(), month:dt1.getMonth(), day:dt1.getDate()};
						}
                        if(context.ok(context.checked, target)) {
							$(context.divName).fadeOut();
						}
                    } else {
						genHtm(context);
					}
                }
            });

			//only multi mode use it
            $('div.calendar_day.selectedDay').click({target:target}, function(event) {
                var day = $(this).attr('day');
                if(!day) {
                    return;
                }
                
				var target = event.data.target;
                var context = g_contexts[target];
				var n = parseInt($(this).attr('no'));
				removeChecked(context.records[n].year, context.records[n].month, day, context);
				genHtm(context);
            });

            $('span.calendar_opr.close').click({target:target}, function(event) {
				var target = event.data.target;
                var context = g_contexts[target];
				$(context.divName).fadeOut();
			});
			
            $('span.calendar_opr.ok').click({target:target}, function(event) {
				var target = event.data.target;
                var context = g_contexts[target];
				context.ok(context.checked, target);
				$(context.divName).fadeOut();
			});
        }
    }
})(jQuery);
