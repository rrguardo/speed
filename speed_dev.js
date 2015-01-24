
$(document).ready(function() {
            //TestDownload();
            
        var start = 0;
        var end = 0;
        var binfile = '';
        var sum = 0;
        var download_records = [];
        var upload_records = [];

			function calc_average(records) {
				var sum = 0;
				for (i = 0; i < records.length; i++) {
    				sum = sum + records[i];
				}
				return Math.round((sum/records.length)*100)/100;
			}      
        
        var sources = ['256.jpg',
        					  '256.jpg',
        					  '512.jpg'
        					 ];

		 function Start() {

		 	sum = 0;
		 	$('.progress-bar-striped').addClass('active');
		 	$('#dlspeed').removeClass('hidden');
		 	TestDownloadNew(0);
		 }

		var host_maps = [ "http://us.testinternetspeed.link/",
							   ""
							 ];
		var ping_sources = ["http://us.testinternetspeed.link/ping.html",
								  "http://de.testinternetspeed.link/ping.php"
								 ];
		var server_loc = ['USA', 'Germany'];
		var ping_result = [0,0];
		var max_pos = 0;
		
		function PingTest(pos) {
						
		            start = new Date().getTime();
		            
		            $.ajax({
		                type: "GET",
		                url: ping_sources[pos],                
 
		                success: function(msg) {

								  var msg_r = "<strong>PING RESULT FOR "+server_loc[pos]+" SERVER FAILED!</strong><br>";
		                   
		                    if(msg.indexOf("OK")!=-1)
		                    {
		                    		end = new Date().getTime();
		                    		speed = (end - start) / 1000;
		                    		ping_result[pos] = speed;
		                    		if (ping_result[pos]<ping_result[max_pos]) {
		                    			max_pos = pos;
		                    		}
		                    		msg_r = "<h6>PING RESULT FOR <strong>"+server_loc[pos]+"</strong> TOOK <strong>"+String(speed)+"</strong> SECONDS</h6>";	
		                    }
		                    
		                    $('#ping_info').append(msg_r);
		                },
		                complete: function(xhr, textStatus) {
		                    
		                    if ( pos+1 < ping_sources.length  ) {
		                    		PingTest(pos+1);
		                    }else {
		                    		
		                    		$('#ping_info').append("Ping Test Completed! Using fast server: "+server_loc[max_pos]);
		                    		play_init();
		                    		Start();      		
		                    }

		                }
		            });
		        }        



		
		function TestDownloadNew(pos) {
		
						if (pos>sources.length) {
							return;
						}
						
		            start = new Date().getTime();
		            
		            $.ajax({

							  //PROGRESS INFO ++++
							  cache: false,
							  xhr: function()
							  {
							    var xhr = new window.XMLHttpRequest();
							    //Download progress
							    xhr.addEventListener("progress", function(evt){
							      if (evt.lengthComputable) {
							        var percentComplete = evt.loaded / evt.total;
							        //Do something with download progress
					              end = new Date().getTime();
		                       diff = (end - start) / 1000;
		                    	  speed = (evt.loaded / diff) / 1024 / 1024 * 8;
		                       speed = Math.round(speed*100)/100;
									  update_chart(speed, true);
							        download_records.push(speed); 
							      }
							    }, false);
							    return xhr;
							  },
							  contentType: false,
							  processData: false,
							  //PROGRESS INFO ----	            
		            
		            
		                type: "GET",
		                url: host_maps[max_pos] + sources[pos] + "?id=" + start,
		                success: function(msg) {
		                    binfile = msg;
		                },
		                complete: function(xhr, textStatus) {
		                    
		                    if ( pos+1 < sources.length  ) {
		                    		TestDownloadNew(pos+1);
		                    }else {
		                    		
		 								$('#dlspeed').html('<b> Download average speed: ' + calc_average(download_records) + ' Mb/s </b>');
		 								download_records = [];		   					   							
		   							play_init();
		   							TestUpload();
		   							
		   							ping_result = [0,0];
										max_pos = 0;
		                    }

		                }
		            });
		        }        

        
        function TestUpload() {
            start = new Date().getTime();
				speed = 0;            
            $.ajax({

					  //PROGRESS INFO ++++
					  cache: false,
					  xhr: function()
					  {
					    var xhr = new window.XMLHttpRequest();
					    //Upload progress
					    xhr.upload.addEventListener("progress", function(evt){
					      if (evt.lengthComputable) {
					        var percentComplete = evt.loaded / evt.total;
					        //Do something with download progress
			              end = new Date().getTime();
                       diff = (end - start) / 1000;         
                    	  speed = (evt.loaded / diff) / 1024 / 1024 * 8;
                       speed = Math.round(speed*100)/100;
							  update_chart(speed, false);
							  upload_records.push(speed);
					      }
					    }, false);
					    return xhr;
					  },
					  contentType: false,
					  processData: false,
					  //PROGRESS INFO ----

                type: "POST",
                url: host_maps[max_pos] + "post.php?id=" + start,
                data: binfile,
                success: function(msg) {

                    $('#ulspeed').html('<b> Upload average speed:' + calc_average(upload_records) + ' Mb/s </b>');
                    upload_records = [];
						  $('#start_test').removeClass('hidden');
                    play_stop();
                }
            });
        }
        
            $('#start_test').click(
					function () {
						$('#start_test').addClass('hidden');						
						$("#ping_info").html("<hr><h3>Ping Info:</h3>");
						PingTest(0);
						//Start();	
					});


function play_init() {
		
		document.getElementById('start_sound').play();
		
		var sound_r = document.getElementById('run_sound');
		sound_r.play();
		sound_r.loop = true;
	}
	
function play_stop() {
		var sound_r = document.getElementById('run_sound');
		sound_r.loop = false;
		sound_r.pause();
	}


var chart_upload = null;
var chart_download = null;
var max_sp = 100;

var max_detected_download = 0;
var max_detected_upload = 0;

function update_chart(newVal, is_download) {

	chart = null;
	max_detected = 0;
	change_done = false;
	
	if(is_download){
		chart = chart_download;
		max_detected = max_detected_download;
		if(newVal>max_detected){
			max_detected = newVal + 5;
			max_detected_download = max_detected;
			change_done = true;
		}
	}else{
		chart = chart_upload;
		max_detected = max_detected_upload;
		if(newVal>max_detected){
			max_detected = newVal + 5;
			max_detected_upload = max_detected;
			change_done = true;
		}
	}

   if( change_done && max_detected < max_sp){
   	chart.yAxis[0].setExtremes(0, Math.round(max_detected), true);
   	
	}

	var point = chart.series[0].points[0];
   point.update(newVal);


}




//DOWLOAD CHART
    $('#container_download').highcharts({

        chart: {
            type: 'gauge',
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: false
        },

        title: {
            text: 'Download Speedometer'
        },

        pane: {
            startAngle: -150,
            endAngle: 150,
            background: [{
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#FFF'],
                        [1, '#333']
                    ]
                },
                borderWidth: 0,
                outerRadius: '109%'
            }, {
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#333'],
                        [1, '#FFF']
                    ]
                },
                borderWidth: 1,
                outerRadius: '107%'
            }, {
                // default background
            }, {
                backgroundColor: '#DDD',
                borderWidth: 0,
                outerRadius: '105%',
                innerRadius: '103%'
            }]
        },

        // the value axis
        yAxis: {
            min: 0,
            max: 100,

            minorTickInterval: 'auto',
            minorTickWidth: 1,
            minorTickLength: 10,
            minorTickPosition: 'inside',
            minorTickColor: '#666',

            tickPixelInterval: 30,
            tickWidth: 2,
            tickPosition: 'inside',
            tickLength: 10,
            tickColor: '#666',
            labels: {
                step: 2,
                rotation: 'auto'
            },
            title: {
                text: 'Mb/s'
            },
            plotBands: [{
                from: 0,
                to: 75,
                color: '#55BF3B' // green
            }, {
                from: 75,
                to: 100,
                color: '#DDDF0D' // yellow
            }]
        },

        series: [{
            name: 'Speed',
            data: [0],
            tooltip: {
                valueSuffix: ' Mb/s'
            }
        }]

    },
        // Add some life
        function (chart) {
            if (!chart.renderer.forExport) {
					chart_download = chart;
            }
        });


//UPLOAD CHART
    $('#container_upload').highcharts({

        chart: {
            type: 'gauge',
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: false
        },

        title: {
            text: 'Upload Speedometer'
        },

        pane: {
            startAngle: -150,
            endAngle: 150,
            background: [{
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#FFF'],
                        [1, '#333']
                    ]
                },
                borderWidth: 0,
                outerRadius: '109%'
            }, {
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#333'],
                        [1, '#FFF']
                    ]
                },
                borderWidth: 1,
                outerRadius: '107%'
            }, {
                // default background
            }, {
                backgroundColor: '#DDD',
                borderWidth: 0,
                outerRadius: '105%',
                innerRadius: '103%'
            }]
        },

        // the value axis
        yAxis: {
            min: 0,
            max: 100,

            minorTickInterval: 'auto',
            minorTickWidth: 1,
            minorTickLength: 10,
            minorTickPosition: 'inside',
            minorTickColor: '#666',

            tickPixelInterval: 30,
            tickWidth: 2,
            tickPosition: 'inside',
            tickLength: 10,
            tickColor: '#666',
            labels: {
                step: 2,
                rotation: 'auto'
            },
            title: {
                text: 'Mb/s'
            },
            plotBands: [{
                from: 0,
                to: 75,
                color: '#55BF3B' // green
            }, {
                from: 75,
                to: 100,
                color: '#DDDF0D' // yellow
            }]
        },

        series: [{
            name: 'Speed',
            data: [0],
            tooltip: {
                valueSuffix: ' Mb/s'
            }
        }]

    },
        // Add some life
        function (chart) {
            if (!chart.renderer.forExport) {
					chart_upload = chart;
            }
        });

$("#loading").hide("slow");
$("#starttest").show("slow");

}); //Main Jquery
