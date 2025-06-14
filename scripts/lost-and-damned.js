class LostAndDamnedExperience {
    constructor() {
        this.audioEnabled = false;
        this.bikeSound = document.getElementById('bikeSound');
        this.gangSound = document.getElementById('gangSound');
        this.uiSound = document.getElementById('uiSound');
        
        this.gangStats = {
            members: { current: 0, target: 28, progress: 75 },
            territory: { current: 0, target: 100, progress: 65 },
            respect: { current: 0, target: 100, progress: 82 }
        };
        
        this.init();
    }
    
    init() {
        this.setupAudio();
        this.setupInteractions();
        this.setupTrailerModal();
        this.startStatsAnimation();
        this.startNotificationSystem();
        this.animateTimeline();
    }
    
    // Audio System
    setupAudio() {
        document.body.addEventListener('click', () => this.enableAudio(), { once: true });
        document.body.addEventListener('keydown', () => this.enableAudio(), { once: true });
        
        const audioToggle = document.getElementById('audioToggle');
        const volumeSlider = document.getElementById('volumeSlider');
        
        if (audioToggle) {
            audioToggle.addEventListener('click', () => this.toggleAudio());
        }
        
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        }
    }
    
    enableAudio() {
        if (this.audioEnabled) return;
        
        try {
            if (this.bikeSound) {
                this.bikeSound.volume = 0.4;
                this.bikeSound.play().catch(() => console.log('Audio autoplay prevented'));
            }
            this.audioEnabled = true;
            this.showNotification('🔊 Sound ON - Ride or Die!', 'success');
        } catch (error) {
            console.warn('Audio setup failed:', error);
        }
    }
    
    toggleAudio() {
        if (!this.bikeSound) return;
        
        if (this.bikeSound.paused) {
            this.bikeSound.play().catch(() => console.log('Audio playback prevented'));
            this.showNotification('🔊 Sound ON', 'info');
        } else {
            this.bikeSound.pause();
            this.showNotification('🔇 Sound OFF', 'info');
        }
    }
    
    setVolume(value) {
        if (this.bikeSound) this.bikeSound.volume = parseFloat(value) * 0.4;
        if (this.gangSound) this.gangSound.volume = parseFloat(value);
        if (this.uiSound) this.uiSound.volume = parseFloat(value);
    }
    
    // Trailer Modal System
    setupTrailerModal() {
        const playTrailerBtn = document.getElementById('playTrailer');
        const trailerModal = document.getElementById('trailerModal');
        const closeTrailerBtn = document.getElementById('closeTrailer');

        if (playTrailerBtn) {
            playTrailerBtn.addEventListener('click', () => {
                trailerModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                this.playUISound('modal-open');
            });
        }

        if (closeTrailerBtn) {
            closeTrailerBtn.addEventListener('click', () => {
                trailerModal.style.display = 'none';
                document.body.style.overflow = 'auto';
                this.playUISound('modal-close');
            });
        }

        window.addEventListener('click', (e) => {
            if (e.target === trailerModal) {
                trailerModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
        
        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && trailerModal.style.display === 'flex') {
                trailerModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Mission Timeline Animation
    animateTimeline() {
        const timelineProgress = document.getElementById('timelineProgress');
        let width = 0;
        const targetWidth = 40; // Percentage
        
        const animate = () => {
            if (width >= targetWidth) return;
            width += 0.5;
            timelineProgress.style.width = width + '%';
            requestAnimationFrame(animate);
        }
        
        setTimeout(() => {
            requestAnimationFrame(animate);
        }, 1000);
    }
    
    // Stats Animation
    startStatsAnimation() {
        Object.entries(this.gangStats).forEach(([key, data], index) => {
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
        const increment = target / 60;
        const duration = 2000;
        const frameTime = duration / 60;
        
        const animate = () => {
            current += increment;
            if (current >= target) {
                current = target;
                element.textContent = Math.floor(current);
                return;
            }
            
            element.textContent = Math.floor(current);
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
                case 'a':
                    this.toggleAudio();
                    break;
                case 'r':
                    this.startRideout();
                    break;
                case 'h':
                    this.startHeist();
                    break;
                case 'f':
                    this.startFight();
                    break;
                case 't':
                    document.getElementById('playTrailer').click();
                    break;
            }
        });
        
        // Button effects
        const buttons = document.querySelectorAll('.biker-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.playUISound('button-click');
                this.addButtonEffect(btn);
            });
        });
        
        // Member cards
        const memberCards = document.querySelectorAll('.member-card');
        memberCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.playUISound('hover');
            });
            
            card.addEventListener('click', () => {
                const member = card.getAttribute('data-member');
                this.showMemberInfo(member);
            });
            
            // Member action buttons
            const actionBtns = card.querySelectorAll('[data-action]');
            actionBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const action = btn.getAttribute('data-action');
                    this.handleMemberAction(action);
                });
            });
        });
        
        // Bike cards
        const bikeCards = document.querySelectorAll('.bike-card');
        bikeCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.playBikeSound();
            });
            
            card.addEventListener('click', () => {
                const bike = card.getAttribute('data-bike');
                this.rideBike(bike);
            });
        });
        
        // Activity cards
        const activityCards = document.querySelectorAll('.activity-card');
        activityCards.forEach(card => {
            const gameBtn = card.querySelector('[data-game]');
            if (gameBtn) {
                gameBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const game = gameBtn.getAttribute('data-game');
                    this.startActivity(game);
                });
            }
        });
        
        // Mission points
        const missionPoints = document.querySelectorAll('.mission-point');
        missionPoints.forEach(point => {
            point.addEventListener('mouseenter', () => {
                this.playUISound('hover');
            });
            
            point.addEventListener('click', () => {
                const mission = point.getAttribute('data-mission');
                this.showMissionInfo(mission);
            });
        });
    }
    
    // Mission Timeline Interactions
    showMissionInfo(mission) {
        const missionData = {
            homecoming: {
                title: "Billy's Return",
                description: "Welcome the club president back from rehab. He's ready to take back control of The Lost MC."
            },
            "truce-break": {
                title: "Truce Broken",
                description: "The Angels of Death have broken the truce. It's time to retaliate."
            },
            "heroin-deal": {
                title: "Heroin Nightmare",
                description: "A dangerous deal with the Triads goes wrong when Billy steals their heroin."
            },
            "prison-break": {
                title: "Prison Inferno",
                description: "Billy has been arrested. The Lost must break him out before he talks."
            },
            "final-showdown": {
                title: "Last Ride",
                description: "A final confrontation that will determine the future of The Lost MC."
            }
        };
        
        const data = missionData[mission];
        if (data) {
            this.showNotification(`📍 ${data.title}: ${data.description}`, 'mission');
        }
    }
    
    // Member Info
    showMemberInfo(member) {
        const memberData = {
            johnny: {
                name: 'Johnny Klebitz',
                description: 'President of The Lost MC. Leads the gang with honor and strength.'
            },
            billy: {
                name: 'Billy Grey',
                description: 'Vice President. Known for his temper and loyalty to the club.'
            },
            jim: {
                name: 'Jim Fitzgerald',
                description: 'Sergeant-at-Arms. Keeps the gang safe and organized.'
            },
            terry: {
                name: 'Terry Thorpe',
                description: 'Treasurer. Handles the gangs finances and negotiations.'}
        };
        
        const data = memberData[member];
        if (data) {
            this.showNotification(`${data.name}: ${data.description}`, 'member');
        }
    }
    
    handleMemberAction(action) {
        switch(action) {
            case 'call-meeting':
                this.showNotification('📢 Gang meeting called! All Lost members gather.', 'meeting');
                this.playGangSound();
                break;
            case 'plan-heist':
                this.showNotification('💀 Heist planning initiated. Secure your weapons!', 'heist');
                break;
            case 'scout-territory':
                this.showNotification('🔭 Scouting territory for rival gangs. Stay alert!', 'scout');
                break;
            case 'collect-dues':
                this.showNotification('💰 Collecting dues from members. Cash flow secured.', 'dues');
                break;
        }
    }
    
    // Bike Actions
    rideBike(bike) {
        const bikeNames = {
            chopper: 'Chopper',
            racing: 'Racing Bike',
            custom: 'Custom Bike'
        };
        this.showNotification(`🏍️ You're riding the ${bikeNames[bike]}!`, 'bike');
        this.playBikeSound();
    }
    
    playBikeSound() {
        if (this.audioEnabled && this.bikeSound) {
            this.bikeSound.currentTime = 0;
            this.bikeSound.play().catch(() => {});
        }
    }
    
    playGangSound() {
        if (this.audioEnabled && this.gangSound) {
            this.gangSound.currentTime = 0;
            this.gangSound.play().catch(() => {});
        }
    }
    
    playUISound(soundType) {
        // Sound effect simulation
        console.log(`Playing sound: ${soundType}`);
        if (this.audioEnabled && this.uiSound) {
            // this.uiSound.src = `assets/sounds/${soundType}.mp3`;
            // this.uiSound.play().catch(() => {});
        }
    }
    
    // Activities
    startActivity(game) {
        switch(game) {
            case 'rideout':
                this.startRideout();
                break;
            case 'heist':
                this.startHeist();
                break;
            case 'fight':
                this.startFight();
                break;
        }
    }
    
    startRideout() {
        this.showNotification('🏍️ Rideout started! Lead the gang through Liberty City.', 'rideout');
        this.playBikeSound();
        
        let checkpoints = 0;
        const totalCheckpoints = 5;
        
        const rideSequence = () => {
            if (checkpoints >= totalCheckpoints) {
                this.showNotification('🏁 Rideout complete! Gang reputation increased.', 'success');
                return;
            }
            
            this.showNotification(`📍 Checkpoint ${checkpoints + 1}/${totalCheckpoints} reached!`, 'checkpoint');
            checkpoints++;
            
            setTimeout(rideSequence, 2000);
        };
        
        rideSequence();
    }
    
    startHeist() {
        this.showNotification('💀 Heist preparation: Gather your crew and weapons!', 'heist');
        this.playGangSound();
        
        let steps = 0;
        const totalSteps = 4;
        
        const heistSequence = () => {
            if (steps >= totalSteps) {
                this.showNotification('💰 Heist successful! Gang funds secured.', 'success');
                return;
            }
            
            const actions = [
                'Scout the target location',
                'Assign roles to crew members',
                'Execute the heist',
                'Make the getaway'
            ];
            
            this.showNotification(`⚡ ${actions[steps]} (Step ${steps + 1}/${totalSteps})`, 'heist');
            steps++;
            
            setTimeout(heistSequence, 2500);
        };
        
        heistSequence();
    }
    
    startFight() {
        this.showNotification('🤜 Gang war activated! Defend your turf from rivals.', 'fight');
        this.playGangSound();
        
        let rounds = 0;
        const totalRounds = 3;
        
        const fightSequence = () => {
            if (rounds >= totalRounds) {
                this.showNotification('🏆 Gang war won! Territory control increased.', 'success');
                return;
            }
            
            this.showNotification(`🥊 Round ${rounds + 1}/${totalRounds}: Fight for your brothers!`, 'fight');
            rounds++;
            
            setTimeout(fightSequence, 3000);
        };
        
        fightSequence();
    }
    
    // Notifications
    startNotificationSystem() {
        // Welcome message
        setTimeout(() => {
            this.showNotification('🏍️ Welcome to The Lost and Damned. Ride or Die!', 'welcome');
        }, 2000);
        
        // Periodic tips
        setInterval(() => {
            const tips = [
                '💡 Tip: Press A to toggle audio',
                '💡 Tip: Press R to start a rideout',
                '💡 Tip: Press T to watch the trailer',
                '💡 Tip: Click bikes to hear the engine roar',
                '💡 Tip: Click mission points for details',
                '💡 Tip: Click members for gang info'
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
            success: '#ffcc00',
            info: '#ff6600',
            error: '#cc0000',
            member: '#ff6600',
            meeting: '#cc0000',
            heist: '#ff6600',
            scout: '#ffcc00',
            dues: '#ffcc00',
            bike: '#ff6600',
            rideout: '#cc0000',
            checkpoint: '#ff6600',
            fight: '#cc0000',
            welcome: '#ffcc00',
            tip: '#ff6600',
            mission: '#cc0000'
        };
        
        notification.style.borderColor = typeColors[type] || typeColors.info;
        notification.style.boxShadow = `0 0 10px ${typeColors[type] || typeColors.info}`;
        
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
}

// Initialize the Lost and Damned experience
document.addEventListener('DOMContentLoaded', () => {
    new LostAndDamnedExperience();
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
