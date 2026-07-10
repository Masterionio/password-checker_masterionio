function updateStrengthMeter() {
    const password = document.getElementById('passwordInput').value;
    const meterFill = document.getElementById('meterFill');
    const strengthText = document.getElementById('strengthText');
    const charCount = document.getElementById('charCount');
    const meterScore = document.getElementById('meterScore');

    const checkLower = document.getElementById('checkLower');
    const checkUpper = document.getElementById('checkUpper');
    const checkNum = document.getElementById('checkNum');
    const checkSym = document.getElementById('checkSym');
    const checkLen = document.getElementById('checkLen');
    const checkUnique = document.getElementById('checkUnique');

    charCount.innerText = password.length;

    let score = 0;

    if (!password) {
        meterFill.style.width = "0%";
        strengthText.innerText = "Empty";
        strengthText.style.color = "#94a3b8";
        meterScore.innerText = "0/16";

        checkLower.innerHTML = "✗ Lowercase (a-z)"; checkLower.style.color = "#f87171";
        checkUpper.innerHTML = "✗ Uppercase (A-Z)"; checkUpper.style.color = "#f87171";
        checkNum.innerHTML = "✗ Number (0-9)"; checkNum.style.color = "#f87171";
        checkSym.innerHTML = "✗ Symbol (!@#$)"; checkSym.style.color = "#f87171";
        checkLen.innerHTML = "✗ Min Length (16+ chars)"; checkLen.style.color = "#f87171";
        if (checkUnique) { checkUnique.innerHTML = "✗ All Unique"; checkUnique.style.color = "#f87171"; }
        return;
    }

    if (/[a-z]/.test(password)) { score++; checkLower.innerHTML = "✓ Lowercase (a-z)"; checkLower.style.color = "#4ade80"; }
    else { checkLower.innerHTML = "✗ Lowercase (a-z)"; checkLower.style.color = "#f87171"; }

    if (/[A-Z]/.test(password)) { score++; checkUpper.innerHTML = "✓ Uppercase (A-Z)"; checkUpper.style.color = "#4ade80"; }
    else { checkUpper.innerHTML = "✗ Uppercase (A-Z)"; checkUpper.style.color = "#f87171"; }

    if (/[0-9]/.test(password)) { score++; checkNum.innerHTML = "✓ Number (0-9)"; checkNum.style.color = "#4ade80"; }
    else { checkNum.innerHTML = "✗ Number (0-9)"; checkNum.style.color = "#f87171"; }

    if (/[^A-Za-z0-9]/.test(password)) { score++; checkSym.innerHTML = "✓ Symbol (!@#$)"; checkSym.style.color = "#4ade80"; }
    else { checkSym.innerHTML = "✗ Symbol (!@#$)"; checkSym.style.color = "#f87171"; }

    if (checkUnique) {
        if (password.length <= 6) {
            checkUnique.innerHTML = "✗ All Unique"; checkUnique.style.color = "#f87171";
        } else {
            const charCounts = {};
            for (const ch of password) {
                charCounts[ch] = (charCounts[ch] || 0) + 1;
            }
            const hasRepeats = Object.values(charCounts).some(count => count >= 2);
            if (!hasRepeats) {
                score++;
                checkUnique.innerHTML = "✓ All Unique"; checkUnique.style.color = "#4ade80";
            } else {
                checkUnique.innerHTML = "✗ All Unique"; checkUnique.style.color = "#f87171";
            }
        }
    }

    if (password.length >= 36) {
        score += 11;
    } else if (password.length >= 34) {
        score += 9.5;
    } else if (password.length >= 32) {
        score += 8;
    } else if (password.length >= 30) {
        score += 7;
    } else if (password.length >= 28) {
        score += 6;
    } else if (password.length >= 26) {
        score += 5.5;
    } else if (password.length >= 24) {
        score += 5;
    } else if (password.length >= 22) {
        score += 4.5;
    } else if (password.length >= 20) {
        score += 4;
    } else if (password.length >= 18) {
        score += 3.5;
    } else if (password.length >= 16) {
        score += 3;
    } else if (password.length >= 14) {
        score += 2.5;
    } else if (password.length >= 12) {
        score += 2;
    } else if (password.length >= 10) {
        score += 1.5;
    } else if (password.length >= 8) {
        score += 1;
    } else if (password.length >= 6) {
        score += 0.5;
    }

    if (password.length >= 16) { checkLen.innerHTML = "✓ Min Length (16+ chars)"; checkLen.style.color = "#4ade80"; }
    else { checkLen.innerHTML = "✗ Min Length (16+ chars)"; checkLen.style.color = "#f87171"; }

    const displayScore = Math.round(score * 10) / 10;
    meterScore.innerText = `${displayScore}/16`;

    const percentage = Math.min((score / 16) * 100, 100);
    meterFill.style.width = `${percentage}%`;

    if (score <= 3) {
        strengthText.innerText = "Very Weak";
        meterFill.style.backgroundColor = "#ef4444";
        strengthText.style.color = "#ef4444";
    } else if (score <= 6) {
        strengthText.innerText = "Weak";
        meterFill.style.backgroundColor = "#f97316";
        strengthText.style.color = "#f97316";
    } else if (score <= 8.5) {
        strengthText.innerText = "Slightly Secure";
        meterFill.style.backgroundColor = "#eab308";
        strengthText.style.color = "#eab308";
    } else if (score <= 11.5) {
        strengthText.innerText = "Secure";
        meterFill.style.backgroundColor = "#22c55e";
        strengthText.style.color = "#22c55e";
    } else if (score <= 15) {
        strengthText.innerText = "Highly Secure";
        meterFill.style.backgroundColor = "#1f75ff";
        strengthText.style.color = "#1f75ff";
    } else {
        strengthText.innerText = "Nearly Uncrackable";
        meterFill.style.backgroundColor = "#6951f0";
        strengthText.style.color = "#6951f0";
    }
}

function togglePasswordVisibility() {
    const input = document.getElementById('passwordInput');
    const btn = document.getElementById('togglePasswordBtn');

    if (input.type === 'password') {
        input.type = 'text';
        btn.innerHTML = '◉';
    } else {
        input.type = 'password';
        btn.innerHTML = '◎';
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
    const base64String = btoa(String.fromCharCode(...randomBytes));
    return base64String;
}

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

    let isShort = password.length < 16;
    let localWarning = isShort ? "<p><strong>Too Short!</strong> Passwords should always be 16+ characters.</p>" : "";

    let isSafe = true;

    try {
        const fullHash = await sha1(password);
        const prefix = fullHash.substring(0, 5);
        const suffix = fullHash.substring(5);

        const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
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
            isSafe = false;
            resultBox.className = "result danger";
            statusMessage.innerHTML = `${localWarning}<p><strong>Breached!</strong> This password was breached ${breachCount.toLocaleString()} times in data leaks! It may also be a common password.</p>`;
        } else if (isShort) {
            isSafe = false;
            resultBox.className = "result danger";
            statusMessage.innerHTML = `${localWarning}<p><strong>Insecure!</strong> This password is too short.</p>`;
        } else if (password.length >= 32) {
            resultBox.className = "result success";
            statusMessage.innerHTML = "<p><strong>Dang!</strong> This password is almost unbreakable.</p>";
        } else if (password.length >= 24) {
            resultBox.className = "result success";
            statusMessage.innerHTML = "<p><strong>Nice!</strong> This password is highly secure.</p>";
        } else {
            resultBox.className = "result success";
            statusMessage.innerHTML = "<p><strong>Good.</strong> This password is decently secure.</p>";
        }

        if (!isSafe) {
            const secureAlternative = await generateSecureKey();
            cryptoKey.innerText = secureAlternative;
            generatorSection.style.display = "block";
        }

    } catch (error) {
        resultBox.className = "result danger";
        statusMessage.innerHTML = "Error communicating with the verification API.";
        console.error(error);
    }
}
