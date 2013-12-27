// Jquery Functions
var numberOfTasksAllowed = 10;
var maxTasksToSee = 15;
var blocked = false;
$(document).on('ready', function() {
  if(Modernizr.localstorage){
    if(mobilecheck()){
      $('nav.border10').css('zoom', '1.8');
      $('div.todo').css('zoom', '1.8');
      $('footer').css('zoom', '1.4');
    }
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
// from http://stackoverflow.com/a/11381730/989439
  function mobilecheck() {
    var check = false;
    (function(a){if(/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};
