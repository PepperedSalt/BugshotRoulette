window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;

    // Creating drawing functions (rect, circle, line, etc.)
    function circle(x, y, r, color) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = color
        ctx.fill();
    }


    function rect(x, y, w, h, fill) {
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();
    }


    function line(x1, y1, x2, y2, stroke) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = stroke;
        ctx.stroke();
    }

    function drawArm(x, y) {
        arm(x, y, "rgb(184, 152, 103)");
        circle(x, y, 13, "rgb(47, 150, 207)");
    }

    function drawDealerArm(x, y) {
        dealerArm(x, y, "rgb(184, 152, 103)");
        circle(x, y, 13, "rgb(207, 47, 47)");
    }

    function dealerArm(x, y, color) {
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

        // calculating length of arm
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
        ctx.fillStyle = color;
        ctx.fill();
    }

    function arm(x, y, color) {
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

        // calculating length of arm
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
        ctx.fillStyle = color;
        ctx.fill();
    }


    function clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // functions to draw game board
    /**Defines function to create and place player and dealer images */
    function drawPlayers() {
        if (currentLevel === 0) {
            // Place player and dealer to the far right side of the screen at level 0
            ctx.drawImage(playerIdle, 500, 400); // far right for player
            ctx.drawImage(dealerIdle, 500, 25); // far right for dealer
        } else {
            // Normal positions for other levels
            if (hoveredItem != "player" || !gunClicked) {
                ctx.drawImage(playerIdle, 350, 400);
            }
            if (hoveredItem != "dealer" || !gunClicked) {
                ctx.drawImage(dealerIdle, 350, 25);
            }
        }
    }
    function dealerArmTo(targetX, targetY) {
        const speed = 0.05 // glide speed

        // update position towards target
        dealerHandX += (targetX - dealerHandX) * speed;
        dealerHandY += (targetY - dealerHandY) * speed;

        // check if the hand is close to the target
        if (Math.abs(dealerHandX - targetX) < 1 && Math.abs(dealerHandY - targetY) < 1) {
            dealerHandX = targetX; // snaps exactly to target
            dealerHandY = targetY;
            moveDone = true; // sets the moveDone flag to true - hand is done moving
        }
    }
    function playerHearts(lives) {

        ctx.clearRect(610, 305, 180, 40); // clears the previously drawn hearts
        rect(610, 305, 180, 40, "rgb(153, 153, 153)"); // redraws the erased section of board

        var index = 0;
        for (const element of lives) {
            if (element != 0) {
                if (element === 1) {
                    ctx.drawImage(heart, 612 + index * 35, 310);
                } else {
                    ctx.drawImage(fragileHeart, 612 + index * 35, 310);
                }
                index++;
            }
        }
    }

    function dealerHearts(lives) {

        ctx.clearRect(610, 255, 180, 40); // clears the previously drawn hearts
        rect(610, 255, 180, 40, "rgb(153, 153, 153)"); // redraws the erased section of board

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2) // centers canvas point of rotation
        ctx.rotate(Math.PI); // rotates canvas by 180 degreees
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

    function checkLives() {
        if (playerLives[0] === 0) {
            gameOver(false);
        }

        if (dealerLives[0] === 0) {
            if (currentLevel < 3) {
                nextLevel(); // if the dealer has no lives left, go to the next level
            } else {
                gameOver(true);
            }
        }
    }

    function nextLevel() {
        displayBullets = [];
        bullets = [];
        requiresBullets = true;
        currentLevel++;
        turn = 1; // resets so that it is the player's turn again
        switch (currentLevel) {
            case 1:
                playerLives = [1, 1, 0, 0, 0];
                dealerLives = [1, 1, 0, 0, 0];
                break;
            case 2:
                playerLives = [1, 1, 1, 1, 0];
                dealerLives = [1, 1, 1, 1, 0];
                gameMessage = "Powerups now spawn when the gun is loaded!\nHover to see their effects!"; // displays a message that powerups will now spawn
                break;
            case 3:
                playerLives = [2, 2, 1, 1, 1];
                dealerLives = [2, 2, 1, 1, 1];
                gameMessage = "Sudden death with some new mechanics!\nYou cannot heal the fragile (cracked) hearts!"; // displays a message that powerups will now spawn
                break;
        }
    }
    function gameOver(result) {
        showEndScreen = true; // sets the end screen flag to true
        endScreenAlpha = 0; // resets the end screen alpha (transparency) to 0
        if (result) {
            endScreenMessage = "You win!\nCongratulations!";
        } else {
            endScreenMessage = "You lose!\nBetter luck next time!";
        }
    }

    function drawEndScreen() {
        if (!showEndScreen) {
            return; // if the end screen is not active, exit
        }

        // fading in the end screen
        if (endScreenAlpha < 1) {
            endScreenAlpha += 0.01; // increases the alpha value to make the end screen less transparent
        } else {
            endScreenAlpha = 1; // sets the alpha value to 1 (fully opaque)
            gameOverFlag = true; // sets the game over flag to true, so the game stops running
        }

        ctx.save();
        ctx.globalAlpha = endScreenAlpha;
        ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";
        ctx.font = "bold 64px Orbitron, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const lines = endScreenMessage.split('\n');
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], canvas.width / 2, (canvas.height / 2 - 40) + (i * 80)); // draws the endScreen message centered
        }

        ctx.restore();
    }


    function animateLoadBulletsButton() {
        // defining dimensions
        let btnY = 100;
        let btnTargetX = 625; // sliding onscreen
        let btnWidth = 150;
        let btnHeight = 50;

        // checking if button should be displayed
        if (!requiresBullets) {
            return;
        }

        // animate sliding
        if (btnX > btnTargetX) {
            btnX -= slideSpeed;
        } else {
            btnVisible = true; // slide complete
        }

        ctx.save();

        // drawing backdrop
        rect(btnX, btnY, btnWidth, btnHeight, "rgb(104, 104, 104)");

        // text parameters
        ctx.fillStyle = "white";
        ctx.font = "16px Orbitron, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText("Load Bullets", btnX + btnWidth / 2, btnY + btnHeight / 2);

        ctx.restore();
    }

    function itemSlots() {
        ctx.drawImage(itemBlank, 175, 100);
        ctx.drawImage(itemBlank, 75, 100);
        ctx.drawImage(itemBlank, 75, 400);
        ctx.drawImage(itemBlank, 175, 400);
    }

    function drawGun() {
        if (followDealer) {
            ctx.drawImage(heldGun, dealerHandX - gun.width / 2, dealerHandY - gun.height / 2);
        } else if (!gunClicked) {
            ctx.drawImage(gun, 400, 223);
        } else {
            ctx.drawImage(heldGun, mouseX - gun.width / 2, mouseY - gun.height / 2);
        }

    }

    function drawBoard() {
        rect(600, 250, 190, 100, "rgb(153, 153, 153)");
        line(600, 300, 790, 300, "black");
    }

    function shuffle(array) {
        let currentIndex = array.length; // sets "currentIndex" to be the final value of the array (starting form the final value)

        while (currentIndex != 0) { // runs until all elements are analyzed
            let randomIndex = Math.floor(Math.random() * currentIndex) // selects a random index of the array out of the remaining indices
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]; // creates a temporary array to invert the positions of the two elements (element at currentIndex is swapped with element at randomIndex and vice versa.)
        }
    }
    function createDisplayBullets() {
        // creating displayBullets
        switch (currentLevel) {
            case 1:
                displayBullets = [9, 9, 9]; // 9 - placeholder for either a live or blank to be generated
                break;
            case 2:
                displayBullets = [9, 9, 9, 9, 9]; // 9 - placeholder for either a live or blank to be generated
                break;
            case 3:
                displayBullets = [9, 9, 9, 9, 9, 9, 9]; // 9 - placeholder for either a live or blank to be generated
                break;
        }
        let minimumLive = Math.floor(displayBullets.length / 2.0); // calculates the minimum number of live rounds generated by dividing the total number of rounds by 2 and flooring
        for (let i = 0; i < displayBullets.length; i++) {
            displayBullets[i] = Math.floor(Math.random() * 2) + 1; // replaces the current element with a 1 or a 2 (1 - live round, 2 - blank)
        }
        // checks how many live rounds there are in the chamber
        let currentLive = 0;
        for (const element of displayBullets) {
            if (element === 2) {
                currentLive++;
            }
        }

        while (currentLive < minimumLive) {
            let randomIndex = Math.floor(Math.random() * (displayBullets.length)); // generates a random index of the displayBullets array
            if (displayBullets[randomIndex] === 1) { // checks if the element at the random index is a blank (1)
                displayBullets[randomIndex] = 2; // sets the element to a live round (2)
                currentLive++; // increments the number of live rounds
            }
        }

        while (currentLive === displayBullets.length) {
            let randomIndex = Math.floor(Math.random() * (displayBullets.length)); // generates a random index of the displayBullets array
            displayBullets[randomIndex] = 1; // sets the element to a blank round to ensure chamber is not fully live
            currentLive--;
        }
    }

    function createBullets() {
        // creating actual bullets array to be used in the gun
        bullets = [...displayBullets]; // makes a copy of the displayBullets - spread operation, written to bullets array
        shuffle(bullets); // shuffles the array
    }

    function animateBullets() {
        // defining dimensions
        let barY = 350;
        let barTargetX = 550; // sliding onscreen
        let barWidth = 240;
        let barHeight = 50;

        // checking if bullets should be displayed
        if (!showBullets) {
            return;
        }

        // animate sliding
        if (barX > barTargetX) {
            barX -= slideSpeed;
        }

        // fading out after 5 seconds of display
        if (barFade && barAlpha > 0) {
            barAlpha -= 0.01;
            if (barAlpha <= 0) {
                barAlpha = 0;
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

        for (let i = 0; i < displayBullets.length; i++) {
            if (displayBullets[i] === 1) {
                ctx.drawImage(blankBullet, barX + 10 + i * spacing, barY + 5);
            } else {
                ctx.drawImage(liveBullet, barX + 10 + i * spacing, barY + 5);
            }
        }

        ctx.restore();

    }

    function shoot() {
        if (!gunClicked) { // if the gun is not activated or if bullet is not ready to be fired --> exit
            return;
        }

        let firedBullet = bullets.shift(); // gets the bullet to be fired
        gunClicked = false; // "unequips" the gun

        // checking if the chamber is empty
        if (bullets.length === 0) {
            requiresBullets = true; // shows the load bullets button
        }

        console.log("got bullet: " + firedBullet);
        console.log("remaining: " + bullets.toString());
        let lastIndex = 0;

        // setting parameters for shooting animation
        let targetY = clickedItem === "dealer"
            ? 75 // if dealer is the target, set the target y position to 75
            : 525; // if dealer is the target, set the target y position to 525
        let bugImage = firedBullet === 2
            ? redBug // if live round is fired
            : greyBug; // if blank round is fired

        // using downwards bug image if moving towards player
        if (clickedItem === "player" && firedBullet === 2) { // live bullet
            bugImage = redBugDown;
        } else if (clickedItem === "player" && firedBullet === 1) { // blank bullet
            bugImage = greyBugDown;
        }

        // pushes parameteres above to crawlingBullets, along with additional information and conditions
        crawlingBullets.push({
            x: 400, // starting position (cup)
            y: 300,
            targetX: 450, // target position
            targetY: targetY,
            image: bugImage,
            hit: false
        });

        if (clickedItem === "dealer") {
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
            // checks the turn
            checkTurn();
        }

        if (clickedItem === "player") {
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
                // checks the turn
                checkTurn();
            }
        }

        clickedItem = null; // resets clickedItem so gun does not re-fire



        checkLives();
        doubleDamage = false; // resets double damage flag to false


    }

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
            bullet.y += (dy / dist) * 3;
            bullet.x = 450;

            // draw the bullet image at its new position (offset slightly to center it)
            ctx.drawImage(bullet.image, bullet.x - 57, bullet.y - 65);
        }
    }

    /*Function checks each frame to see an action has completed **/
    function waitFor(condition, callback) {
        function check() {
            if (condition()) { // checks condition, if done, check is done
                callback(); // wait has completed, run code
            } else { // checks condition, if not done, check needs to keep running
                requestAnimationFrame(check); // keep checking by requesting another frame
            }
        }
        check(); // begins check
    }

    function checkTurn() {
        // end of the player-dealer turn, reset active powerups
        usedMagnify = ""; // resets magnify powerup
        usedGolden = ""; // resets golden powerup
        dealerUsedBandaid = false; // resets dealer bandaid powerup
        playerUsedBandaid = false; // resets player bandaid powerup
        waitFor(() => !requiresBullets, () => { // waits for the gun to become loaded before proceeding with turn
            if (skipDealerTurns > 0) { // if the dealer's turn is being skipped
                skipDealerTurns--; // decrements the skip turns counter
                turn++; // increments the turn to switch to the player
                return; // exits the function
            }

            if (turn % 2 === 0) { // runs if it's an even turn (dealer turn)
                if (dealerPowerups[0] != 0) { // if the dealer has a powerup in the left slot
                    dealerTargetX = 115; // sets target to dealer's left slot
                    dealerTargetY = 130; // sets target to dealer's left slot
                    console.log("Moving towards " + dealerTargetX + ", " + dealerTargetY);
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

    function dealerShoot() {
        // begins hand glide to gun
        dealerTargetX = 450;
        dealerTargetY = 300;
        moveDone = false;
        // [waits here until hand glide is done]
        waitFor(() => moveDone, () => {
            let firedBullet = bullets.shift(); // gets the bullet to be fired
            console.log("got bullet: " + firedBullet);
            console.log("remaining: " + bullets.toString());
            let lastIndex;
            let bugImage = greyBug;
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
                    if (bullets.length === 0) {
                        requiresBullets = true; // shows the load bullets button
                    }

                    // at the end of the dealer's turn, check if the player's turn is being skipped
                    if (skipPlayerTurns > 0) { // if the player's turn is being skipped
                        skipPlayerTurns--; // decrements the skip turns counter
                        turn++; // increments the turn to switch to the dealer
                    }

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
                    if (bullets.length === 0) {
                        requiresBullets = true; // shows the load bullets button
                    }
                    checkLives();
                    checkTurn();
                    doubleDamage = false; // resets double damage flag to false
                });
            }
        });
    }
    function drawHitboxItem(item, image) {
        ctx.save();

        const centerX = item.x + item.width / 2;
        const centerY = item.y + item.height / 2;

        if (hoveredItem === item.name) {
            ctx.translate(centerX, centerY);
            ctx.scale(1.2, 1.2);
            ctx.translate(-centerX, -centerY);
        }
        if (!followDealer) {
            if (item.name != "gun" && item.name != "loadBulletsButton") {
                if (gunClicked) {
                    if (item.name === "dealer" || item.name === "player") {
                        if (item.name === "player") { // checks if the item is the player
                            ctx.drawImage(image, item.x, item.y - 75); // special case to make sure player is scaled properly
                        } else {
                            ctx.drawImage(image, item.x, item.y);
                        }
                    }
                } else {
                    if (item.name != "dealer" && item.name != "player") {
                        ctx.drawImage(image, item.x, item.y);
                    }
                }
            } else if (item.name === "loadBulletsButton") {
                if (btnVisible && requiresBullets) {
                    ctx.drawImage(image, item.x, item.y);
                }
            } else {
                if (!gunClicked) {
                    ctx.drawImage(image, item.x, item.y);
                }
            }
        }

        ctx.restore();
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
    /** draws the description of the powerup in the hovered slot */
    function description() {
        ctx.save();
        ctx.fillStyle = "black";
        ctx.font = "bold 16px Orbitron, sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        if (hoveredItem !== lastHoveredItem) {
            if (hoveredItem === "playerLeftSlot" && playerPowerups[0] != 0) {
                gameMessage = "Powerup: " + playerPowerups[0].description;
            } else if (hoveredItem === "playerRightSlot" && playerPowerups[1] != 0) {
                gameMessage = "Powerup: " + playerPowerups[1].description;
            }
        }
        lastHoveredItem = hoveredItem;

        ctx.restore();
    }

    function gameStatus(message) {
        ctx.save();
        ctx.fillStyle = "black";
        ctx.font = "bold 16px Orbitron, sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        // split message by \n and draw each line
        const lines = message.split('\n');
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], 25, 300 + i * 24); // 24px line height
        }
        ctx.restore();
    }

    function powerupsActive(message) {
        // displaying active powerups
        ctx.save();
        ctx.fillStyle = "black";
        ctx.font = "bold 16px Orbitron, sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        // split message by \n and draw each line
        const lines = message.split('\n');
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], 600, 450 + i * 24); // 24px line height
        }
        ctx.restore();
    }



    function checkActivePowerups() {
        let message = "Dealer:\n";
        if (usedMagnify === "dealer") {
            message += "Magnify" + "\n";
        } else if (skipPlayerTurns > 0) {
            message += "Handcuffs" + "\n";
        } else if (dealerUsedBandaid) {
            message += "Bandaid" + "\n";
        } else if (usedGolden === "dealer") {
            message += "2x damage" + "\n";
        } else {
            message += "No active powerups" + "\n";
        }
        message += "Player:\n";
        if (usedMagnify === "player") {
            message += "Magnify" + "\n";
        }
        if (skipDealerTurns > 0) {
            message += "Handcuffs" + "\n";
        }
        if (playerUsedBandaid) {
            message += "Bandaid" + "\n";
        }
        if (usedGolden === "player") {
            message += "2x damage" + "\n";
        }
        if ((usedMagnify != "player") && skipDealerTurns === 0 && !playerUsedBandaid && usedGolden !== "player") {
            message += "No active powerups" + "\n";
        }
        powerupsActive(message);

    }
    function animateMagnify() {
        if (magnifyActive) {
            // getting gun position and slide position
            const gunX = 400 + gun.width / 2;
            const gunY = 300;
            const slideDistance = 80; // how far to slide out

            // calculate bullet position
            const offset = magnifyProgress * slideDistance;
            const bulletTargetX = gunX + offset;
            const bulletY = gunY;

            // get image based on bullet type
            let bulletImg;
            if (magnifyType === 1) {
                bulletImg = blankBullet; // blank round
            } else {
                bulletImg = liveBullet; // live round
            }

            // drawing the bullet
            ctx.save();
            ctx.drawImage(bulletImg, bulletTargetX - bulletImg.width / 2, bulletY - bulletImg.height / 2);
            ctx.restore();

            // animation
            if (magnifyDirection === 1) {
                magnifyProgress += 0.02; // moving out
                if (magnifyProgress >= 1) {
                    magnifyProgress = 1;
                    magnifyDirection = -1;
                }
            } else {
                magnifyProgress -= 0.02; // moving back in
                if (magnifyProgress <= 0) {
                    magnifyProgress = 0;
                    magnifyActive = false;
                }
            }
        }
    }
    function usePowerup(powerupArray, index) {
        if (powerupArray === playerPowerups && powerupArray[index] != 0) { // checks if the powerup array is the player's and if the slot is not empty
            const powerup = powerupArray[index]; // gets the powerup object from the array
            switch (powerup.name) { // checks the name of the powerup
                case "bandaid": // if it is a bandaid, restores 1 life
                    let emptySlot = getLastElementIndex(playerLives) + 1; // finds the last non-zero element of the playerLives array and adds 1 to it to find the first empty slot
                    if (emptySlot <= 1 && currentLevel === 3) { // if the user attempts to heal a "fragile" heart in the last level
                        gameMessage = "Cannot use bandaid to heal!"; // displays a message that bandaid cannot be used
                        return; // if the player has lost a "fragile" heart, bandaid cannot be used - "sudden death"
                    } else {
                        if (emptySlot <= 4) { // if lives are not full
                            playerLives[emptySlot] = 1; // restores 1 life to the player
                        }
                    }
                    playerUsedBandaid = true; // sets the bandaid flag to true
                    break;
                case "magnify": // if it is a magnify, shows the next bullet
                    magnifyActive = true;
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
                    } else {
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

    function startingScreen() {
        ctx.save();
        ctx.fillStyle = "rgb(136, 134, 19)";
        ctx.font = "bold 48px Orbitron, sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText("Bugshot Roulette", 50, 100);
        text("- By Frank Zheng", 50, 150, "bold 16px Orbitron, sans-serif");
        ctx.drawImage(start, 50, 250); // draws the start button
        ctx.restore();
    }

    function text(message, x, y, font) {
        ctx.save();
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.font = font;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        const lines = message.split('\n');
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], x, y + i * 24); // 24px line height
        }
        ctx.restore();
    }



    function drawScene() {
        if (currentLevel !== 0) {
            drawBoard();
            playerHearts(playerLives);
            dealerHearts(dealerLives);
            drawPlayers();
            itemSlots();
            animateBullets();
            animateLoadBulletsButton();
            animateMagnify();
            drawGun();
            gameStatus(gameMessage); // displays game message
            checkActivePowerups(); // displays active powerups

            for (const item of hitboxes) {
                if (item.name === "startButton" || item.name === "instructionsButton") { // if the item attempted to be drawn is the start or instructions button
                    continue; // skips drawing start and instructions buttons, as they are only drawn in the starting screen
                }
                drawHitboxItem(item, item.image);


            }
            drawPowerups();
            description()
            animateCrawlingBullets();
            drawDealerArm(dealerHandX, dealerHandY);
            dealerArmTo(dealerTargetX, dealerTargetY);
            drawArm(mouseX, mouseY);
            drawEndScreen();



        } else {
            drawPlayers();
            startingScreen();
            drawHitboxItem(hitboxes[8], hitboxes[8].image); // drawing start button
            ctx.drawImage(instructions, 50, 350); // draws the instructions button



            drawArm(mouseX, mouseY);
            drawDealerArm(dealerHandX, dealerHandY);

            if (hoveredItem === "instructionsButton") { // if the instructions button is hovered
                rect(50, 225, 700, 350, "rgb(185, 185, 185)"); // draws a grey rectangle for instructions
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



    /** returns the index of the first empty slot in the powerup array, or -1 if full */
    function findEmptyPowerupSlot(powerups) {
        for (let i = 0; i < powerups.length; i++) { // runs through all elements of the powerups array
            if (!powerups[i]) { // checks if the slot "i" is empty
                return i; // returns the location of the empty slot (index)
            }
        }
        return -1; // returns -1 if no empty slot is found
    }

    function spawnPowerups(powerupArray) {
        if (findEmptyPowerupSlot(powerupArray) != -1) { // checks if there is an empty slot in the powerup array
            let powerup = getRandomPowerup(); // gets a random powerup as an object
            let emptySlot = findEmptyPowerupSlot(powerupArray); // finds the empty slot in the powerup array
            powerupArray[emptySlot] = powerup; // assigns the random powerup to the empty slot
        }
    }

    function getRandomPowerup() {
        let randomIndex = Math.floor(Math.random() * powerupTypes.length);
        return powerupTypes[randomIndex];
    }

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

    // Store mouse position
    let mouseX = 0;
    let mouseY = 0;

    canvas.addEventListener('mousemove', function (event) {
        const rect = canvas.getBoundingClientRect();
        mouseX = event.clientX - rect.left;
        mouseY = event.clientY - rect.top;

        hoveredItem = null;
        // check for hovering over hitbox
        for (const item of hitboxes) {
            if (
                mouseX >= item.x &&
                mouseX <= item.x + item.width &&
                mouseY >= item.y &&
                mouseY <= item.y + item.height
            ) {
                hoveredItem = item.name;
                break;
            }
        }
    });

    canvas.addEventListener('click', function (event) {
        if (turn % 2 === 1 || requiresBullets) { // only processes input if it is player's turn, click is turned off - EXCEPTION for if bullets need to be loaded, in which case allows the user to click.
            const rect = canvas.getBoundingClientRect();
            mouseX = event.clientX - rect.left;
            mouseY = event.clientY - rect.top;

            clickedItem = null;
            // check for hovering over hitbox
            for (const item of hitboxes) {
                if (
                    mouseX >= item.x &&
                    mouseX <= item.x + item.width &&
                    mouseY >= item.y &&
                    mouseY <= item.y + item.height
                ) {
                    clickedItem = item.name;
                    break;
                }
            }

            if (clickedItem === "gun" && !requiresBullets) { // checks if the gun is clicked and chamber is not empty
                gunClicked = true;
            }

            if (gunClicked && clickedItem === "player" || clickedItem === "dealer") { // checks if the gun is clicked AND the player attempts to fire a bullet (clicks on dealer or player)
                shoot();
            }

            if (clickedItem === "playerRightSlot" && playerPowerups[1] != 0) { // checks if the right slot is clicked and it is not empty
                usePowerup(playerPowerups, 1); // uses the powerup in the right slot
            }

            if (clickedItem === "playerLeftSlot" && playerPowerups[0] != 0) { // checks if the left slot is clicked and it is not empty
                usePowerup(playerPowerups, 0); // uses the powerup in the left slot
            }

            if (clickedItem === "startButton") { // checks if the start button is clicked
                nextLevel(); // starts the game by going to level 1
            }

            if (clickedItem === "loadBulletsButton" && btnVisible) { // checks if the button is clicked while visible
                if (firstLoad) { // if this is the first time the gun is loaded
                    gameMessage = "Now click on the gun (java cup), \nthen click the dealer or player to fire a bullet!"; // displays a message to the user
                    firstLoad = false; // sets firstLoad to false so message is not displayed again
                }
                requiresBullets = false; // no longer allows reloading, sets flag to false
                btnX = 810 // resets bar position for next chamber reload
                btnVisible = false; // button is no longer done sliding (needs to slide again)

                // creating and displaying bullets
                showBullets = true;
                barFade = false;
                barAlpha = 1;     // resets opacity
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

    let currentLevel = 0;
    let gameMessage = "Welcome to the game! Load bullets to start."; // global message to be displayed
    let gameOverFlag = false; // flag to check if the game is over
    let firstLoad = true; // flag to check if this is the first time the gun is loaded
    let hoveredItem = null;
    let lastHoveredItem = null; // variable to store the last hovered item, used for description
    let clickedItem = null;
    let gunClicked = false;

    // creating lives arrays for player and dealer
    let playerLives;
    let dealerLives;


    let playerPowerups = [0, 0], dealerPowerups = [0, 0]; // arrays to store the powerups for player and dealer, starts empty (0)
    let displayBullets = [];
    let bullets = [];
    let turn = 1; // odd - player turn, even - computer turn

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

    let crawlingBullets = []; // array used to store information on bullet shooting animation

    function draw() {
        if (gameOverFlag) {
            return; // if the game is over, do not run the game loop
        }
        clear();
        drawScene();
        requestAnimationFrame(draw);
    }
    draw();
});

