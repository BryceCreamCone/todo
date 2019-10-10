$(function() {
  let htmlString = "";
  let ulTodos = $('.todo-list')

  function taskHtml(task) {
    let checkedStatus = task.done ? "checked" : "";
    let liElement = '<li><div class="view"><input class="toggle" type="checkbox"' +
                    ' data-id="' + task.id + '"' + checkedStatus + '><label>' + 
                    task.title + '</label></div></li>';
    return liElement;
  }

  function toggleTask(e) {
    let itemId = $(e.target).data("id");

    let doneValue = Boolean($(e.target).is(':checked'));

    $.post("/tasks/" + itemId, {
      _method: "PUT",
      task: {
        done: doneValue
      }
    });
  }



  $.get("/tasks").success( function(data) {
    $.each(data, function(index, task) {
      htmlString += taskHtml(task);
    });
    ulTodos.html(htmlString);
    $('.toggle').change( toggleTask );
  });

  $('#todo-form').submit(function(event) {
    event.preventDefault();
    let newTodo = $('.new-todo')
    let payload = {
      task: {
        title: newTodo.val()
      }
    };
    $.post("/tasks", payload).success( function(data) {
      let htmlString = taskHtml(data);
      ulTodos.append(htmlString);
      $('.toggle').change( toggleTask );
      newTodo.val('');
    });
  });
});