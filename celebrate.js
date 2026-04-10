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
    wow: document.getElementById('sfx-wow')
};

// Volume Setup
sounds.piano.volume = 0.3;
sounds.hbd.volume = 0.3;
Object.keys(sounds).forEach(key => {
    if (!['piano', 'hbd'].includes(key)) sounds[key].volume = 1.0;
});

function playSfx(sfx) {
    if (!sfx) return;
    sfx.currentTime = 0;
    sfx.play();
}

function nextStep(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    step++;

    if (step === 1) {
        sounds.piano.play();
        playTransition(sounds.door, "It's pitch black in here... 🌑", "Turn on Light 💡", "room_dark.jpg");
    } else if (step === 2) {
        playTransition(sounds.light, "There we go! 💡", "Open the Curtain ✨", "room_lit.jpg", () => {
            document.body.classList.add('lit-room');
            document.getElementById('viewport').classList.add('lit-up');
        });
    } else if (step === 3) {
        playTransition(sounds.curtain, "SURPRISE! 🥳", "Wear the Cap! 👑", "party_scene.jpg");
    } else if (step === 4) {
        playTransition(sounds.cap, "You look wonderful! ❤️", "Bring the Cake 🎂", "with_cap.jpg");
    } else if (step === 5) {
        playTransition(sounds.cake, "A treat for you! 🎂", "Light the Candles 🕯️", "cake_static.jpg");
    } else if (step === 6) {
        playTransition(sounds.match, "Make a wish... 🌬️", "Blow them out!", "cake_lit.jpg");
    } else if (step === 7) {
        actionBox.style.visibility = 'hidden';
        sounds.piano.pause();
        sounds.firecrackers.play();
        const fcInterval = setInterval(createFirecrackerEffect, 150);
        setTimeout(() => { clearInterval(fcInterval); sounds.firecrackers.pause(); }, 4000);
        sounds.hbd.play();
        setTimeout(() => {
            gsap.to(sounds.hbd, { volume: 0, duration: 2, onComplete: () => {
                sounds.hbd.pause(); sounds.hbd.volume = 0.3;
                sounds.piano.play(); actionBox.style.visibility = 'visible';
            }});
        }, 13000);
        playTransition(sounds.blowing, "Wish granted! ✨", "Cut the Cake 🔪", "cake_blown.jpg");
    } else if (step === 8) {
        playTransition(sounds.cutting, "Time for cake! 🍰", "Wait, what's that? 😈", "cake_cut.jpg");
    } else if (step === 9) {
        playTransition(sounds.splat, "Oops! Messy birthday! 😂", "Let's eat! 🍰", "messy_face.jpg");
    } else if (step === 10) {
        playTransition(sounds.eating, "Yum! So sweet! 💖", "The Final Surprise 🎁", "eating_finished.jpg");
    } else if (step === 11) {
        playTransition(sounds.surprise, "One more thing for you...", "Open the Box 📦", "box_closed.jpg");
    } 
    // TROLL START
    else if (step === 12) {
        playTransition(sounds.empty, "Haha! It's empty! 😂", "Wait, I want a real gift! 🥺", "box_empty.png");
    } else if (step === 13) {
        playTransition(sounds.teddy, "Fine, fine... check again! ✨", "Open it one last time 🧸", "box_closedd.jpg");
    } 
    // TROLL END
    else if (step === 14) {
        playTransition(sounds.gift, "You're truly special! 💖", "", "gift_inside_teddy.jpg", () => {
            actionBox.style.display = 'none'; 
            smileBox.style.display = 'flex'; 
            confetti({ particleCount: 200, spread: 100 });
        });
    }
}

function playTransition(sfx, nextTopText, nextBtnText, nextImg, callback) {
    if (sfx) playSfx(sfx);
    gsap.to(media, { opacity: 0, duration: 1.0, onComplete: () => {
        media.src = nextImg;
        topText.textContent = nextTopText;
        btnText.textContent = nextBtnText;
        setTimeout(() => {
            gsap.to(media, { opacity: 1, duration: 1.0, onComplete: () => { 
                if (callback) callback(); 
            }});
        }, 50);
    }});
}

function triggerWow(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    sounds.wow.currentTime = 0;
    sounds.wow.play();
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
        cracker.textContent='💥'; gsap.to(cracker,{scale:2, opacity:0, duration:0.3, onComplete:()=>cracker.remove()});
    }});
}

document.addEventListener('mousemove', (e) => {
    gsap.to(".custom-cursor", { x: e.clientX-15, y: e.clientY-15, duration: 0.1 });
});
