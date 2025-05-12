// Story Editor Core Logic

const chapterList = document.getElementById('chapter-list');
const addChapterBtn = document.getElementById('add-chapter');
const editor = document.getElementById('editor');
const chapterTitle = document.getElementById('chapter-title');
const saveBtn = document.getElementById('save-btn');

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

window.onbeforeunload = saveCurrentChapter;

// Initial load
loadChapters();
