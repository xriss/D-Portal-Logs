var pids={}

$.getJSON("pids.json", function(json) {
	pids=json.pids
	
	
	let tab=$(`<table class="spark_table"/>`)
	$(".tab_wrap").append(tab)
	
	let thead=$("<tr/>")
	tab.append(thead)
	
	thead.append("<th>History</th>")
	thead.append("<th>Activity Count</th>")
	thead.append("<th>Publisher ID</th>")
	thead.append("<th>Publisher Name</th>")

	let aa=[]
	for(let pid in pids) { pids[pid].pid=pid ; aa.push(pids[pid]) }
	aa.sort(function(a,b){return b.count-a.count})
	
	let sparkidx=0
	for(let it of aa)
	{
		sparkidx++
		let sparkname=`spark_${sparkidx}`

		let trow=$("<tr/>")
		tab.append(trow)

		trow.append(`<td id='${sparkname}' class="spark"></td>`)
		trow.append(`<td>${it.count}</td>`)
		trow.append(`<td><a href="xpath.html?pid=${it.pid}">${it.pid}</a></td>`)
		trow.append(`<td>${it.name}</td>`)
		
		$.getJSON(`pids/${it.pid}.json`,(dat,status)=>{
			
			dat=dat.xpath["/iati-activities/iati-activity/iati-identifier"].count
			
			let max=0;
			let values=[]
			for( let k of Object.keys(dat).sort() )
			{
				let v=dat[k]/1
				if(v>max){max=v}
				values.push( v )
			}

			var sparkOptions = {
				high:max,
				low:0,
				height:'32px',
				width:'256px',
				showPoint: false,
				fullWidth:true,
				chartPadding: {top: 0,right: 0,bottom: 0,left: 0},
				axisX: {showGrid: false, showLabel: false, offset: 0},
				axisY: {showGrid: false, showLabel: false, offset: 0, type: Chartist.FixedScaleAxis }
			}

			new Chartist.Line(`#${sparkname}`, {series:[values]}, sparkOptions);

		})
	}
});
