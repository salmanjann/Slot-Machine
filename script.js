// Win Category possible symbols
// Price -> 💵💲💰
// Game -> 🎮🕹️
// Movie -> 🎥📽️
// 17 random symbols for now -> 🎈🎁🎃👑🏅🎲🩻🧬🔔🎤⌚🍔🍕🥚🍾🪂🛸
window.addEventListener('load', () => {

    /*
            THINGS YOU WILL CONFIGURE
    */

    const eventTimeInMins = 60;// Event time in minutes
    const nGameWins = 4; // No of possible wins for games category
    const nPriceWins = 4;// No of possible wins for price category
    const nMovieWins = 4;// No of possible wins for movies category
    const nGames = 3; // No of pics in Games foler
    const nPrices = 3;// No of pics in Prices foler
    const nMovies = 3;// No of movies in Movies foler
    const pauseTime = 5; // time in seconds, that is after each spin machine will pause for this time, before resetted or starting a timer
    const winProbability = 10; // in percentage, the lower the probability, lower the chance of getting win
    const imageDisplayTime = 1; // in minutes
    const maxVideoTime = 2; // in minutes

    /*
            TIME FRAME
    */

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (eventTimeInMins * 60000)); // 30 minutes later

    /*
            GLOBAL VARIABLES
    */

    // SELECTING DIVS

    const REELS = document.querySelectorAll('.reels');
    const spinButton = document.getElementById('spinButton');
    const lever = document.querySelector('.lever');
    let timerElement = document.getElementById("timerVideo");
    let overlayImage = document.getElementById("overlayImage");
    let overlayVideo = document.getElementById("overlayVideo");

    // CONSTANTS

    const N_SYMBOLS = 20;
    const N_TIMES = 12;
    const WIN_INDICES = [3, 6, 13];
    const WIN_SYMBOLS = ['💰', '🎮', '🎥'];
    const REEL_TRANSITION_TIME = '12s';
    const REEL_RESET_TIME = '3s';
    const LEVER_TRANSITON_TIME = parseInt(REEL_TRANSITION_TIME) / 2;
    const TIMER_START = parseInt(REEL_TRANSITION_TIME) + pauseTime; 
    const IMAGE_DISPLAY_TIME = (imageDisplayTime * 60) * 1000;
    const midIndex = 10;
    const audio = new Audio('./Sounds/reelSpin.mp3');

    // OTHER VARIABLES

    let PRICE_WIN_IMAGE = 1;
    let GAME_WIN_IMAGE = 1;
    let VIDEO_TO_BE_PLAYED = 1;
    let isResetted = true;
    let offsets = [0, 0, 0];
    let decidingWin;
    let isWinTime;
    let stickers = ['🎗️', '👑', '⌚'];
    let randIndex;
    const spinPlusTimer = (TIMER_START + 5) + 15; // 5s for resetting, and 15s for timer
    let nWins = [, ,];
    nWins[0] = nPriceWins;
    nWins[1] = nGameWins;
    nWins[2] = nMovieWins;
    let winTime = [, ,];
    winTime[0] = winTime[1] = spinPlusTimer + (imageDisplayTime * 60);
    winTime[2] = spinPlusTimer + (maxVideoTime * 60);
    
    let clickingEnabled = true;
    function disableClick() {
        clickingEnabled = false;
    }

    function enableClick() {
        clickingEnabled = true;
    }

    /*
            ARRAY CONTAINING SYMBOLS FOR EACH REEL
    */

    let reelEmojis = [
        ['🎈', '🎁', '🎃', , '👑', '🏅', , '🎲', '🩻', '🧬', '❓', '🎤', '⌚', , '🍔', '🍕', '🥚', '🍾', '🪂', '🛸'],
        ['🩻', '🛸', '🍔', , '🎁', '🍕', , '🎈', '🎤', '🪂', '❓', '🍾', '🥚', , '🎲', '👑', '⌚', '🏅', '🧬', '🎃'],
        ['🍾', '🎲', '🏅', , '🥚', '🪂', , '🎃', '🛸', '⌚', '❓', '🍔', '🍕', , '🧬', '🎈', '🎁', '🩻', '👑', '🎤']
    ];

    /*
            CREATING SLOTS IN REELS
    */

    REELS.forEach((reel) => {
        for (let i = 0; i < N_SYMBOLS * N_TIMES; i++) {
            let newSlot = document.createElement('div');
            newSlot.classList.add('slots');
            if ((i / 10) % 2 == 1) {
                newSlot.classList.add('slot9');
            }
            reel.appendChild(newSlot);
        }
    });


    /*
            PLACING WIN SYMBOLS AT THEIR POSITIONS IN ARRAY
    */

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            reelEmojis[j][WIN_INDICES[i]] = WIN_SYMBOLS[i];
        }
    }


    /*
            FUNCTION TO POPULATE SYMBOLS IN REELS
    */

    function populateSlots() {
        REELS.forEach((reel, index) => {
            const slots = reel.querySelectorAll('.slots');
            slots.forEach((slot, slotIndex) => {
                slot.textContent = reelEmojis[index][slotIndex % 20];
            });
        });
        resetReels();
    }
    populateSlots();


    /*
            FUNCTION TO RESET REEL
    */

    function resetReel(reel) {
        offsets = [0, 0, 0];
        isResetted = true;

        let slot9 = reel.querySelectorAll('.slot9');
        setTimeout(() => {
            slot9.forEach((slot) => {
                slot.textContent = '❓';
            })

        }, (parseInt(REEL_RESET_TIME) - 1) * 1000);
        const slots = reel.querySelectorAll('.slots');
        slots.forEach((slot) => {
            slot.style.transitionDuration = REEL_RESET_TIME;
            slot.style.transform = `translateY(-${midIndex * 100 - 50}%)`;
        });
    }

    function resetReels() {
        REELS.forEach((reel) => {
            resetReel(reel);
        });
    }

    /*
            FUNCTION TO EXIT FULL SCREEN MODE IF VIDEO IS BEING PLAYED IN FULL SCREEN MODE
    */

    function exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }
    }

    // WHEN VIDEO IS ENDED
    overlayVideo.addEventListener('ended', () => {
        overlayVideo.pause();

        if (
            (document.fullscreenElement && document.fullscreenElement === overlayVideo) ||
            (document.webkitFullscreenElement && document.webkitFullscreenElement === overlayVideo) ||
            (document.msFullscreenElement && document.msFullscreenElement === overlayVideo)
        ) {
            // Exit fullscreen mode
            exitFullscreen();
        }

        overlayVideo.style.display = "none";
        overlay.style.display = "none";
        enableClick();
    });

    // WHEN TIMER IS ENDED
    timerElement.addEventListener('ended', () => {
        // setTimeout(() => {
        if (randIndex == 0 || randIndex == 1) {
            overlayImage.style.display = "flex";

            if (randIndex == 0) {
                overlayImage.src = `./Prices/${PRICE_WIN_IMAGE}.png`;
                PRICE_WIN_IMAGE++;
                if (PRICE_WIN_IMAGE > nPrices)
                    PRICE_WIN_IMAGE = 1;
            }
            else if (randIndex == 1) {
                overlayImage.src = `./Games/${GAME_WIN_IMAGE}.png`;
                GAME_WIN_IMAGE++;
                if (GAME_WIN_IMAGE > nGames)
                    GAME_WIN_IMAGE = 1;
            }

            setTimeout(() => {
                overlayImage.style.display = "none";
                overlay.style.display = "none";
                enableClick();
            }, IMAGE_DISPLAY_TIME);
        }
        else if (randIndex == 2) {
            overlayVideo.style.display = "flex";
            overlayVideo.style.display = "flex";
            overlayVideo.src = `./Movies/${VIDEO_TO_BE_PLAYED}.mp4`;
            overlayVideo.play();
            overlayVideo.controls = false;

            VIDEO_TO_BE_PLAYED++;
            if (VIDEO_TO_BE_PLAYED > nMovies)
                VIDEO_TO_BE_PLAYED = 1;

        }
        // }, 2000);

        timerElement.style.display = "none";
    });

    // WHEN MOUSE IS CLICKED
    addEventListener('click', () => {
        if (!clickingEnabled) {
            return; // If clicking is disabled, do nothing
        }

        disableClick();

        /*
        DISABLE SPIN AND RESET BUTTONS AND RE-ENABLE AFTER REEL TRANSITION
        */

        spinButton.classList.add('spinButtonDisabled');

        setTimeout(() => {
            resetReels();
            // when reel is resetted
            setTimeout(() => {
                spinButton.classList.remove('spinButtonDisabled');
                if (!isWinTime)
                    enableClick();
            }, 3000);
        }, TIMER_START * 1000);

        /*
        PLAY THE SLOT MACHINE REEL SOUND 
        */

        audio.play();

        /*
        ROTATE THE SLOT HANDLE
        */

        lever.style.transform = 'rotate(60deg)';

        setTimeout(() => {
            lever.style.transform = 'rotate(0deg)';
            lever.style.transitionDuration = LEVER_TRANSITON_TIME.toString() + 's';
        }, LEVER_TRANSITON_TIME * 1000);

        /*
        DECIDING WHETHER IT IS WIN SPIN OR NOT
        */

        // Randomize if this should be win or not
        decidingWin = Math.floor(Math.random() * 100) + 1;
        if (decidingWin > winProbability)
            isWinTime = false;
        else
            isWinTime = true;

        // Or set manually
        // isWinTime = true;

        const currentTime = new Date();
        if (currentTime >= startTime && currentTime <= endTime) {
            const timeDifferenceInMillis = endTime.getTime() - currentTime.getTime();
            const timeDifferenceInSeconds = Math.floor(timeDifferenceInMillis / 1000);

            let timeToBe = 0;
            for (let i = 0; i < 3; i++)
                timeToBe += nWins[i] * winTime[i];

            if (timeDifferenceInSeconds <= timeToBe)
                isWinTime = true;

            if (isWinTime) {
                // This wil generate random victory out of three possible wins
                if (nWins[0] <= 0 && nWins[1] <= 0 && nWins[2] <= 0)
                    isWinTime = false;
                else {
                    randIndex = Math.floor(Math.random() * 3);
                    while (nWins[randIndex] <= 0) {
                        randIndex = Math.floor(Math.random() * 3);
                    }
                    nWins[randIndex] -= 1;
                }
                // prevRandIndex = randIndex;

                // If we manually want to select which category to win, just set the random index by yourself
                // randIndex = 2;
            }
        } else {
            isWinTime = false;
        }

        REELS.forEach((reel, index) => {

            /*
                    CHECK IF MACHINE WAS RESSETED OR NOT
            */

            if (isResetted) {
                const slots = reel.querySelectorAll('.slots');
                slots.forEach((slot) => {
                    slot.style.transitionDuration = REEL_TRANSITION_TIME;
                });
                let slot9 = reel.querySelectorAll('.slot9');
                setTimeout(() => {
                    slot9.forEach((slot) => {
                        slot.textContent = '🎗️';
                    })

                }, (parseInt(REEL_RESET_TIME) - 1) * 1000);
                if (index === 2)
                    isResetted = false;
            }

            let randomNumber;

            /*
                    IF THE SPIN IS NOT FOR WINNING A GAME
            */

            if (!isWinTime) {
                randomNumber = Math.floor(Math.random() * -17);

                let stickIndex = randomNumber;
                stickIndex = -stickIndex;
                stickIndex %= 20;
                stickIndex += 1;

                if (index !== 2) {
                    stickers[index] = reelEmojis[index][stickIndex];
                }
                else if (index === 2) {
                    // Check if previous two symbols are same
                    if (stickers[0] === stickers[1]) {
                        // Check if last symbol is also same, if it is don't allow it
                        while (stickers[1] === reelEmojis[index][stickIndex]) {
                            randomNumber = Math.floor(Math.random() * -17);

                            stickIndex = randomNumber;
                            stickIndex = -stickIndex;
                            stickIndex %= 20;
                            stickIndex += 1;
                        }
                    }
                    stickers[index] = reelEmojis[index][stickIndex];
                }

            }

            /*
                    IF THE SPIN IS FOR WINNING A GAME
            */

            else if (isWinTime) {
                randomNumber = WIN_INDICES[randIndex];
                randomNumber = -randomNumber;
                randomNumber += 1;

                if (index == 2) {
                    setTimeout(() => {

                        var overlay = document.getElementById("overlay");

                        overlay.style.display = "flex";
                        timerElement.style.display = "flex";
                        timerElement.autoplay = false;
                        timerElement.controls = false;
                        timerElement.play();

                    }, TIMER_START * 1000);
                }

            }

            /*
                    GENERATE RANDOM MOVE OFFSET FOR EACH REEL
            */

            let offset = Math.floor(Math.random() * (N_TIMES - 1));
            while ((offset === offsets[index]) || (Math.abs(offset - offsets[index]) < 6)) {
                offset = Math.floor(Math.random() * (N_TIMES - 1));
            }

            offsets[index] = offset;
            offset *= 20;
            randomNumber -= offset;

            /*
                    ANIMATE THE MOVEMENT OF REEL
            */

            const slots = reel.querySelectorAll('.slots');
            slots.forEach((slot) => {
                slot.style.transform = `translateY(${randomNumber * 100 - 50}%)`;
            });
        });
    });

});