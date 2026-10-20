let day=document.getElementById('lecture-day')
let starttim=document.getElementById('lecture-start')
let endtim=document.getElementById('lecture-end')
let clas=document.getElementById('lecture-room')
let metaril=document.getElementById('lecture-subject')
let btnsave=document.getElementById('save-lecture-btn')
let addlecture=document.getElementById('add-lecture-btn')


// الفورم نفسه
const taskForm = document.getElementById('task-form');

// حقول الإدخال
const taskTitleInput = document.getElementById('task-title');
const taskDateInput = document.getElementById('task-date');
const taskTimeInput = document.getElementById('task-time');

// القوائم المنسدلة
const taskPrioritySelect = document.getElementById('task-priority');
const taskCategorySelect = document.getElementById('task-category');

// زر الإضافة
const addTaskButton = document.getElementById('add-task-btn');

// جديد: دالة تحمي الصفحة من الأكواد الخبيثة في النصوص
function esc(s){
  return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

let databases;
if(localStorage.getItem('databases')!=null){
databases=JSON.parse(localStorage.getItem('databases'))
}else{
    databases=[];
}
btnsave.onclick=function(){
// جديد: تحقق من المحاضرة
if(!day.value.trim() || !starttim.value || !endtim.value || !metaril.value.trim()){ alert('أكمل الحقول'); return; }
if(endtim.value <= starttim.value){ alert('وقت النهاية يجب أن يكون بعد البداية'); return; }

let tabol={
dayt:day.value,
starttimt:starttim.value,
endtimt:endtim.value,
clast:clas.value,
metr:metaril.value
}

databases.push(tabol)
localStorage.setItem('databases',JSON.stringify(databases))
delet()
shwedata()
}

function delet(){
day.value='';
starttim.value='';
endtim.value='';
clas.value='';
metaril.value='';
}
function shwedata(){
let tapol=''
for(let i=0;i<databases.length;i++){
// تعديل: إضافة esc في الأسطر الخمسة التالية
tapol+=`  <tr class="lecture-row" data-lecture-id="${i}" data-day="${esc(databases[i].dayt)}">
              <td data-label="اليوم" class="lecture-day">${esc(databases[i].dayt)}</td>
              <td data-label="الوقت" class="lecture-time">${esc(databases[i].starttimt)} - ${esc(databases[i].endtimt)}</td>
              <td data-label="المادة" class="lecture-subject">${esc(databases[i].metr)}</td>
              <td data-label="القاعة" class="lecture-room">${esc(databases[i].clast)}</td>
              <td class="row-actions"><button onclick="delt(${i})" type="button" data-action="delete" class="link-btn">حذف</button></td>
            </tr>
            `
}
document.getElementById('lecture-list').innerHTML=tapol;
}
function delt(i){
databases.splice(i,1)
localStorage.setItem('databases',JSON.stringify(databases))
shwedata()

}
shwedata()

let datatask = JSON.parse(localStorage.getItem('datatask')) || [];
addTaskButton.onclick=function(){
    // جديد: تحقق من عنوان المهمة
    if(!taskTitleInput.value.trim()){ alert('اكتب عنوان المهمة'); return; }

    let taske={
        nwetask:taskTitleInput.value,
        dattask:taskDateInput.value,
        timtask:taskTimeInput.value,
        Category:taskCategorySelect.value,
        Priority:taskPrioritySelect.value,
        done:false   // تعديل: حقل جديد لحفظ الإنجاز
    }

datatask.push(taske)
localStorage.setItem('datatask',JSON.stringify(datatask))
swwe2()
clearForm()
}
function clearForm() {
  taskTitleInput.value = '';
  taskDateInput.value = '';
  taskTimeInput.value = '';
  taskPrioritySelect.value = 'medium';   // القيمة الافتراضية
  taskCategorySelect.value = 'study';    // القيمة الافتراضية
  taskTitleInput.focus();                // يرجّع المؤشر لحقل العنوان
}
function swwe2(){
    let lst=''
    for(let i=0;i<datatask.length;i++){
        // تعديل: data-status صار يتغير حسب الإنجاز
        lst+=`
         <li class="task-item" data-task-id="${i}" data-priority="${datatask[i].Priority}" data-category="${datatask[i]. Category}" data-status="${datatask[i].done ? 'done' : 'pending'}">
          <input type="checkbox" class="task-check" id="task-check-${i}" ${datatask[i].done ? 'checked' : ''} onchange="toggleTask(${i})" aria-label="إنهاء المهمة">
          <div class="task-body">
            <p class="task-title">${esc(datatask[i].nwetask)}</p>
            <p class="task-meta"><span class="task-date">${esc(datatask[i].dattask)}</span> · <span class="task-time">${esc(datatask[i].timtask)}</span> · <span class="task-category-label">${datatask[i].Category}</span></p>
          </div>
        <span class="badge badge-${datatask[i].Priority} task-priority-label">${datatask[i].Priority}</span>
          <button onclick="delet2(${i})" type="button" class="link-btn" data-action="delete">حذف</button>
        </li>
        `
    }


    document.getElementById('task-list').innerHTML=lst;
}
 swwe2()
 function delet2(i){
 datatask.splice(i,1)
 localStorage.setItem('datatask',JSON.stringify(datatask))
 swwe2()
 }
 // دالة لجلب وتنسيق تاريخ اليوم تلقائياً باللغة العربية
function setTodayDate() {
    const todayElement = document.getElementById('today-date');
    if (todayElement) {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        todayElement.textContent = now.toLocaleDateString('ar-LY', options);
    }
}

// تشغيل الدالة فور تحميل الصفحة
document.addEventListener('DOMContentLoaded', setTodayDate);

// جديد: دالة تحفظ إنجاز المهمة
function toggleTask(i){
    datatask[i].done = !datatask[i].done
    localStorage.setItem('datatask',JSON.stringify(datatask))
    swwe2()
}
addlecture.onclick=function(){
    window.scrollTo({
     top:0,
     behavior:'smooth'
    })
   metaril.focus()
}
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(error => {
        console.log('ServiceWorker registration failed: ', error);
      });
  });
}
    
   
