const levels = [
  { title:'Wake the village', icon:'🌤️', difficulty:'Warm-up', story:'The village is asleep. Cast your very first message spell.', instruction:'Print the words Hello, Python!', hint:'Use print(), then put the message inside quotation marks.', code:'print("Hello, Python!")', tip:'Text must be inside quotation marks.' },
  { title:'Name your dragon', icon:'🐉', difficulty:'Easy', story:'A shy dragon needs a name badge.', instruction:'Make a variable called dragon and give it the text Ember.', hint:'A variable is a named box: name = value', code:'dragon = "Ember"', tip:'Use one equals sign (=) to store a value.' },
  { title:'Count the coins', icon:'🪙', difficulty:'Easy', story:'Byte found seven ancient coins in a cave.', instruction:'Make a variable coins with the number 7, then print it.', hint:'Numbers do not need quotation marks.', code:'coins = 7\nprint(coins)', tip:'print(coins) shows what is stored in coins.' },
  { title:'Meet the hero', icon:'🧝', difficulty:'Easy', story:'Your hero has arrived at the forest gate.', instruction:'Ask the player for their name and save it in a variable called hero.', hint:'input() asks the player to type something.', code:'hero = input("What is your name? ")', tip:'The words inside input() are a helpful question.' },
  { title:'Mix a potion', icon:'🧪', difficulty:'Getting warmer', story:'The cauldron needs three moon berries and two star leaves.', instruction:'Create berries = 3 and leaves = 2, then print their total.', hint:'Use + to add two numbers.', code:'berries = 3\nleaves = 2\nprint(berries + leaves)', tip:'Python reads code from top to bottom.' },
  { title:'Open the gate', icon:'🚪', difficulty:'Getting warmer', story:'The castle gate only opens for a wizard.', instruction:'If role is equal to "wizard", print "Gate open".', hint:'Inside an if condition, use == to compare.', code:'if role == "wizard":\n    print("Gate open")', tip:'A colon (:) starts the code that belongs to if.' },
  { title:'Choose the biggest gem', icon:'💎', difficulty:'Getting warmer', story:'Two gems sparkle on the ground. Pick the one with more power.', instruction:'If gem_power is greater than 10, print "Super gem".', hint:'The greater-than symbol is >.', code:'if gem_power > 10:\n    print("Super gem")', tip:'The spaces before print are called indentation.' },
  { title:'Light the lanterns', icon:'🏮', difficulty:'Explorer', story:'A dark path needs five glowing lanterns.', instruction:'Use a for loop to print "Glow" 5 times.', hint:'range(5) repeats five times: 0, 1, 2, 3, 4.', code:'for lantern in range(5):\n    print("Glow")', tip:'A for loop repeats a block of code.' },
  { title:'Climb the tower', icon:'🗼', difficulty:'Explorer', story:'Climb from step 1 to step 3 without stopping.', instruction:'Set step = 1. Use a while loop to print step and add 1 until step is 4.', hint:'A while loop keeps going while its condition is true.', code:'step = 1\nwhile step < 4:\n    print(step)\n    step = step + 1', tip:'Remember to change step inside the loop.' },
  { title:'Pack the backpack', icon:'🎒', difficulty:'Explorer', story:'Bring a map, a rope, and an apple on your quest.', instruction:'Make a list called bag with "map", "rope", and "apple".', hint:'Lists use square brackets [ ].', code:'bag = ["map", "rope", "apple"]', tip:'Use commas to separate list items.' },
  { title:'Find a magic key', icon:'🗝️', difficulty:'Adventurer', story:'You spot a magic key beside your backpack.', instruction:'Add "key" to the end of the list bag.', hint:'Lists have an append() action.', code:'bag.append("key")', tip:'append adds one new item to the end of a list.' },
  { title:'Learn a spell', icon:'✨', difficulty:'Adventurer', story:'Create a spell that says Hello, traveler! whenever you call it.', instruction:'Write a function named greet that prints "Hello, traveler!".', hint:'Functions begin with def and end the first line with a colon.', code:'def greet():\n    print("Hello, traveler!")', tip:'Functions are reusable mini-programs.' },
  { title:'Read the treasure map', icon:'🗺️', difficulty:'Adventurer', story:'The map stores a secret location under the word "place".', instruction:'Make a dictionary called treasure where "place" has the value "Moon Cave".', hint:'Dictionaries use curly brackets { } and key: value pairs.', code:'treasure = {"place": "Moon Cave"}', tip:'Dictionary keys help you label information.' },
  { title:'Upgrade your spell', icon:'🪄', difficulty:'Hero', story:'Your greeting spell should work for any adventurer.', instruction:'Write a function named greet with a parameter name that prints "Hello, " + name.', hint:'Put the parameter inside the parentheses: def greet(name):', code:'def greet(name):\n    print("Hello, " + name)', tip:'A parameter is information a function receives.' },
  { title:'Defeat the shadow', icon:'🌑', difficulty:'Final quest', story:'Only brave heroes with 10 or more gems may face the shadow. Announce each brave hero!', instruction:'For every hero in heroes, if hero["gems"] is at least 10, print hero["name"].', hint:'Use a for loop, then an if statement. “At least” means >=.', code:'for hero in heroes:\n    if hero["gems"] >= 10:\n        print(hero["name"])', tip:'You combined a loop, an if statement, and dictionary values!' }
];

const el = (id) => document.getElementById(id);
const state = JSON.parse(localStorage.getItem('pythonQuestProgress') || '{"unlocked":1,"completed":[],"gems":0}');
let current = Math.min(Math.max(1, state.unlocked), levels.length) - 1;
let hintVisible = false;

function tidy(code) {
  return code.trim().replace(/\r/g, '').split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#')).join('\n');
}
function save() { localStorage.setItem('pythonQuestProgress', JSON.stringify(state)); }
function setFeedback(kind, html) {
  const feedback = el('feedback');
  feedback.className = `feedback ${kind}`;
  feedback.innerHTML = html;
}
function clearFeedback() { el('feedback').className = 'feedback hidden'; }
function renderLevels() {
  el('level-list').innerHTML = levels.map((level, index) => {
    const number = index + 1;
    const done = state.completed.includes(number);
    const locked = number > state.unlocked;
    return `<button class="level-button ${index === current ? 'current' : ''} ${done ? 'done' : ''}" data-level="${index}" ${locked ? 'disabled' : ''} aria-label="Level ${number}${locked ? ', locked' : ''}">${locked ? '<span class="lock">🔒</span>' : done ? '✓' : number}</button>`;
  }).join('');
  document.querySelectorAll('[data-level]').forEach(button => button.addEventListener('click', () => { current = Number(button.dataset.level); render(); }));
}
function updateLines() { el('line-numbers').textContent = Array.from({ length: Math.max(1, el('code-input').value.split('\n').length) }, (_, i) => i + 1).join('\n'); }
function render() {
  const level = levels[current];
  el('level-number').textContent = `LEVEL ${String(current + 1).padStart(2, '0')}`;
  el('level-title').textContent = level.title;
  el('story-icon').textContent = level.icon;
  el('story').textContent = level.story;
  el('instruction').textContent = level.instruction;
  el('difficulty').textContent = level.difficulty;
  el('guide-text').textContent = current < 4 ? 'Start small. One line can make magic.' : current < 10 ? 'You are learning real coding moves!' : 'This is proper wizard-level thinking.';
  el('tip-text').textContent = level.tip;
  el('reward-number').textContent = state.completed.includes(current + 1) ? 'Already earned' : '5 gems';
  el('code-input').value = '';
  updateLines(); clearFeedback(); hintVisible = false;
  el('hint-button').textContent = '💡 Show a hint';
  el('progress-label').textContent = `Level ${current + 1} of ${levels.length}`;
  el('progress-bar').style.width = `${((current + 1) / levels.length) * 100}%`;
  el('gem-count').textContent = state.gems;
  renderLevels();
}
function diagnose(answer, level) {
  if (!answer.trim()) return 'Your editor is empty. Try writing one small line of Python first.';
  if ((level.code.includes('if ') || level.code.includes('for ') || level.code.includes('while ') || level.code.includes('def ')) && !answer.includes(':')) return 'You are close: this kind of Python line needs a colon (:) at the end.';
  if (level.code.includes('    ') && !answer.split('\n').some(line => /^\s{2,}/.test(line))) return 'The line inside a loop, function, or if statement needs indentation—press Tab (or add four spaces).';
  if (/print\([^)]*\w+[^)]*\)/.test(answer) && level.code.includes('"') && !answer.includes('"') && !answer.includes("'")) return 'Words are text, so put them inside quotation marks.';
  if (level.code.includes(' == ') && answer.includes(' = ') && !answer.includes(' == ')) return 'Use == to compare values inside an if statement. One = stores a value.';
  return 'That is not quite the code this spell needs yet. Compare your punctuation, spelling, and indentation carefully.';
}
function checkCode() {
  const level = levels[current];
  const answer = el('code-input').value;
  if (tidy(answer) === tidy(level.code)) {
    const number = current + 1;
    const isNew = !state.completed.includes(number);
    if (isNew) { state.completed.push(number); state.gems += 5; state.unlocked = Math.max(state.unlocked, Math.min(levels.length, number + 1)); save(); }
    el('modal-title').textContent = number === levels.length ? 'Python Quest complete!' : 'Wonderful work!';
    el('modal-text').textContent = number === levels.length ? 'You completed all 15 coding quests. Byte is very proud of you!' : `You used ${level.difficulty.toLowerCase()} Python magic perfectly.`;
    el('modal-gems').textContent = isNew ? '5' : '0';
    el('next-level').textContent = number === levels.length ? 'Play a level again ↻' : 'Next level →';
    el('reward-modal').classList.remove('hidden'); renderLevels(); el('gem-count').textContent = state.gems;
  } else {
    setFeedback('error', `<strong>Almost there — keep trying!</strong>${diagnose(answer, level)}<span class="correct-code">Correct code:\n${level.code.replace(/</g, '&lt;')}</span><button class="copy-answer" id="copy-answer">Use this answer</button>`);
    el('copy-answer').addEventListener('click', () => { el('code-input').value = level.code; updateLines(); el('code-input').focus(); });
  }
}
el('code-input').addEventListener('input', () => { updateLines(); clearFeedback(); });
el('code-input').addEventListener('keydown', (event) => { if (event.key === 'Tab') { event.preventDefault(); const box = event.target; const start = box.selectionStart; box.setRangeText('    ', start, box.selectionEnd, 'end'); updateLines(); } if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') checkCode(); });
el('run-button').addEventListener('click', checkCode);
el('hint-button').addEventListener('click', () => { const level = levels[current]; hintVisible = !hintVisible; hintVisible ? setFeedback('hint', `<strong>Byte says:</strong>${level.hint}`) : clearFeedback(); el('hint-button').textContent = hintVisible ? '💡 Hide hint' : '💡 Show a hint'; });
el('next-level').addEventListener('click', () => { el('reward-modal').classList.add('hidden'); current = current === levels.length - 1 ? 0 : Math.min(current + 1, state.unlocked - 1); render(); });
el('reset-game').addEventListener('click', () => { if (confirm('Reset all 15 levels and gems?')) { state.unlocked = 1; state.completed = []; state.gems = 0; current = 0; save(); render(); } });
render();
