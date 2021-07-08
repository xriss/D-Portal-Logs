var addchart=function(data,opts){	
		 
	var div=$('<div class="chart"><canvas></canvas></div>')
	$("#charts").append(div)
	var ctx=div.children(":first")[0].getContext("2d");

	var dl=[]
	var dv=[]
	var idx=0
	for(var n in data){
		dl[idx]=(new Date(Number(n)*8.64e7)).toLocaleDateString()
		dv[idx]=data[n]
		idx++
	}
	
	var config = {
		type: 'line',
		data: {
			labels: dl,
			datasets: [{
				label: opts.name || "Filled",
				backgroundColor: opts.color || "#f44",
				borderColor: opts.color || "#f44",
				data: dv,
				fill: true,
			}]
		},
		options: {
			responsive: true,
			title:{
				display:opts.title && true || false,
				text:opts.title || 'Chart.js Line Chart',
				fontSize:14
			},
			animation: {
				duration: 0, // general animation time
			},
			responsiveAnimationDuration: 0, // animation duration after a resize
			tooltips: {
				mode: 'index',
				intersect: false,
			},
			hover: {
				animationDuration: 0, // duration of animations when hovering an item
				mode: 'nearest',
				intersect: true
			},
			scales: {
				xAxes: [{
					display: true,
					scaleLabel: {
						display: true,
						labelString: 'Day'
					}
				}],
				yAxes: [{
					display: true,
					scaleLabel: {
						display: true,
						labelString: 'Amount'
					}
				}]
			}
		}
	};

	   return new Chart(ctx, config);
	};

	$.getJSON("stats.json", function(json) {

	// Charts

	var div=$('<div class="chart_wrap"><div class="stat_head">Database</div></div>')
	$("#charts").append(div)

	for(var n in json.count)
	{
		window["chartjs_"+n]=
			addchart(json.count[n],
				{title:"Total "+n+" table entries recorded in the database",name:n,color:"#000"});
	}


	for(var n in json.distinct)
	{
		var div=$('<div class="chart_wrap"><div class="stat_head">'+n+' table</div></div>')
		$("#charts").append(div)

	   for(var t in json.distinct[n])
		{
			window["chartjs_"+n+"_"+t]=
				addchart(json.distinct[n][t],
					{title:"Distinct "+t+" values recorded in "+n+" ",name:n+"."+t,color:"#444"});
		}

	}

});
