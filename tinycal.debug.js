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
	
	$.addZero = addZero;
    
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
		recordState:false,
        num:1,
		width:250,
		height:260,
		blurBefore:null
    };
    
    function isLeapYear(year) {
        return ((year % 4 == 0 && year % 100 != 0) || (year % 400) == 0);
    }
    
    function isChecked(year, month, day, context) {
        var one;
        for(var i = 0, num = context.checked.length; i < num; i++) {
            one = context.checked[i];
            if(one.year == year && one.month == month && one.day == day) {
                return i;
            }
        }
        return -1;
    }
	
    function removeChecked(year, month, day, context) {
		var sn = isChecked(year, month, day, context);
		if(sn >= 0) {
			context.checked.splice(sn, 1);
		}
    }
    
	function compareDate(y, m, d, dt) {
		return (y - dt.getFullYear()) * 360 + (m - dt.getMonth()) * 30 + (d - dt.getDate()); 
	}
    
    var g_contexts = {};

    $.fn.calendar = function(settings) {
		//每个context不同的内容，不能放在default_settings，否则会互相干扰
        var context = {checked:[],records:[]}; 
        $.extend(context, default_settings);
        $.extend(context, settings);
        
        if(context.lang == 'cn') {
            context.weekDays = g_cn_weekDays;
            context.months = g_cn_months;
        } else {
            context.weekDays = g_en_weekDays;
            context.months = g_en_months;
        }
        
        g_contexts[context.target] = context; //record context into global
        $(context.target).click({target:context.target}, function(event) {
            var context = g_contexts[event.data.target];
            if(context) {
			    if(context.mode != 'multi') {
					context.checked = [];
				}
				if(!context.recordState) {
					context.records = [];
				}
				if(context.records.length < context.num) {
					for(var i = context.records.length; i < context.num; i++) {
						context.records.push({year:g_today.getFullYear(), month:g_today.getMonth()});
					}
				}
                genHtm(context);
            }
        });
        
        function getZindex() {
            var maxZ = Math.max.apply(null, $.map($('body > *'), function(e, n) {
				if ($(e).css('position') == 'absolute') {
					return parseInt($(e).css('z-index')) || 1;
				}
			}));
            return maxZ;
        }
        
		function hide(event) {
			var target = event.data.target;
			var context = g_contexts[target];
			if(event.data.force || $(event.target).closest(context.divName).length == 0) {
				$(document).unbind('mouseup');
				$(context.divName).fadeOut();
			}
		}
		
        function genHtm(context) {
			//weekday of the first day in the month
            var target = context.target;
           
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
				htm.push('<table class="calendar" style="border-collapse: collapse;"><tr>'
						,'<td style="text-align:left;"><span class="calendar_btn foreYear" no="',n,'"></span>'
						,'&nbsp;<span class="calendar_btn foreMonth" no="',n,'"></span></td>'
						,'<td align="center">', context.format(rec.year, rec.month)
						,'</td><td style="text-align:right;"><span class="calendar_btn nextMonth" no="',n,'"></span>'
						,'&nbsp;<span class="calendar_btn nextYear" no="',n,'"></span></td>'
						,'</tr></table>');
				htm.push('<table class="calendar"><tr>');
				for(var i = 0; i < 7; i++ ){
					htm.push('<td>', context.weekDays[i], '</td>');
				}
				htm.push('</tr>');
				
				var day = 1;
				for (var i = 0; i < 6 && day <= monthDayNum; i++) {
					htm.push('<tr>');
					for (var j = 0; j < 7; j++) {
						htm.push('<td');
						if (day <= monthDayNum && (i > 0 || j >= startDay)) {
							if(compareDate(rec.year, rec.month, day, g_today) == 0) {
								htm.push(' class="today"');
							} 
							htm.push(' align="center" valign="middle">');
							
							htm.push('<div class="calendar_day ');
							if(isChecked(rec.year, rec.month, day, context) >= 0) {
								htm.push('selectedDay');
							} else {
								if(context.blurBefore && (context.blurBefore instanceof Date)
								   && compareDate(rec.year, rec.month, day, context.blurBefore) < 0) {
									htm.push('blur');
								} else {
									htm.push('day');
								}
							}
							htm.push('" day="',day,'" no="', n, '">', day, '</div>');
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
	        if(calDiv.size() <= 0) {
	        	var sDiv = '<div id="' + context.divName.substr(1) + '" class="calendar_body"';
	        	if(context.zIndex) {
	        		sDiv += ' style="z-index:' + context.zIndex + '"';
	        	}
	        	sDiv += '/>';
	            $('body').append(sDiv);
	            calDiv = $(context.divName);
	        }

			calDiv.width(context.num * context.width);
            calDiv.html(htm.join(''));

			var targetObj = $(target);
			var offset = targetObj.offset();
			var x = offset.left;
			var y = offset.top;
			var h = targetObj.height();
			calDiv.css({
				'top':(y+h+6),
				'left':x,
				'z-index':getZindex(),
			    'height':context.height+'px',
				'width':(context.width * context.num) +'px'
			}); 
            calDiv.fadeIn();
			$(document).mouseup({target:target}, hide);

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
					context.checked[0] = one;
                    if(context.ok([one], target)) {
                        $(context.divName).fadeOut();
                    }
                } else if(context.mode == 'multi') {
                    context.checked.push(one);
					genHtm(context);
                } else /*range*/{
                    context.checked.push(one);
					if(context.checked.length > 2) {
						context.checked.splice(1, 1);
					}
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

            $('span.calendar_opr.close').click({target:target, force:true}, function(event) {
				hide(event);
			});
			
            $('span.calendar_opr.ok').click({target:target, force:true}, function(event) {
				var target = event.data.target;
                var context = g_contexts[target];
				context.ok(context.checked, target);
				
				hide(event);
			});
        }
    }
})(jQuery);