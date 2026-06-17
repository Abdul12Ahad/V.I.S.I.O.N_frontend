async function uploadImage() {

    document.getElementById("result").innerHTML =
        "<h2>Analyzing image...</h2>";
        
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

    const formData =
        new FormData();

    formData.append(
        "file",
        file
    );

    const response =
        await fetch(
            "http://127.0.0.1:8000/analyze",
            {
                method: "POST",
                body: formData
            }
        );

    const data =
        await response.json();

    document
    .getElementById("result")
    .innerHTML = `

        <h2>Analysis</h2>
        <p>${data.analysis}</p>
        
        <h2>Image Information</h2>

        <p><strong>Width:</strong> ${data.width}px</p>
        <p><strong>Height:</strong> ${data.height}px</p>
        <p><strong>Size:</strong> ${data.size_kb} KB</p>

        `;
}