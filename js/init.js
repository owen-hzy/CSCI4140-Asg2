// call initialization file
window.addEventListener("load", Init, false);

var dx, dy, h, w, rx, ry, th, tw, temp;
var rs = null, idle = true, change = null;

// Initialize
function Init()
{
	update();
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
	$("pe").addEventListener("mouseover", mouseOver, false);
	$("pe").addEventListener("mouseout", mouseOut, false);
	$("px").addEventListener("mouseover", mouseOver, false);
	$("px").addEventListener("mouseout", mouseOut, false);
	$("pe").addEventListener("click", edit_photo, false);
	$("px").addEventListener("click", remove_photo, false);
	
	var view = $("view");
	view.addEventListener("mousedown", mouseDown, false);
	view.addEventListener("mouseup", mouseUp, false);
	view.addEventListener("mousemove", mouseMove, false);
	document.addEventListener("mouseout", function(e){ rs = null;}, false);
	document.body.addEventListener("mouseout", function(e){
		e.stopPropagation();}, false);

	var periodic = setInterval(function()
		{
			if ($("on").checked && idle == true)
				{
					check();
				}				
		}, 3000);	
}	

function check()
{
	myLib.get({"action" : "photo_fetchall"}, function(json)
		{
			if (JSON.stringify(json) !== JSON.stringify(change))
				display(json);
			change = json;
		});
}



function mouseDown(e)
{
	e.preventDefault();
	var t = e.target;
	var dd = $("photo");
	dx = dd.offsetLeft - e.clientX;
	dy = dd.offsetTop - e.clientY;
	rx = e.clientX;
	ry = e.clientY;
	var timg = $("pic");
	h = timg.height;
	w = timg.width;
	
	if (t.id == "pic")
		{
			rs = "1";
		}
	if (t.id == "c11")
		{
			rs = "2";
			th = ry + h;
			tw = rx + w;
		}
	if (t.id == "c12")
		{
			rs = "3";
			th = ry + h;
			tw = rx + w;
		}
	if (t.id == "c13")
		{
			rs = "4";
			th = ry + h;
			tw = rx - w;
		}
	if (t.id == "c21")
		{
			rs = "5";
			tw = rx + w;
		}
	if (t.id == "c23")
		{
			rs = "6";
			tw = rx - w;
		}
	if (t.id == "c31")
		{
			rs = "7";
			th = ry - h;
			tw = rx + w;
		}
	if (t.id == "c32")
		{
			rs = "8";
			th = ry - h;
		}
	if (t.id == "c33")
		{
			rs = "9";
			th = ry - h;
			tw = rx - w;
		}
}

function mouseMove(e)
{
	var t = e.target;
	var dd = $("photo");
	var timg = $("pic");
	
	if (rs == "1")
		{
			dd.style.left = e.clientX + dx + "px";
			if (dd.offsetLeft < 0) 
				dd.style.left = "0px";
			if (dd.offsetLeft + dd.clientWidth + 30 >= window.innerWidth)
				dd.style.left = window.innerWidth - dd.clientWidth -30 + "px";
				
			dd.style.top = e.clientY + dy + "px";
			if (dd.offsetTop < 0)
				dd.style.top = "0px";
			if (dd.offsetTop + dd.clientHeight + 10 >= window.innerHeight)
				dd.style.top = window.innerHeight - dd.clientHeight - 10 + "px";
		}
	if (rs == "2")
		{
			if (e.clientX <= tw)
				{
					dd.style.left = e.clientX + dx + "px";
					timg.width = w - (e.clientX - rx);
				}
			if (e.clientY <= th)
				{
					dd.style.top = e.clientY + dy + "px";
					timg.height = h - (e.clientY - ry);
				}
		}
	if (rs == "3" && e.clientY <= th)
		{
			dd.style.top = e.clientY + dy + "px";
			timg.height = h - (e.clientY - ry);
			timg.width = w;
		}
	if (rs == "4")
		{
			if (e.clientY <= th)
			{	
				dd.style.top = e.clientY + dy + "px";
				timg.height = h - (e.clientY - ry);
			}
			if (e.clientX >= tw)
				timg.width = w + (e.clientX - rx);		
		}
	if (rs == "5" && e.clientX <= tw)
		{
			dd.style.left = e.clientX + dx + "px";
			timg.width = w - (e.clientX - rx);
			timg.height = h;
		}
	if (rs == "6" && e.clientX >= tw)
		{
			timg.width = w + (e.clientX - rx);
			timg.height = h;
		}
	if (rs == "7")
		{
			if (e.clientX <= tw)
			{	
				dd.style.left = e.clientX + dx + "px";
				timg.width = w - (e.clientX - rx);
			}
			if (e.clientY >= th)
				timg.height = h + (e.clientY - ry);
		}
	if (rs == "8" && e.clientY >= th)
		{
			timg.height = h + (e.clientY - ry);
			timg.width = w;
		}
	if (rs == "9")
		{
			if (e.clientX >= tw)
				timg.width = w + (e.clientX - rx);
			if (e.clientY >= th)
				timg.height = h + (e.clientY - ry);
		}
}

function mouseUp(e)
{
	e.preventDefault();
	e.stopPropagation();
	rs = null;
}





function disappear()
{
	var v = $("view");
	var c = $("c22");
	var img = $("pic");
	c.removeChild(img);
	v.className = "hide";
	window.removeEventListener("DOMMouseScroll", prevent, false);
	window.removeEventListener("mousewheel", prevent, false);
	idle = true;
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
	
	idle = false;
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
	else
		{
			window.alert("FileSize or FileType is not correct!");
		}		
}

function handleReaderLoadEnd(e)
{
	idle = true;
	var data = e.target.result.split(',')[1];
	var file_name = e.target.file_name;
	
	myLib.upload(data, update, file_name);
}

function display(json)
{
	console.log("display");
	var li = [], img = [];
	$("photoList").innerHTML = "";
	for (var i = 0, pic; pic = json[i]; i++)
		{
			// create li node
			li[i] = document.createElement("li");
			li[i].id = pic.name;
			
			// create img and button node
			img[i] = document.createElement("img");
			img[i].src = "data/" + pic.thumb_name;
			img[i].className = "thumbnail";
			img[i].style.zIndex = "1";
			img[i].name = pic.name;
			if (pic.description)
				img[i].title = pic.description;
			img[i].addEventListener("mouseover", mouseOver, false);
			img[i].addEventListener("mouseout", mouseOut, false);
			
			li[i].appendChild(img[i]);

			$("photoList").appendChild(li[i]);

			img[i].addEventListener("click", enlarge_photo, false);
		}
}

function update(data)
{
	$("photoList").innerHTML = "";
	myLib.get({"action" : "photo_fetchall"}, function(json)
		{
			display(json);
			change = json;
		});
}



function getPX(e)
{
	var x = 0;
	while(e)
		{
		 	x += e.offsetLeft;
		 	e = e.offsetParent;
		}
	return x;
}

function getPY(e)
{
	var y = 0;
	while(e)
		{
			y += e.offsetTop;
			e = e.offsetParent;
		}
		
	return y;
}



function mouseOver(e)
{
	e.stopPropagation();
	e.preventDefault();
	idle = false;
	var t = e.target;
	if ((t.id != "pe") && (t.id != "px"))
		{
			var pe = $("pe");
			var px = $("px");
			pe.style.left = getPX(t) + t.clientWidth - 40 + "px";
			pe.style.top = getPY(t) + "px";
			pe.style.display = "block";
			px.style.left = getPX(t) + t.clientWidth - 15 + "px";
			px.style.top = getPY(t) + "px";
			px.style.display = "block";
			t.style.border = "2px solid #3399CC";
			temp = t;
		}
	if ((t.id == "pe") || (t.id == "px"))
		{
			temp.style.border = "2px solid #3399CC";
			var pe = $("pe");
			var px = $("px");
			pe.style.display = "block";
			px.style.display = "block";
		}
}

function mouseOut(e)
{
	e.stopPropagation();
	e.preventDefault();
	if ($("pic") == null)
		idle = true;
	var t = e.target;
	if ((t.id != "pe") && (t.id != "px"))
		{
			t.style.border = "2px solid #fff";
			$("pe").style.display = "none";
			$("px").style.display = "none";
		}
	if ((t.id == "pe") || (t.id == "px"))
		{
			temp.style.border = "2px solid #fff";
			$("pe").style.display = "none";
			$("px").style.display = "none";
		}
}


function enlarge_photo(e)
{
	e.preventDefault();
	e.stopPropagation();
	$("pe").style.display = "none";
	$("px").style.display = "none";
	var name = e.target.parentNode.id;
	var c = $("c22");
	var p = $("photo");
	var v = $("view");
	var img = document.createElement("img");
	img.src = "data/" + name;
	img.style.margin = "0px 0px";
	img.id = "pic";
	img.style.margin = "0px 0px";
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
	if (! c.hasChildNodes())
		c.appendChild(img);
	
	window.addEventListener("DOMMouseScroll", prevent, false);
	window.addEventListener("mousewheel", prevent, false);
	idle = false;
}

function prevent(e)
{
	e.preventDefault();
}

function edit_photo(e)
{
	idle = false;
	var description = window.prompt("Please Enter the description for " + temp.name, "Enter description here...");
	(description != null) && myLib.post({"action" : "photo_edit", "name" : temp.name, "description" : description}, function(json)
		{
			var title = json.description.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#39;/g, "\'").replace(/&amp;/g, "&");
			temp.title = title;
			console.log("Changed the descrription of " + temp.name + " to " + title);
		});
		
	idle = true;
	return false;
}

function remove_photo(e)
{
	idle = false;
	window.confirm("Delete photo: " + temp.name + " \nConfirm?") && myLib.post({"action" : "photo_delete", "name" : temp.name}, function(json)
		{
			if (json == true)
				{
					console.log('"' + temp.name + '" is deleted successfully!');
					update();
				}
			else
			{
				console.log("Error: " + json);
			}
		});
	
	idle = true;
		
	return false;
}


