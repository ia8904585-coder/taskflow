let day = document.getElementById('lecture-day');
let starttim = document.getElementById('lecture-start');
let endtim = document.getElementById('lecture-end');
let clas = document.getElementById('lecture-room');
let metaril = document.getElementById('lecture-subject');
let btnsave = document.getElementById('save-lecture-btn');
let addlecture = document.getElementById('add-lecture-btn');

// الفورم الخاص بالمهام
const taskForm = document.getElementById('task-form');
const taskTitleInput = document.getElementById('task-title');
const taskDateInput = document.getElementById('task-date');
const taskTimeInput = document.getElementById('task-time');
const taskPrioritySelect = document.getElementById('task-priority');
const taskCategorySelect = document.getElementById('task-category');
const addTaskButton = document.getElementById('add-task-btn');

// دالة لحماية النصوص من الأكواد الخبيثة
function esc(s){
  return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

let databases;
if(localStorage.getItem('databases') != null){
    databases = JSON.parse(localStorage.getItem('databases'));
} else {
    databases = [];
}

btnsave.onclick = function(){
    if(!day.value.trim() || !starttim.value || !endtim.value || !metaril.value.trim()){ alert('أكمل الحقول'); return; }
    if(endtim.value <= starttim.value){ alert('وقت النهاية يجب أن يكون بعد البداية'); return; }

    let tabol = {
        dayt: day.value,
        starttimt: starttim.value,
        endtimt: endtim.value,
        clast: clas.value,
        metr: metaril.value
    };

    databases.push(tabol);
    localStorage.setItem('databases', JSON.stringify(databases));
    delet();
    shwedata();
}

function delet(){
    day.value = '';
    starttim.value = '';
    endtim.value = '';
    clas.value = '';
    metaril.value = '';
}

// دالة عرض المحاضرات على شكل مجموعات لكل يوم (اسم اليوم يظهر مرة واحدة فقط)
function shwedata(){
    let container = document.getElementById('lecture-list');
    let groupedByDay = {};

    // تجميع المحاضرات حسب اليوم والاحتفاظ بالإندكس الأصلي للحذف
    databases.forEach((item, originalIndex) => {
        let dayName = item.dayt;
        if (!groupedByDay[dayName]) {
            groupedByDay[dayName] = [];
        }
        groupedByDay[dayName].push({ ...item, originalIndex: originalIndex });
    });

    let htmlOutput = '';

    if (databases.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#888; padding: 15px;">لا توجد محاضرات مضافة حالياً</p>';
        return;
    }

    // بناء الواجهة لكل يوم يحتوي على محاضراته متسلسلة تحته
    for (let dayName in groupedByDay) {
        htmlOutput += `
            <div class="day-group-card" style="margin-bottom: 15px; padding: 12px; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
                <h3 style="margin-bottom: 8px; color: #4f46e5; border-bottom: 2px solid #4f46e5; display: inline-block; padding-bottom: 3px; font-size: 1.1em;">${esc(dayName)}</h3>
                <ul style="list-style: none; padding: 0; margin: 0;">
        `;

        groupedByDay[dayName].forEach(lecture => {
            htmlOutput += `
                <li style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px dashed #e5e7eb;">
                    <div>
                        <strong style="color: #1f2937;">${esc(lecture.metr)}</strong> 
                        <span style="color: #4b5563; font-size: 0.9em; margin-right: 10px;">(${esc(lecture.starttimt)} - ${esc(lecture.endtimt)})</span>
                        ${lecture.clast ? `<span style="background: #eef2ff; color: #4f46e5; padding: 2px 6px; border-radius: 4px; font-size: 0.85em; margin-right: 8px;">قاعة: ${esc(lecture.clast)}</span>` : ''}
                    </div>
                    <button onclick="delt(${lecture.originalIndex})" type="button" class="link-btn" style="color: #ef4444; border: none; background: none; cursor: pointer; font-weight: 600;">حذف</button>
                </li>
            `;
        });

        htmlOutput += `
                </ul>
            </div>
        `;
    }

    container.innerHTML = htmlOutput;
}

function delt(i){
    databases.splice(i, 1);
    localStorage.setItem('databases', JSON.stringify(databases));
    shwedata();
}
shwedata();

let datatask = JSON.parse(localStorage.getItem('datatask')) || [];

addTaskButton.onclick = function(e){
    e.preventDefault();
    if(!taskTitleInput.value.trim()){ alert('اكتب عنوان المهمة'); return; }

    let taske = {
        nwetask: taskTitleInput.value,
        dattask: taskDateInput.value,
        timtask: taskTimeInput.value,
        Category: taskCategorySelect.value,
        Priority: taskPrioritySelect.value,
        done: false
    };

    datatask.push(taske);
    localStorage.setItem('datatask', JSON.stringify(datatask));
    swwe2();
    clearForm();
}

function clearForm() {
    taskTitleInput.value = '';
    taskDateInput.value = '';
    taskTimeInput.value = '';
    taskPrioritySelect.value = 'متوسطة';
    taskCategorySelect.value = 'الدراسة';
    taskTitleInput.focus();
}

function swwe2(){
    let lst = '';
    for(let i = 0; i < datatask.length; i++){
        lst += `
           <li class="task-item" data-task-id="${i}" data-priority="${datatask[i].Priority}" data-category="${datatask[i].Category}" data-status="${datatask[i].done ? 'done' : 'pending'}">
             <input type="checkbox" class="task-check" id="task-check-${i}" ${datatask[i].done ? 'checked' : ''} onchange="toggleTask(${i})" aria-label="إنهاء المهمة">
             <div class="task-body">
               <p class="task-title">${esc(datatask[i].nwetask)}</p>
               <p class="task-meta"><span class="task-date">${esc(datatask[i].dattask)}</span> · <span class="task-time">${esc(datatask[i].timtask)}</span> · <span class="task-category-label">${datatask[i].Category}</span></p>
             </div>
           <span class="badge badge-${datatask[i].Priority} task-priority-label">${datatask[i].Priority}</span>
             <button onclick="delet2(${i})" type="button" class="link-btn" data-action="delete">حذف</button>
           </li>
        `;
    }
    document.getElementById('task-list').innerHTML = lst;
}
swwe2();

function delt2(i){
    datatask.splice(i, 1);
    localStorage.setItem('datatask', JSON.stringify(datatask));
    swwe2();
}

function setTodayDate() {
    const todayElement = document.getElementById('today-date');
    if (todayElement) {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        todayElement.textContent = now.toLocaleDateString('ar-LY', options);
    }
}

document.addEventListener('DOMContentLoaded', setTodayDate);

function toggleTask(i){
    datatask[i].done = !datatask[i].done;
    localStorage.setItem('datatask', JSON.stringify(datatask));
    swwe2();
}

addlecture.onclick = function(){
    window.scrollTo({
       top: 0,
       behavior: 'smooth'
    });
    metaril.focus();
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