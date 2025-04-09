document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const progressBar = document.querySelector('.progress-bar');
    const formSteps = document.querySelectorAll('.form-step');
    const policyUploadDiv = document.getElementById('policy-upload');

    // Document processing functions 
function processUploadedDocument(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = function(event) {
      const text = event.target.result;
      // Simple keyword analysis
      const keywords = analyzeText(text);
      resolve(keywords);
    };
    
    reader.onerror = function() {
      reject(new Error("Error reading file"));
    };
    
    // Read as text - works for .txt files
    reader.readAsText(file);
  });
}

function analyzeText(text) {
  // Create a simple analysis object with keyword counts
  const analysis = {
    inclusionScore: 0,
    innovationScore: 0,
    complianceScore: 0,
    keyPhrases: []
  };
  
  // Check for inclusion-related words
  const inclusionWords = ['diversity', 'inclusion', 'equity', 'belonging', 'accessibility'];
  inclusionWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches) {
      analysis.inclusionScore += matches.length;
    }
  });
  
  // Check for innovation-related words
  const innovationWords = ['innovation', 'creative', 'transform', 'agile', 'experiment'];
  innovationWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches) {
      analysis.innovationScore += matches.length;
    }
  });
  
  // Check for compliance-related words
  const complianceWords = ['compliance', 'policy', 'regulation', 'guideline', 'standard'];
  complianceWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches) {
      analysis.complianceScore += matches.length;
    }
  });
  
  // Extract key phrases (simple implementation)
  const sentences = text.split(/[.!?]+/);
  sentences.forEach(sentence => {
    const trimmedSentence = sentence.trim();
    if (trimmedSentence.length > 10 && 
        (inclusionWords.some(word => trimmedSentence.toLowerCase().includes(word)) ||
         innovationWords.some(word => trimmedSentence.toLowerCase().includes(word)) ||
         complianceWords.some(word => trimmedSentence.toLowerCase().includes(word)))) {
      if (trimmedSentence.length < 150) {
        analysis.keyPhrases.push(trimmedSentence);
      }
    }
  });
  
  return analysis;
}

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

    // Toggle file upload div based on existing policy selection
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

    // Add event listener for culture document upload
document.getElementById('culture-upload').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    // Process the file when it's uploaded
    processUploadedDocument(file)
      .then(analysis => {
        // Store the analysis for later use
        window.documentAnalysis = analysis;
        console.log("Document analysis complete:", analysis);
      })
      .catch(error => {
        console.error("Error processing document:", error);
      });
  }
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

    // Calculate readiness score out of 100, with defaults to handle any unexpected values.
    function calculateReadinessScore() {
        let score = 0;
        
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
            default:
                score += 0;
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
            default:
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
            default:
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
            default:
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
                break;
            case 'none':
                score += 0;
                break;
            default:
                score += 0;
                break;
        }
        
        // HR AI Usage (Extra 10 points)
        const hrAI = document.querySelector('input[name="hr-ai"]:checked').value;
        switch (hrAI) {
            case 'integrated':
                score += 10;
                break;
            case 'partial':
                score += 5;
                break;
            case 'none':
                score += 0;
                break;
            default:
                score += 0;
                break;
        }
        
        return score;
    }

    // Replace your existing generateResults() function with this enhanced version
function generateResults() {
  // Get base score from form inputs
  let score = calculateReadinessScore();
  
  // If document was analyzed, incorporate those insights
  if (window.documentAnalysis) {
    // Add bonus points for document analysis
    const docAnalysis = window.documentAnalysis;
    
    // Adjust score based on document analysis (up to 15 extra points)
    const documentBonus = Math.min(
      15, 
      Math.floor((docAnalysis.inclusionScore + docAnalysis.innovationScore + docAnalysis.complianceScore) / 3)
    );
    score += documentBonus;
    
    // Generate more personalized policy
    generatePersonalizedPolicy(docAnalysis, score);
  } else {
    // Generate generic policy
    generateGenericPolicy(score);
  }
  
  // Update the score display
  document.getElementById('readiness-score').textContent = score;
  
  // Update score message
  updateScoreMessage(score);
  
  // Generate recommendations
  generateRecommendations(score);
}

    function generatePersonalizedPolicy(analysis, score) {
  const orgName = document.getElementById('org-name').value;
  const policyContent = document.getElementById('policy-content');
  
  // Create policy sections
  let policyHTML = `<h2>Responsible AI Policy for ${orgName}</h2>`;
  
  // Introduction
  policyHTML += `<p>This Responsible AI Policy outlines how ${orgName} approaches the use of artificial intelligence in alignment with our organizational values and culture.</p>`;
  
  // Core principles section
  policyHTML += `<h3>Core Principles</h3><ul>`;
  
  // Add principles based on document analysis
  if (analysis.inclusionScore > 3) {
    policyHTML += `<li><strong>Inclusive AI:</strong> We are committed to ensuring our AI systems are designed and deployed in ways that respect and promote diversity, equity, and inclusion.</li>`;
  }
  
  if (analysis.innovationScore > 3) {
    policyHTML += `<li><strong>Innovative Responsibility:</strong> We encourage innovation with AI while maintaining strict standards for responsible development and use.</li>`;
  }
  
  if (analysis.complianceScore > 3) {
    policyHTML += `<li><strong>Regulatory Compliance:</strong> We adhere to all applicable regulations and industry standards related to AI use.</li>`;
  }
  
  // Add standard principles
  policyHTML += `
    <li><strong>Transparency:</strong> We maintain transparency about when and how AI is used in our products and services.</li>
    <li><strong>Human-Centered:</strong> Our AI systems are designed to augment human capabilities, not replace human judgment.</li>
    <li><strong>Privacy & Security:</strong> We protect data privacy and maintain robust security measures for all AI systems.</li>
  </ul>`;
  
  // Add key phrases from document if available
  if (analysis.keyPhrases.length > 0) {
    policyHTML += `<h3>Alignment with Organizational Values</h3>`;
    policyHTML += `<p>This policy incorporates key principles from our organizational culture documents:</p><ul>`;
    
    // Add up to 3 key phrases
    for (let i = 0; i < Math.min(3, analysis.keyPhrases.length); i++) {
      policyHTML += `<li>"${analysis.keyPhrases[i]}"</li>`;
    }
    
    policyHTML += `</ul>`;
  }
  
  // Add readiness score
  policyHTML += `<h3>AI Readiness Assessment</h3>`;
  policyHTML += `<p>Based on our assessment, ${orgName} has an AI Readiness Score of ${score}/100.</p>`;
  
  // Set the HTML content
  policyContent.innerHTML = policyHTML;
}

function generateGenericPolicy(score) {
  const orgName = document.getElementById('org-name').value;
  const policyContent = document.getElementById('policy-content');
  
  let policyHTML = `<h2>Responsible AI Policy for ${orgName}</h2>`;
  
  policyHTML += `<p>This document outlines our approach to the responsible use of artificial intelligence technologies.</p>`;
  
  policyHTML += `<h3>Core Principles</h3><ul>
    <li><strong>Ethical Use:</strong> We are committed to using AI in ways that align with our organizational values and ethical standards.</li>
    <li><strong>Transparency:</strong> We will be transparent about when and how AI is used in our products and services.</li>
    <li><strong>Human Oversight:</strong> All AI systems will have appropriate human oversight and review mechanisms.</li>
    <li><strong>Privacy & Security:</strong> We will protect data privacy and maintain robust security measures for all AI systems.</li>
    <li><strong>Fairness:</strong> We will work to identify and address potential biases in our AI systems.</li>
  </ul>`;
  
  policyHTML += `<h3>AI Readiness Assessment</h3>`;
  policyHTML += `<p>Based on our assessment, ${orgName} has an AI Readiness Score of ${score}/100.</p>`;
  
  policyContent.innerHTML = policyHTML;
}

function updateScoreMessage(score) {
  const scoreMessage = document.getElementById('score-message');
  
  if (score >= 75) {
    scoreMessage.textContent = "Your organization demonstrates an excellent foundation for ethical AI use.";
  } else if (score >= 50) {
    scoreMessage.textContent = "Your organization shows a moderate level of AI readiness with room for improvement.";
  } else {
    scoreMessage.textContent = "Your organization is at the beginning of its AI governance journey.";
  }
}

function generateRecommendations(score) {
  const recommendationsList = document.getElementById('recommendations-list');
  recommendationsList.innerHTML = ''; // Clear existing recommendations
  
  const recommendations = [];
  
  // Add recommendations based on score
  if (score < 50) {
    recommendations.push("Develop a formal AI governance framework with clear policies and guidelines.");
    recommendations.push("Implement basic AI literacy training for all employees who use AI tools.");
    recommendations.push("Establish a process for reviewing and approving AI use cases.");
  } else if (score < 75) {
    recommendations.push("Enhance your AI literacy training program to cover advanced topics.");
    recommendations.push("Implement more structured compliance monitoring for AI usage.");
    recommendations.push("Develop metrics to assess AI's impact on inclusion and fairness.");
  } else {
    recommendations.push("Continue to refine your AI governance with regular policy reviews.");
    recommendations.push("Share your best practices with your industry peers.");
    recommendations.push("Consider establishing an AI ethics committee to guide ongoing development.");
  }
  
  // Get specific form values for targeted recommendations
  const aiTraining = document.querySelector('input[name="ai-training"]:checked')?.value;
  if (aiTraining === 'none') {
    recommendations.push("Implement a basic AI literacy training program for all employees.");
  }
  
  const knowledgeSystem = document.querySelector('input[name="knowledge-system"]:checked')?.value;
  if (knowledgeSystem === 'no') {
    recommendations.push("Create a system for documenting and sharing AI-generated insights.");
  }
  
  // Add recommendations to the list
  recommendations.forEach(recommendation => {
    const li = document.createElement('li');
    li.textContent = recommendation;
    recommendationsList.appendChild(li);
  });
}
    // Use jsPDF to generate and download the policy as a PDF file.
    function downloadPolicy() {
        const { jsPDF } = window.jspdf;
        let policyText = document.getElementById('policy-content').textContent;
        const doc = new jsPDF();
        const lines = doc.splitTextToSize(policyText, 180);
        doc.text(lines, 10, 10);
        doc.save("Responsible_AI_Policy.pdf");
    }

    // Reset the form to the initial state
    function resetForm() {
        // Clear all input selections and values
        document.querySelectorAll('input').forEach(input => {
            if (input.type === 'radio' || input.type === 'checkbox') {
                input.checked = false;
            } else {
                input.value = '';
            }
        });
        // Reset file uploads
        if (document.getElementById('policy-file')) {
            document.getElementById('policy-file').value = '';
        }
        // Clear the results section
        document.getElementById('policy-content').textContent = '';
    }
});
