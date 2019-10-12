$(function() {
  var htmlString = "";
  let ulTodos = $('.todo-list')

  function taskHtml(task) {
    let checkedStatus = task.done ? "checked" : "";
    let liClass = task.done ? "completed" : "";
    let liElement = 
      `<li data-id="${task.id}" class="${liClass}">
          <div class="view">
            <input class="toggle" type="checkbox" data-id="${task.id}" ${checkedStatus}>
              <label>${task.title}<button class="destroy"></button>
              </label>
            </input>
          </div>
       </li>`;
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
    }).success( function(data) {
      let liHtml = taskHtml(data);
      let $li = $('li[data-id="' + data.id + '"]');
      $li.replaceWith(liHtml);
      $('.toggle').change(toggleTask);
    });
  }

  function destroyTask() {
    let item = this.parentNode.offsetParent;
    item.parentNode.removeChild(item)
    $.ajax({
      type: "DELETE",
      url: "/tasks/" + item.dataset.id,
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

  $(document).on('click', '.destroy', destroyTask);
});