const synth = window.speechSynthesis;

function speak (msg, voice) {
    return new Promise((resolve, reject) => {
        if (synth.speaking) reject('Synth already speaking!');
    
        const utterThis = new SpeechSynthesisUtterance(msg);
        utterThis.voice = voice;
        utterThis.onend = () => resolve('Synth finished speaking!');
        utterThis.onerror = () => reject('Synth has an error! Fuck off!');
        synth.speak(utterThis);
    })
}

function textFromUrl () {
    const split = location.href.split('?');

    if (split.length < 2) return;

    const query = split.reverse()[0].split('&').map(v => v.split('='));
    const text = query.find(q => q[0] === 'text');

    return (text[1]) ? decodeURIComponent(text[1]) : false;
}

function init () {
    const lang = 'de-DE';
    const form = document.getElementById('form');
    const submitButton = form.querySelector('button[type=submit]');
    const text = textFromUrl();

    if (text) form.text.value = text;

    form.addEventListener('submit', evt => evt.preventDefault());
    submitButton.addEventListener('click', () => {
        const voice = synth.getVoices().find(v => v.lang === lang);
        const text = form.text.value;
        if (text.length > 0) {
            submitButton.disabled = true;
            speak(text, voice)
                .catch(console.error)
                .finally(_ => submitButton.disabled = false);
        }
    });
}

window.onload = init;