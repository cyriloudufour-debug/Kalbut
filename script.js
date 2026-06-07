// pluie slip
const MY_IMAGE_PATH = 'images/slipe.png'; // 👈 Ton image globale pour le fond et les pluies

const video = document.getElementById('maVideo');
const siteContent = document.getElementById('site-content');
const circularNav = document.getElementById('circularNav'); 
const navTrigger = document.getElementById('nav-trigger'); 

let bgImagesCreated = false;

video.addEventListener('ended', () => {
    video.pause();
    triggerImageRain('rain-container'); 
    showSite();
});

// Changement de couleur de fond 
video.addEventListener('timeupdate', () => {
    if (video.currentTime >= 1.82) {
        document.body.style.backgroundColor = 'white';
        
        // Création des images éparpillées en filigrane
        if (!bgImagesCreated) {
            createRandomBackgroundImages();
            bgImagesCreated = true;
        }
    }
});

function triggerImageRain(containerId) {
    const rainContainer = document.getElementById(containerId);
    if (!rainContainer) return;

    const numberOfDrops = 40; 

    for (let i = 0; i < numberOfDrops; i++) {
        const img = document.createElement('img');
        img.src = MY_IMAGE_PATH; 
        img.classList.add('rain-drop');

        const randomLeft = Math.random() * 100;
        img.style.left = `${randomLeft}%`;

        const randomSize = Math.floor(Math.random() * 80) + 30;
        img.style.width = `${randomSize}px`;
        img.style.height = 'auto';

        const randomDuration = (Math.random() * 2) + 1.5;
        img.style.animationDuration = `${randomDuration}s`;

        const randomDelay = Math.random() * 2.5;
        img.style.animationDelay = `${randomDelay}s`;

        const randomRotation = Math.floor(Math.random() * 720) - 360;
        img.style.setProperty('--target-rotation', `${randomRotation}deg`);

        rainContainer.appendChild(img);
    }

    
    setTimeout(() => {
        rainContainer.innerHTML = '';
    }, 6000);
}

// slip arriere plan random
function createRandomBackgroundImages() {
    const container = document.getElementById('random-bg-container');
    if (!container) return;

    const numberOfImages = 4; 

    for (let i = 0; i < numberOfImages; i++) {
        const img = document.createElement('img');
        img.src = MY_IMAGE_PATH; 
        img.classList.add('random-bg-img');

        const randomTop = Math.random() * 95; 
        const randomLeft = Math.random() * 90; 
        const randomSize = Math.floor(Math.random() * 250) + 100;
        const randomRotation = Math.floor(Math.random() * 360);

        img.style.top = `${randomTop}%`;
        img.style.left = `${randomLeft}%`;
        img.style.width = `${randomSize}px`;
        img.style.transform = `rotate(${randomRotation}deg)`;

        container.appendChild(img);
        
        setTimeout(() => {
            img.style.opacity = '1'; 
        }, 100);
    }
}


function showSite() {
    siteContent.classList.remove('hidden');
    circularNav.classList.remove('hidden');
    navTrigger.classList.remove('hidden');
    document.body.classList.add('site-visible');
    
    
    setTimeout(() => {
        initScrollAnimations();
    }, 100);
}


function initScrollAnimations() {
    const sectionsToObserve = document.querySelectorAll('.grid-section-4, .grid-section-5, .interview-section');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
        
                if (entry.target.classList.contains('interview-section')) {
                    triggerImageRain('interview-rain-container');
                }
                
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    sectionsToObserve.forEach(section => {
        observer.observe(section);
    });
}

// Interview 
const IMAGES = {
  base:    "images/bases.png",
  happy:   "images/Pouce.png",
  gener:   "images/amba.png",
  interrogation: "images/cool.png",
  cool:    "images/step.png"
};

const DIALOGUE = [
  { text: "Salut ...", expr: "base", choices: null },
  { text: "Je suis Kalbut , un Artiste qui fait des oeuvres tout en recyclant !!!", expr: "gener", choices: null },
  { text: "Moi, ce qui m’intéresse, c’est donner une deuxième vie aux objets. ", expr: "cool", choices: null },
  { text: "Parfois l’idée vient directement du matériau que je récupère. ", expr: "gener", choices: null },
  { text: "Chaque objet a déjà une histoire avant d’arriver dans mes mains. ", expr: "happy", choices: null },
  {
    text: "Est-ce que le recyclage est devenu une forme d’art selon vous ? ?",
    expr: "interrogation",
    choices: [
      { label: "Oui j'en suis certain!", next: "brave" },
      { label: "Je ne pense pas vraiment", next: "doubt" }
    ]
  }
];

const BRANCH = {
  brave: [
    { text: "Je suis tout a fait d'accord avec toi ", expr: "happy" },
    { text: "Je préfère créer avec ce qui existe déjà.", expr: "base" },
    { text: "En ce moment je travaille sur une baleine faite avec des pièces récupérées.", expr: "cool" }
  ],
  doubt: [
    { text: "L’art récup’, ça plaît pas à tout le monde. ", expr: "gener" },
    { text: "Peut-être qu’une fois terminée elle te parlera plus.", expr: "base" },
    { text: "C’est justement ce que j’aime : surprendre les gens.", expr: "cool" }
  ]
};

const imgEl      = document.getElementById('int-character-img');
const textEl     = document.getElementById('int-dialogue-text');
const arrowEl    = document.getElementById('int-next-arrow');
const progressEl = document.getElementById('int-progress');
const choiceEl   = document.getElementById('int-choice-panel');

let dialogueScript = DIALOGUE;
let dialogueStep   = 0;
let isDialogueTyping = false;
let dialogueTypeTimer = null;

function setInterviewImage(expr) {
  const src = IMAGES[expr] || IMAGES.base;
  if (!imgEl || imgEl.getAttribute('src') === src) return;
  imgEl.style.opacity = '0';
  setTimeout(() => {
    imgEl.src = src;
    imgEl.style.opacity = '1';
  }, 80);
}

function bounceInterviewCharacter() {
  if (!imgEl) return;
  imgEl.classList.remove('bounce');
  void imgEl.offsetWidth; // Reset animation
  imgEl.classList.add('bounce');
  imgEl.addEventListener('animationend', () => imgEl.classList.remove('bounce'), { once: true });
}

function updateInterviewDots() {
  if (!progressEl) return;
  progressEl.innerHTML = '';
  const total = Math.min(dialogueScript.length, 8);
  for (let i = 0; i < total; i++) {
    const d = document.createElement('div');
    d.className = 'dot' + (i === dialogueStep ? ' active' : '');
    progressEl.appendChild(d);
  }
}

function typeInterviewText(text, onDone) {
  if (!textEl || !arrowEl) return;
  textEl.textContent = '';
  arrowEl.style.opacity = '0';
  isDialogueTyping = true;
  let idx = 0;
  clearInterval(dialogueTypeTimer);
  dialogueTypeTimer = setInterval(() => {
    textEl.textContent += text[idx++];
    if (idx >= text.length) {
      clearInterval(dialogueTypeTimer);
      isDialogueTyping = false;
      arrowEl.style.opacity = '1';
      if (onDone) onDone();
    }
  }, 35);
}

function showInterviewChoices(choices) {
  if (!arrowEl || !choiceEl) return;
  arrowEl.style.display = 'none';
  choiceEl.innerHTML = '';
  choiceEl.style.display = 'flex';
  choices.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = c.label;
    btn.onclick = () => {
      choiceEl.style.display = 'none';
      arrowEl.style.display  = 'block';
      dialogueScript = BRANCH[c.next];
      dialogueStep   = 0;
      playInterviewStep();
    };
    choiceEl.appendChild(btn);
  });
}

function playInterviewStep() {
  if (dialogueStep >= dialogueScript.length) {
    if (textEl && arrowEl) {
      textEl.textContent    = '— Fin —';
      arrowEl.style.display = 'none';
    }
    return;
  }
  const line = dialogueScript[dialogueStep];
  setInterviewImage(line.expr);
  updateInterviewDots();
  typeInterviewText(line.text, () => {
    if (line.choices) showInterviewChoices(line.choices);
  });
}

function advanceInterview() {
  if (isDialogueTyping) {
    clearInterval(dialogueTypeTimer);
    isDialogueTyping = false;
    textEl.textContent = dialogueScript[dialogueStep].text;
    arrowEl.style.opacity = '1';
    if (dialogueScript[dialogueStep].choices) showInterviewChoices(dialogueScript[dialogueStep].choices);
    return;
  }
  if (choiceEl && choiceEl.style.display === 'flex') return;
  dialogueStep++;
  playInterviewStep();
}

// Liaisons d'événements
const dialogueBoxEl = document.getElementById('int-dialogue-box');
if (dialogueBoxEl) dialogueBoxEl.addEventListener('click', advanceInterview);
if (imgEl) {
    imgEl.addEventListener('click', () => { 
        bounceInterviewCharacter(); 
        advanceInterview(); 
    });
}


playInterviewStep();


//nav

const toggle = document.getElementById('navToggle');
const rings = document.querySelectorAll('.ring');

toggle.addEventListener('click', (e) => {
    e.preventDefault();
    circularNav.classList.toggle('is-open');
});

rings.forEach(ring => {
    ring.addEventListener('click', () => {
        const link = ring.getAttribute('data-link');
        
        circularNav.classList.remove('is-open');

        let targetElement = null;

        if (link === 'accueil') {
            targetElement = document.getElementById('video-container'); 
        } else if (link === 'oeuvres') {
            
            targetElement = document.querySelector('.bloc-s4').closest('.section-page');
        } else if (link === 'interview') {
            targetElement = document.querySelector('.interview-section'); 
        } else if (link === 'contact') {
            targetElement = document.querySelector('.site-footer'); 
        }

        
        if (targetElement) {
            targetElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    });
});

// bouton audio
const unmuteBtn = document.getElementById('unmute-btn');
const iconMuted = document.getElementById('icon-muted');
const iconUnmuted = document.getElementById('icon-unmuted');

unmuteBtn.addEventListener('click', () => {
    if (video.muted) {
        video.muted = false; 
        iconMuted.classList.add('hidden');
        iconUnmuted.classList.remove('hidden');
    } else {
        video.muted = true; 
        iconUnmuted.classList.add('hidden');
        iconMuted.classList.remove('hidden');
    }
});