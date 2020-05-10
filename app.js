const synth = window.speechSynthesis;

function msgFromUrl (key) {
    const split = location.href.split('?');

    if (split.length < 2) return;

    const query = split.reverse()[0].split('&').map(v => v.split('='));
    const text = query.find(q => q[0] === key);

    return (text[1]) ? decodeURIComponent(text[1]) : false;
}

function parseForm (form, fields) {
    const formData = new FormData(form);
    const result = {};

    for (let field of fields) {
        result[field] = formData.get(field) || null;
    }

    return result;
}

function speak (msg, voice, { pitch = 1, rate = 1 }) {
    return new Promise((resolve, reject) => {
        if (synth.speaking) reject('Synth already speaking!');
    
        const utterThis = new SpeechSynthesisUtterance(msg);
        utterThis.voice = voice;
        utterThis.pitch = pitch;
        utterThis.rate = rate;

        utterThis.onend = () => resolve('Synth finished speaking!');
        utterThis.onerror = () => reject('Synth has an error! Fuck off!');
        synth.speak(utterThis);
    })
}

function init () {
    const lang = 'de-DE';
    const form = document.getElementById('form');
    const submitButton = form.querySelector('button[type=submit]');
    const text = msgFromUrl();

    if (text) form.text.value = text;

    form.addEventListener('submit', evt => evt.preventDefault());
    submitButton.addEventListener('click', () => {
        const voice = synth.getVoices().find(v => v.lang === lang);
        const { text, pitch, rate } = parseForm(form, ['text', 'pitch', 'rate']);
        console.log(text, pitch, rate);
        if (text.length > 0) {
            submitButton.disabled = true;
            speak(text, voice, { pitch, rate })
                .catch(console.error)
                .finally(_ => submitButton.disabled = false);
        }
    });
}

window.onload = init;