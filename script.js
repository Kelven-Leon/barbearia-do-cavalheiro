document.addEventListener('DOMContentLoaded', () => {
    const formAgendamento = document.getElementById('formAgendamento');
    const formStatus = document.getElementById('form-status');

    // --- Formulário de Agendamento ---
    formAgendamento.addEventListener('submit', async (event) => {
        event.preventDefault(); // Impede o envio padrão do formulário

        const formData = new FormData(formAgendamento);
        const data = Object.fromEntries(formData.entries());

        formStatus.classList.remove('success', 'error', 'hidden', 'visible');
        formStatus.textContent = 'Enviando agendamento...';
        formStatus.classList.add('visible'); // Mostra a mensagem de "Enviando"

        try {
            const response = await fetch(formAgendamento.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                formStatus.textContent = 'Seu agendamento foi enviado com sucesso! Entraremos em contato em breve para confirmar.';
                formStatus.className = 'success visible'; // Adiciona 'visible' para animação
                formAgendamento.reset(); // Limpa o formulário

            } else {
                let errorMessage = 'Ocorreu um erro ao enviar seu agendamento. Por favor, tente novamente.';
                try {
                    const errorData = await response.json();
                    if (errorData && errorData.error) {
                        errorMessage = errorData.error;
                    }
                } catch (jsonError) {
                    console.error("Erro ao parsear resposta de erro do Formspree:", jsonError);
                }
                formStatus.textContent = errorMessage;
                formStatus.className = 'error visible'; // Adiciona 'visible' para animação
            }
        } catch (error) {
            console.error('Erro de rede ou ao enviar o formulário:', error);
            formStatus.textContent = 'Não foi possível conectar. Verifique sua conexão ou tente novamente mais tarde.';
            formStatus.className = 'error visible'; // Adiciona 'visible' para animação
        }

        // Esconde a mensagem de status após 5 segundos
        setTimeout(() => {
            formStatus.classList.remove('visible');
            formStatus.classList.add('hidden'); // Esconde de fato após a transição
        }, 5000);
    });

    // --- Carousel de Depoimentos ---
    const carousel = document.querySelector('.depoimentos-carousel');
    const depoimentoItems = document.querySelectorAll('.depoimento-item');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    if (carousel && depoimentoItems.length > 0) {
        // Cria os pontos de navegação
        depoimentoItems.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                scrollToItem(index);
            });
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.dot');

        // Função para rolar para um item específico
        const scrollToItem = (index) => {
            // Verifica se o item existe antes de tentar acessar offsetWidth
            if (depoimentoItems[0]) {
                const itemWidth = depoimentoItems[0].offsetWidth + 20; // Largura do item + gap
                carousel.scrollTo({
                    left: itemWidth * index,
                    behavior: 'smooth'
                });
                updateDots(index);
            }
        };

        // Atualiza a classe 'active' dos pontos
        const updateDots = (activeIndex) => {
            dots.forEach((dot, index) => {
                if (index === activeIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        };

        // Monitora o scroll do carousel para atualizar os pontos
        carousel.addEventListener('scroll', () => {
            if (depoimentoItems[0]) { // Verifica se o item existe
                const scrollLeft = carousel.scrollLeft;
                const itemWidth = depoimentoItems[0].offsetWidth + 20; // Largura do item + gap
                // Evita divisão por zero
                if (itemWidth > 0) {
                    const newIndex = Math.round(scrollLeft / itemWidth);
                    if (newIndex !== currentIndex) {
                        currentIndex = newIndex;
                        updateDots(currentIndex);
                    }
                }
            }
        });

        // Autoplay do carousel (opcional)
        // setInterval(() => {
        //     currentIndex = (currentIndex + 1) % depoimentoItems.length;
        //     scrollToItem(currentIndex);
        // }, 5000); // Muda a cada 5 segundos
    }

    // --- Animação de Fade-in ao Rolar (Intersection Observer) ---
    const fadeInElements = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Parar de observar depois que o elemento é visível para otimização
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // Elemento visível em 10%
        rootMargin: '0px 0px -50px 0px' // Começa a animar um pouco antes de chegar no topo da tela
    });

    fadeInElements.forEach(element => {
        observer.observe(element);
    });

    // --- Menu Responsivo ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('nav-open');
        });

        // Fechar o menu ao clicar em um link (para mobile)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('nav-open')) {
                    navLinks.classList.remove('nav-open');
                }
            });
        });
    }

    // --- Smooth Scroll para links de navegação ---
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});