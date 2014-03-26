// To add a global function $ as a shorcut to getElementById
window.$ = function(id)
{
	return document.getElementById(id);
};

(function()
{
	var myLib = window.myLib = (window.myLib || {});
	
	// #############################################
	//			PRIVATE FUNCTIONS of myLib
	// #############################################
	
	// To generate GET parameters based on properties of an object
	var encodeParam = function(obj)
	{
		var data = [];
		for (var key in obj)
			{
				data.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
			}
		return data.join('&');			
	};
	
	// #############################################
	//			PUBLIC FUNCTIONS of myLib
	// #############################################
	
	myLib.ajax = function(opt)
	{
		opt = opt || {};
		var xhr = (window.XMLHttpRequest)
					? new XMLHttpRequest()
					: new ActiveXObject("Microsoft.XMLHTTP"),
			async = opt.async !== false,
			success = opt.success || null,
			error = opt.error || function(){ alert('AJAX Error: ' + this.status)};
			
		// pass three parameters to xhr.open
		xhr.open(opt.method || 'GET', opt.url || '', async);
		
		if (opt.method == "POST")
			{
				xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");
			}
		if (opt.upload == "TRUE" && opt.filename)
			{
				xhr.setRequestHeader("FILE_NAME", opt.filename);
			}
		
		// Asynchronous call requires a callback function listening on readystatechange
		if (async)
			xhr.onreadystatechange = function()
			{
				var status = xhr.status, response = xhr.responseText;
				if (status == 200 || status == 304)
					{
						success && success.call(xhr, response);
					}
				else if (status >= 500)
					error.call(xhr);
			}
		if (xhr.upload && opt.upload && opt.upload == "TRUE")
			{
				xhr.upload.addEventListener("progress", function(e)
						{
						var percent = parseInt((e.loaded/e.total) * 100);
						$("filedrag").style.backgroundSize = percent + "% auto";
						$("filedrag").innerHTML = percent + "%";
						},
						false);
			
				xhr.upload.addEventListener("load", function(e)
						{	
						$("filedrag").style.backgroundSize = "0% auto";
						$("filedrag").innerHTML = "Drag Files Here";
						},
						false);
			
				xhr.upload.addEventListener("error", function(e)
						{
						$("filedrag").style.backgroundSize = "0% auto";
						$("filedrag").innerHTML = "Drag Files Here";
						window.alert("Error Occured While Uploading: " + e.Message);
						},
						false);	
			}
			
		xhr.addEventListener("error", function(){error.call(xhr);}, false);
			
		xhr.send(opt.data || null);
		
		// Synchronous Call blocks UI and returns result immediately after xhr.send
		!async && callback && callback.call(xhr, xhr.responseText);
			
	};
	

	myLib.processJSON = function(url, param, successCallback, opt)
	{
		opt = opt || {};
		opt.url = url || "process.php";
		opt.method = opt.method || 'GET';
		if (param  && opt.upload && opt.upload == "TRUE")
			{
				opt.data = param;
				opt.url = "process.php?action=upload";
			}
				
		else if (param)
			opt.data = encodeParam(param);
		opt.success = function(json)
		{
			json = JSON.parse(json);
			if (json.success)
				successCallback && successCallback.call(this, json.success);
			else
				alert('Error: ' + json.failed);
		};
		myLib.ajax(opt);
	};
	

	myLib.get = function(param, successCallback)
	{
		param = param || {};
		param.rnd = new Date().getTime(); // to avoid caching 
		myLib.processJSON("process.php?rnd=" + encodeParam(param), null, successCallback);
	};
	
	myLib.upload = function(param, successCallback, filename)
	{
		var opt = {
				"method" : "POST",
				"upload" : "TRUE",
				"filename" : filename
		};
		
		myLib.processJSON('process.php?rnd=' + new Date().getTime(), param, successCallback, opt);
	};
	
	myLib.post = function(param, successCallback)
	{
		myLib.processJSON('process.php?rnd=' + new Date().getTime(), param, successCallback, {"method" : "POST"});
	}
	
	
	
	
	
})();
