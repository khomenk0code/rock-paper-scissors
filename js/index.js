window.addEventListener('load', () => {

    const [countUser, countComp, userField, compField, result, sound, play, unmuteBtn, muteBtn] = [
        '.count-user', '.count-comp', '.user-field', '.comp-field',
        '.result', '.sound', '.play','.sound-on', '.sound-off',
    ].map((selector) => document.querySelector(selector));
    const fields = document.querySelectorAll('.field');
    let userStep, compStep, userCountNum = 0, compCountNum = 0, blocked = false;

    countUser.innerText = '0';
    countComp.innerText = '0';


    unmuteBtn.addEventListener('click', () => {
        sound.muted = true;
        updateSoundButtons();
    });

    muteBtn.addEventListener('click', () => {
        sound.muted = false;
        updateSoundButtons();
    });



    function updateSoundButtons() {
        if (!sound.muted) {
            muteBtn.classList.add('hidden');
            unmuteBtn.classList.remove('hidden');
        } else {
            muteBtn.classList.remove('hidden');
            unmuteBtn.classList.add('hidden');
        }
    }

    updateSoundButtons();


    const userChoice = (e) => {
        if (blocked) return;
        let target = e.target;
        if (target.classList.contains('field')) {
            userStep = target.dataset.field;
            fields.forEach(item => item.classList.remove('active', 'lose'))
            target.classList.add('active');
            compChoice();
        }
    };

    const compChoice = () => {
        blocked = true;
        let random = Math.floor(Math.random() * 3);
        compField.classList.add('pick-animation');
        let compFields = compField.querySelectorAll('.field')

        setTimeout(() => {
            compField.classList.remove('pick-animation');
            compStep = compFields[random].dataset.field;
            compFields[random].classList.add('active');
            winner();
        }, 3000);


    };

    const winner = () => {
        blocked = false;

        let conditions = userStep + compStep;

        switch (conditions) {
            case 'rr':
            case 'ss':
            case 'pp':
                result.innerText = 'Draw!';
                sound.setAttribute('src', './audio/draw.mp3');
                sound.play();
                break;

            case 'rs':
            case 'sp':
            case 'pr':
                result.innerText = 'Player win!';
                sound.setAttribute('src', './audio/win.mp3');
                sound.play();
                userCountNum++;
                countUser.innerText = userCountNum;
                compField.querySelector('[data-field = ' + compStep + ']').classList.add('lose');
                break;

            case 'sr':
            case 'ps':
            case 'rp':
                result.innerText = 'Computer win!';
                sound.setAttribute('src', 'audio/lose.mp3');
                sound.play();
                compCountNum++;
                countComp.innerText = compCountNum;
                userField.querySelector('[data-field = ' + userStep + ']').classList.add('lose');
                break;
        }
    };

    const startGame = () => {
        userCountNum = compCountNum = 0;
        result.innerText = 'Make your choice';
        countUser.innerText = '0';
        countComp.innerText = '0';
        fields.forEach(item => item.classList.remove('active', 'lose'));

    };

    play.addEventListener('click', startGame);
    userField.addEventListener('click', userChoice)


});



