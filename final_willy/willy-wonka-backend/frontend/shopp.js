/* =====================================================
    ✅ WONKA SHOP LOGIC (shopp.js)
===================================================== */

// Функция уведомлений как в рабочем скрипте
function showNotification(msg) {
    const toast = document.createElement('div');
    toast.className = "notification"; // убедись, что в CSS есть стили для .notification
    toast.textContent = msg;
    document.body.appendChild(toast);
    
    // Стили на случай, если их нет в CSS
    toast.style.cssText = `
        position: fixed; bottom: 20px; right: 20px; 
        background: #4e342e; color: white; padding: 15px; 
        border-radius: 8px; z-index: 10000; box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    `;
    
    setTimeout(() => toast.remove(), 3000);
}

$(document).ready(function () {
    console.log("✅ shopp.js initialized");

    let cart = JSON.parse(localStorage.getItem("wonkaCart")) || [];

    function renderCart() {
        const cartItems = $("#cartItems");
        if (!cartItems.length) return;
        cartItems.empty();

        if (cart.length === 0) {
            cartItems.html("<p>Your cart is empty 🍭</p>");
            return;
        }

        cart.forEach((item, index) => {
            cartItems.append(`
                <div class="cart-item" style="display:flex; justify-content:space-between; margin-bottom:10px;">
                    <span>${item.name}</span>
                    <button class="remove" data-i="${index}" style="background:none; border:none; cursor:pointer;">❌</button>
                </div>
            `);
        });
    }

    // Добавление в корзину
    $(document).on("click", ".btn-primary", function (e) {
        // Если кнопка внутри формы покупки, предотвращаем переход
        if ($(this).closest("form").attr("id") !== "checkoutForm") {
            e.preventDefault();
            const card = $(this).closest(".card");
            const item = {
                name: card.find(".name").text().trim(),
                img: card.find("img").attr("src")
            };
            cart.push(item);
            localStorage.setItem("wonkaCart", JSON.stringify(cart));
            renderCart();
            showNotification(`🍫 ${item.name} added to cart!`);
        }
    });

    // Удаление
    $(document).on("click", ".remove", function () {
        cart.splice($(this).data("i"), 1);
        localStorage.setItem("wonkaCart", JSON.stringify(cart));
        renderCart();
    });

    $("#clearCart").on("click", function () {
        cart = [];
        localStorage.removeItem("wonkaCart");
        renderCart();
    });

    renderCart();

    /* =====================================================
        📤 ОТПРАВКА ЗАКАЗА (Аналог рабочего скрипта)
    ===================================================== */
    $("#checkoutForm").on("submit", async function (e) {
        e.preventDefault();
        console.log("🚀 Submit triggered");

        if (cart.length === 0) {
            showNotification("❌ Your cart is empty!");
            return;
        }

        // Собираем данные
        const orderData = {
            name: $("#name").val().trim(),
            email: $("#email").val().trim(),
            address: $("#address").val().trim(),
            product: cart.map(item => item.name).join(", "),
            quantity: cart.length
        };

        // Валидация
        if (!orderData.name || !orderData.email || !orderData.address) {
            showNotification("⚠️ Please fill in all fields!");
            return;
        }

        const btn = $(this).find("button[type='submit']");
        btn.prop("disabled", true).text("Processing...");

        try {
            const res = await fetch("http://localhost:5000/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Order failed");

            // Успех
            showNotification("✅ Order saved to MongoDB! 🍫");
            
            // Очистка
            cart = [];
            localStorage.removeItem("wonkaCart");
            renderCart();
            $("#checkoutForm")[0].reset();
            
            // Сброс шагов (если есть)
            $(".form-step").removeClass("active").eq(0).addClass("active");

        } catch (err) {
            console.error("Fetch error:", err);
            showNotification("❌ Error: " + err.message);
        } finally {
            btn.prop("disabled", false).text("Place Order");
        }
    });

    // Навигация по шагам
    $(".next-btn").on("click", function() {
        $(this).closest(".form-step").removeClass("active").next().addClass("active");
    });
    $(".back-btn").on("click", function() {
        $(this).closest(".form-step").removeClass("active").prev().addClass("active");
    });
});