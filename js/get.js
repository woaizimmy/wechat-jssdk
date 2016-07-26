function $_get(name){
	var returnVal = '';
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null){
		returnVal = unescape(r[2]);
	}
	return returnVal;
}