/* ==========================================================================
   GAMEPLAY PORTFOLIO LOGIC & INTERACTIVITY
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. WEB AUDIO API SYNTHESIZER
    let soundEnabled = true;
    let audioCtx = null;

    function initAudioContext() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function playSound(type) {
        if (!soundEnabled) return;
        
        try {
            initAudioContext();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            const now = audioCtx.currentTime;

            if (type === 'click') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);
                gain.gain.setValueAtTime(0.04, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
                osc.start(now);
                osc.stop(now + 0.08);
            } 
            else if (type === 'beep') {
                osc.type = 'square';
                osc.frequency.setValueAtTime(1400, now);
                gain.gain.setValueAtTime(0.015, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
                osc.start(now);
                osc.stop(now + 0.03);
            } 
            else if (type === 'success') {
                osc.type = 'sine';
                // Play a cute little arpeggio
                osc.frequency.setValueAtTime(523.25, now); // C5
                osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
                osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
                osc.frequency.setValueAtTime(1046.50, now + 0.24); // C6
                gain.gain.setValueAtTime(0.06, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
                osc.start(now);
                osc.stop(now + 0.45);
            } 
            else if (type === 'error') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(180, now);
                osc.frequency.linearRampToValueAtTime(120, now + 0.22);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
                osc.start(now);
                osc.stop(now + 0.22);
            } 
            else if (type === 'boot') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(220, now);
                osc.frequency.exponentialRampToValueAtTime(900, now + 0.7);
                gain.gain.setValueAtTime(0.06, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
                osc.start(now);
                osc.stop(now + 0.7);
            }
        } catch (e) {
            console.warn("Audio Context init/playback failed:", e);
        }
    }

    // Toggle sound button handler
    const soundBtn = document.getElementById('sound-btn');
    const soundStatusLbl = document.getElementById('sound-status-lbl');
    
    if (soundBtn && soundStatusLbl) {
        soundBtn.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            if (soundEnabled) {
                soundStatusLbl.textContent = "SOUND: ON";
                playSound('click');
                soundBtn.classList.remove('sound-muted');
            } else {
                soundStatusLbl.textContent = "SOUND: OFF";
                soundBtn.classList.add('sound-muted');
            }
        });
    }

    // Generic click audio binding for links/buttons
    document.querySelectorAll('a, button, input, select, textarea').forEach(el => {
        el.addEventListener('click', (e) => {
            // Avoid double triggers on special components
            if (!el.classList.contains('shortcut-btn') && el.id !== 'sound-btn') {
                playSound('click');
            }
        });
    });


    // 2. HUD INITIALIZING BOOT SCREEN
    const bootScreen = document.getElementById('boot-screen');
    const bootPct = document.getElementById('boot-pct');
    const bootProgressBar = document.getElementById('boot-progress-bar');
    
    let bootProgress = 0;
    const bootDuration = 1200; // ms
    const bootStep = 100 / (bootDuration / 20); // updates every 20ms

    if (bootScreen) {
        // Trigger boot noise
        setTimeout(() => {
            playSound('boot');
        }, 150);

        const bootInterval = setInterval(() => {
            bootProgress += bootStep;
            if (bootProgress >= 100) {
                bootProgress = 100;
                clearInterval(bootInterval);
                setTimeout(() => {
                    bootScreen.classList.add('fade-out');
                    initializeTerminal();
                }, 200);
            }
            bootPct.textContent = Math.floor(bootProgress);
            bootProgressBar.style.width = `${bootProgress}%`;
        }, 20);
    }


    // 3. INTERACTIVE HUD CONSOLE/TERMINAL LOGIC
    const consoleOutput = document.getElementById('console-output');
    const consoleInput = document.getElementById('console-input');
    
    const terminalLogs = [
        "UNREAL PORTFOLIO CONSOLE v2.06.06",
        "COORDINATES DETECTED: CORE_SYSTEM.STABLE",
        "WELCOME, OPERATOR. AWAITING INPUT...",
        "TYPE 'help' FOR LIST OF SYSTEM COMMANDS.",
        "----------------------------------------"
    ];

    function writeTerminalLine(text, type = 'system') {
        if (!consoleOutput) return;
        const line = document.createElement('div');
        line.className = `console-log-line ${type}`;
        line.innerHTML = text;
        consoleOutput.appendChild(line);
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }

    function initializeTerminal() {
        terminalLogs.forEach((log, idx) => {
            setTimeout(() => {
                writeTerminalLine(log, 'system');
                playSound('beep');
            }, idx * 100);
        });
    }

    const commandResponses = {
        'help': `
            <span class="accent-text">AVAILABLE COMMANDS:</span><br>
            - <span class="accent-text">about</span>: Operator bio data.<br>
            - <span class="accent-text">skills</span>: Evaluated engineering matrix.<br>
            - <span class="accent-text">inventory</span>: Display project lists.<br>
            - <span class="accent-text">quest</span>: Show contact protocols.<br>
            - <span class="accent-text">theme [amber/cyan/violet]</span>: Shift HUD color profile.<br>
            - <span class="accent-text">clear</span>: Flush console history.
        `,
        'about': `
            <span class="accent-text">OPERATOR STATUS: ACTIVE</span><br>
            A Senior Gameplay Programmer building responsive traversal mechanics, combative frame-clamping hitboxes, and networking pathways.<br>
            <span class="accent-text">PRIMARY ENGINE:</span> Unreal Engine (C++ / Blueprints)<br>
            <span class="accent-text">SECONDARY:</span> Unity & CryEngine.
        `,
        'skills': `
            <span class="accent-text">CORE SYSTEMS READOUT:</span><br>
            - C++ / UE Blueprints: lvl 95 [Core Combat/GAS]<br>
            - Python: lvl 80 [Mocap tools, Pipeline Automation]<br>
            - Lua: lvl 75 [AI Trees, Script nodes]<br>
            - Motion Capture Cleanup: lvl 90 [Vicon/Optical cleanup]
        `,
        'inventory': `
            <span class="accent-text">INDEXED PROJECTS:</span><br>
            1. Chrono Blade [RPG] - Combat loops &GAS systems.<br>
            2. Shadow Protocol [FPS] - Recoil & projectile networks.<br>
            3. Nexus Clash [Fighter] - Hitbox parsing & rollback loops.<br>
            4. Echoes of Eldoria [Adventure] - Traversal controller.<br>
            5. Mocap Pipeline [Utility] - Batch retargeting scripts.
        `,
        'projects': `
            <span class="accent-text">INDEXED PROJECTS:</span><br>
            1. Chrono Blade [RPG] - Combat loops &GAS systems.<br>
            2. Shadow Protocol [FPS] - Recoil & projectile networks.<br>
            3. Nexus Clash [Fighter] - Hitbox parsing & rollback loops.<br>
            4. Echoes of Eldoria [Adventure] - Traversal controller.<br>
            5. Mocap Pipeline [Utility] - Batch retargeting scripts.
        `,
        'quest': `
            <span class="accent-text">SUBMIT QUEST INSTRUCTIONS:</span><br>
            Navigate to the POST QUEST sector below or email directly to reply coordinates. Awaiting specifications for contracts or full-time campaigns.
        `,
        'contact': `
            <span class="accent-text">SUBMIT QUEST INSTRUCTIONS:</span><br>
            Navigate to the POST QUEST sector below or email directly to reply coordinates. Awaiting specifications for contracts or full-time campaigns.
        `
    };

    function parseCommand(rawCmd) {
        const cleanCmd = rawCmd.trim().toLowerCase();
        
        // Audit empty commands
        if (!cleanCmd) return;

        writeTerminalLine(`guest@gamedev:~$ ${rawCmd}`, 'input');
        playSound('beep');

        // Check for parameterized commands: e.g. "theme cyan"
        const parts = cleanCmd.split(' ');
        const baseCmd = parts[0];
        const arg = parts[1];

        if (baseCmd === 'clear') {
            if (consoleOutput) consoleOutput.innerHTML = '';
            return;
        }

        if (baseCmd === 'theme') {
            if (arg === 'amber' || arg === 'cyan' || arg === 'violet') {
                document.body.className = `theme-${arg}`;
                
                // update active state in theme buttons
                document.querySelectorAll('.theme-dot').forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.getAttribute('data-theme') === arg) {
                        btn.classList.add('active');
                    }
                });

                writeTerminalLine(`>> HUD theme shifted successfully to: <span class="accent-text">${arg.toUpperCase()}</span>`, 'accent');
                playSound('success');
            } else {
                writeTerminalLine(`>> ERROR: Invalid theme argument. Use amber, cyan, or violet.`, 'error');
                playSound('error');
            }
            return;
        }

        if (commandResponses[cleanCmd]) {
            setTimeout(() => {
                writeTerminalLine(commandResponses[cleanCmd], 'system');
            }, 80);
        } else {
            setTimeout(() => {
                writeTerminalLine(`>> COMMAND NOT RECOGNIZED: '${rawCmd}'. Type 'help' to review directory.`, 'error');
                playSound('error');
            }, 80);
        }
    }

    if (consoleInput) {
        consoleInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = consoleInput.value;
                parseCommand(cmd);
                consoleInput.value = '';
            }
        });
    }

    // Setup CLI Quick Scan shortcuts
    document.querySelectorAll('.shortcut-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const cmd = btn.getAttribute('data-cmd');
            if (cmd) {
                parseCommand(cmd);
                playSound('click');
            }
        });
    });


    // 4. THEME SELECTION CLICK HANDLERS
    document.querySelectorAll('.theme-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            const theme = dot.getAttribute('data-theme');
            if (theme) {
                document.body.className = `theme-${theme}`;
                
                document.querySelectorAll('.theme-dot').forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
                
                writeTerminalLine(`>> HUD color profile changed to: <span class="accent-text">${theme.toUpperCase()}</span>`, 'accent');
                playSound('success');
            }
        });
    });


    // 5. SKILLS MATRIX ANALYZER HOVER/CLICK EVENTS
    const analyzerOutput = document.getElementById('analyzer-text-output');
    
    const skillDescriptions = {
        'C++': "<strong>SECTOR_0x1A // CORE_C++:</strong> Compiles character state machines, hitboxes, custom replication pathing, and vector movement engines. Maximizes computational performance.",
        'UE BLUEPRINT': "<strong>SECTOR_0x2B // VISUAL_BP:</strong> Interfaces engine parameters to designers, frames state-tree structures, handles animation notifies, and wires HUD/UI widgets.",
        'PYTHON': "<strong>SECTOR_0x3C // UTILITY_PY:</strong> Automates optical mocap gap patching, batch-exports clean skeletal animations, and handles asset management pipelines.",
        'LUA': "<strong>SECTOR_0x4D // LUA_SCRIPT:</strong> Configures mission nodes and designs AI action trees inside CryEngine logic loops.",
        'UNREAL ENGINE': "<strong>SECTOR_0x5E // ENGINE_UE:</strong> Deep control of UE4/UE5. Interfaces Gameplay Ability System (GAS), adjusts C++ macros, and optimizes network replication ticks.",
        'UNITY': "<strong>SECTOR_0x6F // ENGINE_UNITY:</strong> Handles rapid concept builds, writes C# entity scripts, builds custom inspector views, and tunes 2.5D game systems.",
        'CRYENGINE': "<strong>SECTOR_0x7A // ENGINE_CRY:</strong> Employs Flowgraph layouts, configures rigid entity setups, and modifies Lua character actions.",
        'MOTION CAPTURE & CLEANUP': "<strong>SECTOR_0x8B // MOCAP_OPS:</strong> Calibrates multi-camera optical networks, fixes missing marker trajectories, and targets bones onto skeletal rigs.",
        'TRAVERSAL & CHARACTER CONTROLLERS': "<strong>SECTOR_0x9C // PHYSI_MOVE:</strong> Architects movement profiles: grappling hooks, vault colliders, ledge detection algorithms, and gravity vectors.",
        'COMMUNITY MANAGEMENT & PLAYTESTS': "<strong>SECTOR_0xAA // PUBLIC_CO:</strong> Runs private playtests, compiles QA bug files, interfaces directly with user channels, and updates build details."
    };

    document.querySelectorAll('.skill-item').forEach(item => {
        const skillNameEl = item.querySelector('.skill-name');
        if (!skillNameEl) return;
        
        const skillName = skillNameEl.textContent.trim();

        // Hover events
        item.addEventListener('mouseenter', () => {
            if (analyzerOutput && skillDescriptions[skillName]) {
                analyzerOutput.innerHTML = skillDescriptions[skillName];
                playSound('beep');
            }
        });

        // Click events
        item.addEventListener('click', () => {
            if (analyzerOutput && skillDescriptions[skillName]) {
                analyzerOutput.innerHTML = skillDescriptions[skillName] + " <span class='accent-text'>[SCAN CONFIRMED]</span>";
                playSound('success');
            }
        });
    });


    // 6. INVENTORY / PROJECTS DYNAMIC FILTERING
    const filterTabs = document.querySelectorAll('.filter-tab');
    const projectCards = document.querySelectorAll('.project-card');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const filter = tab.getAttribute('data-filter');
            
            // Adjust active tab classes
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            playSound('click');

            // Toggle visibility of project cards with minor animations
            projectCards.forEach(card => {
                const genres = card.getAttribute('data-genres');
                
                if (filter === 'all' || (genres && genres.includes(filter))) {
                    card.style.display = 'block';
                    // Trigger tiny reflow to run CSS transitions if needed
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 20);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    });


    // 7. MOBILE NAVIGATION BAR DRAWER
    const mobileToggle = document.getElementById('mobile-toggle');
    const hudNavMenu = document.getElementById('hud-nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && hudNavMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            hudNavMenu.classList.toggle('active');
            playSound('click');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                hudNavMenu.classList.remove('active');
            });
        });
    }


    // 8. ACTIVE NAVBAR SECTIONS MONITOR (SCROLLSPY)
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120; // offset matches navbar header

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });


    // 9. QUEST FORM HANDLER (SUBMIT PROTOCOL)
    const questForm = document.getElementById('quest-form');
    const formFeedback = document.getElementById('form-feedback');

    if (questForm && formFeedback) {
        questForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const sender = document.getElementById('quest-sender').value.trim();
            const email = document.getElementById('quest-email').value.trim();
            const details = document.getElementById('quest-details').value.trim();

            if (!sender || !email || !details) {
                formFeedback.className = "form-feedback error";
                formFeedback.innerHTML = ">> REJECTED: Missing key coordinates. Check name, email, and description lines.";
                playSound('error');
                return;
            }

            // Play successful synthesis and report success UI state
            playSound('success');
            formFeedback.className = "form-feedback success";
            formFeedback.innerHTML = `>> ACCEPTED: Quest post successfully logged from <span class="accent-text">${sender}</span>. Comms route established!`;
            
            // Empty form inputs
            questForm.reset();
        });
    }

});
