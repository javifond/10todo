// Jquery Functions
var numberOfTasksAllowed = 10;
var maxTasksToSee = 15;
var blocked = false;
$(document).on('ready', function() {
  if(Modernizr.localstorage){
    getCurrentTasks();
    tasksFull();
    $('#addTask').on('click', addTask.bind(this));
    $('input[type="checkbox"]').on('click', removeTask.bind(this));
  }
  else{
    $('.empty').empty().text("Your browser doesn't support HTML5 features. Sorry!").show();
    $('#taskToAdd').attr('disabled', true);
    $('#addTask').attr('disabled', true);
  }
});
//Functions Declarations
function getLocalStorage(key) {
  var list = localStorage.getItem(key);
  if (!list) {
    list = [];
  } else {
    list = JSON.parse(list);
  }
  return list;
};
function checkIfTasks() {
  var list = getLocalStorage('tasksList');
  if(list.length === 0){
    $('.list').hide();
    $('ul').empty();
    $('.empty').empty().text("Well Done, You don't have pending tasks!").fadeIn("slow");
  }
};
function tasksFull() {
  var list = getLocalStorage('tasksList');
  if(list.length >= numberOfTasksAllowed){
    var options = {
      type: BootstrapDialog.TYPE_INFO,
      title: "C'mon!",
      message: "Let's focus in these 10 - ToDo first. OK?"
    };
    createDialog(options);
    $('#taskToAdd').attr('disabled', true);
    $('#addTask').attr('disabled', true);
    blocked = true;
  }
  var  checkboxes = $('input:checkbox');
  if(checkboxes.length >= maxTasksToSee){
    for (var i = 0; i < checkboxes.length; i++) {
      if($(checkboxes[i]).next().hasClass('done'))
        $(checkboxes[i]).parent().remove();
    };
  }
};
function enableAddTasks(){
  $('#taskToAdd').attr('disabled', false);
  $('#addTask').attr('disabled', false);
  blocked = false;
};
function createDialog(options){
  var dialog = new BootstrapDialog({
    type: options.type,
    title: options.title,
    message: options.message
  });
  dialog.realize();
  dialog.getModalFooter().hide();
  dialog.open();
};
function getCurrentTasks(){
  var list = getLocalStorage('tasksList');
  if(list.length > 0){
    for (var i = 0; i < list.length ; i++) {
      $( "ul" ).append("<li><input type = 'checkbox'/><span class='format'>"+list[i]+"</span></li>");
    };
    $('.list').show();
  }
  else
    $('.empty').show();
};
function addTask(){
  var task = $('#taskToAdd').val();
  if (task){
    var list = getLocalStorage('tasksList');
    list.push(task);
    localStorage.setItem("tasksList", JSON.stringify(list));
    $( "ul" ).append("<li><input type='checkbox'/><span class='format'>" + task + "</span></li>");
    $('input[type="checkbox"]').on('click', removeTask.bind(this));
    $('.list').show();
    $('.empty').hide();
    $('#taskToAdd').val("").focus();
    tasksFull();
  }
  else {
    var options = {
      type: BootstrapDialog.TYPE_DANGER,
      title: 'Ups!',
      message: 'New task field is Empty. Fill it up first!'
    };
    createDialog(options);
  }
};
function removeTask(){
  var check;
  var  checkboxes = $('input:checkbox:checked');
  var list = getLocalStorage('tasksList');
  for (var i = 0; i < checkboxes.length; i++) {
    if(!$(checkboxes[i]).next().hasClass('done'))
      check = checkboxes[i];
  };
  var value = $(check).next().text();
  var isIt = $.inArray( value, list );
  if (isIt >= 0){
    list.splice(isIt, 1);
    localStorage.setItem("tasksList", JSON.stringify(list));
    $('input:checkbox:checked').next().addClass('done');
    $('input:checkbox:checked').attr('disabled', true);
  }
  checkIfTasks();
  list = getLocalStorage('tasksList');
  if(list.length < numberOfTasksAllowed && blocked){
    enableAddTasks();
  }
};
