// 1. Live Visual Strength Meter Logic (Triggers instantly on user input)
function updateStrengthMeter() {
    const password = document.getElementById('passwordInput').value;
    const meterFill = document.getElementById('meterFill');
    const strengthText = document.getElementById('strengthText');
    
    if (!password) {
        meterFill.style.width = "0%";
        strengthText.innerText = "Empty";
        strengthText.style.color = "#94a3b8";
        return;
    }

    let score = 0;
    
    // Add points based on variety of character types (entropy)
    if (/[a-z]/.test(password)) score++; // Has lowercase
    if (/[A-Z]/.test(password)) score++; // Has uppercase
    if (/[0-9]/.test(password)) score++; // Has digits
    if (/[^A-Za-z0-9]/.test(password)) score++; // Has special symbols
    
    // Add points for length thresholds
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;

    // Calculate width percentage (Max possible points is 7)
    const percentage = Math.min((score / 7) * 100, 100);
    meterFill.style.width = `${percentage}%`;

    // Map scores to specific UI colors and text indicators
    if (score <= 2) {
        strengthText.innerText = "Very Weak ❌";
        meterFill.style.backgroundColor = "#ef4444"; // Red
        strengthText.style.color = "#ef4444";
    } else if (score <= 4) {
        strengthText.innerText = "Weak ⚠️";
        meterFill.style.backgroundColor = "#f97316"; // Orange
        strengthText.style.color = "#f97316";
    } else if (score <= 5) {
        strengthText.innerText = "Moderate 🛡️";
        meterFill.style.backgroundColor = "#eab308"; // Yellow
        strengthText.style.color = "#eab308";
    } else {
        strengthText.innerText = "Strong 💪";
        meterFill.style.backgroundColor = "#22c55e"; // Green
        strengthText.style.color = "#22c55e";
    }
}

// 2. Helper function to hash text using SHA-1 (Required for HIBP API)
async function sha1(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

// 3. Browser-native Cryptographic Generator (Alternative to Argon2)
async function generateSecureKey() {
    const randomBytes = new Uint8Array(32);
    window.crypto.getRandomValues(randomBytes);

    const hashBuffer = await crypto.subtle.digest('SHA-384', randomBytes);
    const raw256BitData = new Uint8Array(hashBuffer).slice(0, 32);

    const base64String = btoa(String.fromCharCode(...raw256BitData));
    return base64String;
}

// 4. Verification Workflow (Triggers on button click)
async function evaluatePassword() {
    const password = document.getElementById('passwordInput').value;
    const resultBox = document.getElementById('resultBox');
    const statusMessage = document.getElementById('statusMessage');
    const generatorSection = document.getElementById('generatorSection');
    const cryptoKey = document.getElementById('cryptoKey');

    if (!password) return;

    resultBox.style.display = "block";
    statusMessage.innerHTML = "Checking breach database...";
    generatorSection.style.display = "none";

    let isSafe = password.length >= 12;
    let localWarning = isSafe ? "" : "<p>❌ <strong>Too Short:</strong> Passwords must be 12+ characters.</p>";

    try {
        const fullHash = await sha1(password);
        const prefix = fullHash.substring(0, 5);
        const suffix = fullHash.substring(5);

        const response = await fetch(`https://pwnedpasswords.com{prefix}`);
        if (!response.ok) throw new Error("API network error");
        const textData = await response.text();

        const lines = textData.split('\n');
        let breachCount = 0;

        for (let line of lines) {
            const [targetSuffix, count] = line.trim().split(':');
            if (targetSuffix === suffix) {
                breachCount = parseInt(count, 10);
                break;
            }
        }

        if (breachCount > 0) {
            resultBox.className = "result danger";
            statusMessage.innerHTML = `${localWarning}<p>❌ <strong>Breached:</strong> This password was exposed ${breachCount.toLocaleString()} times in data leaks!</p>`;
            isSafe = false;
        } else if (!isSafe) {
            resultBox.className = "result danger";
            statusMessage.innerHTML = `${localWarning}<p>✅ <strong>Breach Check:</strong> Clear. No leaks found.</p>`;
        } else {
            resultBox.className = "result success";
            statusMessage.innerHTML = "<p>🎉 <strong>Excellent:</strong> Your password is safe and meets structural lengths!</p>";
        }

        if (!isSafe) {
            const secureAlternative = await generateSecureKey();
            cryptoKey.innerText = secureAlternative;
            generatorSection.style.display = "block";
        }

    } catch (error) {
        resultBox.className = "result danger";
        statusMessage.innerHTML = "⚠️ Error communicating with the free verification API.";
        console.error(error);
    }
}
