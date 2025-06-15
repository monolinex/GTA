// GTA IV Enhanced Experience - Performance Optimized with Flip Cards and Trailer Modal
class GTA4Experience {
    constructor() {
        this.audioEnabled = false;
        this.bgMusic = document.getElementById('bgMusic');
        this.effectsPlayer = document.getElementById('effectsPlayer');
        
        this.gameStats = {
            missions: { current: 0, target: 89, progress: 75 },
            friends: { current: 0, target: 12, progress: 85 },
            weapons: { current: 0, target: 24, progress: 60 }
        };
        
        this.districtData = {
            algonquin: {
                name: 'ALGONQUIN',
                description: 'The beating heart of Liberty City, home to towering skyscrapers, bustling financial districts, and the dreams of millions.',
                features: ['Financial District', 'Central Park', 'Museums', 'Shopping Centers']
            },
            broker: {
                name: 'BROKER',
                description: 'Where Niko\'s American dream begins. This working-class borough is full of opportunity and danger.',
                features: ['Residential Areas', 'Industrial Zones', 'Docks', 'Roman\'s Taxi Depot']
            },
            dukes: {
                name: 'DUKES',
                description: 'A mix of suburban tranquility and urban grit, offering glimpses into both sides of Liberty City.',
                features: ['Suburbs', 'Airport', 'Shopping Malls', 'Residential Complexes']
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupAudio();
        this.setupInteractions();
        this.setupTrailerModal();
        this.animateStats();
        this.animateTimeline();
        
        // Fallback fix for counter animation
        setTimeout(() => {
            document.getElementById('missionCount').textContent = '89';
            document.getElementById('friendCount').textContent = '12';
            document.getElementById('weaponCount').textContent = '24';
            
            document.getElementById('missionProgress').style.width = '75%';
            document.getElementById('friendProgress').style.width = '85%';
            document.getElementById('weaponProgress').style.width = '60%';
        }, 1000);
        
        // Delayed initialization for better performance
        setTimeout(() => {
            this.setupFlipCards();
            this.setupMapInteraction();
            this.setupMissionTimeline();
        }, 500);
    }
    
    // ===== AUDIO SYSTEM =====
    setupAudio() {
        // Enable audio on first user interaction
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
            if (this.bgMusic) {
                this.bgMusic.volume = 0.3;
                this.bgMusic.play().catch(() => console.log('Audio autoplay prevented'));
            }
            this.audioEnabled = true;
        } catch (error) {
            console.warn('Audio setup failed:', error);
        }
    }
    
    toggleMusic() {
        if (!this.bgMusic) return;
        
        if (this.bgMusic.paused) {
            this.bgMusic.play().catch(() => console.log('Audio playback prevented'));
        } else {
            this.bgMusic.pause();
        }
    }
    
    setVolume(value) {
        if (this.bgMusic) this.bgMusic.volume = parseFloat(value) * 0.3;
        if (this.effectsPlayer) this.effectsPlayer.volume = parseFloat(value);
    }
    
    // ===== STATS ANIMATION =====
    animateStats() {
        Object.entries(this.gameStats).forEach(([key, data], index) => {
            setTimeout(() => {
                this.animateCounter(`${key}Count`, data.target);
                this.animateProgressBar(`${key}Progress`, data.progress);
            }, index * 300);
        });
    }
    
    animateCounter(elementId, target) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        let current = 0;
        const increment = target / 60; // 60 frames for smooth animation
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
        }, 200);
    }
    
    animateTimeline() {
        const timelineProgress = document.getElementById('timelineProgress');
        if (timelineProgress) {
            setTimeout(() => {
                timelineProgress.style.width = '40%';
            }, 1000);
        }
    }
    
    // ===== TRAILER MODAL SYSTEM =====
    setupTrailerModal() {
        const playTrailerBtn = document.getElementById('playTrailer');
        const exploreClubsBtn = document.getElementById('exploreCity');
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
                this.scrollToSection('.map-section');
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
            // Official GTA IV trailer
            trailerVideo.src = 'https://www.youtube.com/embed/M80K51DosFo?si=caevAjwWCgir8EiX&enablejsapi=1';
            trailerModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
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
        }
    }
    
    // ===== FLIP CARD SYSTEM =====
    setupFlipCards() {
        // Character flip cards
        const characterCards = document.querySelectorAll('.character-card-flip');
        characterCards.forEach(card => {
            card.addEventListener('click', () => {
                this.playUISound('card-flip');
                this.toggleFlipCard(card);
            });
            
            card.addEventListener('mouseenter', () => {
                this.playUISound('hover');
            });
        });
        
        // Weapon flip cards
        const weaponCards = document.querySelectorAll('.weapon-card-flip');
        weaponCards.forEach(card => {
            card.addEventListener('click', () => {
                this.playUISound('card-flip');
                this.toggleFlipCard(card);
            });
            
            card.addEventListener('mouseenter', () => {
                this.playUISound('hover');
            });
        });
        
        // District flip card
        const districtCard = document.querySelector('.district-info-flip');
        if (districtCard) {
            // District card will be flipped via map interactions
        }
    }
    
    toggleFlipCard(card) {
        const isFlipped = card.classList.contains('flipped');
        
        // Close all other flip cards
        document.querySelectorAll('.character-card-flip.flipped, .weapon-card-flip.flipped').forEach(otherCard => {
            if (otherCard !== card) {
                otherCard.classList.remove('flipped');
            }
        });
        
        // Toggle current card
        if (isFlipped) {
            card.classList.remove('flipped');
        } else {
            card.classList.add('flipped');
        }
    }
    
    // ===== INTERACTIVE ELEMENTS =====
    setupInteractions() {
        // Button interactions
        const playTrailer = document.getElementById('playTrailer');
        const exploreCity = document.getElementById('exploreCity');
        
        if (playTrailer) {
            playTrailer.addEventListener('click', () => this.handleTrailerClick());
        }
        
        if (exploreCity) {
            exploreCity.addEventListener('click', () => this.handleExploreCityClick());
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'm' || e.key === 'M') {
                this.toggleMusic();
            }
            if (e.key === 'Escape') {
                // Close all flip cards on Escape
                this.closeAllFlipCards();
            }
        });
    }
    
    closeAllFlipCards() {
        document.querySelectorAll('.character-card-flip.flipped, .weapon-card-flip.flipped, .district-info-flip.flipped').forEach(card => {
            card.classList.remove('flipped');
        });
    }
    
    setupMapInteraction() {
        const districtHotspots = document.querySelectorAll('.district-hotspot');
        const districtCard = document.querySelector('.district-info-flip');
        const districtName = document.getElementById('districtName');
        const districtDesc = document.getElementById('districtDesc');
        const districtFeatures = document.getElementById('districtFeatures');
        
        districtHotspots.forEach(hotspot => {
            hotspot.addEventListener('click', () => {
                const district = hotspot.getAttribute('data-district');
                this.showDistrictInfo(district, districtName, districtDesc, districtFeatures);
                
                if (districtCard) {
                    districtCard.classList.add('flipped');
                }
                
                this.playUISound('map-select');
            });
            
            hotspot.addEventListener('mouseenter', () => {
                this.playUISound('hover');
            });
        });
    }
    
    setupMissionTimeline() {
        const missionPoints = document.querySelectorAll('.mission-point-enhanced');
        
        missionPoints.forEach(point => {
            point.addEventListener('click', () => {
                const mission = point.getAttribute('data-mission');
                this.showMissionDetails(mission);
                this.playUISound('mission-select');
            });
            
            point.addEventListener('mouseenter', () => {
                this.playUISound('hover');
            });
        });
    }
    
    // ===== CONTENT HANDLERS =====
    showDistrictInfo(district, nameElement, descElement, featuresElement) {
        const info = this.districtData[district];
        if (!info) return;
        
        if (nameElement) nameElement.textContent = info.name;
        if (descElement) descElement.textContent = info.description;
        if (featuresElement) {
            featuresElement.innerHTML = info.features.map(feature => 
                `<span class="feature-tag">${feature}</span>`
            ).join('');
        }
    }
    
    showMissionDetails(mission) {
        const missionInfo = {
            arrival: {
                title: 'The Boat',
                description: 'Niko arrives in Liberty City aboard a cargo ship, leaving his troubled past behind in search of a new beginning.'
            },
            roman: {
                title: 'Cousin\'s Bellic',
                description: 'Reunite with cousin Roman and discover the harsh reality behind his promises of American success.'
            },
            empire: {
                title: 'Building Empire',
                description: 'Establish your reputation in Liberty City\'s criminal underworld through increasingly dangerous missions.'
            },
            finale: {
                title: 'One Last Thing',
                description: 'Face the ultimate choice between revenge and redemption in the climactic showdown.'
            }
        };
        
        const info = missionInfo[mission];
        if (info) {
            console.log(`Mission: ${info.title} - ${info.description}`);
        }
    }
    
    // ===== BUTTON HANDLERS =====
    handleTrailerClick() {
        this.playUISound('button-click');
        this.openTrailerModal();
    }
    
    handleExploreCityClick() {
        this.playUISound('button-click');
        const mapSection = document.querySelector('.map-section');
        if (mapSection) {
            mapSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    // ===== SOUND EFFECTS =====
    playUISound(soundType) {
        // Simple sound effect simulation through console
        console.log(`Playing sound: ${soundType}`);
        
        // Optional: Play a short beep sound if audio is enabled
        if (this.audioEnabled && this.effectsPlayer) {
            // You can add actual sound files here
            // this.effectsPlayer.src = `assets/sounds/ui/${soundType}.mp3`;
            // this.effectsPlayer.play().catch(() => {});
        }
    }
}

// Initialize the GTA IV experience when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new GTA4Experience();
});

// Smooth scrolling for internal links
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

// Handle window resize for responsive elements
window.addEventListener('resize', () => {
    // Trigger any responsive adjustments if needed
    console.log('Window resized - adjusting responsive elements');
});

// Close flip cards when clicking outside
document.addEventListener('click', (e) => {
    const isFlipCard = e.target.closest('.character-card-flip, .weapon-card-flip, .district-info-flip');
    const isHotspot = e.target.closest('.district-hotspot');
    
    if (!isFlipCard && !isHotspot) {
        document.querySelectorAll('.character-card-flip.flipped, .weapon-card-flip.flipped').forEach(card => {
            card.classList.remove('flipped');
        });
    }
});
