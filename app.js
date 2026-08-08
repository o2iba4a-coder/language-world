const state={lang:localStorage.getItem("lw_lang")||"ru",xp:+localStorage.getItem("lw_xp")||0,streak:+localStorage.getItem("lw_streak")||0,tab:"words",q:0};
const alph={ru:"А Б В Г Д Е Ё Ж З И Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ъ Ы Ь Э Ю Я",en:"A B C D E F G H I J K L M N O P Q R S T U V W X Y Z",uz:"A B D E F G H I J K L M N O P Q R S T U V X Y Z O‘ G‘ Sh Ch"};
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
function save(){localStorage.setItem("lw_xp",state.xp);localStorage.setItem("lw_streak",state.streak);localStorage.setItem("lw_lang",state.lang);$("#xp").textContent=state.xp;$("#streak").textContent=state.streak}
function label(w){return w[state.lang]}
function render(){
  $$(".lang").forEach(b=>b.classList.toggle("active",b.dataset.lang===state.lang));
  $$(".tab").forEach(b=>b.classList.toggle("active",b.dataset.tab===state.tab));
  const c=$("#content");
  if(state.tab==="words") renderWords(c);
  if(state.tab==="alphabet") c.innerHTML=`<h3>Алфавит</h3><div>${alph[state.lang].split(" ").map(x=>`<span class="letter">${x}</span>`).join("")}</div>`;
  if(state.tab==="quiz") renderQuiz(c);
  if(state.tab==="crossword") renderGame(c);
  if(state.tab==="ai") renderAI(c);
  save();
}
function renderWords(c){
  const cats=[...new Set(WORDS.map(w=>w.cat))];
  c.innerHTML=`<p class="muted">В базе ${WORDS.length}+ учебных записей. Выбери категорию:</p><div class="chips" id="cats">${cats.map(x=>`<button class="chip">${x}</button>`).join("")}</div><div class="grid" id="wordgrid"></div>`;
  const show=(cat=null)=>$("#wordgrid").innerHTML=WORDS.filter(w=>!cat||w.cat===cat).slice(0,80).map(w=>`<div class="word"><b>${label(w)}</b><span>${w.en} · ${w.ru} · ${w.uz}</span></div>`).join("");
  show();
  $$("#cats .chip").forEach((b,i)=>b.onclick=()=>show(cats[i]));
}
function renderQuiz(c){
  const w=WORDS[(state.q*17)%WORDS.length], prompt=w.en, answer=w.ru;
  c.innerHTML=`<div class="muted">Вопрос ${state.q+1}</div><div class="question">Переведи: ${prompt}</div><input id="ans" class="input" placeholder="Напиши перевод на русском"><button class="btn primary" id="check">Проверить</button><div id="res" class="result"></div>`;
  $("#check").onclick=()=>{const v=$("#ans").value.trim().toLowerCase();if(v===answer.toLowerCase()){state.xp+=10;state.streak++;$("#res").textContent="✅ Правильно! +10 XP";state.q++;setTimeout(render,650)}else{$("#res").textContent=`❌ Попробуй ещё. Подсказка: ${answer[0]}…`}};
}
function renderGame(c){
  const w=WORDS[(state.q*31+7)%WORDS.length];
  c.innerHTML=`<h3>🧩 Перевод-игра</h3><p>Переведи слово <b>${w.en}</b> на русский.</p><input id="gameans" class="input"><button class="btn primary" id="gamecheck">Проверить</button><div id="gameres" class="result"></div>`;
  $("#gamecheck").onclick=()=>{if($("#gameans").value.trim().toLowerCase()===w.ru.toLowerCase()){state.xp+=20;$("#gameres").textContent="🎉 Верно! +20 XP";state.q++;setTimeout(render,700)}else $("#gameres").textContent="❌ Не совсем. Попробуй снова."};
}
function renderAI(c){
  c.innerHTML=`<h3>🤖 AI Учитель</h3><div class="ai-box"><div class="chat" id="chat"><div class="bubble bot">Привет! Я пока работаю в демо-режиме. Задай вопрос о слове, переводе или грамматике.</div></div><input id="aiinput" class="input" placeholder="Например: объясни слово “travel”"><button class="btn primary" id="aisend">Спросить</button><div class="chips"><button class="chip">Как запомнить слово?</button><button class="chip">Проверь мою фразу</button></div></div>`;
  const send=()=>{const v=$("#aiinput").value.trim();if(!v)return;$("#chat").innerHTML+=`<div class="bubble me">${escapeHtml(v)}</div>`;$("#chat").innerHTML+=`<div class="bubble bot">${localTutor(v)}</div>`;$("#aiinput").value=""};
  $("#aisend").onclick=send;$("#aiinput").onkeydown=e=>{if(e.key==="Enter")send()};$$(".chip").forEach(b=>b.onclick=()=>{$("#aiinput").value=b.textContent;send()});
}
function localTutor(v){
  const x=v.toLowerCase();
  if(x.includes("travel"))return "travel = путешествовать / поездка. Пример: “I love to travel.” — «Я люблю путешествовать».";
  if(x.includes("remember")||x.includes("запом"))return "Попробуй связать слово с картинкой, произнести его 3 раза и составить собственное предложение.";
  if(x.includes("проверь"))return "Напиши английское предложение, а в настоящей AI-версии я смогу разобрать грамматику и предложить исправление.";
  return "В демо-версии я могу дать подсказку по базовым словам. На следующем этапе подключим настоящий AI через сервер, чтобы API-ключ не попадал в браузер.";
}
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
$$(".lang").forEach(b=>b.onclick=()=>{state.lang=b.dataset.lang;state.q=0;render()});
$$(".tab").forEach(b=>b.onclick=()=>{state.tab=b.dataset.tab;render()});
render();