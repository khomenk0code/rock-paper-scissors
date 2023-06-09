window.addEventListener('load', () => {
    const countUser = document.querySelector('.count-user');
    const countComp = document.querySelector('.count-comp');
    const userField = document.querySelector('.user-field');
    const compField = document.querySelector('.comp-field');
    const result = document.querySelector('.result');
    const sound = document.querySelector('.sound');
    const play = document.querySelector('.play');
    const unmuteBtn = document.querySelector('.sound-on');
    const muteBtn = document.querySelector('.sound-off');
    const rules = document.querySelector('.rules-img');
    const rulesBtn = document.querySelector('.rules-btn');
    const closeBtn = document.querySelector('.close-btn');
    const gameInfo = document.querySelector('.game-info');
    const fields = document.querySelectorAll('.field');
    let userStep, compStep, compChoiceTimeout,
        userCountNum = 0, compCountNum = 0, blocked = false, restartInProgress = false;


    const userCount = localStorage.getItem('countUser');
    if (userCount) {
        userCountNum = parseInt(userCount);
        countUser.innerText = userCountNum;
    } else {
        countUser.innerText = '0';
    }

    const compCount = localStorage.getItem('compCount');
    if (compCount) {
        compCountNum = parseInt(compCount);
        countComp.innerText = compCountNum;
    } else {
        countComp.innerText = '0';
    }

    sound.volume = 0.1;

    rulesBtn.addEventListener('click', () => {
        rules.classList.toggle('hidden');
        closeBtn.classList.toggle('hidden');
    })

    closeBtn.addEventListener('click', () => {
        rules.classList.add('hidden')
        rules.classList.remove('block');
        closeBtn.classList.add('hidden')
        closeBtn.classList.remove('block');
    })



    const updateSoundButtons = () => {
        muteBtn.classList.toggle('hidden', !sound.muted);
        unmuteBtn.classList.toggle('hidden', sound.muted);
    };

    const toggleSound = () => {
        sound.muted = !sound.muted;
        localStorage.setItem('muted', sound.muted.toString());
        updateSoundButtons();
    };

    unmuteBtn.addEventListener('click', () => toggleSound());
    muteBtn.addEventListener('click', () => toggleSound());

    sound.muted = localStorage.getItem('muted') === 'true';

    updateSoundButtons();


    const userChoice = (e) => {
        if (blocked || restartInProgress) return;
        let target = e.target;

        if (target.classList.contains('field')) {
            userStep = target.dataset.field;
            fields.forEach(item => item.classList.remove('active', 'lose'))
            target.classList.add('active');
            gameInfo.classList.remove('block')
            gameInfo.classList.add('hidden')
            compChoice();
            blocked = true;
        }
    };

    const compChoice = () => {
        if (blocked || restartInProgress) return;
        let random = Math.floor(Math.random() * 3);
        compField.classList.add('pick-animation');
        const compFields = compField.querySelectorAll('.field')

        compChoiceTimeout = setTimeout(() => {
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
                localStorage.setItem('countUser', userCountNum);
                compField.querySelector(`[data-field = ${compStep}]`).classList.add('lose');
                break;

            case 'sr':
            case 'ps':
            case 'rp':
                result.innerText = 'Computer win!';
                sound.setAttribute('src', 'audio/lose.mp3');
                sound.play();
                compCountNum++;
                countComp.innerText = compCountNum;
                localStorage.setItem('compCount', compCountNum);
                userField.querySelector(`[data-field = ${userStep}]`).classList.add('lose');
                break;
        }
    };

    const restartGame = () => {
        if (restartInProgress) return;
        restartInProgress = true;
        userCountNum = compCountNum = 0;
        result.innerText = 'Make your choice';
        gameInfo.classList.remove('hidden')
        gameInfo.classList.add('block')
        countUser.innerText = '0';
        countComp.innerText = '0';
        fields.forEach(item => item.classList.remove('active', 'lose'));
        clearTimeout(compChoiceTimeout);
        compField.classList.remove('pick-animation');
        restartInProgress = false;
        localStorage.removeItem('compCount');
        localStorage.removeItem('countUser');
    };


    play.addEventListener('click', restartGame);
    userField.addEventListener('click', userChoice)


});



