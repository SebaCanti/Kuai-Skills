// Kuai Skills Prototype
// Tema burbujas, sin corazones, con estrellas
// Edad >=18 calculada silenciosamente

const app = document.getElementById('app');

const state = {
  step: 'splash',
  user: {
    name: '',
    email: '',
    dob: '',
    intro: '',
    city: '',
    skillsHave: [],
    skillsWant: [],
    plan: 'basico' // basico | premium | kuai
  },
  dailyChats: 0
};

const skillsPool = [
  'Guitarra', 'Tenis', 'Pintura', 'Cocina', 'Fotografía', 'Baile',
  'Jardinería', 'Dibujo', 'Videojuegos', 'Canto', 'Natación', 'Escritura',
  'Yoga', 'Programación', 'Idiomas', 'Ajedrez', 'Piano', 'Ciclismo'
];

const plans = {
  basico: { chats: 10, want: 3, have: 5, name: 'Básico' },
  premium: { chats: 25, want: 6, have: 10, name: 'Premium' },
  kuai: { chats: 35, want: 15, have: 15, name: 'Kuai' }
};

function calculateAge(dob) {
  if (!dob) return 0;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function render() {
  app.innerHTML = '';
  // Background bubbles
  const bg = document.createElement('div');
  bg.className = 'bg-bubbles';
  for (let i = 0; i < 12; i++) {
    const b = document.createElement('div');
    b.className = 'bubble';
    b.style.width = b.style.height = (20 + Math.random() * 60) + 'px';
    b.style.left = Math.random() * 100 + '%';
    b.style.top = Math.random() * 100 + '%';
    b.style.animationDelay = Math.random() * 10 + 's';
    bg.appendChild(b);
  }
  app.appendChild(bg);

  const screen = document.createElement('div');
  screen.className = 'screen active';

  if (state.step === 'splash') {
    screen.innerHTML = `
      <h1 class="logo">Kuai Skills</h1>
      <p style="color:#5a7d9a; margin-bottom:30px;">Conecta, enseña y aprende ★</p>
      <button class="balloon-btn primary" onclick="goTo('register')">Comenzar</button>
    `;
  } else if (state.step === 'register') {
    screen.innerHTML = `
      <h2>Crea tu perfil</h2>
      <input class="balloon-input" type="text" placeholder="Tu nombre" id="name" value="${state.user.name}">
      <input class="balloon-input" type="email" placeholder="Tu email" id="email" value="${state.user.email}">
      <input class="balloon-input" type="date" id="dob" value="${state.user.dob}">
      <textarea class="balloon-input" placeholder="Breve introducción: ¿quién eres?" id="intro" style="min-height:80px; border-radius:30px;">${state.user.intro}</textarea>
      <input class="balloon-input" type="text" placeholder="Ciudad donde buscas partners" id="city" value="${state.user.city}">
      <div class="error" id="error"></div>
      <button class="balloon-btn primary" onclick="saveRegister()">Continuar ★</button>
    `;
  } else if (state.step === 'skillsHave') {
    const plan = plans[state.user.plan];
    screen.innerHTML = `
      <h2>Skills que tienes</h2>
      <p>Máximo ${plan.have} en plan ${plan.name}</p>
      <div class="skills-grid" id="haveGrid"></div>
      <button class="balloon-btn primary" onclick="goTo('skillsWant')">Continuar</button>
    `;
    setTimeout(() => renderSkills('have'), 10);
  } else if (state.step === 'skillsWant') {
    const plan = plans[state.user.plan];
    screen.innerHTML = `
      <h2>Skills que quieres aprender</h2>
      <p>Máximo ${plan.want} en plan ${plan.name}</p>
      <div class="skills-grid" id="wantGrid"></div>
      <button class="balloon-btn primary" onclick="finishProfile()">Entrar a Kuai ★</button>
    `;
    setTimeout(() => renderSkills('want'), 10);
  } else if (state.step === 'main') {
    const plan = plans[state.user.plan];
    screen.innerHTML = `
      <h1 class="logo" style="font-size:36px;">Hola, ${state.user.name} ★</h1>
      <p>Plan: ${plan.name} · Chats hoy: ${state.dailyChats}/${plan.chats}</p>
      <p style="font-size:14px; color:#666;">${state.user.intro}</p>
      <div class="main-grid">
        <div class="grid-item" onclick="alert('Chat: personas cercanas y recientes que hacen match con tus skills ★')">
          <h3>💬 Chat</h3>
          <p>Matches cercanos y recientes</p>
        </div>
        <div class="grid-item" onclick="alert('Teams Text: chats grupales por skill ★')">
          <h3>📝 Teams Text</h3>
          <p>Grupos de texto por skill</p>
        </div>
        <div class="grid-item" onclick="alert('Teams Talk: conversación de voz por skill ★')">
          <h3>🎙️ Teams Talk</h3>
          <p>Hablar en grupos por skill</p>
        </div>
        <div class="grid-item" onclick="openWorld()">
          <h3>🌍 Mundial</h3>
          <p>${state.user.plan === 'basico' ? '1 persona/día' : 'Cualquier ciudad'}</p>
        </div>
        <div class="grid-item" onclick="alert('Mini-juegos básicos + chat ★ (próximamente)')">
          <h3>🎮 Jugar y Chatear</h3>
          <p>Mini juegos simples</p>
        </div>
        <div class="grid-item" onclick="alert('Personaje fluffy: personaliza tu mascota con puntos ★')">
          <h3>🐾 Personaje</h3>
          <p>Mascota cute + accesorios</p>
        </div>
        <div class="grid-item" style="grid-column: span 2;" onclick="alert('Ajustes (próximamente)')">
          <h3>⚙️ Ajustes</h3>
          <p>Configuración</p>
        </div>
      </div>
      <button class="balloon-btn" style="margin-top:20px;" onclick="changePlan()">Cambiar plan (demo)</button>
    `;
  }

  app.appendChild(screen);
}

function goTo(step) {
  state.step = step;
  render();
}

function saveRegister() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const dob = document.getElementById('dob').value;
  const intro = document.getElementById('intro').value.trim();
  const city = document.getElementById('city').value.trim();
  const error = document.getElementById('error');

  if (!name || !email || !dob || !intro) {
    error.textContent = 'Completa todos los campos ★';
    return;
  }

  const age = calculateAge(dob);
  if (age < 18) {
    error.textContent = 'Verifica tu fecha de nacimiento';
    return;
  }

  state.user = { ...state.user, name, email, dob, intro, city };
  localStorage.setItem('kuaiUser', JSON.stringify(state.user));
  goTo('skillsHave');
}

function renderSkills(type) {
  const grid = document.getElementById(type === 'have' ? 'haveGrid' : 'wantGrid');
  if (!grid) return;
  const selected = type === 'have' ? state.user.skillsHave : state.user.skillsWant;
  const max = type === 'have' ? plans[state.user.plan].have : plans[state.user.plan].want;

  grid.innerHTML = '';
  skillsPool.forEach(skill => {
    const el = document.createElement('div');
    el.className = 'skill-bubble' + (selected.includes(skill) ? ' selected' : '');
    el.textContent = skill;
    el.onclick = () => {
      if (selected.includes(skill)) {
        selected.splice(selected.indexOf(skill), 1);
      } else if (selected.length < max) {
        selected.push(skill);
      }
      renderSkills(type);
    };
    grid.appendChild(el);
  });
}

function finishProfile() {
  localStorage.setItem('kuaiUser', JSON.stringify(state.user));
  state.step = 'main';
  render();
}

function openWorld() {
  if (state.user.plan === 'basico' && state.dailyChats >= 1) {
    alert('En plan Básico solo puedes conectar con 1 persona mundial por día ★');
    return;
  }
  alert('Buscando partners en cualquier ciudad del mundo... ★');
  state.dailyChats++;
}

function changePlan() {
  const next = state.user.plan === 'basico' ? 'premium' : state.user.plan === 'premium' ? 'kuai' : 'basico';
  state.user.plan = next;
  alert(`Plan cambiado a ${plans[next].name} (demo)`);
  render();
}

// Load saved
const saved = localStorage.getItem('kuaiUser');
if (saved) {
  state.user = JSON.parse(saved);
  state.step = 'main';
}

render();

// Expose functions
window.goTo = goTo;
window.saveRegister = saveRegister;
window.finishProfile = finishProfile;
window.openWorld = openWorld;
window.changePlan = changePlan;
