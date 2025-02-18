require(["vs/editor/editor.main"], function () {
    window.editor = andorra.editor.create(document.getElementById("editorContainer"), {
        value: "Enter JanusML here...",
        language: "markdown",
        theme: "vs-dark",
        fontFamily: 'KilroyMono, monospace',
        automaticLayout: true,
        wordWrap: "off",
        minimap: { enabled: true }
    });

    editor.getModel().onDidChangeContent(() => {
        convertJanusML();
    });

    const font = new FontFace('KilroyMono', 'url(https://janusml.pages.dev/assets/KilroyMono-VF.ttf)');

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
    .use(window["janusmlEmoji"] || janusmlEmoji)
    .use(janusmlContainer, 'info', {
        render: function (tokens, idx) {
            return tokens[idx].nesting === 1 ? '<div class="alert info">' : '</div>\n';
        }
    })
    .use(janusmlContainer, 'warning', {
        render: function (tokens, idx) {
            return tokens[idx].nesting === 1 ? '<div class="alert warning">' : '</div>\n';
        }
    })
    .use(janusmlContainer, 'danger', {
        render: function (tokens, idx) {
            return tokens[idx].nesting === 1 ? '<div class="alert danger">' : '</div>\n';
        }
    })
    .use(janusmlContainer, 'success', {
        render: function (tokens, idx) {
            return tokens[idx].nesting === 1 ? '<div class="alert success">' : '</div>\n';
        }
    })
    .use(janusmlContainer, 'container', {
        render: function (tokens, idx) {
            return tokens[idx].nesting === 1 ? '<div class="container-box default">' : '</div>\n';
        }
    })
    .use(janusmlContainer, 'important', {
        render: function (tokens, idx) {
            return tokens[idx].nesting === 1 ? '<div class="container-box important">' : '</div>\n';
        }
    })
    .use(janusmlContainer, 'inline', {
        render: function (tokens, idx) {
            return tokens[idx].nesting === 1 ? '<div class="alert inline">' : '</div>\n';
        }
    })
    .use(window.janusmlAttrs);

function convertJanusML() {
    let janusmlText = editor.getValue();
    let htmlContent = md.render(janusmlText);
    document.getElementById("preview").innerHTML = htmlContent;
}

window.addEventListener("beforeunload", function (event) {
    event.preventDefault();
    event.returnValue = "Are you sure you want to leave? Your changes may not be saved.";
});

function copyHTML() {
    let janusmlText = editor.getValue();
    let htmlContent = document.getElementById("preview").innerHTML;
    let fullHTML = `<!DOCTYPE html>
<html>
<head>
<meta charset='UTF-8'>
<meta name='viewport' content='width=device-width, initial-scale=1.0'>
<title>Page Title | JANUS</title>
<link rel="shortcut icon" href="https://janusml.pages.dev/assets/favicon.png" type="image/x-icon">
<link rel="stylesheet" href="https://janusml.pages.dev/library/janusml.css">
</head>
<body>
<!-- Original JanusML:
${janusmlText.replace(/-->/g, "--&gt;")}
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
