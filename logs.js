$.getJSON("stats.json", function(json) {
	// Snapshots

	var div=$('<div class="stat_wrap stat_main"><div class="stat_head">Database</div></div>')
	$("#tables_main").append(div)

	for(var n in json.count)
	{
		var h=0;	// h = highest
		
		for(var q in json.count[n])
		{
			if (q > h)
			{
				h = q;
			}
		}
		
		var number = Number(json.count[n][h]);	
		var div2=$('<div class="stat"><span>'+(number.toLocaleString())+'</span><span>'+n+'</span></div>')
		div.append(div2)
	}

	for(var n in json.distinct)
	{
		var div=$('<div class="stat_wrap"><div class="stat_head">'+n+'</div></div>')
		$("#tables").append(div)
		
		for(var t in json.distinct[n])
		{
			var h=0;	// h = highest
			
			for(var q in json.distinct[n][t])
			{
				if (q > h)
				{
					h = q;
				}
			}
			
			var number = Number(json.distinct[n][t][h]);	
			var div2=$('<div class="stat"><span>'+(number.toLocaleString())+'</span><span>'+t+'</span></div>')
			div.append(div2)
		}
	}
});
