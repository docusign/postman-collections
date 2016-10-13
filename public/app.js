
function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};

$(function(){
	
	var lastEnv;

	function newEnv(name){
		var env = {
			"id": generateUUID(),
			"name": "DocuSign-" + name,
			"values": [
				{
					"key": "hostenv",
					"value": "",
					"type": "text",
					"enabled": true
				},
				{
					"key": "apiVersion",
					"value": "",
					"type": "text",
					"enabled": true
				},
				{
					"key": "clientId",
					"value": "",
					"type": "text",
					"enabled": true
				},
				{
					"key": "username",
					"value": "",
					"type": "text",
					"enabled": true
				},
				{
					"key": "password",
					"value": "",
					"type": "text",
					"enabled": true
				}
			],
			"timestamp": 1468008305072,
			"synced": false,
			"syncedFilename": "",
			"team": null,
			"isDeleted": false
		};
		return env;
	}

	// $('#env').val(JSON.stringify(env,null,2));

	$('#enter-creds').on('click', function(ev){
		var options = {
		    "name": "sampleBasicModal",
		    "content": $("script#envModal").html(),
		    onComplete: function(ev){
		    	console.log(ev);
		    	var modal = $(ev.currentTarget).closest('.modal');
		    	var form = modal.find('form');
		    	console.log(form);
		    	
		    	// console.log('s', form.serializeArray());
		    	var formArr = form.serializeArray();

		    	var envName = _.find(formArr,{name: 'hostenv'}).value.split('.')[0];
		    	var envOutput = newEnv( envName );
		    	var formObj = {};
		    	// _.map(formArr, function(i){
		    	// 	formObj[i.name] = i.value;
		    	// 	// _.find(envOutput.values,{key: i.name}).value = i.value;
		    	// });
		    	formObj.hostenv = _.find(formArr,{name: 'hostenv'}).value;
		    	formObj.apiVersion = _.find(formArr,{name: 'apiVersion'}).value;
		    	formObj.clientId = _.find(formArr,{name: 'clientId'}).value;
		    	formObj.username = _.find(formArr,{name: 'username'}).value;
		    	formObj.password = _.find(formArr,{name: 'password'}).value;

		    	console.log(formObj);
		    	console.log(envOutput);

		    	if(!_pm('env.create', 'DocuSign-' + envName, formObj)){
		    		_pm('env.replace', 'DocuSign-' + envName, formObj); 
		    	} 

		    	lastEnv = envOutput;
		    	// $('#envDownload')[0].click();
		    	$('#shownEnv').remove();
		    	$('#hiddenEnv').slideDown(750);
		    }
		};
		var inst = Olive.modal.show(options);

		ev.preventDefault();
	});

	// var obj = {a: 123, b: "4 5 6"};
	// var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
	// $('<a href="data:' + data + '" download="data.json">download JSON</a>').appendTo('#container');

	$('#envDownload').on('click', function(){
		var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(lastEnv));
		$(this).attr('href','data:' + data);
	});

});