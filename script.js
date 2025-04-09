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
   // downloadPolicy function 
function downloadPolicy() {
    try {
        const { jsPDF } = window.jspdf;
        if (!jsPDF) {
            console.error("jsPDF not loaded properly");
            alert("PDF generation library not loaded. Please refresh the page and try again.");
            return;
        }

        // Create a new document with standard font
        const doc = new jsPDF();
        
        // Set default font for the entire document
        doc.setFont("helvetica");
        
        // Load logo image (if it exists)
        let logoImg = new Image();
        logoImg.src = 'logo.jpg';
        logoImg.crossOrigin = "Anonymous"; // Add cross-origin attribute to help with loading
        
        // Get the organization name and readiness score, with defaults if blank
        const orgName = document.getElementById('org-name').value || "Your Organization";
        const score = parseInt(document.getElementById('readiness-score').textContent) || 0;

        // Define consistent margins and spacing
        const marginLeft = 15;
        const marginRight = 15;
        const lineHeight = 10;
        const maxY = 270;
        let y = 20;

        // Calculate the maximum width for text
        const pageWidth = doc.internal.pageSize.getWidth();
        const maxTextWidth = pageWidth - marginLeft - marginRight;
        
        // Colors for visual elements
        const primaryColor = [93/255, 103/255, 233/255]; // #5d67e9
        const secondaryColor = [40/255, 167/255, 69/255]; // #28a745
        
        // Helper: Draw page header with gradient bar
        function addPageHeader(title) {
            // Draw gradient header bar
            doc.setFillColor(...primaryColor);
            doc.rect(0, 0, pageWidth, 10, 'F');
            
            // Add logo if loaded
            try {
                if (logoImg.complete) {
                    const logoSize = 25;
                    doc.addImage(logoImg, 'JPEG', marginLeft, y - 10, logoSize, logoSize);
                    // Add title with offset for logo
                    doc.setFontSize(18);
                    doc.setTextColor(0, 0, 0);
                    doc.text(title, marginLeft + logoSize + 5, y);
                } else {
                    // Just add title if logo not loaded
                    doc.setFontSize(18);
                    doc.setTextColor(0, 0, 0);
                    doc.text(title, marginLeft, y);
                }
            } catch (e) {
                // Fallback if image loading fails
                doc.setFontSize(18);
                doc.setTextColor(0, 0, 0);
                doc.text(title, marginLeft, y);
            }
            y += 15;
        }

        // Helper: Add wrapped text with consistent formatting
        function addWrappedText(text, fontSize = 12, isBold = false) {
            doc.setFontSize(fontSize);
            doc.setFont("helvetica", isBold ? 'bold' : 'normal');
            
            const wrappedLines = doc.splitTextToSize(text, maxTextWidth);
            wrappedLines.forEach(line => {
                if (y + lineHeight > maxY) { 
                    doc.addPage(); 
                    y = 20; 
                    addPageHeader("Responsible AI Policy (Continued)");
                    addFooter();
                }
                doc.text(line, marginLeft, y);
                y += lineHeight;
            });
        }

        // Helper: Add a section heading
        function addSectionHeading(text) {
            doc.setFont("helvetica", 'bold');
            doc.setFontSize(14);
            doc.setTextColor(...primaryColor);
            
            if (y + lineHeight > maxY) { 
                doc.addPage(); 
                y = 20; 
                addPageHeader("Responsible AI Policy (Continued)");
                addFooter();
            }
            
            doc.text(text, marginLeft, y);
            y += lineHeight + 2;
            
            // Add underline
            doc.setDrawColor(...primaryColor);
            doc.setLineWidth(0.5);
            doc.line(marginLeft, y - 5, pageWidth - marginRight, y - 5);
            y += 3;
            
            // Reset text color to black - this is crucial for visibility
            doc.setTextColor(0, 0, 0);
        }

        // Helper: Draw score visualization
        function drawScoreVisualization(score) {
            // Background circle
            doc.setFillColor(240/255, 240/255, 240/255);
            doc.circle(pageWidth/2, y + 30, 25, 'F');
            
            // Score circle
            if (score >= 75) {
                doc.setFillColor(40/255, 167/255, 69/255); // Green
            } else if (score >= 50) {
                doc.setFillColor(255/255, 193/255, 7/255); // Yellow
            } else {
                doc.setFillColor(220/255, 53/255, 69/255); // Red
            }
            
            doc.circle(pageWidth/2, y + 30, 20, 'F');
            
            // Score text
            doc.setFontSize(18);
            doc.setTextColor(255, 255, 255); // White text
            doc.setFont("helvetica", 'bold');
            
            const scoreText = score.toString();
            const textWidth = doc.getStringUnitWidth(scoreText) * 18 / doc.internal.scaleFactor;
            doc.text(scoreText, pageWidth/2 - (textWidth/2), y + 30 + 6);
            doc.setTextColor(0, 0, 0); // Reset text color to black
            
            // Adding the "/100" label
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text("/100", pageWidth/2 + 12, y + 30 + 6);
            
            y += 60;
        }

        // Helper: Add a visual divider
        function addDivider() {
            doc.setDrawColor(200/255, 200/255, 200/255);
            doc.setLineWidth(0.5);
            doc.line(marginLeft, y, pageWidth - marginRight, y);
            y += 10;
        }

        // Helper: Add footer on the current page
        function addFooter() {
            const footerY = 285;
            
            // Add divider line
            doc.setDrawColor(200/255, 200/255, 200/255);
            doc.setLineWidth(0.5);
            doc.line(marginLeft, footerY - 5, pageWidth - marginRight, footerY - 5);
            
            // Add footer text
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text("Generated by Sandhiya – AlmostTEchHR Explorer", marginLeft, footerY);
            
            // Add page numbers
            const pageNumber = doc.internal.getNumberOfPages();
            const pageText = `Page ${pageNumber}`;
            const textWidth = doc.getStringUnitWidth(pageText) * 10 / doc.internal.scaleFactor;
            doc.text(pageText, pageWidth - marginRight - textWidth, footerY);
        }

        // ----------- PAGE 1: AI Readiness Summary -------------
        addPageHeader(`AI Readiness Report for ${orgName}`);
        
        // Welcome text
        addWrappedText(`Hi team at ${orgName},`, 12);
        addWrappedText(`Here's a quick snapshot of your current readiness to adopt AI in an ethical, inclusive, and responsible way.`, 12);
        y += 5;
        
        // Score visualization
        drawScoreVisualization(score);
        
        // Score interpretation
        if (score >= 75) {
            addWrappedText(`You're doing great!`, 14, true);
            addWrappedText(`You're building on strong AI practices.`);
        } else if (score >= 50) {
            addWrappedText(`You're progressing well.`, 14, true);
            addWrappedText(`Keep growing your practices around training and compliance.`);
        } else {
            addWrappedText(`A great time to start!`, 14, true);
            addWrappedText(`There's a big opportunity to set foundations aligned with your values.`);
        }
        
        y += 5;
        
        // Recommendations
        addSectionHeading("Recommendations");
        
        const recs = [];
        if (score < 50) {
            recs.push("• Start with basic AI training sessions");
            recs.push("• Assign responsible roles for AI tool approval");
            recs.push("• Build a simple internal AI usage registry");
        } else if (score < 75) {
            recs.push("• Advance to AI bias mitigation training");
            recs.push("• Introduce audit processes for AI tools");
            recs.push("• Form a cross-functional AI ethics group");
        } else {
            recs.push("• Share your policy externally as a model");
            recs.push("• Formalize an AI ethics advisory council");
            recs.push("• Lead internal AI innovation forums");
        }

        recs.forEach(line => {
            addWrappedText(line);
        });

        addFooter();
        doc.addPage(); 
        y = 20;

        // ----------- PAGE 2: Responsible AI Policy -------------
        addPageHeader(`Responsible AI Policy for ${orgName}`);
        
        // Purpose
        addSectionHeading("Purpose");
        addWrappedText(`This policy provides practical guidance for the use of AI tools and systems at ${orgName}. It is designed to encourage innovation while ensuring alignment with our organizational values.`);
        y += 5;
        
        // Core Principles
        addSectionHeading("Core Principles");
        
        // Ensure text colors are properly set
        doc.setTextColor(0, 0, 0); // Reset to black text
        
        // Draw small colored bullet points for each principle
        const principles = [
            {title: "Human-Centered", desc: "AI should augment human capabilities, not replace human judgment. Our team members remain at the center of all AI-enabled processes."},
            {title: "Transparency", desc: "We maintain clarity about when and how AI is used. Team members should know when they are interacting with AI systems."},
            {title: "Privacy & Security", desc: "We protect data privacy and maintain robust security measures when using AI tools."},
            {title: "Fairness", desc: "We commit to building AI systems that are free from harmful bias and work to identify and address potential bias in third-party tools."},
            {title: "Accountability", desc: "We take responsibility for the impacts of our AI systems and have clear processes for addressing issues that arise."}
        ];
        
        // Add document analysis insights if available
        if (window.documentAnalysis) {
            const analysis = window.documentAnalysis;
            if (analysis.inclusionScore > 3) {
                principles.push({title: "Inclusive Design", desc: "We ensure our AI systems respect and promote diversity, equity, and inclusion."});
            }
            if (analysis.innovationScore > 3) {
                principles.push({title: "Innovative Responsibility", desc: "We encourage creative uses of AI while maintaining ethical standards."});
            }
            if (analysis.complianceScore > 3) {
                principles.push({title: "Regulatory Compliance", desc: "We adhere to all applicable regulations related to AI use."});
            }
        }
        
        principles.forEach((principle, index) => {
            if (y + 25 > maxY) { 
                doc.addPage(); 
                y = 20; 
                addPageHeader("Responsible AI Policy (Continued)");
                addFooter();
            }
            
            // Draw colored circle with number
            doc.setFillColor(...primaryColor);
            doc.circle(marginLeft + 5, y + 5, 5, 'F');
            
            // Add number to circle
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(10);
            doc.text((index + 1).toString(), marginLeft + 5 - 1.5, y + 5 + 3);
            
            // Add principle title and description
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(12);
            doc.setFont("helvetica", 'bold');
            doc.text(principle.title, marginLeft + 15, y + 5);
            doc.setFont("helvetica", 'normal');
            
            const descLines = doc.splitTextToSize(principle.desc, maxTextWidth - 15);
            y += 10;
            descLines.forEach(line => {
                doc.text(line, marginLeft + 15, y);
                y += lineHeight;
            });
            
            y += 5;
        });
        
        // Add organizational values if available
        if (window.documentAnalysis && window.documentAnalysis.keyPhrases.length > 0) {
            addSectionHeading("Alignment With Organizational Values");
            addWrappedText("These principles align with our core organizational values, including:", 12);
            
            const phrases = window.documentAnalysis.keyPhrases.slice(0, 3);
            phrases.forEach(phrase => {
                addWrappedText(`• "${phrase}"`, 12);
            });
            
            y += 5;
        }
        
        // Always start Practical Guidance on a new page
        doc.addPage();
        y = 20;
        addPageHeader("Practical Guidance");
        addFooter();
        
        // For Employees section
        doc.setFont("helvetica", 'bold');
        addWrappedText("For Employees:", 12, true);
        doc.setFont("helvetica", 'normal');
        
        const employeeGuidance = [
            "• Know which AI tools are approved for use in your role",
            "• Maintain awareness of sensitive data restrictions",
            "• Review AI-generated outputs before making key decisions",
            "• Report concerns about biased or problematic AI outputs"
        ];
        
        employeeGuidance.forEach(line => {
            addWrappedText(line);
        });
        
        y += 5;
        
        // For Leaders section
        doc.setFont("helvetica", 'bold');
        addWrappedText("For Leaders:", 12, true);
        doc.setFont("helvetica", 'normal');
        
        const leaderGuidance = [
            "• Encourage responsible AI innovation",
            "• Support team members in developing AI literacy",
            "• Ensure AI implementations align with organizational values",
            "• Regularly review AI usage in your area"
        ];
        
        leaderGuidance.forEach(line => {
            addWrappedText(line);
        });
        
        addFooter();
        
        // Always start Improvement Roadmap on a new page
        doc.addPage();
        y = 20;
        addPageHeader("Improvement Roadmap");
        addFooter();
        
        // Draw a simple roadmap visualization
        const roadmapY = y;
        const roadmapStartX = marginLeft + 10;
        const roadmapEndX = pageWidth - marginRight - 10;
        
        // Draw the roadmap line
        doc.setDrawColor(...primaryColor);
        doc.setLineWidth(2);
        doc.line(roadmapStartX, roadmapY, roadmapEndX, roadmapY);
        
        // Draw milestone points
        const milestonePositions = [
            roadmapStartX,
            roadmapStartX + (roadmapEndX - roadmapStartX) * 0.33,
            roadmapStartX + (roadmapEndX - roadmapStartX) * 0.66,
            roadmapEndX
        ];
        
        milestonePositions.forEach((x, i) => {
            doc.setFillColor(...primaryColor);
            doc.circle(x, roadmapY, 5, 'F');
            
            // Add milestone numbers
            doc.setTextColor(255, 255, 255); // White text color for better visibility on colored background
            doc.setFontSize(8);
            doc.text((i + 1).toString(), x - 1.5, roadmapY + 3);
        });
        
        // Reset text color to black after adding milestone numbers
        doc.setTextColor(0, 0, 0);
        
        y += 20;
        
        // Improvement steps
        let improvementSteps = [];
        if (score < 50) {
            improvementSteps = [
                "• Develop a formal AI governance framework with clear guidelines",
                "• Implement basic AI literacy training for all employees",
                "• Establish a review process for AI use cases",
                "• Create a feedback mechanism for AI-related concerns"
            ];
        } else if (score < 75) {
            improvementSteps = [
                "• Enhance your existing AI literacy training program",
                "• Implement structured compliance monitoring",
                "• Develop metrics to assess the impact of AI on inclusion and fairness",
                "• Consider forming an AI ethics working group"
            ];
        } else {
            improvementSteps = [
                "• Continue refining your AI governance processes",
                "• Share best practices with industry peers",
                "• Establish an AI ethics committee for ongoing guidance",
                "• Introduce advanced training for AI-intensive roles"
            ];
        }
        
        // Check if we have enough space for all steps (approximately 10 lines * lineHeight)
        if (y + (improvementSteps.length * lineHeight) + 10 > maxY) {
            doc.addPage();
            y = 20;
            addPageHeader("Responsible AI Policy (Continued)");
            addFooter();
            addSectionHeading("Improvement Steps");
        }
        
        improvementSteps.forEach(step => {
            addWrappedText(step);
        });
        
        addFooter();
        
        // ----------- Last Page: Disclaimer -------------
        doc.addPage(); 
        y = 20;
        
        addPageHeader("Disclaimer & Next Steps");
        
        // Add disclaimer box
        const boxY = y;
        const boxHeight = 60;
        
        // Draw disclaimer box
        doc.setFillColor(245/255, 245/255, 245/255);
        doc.setDrawColor(200/255, 200/255, 200/255);
        doc.setLineWidth(0.5);
        doc.roundedRect(marginLeft, boxY, pageWidth - marginLeft - marginRight, boxHeight, 3, 3, 'FD');
        
        y += 10;
        
        // Add disclaimer content
        doc.setFontSize(14);
        doc.setFont("helvetica", 'bold');
        doc.text("Important Note", marginLeft + 10, y);
        y += 15;
        
        doc.setFontSize(11);
        doc.setFont("helvetica", 'normal');
        
        const disclaimerText = [
            "This document is an AI-generated draft based on the responses you provided.",
            "It is designed to support your journey toward responsible AI adoption.",
            "Please consult with your legal, HR, or compliance team before treating this",
            "as a final policy document. Use it as a guide, not a guarantee."
        ];

        disclaimerText.forEach(line => {
            doc.text(line, marginLeft + 10, y);
            y += 8;
        });
        
        y += 20;
        
        // Next steps
        addSectionHeading("Recommended Next Steps");
        
        const nextSteps = [
            "1. Review this document with your leadership team",
            "2. Gather feedback from key stakeholders across departments",
            "3. Refine the policy to align with your specific needs and culture",
            "4. Develop an implementation plan with clear timelines",
            "5. Communicate the finalized policy to all employees"
        ];
        
        nextSteps.forEach(step => {
            addWrappedText(step);
        });
        
        addFooter();

        // Save the document
        doc.save("Responsible_AI_Report_and_Policy.pdf");
        console.log("PDF generation completed successfully");
    } catch (error) {
        console.error("Error generating PDF:", error);
        alert("There was an error generating the PDF. Please try again.");
    }
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
