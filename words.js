const WORD_SOURCE={
en:"https://raw.githubusercontent.com/JackShannon/1000-most-common-words/master/1000-common-english-words.txt",
ru:"https://raw.githubusercontent.com/JackShannon/1000-most-common-words/master/1000-most-common-russian-words.txt",
uz:"https://raw.githubusercontent.com/JackShannon/1000-most-common-words/master/1000-most-common-uzbek-words.txt"
};
let WORDS=[];
function wordCategory(w){
w=w.toLowerCase();
const g={
"Семья и люди":["man","woman","boy","girl","mother","father","brother","sister","child","baby","family","friend","people","person","parent","dad","son","wife"],
"Дом":["home","house","room","door","window","wall","floor","chair","table","bed","garden","yard","store","office"],
"Еда":["food","eat","drink","bread","milk","egg","meat","rice","apple","fruit","sugar","salt","oil","water"],
"Животные":["animal","cat","dog","horse","cow","fish","bird","duck","chick","insect","bat"],
"Природа":["sun","moon","star","sky","earth","world","mountain","river","sea","ocean","tree","flower","forest","weather","rain","snow","wind","cloud","island"],
"Транспорт":["car","road","train","boat","ship","plane","bus","truck","wheel","tire"],
"Учёба":["school","study","learn","book","read","write","teacher","student","class","paper","letter","dictionary","question","answer"],
"Время":["time","day","night","morning","evening","week","month","year","hour","minute","second","season"],
"Цвета и качества":["red","blue","green","white","black","yellow","brown","gray","big","small","large","little","good","bad","new","old","young","hot","cold","fast","slow"],
"Глаголы":["go","come","get","take","make","do","see","look","know","think","say","tell","give","find","use","want","need","learn","speak","listen","write","read","eat","drink","sleep","walk","run","play","work","love"]};
for(const [c,a] of Object.entries(g))if(a.includes(w))return c;return"Другие"}
function loadWords(){
Promise.all([fetch(WORD_SOURCE.en),fetch(WORD_SOURCE.ru),fetch(WORD_SOURCE.uz)]).then(async r=>{
if(r.some(x=>!x.ok))throw Error("dictionary load");
const t=await Promise.all(r.map(x=>x.text()));
const clean=s=>s.split(/\r?\n/).map(x=>x.trim()).filter(Boolean).slice(0,1000);
const [en,ru,uz]=t.map(clean),n=Math.min(en.length,ru.length,uz.length,1000);
WORDS=Array.from({length:n},(_,i)=>({en:en[i],ru:ru[i],uz:uz[i],cat:wordCategory(en[i]),level:i<250?"A1":i<500?"A2":i<750?"B1":"B2",rank:i+1}));
window.dispatchEvent(new Event("languageWorldWordsReady"));
}).catch(e=>{console.error(e);WORDS=[{en:"hello",ru:"привет",uz:"salom",cat:"Базовые",level:"A1",rank:1},{en:"house",ru:"дом",uz:"uy",cat:"Дом",level:"A1",rank:2},{en:"water",ru:"вода",uz:"suv",cat:"Еда",level:"A1",rank:3},{en:"book",ru:"книга",uz:"kitob",cat:"Учёба",level:"A1",rank:4}];window.dispatchEvent(new Event("languageWorldWordsReady"))})}
loadWords();
