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

    let score = 0;

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

    if (password.length >= 6) score += 0.5;
    if (password.length >= 8) score += 0.5;
    if (password.length >= 10) score += 0.5;
    if (password.length >= 12) score += 0.5;
    if (password.length >= 14) score += 0.5;
    if (password.length >= 16) score += 0.5;
    if (password.length >= 18) score += 0.5;
    if (password.length >= 20) score += 0.5;
    if (password.length >= 22) score += 0.5;
    if (password.length >= 24) score += 0.5;
    if (password.length >= 26) score += 0.5;
    if (password.length >= 28) score += 0.5;
    if (password.length >= 30) score += 1;
    if (password.length >= 32) score += 1;
    if (password.length >= 34) score += 1;
    if (password.length >= 36) score += 1;

    if (password.length >= 16) { checkLen.innerHTML = "✓ Min Length (16+ chars)"; checkLen.style.color = "#4ade80"; }
    else { checkLen.innerHTML = "✗ Min Length (16+ chars)"; checkLen.style.color = "#f87171"; }

    const percentage = Math.min((score / 17) * 100, 100);
    meterFill.style.width = `${percentage}%`;

    if (score <= 3) {
        strengthText.innerText = "Very Weak";
        meterFill.style.backgroundColor = "#ef4444";
        strengthText.style.color = "#ef4444";
    } else if (score <= 6) {
        strengthText.innerText = "Weak";
        meterFill.style.backgroundColor = "#f97316";
        strengthText.style.color = "#f97316";
    } else if (score <= 8) {
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
