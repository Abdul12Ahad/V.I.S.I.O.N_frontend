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

    result.innerHTML = `

        <h2>Description</h2>
        <p>${data.description}</p>

        <h2>What It Is</h2>
        <p>${data.what_it_is}</p>

        <h2>How It Works</h2>
        <p>${data.how_it_works}</p>

        <h2>Why It Is Important</h2>
        <p>${data.why_important}</p>

        <h2>Fun Fact</h2>
        <p>${data.fun_fact}</p>

        <hr>

        <h2>Key Concepts</h2>
        <ul>
            ${data.key_concepts
                .map(item => `<li>${item}</li>`)
                .join("")}
        </ul>

        <h2>Related Topics</h2>
        <ul>
            ${data.related_topics
                .map(item => `<li>${item}</li>`)
                .join("")}
        </ul>

        <h2>Learn More</h2>
        <ul>
            ${data.learn_more
                .map(item => `<li>${item}</li>`)
                .join("")}
        </ul>

        <hr>

        <h2>Image Information</h2>

        <p><strong>Width:</strong> ${data.width}px</p>

        <p><strong>Height:</strong> ${data.height}px</p>

        <p><strong>Size:</strong> ${data.size_kb} KB</p>

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