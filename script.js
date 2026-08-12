let optionsButtons = document.querySelectorAll(".option-button");
let advancedOptionButton = document.querySelectorAll(".adv-option-button");
let fontName = document.getElementById("fontName");
let fontSizeRef = document.getElementById("fontSize");
let writingArea = document.getElementById("text-input");
let linkButton = document.getElementById("createLink");
let alignButtons = document.querySelectorAll(".align");
let spacingButtons = document.querySelectorAll(".spacing");
let formatButtons = document.querySelectorAll(".format");
let scriptButtons = document.querySelectorAll(".script");

// List of fonts
let fontList = [
  "Arial",
  "Verdana",
  "Times New Roman",
  "Garamond",
  "Georgia",
  "Courier New",
  "cursive",
];

// Initial Settings
const initializer = () => {
  highlighter(alignButtons, true);
  highlighter(spacingButtons, true);
  highlighter(formatButtons, false);
  highlighter(scriptButtons, true);

  // Create options for font names
  fontList.map((value) => {
    let option = document.createElement("option");
    option.value = value;
    option.innerHTML = value;
    fontName.appendChild(option);
  });

  // Font size allows only till 7
  for (let i = 1; i <= 7; i++) {
    let option = document.createElement("option");
    option.value = i;
    option.innerHTML = i;
    fontSizeRef.appendChild(option);
  }

  // Default size
  fontSizeRef.value = 3;

  // ==========================================
  // RESTORE SAVED CONTENT & SETTINGS ON LOAD
  // ==========================================
  let savedContent = localStorage.getItem("editorContent");
  if (savedContent !== null) {
    writingArea.innerHTML = savedContent;
  }

  let savedSettingsString = localStorage.getItem("editorSettings");
  if (savedSettingsString) {
    try {
      let settings = JSON.parse(savedSettingsString);

      if (settings.fontName && fontName) {
        let optionExists = Array.from(fontName.options).some(
          (opt) => opt.value === settings.fontName
        );
        if (optionExists) fontName.value = settings.fontName;
      }

      if (settings.fontSize && fontSizeRef) {
        fontSizeRef.value = settings.fontSize;
      }

      let foreColor = document.getElementById("foreColor");
      if (settings.foreColor && foreColor) {
        foreColor.value = settings.foreColor;
      }

      let hiliteColor = document.getElementById("hiliteColor");
      if (settings.hiliteColor && hiliteColor) {
        hiliteColor.value = settings.hiliteColor;
      }
    } catch (e) {
      console.error("Error restoring settings:", e);
    }
  }
};

// Main logic
const modifyText = (command, defaultUi, value) => {
  document.execCommand(command, defaultUi, value);
};

// Basic operations (no value needed)
optionsButtons.forEach((button) => {
  button.addEventListener("click", () => {
    modifyText(button.id, false, null);
  });
});

// Options that need a value (colors, fonts)
advancedOptionButton.forEach((button) => {
  button.addEventListener("change", () => {
    modifyText(button.id, false, button.value);
  });
});

// Link
linkButton.addEventListener("click", () => {
  let userLink = prompt("Enter a URL");
  if (/http/i.test(userLink)) {
    modifyText(linkButton.id, false, userLink);
  } else {
    userLink = "http://" + userLink;
    modifyText(linkButton.id, false, userLink);
  }
});

// Highlight clicked button
const highlighter = (className, needsRemoval) => {
  className.forEach((button) => {
    button.addEventListener("click", () => {
      if (needsRemoval) {
        let alreadyActive = false;
        if (button.classList.contains("active")) {
          alreadyActive = true;
        }
        highlighterRemover(className);
        if (!alreadyActive) {
          button.classList.add("active");
        }
      } else {
        button.classList.toggle("active");
      }
    });
  });
};

const highlighterRemover = (className) => {
  className.forEach((button) => {
    button.classList.remove("active");
  });
};

// ==========================================
// Dark/Light Theme Toggle & localStorage Logic
// ==========================================
let themeToggle = document.getElementById("theme-toggle");
let bodyElement = document.body;

let savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  bodyElement.classList.add("dark-mode");
  let icon = themeToggle.querySelector("i");
  if (icon) {
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  }
}

themeToggle.addEventListener("click", () => {
  bodyElement.classList.toggle("dark-mode");
  let icon = themeToggle.querySelector("i");

  if (bodyElement.classList.contains("dark-mode")) {
    if (icon) {
      icon.classList.remove("fa-moon");
      icon.classList.add("fa-sun");
    }
    localStorage.setItem("theme", "dark");
  } else {
    if (icon) {
      icon.classList.remove("fa-sun");
      icon.classList.add("fa-moon");
    }
    localStorage.setItem("theme", "light");
  }
});

// ==========================================
// Print / Save as PDF
// ==========================================
function editorHasText() {
  let text = writingArea.innerText || writingArea.textContent ||"";
  text = text.trim();

  let hasImage = writingArea.querySelector("img") !== null;

  return text.length > 0 || hasImage;  
}

let printButton = document.getElementById("print-button");

if (printButton) {
  printButton.addEventListener("click", () => {
    if (!editorHasText()) {
      alert("Cannot save as PDF. Please add text or an image first.");
      writingArea.focus();
      return;
    }
    window.print();
  });
}

// ==========================================
// Save as HTML File
// ==========================================
let saveHtmlButton = document.getElementById("save-html-button");

if (saveHtmlButton) {
  saveHtmlButton.addEventListener("click", () => {
    let text = writingArea.innerText || writingArea.textContent || "";
    text = text.trim();

    if (text.length === 0) {
      alert("Cannot save HTML. Please type some text first.");
      writingArea.focus();
      return;
    }

    let fileName = prompt("Enter file name", "document");
    if (fileName === null) return;

    fileName = fileName.trim();
    if (fileName === "") fileName = "document";
    fileName = fileName.replace(/\.html?$/i, "");
    fileName = fileName.replace(/[<>:"/\\|?*]/g, "-");

    let safeTitle = fileName.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    let htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${safeTitle}</title>
<style>
body { font-family: Arial, sans-serif; color: #000; background: #fff; padding: 20px; line-height: 1.6; }
h1, h2, h3, h4, h5, h6 { margin: 10px 0; }
p { margin: 0 0 10px 0; }
ul, ol { padding-left: 20px; margin: 0 0 10px 0; }
</style>
</head>
<body>
${writingArea.innerHTML}
</body>
</html>`;

    let blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    let fileUrl = URL.createObjectURL(blob);
    let downloadLink = document.createElement("a");

    downloadLink.href = fileUrl;
    downloadLink.download = fileName + ".html";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(fileUrl);
  });
}

// ==========================================
// Insert Image Into the Editor
// ==========================================
let insertImageButton = document.getElementById("insert-image-button");
let imageInput = document.getElementById("image-input");
let savedImageRange = null;

document.addEventListener("selectionchange", () => {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    if (writingArea.contains(range.commonAncestorContainer)) {
      savedImageRange = range.cloneRange();
    }
  }
});

function createImageElement(dataUrl, fileName) {
  const img = document.createElement("img");
  img.src = dataUrl;
  img.alt = fileName || "image";
  img.style.maxWidth = "100%";
  img.style.height = "auto";
  return img;
}

function restoreImageSelection() {
  writingArea.focus();
  const selection = window.getSelection();

  if (savedImageRange) {
    try {
      selection.removeAllRanges();
      selection.addRange(savedImageRange);
      return;
    } catch (error) {
      // fall back to end
    }
  }

  const range = document.createRange();
  range.selectNodeContents(writingArea);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

function insertImageAtCursor(dataUrl, fileName) {
  restoreImageSelection();
  const selection = window.getSelection();

  if (!selection.rangeCount || !writingArea.contains(selection.anchorNode)) {
    writingArea.appendChild(createImageElement(dataUrl, fileName));
    return;
  }

  const range = selection.getRangeAt(0);
  range.deleteContents();

  const img = createImageElement(dataUrl, fileName);
  range.insertNode(img);

  range.setStartAfter(img);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
}

if (insertImageButton && imageInput) {
  insertImageButton.addEventListener("click", () => {
    imageInput.click();
  });

  imageInput.addEventListener("change", () => {
    if (!imageInput.files || !imageInput.files[0]) return;

    const file = imageInput.files[0];

    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file.");
      imageInput.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Please choose an image smaller than 5MB.");
      imageInput.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
      insertImageAtCursor(event.target.result, file.name);
      imageInput.value = "";
    };

    reader.onerror = function () {
      alert("Sorry, the image could not be read.");
      imageInput.value = "";
    };

    reader.readAsDataURL(file);
  });
}

// ==========================================
// Home Button (back to index.html)
// ==========================================
let homeButton = document.getElementById("home-button");

if (homeButton) {
  homeButton.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

// ==========================================
// AUTO-SAVE CONTENT AND SETTINGS
// ==========================================
const autoSaveObserver = new MutationObserver(() => {
  localStorage.setItem("editorContent", writingArea.innerHTML);
});

autoSaveObserver.observe(writingArea, {
  childList: true,
  subtree: true,
  characterData: true,
  attributes: true,
});

function saveAdvancedSettings() {
  let foreColor = document.getElementById("foreColor");
  let hiliteColor = document.getElementById("hiliteColor");

  let settings = {
    fontName: fontName ? fontName.value : "",
    fontSize: fontSizeRef ? fontSizeRef.value : "3",
    foreColor: foreColor ? foreColor.value : "#000000",
    hiliteColor: hiliteColor ? hiliteColor.value : "#ffffff",
  };

  localStorage.setItem("editorSettings", JSON.stringify(settings));
}

advancedOptionButton.forEach((control) => {
  control.addEventListener("change", saveAdvancedSettings);
  control.addEventListener("input", saveAdvancedSettings);
});

// ==========================================
// START EVERYTHING
// ==========================================
initializer();

// ==========================================
// FORCE-RESTORE TOOLBAR CONTROLS 
// ==========================================
(function restoreControls() {
  let savedSettingsString = localStorage.getItem("editorSettings");
  if (!savedSettingsString) return;

  let settings;
  try {
    settings = JSON.parse(savedSettingsString);
  } catch (e) {
    return;
  }

  // Sets a color input AND forces the browser to repaint the swatch
  function forceColor(input, value) {
    if (!input || !value) return;
    input.value = value;

    requestAnimationFrame(() => {
      input.value = "#000000"; // temporary flip...
      input.value = value;     // ...back to the real color = repaint
    });
  }

  if (settings.fontName && fontName) {
    let exists = Array.from(fontName.options).some(
      (o) => o.value === settings.fontName
    );
    if (exists) fontName.value = settings.fontName;
  }

  if (settings.fontSize && fontSizeRef) {
    fontSizeRef.value = settings.fontSize;
  }

  forceColor(document.getElementById("foreColor"), settings.foreColor);
  forceColor(document.getElementById("hiliteColor"), settings.hiliteColor);
})();