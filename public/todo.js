//general elements
const input=document.querySelectorAll('.todoInput')[0];
const button=document.querySelectorAll('.button')[0];
const todoList=document.querySelectorAll('.todolistt')[0];
const dltbutton=document.querySelectorAll('.dltbutton')[0];
const date=document.querySelectorAll(".dateInput")[0];
const datelist=document.querySelectorAll(".datelist")[0];

//event listiners
button.addEventListener('click', todo)
dltbutton.addEventListener('click', remove)


//functions
function todo(eve) {

let hello=input.value;
let div=document.createElement("div");
div.classList.add("todo")
let li=document.createElement("li");
li.classList.add("to")
div.appendChild(li)
todoList.appendChild(div);
  li.innerHTML=hello;

  let datum=date.value;
  let iv=document.createElement("div");
  iv.classList.add("todo");
  let listItem=document.createElement('li');
  listItem.classList.add("to");
  div.appendChild(listItem);
  datelist.appendChild(iv);
  listItem.innerHTML=datum;

  hello=""
}
function remove(vall) {

let delee=todoList.lastElementChild;
delee.remove();
}
