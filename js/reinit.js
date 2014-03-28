window.addEventListener("load", reinit, false);

function reinit(e)
{
	document.body.addEventListener("click", process, false);
}

function process(e)
{
	e.preventDefault();
	var t = e.target;
	if (t.id == "yes")
		{
			myLib.post({"action" : "reinit"}, function(json)
				{
					$("info").innerHTML = "";
					console.json;
					if (json == true)
						{
							$("info").innerHTML = "Succeed! Redirect in 3 seconds!";
							setTimeout(function(){window.location.href = "./index.html";}, 3000);
						}
					else		
						$("info").innerHTML = "Failed! Try again!";
				});
		}
	else if (t.id == "no")
		{
			window.location.href = "./index.html";
		}
}

