require(["vs/editor/editor.main"], function () {
    window.editor = andorra.editor.create(document.getElementById("editorContainer"), {
        value: "Enter JanusML here...",
        language: "markdown",
        theme: "vs-dark",
        fontFamily: 'AndorraMono, monospace',
        automaticLayout: true,
        wordWrap: "off",
        minimap: { enabled: true }
    });

    editor.getModel().onDidChangeContent(() => {
        convertMarkdown();
    });

    const font = new FontFace('AndorraMono', 'url(https://exambook.pages.dev/assets/fonts/AndorraMono.ttf)');

    font.load().then(() => {
        document.fonts.add(font);
        andorra.editor.remeasureFonts();
    }).catch((error) => {
        console.error('Error loading custom font:', error);
    });

    // Toggle line wrap
    document.getElementById("toggleLineWrap").addEventListener("change", function () {
        editor.updateOptions({ wordWrap: this.checked ? "on" : "off" });
    });

    // Toggle minimap
    document.getElementById("toggleMinimap").addEventListener("change", function () {
        editor.updateOptions({ minimap: { enabled: this.checked } });
    });
});

const md = window.janusml()
    .use(window["janusmlFootnote"] || janusmlFootnote)
    .use(window["janusmlDeflist"] || janusmlDeflist)
    .use(window["janusmlTaskLists"] || janusmlTaskLists)
    .use(window["janusmlMark"] || janusmlMark)
    .use(window["janusmlSub"] || janusmlSub)
    .use(window["janusmlSup"] || janusmlSup)
    .use(window["janusmlAbbr"] || janusmlAbbr)
    .use(window.janusmlContainer)
    .use(window.janusmlAnchor)
    .use(janusmlContainer, 'info', {
        render: function (tokens, idx) {
            if (tokens[idx].nesting === 1) {
                return '<div class="alert info">';
            } else {
                return '</div>\n';
            }
        }
    })
    .use(janusmlContainer, 'warning', {
        render: function (tokens, idx) {
            if (tokens[idx].nesting === 1) {
                return '<div class="alert warning">';
            } else {
                return '</div>\n';
            }
        }
    })
    .use(janusmlContainer, 'danger', {
        render: function (tokens, idx) {
            if (tokens[idx].nesting === 1) {
                return '<div class="alert danger">';
            } else {
                return '</div>\n';
            }
        }
    })
    .use(window.janusmlAttrs);

function convertMarkdown() {
    let markdownText = editor.getValue();
    let htmlContent = md.render(markdownText);
    document.getElementById("preview").innerHTML = htmlContent;
}

window.addEventListener("beforeunload", function (event) {
    event.preventDefault();
    event.returnValue = "Are you sure you want to leave? Your changes may not be saved.";
});

function copyHTML() {
    let markdownText = editor.getValue();
    let htmlContent = document.getElementById("preview").innerHTML;
    let fullHTML = `<!DOCTYPE html>
<html>
<head>
<meta charset='UTF-8'>
<meta name='viewport' content='width=device-width, initial-scale=1.0'>
<title>Page Title | JanusML</title>
<link rel="shortcut icon" href="https://janusml.pages.dev/assets/favicon.png" type="image/x-icon">
<style>
@import url(https://janusml.pages.dev/library/janusml.css);
</style>
</head>
<body>
<!-- Original Markdown:
${markdownText.replace(/-->/g, "--&gt;")}
-->
${htmlContent}
</body>

</html>`;
    navigator.clipboard.writeText(fullHTML).then(() => {
        alert("Full HTML copied to clipboard!");
    }).catch(err => {
        alert("Failed to copy: " + err);
    });
}