const app = document.getElementById('app');
        const modalContainer = document.getElementById('modal-container');
        let currentTheme = 'light-theme';
        const loadingIcons = {
            upload: ['fa-file-alt', 'fa-database', 'fa-robot', 'fa-check-circle'],
            gmail: ['fa-envelope', 'fa-file-alt', 'fa-robot', 'fa-check-circle']
        };

        function navigateTo(pageId) {
            window.location.hash = pageId;
            renderPage(pageId);
        }

        function renderPage(pageId) {
            app.innerHTML = '';
            let content;
            switch (pageId) {
                case 'landing':
                    content = renderLandingPage();
                    document.getElementById('chat-widget').style.display = 'block';
                    break;
                case 'upload':
                    content = renderUploadPage();
                    document.getElementById('chat-widget').style.display = 'none';
                    break;
                case 'gmail':
                    content = renderGmailPage();
                    document.getElementById('chat-widget').style.display = 'none';
                    break;
                case 'loading':
                    content = renderLoadingPage();
                    document.getElementById('chat-widget').style.display = 'none';
                    break;
                case 'results':
                    content = renderResultsPage();
                    document.getElementById('chat-widget').style.display = 'none';
                    break;
                default:
                    navigateTo('landing');
                    return;
            }
            app.appendChild(content);
        }

        function showModal(title, message, type = 'info') {
            const iconClass = {
                info: 'fas fa-info-circle text-blue-500',
                success: 'fas fa-check-circle text-green-500',
                error: 'fas fa-exclamation-circle text-red-500',
                warning: 'fas fa-exclamation-triangle text-yellow-500'
            };
            modalContainer.innerHTML = `
                <div class="modal-overlay">
                    <div class="modal-content text-heading">
                        <i class="${iconClass[type]} text-4xl mb-4"></i>
                        <h3 class="text-xl font-bold mb-2">${title}</h3>
                        <p class="text-body">${message}</p>
                        <button class="btn-primary mt-6" onclick="closeModal()">OK</button>
                    </div>
                </div>
            `;
            const modal = modalContainer.querySelector('.modal-content');
            modal.style.backgroundColor = getComputedStyle(document.body).getPropertyValue('--bg-card');
            modal.style.color = getComputedStyle(document.body).getPropertyValue('--text-heading');
        }

        function showConfirmModal(title, message, onConfirm) {
            modalContainer.innerHTML = `
                <div class="modal-overlay">
                    <div class="modal-content text-heading">
                        <i class="fas fa-question-circle text-blue-500 text-4xl mb-4"></i>
                        <h3 class="text-xl font-bold mb-2">${title}</h3>
                        <p class="text-body">${message}</p>
                        <div class="mt-6 flex justify-center space-x-4">
                            <button class="btn-primary" onclick="window.modalCallback = true; closeModal();">${getConfirmMessage()}</button>
                            <button class="btn-secondary" onclick="window.modalCallback = false; closeModal();">Cancel</button>
                        </div>
                    </div>
                </div>
            `;
            window.modalCallback = false;
            const modal = modalContainer.querySelector('.modal-content');
            modal.style.backgroundColor = getComputedStyle(document.body).getPropertyValue('--bg-card');
            modal.style.color = getComputedStyle(document.body).getPropertyValue('--text-heading');

            const observer = new MutationObserver(() => {
                if (modalContainer.innerHTML === '') {
                    observer.disconnect();
                    onConfirm(window.modalCallback);
                }
            });
            observer.observe(modalContainer, { childList: true });
        }

        function getConfirmMessage() {
            return `Confirm`;
        }

        function closeModal() {
            modalContainer.innerHTML = '';
        }

        function toggleTheme() {
            const body = document.body;
            const chatPopup = document.getElementById('chat-popup');
            if (body.classList.contains('light-theme')) {
                body.classList.remove('light-theme');
                body.classList.add('dark-theme');
                chatPopup.classList.add('dark-theme');
                currentTheme = 'dark-theme';
            } else {
                body.classList.remove('dark-theme');
                body.classList.add('light-theme');
                chatPopup.classList.remove('dark-theme');
                currentTheme = 'light-theme';
            }
            localStorage.setItem('theme', currentTheme);
        }
        
        function applyInitialTheme() {
            const savedTheme = localStorage.getItem('theme') || 'light-theme';
            document.body.classList.add(savedTheme);
            currentTheme = savedTheme;
            const toggle = document.querySelector('.theme-toggle input');
            if (toggle) {
                toggle.checked = savedTheme === 'dark-theme';
            }
            const chatPopup = document.getElementById('chat-popup');
            if (savedTheme === 'dark-theme') {
                chatPopup.classList.add('dark-theme');
            }
        }

        // --- Page Rendering Functions ---

        function renderHeader(showBack = false) {
            const header = document.createElement('header');
            header.className = `flex justify-between items-center py-4 md:py-8 px-4`;
            header.innerHTML = `
                <a href="#" onclick="navigateTo('landing')" 
                class="flex items-center space-x-2 text-xl font-bold text-white bg-black p-3 rounded-lg hover:opacity-90 transition">
                    <img src="https://i.postimg.cc/Dwrs20rL/introlligent-logo.png" alt="Introlligent Logo" class="h-12">
                </a>

                <div class="flex items-center space-x-4">
                    <div class="theme-toggle flex items-center">
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" value="" class="sr-only peer" onchange="toggleTheme()">
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
                            <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                <i class="fas fa-moon"></i>
                            </span>
                        </label>
                    </div>
                </div>
            `;
            return header;
        }

        function renderFooter() {
            const footer = document.createElement('footer');
            footer.className = 'py-8 border-t border-gray-200 dark:border-gray-700 mt-16';
            footer.innerHTML = `
                <div class="container mx-auto px-4">
                    <div class="flex flex-col md:flex-row justify-between items-center">
                        <div class="text-center md:text-left mb-4 md:mb-0">
                            <a href="https://www.introlligent.com" target="_blank" class="text-lg font-bold text-heading hover:text-primary-orange transition-colors">
                                Introlligent
                            </a>
                            <p class="text-sm text-muted">AI-powered resume analysis for smarter hiring.</p>
                        </div>
                        <div class="flex space-x-4 text-muted">
                            <a href="https://www.linkedin.com/company/introlligent-inc/" target="_blank" class="hover:text-primary-orange transition-colors"><i class="fab fa-linkedin"></i></a>
                            <a href="https://www.facebook.com/IntrolligentInc/" target="_blank" class="hover:text-primary-orange transition-colors"><i class="fab fa-facebook"></i></a>
                            <a href="https://www.instagram.com/introlligentinc/" target="_blank" class="hover:text-primary-orange transition-colors"><i class="fab fa-instagram"></i></a>
                        </div>
                    </div>
                    <div class="text-center text-sm text-muted mt-4">
                        &copy; 2025 Introlligent. All rights reserved.
                    </div>
                </div>
            `;
            return footer;
        }

        function renderLandingPage() {
            const page = document.createElement('div');
            page.className = 'container mx-auto';
            page.appendChild(renderHeader());
            page.innerHTML += `
                <main class="text-center py-16">
                    <div class="flex flex-col lg:flex-row items-center justify-center">
                        <div class="lg:w-1/2 p-4 text-left">
                            <h1 class="text-5xl md:text-6xl font-extrabold leading-tight text-heading">
                                AI-Powered Resume <br> Evaluation for <span class="text-primary-orange">Smarter Hiring</span>
                            </h1>
                            <p class="mt-6 text-lg text-body max-w-xl">
                                Upload a resume or connect your Gmail to get an instant AI-powered analysis of your qualifications, skills, and job fit.
                            </p>
                            <div class="mt-8 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                                <button class="btn-primary" onclick="navigateTo('upload')">
                                    <i class="fas fa-cloud-upload-alt mr-2"></i> Upload Resume
                                </button>
                                <button class="btn-secondary" onclick="navigateTo('gmail')">
                                    <i class="fas fa-envelope-open-text mr-2"></i> Fetch from Gmail
                                </button>
                            </div>
                        </div>
                        <div class="lg:w-1/2 p-4 mt-8 lg:mt-0 relative">
                            <img src="https://i.postimg.cc/jq349Dcj/feature.png" alt="Recruiter and candidate" class="recruiter-image w-full rounded-lg shadow-xl">
                        </div>
                    </div>
                </main>
            `;
            page.appendChild(renderFooter());
            return page;
        }

        function renderUploadPage() {
            const page = document.createElement('div');
            page.className = 'container mx-auto';
            page.appendChild(renderHeader(true));
            page.innerHTML += `
                <main class="py-16">
                    <div class="flex items-center mb-6">
                        <button class="text-muted hover:text-primary-orange transition-colors" onclick="navigateTo('landing')">
                            <i class="fas fa-arrow-left mr-2"></i> Back
                        </button>
                    </div>
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div class="bg-card p-8 rounded-xl shadow-lg">
                            <h2 class="text-3xl font-bold text-heading mb-6">Upload Your Resume</h2>
                            <textarea id="jobDescription" rows="5" class="w-full p-4 rounded-lg input-field focus:outline-none focus:ring-2 focus:ring-primary-orange transition-all duration-200 resize-none mb-6" placeholder="Paste the job description here..."></textarea>
                            <div id="drop-area" class="border-4 border-dashed border-primary-orange rounded-xl p-8 text-center flex flex-col items-center">
                                <i class="fas fa-file-upload text-5xl icon-color mb-4"></i>
                                <p class="text-lg text-muted">Drag & Drop your file here</p>
                                <p class="text-sm text-muted mt-2">Supported formats: PDF, DOC, DOCX (Max 5MB)</p>
                                <input type="file" id="fileInput" class="hidden" accept=".pdf,.doc,.docx">
                                <button id="browseBtn" class="btn-primary mt-6">
                                    <i class="fas fa-folder-open mr-2"></i> Browse Files
                                </button>
                            </div>
                            <div id="uploadStatus" class="mt-4 text-center text-body"></div>
                        </div>
                        <div class="bg-card p-8 rounded-xl shadow-lg">
                            <h3 class="text-xl font-bold text-heading mb-4">How it works</h3>
                            <div class="flex flex-col space-y-4">
                                <div class="flex items-center space-x-4">
                                    <div class="icon-bg w-12 h-12 flex items-center justify-center rounded-full">
                                        <i class="fas fa-cloud-upload-alt text-xl icon-color"></i>
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-heading">Upload</h4>
                                        <p class="text-sm text-muted">Select and upload your resume file.</p>
                                    </div>
                                </div>
                                <div class="flex items-center space-x-4">
                                    <div class="icon-bg w-12 h-12 flex items-center justify-center rounded-full">
                                        <i class="fas fa-database text-xl icon-color"></i>
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-heading">Database</h4>
                                        <p class="text-sm text-muted">The resume is securely stored for analysis.</p>
                                    </div>
                                </div>
                                <div class="flex items-center space-x-4">
                                    <div class="icon-bg w-12 h-12 flex items-center justify-center rounded-full">
                                        <i class="fas fa-robot text-xl icon-color"></i>
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-heading">AI Analysis</h4>
                                        <p class="text-sm text-muted">Our AI evaluates skills and experience.</p>
                                    </div>
                                </div>
                                <div class="flex items-center space-x-4">
                                    <div class="icon-bg w-12 h-12 flex items-center justify-center rounded-full">
                                        <i class="fas fa-poll-h text-xl icon-color"></i>
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-heading">Results</h4>
                                        <p class="text-sm text-muted">View detailed scores and recommendations.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="text-center mt-12">
                        <button id="analyzeResumeBtn" class="btn-primary hidden">
                            <div class="flex items-center space-x-2">
                                <span>Analyze My Resume</span>
                                <i class="fas fa-arrow-right"></i>
                            </div>
                        </button>
                    </div>
                </main>
            `;
            page.appendChild(renderFooter());
            
            const jobDescription = page.querySelector('#jobDescription');
            const browseBtn = page.querySelector('#browseBtn');
            const fileInput = page.querySelector('#fileInput');
            const analyzeBtn = page.querySelector('#analyzeResumeBtn');
            const uploadStatus = page.querySelector('#uploadStatus');
            let uploadedFile = null;

            browseBtn.addEventListener('click', () => {
                fileInput.click();
            });

            fileInput.addEventListener('change', (event) => {
                uploadedFile = event.target.files[0];
                if (uploadedFile) {
                    uploadStatus.innerHTML = `File selected: <strong>${uploadedFile.name}</strong>`;
                    analyzeBtn.classList.remove('hidden');
                } else {
                    uploadStatus.innerHTML = '';
                    analyzeBtn.classList.add('hidden');
                }
            });

            analyzeBtn.addEventListener('click', () => {
                const jdValue = jobDescription.value.trim();
                if (!jdValue) {
                    showModal('Validation Error', 'Please enter a job description to continue.', 'error');
                    return;
                }
                if (uploadedFile) {
                    startLoading('upload', { file: uploadedFile, jobDescription: jdValue });
                }
            });

            return page;
        }

        function renderGmailPage() {
            const page = document.createElement('div');
            page.className = 'container mx-auto';
            page.appendChild(renderHeader(true));
            page.innerHTML += `
                <main class="py-16">
                    <div class="flex items-center mb-6">
                        <button class="text-muted hover:text-primary-orange transition-colors" onclick="navigateTo('landing')">
                            <i class="fas fa-arrow-left mr-2"></i> Back
                        </button>
                    </div>
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div class="bg-card p-8 rounded-xl shadow-lg">
                            <h2 class="text-3xl font-bold text-heading mb-6">Fetch Resumes from Gmail</h2>
                            <textarea id="jobDescription" rows="5" class="w-full p-4 rounded-lg input-field focus:outline-none focus:ring-2 focus:ring-primary-orange transition-all duration-200 resize-none" placeholder="Paste the job description here..."></textarea>
                            <div class="mt-6 flex flex-col space-y-4">
                                <button id="fetchGmailBtn" class="btn-primary">
                                    <div class="flex items-center justify-center space-x-2">
                                        <i class="fab fa-google mr-2"></i> Fetch from Gmail
                                    </div>
                                </button>
                                <a href="/authenticate" target="_blank" id="authButton" class="btn-secondary text-center">
                                    <i class="fas fa-lock mr-2"></i> Re-authenticate
                                </a>
                            </div>
                        </div>
                        <div class="bg-card p-8 rounded-xl shadow-lg">
                            <h3 class="text-xl font-bold text-heading mb-4">How it works</h3>
                            <div class="flex flex-col space-y-4">
                                <div class="flex items-center space-x-4">
                                    <div class="icon-bg w-12 h-12 flex items-center justify-center rounded-full">
                                        <i class="fab fa-google text-xl icon-color"></i>
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-heading">Connect</h4>
                                        <p class="text-sm text-muted">Securely connect your Gmail account.</p>
                                    </div>
                                </div>
                                <div class="flex items-center space-x-4">
                                    <div class="icon-bg w-12 h-12 flex items-center justify-center rounded-full">
                                        <i class="fas fa-file-alt text-xl icon-color"></i>
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-heading">Extract</h4>
                                        <p class="text-sm text-muted">We find resumes in your email attachments.</p>
                                    </div>
                                </div>
                                <div class="flex items-center space-x-4">
                                    <div class="icon-bg w-12 h-12 flex items-center justify-center rounded-full">
                                        <i class="fas fa-robot text-xl icon-color"></i>
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-heading">AI Analysis</h4>
                                        <p class="text-sm text-muted">AI analyzes each resume against the job description.</p>
                                    </div>
                                </div>
                                <div class="flex items-center space-x-4">
                                    <div class="icon-bg w-12 h-12 flex items-center justify-center rounded-full">
                                        <i class="fas fa-chart-line text-xl icon-color"></i>
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-heading">Results</h4>
                                        <p class="text-sm text-muted">Get a list of evaluated candidates with scores.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            `;
            page.appendChild(renderFooter());
            
            const fetchBtn = page.querySelector('#fetchGmailBtn');
            const jobDescription = page.querySelector('#jobDescription');
            
            fetchBtn.onclick = () => {
                if (jobDescription.value.trim() === '') {
                    showModal('Validation Error', 'Please enter a job description to continue.', 'error');
                    return;
                }
                localStorage.setItem('jobDescription', jobDescription.value);
                startLoading('gmail');
            };

            const cachedJobDesc = localStorage.getItem('jobDescription');
            if (cachedJobDesc) {
                jobDescription.value = cachedJobDesc;
            }

            return page;
        }

        function renderLoadingPage() {
            const page = document.createElement('div');
            page.className = 'loading-animation';
            page.innerHTML = `
                <div class="space-y-8 text-center relative w-full max-w-lg mx-auto p-4">
                    <h1 class="loading-title text-heading">Analyzing Resumes...</h1>
                    <div class="relative h-20 w-full flex justify-center items-center">
                        <div class="icon-path absolute top-0 left-0 w-full h-full flex justify-between items-center px-4 z-10">
                            <i id="icon-1" class="fas fa-file-alt text-4xl text-primary-orange"></i>
                            <i id="icon-2" class="fas fa-database text-4xl text-primary-orange opacity-50"></i>
                            <i id="icon-3" class="fas fa-robot text-4xl text-primary-orange opacity-50"></i>
                            <i id="icon-4" class="fas fa-check-circle text-4xl text-primary-orange opacity-50"></i>
                        </div>
                        <div id="animated-path" class="absolute top-0 left-0 w-full h-full"></div>
                    </div>
                    <p class="text-lg text-muted">This may take a moment. Please do not close this page.</p>
                </div>
            `;
            return page;
        }
        
        async function startLoading(flowType, data = {}) {
            navigateTo('loading');
            
            let fetchUrl;
            let payload;
            let animationIcons = loadingIcons[flowType];
            
            const animatedIconContainer = document.querySelector('#animated-path');
            animatedIconContainer.innerHTML = '';
            const animatedIcon = document.createElement('i');
            animatedIcon.className = `fas ${animationIcons[0]} text-4xl text-primary-orange animate-pulse`;
            animatedIconContainer.appendChild(animatedIcon);
            document.getElementById('icon-1').classList.remove('opacity-50');

            let currentStep = 0;
            const updateAnimation = () => {
                if (currentStep < animationIcons.length - 1) {
                    currentStep++;
                    const nextIcon = document.getElementById(`icon-${currentStep + 1}`);
                    if (nextIcon) {
                        nextIcon.classList.remove('opacity-50');
                        nextIcon.classList.add('opacity-100');
                    }
                    setTimeout(updateAnimation, 3000);
                }
            };
            setTimeout(updateAnimation, 3000);

            if (flowType === 'gmail') {
                fetchUrl = '/fetch_resumes';
                const jobDescription = localStorage.getItem('jobDescription');
                payload = { job_description: jobDescription, days_filter: 30 };
                try {
                    const response = await fetch(fetchUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    const result = await response.json();
                    if (response.ok) {
                        if (result.candidates && result.candidates.length > 0) {
                            localStorage.setItem('candidates', JSON.stringify(result.candidates));
                            navigateTo('results');
                        } else {
                            showModal('No Resumes Found', result.message || 'No suitable resumes were found in your Gmail account.', 'info');
                            navigateTo('gmail');
                        }
                    } else {
                        showModal('API Error', result.error || 'A server error occurred while fetching resumes.', 'error');
                        navigateTo('gmail');
                    }
                } catch (error) {
                    showModal('Network Error', 'Error fetching resumes: ' + error.message, 'error');
                    navigateTo('gmail');
                }
            } else if (flowType === 'upload') {
                fetchUrl = '/upload_resume';
                const formData = new FormData();
                const jobDescription = localStorage.getItem('jobDescription');
                formData.append('resume', data.file);
                formData.append('job_description', jobDescription);
                try {
                    const response = await fetch(fetchUrl, {
                        method: 'POST',
                        body: formData
                    });
                    const result = await response.json();
                    if (response.ok) {
                        if (result.candidates && result.candidates.length > 0) {
                            localStorage.setItem('candidates', JSON.stringify(result.candidates));
                            navigateTo('results');
                        } else {
                            showModal('No Candidates Found', result.message || 'The uploaded resume could not be analyzed.', 'info');
                            navigateTo('upload');
                        }
                    } else {
                        showModal('API Error', result.error || 'A server error occurred while uploading the resume.', 'error');
                        navigateTo('upload');
                    }
                } catch (error) {
                    showModal('Network Error', 'Error uploading resume: ' + error.message, 'error');
                    navigateTo('upload');
                }
            }
        }
        
        async function sendEmail(emailType, candidate, event) {
            const jobDescription = localStorage.getItem('jobDescription');
            if (!jobDescription || !candidate.email || !candidate.name) {
                showModal('Error', 'Missing required data for sending email.', 'error');
                return;
            }

            const button = event.target.closest('button');
            const originalButtonContent = button.innerHTML;
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Sending...';

            showConfirmModal('Confirm Action', `Are you sure you want to send a ${emailType} email to ${candidate.name}?`, async (confirmed) => {
                if (confirmed) {
                    const fetchUrl = '/send_email';
                    const payload = {
                        email: candidate.email,
                        name: candidate.name,
                        job_description: jobDescription,
                        type: emailType
                    };

                    try {
                        const response = await fetch(fetchUrl, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                        });
                        const data = await response.json();
                        if (data.success) {
                            showModal('Success', data.message, 'success');
                        } else {
                            showModal('Failed', data.message, 'error');
                        }
                    } catch (error) {
                        console.error('Error sending email:', error);
                        showModal('Error', 'Failed to send email. Please check your network connection and try again.', 'error');
                    }
                }
                button.disabled = false;
                button.innerHTML = originalButtonContent;
            });
        }
        
        function renderResultsPage() {
            const page = document.createElement('div');
            page.className = 'container mx-auto';
            page.appendChild(renderHeader(true));

            page.innerHTML += `
                <main class="py-8">
                    <h2 class="text-3xl font-bold text-heading mb-8">Candidate Evaluations</h2>
                    <div id="resultsContainer"></div>
                </main>
            `;
            
            const resultsContainer = page.querySelector('#resultsContainer');
            const candidates = JSON.parse(localStorage.getItem('candidates'));

            if (resultsContainer && candidates && candidates.length > 0) {
                candidates.forEach(candidate => {
                    const card = document.createElement('div');
                    card.className = "card bg-card card-hover p-6 md:p-8 mb-6 cursor-pointer";
                    card.innerHTML = `
                        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div class="flex items-center space-x-4 mb-4 md:mb-0">
                                <div class="w-12 h-12 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                                    <i class="fas fa-user text-xl icon-color"></i>
                                </div>
                                <div>
                                    <h3 class="text-xl font-semibold text-heading">${candidate.filename}</h3>
                                    <p class="text-sm text-muted">${candidate.name || 'Unknown Name'} • ${candidate.email || 'No email'} • ${candidate.phone || 'No phone'}</p>
                                </div>
                            </div>
                            <div class="flex items-center space-x-4">
                                <div class="text-center">
                                    <div class="text-sm text-muted">ATS Score</div>
                                    <div class="text-xl font-bold text-primary-orange">${candidate.sections.ats_score !== null ? candidate.sections.ats_score : '-'}</div>
                                </div>
                                <div class="text-center">
                                    <div class="text-sm text-muted">HR Score</div>
                                    <div class="text-xl font-bold text-green-500">${candidate.sections.hr_score !== null ? candidate.sections.hr_score : '-'}</div>
                                </div>
                                <span class="text-muted transition-transform duration-300">
                                    <i class="fas fa-chevron-down"></i>
                                </span>
                            </div>
                        </div>
                        <div class="card-details mt-6 space-y-6 hidden">
                            <div class="tabs flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 overflow-x-auto border-b border-gray-200 dark:border-gray-700">
                                <button class="tab-button active" data-tab="info">
                                    <i class="fas fa-user-circle mr-2"></i>Basic Info
                                </button>
                                <button class="tab-button" data-tab="strengths">
                                    <i class="fas fa-bullseye mr-2"></i>Strengths & Weaknesses
                                </button>
                                <button class="tab-button" data-tab="summary">
                                    <i class="fas fa-file-alt mr-2"></i>Summary & Justification
                                </button>
                                <button class="tab-button" data-tab="recommendation">
                                    <i class="fas fa-star mr-2"></i>Recommendation
                                </button>
                                <button class="tab-button" data-tab="scores">
                                    <i class="fas fa-trophy mr-2"></i>Scores
                                </button>
                                <button class="tab-button" data-tab="interview">
                                    <i class="fas fa-question-circle mr-2"></i>Interview Qs
                                </button>
                            </div>
                            <div class="tab-content-pane p-6 rounded-b-xl">
                                <!-- Content will be injected here -->
                            </div>
                            <div class="mt-6 flex flex-col sm:flex-row gap-4 px-6 md:px-8">
                                <button class="btn-primary flex-1 flex items-center justify-center space-x-2" onclick="sendEmail('accept', ${JSON.stringify(candidate).replace(/"/g, "'")}, event)">
                                    <i class="fas fa-check-circle"></i> <span>Send Acceptance Email</span>
                                </button>
                                <button class="btn-secondary flex-1 flex items-center justify-center space-x-2" onclick="sendEmail('reject', ${JSON.stringify(candidate).replace(/"/g, "'")}, event)">
                                    <i class="fas fa-times-circle"></i> <span>Send Rejection Email</span>
                                </button>
                            </div>
                        </div>
                    `;
                    resultsContainer.appendChild(card);

                    const detailsSection = card.querySelector('.card-details');
                    const tabsContainer = card.querySelector('.tabs');
                    const contentContainer = card.querySelector('.tab-content-pane');

                    card.querySelector('.flex.flex-col').addEventListener('click', () => {
                        detailsSection.classList.toggle('hidden');
                        card.querySelector('.fa-chevron-down').classList.toggle('rotate-180');
                    });
                    
                    tabsContainer.addEventListener('click', (e) => {
                        const tabButton = e.target.closest('.tab-button');
                        if (!tabButton) return;

                        tabsContainer.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
                        tabButton.classList.add('active');

                        const tabName = tabButton.dataset.tab;
                        contentContainer.innerHTML = renderTabContent(tabName, candidate);
                    });

                    contentContainer.innerHTML = renderTabContent('info', candidate);
                });
            } else {
                resultsContainer.innerHTML = `<div class="text-center text-muted p-16">No candidates to display.</div>`;
            }
            
            page.appendChild(renderFooter());
            return page;
        }

        function renderTabContent(tabName, candidate) {
            switch(tabName) {
                case 'info':
                    return `
                        <div class="prose max-w-none">
                            <h4 class="text-heading">Candidate Details</h4>
                            <p><strong>Name:</strong> ${candidate.name || 'Not available'}</p>
                            <p><strong>Email:</strong> ${candidate.email || 'Not available'}</p>
                            <p><strong>Phone:</strong> ${candidate.phone || 'Not available'}</p>
                            <h4 class="text-heading mt-6">Email Metadata</h4>
                            <p><strong>Sender:</strong> ${candidate.sender || 'Unknown'}</p>
                            <p><strong>Subject:</strong> ${candidate.subject || 'N/A'}</p>
                            <p><strong>Filename:</strong> ${candidate.filename}</p>
                            ${candidate.sections.basic_info ? `<h4 class="text-heading mt-6">Basic Info Summary</h4><div class="prose">${formatTextWithMarkdown(candidate.sections.basic_info)}</div>` : ''}
                        </div>
                    `;
                case 'strengths':
                    return `
                        <div class="prose max-w-none">
                            <h4 class="text-heading">Strengths</h4>
                            ${renderStrengths(candidate.sections.strengths_weaknesses)}
                            <h4 class="text-heading mt-6">Weaknesses</h4>
                            ${renderWeaknesses(candidate.sections.strengths_weaknesses)}
                        </div>
                    `;
                case 'summary':
                    return `
                        <div class="prose max-w-none">
                            <h4 class="text-heading">HR Summary</h4>
                            ${formatTextWithMarkdown(candidate.sections.hr_summary)}
                            <h4 class="text-heading mt-6">Justification</h4>
                            ${formatTextWithMarkdown(candidate.sections.justification)}
                        </div>
                    `;
                case 'recommendation':
                    return `
                        <div class="prose max-w-none p-4 rounded-xl recommendation-section">
                            ${formatTextWithMarkdown(candidate.sections.recommendation)}
                        </div>
                    `;
                case 'scores':
                    return `
                        <div class="flex flex-col md:flex-row gap-8 text-center">
                            <div class="p-6 rounded-xl bg-card flex-1 flex flex-col items-center">
                                <div class="score-badge ats-score-bg mb-4">
                                    ${candidate.sections.ats_score !== null ? candidate.sections.ats_score : '-'}
                                </div>
                                <p class="text-xl font-bold text-heading">ATS Score</p>
                                <p class="text-muted mt-2">Out of 100 points</p>
                            </div>
                            <div class="p-6 rounded-xl bg-card flex-1 flex flex-col items-center">
                                <div class="score-badge hr-score-bg mb-4">
                                    ${candidate.sections.hr_score !== null ? candidate.sections.hr_score : '-'}
                                </div>
                                <p class="text-xl font-bold text-heading">HR Score</p>
                                <p class="text-muted mt-2">Out of 10 points</p>
                            </div>
                        </div>
                    `;
                case 'interview':
                    return `
                        <div class="prose max-w-none">
                            ${parseInterviewQuestions(candidate.sections.interview_questions)}
                        </div>
                    `;
                default:
                    return '';
            }
        }
        
        function formatTextWithMarkdown(text) {
            if (!text) return '';
            
            // Handle bold text
            text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            
            // Handle lists
            text = text.replace(/^-\s+(.*)$/gm, '<li>$1</li>');
            text = text.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
            
            // Handle line breaks
            text = text.replace(/\n/g, '<br>');
            
            return text;
        }

        function renderStrengths(text) {
            if (!text) return '<p class="text-muted">No strengths provided.</p>';
            let html = '';
            const strengths = text.split('- **Weakness:**')[0].split('- **Strength:**').slice(1);
            if (strengths.length > 0) {
                strengths.forEach(strength => {
                    html += `
                        <div class="strength-item">
                            <div class="strength-icon"><i class="fas fa-plus-circle"></i></div>
                            <div class="text-body">${strength.trim()}</div>
                        </div>
                    `;
                });
            } else {
                return `<p class="text-muted">No strengths provided.</p>`;
            }
            return html;
        }

        function renderWeaknesses(text) {
            if (!text) return '<p class="text-muted">No weaknesses provided.</p>';
            let html = '';
            const weaknesses = text.split('- **Weakness:**').slice(1);
            if (weaknesses.length > 0) {
                weaknesses.forEach(weakness => {
                    html += `
                        <div class="weakness-item">
                            <div class="weakness-icon"><i class="fas fa-minus-circle"></i></div>
                            <div class="text-body">${weakness.trim()}</div>
                        </div>
                    `;
                });
            } else {
                return `<p class="text-muted">No weaknesses provided.</p>`;
            }
            return html;
        }
        
        function parseInterviewQuestions(text) {
            if (!text) return '<p class="text-muted">No interview questions provided.</p>';
            
            const questions = text.split(/\d+\.\s/).filter(q => q.trim() !== '');
            let html = '';
            
            questions.forEach((question, index) => {
                const parts = question.split('**Match level:**');
                const questionText = parts[0].trim();
                let matchLevel = '';
                let explanation = '';
                
                if (parts.length > 1) {
                    const matchParts = parts[1].split('**Explanation:**');
                    matchLevel = matchParts[0].trim();
                    explanation = matchParts.length > 1 ? matchParts[1].trim() : '';
                }
                
                html += `
                    <div class="question-item bg-card">
                        <p class="font-semibold text-heading">${index + 1}. ${questionText}</p>
                        ${matchLevel ? `
                            <div class="mt-2 flex items-center">
                                <span class="match-indicator ${getMatchClass(matchLevel)}"></span>
                                <span class="text-sm font-medium text-body">${matchLevel}</span>
                            </div>
                        ` : ''}
                        ${explanation ? `
                            <div class="mt-2 text-sm text-muted">
                                <strong>Explanation:</strong> ${explanation}
                            </div>
                        ` : ''}
                    </div>
                `;
            });
            
            return html;
        }
        
        function getMatchClass(level) {
            if (level.toLowerCase().includes('clear')) return 'match-clear';
            if (level.toLowerCase().includes('partial')) return 'match-partial';
            if (level.toLowerCase().includes('none')) return 'match-none';
            return '';
        }
        
        // Chatbot Functions
        function toggleChat() {
            const chatPopup = document.getElementById('chat-popup');
            chatPopup.classList.toggle('show');
            // Apply current theme to the popup when it opens
            if (chatPopup.classList.contains('show')) {
                if (currentTheme === 'dark-theme') {
                    chatPopup.classList.add('dark-theme');
                } else {
                    chatPopup.classList.remove('dark-theme');
                }
            }
        }
        
        function addMessage(message, sender) {
            const chatBody = document.getElementById('chat-body');
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            if (sender === 'user') {
                messageElement.classList.add('user-message');
            } else {
                messageElement.classList.add('assistant-message');
            }
            messageElement.innerHTML = formatTextWithMarkdown(message);
            chatBody.appendChild(messageElement);
            chatBody.scrollTop = chatBody.scrollHeight;
        }

        async function sendMessage() {
            const chatInput = document.getElementById('chat-input-field');
            const message = chatInput.value.trim();
            if (!message) return;

            addMessage(message, 'user');
            chatInput.value = '';

            // Add a loading message
            const loadingMessageId = `loading-${Date.now()}`;
            addMessage('<i class="fas fa-spinner fa-spin"></i>', 'assistant');
            const loadingMessage = document.getElementById('chat-body').lastChild;
            loadingMessage.id = loadingMessageId;

            try {
                const response = await fetch('/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: message })
                });
                const data = await response.json();
                
                loadingMessage.remove();
                addMessage(data.response, 'assistant');
            } catch (error) {
                console.error('Error sending chat message:', error);
                loadingMessage.remove();
                addMessage("I'm sorry, I'm unable to connect right now. Please try again later.", 'assistant');
            }
        }
        
        document.addEventListener('DOMContentLoaded', () => {
            applyInitialTheme();
            const initialPage = window.location.hash.substring(1) || 'landing';
            renderPage(initialPage);
            
            const chatInput = document.getElementById('chat-input-field');
            chatInput.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    sendMessage();
                }
            });
        });