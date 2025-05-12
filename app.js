// Story Editor Core Logic

const chapterList = document.getElementById('chapter-list');
const addChapterBtn = document.getElementById('add-chapter');
const editor = document.getElementById('editor');
const chapterTitle = document.getElementById('chapter-title');
const saveBtn = document.getElementById('save-btn');

// Story Prompts and Motivation
const prompts = [
    "A mysterious letter arrives at your protagonist's door...",
    "Describe a setting where time seems to stand still.",
    "A character faces their greatest fear.",
    "Two unlikely allies must work together.",
    "Something precious goes missing in the night.",
    "A secret is revealed that changes everything.",
    "Write a scene with only dialogue.",
    "Describe a storm from the perspective of a child.",
    "A character makes a difficult choice.",
    "The story begins at the end."
];
const motivations = [
    "Every great novel started with a single word. Keep going!",
    "Don't worry about perfection—just write!",
    "Your story matters. Let it unfold.",
    "Take a deep breath and dive into your world.",
    "Even a small step is progress. You’ve got this!"
];

const promptText = document.getElementById('prompt-text');
const newPromptBtn = document.getElementById('new-prompt');
const motivationDiv = document.getElementById('motivation');

function showRandomPrompt() {
    const idx = Math.floor(Math.random() * prompts.length);
    promptText.textContent = prompts[idx];
}

if (newPromptBtn) {
    newPromptBtn.onclick = showRandomPrompt;
    showRandomPrompt();
}

// Rotating motivational messages
let motivationIdx = 0;
function showMotivation() {
    motivationDiv.textContent = motivations[motivationIdx];
    motivationIdx = (motivationIdx + 1) % motivations.length;
}
if (motivationDiv) {
    showMotivation();
    setInterval(showMotivation, 15000); // Change every 15 seconds
}

// Story Structure Notes
const structureFields = [
    { id: 'setting-note', key: 'setting' },
    { id: 'characters-note', key: 'characters' },
    { id: 'conflict-note', key: 'conflict' },
    { id: 'resolution-note', key: 'resolution' }
];

function loadStructureNotes() {
    const notes = JSON.parse(localStorage.getItem('storyStructure') || '{}');
    structureFields.forEach(f => {
        const el = document.getElementById(f.id);
        if (el && notes[f.key]) el.value = notes[f.key];
    });
}
function saveStructureNotes() {
    const notes = {};
    structureFields.forEach(f => {
        const el = document.getElementById(f.id);
        if (el) notes[f.key] = el.value;
    });
    localStorage.setItem('storyStructure', JSON.stringify(notes));
}
structureFields.forEach(f => {
    const el = document.getElementById(f.id);
    if (el) el.oninput = saveStructureNotes;
});

let chapters = [];
let currentChapterIndex = 0;

function loadChapters() {
    const saved = localStorage.getItem('storyChapters');
    chapters = saved ? JSON.parse(saved) : [
        { title: 'Chapter 1', content: '' }
    ];
    currentChapterIndex = 0;
    renderChapterList();
    loadChapter(currentChapterIndex);
}

function saveChapters() {
    localStorage.setItem('storyChapters', JSON.stringify(chapters));
}

function renderChapterList() {
    chapterList.innerHTML = '';
    chapters.forEach((ch, idx) => {
        const li = document.createElement('li');
        li.textContent = ch.title || `Chapter ${idx+1}`;
        li.className = idx === currentChapterIndex ? 'active' : '';
        li.onclick = () => {
            saveCurrentChapter();
            loadChapter(idx);
        };
        chapterList.appendChild(li);
    });
}

function loadChapter(idx) {
    currentChapterIndex = idx;
    chapterTitle.value = chapters[idx].title;
    editor.value = chapters[idx].content;
    renderChapterList();
}

function saveCurrentChapter() {
    chapters[currentChapterIndex].title = chapterTitle.value;
    chapters[currentChapterIndex].content = editor.value;
    saveChapters();
}

addChapterBtn.onclick = () => {
    saveCurrentChapter();
    chapters.push({ title: `Chapter ${chapters.length+1}`, content: '' });
    loadChapter(chapters.length - 1);
    saveChapters();
};

saveBtn.onclick = () => {
    saveCurrentChapter();
    alert('Chapter saved!');
};

chapterTitle.oninput = () => {
    chapters[currentChapterIndex].title = chapterTitle.value;
    renderChapterList();
};

window.onbeforeunload = () => {
    saveCurrentChapter();
    saveStructureNotes();
};

// Initial load
loadChapters();
loadStructureNotes();
