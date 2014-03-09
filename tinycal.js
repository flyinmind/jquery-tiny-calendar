<<<<<<< HEAD
(function(f){var e=[31,28,31,30,31,30,31,31,30,31,30,31];var g=["日","一","二","三","四","五","六"];var m=["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];var p=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];var o=["January","February","March","April","May","June","July","August","September","October","November","December"];var k=new Date();var h=function(s,t,r){t++;return r?(s+"-"+j(t)+"-"+j(r)):(s+"-"+j(t))};var l=function(s){var r=s.split("-");var t=new Date();t.setYear(parseInt(r[0]));t.setMonth(parseInt(r[1]));if(r[2]){t.setDate(parseInt(r[2]))}else{t.setDate(1)}return t};function j(r){if(r<10){return"0"+r}return r}f.addZero=j;var i=function(u,v){var r=[];for(var t in u){if(t>0){r.push(",")}r.push(u[t].year+"-"+j(u[t].month+1)+"-"+j(u[t].day))}var s=f(v);if(s.attr("type")){s.val(r.join(""))}else{s.html(r.join(""))}return true};var n={lang:"cn",weekDays:g,months:m,target:"",divName:"#_calendar_div",mode:"single",format:h,parse:l,ok:i,recordState:false,num:1,width:250,height:260,blurBefore:null};function b(r){return((r%4==0&&r%100!=0)||(r%400)==0)}function d(w,x,r,v){var u;for(var t=0,s=v.checked.length;t<s;t++){u=v.checked[t];if(u.year==w&&u.month==x&&u.day==r){return t}}return -1}function c(t,u,r,s){var v=d(t,u,r,s);if(v>=0){s.checked.splice(v,1)}}function a(u,r,t,s){return(u-s.getFullYear())*360+(r-s.getMonth())*30+(t-s.getDate())}var q={};f.fn.calendar=function(u){var t={checked:[],records:[]};f.extend(t,n);f.extend(t,u);if(t.lang=="cn"){t.weekDays=g;t.months=m}else{t.weekDays=p;t.months=o}q[t.target]=t;f(t.target).click({target:t.target},function(y){var x=q[y.data.target];if(x){if(x.mode!="multi"){x.checked=[]}if(!x.recordState){x.records=[]}if(x.records.length<x.num){for(var w=x.records.length;w<x.num;w++){x.records.push({year:k.getFullYear(),month:k.getMonth()})}}v(x)}});function r(){var w=Math.max.apply(null,f.map(f("body > *"),function(x,y){if(f(x).css("position")=="absolute"){return parseInt(f(x).css("z-index"))||1}}));return w}function s(x){var y=x.data.target;var w=q[y];if(x.data.force||f(x.target).closest(w.divName).length==0){f(document).unbind("mouseup");f(w.divName).fadeOut()}}function v(z){var I=z.target;var B,K,J;var G=[];G.push('<div style="height:16px;text-align:right;">');if(z.mode=="multi"){G.push('<span class="calendar_opr ok"></span>')}G.push('<span class="calendar_opr close"></span></div>');for(var A=0;A<z.num;A++){B=z.records[A];K=e[B.month];if(z.month==1){if(b(B.year)){K=29}}J=new Date(B.year,B.month,1).getDay();G.push('<div style="float:left;width:',z.width,'px;">');G.push('<div style="margin:5px;">');G.push('<table class="calendar" style="border-collapse: collapse;"><tr>','<td style="text-align:left;"><span class="calendar_btn foreYear" no="',A,'"></span>','&nbsp;<span class="calendar_btn foreMonth" no="',A,'"></span></td>','<td align="center">',z.format(B.year,B.month),'</td><td style="text-align:right;"><span class="calendar_btn nextMonth" no="',A,'"></span>','&nbsp;<span class="calendar_btn nextYear" no="',A,'"></span></td>',"</tr></table>");G.push('<table class="calendar"><tr>');for(var E=0;E<7;E++){G.push("<td>",z.weekDays[E],"</td>")}G.push("</tr>");var M=1;for(var E=0;E<6&&M<=K;E++){G.push("<tr>");for(var D=0;D<7;D++){G.push("<td");if(M<=K&&(E>0||D>=J)){if(a(B.year,B.month,M,k)==0){G.push(' class="today"')}G.push(' align="center" valign="middle">');G.push('<div class="calendar_day ');if(d(B.year,B.month,M,z)>=0){G.push("selectedDay")}else{if(z.blurBefore&&(z.blurBefore instanceof Date)&&a(B.year,B.month,M,z.blurBefore)<0){G.push("blur")}else{G.push("day")}}G.push('" day="',M,'" no="',A,'">',M,"</div>");M++}else{G.push(">")}G.push("</td>")}G.push("</tr>")}G.push("</table>");G.push("</div>");G.push("</div>")}var O=f(z.divName);if(O.size()<=0){var w='<div id="'+z.divName.substr(1)+'" class="calendar_body"';if(z.zIndex){w+=' style="z-index:'+z.zIndex+'"'}w+="/>";f("body").append(w);O=f(z.divName)}O.width(z.num*z.width);O.html(G.join(""));var H=f(I);var C=H.offset();var N=C.left;var L=C.top;var F=H.height();O.css({top:(L+F+6),left:N,"z-index":r(),height:z.height+"px",width:(z.width*z.num)+"px"});O.fadeIn();f(document).mouseup({target:I},s);f("span.calendar_btn.foreYear").click({target:I},function(y){var P=parseInt(f(this).attr("no"));var x=q[y.data.target];if(x.records[P].year>1900){x.records[P].year--;v(x)}});f("span.calendar_btn.foreMonth").click({target:I},function(y){var P=parseInt(f(this).attr("no"));var x=q[y.data.target];if(x.records[P].month>0){x.records[P].month--;v(x)}else{if(x.records[P].year>1900){x.records[P].month=11;x.records[P].year--;v(x)}}});f("span.calendar_btn.nextYear").click({target:I},function(y){var P=parseInt(f(this).attr("no"));var x=q[y.data.target];if(x.records[P].year<2200){x.records[P].year++;v(x)}});f("span.calendar_btn.nextMonth").click({target:I},function(y){var x=q[y.data.target];var P=parseInt(f(this).attr("no"));if(x.records[P].month<11){x.records[P].month++;v(x)}else{if(x.records[P].year<2200){x.records[P].year++;x.records[P].month=0;v(x)}}});f("div.calendar_day.day").click({target:I},function(x){var V=f(this).attr("day");if(!V){return}V=parseInt(V);var R=parseInt(f(this).attr("no"));var U=x.data.target;var y=q[U];var T={year:y.records[R].year,month:y.records[R].month,day:V};if(y.mode=="single"){y.checked[0]=T;if(y.ok([T],U)){f(y.divName).fadeOut()}}else{if(y.mode=="multi"){y.checked.push(T);v(y)}else{y.checked.push(T);if(y.checked.length>2){y.checked.splice(1,1)}if(y.checked.length>1){var P=y.checked[0];var S=new Date(P.year,P.month,P.day);var P=y.checked[1];var Q=new Date(P.year,P.month,P.day);if(S.getTime()>Q.getTime()){y.checked[0]={year:Q.getFullYear(),month:Q.getMonth(),day:Q.getDate()};y.checked[1]={year:S.getFullYear(),month:S.getMonth(),day:S.getDate()}}if(y.ok(y.checked,U)){f(y.divName).fadeOut()}}else{v(y)}}}});f("div.calendar_day.selectedDay").click({target:I},function(P){var x=f(this).attr("day");if(!x){return}var Q=P.data.target;var y=q[Q];var R=parseInt(f(this).attr("no"));c(y.records[R].year,y.records[R].month,x,y);v(y)});f("span.calendar_opr.close").click({target:I,force:true},function(x){s(x)});f("span.calendar_opr.ok").click({target:I,force:true},function(y){var P=y.data.target;var x=q[P];x.ok(x.checked,P);s(y)})}}})(jQuery);
=======
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
>>>>>>> f221cf26f328fad480be7c5444a7faba2a9a7ab3
