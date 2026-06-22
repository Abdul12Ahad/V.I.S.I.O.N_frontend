let currentAnalysis = "";
let speechUtterance = null;
let isSpeaking = false;

document
    .getElementById("imageInput")
    .addEventListener(
        "change",
        showPreview
    );

function showPreview() {

    const file =
        document
            .getElementById("imageInput")
            .files[0];

    if (!file) return;

    const imageUrl =
        URL.createObjectURL(file);

    document
        .getElementById("previewImage")
        .src = imageUrl;

    document
        .getElementById("previewImage")
        .style.display = "block";

    const sizeKB =
        (file.size / 1024).toFixed(2);

    document
        .getElementById("fileInfo")
        .innerHTML = `

            <strong>${file.name}</strong>
            <br>
            ${sizeKB} KB

        `;
}

async function uploadImage() {

    const result =
        document.getElementById("result");

    const loading =
        document.getElementById("loadingContainer");

    const loadingText =
        document.getElementById("loadingText");

    const analyzeBtn =
        document.getElementById("analyzeBtn");

    const file =
        document
            .getElementById("imageInput")
            .files[0];

    if (!file) {

        alert(
            "Please select an image first."
        );

        return;
    }

    result.innerHTML = "";

    loading.style.display = "flex";

    analyzeBtn.disabled = true;

    try {

        loadingText.textContent =
            "Uploading Image...";

        const formData =
            new FormData();

        formData.append(
            "file",
            file
        );

        loadingText.textContent =
            "Analyzing Image...";

        const response =
            await fetch(
                "http://127.0.0.1:8000/analyze",
                {
                    method: "POST",
                    body: formData
                }
            );

        loadingText.textContent =
            "Generating Educational Response...";

        const data =
            await response.json();

        currentAnalysis = `
            Description:
            ${data.description}

            What It Is:
            ${data.what_it_is}

            How It Works:
            ${data.how_it_works}

            Why Important:
            ${data.why_important}

            Fun Fact:
            ${data.fun_fact}
            `;

    result.innerHTML = `

        <div class="result-card">

            <button
                class="card-audio-btn"
                onclick="speakCard(this)"
                data-text="${data.description}"
            >
                🔊
            </button>
            <h2>Description</h2>
            <p>${data.description}</p>

        </div>

        <div class="result-card">

            <button
                class="card-audio-btn"
                onclick="speakCard(this)"
                data-text="${data.what_it_is}"
            >
                🔊
            </button>

            <h2>What It Is</h2>
            <p>${data.what_it_is}</p>

        </div>

        <div class="result-card">

        <button
            class="card-audio-btn"
            onclick="speakCard(this)"
            data-text="${data.how_it_works}"
        >
            🔊
        </button>
            <h2>How It Works</h2>
            <p>${data.how_it_works}</p>

        </div>

        <div class="result-card">

            <button
                class="card-audio-btn"
                onclick="speakCard(this)"
                data-text="${data.why_important}"
            >
                🔊
            </button>
            <h2>Why It Is Important</h2>
            <p>${data.why_important}</p>

        </div>

        <div class="result-card">

            <button
                class="card-audio-btn"
                onclick="speakCard(this)"
                data-text="${data.fun_fact}"
            >
                🔊
            </button>
            <h2>Fun Fact</h2>
            <p>${data.fun_fact}</p>

        </div>

        <div class="result-card">

        <button
            class="card-audio-btn"
            onclick="speakCard(this)"
            data-text="${data.key_concepts.join(', ')}"
        >
            🔊
        </button>
        
            <h2>Key Concepts</h2>

            <ul>
                ${data.key_concepts
                    .map(item => `<li>${item}</li>`)
                    .join("")}
            </ul>

        </div>

        <div class="result-card">

            <button
                class="card-audio-btn"
                onclick="speakCard(this)"
                data-text="${data.related_topics.join(', ')}"
            >
                🔊
            </button>

            <h2>Related Topics</h2>

            <ul>
                ${data.related_topics
                    .map(item => `<li>${item}</li>`)
                    .join("")}
            </ul>

        </div>

        <div class="result-card">

            <button
                class="card-audio-btn"
                onclick="speakCard(this)"
                data-text="${data.learn_more.join(', ')}"
            >
                🔊
            </button>
            
            <h2>Learn More</h2>

            <ul>
                ${data.learn_more
                    .map(item => `<li>${item}</li>`)
                    .join("")}
            </ul>

        </div>

        <div class="result-card">

            <h2>Image Information</h2>

            <p><strong>Width:</strong> ${data.width}px</p>
            <p><strong>Height:</strong> ${data.height}px</p>
            <p><strong>Size:</strong> ${data.size_kb} KB</p>

        </div>

    `;

    }
    catch (error) {

        console.error(error);

        result.innerHTML = `

            <h2>Error</h2>

            <p>
                Failed to analyze image.
                Please try again.
            </p>

        `;
    }
    finally {

        loading.style.display = "none";

        analyzeBtn.disabled = false;
    }
}

async function askQuestion() {

    const question =
        document.getElementById(
            "questionInput"
        ).value;

    if (!question) return;

    const answerContainer =
        document.getElementById(
            "answerContainer"
        );

    answerContainer.innerHTML =
        "Thinking...";

    const response =
        await fetch(
            "http://127.0.0.1:8000/ask",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    context:
                        currentAnalysis,

                    question:
                        question
                })
            }
        );

    const data =
        await response.json();

    answerContainer.innerHTML = `

        <div class="result-card">

            <h2>Answer</h2>

            <p>${data.answer}</p>

        </div>

    `;
}

let historyOpen = false;

async function toggleHistory() {

    const sidebar =
        document.getElementById(
            "historySidebar"
        );

    const button =
        document.getElementById(
            "historyToggle"
        );

    historyOpen =
        !historyOpen;

    if (historyOpen) {

            sidebar.classList.add(
                "open"
            );

            button.classList.add(
                "open"
            );

            button.textContent = "✕";

            await loadHistory();
        }
        else {

            sidebar.classList.remove(
                "open"
            );

            button.classList.remove(
                "open"
            );

            button.textContent = "☰";
        }
}

async function loadHistory() {

    const historyContainer =
        document.getElementById(
            "historyContainer"
        );

    historyContainer.innerHTML =
        "Loading...";

    const response =
        await fetch(
            "http://127.0.0.1:8000/history"
        );

    const history =
        await response.json();

    historyContainer.innerHTML =
        history.map(item => `

            <div class="result-card">

                <h3>${item.image_name}</h3>

                <p>
                    ${item.created_at}
                </p>

                <p>
                    ${item.description}
                </p>

            </div>

        `).join("");
}

function speakCard(button) {

    if (
        speechSynthesis.speaking &&
        activeButton === button
    ) {

        speechSynthesis.cancel();

        button.textContent = "🔈";

        activeButton = null;

        return;
    }

    speechSynthesis.cancel();

    document
        .querySelectorAll(".card-audio-btn")
        .forEach(btn => {
            btn.textContent = "🔈";
        });

    activeButton = button;

    button.textContent = "🔊";

    const text =
        button.dataset.text;

    const utterance =
        new SpeechSynthesisUtterance(text);

    utterance.rate = 1;

    utterance.onend = () => {

        button.textContent = "🔈";

        activeButton = null;
    };

    speechSynthesis.speak(utterance);
}