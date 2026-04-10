// 1. Custom Heart Cursor
const cursor = document.querySelector('.custom-cursor');
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX - 15 + 'px';
    cursor.style.top = e.clientY - 15 + 'px';
});

// 2. Floating Elements (Same as cause.js)
function createFloatingElement() {
    const elements = ['🌸', '✨', '💖', '🦋', '⭐', '🐷'];
    const element = document.createElement('div');
    element.className = 'floating';
    element.textContent = elements[Math.floor(Math.random() * elements.length)];
    element.style.left = Math.random() * window.innerWidth + 'px';
    element.style.top = window.innerHeight + 50 + 'px';
    document.body.appendChild(element);

    gsap.to(element, {
        y: -window.innerHeight - 100,
        x: (Math.random() - 0.5) * 200,
        rotation: Math.random() * 360,
        duration: Math.random() * 5 + 5,
        opacity: 0,
        onComplete: () => element.remove()
    });
}
setInterval(createFloatingElement, 800);

// 3. UI Interactions
function startChallenge() {
    document.getElementById('main-content').style.display = 'none';
    document.getElementById('choice-area').style.display = 'flex';
}

// Runaway No Button
const noBtn = document.getElementById('no-button');
const runaway = () => {
    const x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
    const y = Math.random() * (window.innerHeight - noBtn.offsetHeight);
    noBtn.style.position = 'fixed';
    noBtn.style.left = x + 'px';
    noBtn.style.top = y + 'px';
};
noBtn.addEventListener('mouseover', runaway);
noBtn.addEventListener('click', runaway);

// 4. Final Celebration
function sayYes() {
    document.getElementById('choice-area').style.display = 'none';
    document.getElementById('success-area').style.display = 'block';

    // Play Clapping
    const audio = document.getElementById('clap-sound');
    audio.play().catch(() => console.log("Audio needs user interaction first"));

    // Burst of Emojis
    for(let i=0; i<30; i++) {
        setTimeout(createFloatingElement, i * 100);
    }

    // Heavy Fireworks (Long Duration)
    for(let i=0; i<25; i++) {
        setTimeout(launchFirework, i * 400);
    }
}

function launchFirework() {
    const colors = ['#ff69b4', '#ffd700', '#00f2ff', '#ffffff'];
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * (window.innerHeight * 0.5);

    for (let i = 0; i < 25; i++) {
        const p = document.createElement('div');
        p.className = 'firework';
        p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        p.style.left = x + 'px';
        p.style.top = y + 'px';
        document.body.appendChild(p);

        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 150 + 50;

        gsap.to(p, {
            x: Math.cos(angle) * velocity,
            y: Math.sin(angle) * velocity,
            opacity: 0,
            duration: 2,
            ease: "power2.out",
            onComplete: () => p.remove()
        });
    }
}