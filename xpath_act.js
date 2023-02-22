// goto hash
var goto_hash=function()
{
	if( window.location.hash=="" || window.location.hash=="#" ) // default
	{
		window.location.hash="#/iati-activities/iati-activity/iati-identifier"
	}
	
	let s=window.location.hash
	
	let e=document.getElementById( s.substring(1) )
	if(e){ e.scrollIntoView(true) }
//	window.scrollBy(0,-50)
}

// parrams
var queryed = {};
if (location.search) location.search.substr(1).split("&").forEach(function(item) {
	var s = item.split("=")
	var k = s[0]
	var v = s[1] && decodeURIComponent(s[1]);
	queryed[k]=v
})

		var stats		
		{
			$.getJSON("stats.json", function(json) {
				stats=json
				$(()=>{
					insert_page()
					goto_hash()
					lazy_load()
				})
			})
		}

window.lazyFunctions={}
var lazy_load=function()
{
	function executeLazyFunction(element) {
	  var lazyFunctionName = element.getAttribute("data-lazy-function");
	  var lazyFunction = window.lazyFunctions[lazyFunctionName];
	  if (!lazyFunction) return;
	  lazyFunction(element);
	}

	var ll = new LazyLoad({
	  unobserve_entered: true, // <- Avoid executing the function multiple times
	  callback_enter: executeLazyFunction // Assigning the function defined above
	});
}

var insert_page=function()
{
	let chartidx=0
	
	let latest=0

//	console.log( Object.keys(stats.xpath).length + " xpaths stats found " )

	for(let path of Object.keys(stats.xpath).sort() )
	{
		let pdat=stats.xpath[path]
		
		if(path.startsWith("/iati-organisations"))
		{
			continue
		}

//		console.log(path)
		
		let it=$("<div class='element_wrap'/>")
		$("#tables").append(it)
		
		let pathlink="http://reference.iatistandard.org/203/activity-standard"+(path.split("@")[0])
		
		it.append(`
		<div class="element_data_wrap">
			<div class="element_link_wrap" id="${path}">
				<a class="element" href="#${path}">${path}</a>
				<a class="element_iati" target="_blank" href="${pathlink}">See this element on IATI Standard</a>
			</div>
		</div>
		`)

// check some data exists
		let max_count=0
		if(pdat.count)
		{
			for(let n in pdat.count )
			{
				let count=pdat.count[n]
				if(count>max_count){max_count=count}
			}
		}
		if( max_count == 0 )
		{
			it.append(`<div>No data published.</div>`)
		}
		else
		{
			let wap=$(`<div class="element_data_wrap"/>`)
			it.append(wap)
			
			let tab=$(`<table class="tab_xpath"/>`)
			wap.append(tab)
			
			let thead=$("<tr/>")
			tab.append(thead)
			
			thead.append("<th class='rank' title='Top 10 ranking'>Rank</th>")
			thead.append("<th class='count' title='Number of times element is used'>Count</th>")
			thead.append("<th class='val'>Value</th>")
			if(!queryed.pid)
			{
				thead.append("<th class='pub'>Example Publisher</th>")
			}
			thead.append("<th class='act'>Example Activity</th>")
			
			for(let idx=0;idx<pdat.top.length;idx++)
			{
				let v=pdat.top[idx]
				let trow=$("<tr/>")
				tab.append(trow)

				trow.append("<td>"+(idx+1)+"</td>")
				trow.append("<td>"+v.count+"</td>")
				trow.append("<td>"+v.value+"</td>")
				
				if(!queryed.pid)
				{
					if(v.pid)
					{
						let url="http://d-portal.org/ctrack.html?publisher="+v.pid+"#view=main"
						trow.append(`<td><a target="_blank" href="${url}">${v.pid}</a></td>`)
					}
					else
					{
						trow.append(`<td></td>`)
					}
				}

				if(v.aid)
				{
					url="http://d-portal.org/ctrack.html#view=act&aid="+v.aid
					trow.append(`<td><a target="_blank" href="${url}">${v.aid}</a></td>`)
				}
				else
				{
					trow.append(`<td></td>`)
				}
			}
	   
			let cnames=["count","activities","publishers","distinct"]

			for(let cname of cnames)
			{
				if(!pdat[cname]) { continue } // publishers have one less graph

				chartidx++

				let data=[]
				
				let clast
				for(let n of Object.keys(pdat[cname]).sort() )
				{
					let v=pdat[cname][n]
					let d=parseInt(n)
					if(d>latest){latest=d} // remember latest date we have seen
					data.push( {x: new Date(d*8.64e+7), y: v} )
					clast=v
				}

				let cdiv=$(`<div class="graph_wrap"/>`)
				it.append(cdiv)
				let cval=(clast/1).toLocaleString("en", { useGrouping: true })
				cdiv.append(`<div class="graph_head">${cname} = ${cval}</div>`)
				cdiv.append(`<div id="chart${chartidx}" class="graph lazy" data-lazy-function="${chartidx}" />`)

				let confs={
					axisX: {
					type: Chartist.FixedScaleAxis,
					divisor: 5,
					labelInterpolationFnc: function(value) {
						return moment(value).format('YYYY MMM D');
						}
					},
					plugins: [
						Chartist.plugins.tooltip({
							transformTooltipTextFnc:(it)=>{
								let aa=it.split(",")
								return moment(aa[0]/1).format('YYYY MMM D')+" : "+
								(aa[1]/1).toLocaleString("en", { useGrouping: true })
							}
						})
					],
  				}
				let datas={
				  series: [
					{
						data:data
					}
				  ]
				}

				let lazyidx=chartidx
				window.lazyFunctions[lazyidx]=function()
				{
//					console.log("Lazy loaded #chart"+lazyidx)
					let chart=new Chartist.Line( "#chart"+lazyidx, datas , confs );
				}
			}
		}
	}


	
	let idx=0
	for( let group of ["/iati-activities/iati-activity"] )
	{
		idx++
		
		let it=$(`<div id='percentage${idx}' class='percent'/>`)
		$("#tables").append(it)

		it.append(`<div class="percent_head">Percentage of <span class="span_element">Activity</span> elements</div>`)

		let tab=$(`<table class="tab_xpath"/>`)
		it.append(tab)
		
		let thead=$("<tr/>")
		tab.append(thead)
		
		thead.append("<th class='xpath'>Xpath</th>")
		thead.append("<th class='pop'>Popularity</th>")


		let atotal=0
		let a=[]
		for(let path of Object.keys(stats.xpath).sort() )
		{
			if(path.startsWith(group))
			{
				let p=stats.xpath[path]
				let count=parseInt(p.activities[latest])
				if(path.startsWith("/iati-organisations")) // org files
				{
					count=parseInt(p.publishers[latest])
				}
				if(atotal<count){atotal=count} // highest
				a.push({path:path,count:count})
			}
		}
		for(let v of a) // convert to 00.00 pct
		{
			v.pct=Math.ceil(10000*(v.count/atotal))/100
		}
		a.sort( function(a,b){ return a.pct<b.pct ? 1 : -1 } )
		
		for(let t of a)
		{
			let trow=$("<tr/>")
			tab.append(trow)

			trow.append(`<td><a href="#${t.path}">${t.path}</a></td>`)
			trow.append(`<td>${t.pct}%</td>`)
		}
		
	}

}

