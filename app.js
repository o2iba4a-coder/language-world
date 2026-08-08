const state={lang:localStorage.getItem("lw_lang")||"ru",xp:+localStorage.getItem("lw_xp")||0,streak:+localStorage.getItem("lw_streak")||0,tab:"words",q:0};const alph={ru:"А Б В Г Д Е Ё Ж З И Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ъ Ы Ь Э Ю Я",en:"A B C D E F G H I J K L M N O P Q R S T U V W X Y Z",uz:"A B D E F G H I J K L M N O P Q R S T U V X Y Z O‘ G‘ Sh Ch"};const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}function save(){localStorage.setItem("lw_xp",state.xp);localStorage.setItem("lw_streak",state.streak);localStorage.setItem("lw_lang",state.lang);$("#xp").textContent=state.xp;$("#streak").textContent=state.streak}function label(w){return w[state.lang]}function render(){if(!WORDS.length){$("#content").innerHTML='<div class="empty">⏳ Загружаю словарь 1000 слов…</div>';return}$$(".lang").forEach(b=>b.classList.toggle("active",b.dataset.lang===state.lang));$$(".tab").forEach(b=>b.classList.toggle("active",b.dataset.tab===state.tab));const c=$("#content");if(state.tab==="words")words(c);if(state.tab==="alphabet")c.innerHTML=`<h3>Алфавит</h3><div>${alph[state.lang].split(" ").map(x=>`<span class="letter">${x}</span>`).join("")}</div>`;if(state.tab==="quiz")quiz(c);if(state.tab==="crossword")game(c);if(state.tab==="ai")ai(c);save()}function words(c){const cats=[...new Set(WORDS.map(w=>w.cat))];c.innerHTML=`<p class="muted">В словаре <b>${WORDS.length}</b> записей.</p><div class="chips" id="cats">${cats.map(x=>`<button class="chip">${esc(x)}</button>`).join("")}</div><div class="grid" id="wordgrid"></div>`;const show=cat=>$("#wordgrid").innerHTML=WORDS.filter(w=>!cat||w.cat===cat).slice(0,100).map(w=>`<div class="word"><b>${esc(label(w))}</b><span>${esc(w.en)} · ${esc(w.ru)} · ${esc(w.uz)}</span><small class="muted"> ${w.level} · #${w.rank}</small></div>`).join("");show();$$(".chip").forEach((b,i)=>b.onclick=()=>show(cats[i]))}function quiz(c){const w=WORDS[(state.q*17)%WORDS.length];c.innerHTML=`<div class="muted">${w.level} · слово #${w.rank}</div><div class="question">Переведи: ${esc(w.en)}</div><input id="ans" class="input" placeholder="Напиши перевод на русском"><button class="btn primary" id="check">Проверить</button><div id="res" class="result"></div>`;$("#check").onclick=()=>{if($("#ans").value.trim().toLowerCase()===w.ru.toLowerCase()){state.xp+=10;state.streak++;$("#res").textContent="✅ Правильно! +10 XP";state.q++;setTimeout(render,650)}else $("#res").textContent=`❌ Попробуй ещё. Первая буква: ${w.ru[0]}…`}}function game(c){const w=WORDS[(state.q*31+7)%WORDS.length];c.innerHTML=`<h3>🧩 Перевод-игра</h3><p>Переведи <b>${esc(w.en)}</b> на русский.</p><input id="ga" class="input"><button class="btn primary" id="gc">Проверить</button><div id="gr" class="result"></div>`;$("#gc").onclick=()=>{if($("#ga").value.trim().toLowerCase()===w.ru.toLowerCase()){state.xp+=20;$("#gr").textContent="🎉 Верно! +20 XP";state.q++;setTimeout(render,700)}else $("#gr").textContent="❌ Не совсем. Попробуй снова."}}function ai(c){c.innerHTML=`<h3>🤖 AI Учитель</h3><div class="ai-box"><div class="chat" id="chat"><div class="bubble bot">Привет! Я пока в демо-режиме.</div></div><input id="aiinput" class="input" placeholder="Например: объясни слово travel"><button class="btn primary" id="send">Спросить</button></div>`;const send=()=>{const v=$("#aiinput").value.trim();if(!v)return;$("#chat").innerHTML+=`<div class="bubble me">${esc(v)}</div><div class="bubble bot">${esc(v.toLowerCase().includes("travel")?"travel = путешествовать / поездка.":"На следующем этапе подключим настоящий AI через безопасный сервер.")}</div>`;$("#aiinput").value=""};$("#send").onclick=send}$$(".lang").forEach(b=>b.onclick=()=>{state.lang=b.dataset.lang;state.q=0;render()});$$(".tab").forEach(b=>b.onclick=()=>{state.tab=b.dataset.tab;render()});window.addEventListener("languageWorldWordsReady",render);render();
// ==========================================
// 🔊 LANGUAGE WORLD — СИСТЕМА ЗВУКОВ
// ==========================================

let lwAudioContext = null;

// Включён ли звук
let lwSoundEnabled =
    localStorage.getItem("lw_sound") !== "off";


// Создание AudioContext
function lwGetAudioContext() {

    if (!lwAudioContext) {
        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContext) return null;

        lwAudioContext = new AudioContext();
    }

    if (lwAudioContext.state === "suspended") {
        lwAudioContext.resume();
    }

    return lwAudioContext;
}


// Короткий звук кнопки
function lwClickSound() {

    if (!lwSoundEnabled) return;

    const ctx = lwGetAudioContext();

    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    const time = ctx.currentTime;

    oscillator.frequency.setValueAtTime(520, time);

    gain.gain.setValueAtTime(0.03, time);

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        time + 0.08
    );

    oscillator.start(time);

    oscillator.stop(time + 0.08);
}


// ✅ Правильный ответ
function lwSuccessSound() {

    if (!lwSoundEnabled) return;

    const ctx = lwGetAudioContext();

    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    const time = ctx.currentTime;

    oscillator.frequency.setValueAtTime(
        600,
        time
    );

    oscillator.frequency.setValueAtTime(
        850,
        time + 0.1
    );

    gain.gain.setValueAtTime(
        0.06,
        time
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        time + 0.3
    );

    oscillator.start(time);

    oscillator.stop(time + 0.3);
}


// ❌ Неправильный ответ
function lwErrorSound() {

    if (!lwSoundEnabled) return;

    const ctx = lwGetAudioContext();

    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    const time = ctx.currentTime;

    oscillator.frequency.setValueAtTime(
        220,
        time
    );

    oscillator.frequency.setValueAtTime(
        150,
        time + 0.12
    );

    gain.gain.setValueAtTime(
        0.05,
        time
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        time + 0.25
    );

    oscillator.start(time);

    oscillator.stop(time + 0.25);
}


// ==========================================
// 🗣️ ПРОИЗНОШЕНИЕ СЛОВ
// ==========================================

function lwSpeak(text, language) {

    if (!("speechSynthesis" in window)) {

        alert(
            "Ваш браузер не поддерживает озвучивание."
        );

        return;
    }

    // Остановить предыдущую речь
    speechSynthesis.cancel();

    const voice = new SpeechSynthesisUtterance(text);

    if (language === "en") {
        voice.lang = "en-US";
    }

    if (language === "ru") {
        voice.lang = "ru-RU";
    }

    if (language === "uz") {
        voice.lang = "uz-UZ";
    }

    // Скорость речи
    voice.rate = 0.8;

    // Высота голоса
    voice.pitch = 1;

    speechSynthesis.speak(voice);
}


// ==========================================
// 🔇 КНОПКА ЗВУКА
// ==========================================

function lwCreateSoundButton() {

    // Не создавать кнопку два раза
    if (
        document.getElementById(
            "lwSoundButton"
        )
    ) {
        return;
    }

    const button =
        document.createElement("button");

    button.id = "lwSoundButton";

    button.innerHTML =
        lwSoundEnabled
        ? "🔊 Звуки: ВКЛ"
        : "🔇 Звуки: ВЫКЛ";

    button.style.cssText = `
        margin:10px;
        padding:10px 16px;
        border:none;
        border-radius:12px;
        cursor:pointer;
        font-size:15px;
        font-weight:bold;
    `;

    button.onclick = function () {

        lwSoundEnabled =
            !lwSoundEnabled;

        localStorage.setItem(
            "lw_sound",
            lwSoundEnabled
            ? "on"
            : "off"
        );

        button.innerHTML =
            lwSoundEnabled
            ? "🔊 Звуки: ВКЛ"
            : "🔇 Звуки: ВЫКЛ";

        if (lwSoundEnabled) {
            lwClickSound();
        }
    };

    const hero =
        document.querySelector(".hero");

    if (hero) {
        hero.appendChild(button);
    }
}


// ==========================================
// 🔊 ЗВУК ПРИ НАЖАТИИ КНОПОК
// ==========================================

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest("button");

        if (!button) return;

        // Для специальных кнопок
        // не проигрываем обычный звук
        if (
            button.id === "lwSoundButton" ||
            button.classList.contains("lwSpeakButton")
        ) {
            return;
        }

        lwClickSound();
    }
);


// ==========================================
// 🚀 ЗАПУСК
// ==========================================

window.addEventListener(
    "load",
    function() {

        lwCreateSoundButton();

    }
);
