if (!document.getElementById("quick-search-launcher")) {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const launcher = document.createElement("button");
  launcher.id = "quick-search-launcher";
  launcher.textContent = "🔍";
  Object.assign(launcher.style, {
    position: "fixed", bottom: "20px", right: "20px", zIndex: 9999,
    padding: "10px", borderRadius: "50%", border: "none",
    backgroundColor: "#4285f4", color: "white", cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
  });

  const menu = document.createElement("div");
  menu.id = "quick-search-menu";
  Object.assign(menu.style, {
    position: "fixed", bottom: "70px", right: "20px", zIndex: 9999,
    display: "none", flexDirection: "column", gap: "10px"
  });

  const getEngines = () => {
    const raw = localStorage.getItem("search_engines");
    return raw ? JSON.parse(raw) : [
      { name: "Google", emoji: "🌐", url: "https://www.google.com/search?q=" },
      { name: "YouTube", emoji: "📺", url: "https://www.youtube.com/results?search_query=" }
    ];
  };

  const renderMenu = () => {
    menu.innerHTML = "";

    const engines = getEngines();
    for (const engine of engines) {
      const btn = document.createElement("button");
      btn.textContent = engine.emoji;
      btn.title = engine.name;
      Object.assign(btn.style, {
        padding: "10px", borderRadius: "50%", border: "none",
        backgroundColor: "#666", color: "white", cursor: "pointer",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
      });
      btn.onclick = () => {
        const q = prompt(`${engine.name} 검색어 입력:`);
        if (q) window.open(engine.url + encodeURIComponent(q), "_blank");
      };
      menu.appendChild(btn);
    }

    const addBtn = document.createElement("button");
    addBtn.textContent = "➕";
    addBtn.title = "검색엔진 추가";
    Object.assign(addBtn.style, {
      padding: "10px", borderRadius: "50%", border: "none",
      backgroundColor: "#00b894", color: "white", cursor: "pointer",
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
    });
    addBtn.onclick = openModal;
    menu.appendChild(addBtn);
  };

  const openModal = () => {
    if (document.getElementById("custom-engine-modal")) return;

    const overlay = document.createElement("div");
    overlay.id = "custom-engine-modal";
    Object.assign(overlay.style, {
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)", zIndex: 10000,
      display: "flex", justifyContent: "center", alignItems: "center"
    });

    const modal = document.createElement("div");
    Object.assign(modal.style, {
      background: isDark ? "#222" : "white",
      color: isDark ? "#eee" : "#000",
      padding: "20px", borderRadius: "10px",
      width: "300px", boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      display: "flex", flexDirection: "column", gap: "10px"
    });

    const title = document.createElement("h3");
    title.textContent = "검색엔진 추가";
    title.style.margin = "0 0 5px 0";

    const nameInput = document.createElement("input");
    nameInput.placeholder = "이름 (예: Naver)";
    const emojiInput = document.createElement("input");
    emojiInput.placeholder = "이모지 (예: 🟢)";

    [nameInput, emojiInput].forEach(i => {
      Object.assign(i.style, {
        padding: "8px", borderRadius: "5px",
        border: isDark ? "1px solid #555" : "1px solid #ccc",
        backgroundColor: isDark ? "#333" : "white",
        color: isDark ? "#eee" : "#000"
      });
    });

    // URL 입력 + 툴팁
    const urlContainer = document.createElement("div");
    urlContainer.style.display = "flex";
    urlContainer.style.alignItems = "center";
    urlContainer.style.gap = "5px";

    const urlInput = document.createElement("input");
    urlInput.placeholder = "검색 URL 접두어";
    Object.assign(urlInput.style, {
      flex: "1", padding: "8px", borderRadius: "5px",
      border: isDark ? "1px solid #555" : "1px solid #ccc",
      backgroundColor: isDark ? "#333" : "white",
      color: isDark ? "#eee" : "#000"
    });

    const helpIcon = document.createElement("span");
    helpIcon.textContent = "❓";
    helpIcon.title = "";
    helpIcon.onclick = openTutorialModal;
    Object.assign(helpIcon.style, {
      cursor: "help", fontSize: "16px", color: isDark ? "#ccc" : "#333"
    });

    urlContainer.appendChild(urlInput);
    urlContainer.appendChild(helpIcon);

    const btnRow = document.createElement("div");
    Object.assign(btnRow.style, {
      display: "flex", justifyContent: "space-between", marginTop: "10px"
    });

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "취소";
    Object.assign(cancelBtn.style, {
      flex: "1", backgroundColor: isDark ? "#444" : "#eee",
      color: isDark ? "#eee" : "#000", border: "none",
      padding: "8px", borderRadius: "5px", cursor: "pointer"
    });
    cancelBtn.onclick = () => overlay.remove();

    const addBtn = document.createElement("button");
    addBtn.textContent = "추가";
    Object.assign(addBtn.style, {
      flex: "1", marginLeft: "10px",
      backgroundColor: "#00b894", color: "white",
      border: "none", padding: "8px", borderRadius: "5px", cursor: "pointer"
    });
    addBtn.onclick = () => {
      const name = nameInput.value.trim();
      const emoji = emojiInput.value.trim();
      const url = urlInput.value.trim();
      if (!name || !emoji || !url) return alert("모든 항목을 입력하세요");
      const engines = getEngines();
      engines.push({ name, emoji, url });
      localStorage.setItem("search_engines", JSON.stringify(engines));
      renderMenu();
      overlay.remove();
    };

    btnRow.appendChild(cancelBtn);
    btnRow.appendChild(addBtn);

    modal.append(title, nameInput, emojiInput, urlContainer, btnRow);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  };

  renderMenu();
  launcher.onclick = () => {
    menu.style.display = menu.style.display === "none" ? "flex" : "none";
  };

  document.body.appendChild(menu);
  document.body.appendChild(launcher);

  function openTutorialModal() {
  if (document.getElementById("tutorial-modal")) return;

  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const overlay = document.createElement("div");
  overlay.id = "tutorial-modal";
  Object.assign(overlay.style, {
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)", zIndex: 10001,
    display: "flex", justifyContent: "center", alignItems: "center"
  });

  const modal = document.createElement("div");
  Object.assign(modal.style, {
    background: isDark ? "#222" : "white",
    color: isDark ? "#eee" : "#000",
    padding: "20px", borderRadius: "10px", width: "700px",
    maxHeight: "90vh", overflowY: "auto",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    position: "relative",
    display: "flex", flexDirection: "column"
  });

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "✕";
  Object.assign(closeBtn.style, {
    position: "absolute", top: "10px", right: "10px",
    background: "transparent", border: "none",
    color: isDark ? "#eee" : "#333", fontSize: "18px",
    cursor: "pointer"
  });
  closeBtn.onclick = () => overlay.remove();

  const title = document.createElement("h3");
  title.textContent = "검색 URL 튜토리얼";
  title.style.marginTop = "0";

  const body = document.createElement("div");

  const info = document.createElement("p");
  info.textContent = "아래 슬라이드를 넘겨 검색 URL 입력법을 확인하세요:";
  Object.assign(info.style, {
    fontSize: "14px", marginBottom: "10px"
  });

  // 튜토리얼 가이드 이미지 슬라이드
  const guideImages = [1, 2, 3, 4, 5];
  let currentSlide = 0;

  const slideContainer = document.createElement("div");
  slideContainer.style.position = "relative";
  slideContainer.style.width = "100%";

  const img = document.createElement("img");
  img.style.width = "100%";
  img.style.borderRadius = "8px";
  img.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
  slideContainer.appendChild(img);

  const navLeft = document.createElement("button");
  navLeft.textContent = "〈";
  Object.assign(navLeft.style, {
    position: "absolute", top: "50%", left: "0",
    transform: "translateY(-50%)",
    background: "rgba(0,0,0,0.5)", color: "#fff", border: "none",
    fontSize: "18px", padding: "5px 10px", cursor: "pointer"
  });
  slideContainer.appendChild(navLeft);

  const navRight = document.createElement("button");
  navRight.textContent = "〉";
  Object.assign(navRight.style, {
    position: "absolute", top: "50%", right: "0",
    transform: "translateY(-50%)",
    background: "rgba(0,0,0,0.5)", color: "#fff", border: "none",
    fontSize: "18px", padding: "5px 10px", cursor: "pointer"
  });
  slideContainer.appendChild(navRight);

  const indexText = document.createElement("div");
  indexText.style.textAlign = "center";
  indexText.style.marginTop = "10px";
  indexText.style.fontSize = "14px";
  indexText.style.color = isDark ? "#ccc" : "#333";

  const updateSlide = () => {
    img.src = chrome.runtime.getURL(`tutorial/guide-img-${guideImages[currentSlide]}.png`);
    img.alt = `가이드 이미지 ${currentSlide + 1}`;
    indexText.textContent = `${currentSlide + 1} / ${guideImages.length}`;
  };

  navLeft.onclick = () => {
    currentSlide = (currentSlide - 1 + guideImages.length) % guideImages.length;
    updateSlide();
  };
  navRight.onclick = () => {
    currentSlide = (currentSlide + 1) % guideImages.length;
    updateSlide();
  };

  updateSlide();

  // body에 구성요소 삽입
  body.appendChild(info);
  body.appendChild(slideContainer);
  body.appendChild(indexText);

  modal.append(closeBtn, title, body);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}


}
