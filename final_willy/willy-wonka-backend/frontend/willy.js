// ===========================================
// 🍭 GLOBAL SETTINGS & AUTH
// ===========================================
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const protectedPages = ["/willy.html", "/factory.html"]; 
    const currentPage = window.location.pathname;

    if (!token && protectedPages.some(path => currentPage.includes(path))) {
        window.location.href = "index.html"; 
    }

    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('wonkaTheme') || 'dark';
    
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        if (themeToggle) themeToggle.checked = true;
    }

    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            const isLight = document.body.classList.toggle('light-mode');
            localStorage.setItem('wonkaTheme', isLight ? 'light' : 'dark');
        });
    }
});

// =========================
// 🍬 WONKA EFFECTS (Global)
// =========================
function setMood(type) {
    const body = document.body;
    body.classList.remove('mood-chocolate', 'mood-magic', 'mood-chaos');
    body.classList.add('mood-' + type);

    if (type === 'chaos') spawnCandy();
    showNotification(
        type === 'chaos' ? "💥 Oompa-Loompas are running wild!" :
        type === 'magic' ? "✨ Pure Imagination mode activated..." : 
        "🍫 Chocolate river activated!"
    );
}

function spawnCandy() {
    const emojis = ['🍬', '🍭', '🍫', '🍩', '🍪'];
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const candy = document.createElement('div');
            candy.innerText = emojis[Math.floor(Math.random() * emojis.length)];
            candy.style.cssText = `position: fixed; top: -50px; left: ${Math.random() * 100}vw; font-size: 30px; z-index: 10000; pointer-events: none; transition: transform 3s linear, opacity 2s;`;
            document.body.appendChild(candy);
            setTimeout(() => {
                candy.style.transform = 'translateY(110vh) rotate(360deg)';
                candy.style.opacity = '0';
            }, 100);
            setTimeout(() => candy.remove(), 3500);
        }, i * 150);
    }
}

function showNotification(msg) {
    const toast = document.createElement('div');
    toast.className = "notification";
    toast.style.cssText = "position:fixed; bottom:20px; right:20px; background:#ffcc00; padding:12px 25px; border-radius:10px; z-index:10001; color:#000; font-weight:bold; box-shadow: 0 4px 15px rgba(0,0,0,0.3);";
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// ===========================================
// 🛠 JQUERY MAIN BLOCK (API + Interactions)
// ===========================================
$(document).ready(function () {
    const API_BASE = "http://localhost:5000/api";

    // --- 1. Скролл и Прогресс ---
    if ($("#scrollBar").length === 0) $("body").prepend('<div id="scrollBar" style="position:fixed; top:0; left:0; height:5px; background:gold; z-index:9999; width:0%;"></div>');
    
    $(window).on("scroll", function () {
        const scrolled = ($(window).scrollTop() / ($(document).height() - $(window).height())) * 100;
        $("#scrollBar").css("width", scrolled + "%");
        
        $("img[data-src]").each(function () {
            if ($(window).scrollTop() + $(window).height() > $(this).offset().top) {
                $(this).attr("src", $(this).attr("data-src")).removeAttr("data-src");
            }
        });
    });

    // --- 2. Поиск ---
    $("#wonkaSearch, #shopSearch").on("keyup", function () {
        const value = $(this).val().toLowerCase();
        $(".gallery figure, .product, .shop-item").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

    // --- 3. Форма Контактов (MongoDB) ---
    $("#contactForm").on("submit", async function (e) {
        e.preventDefault();
        const btn = $(this).find("button[type='submit']");
        const formData = {
            name: $("#name").val(),
            email: $("#email").val(),
            message: $("#message").val()
        };

        btn.prop("disabled", true).text("Sending...");
        try {
            const res = await fetch(`${API_BASE}/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (!res.ok) throw new Error("Server error");
            showNotification("🎉 Message sent to the Factory!");
            this.reset();
        } catch (err) {
            showNotification("❌ Error: " + err.message);
        } finally {
            btn.prop("disabled", false).text("Send Golden Ticket");
        }
    });

    // --- 4. Регистрация Билета (Многошаговая + MongoDB) ---
    let currentStep = 0;
    const steps = $(".form-step");

    $("#registerForm").on("click", ".next", function() {
        const inputs = steps.eq(currentStep).find("input, select");
        if (inputs[0].checkValidity()) {
            currentStep++;
            steps.removeClass("active").eq(currentStep).addClass("active");
        } else {
            inputs[0].reportValidity();
        }
    });

    $("#registerForm").on("click", ".back", function() {
        currentStep--;
        steps.removeClass("active").eq(currentStep).addClass("active");
    });

    $("#registerForm").on("submit", async function (e) {
        e.preventDefault();
        const $submit = $(this).find("button[type='submit']");
        
        const payload = {
            fullName: $("#fullName").val(),
            passport: $("#passport").val(),
            email: $("#email").val(),
            testDate: $("#test_date").val(),
            city: $("#city").val()
        };

        $submit.prop("disabled", true).html("Processing...");

        try {
            const res = await fetch(`${API_BASE}/tickets`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Database error");

            showNotification("✅ Registration successful!");
            $("#successMsg").fadeIn().removeClass("hidden");
            this.reset();
            currentStep = 0;
            steps.removeClass("active").eq(0).addClass("active");
        } catch (err) {
            showNotification("❌ " + err.message);
        } finally {
            $submit.prop("disabled", false).html("Register");
        }
    });

    // --- 5. Подписка (MongoDB) ---
    $("#popupForm").on("submit", async function (e) {
        e.preventDefault();
        const email = $("#popupEmail").val();

        try {
            const res = await fetch(`${API_BASE}/subscribe`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
            if (!res.ok) throw new Error("Failed");

            showNotification("📧 Subscribed successfully!");
            $("#popup").fadeOut();
            this.reset();
        } catch (err) {
            showNotification("❌ Subscription error");
        }
    });

    // --- 6. Доп. фичи (Counter, Copy, FAQ) ---
    $(".counter").each(function () {
        const target = +$(this).attr("data-target");
        $({ count: 0 }).animate({ count: target }, {
            duration: 2500,
            step: function () { $(".counter").text(Math.floor(this.count)); },
            complete: function () { $(".counter").text(target + "+"); }
        });
    });

    $(document).on("click", ".copyBtn", function () {
        navigator.clipboard.writeText($(this).prev(".price").text());
        $(this).text("✔ Copied!");
        setTimeout(() => $(this).text("📋 Copy"), 1500);
    });

    $("#faqSearch").on("keyup", function () {
        const term = $(this).val();
        $(".answer, .question").each(function () {
            let text = $(this).text();
            if (term) {
                const regex = new RegExp(`(${term})`, "gi");
                $(this).html(text.replace(regex, '<span class="highlight" style="background:gold;color:black;">$1</span>'));
            } else { $(this).html(text); }
        });
    });
});

// ===========================================
// 🎨 VANILLA JS (Popups, Stars, Quotes, Audio)
// ===========================================

// Рейтинг
document.querySelectorAll('.star').forEach((star, index, arr) => {
    star.addEventListener('click', () => {
        arr.forEach((s, i) => s.classList.toggle('active', i <= index));
        document.querySelector('#ratingMessage').textContent = `Rated ${index + 1}/5 — scrumdiddlyumptious! 🍫`;
    });
});

// Цитаты
const wonkaQuotes = ["A little nonsense now and then...", "So shines a good deed...", "We are the music makers...", "Time is a precious thing."];
document.querySelector('#quoteBtn')?.addEventListener('click', () => {
    const area = document.querySelector('#quoteArea');
    area.style.opacity = 0;
    setTimeout(() => {
        area.textContent = `"${wonkaQuotes[Math.floor(Math.random() * wonkaQuotes.length)]}"`;
        area.style.opacity = 1;
    }, 200);
});

// Конфетти и звук
document.getElementById('confettiBtn')?.addEventListener('click', () => {
    const sound = document.getElementById('confettiSound');
    if (sound) { sound.currentTime = 0; sound.play(); }
    
    for (let i = 0; i < 80; i++) {
        const c = document.createElement('div');
        c.className = 'confetti';
        c.style.cssText = `position:fixed; left:${Math.random()*100}%; top:-10px; background:hsl(${Math.random()*360},100%,50%); width:10px; height:10px; z-index:9999; animation: fall ${Math.random()*2 + 1}s linear forwards;`;
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 2000);
    }
});

// Аккордеон
document.querySelectorAll('.question').forEach(q => {
    q.addEventListener('click', () => {
        const ans = q.nextElementSibling;
        ans.style.display = (ans.style.display === "block") ? "none" : "block";
    });
});

// Попап
const popupEl = document.getElementById('popup');
if (popupEl) {
    document.getElementById('openPopup')?.addEventListener('click', () => popupEl.style.display = 'flex');
    document.querySelector('.close-btn')?.addEventListener('click', () => popupEl.style.display = 'none');
    window.addEventListener('click', (e) => { if(e.target === popupEl) popupEl.style.display = 'none'; });
}