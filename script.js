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
        // HR AI Usage (Extra 10 points)
const hrAI = document.querySelector('input[name="hr-ai"]:checked').value;
switch (hrAI) {
    case 'both':
        score += 10;
        break;
    case 'hiring':
    case 'performance':
        score += 5;
        break;
    case 'no':
        score += 0;
        break;
    default:
        score += 0;
        break;
}
        return score;
    }

    // generateResults() function 
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
   // Replace your current downloadPolicy function (around line 494) with this improved version
function downloadPolicy() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Get the organization name and calculate score
    const orgName = document.getElementById('org-name').value;
    // Use the same score that's displayed on screen
    const score = parseInt(document.getElementById('readiness-score').textContent);
    
    // Create a nicely formatted PDF with proper sections
    let policyText = `Responsible AI Policy for ${orgName}\n\n`;
    
    // SECTION 1: AI READINESS ASSESSMENT
    policyText += `SECTION 1: AI READINESS ASSESSMENT\n\n`;
    policyText += `Your Ethical AI Readiness Score: ${score} out of 100\n\n`;
    
    // Add assessment description based on score
    if (score >= 75) {
        policyText += `Your organization demonstrates an excellent foundation for ethical AI use. Continue to enhance your policies with periodic reviews and advanced training programs.\n\n`;
    } else if (score >= 50) {
        policyText += `Your organization shows a moderate level of readiness. There is room for improvement in policy and training measures. Consider investing in comprehensive AI literacy training and automating compliance monitoring.\n\n`;
    } else {
        policyText += `Your readiness score indicates a need for significant enhancements in your ethical AI policies. We recommend a thorough review of your current practices and the implementation of robust governance measures.\n\n`;
    }
    
    // SECTION 2: PRACTICAL AI POLICY
    policyText += `SECTION 2: RESPONSIBLE AI POLICY\n\n`;
    policyText += `Purpose: This policy provides practical guidance for the use of AI tools and systems at ${orgName}. It is designed to encourage innovation while ensuring alignment with our organizational values.\n\n`;
    
    policyText += `CORE PRINCIPLES:\n\n`;
    policyText += `1. Human-Centered: AI should augment human capabilities, not replace human judgment. Our team members remain at the center of all AI-enabled processes.\n\n`;
    policyText += `2. Transparency: We maintain clarity about when and how AI is used. Team members should know when they are interacting with AI systems.\n\n`;
    policyText += `3. Privacy & Security: We protect data privacy and maintain robust security measures when using AI tools.\n\n`;
    policyText += `4. Fairness: We commit to building AI systems that are free from harmful bias and work to identify and address potential bias in third-party tools.\n\n`;
    policyText += `5. Accountability: We take responsibility for the impacts of our AI systems and have clear processes for addressing issues that arise.\n\n`;
    
    // Add culture-specific elements if available
    if (window.documentAnalysis) {
        const analysis = window.documentAnalysis;
        
        if (analysis.inclusionScore > 3) {
            policyText += `6. Inclusive Design: We ensure our AI systems respect and promote diversity, equity, and inclusion.\n\n`;
        }
        
        if (analysis.innovationScore > 3) {
            policyText += `7. Innovative Responsibility: We encourage creative uses of AI while maintaining ethical standards.\n\n`;
        }
        
        if (analysis.complianceScore > 3) {
            policyText += `8. Regulatory Compliance: We adhere to all applicable regulations related to AI use.\n\n`;
        }
        
        // Add organizational values if available
        if (analysis.keyPhrases.length > 0) {
            policyText += `ALIGNMENT WITH ORGANIZATIONAL VALUES:\n\n`;
            policyText += `These principles align with our core organizational values, including:\n`;
            
            // Add up to 3 key phrases
            for (let i = 0; i < Math.min(3, analysis.keyPhrases.length); i++) {
                policyText += `• "${analysis.keyPhrases[i]}"\n`;
            }
            policyText += `\n`;
        }
    }
    
    // SECTION 3: PRACTICAL GUIDANCE
    policyText += `SECTION 3: PRACTICAL GUIDANCE\n\n`;
    
    // Add practical guidance based on their assessment
    policyText += `For Employees:\n`;
    policyText += `• Know which AI tools are approved for use in your role\n`;
    policyText += `• Maintain awareness of sensitive data restrictions\n`;
    policyText += `• Review AI-generated outputs before using them in important decisions\n`;
    policyText += `• Report concerns about AI outputs that seem biased or problematic\n\n`;
    
    policyText += `For Leaders:\n`;
    policyText += `• Encourage responsible AI innovation within your teams\n`;
    policyText += `• Support team members in developing AI literacy\n`;
    policyText += `• Ensure AI implementations align with organizational values\n`;
    policyText += `• Regularly review how AI is being used in your area\n\n`;
    
    // SECTION 4: IMPROVEMENT ROADMAP
    policyText += `SECTION 4: IMPROVEMENT ROADMAP\n\n`;
    policyText += `Based on your assessment, we recommend the following actions:\n\n`;
    
    // Add custom recommendations based on score
    if (score < 50) {
        policyText += `• Develop a formal AI governance framework with clear guidelines\n`;
        policyText += `• Implement basic AI literacy training for all employees\n`;
        policyText += `• Establish a process for reviewing AI use cases\n`;
        policyText += `• Create a feedback mechanism for AI-related concerns\n`;
    } else if (score < 75) {
        policyText += `• Enhance your existing AI literacy training program\n`;
        policyText += `• Implement more structured compliance monitoring\n`;
        policyText += `• Develop metrics to assess AI's impact on inclusion\n`;
        policyText += `• Consider forming an AI ethics working group\n`;
    } else {
        policyText += `• Continue to refine your AI governance processes\n`;
        policyText += `• Share your best practices with industry peers\n`;
        policyText += `• Establish an AI ethics committee for ongoing guidance\n`;
        policyText += `• Create advanced training for AI-intensive roles\n`;
    }
    
    // Add to PDF with proper formatting
    const lines = doc.splitTextToSize(policyText, 180);
    doc.text(lines, 15, 15);
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
