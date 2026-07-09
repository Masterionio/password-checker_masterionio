function updateStrengthMeter() {
    const password = document.getElementById('passwordInput').value;
    const meterFill = document.getElementById('meterFill');
    const strengthText = document.getElementById('strengthText');

    const checkLower = document.getElementById('checkLower');
    const checkUpper = document.getElementById('checkUpper');
    const checkNum = document.getElementById('checkNum');
    const checkSym = document.getElementById('checkSym');
    const checkLen = document.getElementById('checkLen');
    const checkUnique = document.getElementById('checkUnique');

    if (!password) {
        meterFill.style.width = "0%";
        strengthText.innerText = "Empty";
        strengthText.style.color = "#94a3b8";

        checkLower.innerHTML = "✗ Lowercase (a-z)"; checkLower.style.color = "#f87171";
        checkUpper.innerHTML = "✗ Uppercase (A-Z)"; checkUpper.style.color = "#f87171";
        checkNum.innerHTML = "✗ Number (0-9)"; checkNum.style.color = "#f87171";
        checkSym.innerHTML = "✗ Symbol (!@#$)"; checkSym.style.color = "#f87171";
        checkLen.innerHTML = "✗ Min Length (16+ chars)"; checkLen.style.color = "#f87171";
        if (checkUnique) { checkUnique.innerHTML = "✗ All Unique"; checkUnique.style.color = "#f87171"; }
        return;
    }

    // Structural validations
    if (/[a-z]/.test(password)) { checkLower.innerHTML = "✓ Lowercase (a-z)"; checkLower.style.color = "#4ade80"; }
    else { checkLower.innerHTML = "✗ Lowercase (a-z)"; checkLower.style.color = "#f87171"; }

    if (/[A-Z]/.test(password)) { checkUpper.innerHTML = "✓ Uppercase (A-Z)"; checkUpper.style.color = "#4ade80"; }
    else { checkUpper.innerHTML = "✗ Uppercase (A-Z)"; checkUpper.style.color = "#f87171"; }

    if (/[0-9]/.test(password)) { checkNum.innerHTML = "✓ Number (0-9)"; checkNum.style.color = "#4ade80"; }
    else { checkNum.innerHTML = "✗ Number (0-9)"; checkNum.style.color = "#f87171"; }

    if (/[^A-Za-z0-9]/.test(password)) { checkSym.innerHTML = "✓ Symbol (!@#$)"; checkSym.style.color = "#4ade80"; }
    else { checkSym.innerHTML = "✗ Symbol (!@#$)"; checkSym.style.color = "#f87171"; }

    if (checkUnique) {
        if (password.length <= 6) {
            checkUnique.innerHTML = "✗ All Unique"; checkUnique.style.color = "#f87171";
        } else {
            const charCounts = {};
            for (const ch of password) { charCounts[ch] = (charCounts[ch] || 0) + 1; }
            const hasRepeats = Object.values(charCounts).some(count => count >= 2);
            if (!hasRepeats) {
                checkUnique.innerHTML = "✓ All Unique"; checkUnique.style.color = "#4ade80";
            } else {
                checkUnique.innerHTML = "✗ All Unique"; checkUnique.style.color = "#f87171";
            }
        }
    }

    if (password.length >= 16) { checkLen.innerHTML = "✓ Min Length (16+ chars)"; checkLen.style.color = "#4ade80"; }
    else { checkLen.innerHTML = "✗ Min Length (16+ chars)"; checkLen.style.color = "#f87171"; }

    // --- DICTIONARY AND HEURISTIC STRENGTH EVALUATION ---
    // Using window.zxcvbn to safely tap the global CDN script
    const analysis = window.zxcvbn(password);
    const score = analysis.score; // Returns 0, 1, 2, 3, or 4

    // Map the 0-4 score onto your 0% - 100% visual meter
    const percentage = (score / 4) * 100;
    meterFill.style.width = `${percentage}%`;

    if (score === 0) {
        strengthText.innerText = "Very Weak (Common Match)";
        meterFill.style.backgroundColor = "#ef4444";
        strengthText.style.color = "#ef4444";
    } else if (score === 1) {
        strengthText.innerText = "Weak";
        meterFill.style.backgroundColor = "#f97316";
        strengthText.style.color = "#f97316";
    } else if (score === 2) {
        strengthText.innerText = "Slightly Secure";
        meterFill.style.backgroundColor = "#eab308";
        strengthText.style.color = "#eab308";
    } else if (score === 3) {
        strengthText.innerText = "Secure";
        meterFill.style.backgroundColor = "#22c55e";
        strengthText.style.color = "#22c55e";
    } else {
        strengthText.innerText = "Nearly Uncrackable";
        meterFill.style.backgroundColor = "#6951f0";
        strengthText.style.color = "#6951f0";
    }
}

async function sha1(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

async function generateSecureKey() {
    const randomBytes = new Uint8Array(32);
    window.crypto.getRandomValues(randomBytes);
    return btoa(String.fromCharCode(...randomBytes));
}

async function evaluatePassword() {
    const password = document.getElementById('passwordInput').value;
    const resultBox = document.getElementById('resultBox');
    const statusMessage = document.getElementById('statusMessage');
    const generatorSection = document.getElementById('generatorSection');
    const cryptoKey = document.getElementById('cryptoKey');

    if (!password) return;

    resultBox.style.display = "block";
    statusMessage.innerHTML = "Checking database leaks & dictionary patterns...";
    generatorSection.style.display = "none";

    let isSafe = password.length >= 16;
    let localWarning = isSafe ? "" : "<p> <strong>Too Short!</strong> Passwords should always be 16+ characters.</p>";

    // Intercept using local dictionary analysis
    const analysis = window.zxcvbn(password);
    if (analysis.score <= 1 && analysis.feedback.warning) {
        resultBox.className = "result danger";
        statusMessage.innerHTML = `${localWarning}<p><strong>Exploitable Word!</strong> ${analysis.feedback.warning}. This pattern is easily guessed by dictionary matching tools.</p>`;
        
        const secureAlternative = await generateSecureKey();
        cryptoKey.innerText = secureAlternative;
        generatorSection.style.display = "block";
        return; 
    }

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
            statusMessage.innerHTML = `${localWarning}<p> <strong>Breached!</strong> This password was leaked ${breachCount.toLocaleString()} times in data leaks!</p>`;
            isSafe = false;
        } else if (!isSafe) {
            resultBox.className = "result danger";
            statusMessage.innerHTML = `${localWarning}<p> <strong>Insecure Structure!</strong> Clear of leaks, but structurally too weak.</p>`;
        } else {
            resultBox.className = "result success";
            statusMessage.innerHTML = "<p> <strong>Nice!</strong> Your password is structurally secure and clear of known public breaches!</p>";
        }

        if (!isSafe) {
            const secureAlternative = await generateSecureKey();
            cryptoKey.innerText = secureAlternative;
            generatorSection.style.display = "block";
        }

    } catch (error) {
        resultBox.className = "result danger";
        statusMessage.innerHTML = "Error communicating with verification database API.";
        console.error(error);
    }
}
