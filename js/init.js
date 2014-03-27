// call initialization file
if (window.File && window.FileList && window.FileReader)
{
	Init();
}

// Initialize
function Init()
{
	var filedrag = $("filedrag");
	
	var xhr = (window.XMLHttpRequest)
			? new XMLHttpRequest()
			: new ActiveXObject("Microsoft.XMLHTTP");
	if (xhr.upload)
		{
			filedrag.addEventListener("dragover", FileDragHover, false);
			filedrag.addEventListener("dragleave", FileDragHover, false);
			filedrag.addEventListener("drop", FileSelectHandler, false);
			filedrag.style.display = "block";
		}
	$("mask").addEventListener("click", disappear, false);
}

function disappear()
{
	var v = $("view");
	var c = $("c22");
	var img = $("pic");
	c.removeChild(img);
	v.className = "hide";
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

	myLib.upload(data, update, file_name);
}

function update(data)
{
	$("photoList").innerHTML = "";
	myLib.get({"action" : "photo_fetchall"}, function(json)
		{
			var li = [], img = [], edit = [], remove = [];
			for (var i = 0, pic; pic = json[i]; i++)
				{
					// create li node
					li[i] = document.createElement("li");
					li[i].id = pic.name;
					
					// create img and button node
					img[i] = document.createElement("img");
					img[i].src = "data/" + pic.thumb_name;
					if (pic.description)
						img[i].title = pic.description;
					
					edit[i] = document.createElement("span");
					edit[i].innerHTML = "E";
					edit[i].className = "edit";
					
					remove[i] = document.createElement("span");
					remove[i].innerHTML = "X";
					remove[i].className = "delete";
					
					li[i].appendChild(img[i]);
					li[i].appendChild(edit[i]);
					li[i].appendChild(remove[i]);

					$("photoList").appendChild(li[i]);

					img[i].addEventListener("click", enlarge_photo, false);
					edit[i].addEventListener("click", edit_photo, false);
					remove[i].addEventListener("click", remove_photo, false);
				}
		});
}
update();

function enlarge_photo(e)
{
	var name = e.target.parentNode.id;
	var c = $("c22");
	var p = $("photo");
	var v = $("view");
	var img = document.createElement("img");
	img.src = "data/" + name;
	img.style.margin = "0px 0px;";
	img.id = "pic";
	img.addEventListener("load", function()
		{
			img.width = window.innerWidth * 0.6;
			img.height = window.innerHeight * 0.5;
			var w_t = ((window.innerWidth)/2) - (img.width)/2;
			var h_t = ((window.innerHeight) / 2) - (img.height)/2;
			p.style.top = h_t + "px";
			p.style.left = w_t + "px";
			v.className = "";
		},
		false);
	c.appendChild(img);
	
}

function edit_photo(e)
{
	var id = e.target.parentNode.id;
	var description = window.prompt("Please Enter the description for " + id);
	(description != null) && myLib.post({"action" : "photo_edit", "name" : id, "description" : description}, function(json)
		{
			$(id).getElementsByTagName("img")[0].title = json.description;
			console.log("Changed the descrription of " + id + " to " + json.description);
		});
		
	return false;
}

function remove_photo(e)
{
	var id = e.target.parentNode.id;
	window.confirm("Delete photo: " + id + " \nConfirm?") && myLib.post({"action" : "photo_delete", "name" : id}, function(json)
		{
			if (json == true)
				{
					console.log('"' + id + '" is deleted successfully!');
					update();
				}
			else
			{
				console.log("Error: " + json);
			}
		});
		
	return false;
}

/* function drag(target, event)
{
	var startX = event.clientX;
	var startY = event.clientY;
	var origX = target.offsetLeft;
	var origY = target.offsetTop;
	var deltaX = startX - origX;
	var deltaY = startY - origY;
	
	target.addEventListener("mousemove", moveHandler, false);
	target.addEventListener("mouseup", upHandler, false);
	
	event.stopPropagation();
	event.preventDefault();

	function moveHandler(e)
	{
		if (!e) 
			e = window.event;
		target.style.left = (e.clientX - deltaX) + "px";
		target.style.top = (e.clientY - deltaX) + "px";
		e.stopPropagation();
	}

	function upHandler(e)
	{
		if (!e)
			e = window.event;
		target.removeEventListener("mouseup", upHandler, false);
		target.removeEventListener("mousemove", moveHandler, false);
	}
}
*/


