class TBoGTExperience {
    constructor() {
        this.audioEnabled = false;
        this.clubMusic = document.getElementById('clubMusic');
        this.uiSounds = document.getElementById('uiSounds');
        
        this.gameStats = {
            vip: { current: 0, target: 156, progress: 85 },
            party: { current: 0, target: 100, progress: 92 },
            money: { current: 0, target: 2500000, progress: 78 }
        };
        
        this.clubs = {
            maisonette: { name: 'Maisonette 9', status: 'VIP Only', capacity: 200 },
            hercules: { name: 'Hercules', status: 'Members Only', capacity: 150 },
            bahama: { name: 'Bahama Mamas', status: 'Open', capacity: 300 }
        };
        
        this.init();
    }
    
    init() {
        this.setupAudio();
        this.setupInteractions();
        this.setupTrailerModal();
        this.startStatsAnimation();
        this.initClubAmbiance();
        
        setTimeout(() => {
            this.setupCharacterCards();
            this.setupClubCards();
            this.setupActivityCards();
            this.startNotificationSystem();
        }, 500);
    }
    
    // Audio System
    setupAudio() {
        document.body.addEventListener('click', () => this.enableAudio(), { once: true });
        document.body.addEventListener('keydown', () => this.enableAudio(), { once: true });
        
        const musicToggle = document.getElementById('musicToggle');
        const volumeSlider = document.getElementById('volumeSlider');
        
        if (musicToggle) {
            musicToggle.addEventListener('click', () => this.toggleMusic());
        }
        
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        }
    }
    
    enableAudio() {
        if (this.audioEnabled) return;
        
        try {
            if (this.clubMusic) {
                this.clubMusic.volume = 0.4;
                this.clubMusic.play().catch(() => console.log('Audio autoplay prevented'));
            }
            this.audioEnabled = true;
            this.showNotification('🎵 Club music activated!', 'success');
        } catch (error) {
            console.warn('Audio setup failed:', error);
        }
    }
    
    toggleMusic() {
        if (!this.clubMusic) return;
        
        if (this.clubMusic.paused) {
            this.clubMusic.play().catch(() => console.log('Audio playback prevented'));
            this.showNotification('🎵 Music ON', 'info');
        } else {
            this.clubMusic.pause();
            this.showNotification('🔇 Music OFF', 'info');
        }
    }
    
    setVolume(value) {
        if (this.clubMusic) this.clubMusic.volume = parseFloat(value) * 0.4;
        if (this.uiSounds) this.uiSounds.volume = parseFloat(value);
        
        const volumeLabel = document.querySelector('.volume-label');
        if (volumeLabel) {
            volumeLabel.textContent = Math.round(value * 100) + '%';
        }
    }
    
    // Trailer Modal System
    setupTrailerModal() {
        const playTrailerBtn = document.getElementById('playTrailer');
        const exploreClubsBtn = document.getElementById('exploreClubs');
        const trailerModal = document.getElementById('trailerModal');
        const closeTrailerBtn = document.getElementById('closeTrailer');
        const trailerVideo = document.getElementById('trailerVideo');
        
        if (playTrailerBtn) {
            playTrailerBtn.addEventListener('click', () => {
                this.openTrailerModal();
            });
        }
        
        if (exploreClubsBtn) {
            exploreClubsBtn.addEventListener('click', () => {
                this.scrollToSection('.club-section');
            });
        }
        
        if (closeTrailerBtn) {
            closeTrailerBtn.addEventListener('click', () => {
                this.closeTrailerModal();
            });
        }
        
        if (trailerModal) {
            trailerModal.addEventListener('click', (e) => {
                if (e.target === trailerModal) {
                    this.closeTrailerModal();
                }
            });
        }
        
        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && trailerModal && trailerModal.style.display !== 'none') {
                this.closeTrailerModal();
            }
        });
    }
    
    openTrailerModal() {
        const trailerModal = document.getElementById('trailerModal');
        const trailerVideo = document.getElementById('trailerVideo');
        
        if (trailerModal && trailerVideo) {
            // Official Ballad of Gay Tony trailer
            trailerVideo.src = 'https://www.youtube.com/embed/fcDY7SCLWcc?si=6UPSAtCY0TODfEhJ';
            trailerModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            this.showNotification('🎬 Now playing: Official Trailer', 'success');
            this.playUISound('modal-open');
        }
    }
    
    closeTrailerModal() {
        const trailerModal = document.getElementById('trailerModal');
        const trailerVideo = document.getElementById('trailerVideo');
        
        if (trailerModal && trailerVideo) {
            trailerVideo.src = '';
            trailerModal.style.display = 'none';
            document.body.style.overflow = '';
            
            this.playUISound('modal-close');
        }
    }
    
    scrollToSection(selector) {
        const section = document.querySelector(selector);
        if (section) {
            section.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
            this.showNotification('🎯 Exploring Liberty City clubs!', 'info');
        }
    }
    
    // Stats Animation
    startStatsAnimation() {
        Object.entries(this.gameStats).forEach(([key, data], index) => {
            setTimeout(() => {
                this.animateCounter(`${key}Count`, data.target);
                this.animateProgressBar(`${key}Progress`, data.progress);
            }, index * 400);
        });
    }
    
    animateCounter(elementId, target) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        let current = 0;
        const increment = target / 80;
        const duration = 2500;
        const frameTime = duration / 80;
        
        const animate = () => {
            current += increment;
            if (current >= target) {
                current = target;
                if (elementId === 'moneyCount') {
                    element.textContent = '$' + current.toLocaleString();
                } else {
                    element.textContent = Math.floor(current);
                }
                return;
            }
            
            if (elementId === 'moneyCount') {
                element.textContent = '$' + Math.floor(current).toLocaleString();
            } else {
                element.textContent = Math.floor(current);
            }
            setTimeout(animate, frameTime);
        };
        
        animate();
    }
    
    animateProgressBar(elementId, percentage) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        setTimeout(() => {
            element.style.width = `${percentage}%`;
        }, 300);
    }
    
    // Interactive Elements
    setupInteractions() {
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            switch(e.key.toLowerCase()) {
                case 'm':
                    this.toggleMusic();
                    break;
                case 'd':
                    this.startDanceGame();
                    break;
                case 'v':
                    this.startVIPManagement();
                    break;
                case 's':
                    this.startSecurityGame();
                    break;
                case 't':
                    this.openTrailerModal();
                    break;
            }
        });
        
        // Button interactions
        const buttons = document.querySelectorAll('.neon-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.playUISound('button-click');
                this.addButtonEffect(btn);
            });
        });
    }
    
    setupCharacterCards() {
        const characterCards = document.querySelectorAll('.character-card');
        
        characterCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.playUISound('hover');
            });
            
            card.addEventListener('click', () => {
                const character = card.getAttribute('data-character');
                this.showCharacterInfo(character);
            });
            
            // Character action buttons
            const actionBtns = card.querySelectorAll('[data-action]');
            actionBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const action = btn.getAttribute('data-action');
                    this.handleCharacterAction(action);
                });
            });
        });
    }
    
    setupClubCards() {
        const clubCards = document.querySelectorAll('.club-card');
        
        clubCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.enhanceClubAmbiance(card);
                this.playUISound('hover');
            });
            
            card.addEventListener('mouseleave', () => {
                this.normalizeClubAmbiance(card);
            });
            
            card.addEventListener('click', () => {
                const club = card.getAttribute('data-club');
                this.enterClub(club);
            });
        });
    }
    
    setupActivityCards() {
        const activityCards = document.querySelectorAll('.activity-card');
        
        activityCards.forEach(card => {
            const gameBtn = card.querySelector('[data-game]');
            if (gameBtn) {
                gameBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const game = gameBtn.getAttribute('data-game');
                    this.startMiniGame(game);
                });
            }
        });
    }
    
    // Club Ambiance Effects
    initClubAmbiance() {
        const discoSpheres = document.querySelectorAll('.disco-ball');
        discoSpheres.forEach(sphere => {
            sphere.style.animationDuration = (Math.random() * 2 + 3) + 's';
        });
        
        const lightBeams = document.querySelectorAll('.light-beam');
        lightBeams.forEach((beam, index) => {
            beam.style.animationDelay = (index * 0.5) + 's';
        });
    }
    
    enhanceClubAmbiance(card) {
        const ambiance = card.querySelector('.club-ambiance');
        if (ambiance) {
            ambiance.style.filter = 'brightness(1.5) saturate(1.3)';
            ambiance.style.transform = 'scale(1.05)';
        }
        
        const lightBeams = card.querySelectorAll('.light-beam');
        lightBeams.forEach(beam => {
            beam.style.animationDuration = '0.5s';
        });
    }
    
    normalizeClubAmbiance(card) {
        const ambiance = card.querySelector('.club-ambiance');
        if (ambiance) {
            ambiance.style.filter = '';
            ambiance.style.transform = '';
        }
        
        const lightBeams = card.querySelectorAll('.light-beam');
        lightBeams.forEach(beam => {
            beam.style.animationDuration = '2s';
        });
    }
    
    // Game Actions
    showCharacterInfo(character) {
        const characterData = {
            luis: {
                name: 'Luis Lopez',
                description: 'Professional bodyguard and club manager for Gay Tony. Expert in security operations and VIP services.',
                specialties: ['Club Management', 'Security', 'VIP Protection']
            },
            tony: {
                name: 'Gay Tony',
                description: 'Liberty City\'s premier nightclub mogul. Owner of the hottest venues in town.',
                specialties: ['Business Management', 'Celebrity Relations', 'Nightlife Innovation']
            }
        };
        
        const data = characterData[character];
        if (data) {
            this.showNotification(`${data.name}: ${data.description}`, 'character');
        }
    }
    
    handleCharacterAction(action) {
        switch(action) {
            case 'manage-club':
                this.showNotification('🏢 Club management mode activated!', 'success');
                this.startClubManagement();
                break;
            case 'vip-services':
                this.showNotification('⭐ VIP services panel opened!', 'success');
                this.startVIPManagement();
                break;
        }
    }
    
    enterClub(clubName) {
        const club = this.clubs[clubName];
        if (club) {
            this.showNotification(`🚪 Welcome to ${club.name}! Status: ${club.status}`, 'club');
            this.playUISound('club-enter');
            
            // Simulate club entry animation
            setTimeout(() => {
                this.showNotification(`🎉 You're now inside ${club.name}!`, 'success');
            }, 1500);
        }
    }
    
    startMiniGame(game) {
        switch(game) {
            case 'dance':
                this.startDanceGame();
                break;
            case 'vip':
                this.startVIPManagement();
                break;
            case 'security':
                this.startSecurityGame();
                break;
        }
    }
    
    startDanceGame() {
        this.showNotification('💃 Dance floor is yours! Press arrow keys to the beat!', 'game');
        this.playUISound('dance-start');
        
        let score = 0;
        let moves = 0;
        const maxMoves = 8;
        
        const danceSequence = () => {
            if (moves >= maxMoves) {
                this.showNotification(`🕺 Dance complete! Score: ${score}/${maxMoves}`, 'success');
                return;
            }
            
            const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
            const targetKey = keys[Math.floor(Math.random() * keys.length)];
            const direction = targetKey.replace('Arrow', '').toLowerCase();
            
            this.showNotification(`💫 Press ${direction} arrow!`, 'dance');
            
            const keyHandler = (e) => {
                if (e.key === targetKey) {
                    score++;
                    this.showNotification(`✨ Perfect move! (${score}/${maxMoves})`, 'success');
                } else if (keys.includes(e.key)) {
                    this.showNotification(`❌ Wrong move! (${score}/${maxMoves})`, 'error');
                }
                
                moves++;
                document.removeEventListener('keydown', keyHandler);
                setTimeout(danceSequence, 800);
            };
            
            document.addEventListener('keydown', keyHandler);
            
            setTimeout(() => {
                document.removeEventListener('keydown', keyHandler);
                if (moves < maxMoves) {
                    this.showNotification(`⏰ Too slow! (${score}/${maxMoves})`, 'error');
                    moves++;
                    setTimeout(danceSequence, 500);
                }
            }, 2000);
        };
        
        setTimeout(danceSequence, 1000);
    }
    
    startVIPManagement() {
        this.showNotification('⭐ VIP Management: Handle celebrity requests!', 'game');
        
        const celebrities = ['Movie Star', 'Pop Singer', 'Fashion Model', 'TV Host', 'Social Media Influencer'];
        const requests = ['Champagne Service', 'Private Booth', 'Security Detail', 'Photo Opportunity', 'Meet & Greet'];
        
        let requestsHandled = 0;
        const totalRequests = 5;
        
        const handleVIPRequest = () => {
            if (requestsHandled >= totalRequests) {
                this.showNotification(`🌟 All VIP requests handled successfully!`, 'success');
                return;
            }
            
            const celebrity = celebrities[Math.floor(Math.random() * celebrities.length)];
            const request = requests[Math.floor(Math.random() * requests.length)];
            
            this.showNotification(`${celebrity} requests: ${request}`, 'vip');
            
            setTimeout(() => {
                requestsHandled++;
                this.showNotification(`✅ Request fulfilled! (${requestsHandled}/${totalRequests})`, 'success');
                
                if (requestsHandled < totalRequests) {
                    setTimeout(handleVIPRequest, 1500);
                } else {
                    setTimeout(() => {
                        this.showNotification(`🎉 VIP Management completed! Bonus earned!`, 'success');
                    }, 1000);
                }
            }, 2000);
        };
        
        setTimeout(handleVIPRequest, 1000);
    }
    
    startSecurityGame() {
        this.showNotification('🛡️ Security Mode: Keep troublemakers out!', 'game');
        
        const incidents = ['Underage Guest', 'Drunk Patron', 'Celebrity Stalker', 'Drug Dealer', 'Gate Crasher'];
        let incidentsHandled = 0;
        const totalIncidents = 4;
        
        const handleSecurityIncident = () => {
            if (incidentsHandled >= totalIncidents) {
                this.showNotification(`🚨 All security incidents resolved!`, 'success');
                return;
            }
            
            const incident = incidents[Math.floor(Math.random() * incidents.length)];
            this.showNotification(`🚨 Security Alert: ${incident} detected!`, 'security');
            
            setTimeout(() => {
                incidentsHandled++;
                this.showNotification(`✅ Incident handled! (${incidentsHandled}/${totalIncidents})`, 'success');
                
                if (incidentsHandled < totalIncidents) {
                    setTimeout(handleSecurityIncident, 2000);
                } else {
                    setTimeout(() => {
                        this.showNotification(`🏆 Security shift completed perfectly!`, 'success');
                    }, 1000);
                }
            }, 1500);
        };
        
        setTimeout(handleSecurityIncident, 1000);
    }
    
    startClubManagement() {
        this.showNotification('🏢 Club Management Dashboard activated!', 'success');
        
        // Simulate real-time club updates
        setInterval(() => {
            if (Math.random() > 0.7) {
                const updates = [
                    '💰 Revenue increased by $5,000',
                    '⭐ VIP guest arrived',
                    '🎵 DJ changed track - crowd loves it!',
                    '🍾 Champagne service requested',
                    '📸 Celebrity spotted on dance floor'
                ];
                
                const update = updates[Math.floor(Math.random() * updates.length)];
                this.showNotification(update, 'club-update');
            }
        }, 8000);
    }
    
    // Notification System
    startNotificationSystem() {
        // Welcome message
        setTimeout(() => {
            this.showNotification('🌟 Welcome to Liberty City\'s hottest nightlife scene!', 'welcome');
        }, 2000);
        
        // Periodic tips
        setInterval(() => {
            const tips = [
                '💡 Tip: Press M to toggle music',
                '💡 Tip: Press T to watch trailer',
                '💡 Tip: Press D to start dancing',
                '💡 Tip: Click characters for interactions',
                '💡 Tip: Hover over clubs for ambiance effects'
            ];
            
            if (Math.random() > 0.6) {
                const tip = tips[Math.floor(Math.random() * tips.length)];
                this.showNotification(tip, 'tip');
            }
        }, 15000);
    }
    
    showNotification(message, type = 'info') {
        const notificationArea = document.getElementById('notificationArea');
        if (!notificationArea) return;
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-text">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Type-specific styling
        const typeColors = {
            success: 'var(--neon-green)',
            error: 'var(--neon-pink)',
            info: 'var(--neon-cyan)',
            game: 'var(--neon-purple)',
            club: 'var(--neon-pink)',
            character: 'var(--neon-cyan)',
            welcome: 'var(--neon-green)',
            tip: 'var(--neon-purple)'
        };
        
        notification.style.borderColor = typeColors[type] || typeColors.info;
        notification.style.boxShadow = `0 0 15px ${typeColors[type] || typeColors.info}`;
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });
        
        notificationArea.appendChild(notification);
        
        // Auto-remove after delay
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(300px)';
                setTimeout(() => notification.remove(), 300);
            }
        }, type === 'tip' ? 8000 : 4000);
    }
    
    // UI Effects
    addButtonEffect(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }
    
    playUISound(soundType) {
        // Sound effect simulation
        console.log(`Playing sound: ${soundType}`);
        
        if (this.audioEnabled && this.uiSounds) {
            // In a real implementation, you would load different sound files
            // this.uiSounds.src = `assets/sounds/${soundType}.mp3`;
            // this.uiSounds.play().catch(() => {});
        }
    }
}

// Initialize the TBoGT experience
document.addEventListener('DOMContentLoaded', () => {
    new TBoGTExperience();
});

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
