document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const progressBar = document.querySelector('.progress-bar');
    const formSteps = document.querySelectorAll('.form-step');
    const policyUploadDiv = document.getElementById('policy-upload');

    // Navigation Buttons
    const step1Next = document.getElementById('step-1-next');
    const step2Prev = document.getElementById('step-2-prev');
    const step2Next = document.getElementById('step-2-next');
    const step3Prev = document.getElementById('step-3-prev');
    const step3Next = document.getElementById('step-3-next');
    const step4Prev = document.getElementById('step-4-prev');
    const generatePolicyBtn = document.getElementById('generate-policy');
    const downloadPolicyBtn = document.getElementById('download-policy');
    const restartBtn = document.getElementById('restart');

    // Radio buttons for existing policy
    const policyYes = document.getElementById('policy-yes');
    const policyNo = document.getElementById('policy-no');

    // Setup file upload visibility toggle
    policyYes.addEventListener('change', () => {
        policyUploadDiv.classList.remove('d-none');
    });

    policyNo.addEventListener('change', () => {
        policyUploadDiv.classList.add('d-none');
    });

    // Navigation Functions
    let currentStep = 0;

    function goToStep(step) {
        formSteps.forEach((formStep, index) => {
            formStep.classList.remove('active');
            if (index === step) {
                formStep.classList.add('active');
            }
        });
        
        // Update progress bar
        const progress = (step / (formSteps.length - 1)) * 100;
        progressBar.style.width = `${progress}%`;
        progressBar.setAttribute('aria-valuenow', progress);
        progressBar.textContent = `${Math.round(progress)}%`;
        
        currentStep = step;
    }

    // Navigation Event Listeners
    step1Next.addEventListener('click', () => {
        if (validateStep1()) {
            goToStep(1);
        }
    });

    step2Prev.addEventListener('click', () => {
        goToStep(0);
    });

    step2Next.addEventListener('click', () => {
        if (validateStep2()) {
            goToStep(2);
        }
    });

    step3Prev.addEventListener('click', () => {
        goToStep(1);
    });

    step3Next.addEventListener('click', () => {
        if (validateStep3()) {
            goToStep(3);
        }
    });

    step4Prev.addEventListener('click', () => {
        goToStep(2);
    });

    generatePolicyBtn.addEventListener('click', () => {
        if (validateStep4()) {
            generateResults();
            goToStep(4);
        }
    });

    restartBtn.addEventListener('click', () => {
        resetForm();
        goToStep(0);
    });

    downloadPolicyBtn.addEventListener('click', () => {
        downloadPolicy();
    });

    // Form Validation Functions
    function validateStep1() {
        const orgName = document.getElementById('org-name').value;
        const orgIndustry = document.getElementById('org-industry').value;
        const existingPolicy = document.querySelector('input[name="existing-policy"]:checked');
        
        if (!orgName) {
            alert('Please enter your organization name');
            return false;
        }
        
        if (!orgIndustry) {
            alert('Please select your industry');
            return false;
        }
        
        if (!existingPolicy) {
            alert('Please indicate whether you have an existing policy');
            return false;
        }
        
        // If they have an existing policy, check if they've uploaded it
        if (existingPolicy.value === 'yes' && !document.getElementById('policy-file').files.length) {
            alert('Please upload your existing policy');
            return false;
        }
        
        return true;
    }

    function validateStep2() {
        const aiStance = document.getElementById('ai-stance').value;
        const aiTools = document.querySelectorAll('input[name="ai-tools"]:checked');
        const shareInfo = document.querySelector('input[name="share-info"]:checked');
        
        if (!aiStance) {
            alert('Please select your organization\'s stance on AI use');
            return false;
        }
        
        if (aiTools.length === 0) {
            alert('Please select at least one AI tool');
            return false;
        }
        
        if (!shareInfo) {
            alert('Please indicate your policy on sharing company information with AI tools');
            return false;
        }
        
        return true;
    }

    function validateStep3() {
        const knowledgeSystem = document.querySelector('input[name="knowledge-system"]:checked');
        const sensitiveData = document.querySelector('input[name="sensitive-data"]:checked');
        const inclusionTracking = document.querySelector('input[name="inclusion-tracking"]:checked');
        
        if (!knowledgeSystem) {
            alert('Please indicate if you have a system for managing AI-generated knowledge');
            return false;
        }
        
        if (!sensitiveData) {
            alert('Please indicate how sensitive data is handled with AI tools');
            return false;
        }
        
        if (!inclusionTracking) {
            alert('Please indicate if you track the impact of AI on inclusion and fairness');
            return false;
        }
        
        return true;
    }

    function validateStep4() {
        const aiTraining = document.querySelector('input[name="ai-training"]:checked');
        const compliance = document.querySelector('input[name="compliance"]:checked');
        const hrAI = document.querySelector('input[name="hr-ai"]:checked');
        
        if (!aiTraining) {
            alert('Please indicate if you provide AI literacy training');
            return false;
        }
        
        if (!compliance) {
            alert('Please indicate how you monitor compliance with AI policies');
            return false;
        }
        
        if (!hrAI) {
            alert('Please indicate if you use AI in hiring or performance decisions');
            return false;
        }
        
        return true;
    }

    // Policy Generation Functions
    function calculateReadinessScore() {
        let score = 0;
        const maxScore = 100;
        
        // AI Stance (0-15 points)
        const aiStance = document.getElementById('ai-stance').value;
        switch (aiStance) {
            case 'progressive':
                score += 15;
                break;
            case 'moderate':
                score += 15;
                break;
            case 'cautious':
                score += 10;
                break;
            case 'restrictive':
                score += 5;
                break;
        }
        
        // Knowledge Management (0-15 points)
        const knowledgeSystem = document.querySelector('input[name="knowledge-system"]:checked').value;
        switch (knowledgeSystem) {
            case 'yes':
                score += 15;
                break;
            case 'informal':
                score += 10;
                break;
            case 'no':
                score += 0;
                break;
        }
        
        // Sensitive Data Handling (0-15 points)
        const sensitiveData = document.querySelector('input[name="sensitive-data"]:checked').value;
        switch (sensitiveData) {
            case 'prohibited':
                score += 10;
                break;
            case 'approved':
                score += 15;
                break;
            case 'case':
                score += 10;
                break;
            case 'no-policy':
                score += 0;
                break;
        }
        
        // Training (0-15 points)
        const aiTraining = document.querySelector('input[name="ai-training"]:checked').value;
        switch (aiTraining) {
            case 'comprehensive':
                score += 15;
                break;
            case 'basic':
                score += 10;
                break;
            case 'none':
                score += 0;
                break;
        }
        
        // Compliance Monitoring (0-15 points)
        const compliance = document.querySelector('input[name="compliance"]:checked').value;
        switch (compliance) {
            case 'automated':
                score += 15;
                break;
            case 'manual':
                score += 10;
                break