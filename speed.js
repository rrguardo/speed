$(document).ready(function(){var f=0;var e=0;var h="";var d=0;var b=[];var k=[];function p(A){var B=0;for(i=0;i<A.length;i++){B=B+A[i]}return Math.round((B/A.length)*100)/100}var a=["512.jpg","auto"];function n(){d=0;$(".progress-bar-striped").addClass("active");$("#dlspeed").removeClass("hidden");w(0)}var z=["http://us.testinternetspeed.link/",""];var y=["http://us.testinternetspeed.link/ping.html","http://de.testinternetspeed.link/ping.php"];var r=["USA","Germany"];var c=[0,0];var x=0;function g(A){f=new Date().getTime();$.ajax({type:"GET",url:y[A],success:function(C){var B="<strong>PING RESULT FOR "+r[A]+" SERVER FAILED!</strong><br>";if(C.indexOf("OK")!=-1){e=new Date().getTime();speed=(e-f)/1000;c[A]=speed;if(c[A]<c[x]){x=A}B="<h6>PING RESULT FOR <strong>"+r[A]+"</strong> TOOK <strong>"+String(speed)+"</strong> SECONDS</h6>"}$("#ping_info").append(B)},complete:function(B,C){if(A+1<y.length){g(A+1)}else{$("#ping_info").append("Ping Test Completed! Using fast server: "+r[x]);v();n()}}})}function w(A){if(A>a.length){return}f=new Date().getTime();$.ajax({cache:false,xhr:function(){var B=new window.XMLHttpRequest();B.addEventListener("progress",function(C){if(C.lengthComputable){var D=C.loaded/C.total;e=new Date().getTime();diff=(e-f)/1000;speed=(C.loaded/diff)/1024/1024*8;speed=Math.round(speed*100)/100;q(speed,true);b.push(speed)}},false);return B},contentType:false,processData:false,type:"GET",url:z[x]+a[A]+"?id="+f,success:function(B){h=B},complete:function(B,C){avg_spd=p(b);if(A+1==1&&avg_spd>1){spd_file=Math.round(avg_spd);spd_file=Math.round(spd_file/5)*5+5;if(spd_file>35){spd_file=35}a[A+1]=spd_file.toString()+".bin";w(A+1)}else{$("#dlspeed").html("<b> Download average speed: "+avg_spd+" Mb/s </b>");b=[];if(!jQuery.browser.mobile){v();t()}else{u();$("#start_test").removeClass("hidden")}c=[0,0];x=0}}})}function t(){f=new Date().getTime();speed=0;$.ajax({cache:false,xhr:function(){var A=null;if(window.ActiveXObject){A=new window.ActiveXObject("Microsoft.XMLHTTP")}else{A=new window.XMLHttpRequest()}A.upload.addEventListener("progress",function(B){if(B.lengthComputable){var C=B.loaded/B.total;e=new Date().getTime();diff=(e-f)/1000;speed=(B.loaded/diff)/1024/1024*8;speed=Math.round(speed*100)/100;q(speed,false);k.push(speed)}},false);return A},contentType:false,processData:false,type:"POST",url:z[x]+"post.php?id="+f,data:h,success:function(A){$("#ulspeed").html("<b> Upload average speed:"+p(k)+" Mb/s </b>");k=[];$("#start_test").removeClass("hidden");u()}})}$("#start_test").click(function(){$("#start_test").addClass("hidden");$("#ping_info").html("<hr><h3>Ping Info:</h3>");g(0)});function v(){document.getElementById("start_sound").play();var A=document.getElementById("run_sound");A.play();A.loop=true}function u(){var A=document.getElementById("run_sound");A.loop=false;A.pause()}var s=null;var l=null;var j=100;var o=0;var m=0;function q(B,C){chart=null;max_detected=0;change_done=false;if(C){chart=l;max_detected=o;if(B>max_detected){max_detected=B+5;o=max_detected;change_done=true}}else{chart=s;max_detected=m;if(B>max_detected){max_detected=B+5;m=max_detected;change_done=true}}if(change_done&&max_detected<j){chart.yAxis[0].setExtremes(0,Math.round(max_detected),true);chart.yAxis[0].removePlotBand("pb_1");chart.yAxis[0].removePlotBand("pb_2");chart.yAxis[0].removePlotBand("pb_3");chart.yAxis[0].addPlotBand({from:0,to:Math.round(max_detected*4/6),color:"#55BF3B",id:"pb_1"});chart.yAxis[0].addPlotBand({from:Math.round(max_detected*4/6),to:Math.round(max_detected*5/6),color:"#DDDF0D",id:"pb_2"});chart.yAxis[0].addPlotBand({from:Math.round(max_detected*5/6),to:Math.round(max_detected),color:"#DF5353",id:"pb_3"});chart.redraw()}var A=chart.series[0].points[0];A.update(B)}$("#container_download").highcharts({chart:{type:"gauge",plotBackgroundColor:null,plotBackgroundImage:null,plotBorderWidth:0,plotShadow:false},title:{text:"Download Speedometer"},pane:{startAngle:-150,endAngle:150,background:[{backgroundColor:{linearGradient:{x1:0,y1:0,x2:0,y2:1},stops:[[0,"#FFF"],[1,"#333"]]},borderWidth:0,outerRadius:"109%"},{backgroundColor:{linearGradient:{x1:0,y1:0,x2:0,y2:1},stops:[[0,"#333"],[1,"#FFF"]]},borderWidth:1,outerRadius:"107%"},{},{backgroundColor:"#DDD",borderWidth:0,outerRadius:"105%",innerRadius:"103%"}]},yAxis:{min:0,max:100,minorTickInterval:"auto",minorTickWidth:1,minorTickLength:10,minorTickPosition:"inside",minorTickColor:"#666",tickPixelInterval:30,tickWidth:2,tickPosition:"inside",tickLength:10,tickColor:"#666",labels:{step:2,rotation:"auto"},title:{text:"Mb/s"},plotBands:[{from:0,to:60,color:"#55BF3B",id:"pb_1"},{from:60,to:80,color:"#DDDF0D",id:"pb_2"},{from:80,to:100,color:"#DF5353",id:"pb_3"}]},series:[{name:"Speed",data:[0],tooltip:{valueSuffix:" Mb/s"}}]},function(A){if(!A.renderer.forExport){l=A}});$("#container_upload").highcharts({chart:{type:"gauge",plotBackgroundColor:null,plotBackgroundImage:null,plotBorderWidth:0,plotShadow:false},title:{text:"Upload Speedometer"},pane:{startAngle:-150,endAngle:150,background:[{backgroundColor:{linearGradient:{x1:0,y1:0,x2:0,y2:1},stops:[[0,"#FFF"],[1,"#333"]]},borderWidth:0,outerRadius:"109%"},{backgroundColor:{linearGradient:{x1:0,y1:0,x2:0,y2:1},stops:[[0,"#333"],[1,"#FFF"]]},borderWidth:1,outerRadius:"107%"},{},{backgroundColor:"#DDD",borderWidth:0,outerRadius:"105%",innerRadius:"103%"}]},yAxis:{min:0,max:100,minorTickInterval:"auto",minorTickWidth:1,minorTickLength:10,minorTickPosition:"inside",minorTickColor:"#666",tickPixelInterval:30,tickWidth:2,tickPosition:"inside",tickLength:10,tickColor:"#666",labels:{step:2,rotation:"auto"},title:{text:"Mb/s"},plotBands:[{from:0,to:60,color:"#55BF3B",id:"pb_1"},{from:60,to:80,color:"#DDDF0D",id:"pb_2"},{from:80,to:100,color:"#DF5353",id:"pb_3"}]},series:[{name:"Speed",data:[0],tooltip:{valueSuffix:" Mb/s"}}]},function(A){if(!A.renderer.forExport){s=A}});$("#loading").hide("slow");$("#starttest").show("slow");if(jQuery.browser.mobile){$("#container_upload").parent().hide()}});