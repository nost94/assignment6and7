// --- 1. CONFIGURATION ---
const dialogue = document.getElementById('dialogue-box');
const princess = document.getElementById('princess');
const robot = document.getElementById('robot');
const priest = document.getElementById('priest');
const prince = document.getElementById('prince');
const startBtn = document.querySelector('button');

// --- 2. SPRITE ANIMATION ENGINE ---
class SpriteAnimator {
    constructor(element, totalFrames, frameWidth, speed) {
        this.element = element;
        this.totalFrames = totalFrames;
        this.width = frameWidth;
        this.speed = speed;
        this.currentFrame = 0;
        this.interval = null;
        this.isAnimating = false;
    }

    start() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        this.interval = setInterval(() => {
            // Shift background position to show next frame
            const positionX = -(this.currentFrame * this.width);
            this.element.style.backgroundPositionX = `${positionX}px`;
            
            this.currentFrame++;
            if (this.currentFrame >= this.totalFrames) {
                this.currentFrame = 0;
            }
        }, this.speed);
    }

    stop() {
        clearInterval(this.interval);
        this.isAnimating = false;
        this.currentFrame = 0;
        this.element.style.backgroundPositionX = '0px'; // Reset to idle frame
    }
}

// Initialize animators (Assuming 64px width per frame)
const princessAnim = new SpriteAnimator(princess, 4, 64, 150);
const robotAnim = new SpriteAnimator(robot, 4, 64, 150);
const priestAnim = new SpriteAnimator(priest, 2, 64, 200); 
const princeAnim = new SpriteAnimator(prince, 2, 64, 200);

// --- 3. HELPER FUNCTIONS ---

// Helper: Move element across screen using CSS transitions
function moveCharacter(element, destinationX, duration) {
    return new Promise(resolve => {
        element.style.transition = `left ${duration}ms linear`;
        element.style.left = `${destinationX}px`;
        // Resolve promise after movement finishes
        setTimeout(resolve, duration);
    });
}

function setText(text) {
    dialogue.innerText = text;
}

function jumpAction(element, times) {
    return new Promise(resolve => {
        let count = 0;
        element.style.transition = "bottom 0.2s ease";
        
        let jumpInterval = setInterval(() => {
            if(count % 2 === 0) {
                element.style.bottom = "100px"; // Jump up
            } else {
                element.style.bottom = "50px"; // Land
            }
            count++;
            if(count >= times * 2) {
                clearInterval(jumpInterval);
                resolve();
            }
        }, 200);
    });
}

function confuseAction(element) {
    element.style.transition = "transform 0.5s ease";
    let angle = 20;
    setInterval(() => {
        element.style.transform = `rotate(${angle}deg)`;
        angle = angle * -1;
    }, 500);
}

async function startScene() {
    // Reset positions and styles
    startBtn.style.display = 'none';
    princess.style.transition = 'none'; 
    robot.style.transition = 'none';
    princess.style.left = '-100px'; 
    robot.style.left = '-180px';
    priest.style.display = 'flex'; 
    
    setText("Dearly beloved, we've gathered here today...");
    

    princessAnim.start();
    robotAnim.start();

    const pMove1 = moveCharacter(princess, 250, 4000); // 4 seconds
    const rMove1 = moveCharacter(robot, 170, 4000);
    
    await Promise.all([pMove1, rMove1]); 

    setText("to witness princess Vespa going...");
    

    princessAnim.stop(); robotAnim.stop();
    princessAnim.speed = 50; robotAnim.speed = 50; 
    princessAnim.start(); robotAnim.start();


    const pMove2 = moveCharacter(princess, 900, 1500); // 1.5 seconds
    const rMove2 = moveCharacter(robot, 900, 1500);
    
    await Promise.all([pMove2, rMove2]);

    setText("...right past the altar and getting out the door!!!");
    
    princessAnim.stop(); 
    robotAnim.stop();

    priestAnim.start(); 
    await jumpAction(priest, 5); 
    priestAnim.stop();

    setText("What just happened?");
    
    priest.style.display = "none";

    confuseAction(prince);

}