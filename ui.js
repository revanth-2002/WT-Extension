const UI = {
    indicator: null,
    modal: null,
    scrapedData: null,

    init() {
        // Avoid duplicate initialization
        if (document.getElementById('wt-indicator')) return;
        this.injectStyles();
        this.createIndicator();
    },

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #wt-indicator {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 60px;
                height: 60px;
                background: #f0f0f0;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 9999;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                font-size: 24px;
                border: 2px solid transparent;
            }
            #wt-indicator:hover {
                transform: scale(1.1);
            }
            #wt-indicator.success { 
                background: #4CAF50; 
                color: white; 
                border-color: #45a049;
            }
            #wt-indicator.error { 
                background: #F44336; 
                color: white; 
                border-color: #d32f2f;
            }
            #wt-indicator.loading { 
                background: #2196F3; 
                color: white; 
                border-color: #1976D2;
            }
            #wt-indicator.idle {
                background: #fff;
                color: #666;
                border-color: #ddd;
            }
            
            /* Spinner animation for loading */
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            .wt-spinner {
                display: inline-block;
                width: 24px;
                height: 24px;
                border: 3px solid rgba(255,255,255,0.3);
                border-radius: 50%;
                border-top-color: #fff;
                animation: spin 1s ease-in-out infinite;
            }

            #wt-modal {
                display: none;
                position: fixed;
                top: 0; left: 0;
                width: 100%; height: 100%;
                background: rgba(0,0,0,0.6);
                z-index: 10000;
                justify-content: center;
                align-items: center;
                backdrop-filter: blur(2px);
            }
            #wt-modal.visible { display: flex; }
            .wt-modal-content {
                background: white;
                width: 800px;
                max-width: 90%;
                max-height: 85vh;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            }
            .wt-modal-header {
                padding: 20px;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: #f8f9fa;
            }
            .wt-modal-header h2 { margin: 0; font-size: 1.25rem; color: #333; }
            .wt-close {
                cursor: pointer;
                font-size: 24px;
                color: #999;
                line-height: 1;
                padding: 5px;
            }
            .wt-close:hover { color: #333; }
            
            .wt-modal-body {
                padding: 20px;
                overflow-y: auto;
                flex: 1;
            }
            
            .wt-json-viewer {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 6px;
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', source-code-pro, monospace;
                font-size: 13px;
                color: #333;
                white-space: pre-wrap;
                word-break: break-word;
                border: 1px solid #e9ecef;
            }
            
            .wt-section {
                margin-bottom: 20px;
            }
            .wt-section-title {
                font-weight: 600;
                margin-bottom: 10px;
                color: #555;
                text-transform: uppercase;
                font-size: 0.85rem;
                letter-spacing: 0.5px;
                border-bottom: 2px solid #eee;
                padding-bottom: 5px;
            }
        `;
        document.head.appendChild(style);
    },

    createIndicator() {
        this.indicator = document.createElement('div');
        this.indicator.id = 'wt-indicator';
        this.indicator.className = 'idle';
        this.indicator.innerHTML = '<span>W</span>';
        this.indicator.title = 'LinkedIn Scraper Status';
        this.indicator.onclick = () => this.toggleModal();
        document.body.appendChild(this.indicator);
    },

    setStatus(status) {
        if (!this.indicator) this.init();

        this.indicator.className = status;

        if (status === 'success') {
            this.indicator.innerHTML = '✓';
        } else if (status === 'error') {
            this.indicator.innerHTML = '✕';
        } else if (status === 'loading') {
            this.indicator.innerHTML = '<div class="wt-spinner"></div>';
        } else {
            this.indicator.innerHTML = '<span>W</span>';
        }
    },

    setData(data) {
        this.scrapedData = data;
    },

    toggleModal() {
        if (!this.modal) this.createModal();

        if (this.modal.classList.contains('visible')) {
            this.modal.classList.remove('visible');
        } else {
            this.renderData();
            this.modal.classList.add('visible');
        }
    },

    createModal() {
        this.modal = document.createElement('div');
        this.modal.id = 'wt-modal';
        this.modal.innerHTML = `
            <div class="wt-modal-content">
                <div class="wt-modal-header">
                    <h2>Scraped Data Preview</h2>
                    <span class="wt-close">&times;</span>
                </div>
                <div class="wt-modal-body" id="wt-data-container">
                    <!-- Data will be injected here -->
                </div>
            </div>
        `;
        this.modal.querySelector('.wt-close').onclick = () => this.toggleModal();
        this.modal.onclick = (e) => {
            if (e.target === this.modal) this.toggleModal();
        };
        document.body.appendChild(this.modal);
    },

    renderData() {
        const container = this.modal.querySelector('#wt-data-container');
        if (!this.scrapedData) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #666;">
                    <p>No data scraped yet.</p>
                    <p style="font-size: 0.9em;">Please wait for the scraping process to complete.</p>
                </div>
            `;
            return;
        }

        // Create a pretty view of the data
        const sections = [
            { key: 'name', label: 'Name' },
            { key: 'headline', label: 'Headline' },
            { key: 'location', label: 'Location' },
            { key: 'about', label: 'About' },
            { key: 'education', label: 'Education' },
            { key: 'experience', label: 'Experience' },
            { key: 'skills', label: 'Skills' },
            { key: 'profileUrl', label: 'Profile URL' },
            { key: 'scrapedAt', label: 'Scraped At' }
        ];

        let html = '';

        sections.forEach(section => {
            const value = this.scrapedData[section.key];
            if (value) {
                html += `
                    <div class="wt-section">
                        <div class="wt-section-title">${section.label}</div>
                        <div class="wt-json-viewer">${typeof value === 'object' ? JSON.stringify(value, null, 2) : value}</div>
                    </div>
                `;
            }
        });

        container.innerHTML = html;
    }
};
