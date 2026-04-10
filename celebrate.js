// Preload all story images to prevent lag during transitions
const storyImages = [
    "door_closed.jpg", "room_dark.jpg", "room_lit.jpg", 
    "party_scene.jpg", "with_cap.jpg", "cake_static.jpg", 
    "cake_lit.jpg", "cake_blown.jpg", "cake_cut.jpg", 
    "messy_face.jpg", "eating_finished.jpg", "box_closed.jpg", 
    "box_empty.png", "box_closedd.png", "gift_inside.jpg"
];

storyImages.forEach(src => {
    const img = new Image();
    img.src = src;
});
let step = 0;
const media = document.getElementById('main-image');
const actionBox = document.getElementById('action-box');
const btnText = document.getElementById('main-btn-text');
const topText = document.getElementById('top-text');
const smileBox = document.getElementById('final-wish-container');

const sounds = {
    piano: document.getElementById('bg-piano'),
    hbd: document.getElementById('bg-hbd'),
    firecrackers: document.getElementById('sfx-firecrackers'),
    door: document.getElementById('sfx-door'),
    light: document.getElementById('sfx-light'),
    curtain: document.getElementById('sfx-curtain'),
    cap: document.getElementById('sfx-cap'),
    cake: document.getElementById('sfx-cake'),
    match: document.getElementById('sfx-match'),
    blowing: document.getElementById('sfx-blowing'),
    cutting: document.getElementById('sfx-cutting'),
    splat: document.getElementById('sfx-splat'),
    eating: document.getElementById('sfx-eating'),
    surprise: document.getElementById('sfx-surprise'),
    empty: document.getElementById('sfx-empty'),
    teddy: document.getElementById('sfx-teddy'),
    gift: document.getElementById('sfx-gift'),
    wow: document.getElementById('sfx-wow'),
    balloonBurst: document.getElementById('sfx-balloon-burst'),
    laugh: document.getElementById('sfx-laugh'),
    wowEmoji: document.getElementById('sfx-wow-emoji'),
    partyEmoji: document.getElementById('sfx-party-emoji'),
    loveEmoji: document.getElementById('sfx-love-emoji'),
    // Affirmation Sounds
    beautiful: document.getElementById('sfx-beautiful'),
    enough: document.getElementById('sfx-enough'),
    kind: document.getElementById('sfx-kind'),
    doIt: document.getElementById('sfx-do-it'),
    proud: document.getElementById('sfx-proud'),
    trust: document.getElementById('sfx-trust'),
    deserve: document.getElementById('sfx-deserve'),
    strong: document.getElementById('sfx-strong')
};

sounds.piano.volume = 0.3;
sounds.hbd.volume = 0.3;

// --- CONFIGURATION ---

const config = {
    balloons: { chars: ['🎈', '🎈'], sound: sounds.balloonBurst },
    emojis: {
        chars: ['😂', '🤩', '🥳', '🥰'],
        sounds: { 
            '😂': sounds.laugh, 
            '🤩': sounds.wowEmoji, 
            '🥳': sounds.partyEmoji, 
            '🥰': sounds.loveEmoji 
        }
    },
    affirmations: {
        chars: ['🌸', '🌹', '🌼', '💐', '💖', '🎉', '✨', '🦋'],
        sounds: {
            '💖': sounds.beautiful, // "You are beautiful"
            '🌸': sounds.enough,    // "You are enough"
            '🌹': sounds.kind,      // "You are kind"
            '✨': sounds.doIt,      // "You can do it"
            '🎉': sounds.proud,     // "I am proud of you"
            '🌼': sounds.trust,     // "I trust you"
            '💐': sounds.deserve,   // "You deserve the best"
            '🦋': sounds.strong     // "You are so strong"
        }
    }
};

function spawnFlyer() {
    const rand = Math.random();
    let category, char;

    if (rand < 0.5) {
        category = 'affirmations';
        char = config.affirmations.chars[Math.floor(Math.random() * config.affirmations.chars.length)];
    } else if (rand < 0.8) {
        category = 'emojis';
        char = config.emojis.chars[Math.floor(Math.random() * config.emojis.chars.length)];
    } else {
        category = 'balloons';
        char = '🎈';
    }

    const f = document.createElement('div');
    f.className = 'flyer';
    if (category === 'affirmations') f.classList.add('flower-heart');
    f.textContent = char;
    f.style.left = Math.random() * 90 + 'vw';
    f.style.top = '110vh';
    document.getElementById('flying-zone').appendChild(f);

    // Slow and minimal movement rise
    gsap.to(f, {
        y: '-125vh',
        x: (Math.random() - 0.5) * 80,
        rotation: Math.random() * 180,
        duration: 15 + Math.random() * 5, 
        ease: "none",
        onComplete: () => f.remove()
    });

    const handleInteraction = (e) => {
        e.preventDefault();
        
        if (category === 'balloons') {
            if (navigator.vibrate) navigator.vibrate(60);
            if (config.balloons.sound) { 
                config.balloons.sound.currentTime = 0; 
                config.balloons.sound.play(); 
            }
            confetti({ 
                particleCount: 30, 
                origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight } 
            });
            f.remove();
        } else if (category === 'emojis') {
            const sfx = config.emojis.sounds[char];
            if (sfx) { sfx.currentTime = 0; sfx.play(); }
            
            // Disappear logic for emojis
            gsap.to(f, { 
                scale: 1.4, 
                opacity: 0, 
                duration: 0.2, 
                onComplete: () => f.remove() 
            });
        } else if (category === 'affirmations') {
            const sfx = config.affirmations.sounds[char];
            if (sfx) { sfx.currentTime = 0; sfx.play(); }
            
            // Disappear logic for affirmations
            gsap.to(f, { 
                scale: 1.4, 
                opacity: 0, 
                duration: 0.2, 
                onComplete: () => f.remove() 
            });
        }
    };

    f.addEventListener('mousedown', handleInteraction);
    f.addEventListener('touchstart', handleInteraction);
}

// Spawning interval
setInterval(spawnFlyer, 3000);

// --- STORY LOGIC ---

function playTransition(sfx, nextTopText, nextBtnText, nextImg, callback) {
    if (sfx) { sfx.currentTime = 0; sfx.play(); }
    gsap.to(media, { opacity: 0, duration: 1.0, onComplete: () => {
        media.src = nextImg;
        topText.textContent = nextTopText;
        btnText.textContent = nextBtnText;
        setTimeout(() => {
            gsap.to(media, { opacity: 1, duration: 1.0, onComplete: () => { if (callback) callback(); } });
        }, 50);
    }});
}

function nextStep(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    step++;
    if (step === 1) { sounds.piano.play(); playTransition(sounds.door, "It's pitch dark in here! 🌑", "Turn on Light 💡", "room_dark.jpg"); }
    else if (step === 2) { playTransition(sounds.light, "There we go! 💡", "Open the Curtain ✨", "room_lit.jpg", () => document.body.classList.add('lit-room')); }
    else if (step === 3) { playTransition(sounds.curtain, "SURPRISE! 🥳", "Wear the Cap! 👑", "party_scene.jpg"); }
    else if (step === 4) { playTransition(sounds.cap, "You look wonderful! ❤️", "Bring Me Cake 🎂", "with_cap.jpg"); }
    else if (step === 5) { playTransition(sounds.cake, "A treat for you! 🎂", "Light the Candles 🕯️", "cake_static.jpg"); }
    else if (step === 6) { playTransition(sounds.match, "Make a wish... 🌬️", "Blow them out!", "cake_lit.jpg"); }
    else if (step === 7) {
        actionBox.style.visibility = 'hidden'; sounds.piano.pause(); sounds.firecrackers.play();
        const fcInterval = setInterval(createFirecrackerEffect, 150);
        setTimeout(() => { clearInterval(fcInterval); sounds.firecrackers.pause(); }, 4000);
        sounds.hbd.play();
        setTimeout(() => {
            gsap.to(sounds.hbd, { volume: 0, duration: 2, onComplete: () => {
                sounds.hbd.pause(); sounds.hbd.volume = 0.3; sounds.piano.play(); actionBox.style.visibility = 'visible';
            }});
        }, 13000);
        playTransition(sounds.blowing, "Wish granted! ✨", "Cut the Cake 🔪", "cake_blown.jpg");
    }
    else if (step === 8) { playTransition(sounds.cutting, "Time for cake! 🍰", "Wait, what's that? 😈", "cake_cut.jpg"); }
    else if (step === 9) { playTransition(sounds.splat, "Oops! Messy birthday! 😂", "Let's eat! 🍰", "messy_face.jpg"); }
    else if (step === 10) { playTransition(sounds.eating, "Yum! So sweet! 💖", "The Final Surprise 🎁", "eating_finished.jpg"); }
    else if (step === 11) { playTransition(sounds.surprise, "One more thing for you...", "Open the Box 📦", "box_closed.jpg"); }
    else if (step === 12) { playTransition(sounds.empty, "Haha! It's empty! 😂", "Wait, I want a real gift! 🥺", "box_empty.webp"); }
    else if (step === 13) { playTransition(sounds.teddy, "Fine, fine... check again! ✨", "Open it one last time 🧸", "box_closedd.webp"); }
    else if (step === 14) {
        playTransition(sounds.gift, "You're truly special! 💖", "", "gift_inside.jpg", () => {
            actionBox.style.display = 'none'; smileBox.style.display = 'flex';
            confetti({ particleCount: 200, spread: 100 });
        });
    }
}

function triggerWow(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    sounds.wow.currentTime = 0; sounds.wow.play();
    confetti({ particleCount: 150, spread: 60 });
}

function createFirecrackerEffect() {
    const cracker = document.createElement('div');
    cracker.className = 'firecracker-particle';
    const side = ['top','bottom','left','right'][Math.floor(Math.random()*4)];
    let x, y;
    if(side==='top'){x=Math.random()*window.innerWidth;y=-50;}
    else if(side==='bottom'){x=Math.random()*window.innerWidth;y=window.innerHeight+50;}
    else if(side==='left'){x=-50;y=Math.random()*window.innerHeight;}
    else {x=window.innerWidth+50;y=Math.random()*window.innerHeight;}
    cracker.style.left=x+'px'; cracker.style.top=y+'px';
    cracker.textContent=['🧨','✨','💥'][Math.floor(Math.random()*3)];
    document.body.appendChild(cracker);
    gsap.to(cracker, { x:(window.innerWidth/2)-x, y:(window.innerHeight/2)-y, rotation:720, duration:0.8, onComplete:()=>{
        cracker.textContent='💥';
        gsap.to(cracker,{scale:2, opacity:0, duration:0.3, onComplete:()=>cracker.remove()});
    }});
}

document.addEventListener('mousemove', (e) => {
    gsap.to(".custom-cursor", { x: e.clientX-15, y: e.clientY-15, duration: 0.1 });
});
