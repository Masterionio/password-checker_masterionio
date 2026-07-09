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
    
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    if (password.length >= 20) score++;

    
    const percentage = Math.min((score / 7) * 100, 100);
    meterFill.style.width = `${percentage}%`;

    
    if (score <= 2) {
        strengthText.innerText = "Very Weak";
        meterFill.style.backgroundColor = "#ef4444";
        strengthText.style.color = "#ef4444";
    } else if (score <= 4) {
        strengthText.innerText = "Weak";
        meterFill.style.backgroundColor = "#f97316";
        strengthText.style.color = "#f97316";
    } else if (score <= 5) {
        strengthText.innerText = "Slightly Secure";
        meterFill.style.backgroundColor = "#eab308";
        strengthText.style.color = "#eab308";
    } else if (score <= 7) {
        strengthText.innerText = "Secure";
        meterFill.style.backgroundColor = "#22c55e";
        strengthText.style.color = "#22c55e";
    } else {
        strengthText.innerText = "Highly Secure";
        meterFill.style.backgroundColor = "#1f75ff";
        strengthText.style.color = "#1f75ff";
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
    let localWarning = isSafe ? "" : "<p> <strong>Too Short:</strong> Passwords must be 12+ characters.</p>";

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
            statusMessage.innerHTML = `${localWarning}<p> <strong>Breached</strong> This password was breached ${breachCount.toLocaleString()} times in data leaks!</p>`;
            isSafe = false;
        } else if (!isSafe) {
            resultBox.className = "result danger";
            statusMessage.innerHTML = `${localWarning}<p> <strong>Insecure</strong> Clear. No leaks found.</p>`;
        } else {
            resultBox.className = "result success";
            statusMessage.innerHTML = "<p> <strong>Nice</strong> Your password is safe and meets structural lengths!</p>";
        }

        if (!isSafe) {
            const secureAlternative = await generateSecureKey();
            cryptoKey.innerText = secureAlternative;
            generatorSection.style.display = "block";
        }

    } catch (error) {
        resultBox.className = "result danger";
        statusMessage.innerHTML = "Error communicating with the free verification API.";
        console.error(error);
    }
}
