import { backend } from 'declarations/backend';

const inputText = document.getElementById('inputText');
const targetLanguage = document.getElementById('targetLanguage');
const translateBtn = document.getElementById('translateBtn');
const outputText = document.getElementById('outputText');
const readAloudBtn = document.getElementById('readAloudBtn');

translateBtn.addEventListener('click', translateText);
readAloudBtn.addEventListener('click', readAloud);

async function translateText() {
    const text = inputText.value;
    const lang = targetLanguage.value;

    if (!text) {
        alert('Please enter some text to translate.');
        return;
    }

    try {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${lang}`);
        const data = await response.json();

        if (data.responseStatus === 200) {
            const translation = data.responseData.translatedText;
            outputText.textContent = translation;
            await backend.setLastTranslation(translation);
        } else {
            throw new Error('Translation failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while translating. Please try again.');
    }
}

function readAloud() {
    const text = outputText.textContent;

    if (!text) {
        alert('Please translate some text first.');
        return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetLanguage.value;
    speechSynthesis.speak(utterance);
}

// Load last translation on page load
window.addEventListener('load', async () => {
    try {
        const lastTranslation = await backend.getLastTranslation();
        if (lastTranslation) {
            outputText.textContent = lastTranslation;
        }
    } catch (error) {
        console.error('Error loading last translation:', error);
    }
});
