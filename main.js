/*
* Frank Zheng
* June 3, 2025
* Submission for ICS3U culminating javascript project - Bugshot Roulette
* This game is a simple 2D game where the player and dealer take turns attacking each other with a cup of coffee, which happens to fire bugs. 
* Game Inspired by "Russian Roulette" and steam game "Buckshot Roulette"  - instructions provided in-game */

window.addEventListener('load', function () { // waits for the window & game assets to load before running the code
    // getting variables for canvas and context
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');

    // defining canvas dimensions
    canvas.width = 800;
    canvas.height = 600;

    // Elementary drawing functions (rect, circle, line, etc.)

    /** function to clear the canvas */
    function clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // clears all elements on canvas
    }

    /** 
     * Defines function to draw a circle with given parameters
     * @param x - x coordinate of the circle center
     * @param y - y coordinate of the circle center
     * @param r - radius of the circle
     */
    function circle(x, y, r, color) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, true); // 2pi, full rotation of circle
        ctx.closePath();
        ctx.fillStyle = color // setting fill color
        ctx.fill();
    }

    /**
     * Defines function to draw a rectangle with given parameters
     * @param x - x coordinate of the top left corner of the rectangle
     * @param y - y coordinate of the top left corner of the rectangle
     * @param w - width of the rectangle
     * @param h - height of the rectangle
     * @param fill - fill color of the rectangle
     */
    function rect(x, y, w, h, fill) {
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.closePath();
        ctx.fillStyle = fill; // setting fill color
        ctx.fill();
    }

    /**
     * Defines function to draw a line with given parameters
     * @param x1 - x coordinate of the first point (start)
     * @param y1 - y coordinate of the first point (start)
     * @param x2 - x coordinate of the second point (end)
     * @param y2 - y coordinate of the second point (end)
     * @param stroke - stroke color of the line
     */
    function line(x1, y1, x2, y2, stroke) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = stroke; // setting stroke color
        ctx.stroke();
    }

    // functions to draw game board

    /**defines function to create and place player and dealer images*/
    function drawPlayers() {
        if (currentLevel === 0) { // if the current level is 0 (starting screen)
            // place player and dealer to the far right side of the screen at level 0
            ctx.drawImage(playerIdle, 500, 400); // far right for player
            ctx.drawImage(dealerIdle, 500, 25); // far right for dealer
        } else {
            // Normal positions for other levels
            if (hoveredItem != "player" || !gunClicked) { // checks if the player is NOT hovered or if the gun is NOT clicked
                ctx.drawImage(playerIdle, 350, 400); // draws default player image
            }
            if (hoveredItem != "dealer" || !gunClicked) { // checks if the dealer is NOT hovered or if the gun is NOT clicked
                ctx.drawImage(dealerIdle, 350, 25); // draws default dealer image
            }
        }
    }

    /**
     * Defines function to draw player arm with a circle at the end
     * @param x - x coordinate of the hand
     * @param y - y coordinate of the hand
     */
    function drawArm(x, y) {
        arm(x, y, "rgb(184, 152, 103)");
        circle(x, y, 13, "rgb(47, 150, 207)");
    }

    /**
     * Defines function to draw dealer arm with a circle at the end
     * @param x - x coordinate of the hand
     * @param y - y coordinate of the hand
     */
    function drawDealerArm(x, y) {
        dealerArm(x, y, "rgb(184, 152, 103)");
        circle(x, y, 13, "rgb(207, 47, 47)");
    }

    /**
     * Defines function to animate dealer arm
     * @param x - x coordinate of the hand
     * @param y - y coordinate of the hand
     * @param color - color of the arm
     */
    function dealerArm(x, y, color) {
        // default shoulder position
        let shoulderX = 362;
        let shoulderY = 54;

        // scales shoulders when dealer is hovered
        if (hoveredItem === "dealer" && gunClicked) {
            shoulderX = 340;
            shoulderY = 54;
        }

        // different shoulder position for starting screen
        if (currentLevel === 0) {
            shoulderX = 512;
            shoulderY = 53;
            dealerHandX = 512;
            dealerHandY = 185;
        }

        const width = 22; // arm width

        // calculating displacement from the hand (x, y) to shoulders
        const dx = x - shoulderX;
        const dy = y - shoulderY;

        // calculating length of arm via pythagorean theorem
        const length = Math.sqrt(dx * dx + dy * dy);

        // creating a normal vector to the span of the arm
        const nx = -dy / length;
        const ny = dx / length;

        // defining corners of the arm which forms a rectangle pivoting shoulder
        const x1 = shoulderX + nx * width / 2;
        const y1 = shoulderY + ny * width / 2;
        const x2 = shoulderX - nx * width / 2;
        const y2 = shoulderY - ny * width / 2;
        const x3 = x - nx * width / 2;
        const y3 = y - ny * width / 2;
        const x4 = x + nx * width / 2;
        const y4 = y + ny * width / 2;

        // drawing arm
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.lineTo(x4, y4);
        ctx.closePath();
        ctx.fillStyle = color; // filling color
        ctx.fill();
    }

    /**
     * Defines function to animate player arm
     * Similar to code above, but for the player arm
     * @param x - x coordinate of the mouse (hand)
     * @param y - y coordinate of the mouse (hand)
     * @param color - color of the arm
     */
    function arm(x, y, color) {
        // default shoulder position
        let shoulderX = 364;
        let shoulderY = 544;

        const width = 22; // arm width

        if (currentLevel === 0) { // different shoulder position for starting screen
            shoulderX = 513;
            shoulderY = 540;
        }

        // calculating displacement from the hand (x, y) to shoulders
        const dx = x - shoulderX;
        const dy = y - shoulderY;

        // calculating length of arm via pythagorean theorem
        const length = Math.sqrt(dx * dx + dy * dy);

        // creating a normal vector to the span of the arm
        const nx = -dy / length;
        const ny = dx / length;

        // defining corners of the arm which forms a rectangle pivoting shoulder
        const x1 = shoulderX + nx * width / 2;
        const y1 = shoulderY + ny * width / 2;
        const x2 = shoulderX - nx * width / 2;
        const y2 = shoulderY - ny * width / 2;
        const x3 = x - nx * width / 2;
        const y3 = y - ny * width / 2;
        const x4 = x + nx * width / 2;
        const y4 = y + ny * width / 2;

        // drawing arm
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.lineTo(x4, y4);
        ctx.closePath();
        ctx.fillStyle = color; // filling color
        ctx.fill();
    }

    /**
     * defines function to animate dealer arm gliding towards target
     * @param targetX - x coordinate of the target position
     * @param targetY - y coordinate of the target position
     */
    function dealerArmTo(targetX, targetY) {
        const speed = 0.05 // glide speed

        // update position towards target by finding displacement and multiplying by gliding speed
        dealerHandX += (targetX - dealerHandX) * speed;
        dealerHandY += (targetY - dealerHandY) * speed;

        // check if the hand is close to the target
        if (Math.abs(dealerHandX - targetX) < 1 && Math.abs(dealerHandY - targetY) < 1) { // if both the x and y distances from the target is less than 1 px
            dealerHandX = targetX; // snaps exactly to target
            dealerHandY = targetY; // snaps exactly to target
            moveDone = true; // sets the moveDone flag to true - hand is done moving
        }
    }

    /** defines function to animate and show the end screen */
    function drawEndScreen() {
        if (!showEndScreen) { // checks if the end screen is active
            return; // if the end screen is not active, exit
        }

        // fading in the end screen
        if (endScreenAlpha < 1) { // if the end screen alpha is less than 1 (not fully opaque)
            endScreenAlpha += 0.01; // increases the alpha value to make the end screen less transparent (more opaque)
        } else { // if the end screen alpha is 1 (fully opaque)
            endScreenAlpha = 1; // sets the alpha value to 1 (fully opaque)
            gameOverFlag = true; // sets the game over flag to true, so the game stops running
        }

        ctx.save();
        ctx.globalAlpha = endScreenAlpha; // sets the global alpha value to the endScreenAlpha, so everything drawn will be translucent
        ctx.fillStyle = "rgba(0, 0, 0, 0.9)"; // sets the fill style to a semi-transparent black
        ctx.fillRect(0, 0, canvas.width, canvas.height); // fills the entire canvas with the semi-transparent black rectangle

        // text configurations
        ctx.fillStyle = "white";
        ctx.font = "bold 64px Orbitron, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // calculating the position to center the text - split by \n is explained in text() function
        const lines = endScreenMessage.split('\n');
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], canvas.width / 2, (canvas.height / 2 - 80) + (i * 80)); // draws the endScreenMessage centered
        }

        ctx.restore();
    }

    /** defines function to draw the item slots */
    function itemSlots() {
        // placing item slots
        ctx.drawImage(itemBlank, 175, 100);
        ctx.drawImage(itemBlank, 75, 100);
        ctx.drawImage(itemBlank, 75, 400);
        ctx.drawImage(itemBlank, 175, 400);
    }

    /** draws the gun on the canvas */
    function drawGun() {
        if (followDealer) { // if the dealer is holding the gun
            ctx.drawImage(heldGun, dealerHandX - gun.width / 2, dealerHandY - gun.height / 2); // draws the held gun at the dealer's hand position
        } else if (!gunClicked) { // if the gun is not clicked
            ctx.drawImage(gun, 400, 223); // draws the gun at the center of the canvas (idle position)
        } else { // if the gun is clicked and not held by dealer
            ctx.drawImage(heldGun, mouseX - gun.width / 2, mouseY - gun.height / 2); // draws the held gun at the mouse position
        }

    }

    /** draws the board with the dealer's and player's lives */
    function drawBoard() {
        // drawing the board background and line in the middle
        rect(600, 250, 190, 100, "rgb(153, 153, 153)");
        line(600, 300, 790, 300, "black");
    }

    /**
     * defines function to draw the hitbox items on the canvas
     * @param item - the item to be drawn
     * @param image - the image to be drawn for the item
    */
    function drawHitboxItem(item, image) {
        ctx.save();

        // defining centering for scaling of hovered item - center calculated by taking the x and y position of the item and adding half of its width and height
        const centerX = item.x + item.width / 2;
        const centerY = item.y + item.height / 2;

        if (hoveredItem === item.name) { // checks if the item is hovered
            ctx.translate(centerX, centerY); // translates the canvas to the center of the item
            ctx.scale(1.2, 1.2); // scales the item by 20% to make it larger
            ctx.translate(-centerX, -centerY); // translates the canvas back to the original position
        }

        if (!followDealer) { // if the dealer is not holding the gun
            if (item.name != "gun" && item.name != "loadBulletsButton") { // if the item is not the gun or the load bullets button
                if (gunClicked) { // if the gun is clicked
                    if (item.name === "dealer" || item.name === "player") { // checks if the item is the dealer or player
                        if (item.name === "player") { // checks if the item is the player
                            ctx.drawImage(image, item.x, item.y - 75); // special case to make sure player is scaled properly - draws the scaled player at its original position, but with a y offset of -75 to center it
                        } else { // if the item is the dealer
                            ctx.drawImage(image, item.x, item.y); // draws the scaled dealer at its original position
                        }
                    }
                } else { // if the gun is not clicked
                    if (item.name != "dealer" && item.name != "player") { // if the item is not the dealer or player
                        ctx.drawImage(image, item.x, item.y); // draws the scaled version of the item at its original position
                    }
                }
            } else if (item.name === "loadBulletsButton") { // if the item is the load bullets button, special case
                if (btnVisible && requiresBullets) { // if the button is visible and requires bullets
                    ctx.drawImage(image, item.x, item.y); // draws the scaled load bullets button at its original position
                }
            } else { // if the item is the gun
                if (!gunClicked) { // if the gun is not clicked
                    ctx.drawImage(image, item.x, item.y); // draws the scaled gun at its original position
                }
            }
        }

        ctx.restore();
    }

    /** defines function to continuously draw the powerups on the canvas */
    function drawPowerups() {
        for (let i = 0; i < playerPowerups.length; i++) { // runs through all elements of the playerPowerups array
            if (playerPowerups[i] != 0) { // runs if the slot "i" is not empty
                ctx.drawImage(playerPowerups[i].image, 85 + i * 100, 410); // draws the powerup image depending on the location of the powerup in the array (which slot)
            }
        }
        for (let i = 0; i < dealerPowerups.length; i++) { // runs through all elements of the dealerPowerups array
            if (dealerPowerups[i] != 0) { // runs if the slot "i" is not empty
                ctx.drawImage(dealerPowerups[i].image, 85 + i * 100, 110); // draws the powerup image depending on the location of the powerup in the array (which slot)
            }
        }
    }

    /**
     * defines function to continuously update/animate the player hearts (lives on side of screen)
     * @param lives - array of lives (1 - live heart, 2 - fragile heart, 0 - no heart)
     */
    function playerHearts(lives) {

        ctx.clearRect(610, 305, 180, 40); // clears the previously drawn hearts
        rect(610, 305, 180, 40, "rgb(153, 153, 153)"); // redraws the erased section of board

        var index = 0; // variable for indexing the hearts (used for positioning)
        for (const element of lives) { // for every element in the lives array
            if (element != 0) { // checks if the element is not 0 (0 - no heart), aka. has a heart to be drawn
                if (element === 1) {   // checks if the element is a live heart (1)
                    ctx.drawImage(heart, 612 + index * 35, 310); // draws a normal heart at the indexed positon
                } else { // if the element is a fragile heart (2)
                    ctx.drawImage(fragileHeart, 612 + index * 35, 310); // draws a fragile heart at the indexed position
                }
                index++; // increments the index for the next heart
            }
        }
    }

    /**
     * defines function to continuously update/animate the dealer hearts (lives on side of screen)
     * similar to playerHearts function above
     * @param lives - array of lives (1 - live heart, 2 - fragile heart, 0 - no heart)
     */
    function dealerHearts(lives) {

        ctx.clearRect(610, 255, 180, 40); // clears the previously drawn hearts
        rect(610, 255, 180, 40, "rgb(153, 153, 153)"); // redraws the erased section of board

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2) // centers canvas point of rotation
        ctx.rotate(Math.PI); // rotates canvas by 180 degreees

        // all other code is the same as playerHearts - see above for documentation, slightly adjusted for placing dealerHearts
        var index = 0;
        for (const element of lives) {
            if (element != 0) {
                if (element === 1) {
                    ctx.drawImage(heart, -380 + index * 35, 10);
                } else {
                    ctx.drawImage(fragileHeart, -380 + index * 35, 10);
                }
                index++;
            }
        }
        ctx.restore();
    }

    // Animation functions

    /** defines function to animate the load bullets button */
    function animateLoadBulletsButton() {
        // defining dimensions
        let btnY = 100; // y position for the button
        let btnTargetX = 625; // target position for the button to slide in
        let btnWidth = 150;
        let btnHeight = 50;

        // checking if button should be displayed
        if (!requiresBullets) { // if the requiresBullets flag is false, do not display the button
            return;
        }

        // animate sliding
        if (btnX > btnTargetX) { // if the button is not at the target position
            btnX -= slideSpeed; // slide the button towards the target position
        } else { // if the button is at the target position
            btnVisible = true; // slide complete
        }

        ctx.save();

        // drawing backdrop
        rect(btnX, btnY, btnWidth, btnHeight, "rgb(104, 104, 104)");

        // text configurations
        ctx.fillStyle = "white";
        ctx.font = "16px Orbitron, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText("Load Bullets", btnX + btnWidth / 2, btnY + btnHeight / 2); // draws the button text

        ctx.restore();
    }

    /** defines function to animate the crawling bullets whenever pushed into the array */
    function animateCrawlingBullets() {
        for (let i = crawlingBullets.length - 1; i >= 0; i--) { // look at every element of the crawlingBullets array, in reverse
            let bullet = crawlingBullets[i]; // takes an element to be stored in "bullet"

            let dy = bullet.targetY - bullet.y; // calculates displacement to the target by taking the difference from current bulletY to targetY
            let dist = Math.abs(dy); // absolute value for distance

            if (dist < 3) { // if the bullet is close enough to the target, remove it from the array
                crawlingBullets.splice(i, 1); // remove the bullet when it has arrived by splicing element at index i of the array, size 1
                continue;
            }

            // move the bullet towards the target
            bullet.y += (dy / dist) * 3; // moves the bullet towards the target by calculating the displacement and multiplying it by a speed factor (3 px)
            bullet.x = 450; // constant x position for the bullet, since it is always shot from the center of the gun

            // draw the bullet image at its new position (offset slightly to center it)
            ctx.drawImage(bullet.image, bullet.x - 57, bullet.y - 65);
        }
    }

    /** defines function to animate the bullets in the chamber to be shown to the player*/
    function animateBullets() {
        // defining dimensions
        let barY = 350; // y position for the bar
        let barTargetX = 550; // sliding target position
        let barWidth = 240;
        let barHeight = 50;

        // checking if bullets should be displayed
        if (!showBullets) { // if the showBullets flag is false, do not display the bullets
            return;
        }

        // animate sliding
        if (barX > barTargetX) { // if the bar is not at the target position
            barX -= slideSpeed; // slide the bar towards the target position
        }

        // fading out after 5 seconds of display
        if (barFade && barAlpha > 0) { // if the barFade flag is true and the barAlpha is greater than 0
            barAlpha -= 0.01; // decrease the alpha value to make the bar more transparent
            if (barAlpha <= 0) { // if the barAlpha is less than or equal to 0
                barAlpha = 0; // resets the barAlpha to 0 (fully transparent)
                showBullets = false; // resets bullet visibility flag - finished showing chamber
                barX = 810 // resets bar position for next chamber reload
            }
        }

        ctx.save()
        ctx.globalAlpha = barAlpha; // setting the alpha value to barAlpha such that anything drawn will be translucent

        // drawing backdrop (bar)
        rect(barX, barY, barWidth, barHeight, "rgb(104, 104, 104)");

        // drawing bullets for display
        let spacing = 33;

        for (let i = 0; i < displayBullets.length; i++) { // looks at each index of the displayBullets array
            if (displayBullets[i] === 1) { // if the element is a blank bullet (1)
                ctx.drawImage(blankBullet, barX + 10 + i * spacing, barY + 5); // draws a blank bullet at the indexed position
            } else { // if the element is a live bullet (2)
                ctx.drawImage(liveBullet, barX + 10 + i * spacing, barY + 5); // draws a live bullet at the indexed position
            }
        }

        ctx.restore();

    }

    /** defines function to animate the magnify powerup */
    function animateMagnify() {
        if (magnifyActive) { // if magnifyActive flag is active
            // getting gun position and slide position
            const gunX = 400 + gun.width / 2;
            const gunY = 300;
            const slideDistance = 80; // how far to slide out

            // calculate bullet position
            const offset = magnifyProgress * slideDistance; // offset for the bullet position based on magnifyProgress
            const bulletTargetX = gunX + offset; // target x position for the bullet based on the gun position and offset
            const bulletY = gunY; // y position for the bullet, same as gunY

            // get image based on bullet type
            let bulletImg;
            if (magnifyType === 1) { // if magnifyType is 1, it is a blank round
                bulletImg = blankBullet; // blank round
            } else { // if magnifyType is 2, it is a live round
                bulletImg = liveBullet; // live round
            }

            // drawing the bullet
            ctx.save();
            ctx.drawImage(bulletImg, bulletTargetX - bulletImg.width / 2, bulletY - bulletImg.height / 2); // draws the bullet at the target position, offset by half of its width and height to center it
            ctx.restore();

            // animation
            if (magnifyDirection === 1) { // if magnify is moving out
                magnifyProgress += 0.02; // moving out
                if (magnifyProgress >= 1) { // if magnifyProgress is greater than or equal to 1
                    magnifyProgress = 1; // sets magnifyProgress to 1 (fully out)
                    magnifyDirection = -1; // changes direction to move back in
                }
            } else { // if magnify is moving back in
                magnifyProgress -= 0.02; // moving back in
                if (magnifyProgress <= 0) { // if magnifyProgress is less than or equal to 0
                    magnifyProgress = 0; // sets magnifyProgress to 0 (fully back in)
                    magnifyActive = false; // sets magnifyActive to false to stop the animation
                }
            }
        }
    }

    /** defines function to animate the level transition */
    function drawLevelTransition() {
        if (!showLevelTransition) { // checks if the level transition is active
            return; // if the level transition is not active, exit
        }

        // animation progress (0 to 1)
        levelTransitionProgress += 0.03; // increases the level transition progress by 0.03 each frame
        if (levelTransitionProgress > 2) { // if the level transition progress is greater than 2 - a little off the screen to complete the animation
            showLevelTransition = false; // sets the showLevelTransition flag to false to stop the animation
            turn = 1; // resets the turn to 1 for the next level
            levelTransitionProgress = 0; // resets the level transition progress to 0 for the next level transition
            return;
        }

        // rectangle slide-in from left to right - dimensions and position
        const rectWidth = 500;
        const rectHeight = 120;
        const baseX = 150;
        const baseY = 240;

        // jiggle effect: left and right sides move at different rates
        const leftOffset = -rectWidth + rectWidth * levelTransitionProgress + Math.sin(Date.now() / 120) * 10; // performs sinusoidal calculations to create a wave-like effect on the left side of the rectangle - https://joshondesign.com/p/books/canvasdeepdive/chapter05.html
        const rightOffset = Math.min(rectWidth * levelTransitionProgress + Math.cos(Date.now() / 180) * 10, rectWidth); // performs sinusoidal calculations to create a wave-like effect on the right side of the rectangle - https://joshondesign.com/p/books/canvasdeepdive/chapter05.html

        // drawing the level transition rectangle
        ctx.save();
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        // top edge
        ctx.moveTo(baseX + leftOffset, baseY);
        ctx.lineTo(baseX + rightOffset, baseY);
        // right edge
        ctx.lineTo(baseX + rightOffset, baseY + rectHeight);
        // bottom edge
        ctx.lineTo(baseX + leftOffset, baseY + rectHeight);
        // left edge
        ctx.closePath();
        ctx.fillStyle = "#222";
        ctx.fill();

        // draw the level message
        ctx.globalAlpha = 1;
        // text configurations
        ctx.fillStyle = "#fff";
        ctx.font = "bold 48px Orbitron, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText(levelTransitionMessage, baseX + rectWidth / 2, baseY + rectHeight / 2); // draws the level transition message at the center of the rectangle

        ctx.restore();
    }

    // Utility functions

    /**
    * defines function to shuffle an array using the Fisher-Yates algorithm - https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
    * @param array - the array to be shuffled
    */
    function shuffle(array) {
        let currentIndex = array.length; // sets "currentIndex" to be the final value of the array (starting form the final value)

        while (currentIndex != 0) { // runs until all elements are analyzed
            let randomIndex = Math.floor(Math.random() * currentIndex) // selects a random index of the array out of the remaining indices
            currentIndex--; // // decrements the currentIndex to analyze the next element
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]; // creates a temporary array to invert the positions of the two elements (element at currentIndex is swapped with element at randomIndex and vice versa.)
        }
    }

    /** defines function which checks each frame to see if an action has completed */
    function waitFor(condition, callback) {
        function check() {
            if (condition()) { // checks condition, if done, check is done
                callback(); // wait has , run code
            } else { // checks condition, if not done, check needs to keep running
                requestAnimationFrame(check); // keep checking by requesting another frame
            }
        }
        check(); // begins checkcompleted
    }

    /**Gets the last non-zero element of an array*/
    function getLastElementIndex(array) {
        let finalIndex = 0; // begins by assuming the first element is the very last non-zero element
        for (let i = 0; i < array.length; i++) { // looks at every element in the array, starts by looking at the first element (index 0)
            if (array[i] != 0) { // if the current element is non-zero...
                finalIndex = i; // set finalIndex to the new non-zero index
            }
        }
        return finalIndex;
    }

    /**
     * defines a function to print text at a designated spot with designated font
     * @param message - the message to be displayed
     * @param x - x position of the text
     * @param y - y position of the text
     * @param font - the font of the text as a string
     */
    function text(message, x, y, font) {
        // text configurations
        ctx.save();
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.font = font;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";

        // split message by \n and draw each line
        const lines = message.split('\n'); // splits the message by each '\n' character
        for (let i = 0; i < lines.length; i++) { // runs through each line of the message
            ctx.fillText(lines[i], x, y + i * 24); // creates text according to the x and y position, with a line height of 24px - uses i to offset the y position for each line
        }

        ctx.restore();
    }

    // Text-related functions

    /** draws the description of the powerup in the hovered slot */
    function description() {
        if (hoveredItem !== lastHoveredItem) { // checks if the hovered item has changed
            if (hoveredItem === "playerLeftSlot" && playerPowerups[0] != 0) { // checks if the hovered item is the player's left slot and if there is a powerup in that slot
                gameMessage = "Powerup: " + playerPowerups[0].description; // sets the game message to the description of the powerup in the player's left slot
            } else if (hoveredItem === "playerRightSlot" && playerPowerups[1] != 0) { // checks if the hovered item is the player's right slot and if there is a powerup in that slot
                gameMessage = "Powerup: " + playerPowerups[1].description; // sets the game message to the description of the powerup in the player's right slot
            }
            if (hoveredItem === "dealerLeftSlot" && dealerPowerups[0] != 0) { // checks if the hovered item is the dealer's left slot and if there is a powerup in that slot
                gameMessage = "Powerup: " + dealerPowerups[0].description; // sets the game message to the description of the powerup in the dealer's left slot
            } else if (hoveredItem === "dealerRightSlot" && dealerPowerups[1] != 0) { // checks if the hovered item is the dealer's right slot and if there is a powerup in that slot
                gameMessage = "Powerup: " + dealerPowerups[1].description; // sets the game message to the description of the powerup in the dealer's right slot
            }
        }

        lastHoveredItem = hoveredItem; // sets the last hovered item to the current hovered item to refresh the description only when the hovered item changes
    }

    /** defines function to continuously display the game status on the canvas */
    function gameStatus(message) {
        ctx.save();

        // text configurations
        ctx.fillStyle = "black";
        ctx.font = "bold 16px Orbitron, sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";

        // split message by \n and draw each line - fully explained in text() function
        const lines = message.split('\n');
        for (let i = 0; i < lines.length; i++) { // iterates through each line of the message
            ctx.fillText(lines[i], 25, 300 + i * 24); // draws the line at the specified position
        }
        ctx.restore();
    }

    /** defines function to continously display active powerups on the canvas */
    function powerupsActive(message) {
        // displaying active powerups
        ctx.save();

        // text configurations
        ctx.fillStyle = "black";
        ctx.font = "bold 16px Orbitron, sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";

        // split message by \n and draw each line - fully explained in text() function
        const lines = message.split('\n');
        for (let i = 0; i < lines.length; i++) { // iterates through each line of the message
            ctx.fillText(lines[i], 600, 450 + i * 24); // draws the line at the specified position
        }
        ctx.restore();
    }

    /**
     * defines function to end the game and display the end screen
     * @param result - boolean value indicating the result of the game (true for win, false for loss)
     */
    function gameOver(result) {
        showEndScreen = true; // sets the end screen flag to true
        endScreenAlpha = 0; // resets the end screen alpha (transparency) to 0
        if (result) { // if the result is a win
            endScreenMessage = "You win!\nCongratulations!\nPress F5 to replay"; // sets the end screen message to a win message
        } else { // if the result is a loss
            endScreenMessage = "You lose!\nBetter luck next time!\nPress F5 to replay"; // sets the end screen message to a loss message
        }
    }

    /** defines function to draw the starting screen */
    function startingScreen() {
        ctx.save();

        // text configurations
        ctx.fillStyle = "rgb(136, 134, 19)";
        ctx.font = "bold 48px Orbitron, sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";


        ctx.fillText("Bugshot Roulette", 50, 100); // game title
        text("- By Frank Zheng", 50, 150, "bold 16px Orbitron, sans-serif"); // game author (subtitle)

        ctx.drawImage(start, 50, 250); // draws the start button
        ctx.restore();
    }

    // Game control functions

    /** defines function to check if the player or dealer has no lives left */
    function checkLives() {
        if (playerLives[0] === 0) { // if the player loses all lives
            gameOver(false); // end the game in a loss
        }

        if (dealerLives[0] === 0) { // if the dealer loses all lives
            if (currentLevel < 3) { // if the current level is less than 3
                waitFor(() => crawlingBullets.length === 0, () => { // waits for the bullet to reach the dealer before proceeding
                    nextLevel(); // if the dealer has no lives left, go to the next level
                });
            } else { // if the current level is 3 (final level)
                gameOver(true); // end the game in a win
            }
        }
    }

    /** defines function to increment and update the level & adjust variables */
    function nextLevel() {
        displayBullets = []; // resets the displayBullets array to empty
        bullets = []; // resets the bullets array to empty
        requiresBullets = true; // sets the requiresBullets flag to true, so the load bullets button is displayed
        currentLevel++; // increments the current level by 1
        turn = 1; // resets so that it is the player's turn again
        switch (currentLevel) { // looks at currentLevel and assigns starting lives arrays
            case 1: // if the current level is 1
                playerLives = [1, 1, 0, 0, 0];
                dealerLives = [1, 1, 0, 0, 0];
                break;
            case 2: // if the current level is 2
                playerLives = [1, 1, 1, 1, 0];
                dealerLives = [1, 1, 1, 1, 0];
                gameMessage = "Powerups now spawn when the gun is loaded!\nHover to see their effects!"; // displays a message that powerups will now spawn
                break;
            case 3: // if the current level is 3
                playerLives = [2, 2, 1, 1, 1];
                dealerLives = [2, 2, 1, 1, 1];
                gameMessage = "Sudden death with some new mechanics!\nYou cannot heal the fragile (cracked) hearts!"; // displays a message about fragileHeart mechanics
                break;
        }

        // level transition animation
        showLevelTransition = true; // sets the showLevelTransition flag to true, so the level transition animation is displayed
        levelTransitionProgress = 0; // resets the level transition progress to 0 for start of level transition animation
        levelTransitionMessage = "Level " + currentLevel; // sets the level transition message to the current level
    }

    /** defines function to continuously check if bullets should be displayed */
    function createDisplayBullets() {
        // creating displayBullets
        switch (currentLevel) { // creates different displayBullets arrays depending on the current level
            case 1: // if the current level is 1
                displayBullets = [9, 9, 9]; // 9 - placeholder for either a live or blank to be generated
                break;
            case 2: // if the current level is 2
                displayBullets = [9, 9, 9, 9, 9]; // 9 - placeholder for either a live or blank to be generated
                break;
            case 3: // if the current level is 3
                displayBullets = [9, 9, 9, 9, 9, 9, 9]; // 9 - placeholder for either a live or blank to be generated
                break;
        }
        let minimumLive = Math.floor(displayBullets.length / 2.0); // calculates the minimum number of live rounds generated by dividing the total number of rounds by 2 and flooring
        for (let i = 0; i < displayBullets.length; i++) { // iterates through the displayBullets array to generate live and blank rounds
            displayBullets[i] = Math.floor(Math.random() * 2) + 1; // replaces the current element with a 1 or a 2 (1 - live round, 2 - blank)
        }
        // checks how many live rounds there are in the chamber
        let currentLive = 0; // counter to track how many live rounds are in the chamber
        for (const element of displayBullets) { // looks at each element of the displayBullets
            if (element === 2) { // checks if the element is a live round (2)
                currentLive++; // increments the currentLive counter
            }
        }

        // ensures that the number of live rounds satisfies minimumLive count
        while (currentLive < minimumLive) { // while the number of live rounds is less than the minimum required
            let randomIndex = Math.floor(Math.random() * (displayBullets.length)); // generates a random index of the displayBullets array
            if (displayBullets[randomIndex] === 1) { // checks if the element at the random index is a blank (1)
                displayBullets[randomIndex] = 2; // sets the element to a live round (2)
                currentLive++; // increments the number of live rounds
            }
        }

        // ensures that the chamber is not fully live rounds
        while (currentLive === displayBullets.length) { // while the number of live rounds is equal to the total number of rounds
            let randomIndex = Math.floor(Math.random() * (displayBullets.length)); // generates a random index of the displayBullets array
            displayBullets[randomIndex] = 1; // sets the element to a blank round to ensure chamber is not fully live
            currentLive--; // decrements the number of live rounds
        }
    }

    /** defines function to create the actual bullets array */
    function createBullets() {
        // creating actual bullets array to be used in the gun
        bullets = [...displayBullets]; // makes a copy of the displayBullets - spread operation, written to bullets array
        shuffle(bullets); // shuffles the array
    }

    /** function which allows the player to shoot */
    function shoot() {
        if (!gunClicked) { // if the gun is not activated or if bullet is not ready to be fired -> exit
            return;
        }

        let firedBullet = bullets.shift(); // gets the bullet to be fired
        gunClicked = false; // "unequips" the gun

        // checking if the chamber is empty
        if (bullets.length === 0) { // if the bullets array is empty
            requiresBullets = true; // shows the load bullets button
        }

        let lastIndex = 0; // variable to later store the last index of the lives array

        // setting parameters for shooting animation
        let targetY = clickedItem === "dealer"
            ? 75 // if dealer is the target, set the target y position to 75
            : 525; // if dealer is the target, set the target y position to 525
        let bugImage = firedBullet === 2
            ? redBug // if live round is fired
            : greyBug; // if blank round is fired

        // using downwards bug image if moving towards player
        if (clickedItem === "player" && firedBullet === 2) { // if live bullet
            bugImage = redBugDown; // setting bug image to redBugDown
        } else if (clickedItem === "player" && firedBullet === 1) { // if blank bullet
            bugImage = greyBugDown; // setting bug image to greyBugDown
        }

        // pushes parameteres above to crawlingBullets, along with additional information and conditions
        crawlingBullets.push({ // adds a new bullet to the crawlingBullets array
            x: 400, // starting position (cup)
            y: 300,
            targetX: 450, // target position
            targetY: targetY,
            image: bugImage, // image to be used for the bullet
            hit: false // hit flag to check if the bullet has hit the target
        });

        if (clickedItem === "dealer") { // if the dealer is the target
            turn++; // no matter the fired bullet, switch turns
            if (firedBullet === 2) { // if a live round is fired
                if (doubleDamage) { // if double damage is active, run lose life twice
                    lastIndex = getLastElementIndex(dealerLives); // gets the location of the last heart (non-zero element)
                    dealerLives[lastIndex] = 0; // removes a life from the array (set to element 0)
                    lastIndex = getLastElementIndex(dealerLives); // gets the location of the last heart (non-zero element)
                    dealerLives[lastIndex] = 0; // removes a life from the array (set to element 0)
                } else { // if double damage is not active, run lose life once
                    lastIndex = getLastElementIndex(dealerLives); // gets the location of the last heart (non-zero element)
                    dealerLives[lastIndex] = 0; // removes a life from the array (set to element 0)
                }
            }
            // checks the turn and lives
            checkLives();
            checkTurn();
        }

        if (clickedItem === "player") { // if the player is the target
            if (firedBullet === 2) {// if a live round is fired
                if (doubleDamage) { // if double damage is active, run lose life twice
                    lastIndex = getLastElementIndex(playerLives); // gets the location of the last heart (non-zero element)
                    playerLives[lastIndex] = 0; // removes a life from the array (set to element 0)
                    lastIndex = getLastElementIndex(playerLives); // gets the location of the last heart (non-zero element)
                    playerLives[lastIndex] = 0; // removes a life from the array (set to element 0)
                } else { // if double damage is not active, run lose life once
                    lastIndex = getLastElementIndex(playerLives); // gets the location of the last heart (non-zero element)
                    playerLives[lastIndex] = 0; // removes a life from the array (set to element 0)
                }
                turn++; // only switch the turn if a live is fired, if a blank is fired, the user RETAINS their turn
                // checks the turn and lives
                checkLives();
                checkTurn();
            }
        }

        clickedItem = null; // resets clickedItem so gun does not re-fire

        doubleDamage = false; // resets double damage flag to false
    }

    /** defines function to check if it's the dealer's turn */
    function checkTurn() {
        // end of the player-dealer turn, reset active powerups
        usedMagnify = ""; // resets magnify powerup
        usedGolden = ""; // resets golden powerup
        dealerUsedBandaid = false; // resets dealer bandaid powerup
        playerUsedBandaid = false; // resets player bandaid powerup

        waitFor(() => (!requiresBullets && crawlingBullets.length === 0 && !showLevelTransition), () => { // waits for the gun to become loaded, level to be done animating, and bullets to all be animated before proceeding with turn
            if (skipDealerTurns > 0 && turn % 2 === 0) { // if the dealer's turn is being skipped and if it is the dealer's turn
                skipDealerTurns--; // decrements the skip turns counter
                turn++; // increments the turn to switch to the player
                return; // exits the function
            }

            if (turn % 2 === 0) { // runs if it's an even turn (dealer turn)
                if (dealerPowerups[0] != 0) { // if the dealer has a powerup in the left slot
                    dealerTargetX = 115; // sets target to dealer's left slot
                    dealerTargetY = 130; // sets target to dealer's left slot;
                    moveDone = false; // resets moveDone flag to wait for the hand glide to finish
                    // [waits here until hand glide is done]
                    waitFor(() => moveDone, () => {
                        usePowerup(dealerPowerups, 0); // uses the powerup in the left slot
                        dealerShoot(); // dealer runs code and shoots
                    });
                } else { // if the dealer does not have a powerup in the left slot
                    dealerShoot(); // dealer runs code and shoots
                }
            }
        });

    }

    /** defines function to handle dealer shooting logic */
    function dealerShoot() {
        // begins hand glide to gun
        dealerTargetX = 450;
        dealerTargetY = 300;
        moveDone = false;
        // [waits here until hand glide is done]
        waitFor(() => moveDone, () => {
            let firedBullet = bullets.shift(); // gets the bullet to be fired
            let lastIndex; // variable to later store the last index of the lives array
            let bugImage = greyBug; // default bullet image is greyBug (blank round)
            if (Math.random() < 0.5) { // 50% chance that the dealer will select the player, equal chance of picking themselves.
                // begins hand glide to player
                followDealer = true; // dealer "grabs" cup, flag is set to true
                dealerTargetX = 450;
                dealerTargetY = 500;
                moveDone = false;
                // [waits here until hand glide is done]
                waitFor(() => moveDone, () => {
                    dealerTargetX = 362;
                    dealerTargetY = 190;
                    followDealer = false;

                    // shooting
                    let targetY = 525; // sets target to player
                    if (firedBullet === 2) {// if a live round is fired
                        if (doubleDamage) { // if double damage is active, run lose life twice
                            lastIndex = getLastElementIndex(playerLives); // gets the location of the last heart (non-zero element)
                            playerLives[lastIndex] = 0; // removes a life from the array (set to element 0)
                            lastIndex = getLastElementIndex(playerLives); // gets the location of the last heart (non-zero element)
                            playerLives[lastIndex] = 0; // removes a life from the array (set to element 0)
                        } else { // if double damage is not active, run lose life once
                            lastIndex = getLastElementIndex(playerLives); // gets the location of the last heart (non-zero element)
                            playerLives[lastIndex] = 0; // removes a life from the array (set to element 0)
                        }
                        bugImage = redBugDown; // sets bullet image to live round
                    } else {
                        bugImage = greyBugDown; // sets bullet image to blank round
                    }

                    // pushes parameteres above to crawlingBullets, along with additional information and conditions to animate bullets
                    crawlingBullets.push({
                        x: 400, // starting position (cup)
                        y: 300,
                        targetX: 450, // target position
                        targetY: targetY,
                        image: bugImage,
                        hit: false
                    });

                    // checking if the chamber is empty
                    if (bullets.length === 0) { // if the bullets array is empty
                        requiresBullets = true; // shows the load bullets button
                    }

                    // at the end of the dealer's turn, check if the player's turn is being skipped
                    if (skipPlayerTurns > 0) { // if the player's turn is being skipped
                        skipPlayerTurns--; // decrements the skip turns counter
                        turn++; // increments the turn to switch to the dealer
                    }

                    // checking lives and turn operations
                    checkLives();
                    turn++;
                    checkTurn();
                });
            } else { // runs if the dealer selects to "shoot" itself
                // begins hand glide to dealer
                followDealer = true; // dealer "grabs" cup, flag is set to true
                dealerTargetX = 450;
                dealerTargetY = 100;
                moveDone = false;
                // [waits here until hand glide is done]
                waitFor(() => moveDone, () => {
                    dealerTargetX = 362;
                    dealerTargetY = 190;
                    followDealer = false;

                    // shooting
                    let targetY = 75; // sets target to dealer
                    if (firedBullet === 2) {// if a live round is fired
                        if (doubleDamage) { // if double damage is active, run lose life twice
                            lastIndex = getLastElementIndex(dealerLives); // gets the location of the last heart (non-zero element)
                            dealerLives[lastIndex] = 0; // removes a life from the array (set to element 0)
                            lastIndex = getLastElementIndex(dealerLives); // gets the location of the last heart (non-zero element)
                            dealerLives[lastIndex] = 0; // removes a life from the array (set to element 0)
                        } else { // if double damage is not active, run lose life once
                            lastIndex = getLastElementIndex(dealerLives); // gets the location of the last heart (non-zero element)
                            dealerLives[lastIndex] = 0; // removes a life from the array (set to element 0) 
                        }
                        bugImage = redBug; // sets bullet image to live round
                        turn++;
                        // at the end of the dealer's turn, check if the player's turn is being skipped
                        if (skipPlayerTurns > 0) { // if the player's turn is being skipped
                            skipPlayerTurns--; // decrements the skip turns counter
                            turn++; // increments the turn to switch to the dealer
                        }
                    } else {
                        bugImage = greyBug; // sets bullet image to blank round
                    }

                    // pushes parameteres above to crawlingBullets, along with additional information and conditions to animate bullets
                    crawlingBullets.push({
                        x: 400, // starting position (cup)
                        y: 300,
                        targetX: 450, // target position
                        targetY: targetY,
                        image: bugImage,
                        hit: false
                    });

                    // checking if the chamber is empty
                    if (bullets.length === 0) { // if the bullets array is empty
                        requiresBullets = true; // shows the load bullets button
                    }

                    // checking lives and turn operations
                    checkLives();
                    checkTurn();

                    doubleDamage = false; // resets double damage flag to false
                });
            }
        });
    }

    /** defines function to check if the player or dealer has any active powerups - updated every frame */
    function checkActivePowerups() {
        let message = "Dealer:\n"; // initializes message with dealer's powerups title
        if (usedMagnify === "dealer") { // checks if the dealer has used magnify
            message += "Magnify" + "\n"; // adds magnify to the message
        } else if (skipPlayerTurns > 0) { // checks if the dealer has used handcuffs
            message += "Handcuffs" + "\n"; // adds handcuffs to the message
        } else if (dealerUsedBandaid) { // checks if the dealer has used bandaid
            message += "Bandaid" + "\n"; // adds bandaid to the message
        } else if (usedGolden === "dealer") { // checks if the dealer has used golden (2x damage)
            message += "2x damage" + "\n"; // adds 2x damage to the message
        } else { // if the dealer has not used any powerups
            message += "No active powerups" + "\n"; // sets dealer powerups message to "No active powerups"
        }
        message += "Player:\n"; // adds player powerups title to the message
        if (usedMagnify === "player") { // checks if the player has used magnify
            message += "Magnify" + "\n"; // adds magnify to the message
        }
        if (skipDealerTurns > 0) { // checks if the player has used handcuffs
            message += "Handcuffs" + "\n"; // adds handcuffs to the message
        }
        if (playerUsedBandaid) { // checks if the player has used bandaid
            message += "Bandaid" + "\n"; // adds bandaid to the message
        }
        if (usedGolden === "player") { // checks if the player has used golden (2x damage)
            message += "2x damage" + "\n"; // adds 2x damage to the message
        }
        if ((usedMagnify != "player") && skipDealerTurns === 0 && !playerUsedBandaid && usedGolden !== "player") { // checks if the player has not used any powerups
            message += "No active powerups" + "\n"; // sets player powerups message to "No active powerups"
        }
        powerupsActive(message); // calls the powerupsActive function to display the message

    }

    /**  
     * defines function to use a powerup from the player's or dealer's powerup array
     * @param powerupArray - the powerup array to use the powerup from (playerPowerups or dealerPowerups)
     * @param index - the index of the powerup to use (0 or 1)
    */
    function usePowerup(powerupArray, index) {
        if (powerupArray === playerPowerups && powerupArray[index] != 0) { // checks if the powerup array is the player's and if the slot is not empty
            const powerup = powerupArray[index]; // gets the powerup object from the array
            switch (powerup.name) { // checks the name of the powerup
                case "bandaid": // if it is a bandaid, restores 1 life
                    let emptySlot = getLastElementIndex(playerLives) + 1; // finds the last non-zero element of the playerLives array and adds 1 to it to find the first empty slot
                    if (emptySlot <= 1 && currentLevel === 3) { // if the user attempts to heal a "fragile" heart in the last level
                        gameMessage = "Cannot use bandaid to heal!"; // displays a message that bandaid cannot be used
                        return; // if the player has lost a "fragile" heart, bandaid cannot be used - "sudden death"
                    } else { // if the player has not lost a "fragile" heart
                        if (emptySlot <= 4) { // if lives are not full
                            playerLives[emptySlot] = 1; // restores 1 life to the player
                        }
                    }
                    playerUsedBandaid = true; // sets the bandaid flag to true
                    break;
                case "magnify": // if it is a magnify, shows the next bullet
                    magnifyActive = true; // sets the magnifyActive flag to true to start the animation
                    // resetting magnify parameters
                    magnifyProgress = 0;
                    magnifyDirection = 1;
                    magnifyType = bullets[0]; // gets the next bullet type
                    usedMagnify = "player"; // sets the used magnify flag to player
                    break;
                case "handcuffs": // if it is handcuffs, skips dealer's turn
                    skipDealerTurns++; // increments the skip turns counter (how many dealer's turns to skip)
                    break;
                case "golden": // if it is golden, doubles damage of next bullet fired
                    doubleDamage = true; // sets the double damage flag to true
                    usedGolden = "player"; // sets the used golden flag to player
                    break;
            }
            powerupArray[index] = 0; // sets the powerup slot to empty after use
        }
        if (powerupArray === dealerPowerups && powerupArray[index] != 0) { // checks if the powerup array is the dealer's and if the slot is not empty
            const powerup = powerupArray[index]; // gets the powerup object from the array
            switch (powerup.name) { // checks the name of the powerup
                case "bandaid": // if it is a bandaid, restores 1 life
                    let emptySlot = getLastElementIndex(dealerLives) + 1; // finds the last non-zero element of the dealerLives array and adds 1 to it to find the first empty slot
                    if (emptySlot <= 1 && currentLevel === 3) { // if the dealer attempts to heal a "fragile" heart in the last level
                        return; // if the dealer has lost a "fragile" heart, bandaid cannot be used - "sudden death"
                    } else { // if the dealer has not lost a "fragile" heart
                        if (emptySlot <= 4) { // if lives are not full
                            dealerLives[emptySlot] = 1; // restores 1 life to the dealer
                        }
                    }
                    dealerUsedBandaid = true; // sets the bandaid flag to true
                    break;
                case "magnify": // if it is a magnify, "shows" the next bullet to the dealer (doesn't actully do anything, as dealer AI is just a 50/50 chance)
                    usedMagnify = "dealer"; // sets the used magnify flag to dealer
                    break;
                case "handcuffs": // if it is handcuffs, skips player's turn
                    skipPlayerTurns++; // increments the skip turns counter (how many player's turns to skip)
                    break;
                case "golden": // if it is golden, doubles damage of next bullet fired
                    doubleDamage = true; // sets the double damage flag to true
                    usedGolden = "dealer"; // sets the used golden flag to dealer
                    break;
            }
            powerupArray[index] = 0; // sets the powerup slot to empty after use
        }
    }

    /** returns the index of the first empty slot in the powerup array, or -1 if full */
    function findEmptyPowerupSlot(powerups) {
        for (let i = 0; i < powerups.length; i++) { // runs through all elements of the powerups array
            if (!powerups[i]) { // checks if the slot "i" is empty
                return i; // returns the location of the empty slot (index)
            }
        }
        return -1; // returns -1 if no empty slot is found
    }

    /** 
     * defines function to spawn a random powerup from the powerup array 
     * @param powerupArray - the powerup array to spawn the powerup in (either playerPowerups or dealerPowerups)
    */
    function spawnPowerups(powerupArray) {
        if (findEmptyPowerupSlot(powerupArray) != -1) { // checks if there is an empty slot in the powerup array
            let powerup = getRandomPowerup(); // gets a random powerup as an object
            let emptySlot = findEmptyPowerupSlot(powerupArray); // finds the empty slot in the powerup array
            powerupArray[emptySlot] = powerup; // assigns the random powerup to the empty slot
        }
    }

    /** defines function to get a random powerup from the powerupTypes array */
    function getRandomPowerup() {
        let randomIndex = Math.floor(Math.random() * powerupTypes.length); // generates a random index between 0 and the length of the powerupTypes array
        return powerupTypes[randomIndex]; // returns the powerup object at the random index
    }

    // Mouse event listeners

    canvas.addEventListener('mousemove', function (event) { // mousemove event listener to track mouse position
        const rect = canvas.getBoundingClientRect(); // gets the position of the canvas relative to the user
        mouseX = event.clientX - rect.left; // calculates mouseX on the canvas by subtracting the left position of the canvas from the mouse's x position
        mouseY = event.clientY - rect.top; // calculates mouseY on the cavas by subtracting the top position of the canvas from the mouse's y position

        hoveredItem = null; // resets hoveredItem to null every time the mouse moves, so it can be updated

        // check for hovering over hitbox
        for (const item of hitboxes) { // runs through all elements of the hitboxes array
            if ( // checks if the mouse is hovering over the item by checking if the mouseX and mouseY are within the item's x and y coordinates, essentially drawing a rectangle around the item (4 corners calculated by adding width and height to the x and y coordinates)
                mouseX >= item.x &&
                mouseX <= item.x + item.width &&
                mouseY >= item.y &&
                mouseY <= item.y + item.height
            ) { // if the mouse is hovering over the item
                hoveredItem = item.name; // sets hoveredItem to the name of the item being hovered
                break;
            }
        }
    });

    canvas.addEventListener('click', function (event) { // click event listener to handle user input - similar to mousemove above
        if (turn % 2 === 1 || requiresBullets) { // only processes input if it is player's turn, click is turned off - EXCEPTION for if bullets need to be loaded, in which case allows the user to click.
            const rect = canvas.getBoundingClientRect(); // gets the position of the canvas relative to the user
            mouseX = event.clientX - rect.left; // calculates mouseX on the canvas by subtracting the left position of the canvas from the mouse's x position
            mouseY = event.clientY - rect.top; // calculates mouseY on the cavas by subtracting the top position of the canvas from the mouse's y position

            clickedItem = null; // resets clickedItem to null every time the mouse is clicked, so it can be updated

            // check for hovering over hitbox
            for (const item of hitboxes) {
                if ( // checks if the mouse is clicking on the item by checking if the mouseX and mouseY are within the item's x and y coordinates, essentially drawing a rectangle around the item (4 corners calculated by adding width and height to the x and y coordinates)
                    mouseX >= item.x &&
                    mouseX <= item.x + item.width &&
                    mouseY >= item.y &&
                    mouseY <= item.y + item.height
                ) { // if the mouse is clicking on the item
                    clickedItem = item.name; // sets clickedItem to the name of the item being clicked
                    break;
                }
            }

            if (clickedItem === "gun" && !requiresBullets) { // checks if the gun is clicked and chamber is not empty
                gunClicked = true; // sets gunClicked flag to true
            }

            if (gunClicked && clickedItem === "player" || clickedItem === "dealer") { // checks if the gun is clicked AND the player attempts to fire a bullet (clicks on dealer or player)
                shoot(); // calls the shoot function to handle player shooting a bullet
            }

            if (clickedItem === "playerRightSlot" && playerPowerups[1] != 0) { // checks if the right slot is clicked and it is not empty
                usePowerup(playerPowerups, 1); // uses the powerup in the right slot
            }

            if (clickedItem === "playerLeftSlot" && playerPowerups[0] != 0) { // checks if the left slot is clicked and it is not empty
                usePowerup(playerPowerups, 0); // uses the powerup in the left slot
            }

            if (clickedItem === "startButton") { // checks if the start button is clicked
                nextLevel(); // starts the game by incrementing to level 1
            }

            if (clickedItem === "loadBulletsButton" && btnVisible) { // checks if the button is clicked while visible
                if (firstLoad) { // if this is the first time the gun is loaded
                    gameMessage = "Now click on the gun (java cup), \nthen click the dealer or player to fire a bullet!"; // displays a message to the user as instructions
                    firstLoad = false; // sets firstLoad to false so message is not displayed again
                }
                requiresBullets = false; // no longer allows reloading, sets flag to false
                btnX = 810 // resets bar position for next chamber reload
                btnVisible = false; // button is no longer done sliding (needs to slide again)

                // creating and displaying bullets
                showBullets = true; // shows the chamber display
                barFade = false; // resets the bar fade flag - does not fade yet
                barAlpha = 1;     // resets opacity

                // calls functions to create bullets and display bullets
                createDisplayBullets();
                createBullets();

                // spawning powerups
                if (currentLevel != 1) { // does not spawn powerups on level 1
                    spawnPowerups(playerPowerups); // spawns a random powerup for the player
                    spawnPowerups(dealerPowerups); // spawns a random powerup for the dealer
                }

                setTimeout(() => { // waits 5 second before fading the chamber display
                    barFade = true; // triggers the fading animation
                }, 5000);
            }
        }
    });

    // Primary game loop

    /** function to request the next animation frame (creates loop to render the game) */
    function draw() {
        if (gameOverFlag) { // checks if the game is over
            return; // if the game is over, do not run the game loop
        }
        clear(); // calls the clear function to clear the canvas before redrawing the next frame
        drawScene(); // calls the primary game loop to draw the game
        requestAnimationFrame(draw); // requests the next animation frame to create a loop
    }

    /** primary game loop to call functions to update every frame */
    function drawScene() {
        drawLevelTransition(); // calls and checks for a level transition
        if (showLevelTransition) {
            return; // if the level transition is active, do not draw the game
        };
        if (currentLevel !== 0) { // if the game is not in the starting screen
            // calling all update functions to draw the game
            drawBoard();
            playerHearts(playerLives); // render the player's hearts
            dealerHearts(dealerLives); // render the dealer's hearts
            drawPlayers();
            itemSlots();
            animateBullets();
            animateLoadBulletsButton();
            animateMagnify();
            drawGun();
            gameStatus(gameMessage); // displays game message
            checkActivePowerups(); // displays active powerups

            for (const item of hitboxes) { // runs through all elements of the hitboxes array
                if (item.name === "startButton" || item.name === "instructionsButton") { // if the item attempted to be drawn is the start or instructions button
                    continue; // skips drawing start and instructions buttons, as they are only drawn in the starting screen
                }
                drawHitboxItem(item, item.image); // otherwise, draws the item with its image
            }

            drawPowerups();
            description()
            animateCrawlingBullets();
            drawDealerArm(dealerHandX, dealerHandY);
            dealerArmTo(dealerTargetX, dealerTargetY);
            drawArm(mouseX, mouseY);
            drawEndScreen();



        } else { // if the game is in the starting screen
            // drawing essential elements of the starting screen
            drawPlayers();
            startingScreen();

            drawHitboxItem(hitboxes[8], hitboxes[8].image); // drawing start button
            ctx.drawImage(instructions, 50, 350); // draws the instructions button

            drawDealerArm(dealerHandX, dealerHandY);
            drawArm(mouseX, mouseY);

            if (hoveredItem === "instructionsButton") { // if the instructions button is hovered
                rect(50, 225, 700, 350, "rgb(185, 185, 185)"); // draws a grey rectangle for instructions

                // giving instructions
                text("Welcome to Bugshot Roulette!", 60, 250, "bold 32px Orbitron, sans-serif");
                text("In this game, you will take turns firing bugs at each other! \n" +
                    "When the cup is loaded, the current chamber will be displayed.\n" +
                    "The chamber is then shuffled - the number of live bugs and blank bugs remain the same.\n" +
                    "You can then click the cup to fire a bug at either yourself or your opponent.\n" +
                    "If a live bug is fired, damage will be dealt to the target.\n" +
                    "If a blank bug is fired, no damage will be dealt.\n" +
                    "If you fire a blank bug at yourself, you will gain another turn.\n\n" +
                    "You can use powerups to gain an advantage over your opponent.\n" +
                    "The first player to lose all their lives loses the game.\n" +
                    "Click the start button to begin!", 60, 300, "bold 16px Orbitron, sans-serif");
            }



        }
    }

    // Game objects and variables

    // array to store all potential powerup objects
    const powerupTypes = [
        { name: "bandaid", image: bandaid, description: "Restores 1 life" },
        { name: "magnify", image: magnify, description: "See the next bullet" },
        { name: "handcuffs", image: handcuffs, description: "Skips the opponent's turn" },
        { name: "golden", image: golden, description: "Next bullet fired deals 2x damage" }
    ];

    // item hitboxes array, used for storing hitbox objects
    const hitboxes = [
        { name: "dealer", x: 350, y: 25, width: 200, height: 100, image: dealerIdle },
        { name: "player", x: 350, y: 475, width: 200, height: 100, image: playerIdle },
        { name: "dealerRightSlot", x: 175, y: 100, width: itemBlank.width, height: itemBlank.height, image: itemBlank },
        { name: "dealerLeftSlot", x: 75, y: 100, width: itemBlank.width, height: itemBlank.height, image: itemBlank },
        { name: "playerLeftSlot", x: 75, y: 400, width: itemBlank.width, height: itemBlank.height, image: itemBlank },
        { name: "playerRightSlot", x: 175, y: 400, width: itemBlank.width, height: itemBlank.height, image: itemBlank },
        { name: "gun", x: 400, y: 223, width: gun.width, height: gun.height, image: gun },
        { name: "loadBulletsButton", x: 625, y: 100, width: 150, height: 50, image: loadBulletsButton },
        { name: "startButton", x: 50, y: 250, width: start.width, height: start.height, image: start },
        { name: "instructionsButton", x: 50, y: 350, width: instructions.width, height: instructions.height, image: instructions }
    ];

    // store mouse position
    let mouseX = 0;
    let mouseY = 0;

    // global variables for game state
    let currentLevel = 0;
    let gameMessage = "Welcome to the game! Load bullets to start."; // global message to be displayed
    let gameOverFlag = false; // flag to check if the game is over
    let firstLoad = true; // flag to check if this is the first time the gun is loaded
    let hoveredItem = null;
    let lastHoveredItem = null; // variable to store the last hovered item, used for description
    let clickedItem = null;
    let gunClicked = false;
    let turn = 1; // odd - player turn, even - computer turn

    // creating lives arrays for player and dealer
    let playerLives;
    let dealerLives;

    // misc stats
    let playerPowerups = [0, 0], dealerPowerups = [0, 0]; // arrays to store the powerups for player and dealer, starts empty (0)
    let displayBullets = [];
    let bullets = [];

    // variables to track where the dealer's hand is
    let dealerHandX = 362; // initial hand position
    let dealerHandY = 190; // initial hand position
    let dealerTargetX = 362;
    let dealerTargetY = 190;
    let moveDone = true; // flag to check if the hand has moved to the correct location
    let followDealer = false; // flag to check if the gun is being held by the dealer

    // bullet chamber animation variables
    let barX = 810; // starting offscreen
    let slideSpeed = 10; // sliding speed of the bar
    let showBullets = false; // controls when chamber is displayed, default to not showing
    let barAlpha = 1.0; // initial alpha value (transparency)
    let barFade = false; // trigger for bar fading animation

    // load bullets button animation variables
    let btnX = 810 // starting offscreen
    let requiresBullets = true; // controls when button is displayed, begins with requiring bullets
    let btnVisible = false; // flag to check if the button is done sliding

    // magnifying animation variables
    let magnifyActive = false;
    let magnifyProgress = 0; // 0 = in gun, 1 = fully out
    let magnifyDirection = 1; // 1 = out, -1 = in
    let magnifyType = 1; // 1 = blank, 2 = live

    // endscreen animation variables
    let showEndScreen = false;
    let endScreenAlpha = 0;
    let endScreenMessage = "";

    // powerup modifiers
    let usedMagnify = ""; // identifier to check if the magnify powerup was used by the player or dealer, empty string if not used
    let usedGolden = ""; // identifier to check if the golden powerup was used by the player or dealer, empty string if not used
    let playerUsedBandaid = false; // flag to check if the player used the bandaid powerup
    let dealerUsedBandaid = false; // flag to check if the dealer used the bandaid powerup
    let skipDealerTurns = 0; // how many dealer's turns to skip
    let skipPlayerTurns = 0; // how many player's turns to skip
    let doubleDamage = false; // flag to check if the next bullet will deal double damage

    // bullet animation variables
    let crawlingBullets = []; // array used to store information on bullet shooting animation

    // level transition animation variables
    let showLevelTransition = false; // flag to check if the level transition animation should be shown
    let levelTransitionProgress = 0; // 0 to 1
    let levelTransitionMessage = ""; // message to display during level transition

    draw(); // calls the draw function to start the game loop
});

