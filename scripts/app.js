document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ========================================
    // AUDIO MANAGEMENT SYSTEM
    // ========================================

    // Audio Elements
    const bgMusic = document.getElementById('bgMusic');
    const navSound = document.getElementById('navSound');

    // Audio state management
    let audioContext = null;
    let audioEnabled = false;
    let musicPlaying = false;
    let currentVolume = 0.5;

    // Music Controls
    const musicToggle = document.getElementById('musicToggle');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeLabel = document.querySelector('.volume-label');
    const musicIcon = document.querySelector('.music-icon');
    const mutedIcon = document.querySelector('.muted-icon');

    // ========================================
    // CARD NAVIGATION
    // ========================================
    
    const gtaivCard = document.querySelector('[data-game="gtaiv"]');
    
    if (gtaivCard) {
        gtaivCard.addEventListener('click', function() {
            // Add transition effect
            document.body.style.opacity = '0';
            
            setTimeout(() => {
                window.location.href = 'gta4.html';
            }, 300);
        });
        
        // Add keyboard support
        gtaivCard.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                gtaivCard.click();
            }
        });
    }

    const tladCard = document.querySelector('[data-game="tlad"]');
    
    if (tladCard) {
        tladCard.addEventListener('click', function() {
            // Add transition effect
            document.body.style.opacity = '0';
            
            setTimeout(() => {
                window.location.href = 'ld.html';
            }, 300);
        });
        
        // Add keyboard support
        tladCard.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                tladCard.click();
            }
        });
    }

    const tbogtCard = document.querySelector('[data-game="tbogt"]');
    
    if (tbogtCard) {
        tbogtCard.addEventListener('click', function() {
            // Add transition effect
            document.body.style.opacity = '0';
            
            setTimeout(() => {
                window.location.href = 'gt.html';
            }, 300);
        });
        
        // Add keyboard support
        tbogtCard.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                tbogtCard.click();
            }
        });
    }


    // ========================================
    // LOADING SCREEN MANAGEMENT
    // ========================================

    const loadingScreen = document.getElementById('loadingScreen');

    // Simulate loading process
    function initializeLoadingScreen() {
        const loadingProgress = document.querySelector('.loading-progress');
        if (!loadingProgress) return;
        
        let progress = 0;

        const loadingInterval = setInterval(() => {
            progress += Math.random() * 15 + 5;

            if (progress >= 100) {
                progress = 100;
                loadingProgress.style.width = '100%';

                setTimeout(() => {
                    if (loadingScreen) {
                        loadingScreen.classList.add('hidden');
                        setTimeout(() => {
                            loadingScreen.style.display = 'none';
                        }, 500);
                    }
                }, 500);

                clearInterval(loadingInterval);
            } else {
                loadingProgress.style.width = progress + '%';
            }
        }, 150);
    }

    // ========================================
    // AUDIO INITIALIZATION
    // ========================================

    function initializeAudio() {
        try {
            if (bgMusic) {
                bgMusic.volume = currentVolume;
                bgMusic.loop = true;
                bgMusic.muted = true;

                bgMusic.play().catch(error => {
                    console.log('Audio autoplay prevented:', error);
                });
            }

            if (navSound) {
                navSound.volume = 0.7;
            }
        } catch (error) {
            console.error('Audio initialization error:', error);
        }
    }

    // ========================================
    // USER INTERACTION DETECTION
    // ========================================

    function enableAudioOnFirstInteraction() {
        if (!audioEnabled && bgMusic) {
            try {
                if (!audioContext) {
                    audioContext = new (window.AudioContext || window.webkitAudioContext)();
                }

                if (audioContext.state === 'suspended') {
                    audioContext.resume();
                }

                bgMusic.muted = false;
                audioEnabled = true;

                console.log('Audio enabled after user interaction');
            } catch (error) {
                console.error('Audio context error:', error);
            }
        }
    }

    // Add event listeners for first user interaction
    const enableAudioEvents = ['click', 'touchstart', 'keydown'];
    enableAudioEvents.forEach(event => {
        document.addEventListener(event, enableAudioOnFirstInteraction, { once: true });
    });

    // ========================================
    // MUSIC CONTROLS
    // ========================================

    function toggleMusic() {
        if (!bgMusic) return;

        try {
            if (bgMusic.paused) {
                bgMusic.play().then(() => {
                    musicPlaying = true;
                    updateMusicIcon(true);
                }).catch(error => {
                    console.error('Error playing music:', error);
                });
            } else {
                bgMusic.pause();
                musicPlaying = false;
                updateMusicIcon(false);
            }
        } catch (error) {
            console.error('Music toggle error:', error);
        }
    }

    function updateMusicIcon(playing) {
        if (musicIcon && mutedIcon) {
            if (playing) {
                musicIcon.style.display = 'inline';
                mutedIcon.style.display = 'none';
            } else {
                musicIcon.style.display = 'none';
                mutedIcon.style.display = 'inline';
            }
        }

        if (musicToggle) {
            musicToggle.title = playing ? 'Pause Music' : 'Play Music';
        }
    }

    function updateVolume(value) {
        currentVolume = parseFloat(value);

        if (bgMusic) {
            bgMusic.volume = currentVolume;
        }

        if (volumeLabel) {
            volumeLabel.textContent = Math.round(currentVolume * 100) + '%';
        }

        localStorage.setItem('gtaVolume', currentVolume);
    }

    // ========================================
    // EVENT LISTENERS SETUP
    // ========================================

    function setupEventListeners() {
        if (musicToggle) {
            musicToggle.addEventListener('click', toggleMusic);

            musicToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleMusic();
                }
            });
        }

        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                updateVolume(e.target.value);
            });

            const savedVolume = localStorage.getItem('gtaVolume');
            if (savedVolume) {
                volumeSlider.value = savedVolume;
                updateVolume(savedVolume);
            }
        }

        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'm' && !e.ctrlKey && !e.altKey) {
                e.preventDefault();
                toggleMusic();
            }

            if (e.key === ' ' && e.target === document.body) {
                e.preventDefault();
                toggleMusic();
            }
        });

        document.addEventListener('visibilitychange', () => {
            if (bgMusic && audioEnabled) {
                if (document.hidden) {
                    if (!bgMusic.paused) {
                        bgMusic.pause();
                        sessionStorage.setItem('musicWasPlaying', 'true');
                    }
                } else {
                    if (sessionStorage.getItem('musicWasPlaying') === 'true') {
                        bgMusic.play().catch(error => {
                            console.log('Could not resume music:', error);
                        });
                        sessionStorage.removeItem('musicWasPlaying');
                    }
                }
            }
        });
    }

    // ========================================
    // GAME CARD INTERACTIONS
    // ========================================

    function setupGameCards() {
        const gameCards = document.querySelectorAll('.game-card');

        gameCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                handleCardClick(card, index);
            });

            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(card, index);
                }
            });

            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
                card.style.zIndex = '10';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.zIndex = '';
            });
        });
    }

    function handleCardClick(card, index) {
        if (navSound && audioEnabled) {
            try {
                navSound.currentTime = 0;
                navSound.play().catch(error => {
                    console.log('Navigation sound error:', error);
                });
            } catch (error) {
                console.error('Navigation sound playback error:', error);
            }
        }

        card.style.transform = 'scale(0.95)';

        setTimeout(() => {
            card.style.transform = '';
        }, 150);

        const gameType = card.dataset.game;
        const gameTitle = card.querySelector('h2').textContent;

        console.log(`Clicked on: ${gameTitle} (${gameType})`);
        showGameSelection(gameTitle);
    }

    function showGameSelection(gameTitle) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: #ff9500;
            padding: 1.5rem 2rem;
            border-radius: 10px;
            border: 2px solid #ff9500;
            font-size: 1.2rem;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 0 20px rgba(255, 149, 0, 0.5);
            transition: opacity 0.3s ease;
        `;
        notification.textContent = `Selected: ${gameTitle}`;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }

    // ========================================
    // ERROR HANDLING
    // ========================================

    function setupErrorHandling() {
        if (bgMusic) {
            bgMusic.addEventListener('error', (e) => {
                console.error('Background music error:', e);
                updateMusicIcon(false);
            });
        }

        if (navSound) {
            navSound.addEventListener('error', (e) => {
                console.error('Navigation sound error:', e);
            });
        }

        window.addEventListener('error', (e) => {
            console.error('Global error:', e);
        });
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    function initialize() {
        console.log('Initializing GTA IV Series Website...');

        initializeLoadingScreen();
        initializeAudio();
        setupEventListeners();
        setupGameCards();
        setupErrorHandling();

        updateMusicIcon(false);

        console.log('Website initialization complete!');
    }

    // Start initialization
    initialize();

}); // This closing brace was missing!
