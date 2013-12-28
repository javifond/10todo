// Jquery Functions
var numberOfTasksAllowed = 10;
var maxTasksToSee = 15;
var blocked = false;
$(document).on('ready', function() {
  if(Modernizr.localstorage){
    getCurrentTasks();
    tasksFull();
    $('#addTask').on('click', addTask.bind(this));
    $('#taskToAdd').on('keypress', isEnter.bind(this));
    $('.list li').on('click', removeTask.bind(this));
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
  var  listElements = $('.list li');
  if(listElements.length >= maxTasksToSee){
    for (var i = 0; i < listElements.length; i++) {
      if($(listElements[i]).find('i').hasClass('fa-check-square-o'))
        $(listElements[i]).remove();
    };
  }
};
function isEnter() {
if ( event.which == 13 ) {
     $('#addTask').click();
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
      $( "ul" ).append("<li><i class='fa fa-square-o'></i><span class='format'>"+list[i]+"</span></li>");
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
    $( "ul" ).append("<li><i class='fa fa-square-o'></i><span class='format'>" + task + "</span></li>");
    $('.list li').on('click', removeTask.bind(this));
    $('.list').show();
    $('.empty').hide();
    $('#taskToAdd').val("");
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
  var element = event.target;
  var span = $(element).parent().find("span");
  var icon = $(element).parent().find("i");
  var list = getLocalStorage('tasksList');
  var isIt = $.inArray( span.text(), list );
  if (isIt >= 0){
    list.splice(isIt, 1);
    localStorage.setItem("tasksList", JSON.stringify(list));
    span.addClass('done');
    icon.removeClass('fa-square-o').addClass('fa-check-square-o');
    $(element).off();
  }
  checkIfTasks();
  list = getLocalStorage('tasksList');
  if(list.length < numberOfTasksAllowed && blocked){
    enableAddTasks();
  }
};
