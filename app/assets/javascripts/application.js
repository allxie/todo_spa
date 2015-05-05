// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .

$(function () {

	//grab the "todos-con" from the view
	var $todosCon = $("#todos-con");

	//grabbing the json data of all the todos
	$.get("/todos.json")
		.done(function (todos) {
			console.log("All Todos:", todos);

			//append each todo to the page
			todos.forEach(function (todo) {
				var completed = todo.completed ? "todo-completed" : "";
				var checked = todo.completed ? "checked" : "";
				var $todo = $("<div class=\"todo\" data-id=" + todo.id + ">" + todo.content + 
                  "<input type=\"checkbox\" class=\"completed\">" + "<button class=\"delete\">Delete</button></div>");
				$todo.find(".completed").attr("checked", todo.completed)
				$todosCon.append($todo);	
			});

	});

		//grabbing the new todo form
	var $todoForm = $("#new_todo");

	//when you click the submit button...
	$todoForm.on("submit", function (event) {
		//so that the page doesn't reload onclick
		event.preventDefault();
		console.log($(this).serialize());
		//grab the value of the form
		var content = $("#todo_content").val();
		// ??
		$.post("/todos.json", {
			todo: {
				content: content
			}
		}).done(function (createdTodo) {

			//then put it at the bottom of the list on the page
			var $todo = $("<div class=\"todo\" data-id=" + createdTodo.id + ">" + createdTodo.content + 
                  "<input type=\"checkbox\" class=\"completed\">" + "<button class=\"delete\">Delete</button></div>");
			$todo.find(".completed").attr("checked", createdTodo.completed)
			if (createdTodo.completed) {
				$todo.toggleClass("todo-completed");
			}
			$todosCon.append($todo);

		});
	});

  // setup a click handler that only
  //  handle clicks from an element
  //  with the `.delete` className
  //  that is inside the $todosCon
	$todosCon.on("click", ".delete", function (event) {
		// alert("I was clicked!");
			//grabs the entire todo
			var $todo = $(this).closest(".todo");
			//send our delete request
			$.ajax({
				//grab the data-id attribute
	    url: "/todos/" + $todo.data("id") + ".json",
	    type: "DELETE"
	  }).done(function () {
	    $todo.remove();
	  });
	});

	$todosCon.on("click", ".completed", function (){

		var $todo = $(this).closest(".todo");

		$.ajax({
			url: "/todos/" + $todo.data("id") + ".json",
			type: "PATCH",
			data: {
				todo: {
					completed: this.checked
				}
			}
		}).done(function (data) {
			$todo.toggleClass("todo-completed");
		});
	});


});