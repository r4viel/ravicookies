
        const products = [
            { id: 1, name: "Cookie de Chocolate", price: 5.00, image: "cookie4.jpg" },
            { id: 2, name: "Cookie de baunilha", price: 5.00, image: "cookie3.jpeg" },
            { id: 3, name: "6 Mini Cookies de baunilha", price: 8.00, image: "mini-cookie.png" },
            { id: 4, name: "6 Mini Cookies de chocolate", price: 8.00, image: "mini-chocolate.png" },
            { id: 5, name: "Brookie", price: 7.00, image: "brookies.jpeg"}
        ];

        const cartModal = document.getElementById('cart-modal');
        const favoritesModal = document.getElementById('favorites-modal');
        
        const mainContent = document.getElementById('produtos');
        const cartItemsContainer = document.getElementById('cart-items');
        const favoritesItemsContainer = document.getElementById('favorites-items');
        const cartTotalDisplay = document.getElementById('cart-total');
        
        let cart = [];
        let favorites = [];

        function renderProducts() {
            mainContent.innerHTML = '';
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.setAttribute('data-product-id', product.id);
                
                const isFavorited = favorites.some(fav => fav.id === product.id);
                const favoriteClass = isFavorited ? 'favorited' : '';
                
                productCard.innerHTML = `
                    <img class="favorite-icon ${favoriteClass}" src="favorito.png" alt="Favoritar" onclick="toggleFavorite(${product.id})">
                    <img class="product-image" src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>R$ ${product.price.toFixed(2)}</p>
                    <button onclick="addToCart(${product.id})">Adicionar ao Carrinho</button>
                `;
                mainContent.appendChild(productCard);
            });
        }

        function openCartModal() {
            renderCart();
            cartModal.style.display = 'flex';
        }

        function openFavoritesModal() {
            renderFavorites();
            favoritesModal.style.display = 'flex';
        }

        function closeModals() {
            const modals = document.querySelectorAll('.modal-overlay');
            modals.forEach(modal => modal.style.display = 'none');
        }

        window.onclick = function(event) {
            if (event.target.classList.contains('modal-overlay')) {
                closeModals();
            }
        }

        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            if (!product) return;
            
            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            alert(`${product.name} adicionado ao carrinho!`);
            renderCart();
        }

        function removeFromCart(index) {
            cart.splice(index, 1);
            renderCart();
        }

        function toggleFavorite(productId) {
            const product = products.find(p => p.id === productId);
            if (!product) return;
            
            const isFavorited = favorites.some(fav => fav.id === productId);

            if (isFavorited) {
                favorites = favorites.filter(fav => fav.id !== productId);
            } else {
                favorites.push(product);
            }

            const heartIcon = document.querySelector(`.product-card[data-product-id="${productId}"] .favorite-icon`);
            if (heartIcon) {
                heartIcon.classList.toggle('favorited', !isFavorited);
            }
        }

        function renderCart() {
            cartItemsContainer.innerHTML = '';
            let total = 0;

            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p style="text-align: center;">Seu carrinho está vazio.</p>';
            } else {
                cart.forEach((item, index) => {
                    const itemTotal = item.price * item.quantity;
                    total += itemTotal;
                    const cartItemDiv = document.createElement('div');
                    cartItemDiv.className = 'cart-item';
                    cartItemDiv.innerHTML = `
                        <div class="cart-item-info">
                            <p><strong>Produto:</strong> ${item.name}</p>
                            <p><strong>Quantidade:</strong> ${item.quantity}</p>
                            <p><strong>Valor total:</strong> R$ ${itemTotal.toFixed(2)}</p>
                        </div>
                        <div class="cart-item-actions">
                            <button class="remove-button" onclick="removeFromCart(${index})">Remover</button>
                        </div>
                    `;
                    cartItemsContainer.appendChild(cartItemDiv);
                });
            }

            cartTotalDisplay.textContent = `Total: R$ ${total.toFixed(2)}`;
        }

        function renderFavorites() {
            favoritesItemsContainer.innerHTML = '';
            if (favorites.length === 0) {
                favoritesItemsContainer.innerHTML = '<p style="text-align: center;">Nenhum item favorito.</p>';
            } else {
                favorites.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.className = 'product-card';
                    productCard.innerHTML = `
                        <img class="product-image" src="${product.image}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p>R$ ${product.price.toFixed(2)}</p>
                        <button onclick="addToCart(${product.id})">Adicionar ao Carrinho</button>
                    `;
                    favoritesItemsContainer.appendChild(productCard);
                });
            }
        }

        function sendOrderToWhatsApp() {
            if (cart.length === 0) {
                alert("Seu carrinho está vazio. Adicione produtos antes de finalizar a compra.");
                return;
            }

            let message = "Olá, gostaria de fazer um pedido!\n\n";
            let total = 0;

            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                message += `*Produto:* ${item.name}\n`;
                message += `*Quantidade:* ${item.quantity}\n`;
                message += `*Valor total:* R$ ${itemTotal.toFixed(2)}\n\n`;
            });

            message += `*Valor total do pedido:* R$ ${total.toFixed(2)}`;

            const phoneNumber = "5584994632332";
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

            window.open(whatsappUrl, '_blank');
        }

        document.addEventListener('DOMContentLoaded', renderProducts);