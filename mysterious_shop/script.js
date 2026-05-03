/**
 * 神秘小舖核心邏輯 - JavaScript (無音樂版)
 */

const game = {
    // 遊戲狀態
    state: {
        hasSocks: false,
        contactsVerified: false,
        passwordInput: ""
    },

    // 埋點記錄
    stats: {
        wrongSelections: 0,
        socksCollected: 0,
        drawCounts: 0,
        startTime: Date.now()
    },

    // 運勢配置
    fortunes: [
        { label: '大吉', img: 'great_luck.png', desc: '今天你的運氣爆棚，開心到點了一排男模！', weight: 5 },
        { label: '吉', img: 'luck.png', desc: '運氣不錯，找到一間有專人烤肉的燒烤店。', weight: 25 },
        { label: '普', img: 'normal.png', desc: '平凡的一天', weight: 40 },
        { label: '凶', img: 'bad.png', desc: '幸災樂禍，有可能會有報應。', weight: 25 },
        { label: '大凶', img: 'great_bad.png', desc: '超可憐哈哈哈', weight: 5 }
    ],

    // 初始化
    init() {
        console.log("小舖系統：系統已初始化。");
        localStorage.removeItem('jason_socks_collected');
        document.querySelector('.version').innerText = 'v1.1 (Mobile Optimized)';
    },

    // 1. 驗證教主邏輯
    verifyTrap(isCorrect) {
        if (isCorrect) {
            alert("驗證成功！正在幫您戴上極光灰隱眼... 視野瞬間變清晰了！");
            document.getElementById('blurry-zone').classList.add('clear');
            this.state.contactsVerified = true;
            ui.closeModal('verify-modal');
        } else {
            this.stats.wrongSelections++;
            alert("別裝了你根本就是陷阱妹！認真選！");
        }
    },

    // 2. 密碼按鍵盤邏輯
    askPassword() {
        if (!this.state.contactsVerified) {
            alert("眼睛太乾了看不清楚密碼... 先去驗證身分戴隱眼吧！");
            return;
        }
        this.clearPassword();
        ui.openModal('keypad-modal');
    },

    inputPassword(num) {
        if (this.state.passwordInput.length < 4) {
            this.state.passwordInput += num;
            this.updateKeypadDisplay();
        }

        if (this.state.passwordInput.length === 4) {
            setTimeout(() => {
                if (this.state.passwordInput === "6767") {
                    ui.closeModal('keypad-modal');
                    ui.openModal('album-modal');
                } else {
                    alert("密碼錯誤！超可憐。");
                    this.clearPassword();
                }
            }, 300);
        }
    },

    clearPassword() {
        this.state.passwordInput = "";
        this.updateKeypadDisplay();
    },

    updateKeypadDisplay() {
        const display = document.getElementById('keypad-display');
        if (display) {
            display.innerText = this.state.passwordInput.padEnd(4, "-");
        }
    },

    // 3. 拾取白襪
    collectSock() {
        if (this.state.hasSocks) {
            alert("你口袋已經塞了一雙襪子了，別太貪心！");
        } else {
            this.state.hasSocks = true;
            this.stats.socksCollected++;
            localStorage.setItem('jason_socks_collected', 'true');
            alert("✨ 您已獲得道具：Jason 的nike白襪 x 1 ✨\n已經放進你的口袋裡了，請珍惜。");
        }
        ui.closeModal('album-modal');
    },

    // 4. 兌換禮物
    redeemGift() {
        if (this.state.hasSocks) {
            ui.showFinalSurprise();
        } else {
            alert("資格不符！你需要值錢的東西才能兌換。去黑歷史相簿裡找找。");
        }
    },

    // 5. 抽籤邏輯
    drawFortune() {
        const box = document.getElementById('fortune-box');
        if (!box || box.classList.contains('shaking')) return;

        this.stats.drawCounts++;
        box.classList.add('shaking');
        
        setTimeout(() => {
            box.classList.remove('shaking');
            box.style.display = 'none';
            
            const totalWeight = this.fortunes.reduce((sum, f) => sum + f.weight, 0);
            let random = Math.random() * totalWeight;
            let selected = this.fortunes[this.fortunes.length - 1];

            for (const f of this.fortunes) {
                if (random < f.weight) {
                    selected = f;
                    break;
                }
                random -= f.weight;
            }

            const resultDiv = document.getElementById('fortune-result');
            const resultImg = document.getElementById('fortune-img');
            const resultDesc = document.getElementById('fortune-desc');

            if (resultImg && resultDesc && resultDiv) {
                resultImg.src = selected.img;
                resultDesc.innerText = `【${selected.label}】\n${selected.desc}`;
                resultDiv.style.display = 'block';
                resultDiv.classList.add('fade-in');

                if (selected.label === '大吉') {
                    ui.createConfetti(100);
                } else if (selected.label === '大凶') {
                    document.body.classList.add('great-bad-effect');
                    setTimeout(() => document.body.classList.remove('great-bad-effect'), 3000);
                }
            }
        }, 1200);
    }
};

const ui = {
    openModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    },

    closeModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    },

    showFinalSurprise() {
        const finalPage = document.getElementById('final-surprise');
        if (!finalPage) return;

        finalPage.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        const durationSeconds = Math.floor((Date.now() - game.stats.startTime) / 1000);
        const minutes = Math.floor(durationSeconds / 60);
        const seconds = durationSeconds % 60;
        const durationStr = minutes > 0 ? `${minutes}分${seconds}秒` : `${seconds}秒`;

        const blessingText = document.querySelector('.blessing-text');
        if (blessingText) {
            const oldRecord = blessingText.querySelector('.stats-record');
            if (oldRecord) oldRecord.remove();

            const statsDiv = document.createElement('div');
            statsDiv.className = 'stats-record';
            statsDiv.style.marginTop = '20px';
            statsDiv.style.paddingTop = '10px';
            statsDiv.style.borderTop = '1px dashed #ccc';
            statsDiv.style.color = '#666';
            statsDiv.style.fontSize = '0.85rem';
            statsDiv.innerHTML = `
                <p><strong>【 沒有意義的紀錄 】</strong></p>
                <ul>
                    <li>【明明知道答案但硬要選錯】第一關選錯次數：${game.stats.wrongSelections} 次</li>
                    <li>【我真的要去賣襪子...】第二關襪子領取次數：${game.stats.socksCollected} 次</li>
                    <li>【你覺得抽比較多次會比較幸運？】抽籤次數：${game.stats.drawCounts} 次</li>
                    <li> 本次網站總遊玩時長：${durationStr}</li>
                </ul>
            `;
            blessingText.appendChild(statsDiv);
        }

        const restartBtn = document.querySelector('.retro-btn');
        if (restartBtn) {
            restartBtn.onclick = () => {
                finalPage.style.display = 'none';
                document.body.style.overflow = 'auto';
            };
        }
        this.createConfetti(50);
    },

    resetFortune() {
        const box = document.getElementById('fortune-box');
        const result = document.getElementById('fortune-result');
        if (box && result) {
            box.style.display = 'flex';
            result.style.display = 'none';
        }
    },

    createConfetti(count = 50) {
        for(let i=0; i<count; i++) {
            setTimeout(() => {
                const c = document.createElement('div');
                c.innerHTML = "🎂";
                c.style.position = 'fixed';
                c.style.left = Math.random() * 100 + 'vw';
                c.style.top = '-50px';
                c.style.fontSize = '24px';
                c.style.zIndex = '10000';
                c.style.pointerEvents = 'none';
                c.style.transition = 'transform 3s linear';
                document.body.appendChild(c);
                
                setTimeout(() => {
                    c.style.transform = `translateY(110vh) rotate(${Math.random() * 360}deg)`;
                }, 100);
                
                setTimeout(() => c.remove(), 4000);
            }, i * 50);
        }
    }
};

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(m => m.style.display = 'none');
        document.body.style.overflow = 'auto';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    game.init();
});
