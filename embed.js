// Requires jQuery.

console.log("Embedded scripts running ...");

var pymParent = new pym.Parent('iframe', "https://s3-us-west-2.amazonaws.com/nationaljournal/where-they-stand/immigration/index.html", {});

resize();
$(window).resize(resize);

function resize(){
	if( $(window).width() > 1125 ){
		$("#iframe").css({
			"width": "140%",
			"margin-left": "-20%"
		});
	}
	else {
		$("#iframe").css({
			"width": "",
			"margin-left": ""
		});
	}
}
