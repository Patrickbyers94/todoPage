$(document).ready(function(e) {
var item;
var ERROR_LOG = console.error.bind(console);
$('#add-todo').button({icons: {primary: "ui-icon-circle-plus"}});
$('#new-todo').dialog({modal:true,autoOpen:false});
$('#add-todo').button({
	icon: {primary:"ui-icon-circle-plus"}}).click(
	function() {
		$('#new-todo').dialog('open');
	});

	function get_tasks(){
		console.log("Get task")
		$.ajax({
			"url": "http://localhost:8080/tasks/",
			"method": "get"
		}).then(redraw, ERROR_LOG);
	}

	function redraw(data){
		$('#todo-list').empty();
		$('#completed-list').empty();
		console.log('redrawing', data);
		data.forEach(function(item){
			var taskHTML='<li id = '+item.id+'><span class="done">%</span>';
			taskHTML +='<span class="delete">x</span>';
			taskHTML +='<span class="task"></span></li>';
			var $newTask = $(taskHTML);
			$newTask.find('.task').text(item.disc);
			if(!item.complete){
					$('#todo-list').prepend($newTask);
			}
			else{$('#completed-list').prepend($newTask);}
		})
	};

	$('#new-todo').dialog({
	modal:true,autoOpen:false,
	buttons:{
		"Add task":function(){
			var taskName=$('#task').val();
			console.log(taskName);
			if(taskName===''){return false;}
			$.ajax({
				"url": "http://localhost:8080/tasks/",
				"method": "post",
				"data": {"disc": taskName}
			})
			$(this).dialog('close');
			$('#task').val('');
			get_tasks();
		},
		"Cancel":function(){
			$(this).dialog('close');
			$('#task').val('');
		}
	}
});

$('#confirm-delete').dialog({
	modal:true,autoOpen:false,
	buttons:{
		"Confirm":function() {
			deleteItem(item.attr('id'));
			$(this).dialog('close');
			item.effect('puff',function() {$(this).remove();});
		},
		"Cancel":function(){
			$(this).dialog('close');
		}
	}
});

function deleteItem(id){
	$.ajax({
		"url": "http://localhost:8080/tasks/"+id,
		"method": "delete"
	})
}

function completeItem(id){
	$.ajax({
		"url": "http://localhost:8080/tasks/"+id,
		"method": "put"
	})
}

$('#todo-list').on('click','.done',function(){
	var $taskItem = $(this).parent('li');
	$taskItem.slideUp(250, function() {
		var $this=$(this);
		$this.detach();
		completeItem($taskItem.attr('id'));
		$this.slideDown();
		get_tasks();
	});
});

$('.sortlist').sortable({
	connectWith:'.sortlist',
	cursor:'pointer',
	placeholder:'ui-state-highlight',
	cancel:'.delete,.done'
});

$('.sortlist').on('click','.delete',function() {
	item = $(this).parent('li');
	$('#confirm-delete').dialog('open');
});
get_tasks();
}); // end ready
