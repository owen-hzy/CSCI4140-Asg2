// Define some helper method
function $(id)
{
	return document.getElementById(id);
}

function Output(msg)
{
	var m = $("messages");
	m.innerHTML = msg + m.innerHTML;
}



// call initialization file
if (window.File && window.FileList && window.FileReader)
{
	Init();
}

// XMLHTTPRequest 
function new_request()
{
	var _factories = [
	                  function(){return new XMLHttpRequest();}, 
	                  function(){return new ActiveXObject("Msxml12.XMLHTTP");},
	                  function(){return new ActiveXObject("Microsoft.XMLHTTP");}];
	
	for (var i = 0; i<_factories.length; i++)
		{
			try
			{	
				var factory = _factories[i];
				var r = factory();
				if (r != null)
					{
						return r;
					}
			}
			catch(e)
			{
				continue;
			}
		}
		return null;
}

// Initialize
function Init()
{
	var filedrag = $("filedrag");
	
	var xhr = new_request();
	if (xhr.upload)
		{
			filedrag.addEventListener("dragover", FileDragHover, false);
			filedrag.addEventListener("dragleave", FileDragHover, false);
			filedrag.addEventListener("drop", FileSelectHandler, false);
			filedrag.style.display = "block";
		}
}

// file drag hover
function FileDragHover(e)
{
	e.stopPropagation();
	e.preventDefault();
	e.target.className = (e.type == "dragover" ? "hover" : "");
}

// file selection
function FileSelectHandler(e)
{
	// cancel event and hover style
	FileDragHover(e);
	
	// fetch FileList object
	var file = e.dataTransfer.files[0];
	
	if ((file.type == "image/jpeg" || file.type == "image/gif" || file.type == "image/png") &&
			file.size <= $("MAX_FILE_SIZE").value)
		{
			var reader = new FileReader();
			// init the reader event handlers
			reader.onloadend = handleReaderLoadEnd;
			// begin the read operation
			reader.readAsDataURL(file);
			reader.file_name = file.name;
		}
	
	if (file.size > $("MAX_FILE_SIZE").value)
		{
			window.alert(file.name + " is too large! File size should be less than " + $("MAX_FILE_SIZE").value + " bytes.");
		}
		
}

function handleReaderLoadEnd(e)
{
	var data = e.target.result.split(',')[1];
	var file_name = e.target.file_name;
	var xhr = new_request();
	if (xhr.upload)
		{
			xhr.open("POST", "upload.php", true);
			xhr.setRequestHeader("FILE_NAME", file_name);
			xhr.send(data);
		}
	
	xhr.upload.addEventListener("progress", function(e)
		{
			var percent = parseInt((e.loaded/e.total) * 100);
			$("filedrag").style.backgroundSize = percent + "% auto";
			$("filedrag").innerHTML = percent + "%";
		},
		false);
	
}

