// EduWealth AI - AI Financial Coach Module
// Context-aware student financial assistant with simulation calculations and guardrails

class AICoach {
  constructor() {
    this.isTyping = false;
    this.messages = [];
    this.init();
  }

  init() {
    // Initial welcome message if not already present
    const state = window.eduState.getState();
    this.messages = state.chatMessages || [
      {
        sender: 'ai',
        text: `Hello ${state.user.name}! 👋 I am **EduWealth AI Coach**, your personal guide to financial confidence and smart wealth-building. Ask me anything about your current budget, how to cut expenses, reach your goals, or practice investing safely!`,
        timestamp: '10:00 AM'
      }
    ];
  }

  getQuickPrompts() {
    return [
      { label: '📊 Analyze my spending', query: 'Analyze my spending' },
      { label: '💰 Why am I not saving enough?', query: 'Why am I not saving enough?' },
      { label: '🎯 How can I reach ₹1 lakh?', query: 'How can I reach ₹1 lakh?' },
      { label: '📐 Create my budget', query: 'Create my budget' },
      { label: '🚀 Explain investing', query: 'Explain investing' },
      { label: '🛡️ Teach me about scams', query: 'Teach me about scams' }
    ];
  }

  async handleUserQuery(queryText, onChunk, onComplete) {
    if (this.isTyping || !queryText.trim()) return;
    this.isTyping = true;

    const userMessage = {
      sender: 'user',
      text: queryText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    this.messages.push(userMessage);

    // Generate intelligent contextual response
    const responseText = this.generateResponse(queryText.trim());

    // Create temporary AI message placeholder
    const aiMessage = {
      sender: 'ai',
      text: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    this.messages.push(aiMessage);

    // Simulate streaming / typewriter effect
    let currentIdx = 0;
    const words = responseText.split(' ');
    const interval = setInterval(() => {
      if (currentIdx < words.length) {
        aiMessage.text = words.slice(0, currentIdx + 1).join(' ');
        if (onChunk) onChunk(aiMessage.text);
        currentIdx++;
      } else {
        clearInterval(interval);
        this.isTyping = false;
        // Save to state
        window.eduState.state.chatMessages = this.messages;
        window.eduState.saveState();
        if (onComplete) onComplete(aiMessage.text);
      }
    }, 40);
  }

  generateResponse(query) {
    const state = window.eduState.getState();
    const user = state.user;
    const q = query.toLowerCase();

    const income = user.monthlyIncome || 15000;
    const expenses = user.monthlyExpenses || 6000;
    const savings = user.currentSavings || 9000;
    const savingsRate = Math.round((savings / income) * 100);

    const expenseCategories = window.eduState.getExpensesByCategory();
    const foodSpend = expenseCategories['Food'] || 0;
    const shoppingSpend = expenseCategories['Shopping'] || 0;
    const travelSpend = expenseCategories['Travel'] || 0;

    // Discretionary calculation
    const discretionary = shoppingSpend + (expenseCategories['Entertainment'] || 0) + (expenseCategories['Other'] || 0);

    // 1. "Why am I not saving enough?"
    if (q.includes('not saving enough') || q.includes('save more') || q.includes('save enough')) {
      return `Based on your current monthly records, your income is **₹${income.toLocaleString('en-IN')}** and you spend **₹${expenses.toLocaleString('en-IN')}**, leaving a healthy **₹${savings.toLocaleString('en-IN')}** (${savingsRate}% savings rate).\n\nHowever, approximately **₹${discretionary.toLocaleString('en-IN')}** goes toward discretionary purchases (like Shopping and Other). Trimming this discretionary spending by just **₹1,000/month** would boost your annual savings by **₹12,000** without sacrificing core needs!\n\n💡 *Action Tip:* Try the **30-Day Rule** before purchasing non-essential items over ₹1,000.`;
    }

    // 2. "How can I reach ₹1 lakh?"
    if (q.includes('1 lakh') || q.includes('1,00,000') || q.includes('reach 100000') || q.includes('reach my goal')) {
      const primaryGoal = state.goals.find(g => g.isPrimary) || state.goals[0];
      const target = primaryGoal ? primaryGoal.targetAmount : 100000;
      const current = primaryGoal ? primaryGoal.currentAmount : 20000;
      const months = primaryGoal ? primaryGoal.deadlineMonths : 24;
      const remaining = Math.max(0, target - current);
      const monthlyNeeded = Math.ceil(remaining / months);

      return `Great target! Here is your personalized milestone breakdown:\n\n` +
        `• **Target Amount:** ₹${target.toLocaleString('en-IN')}\n` +
        `• **Current Progress:** ₹${current.toLocaleString('en-IN')} (${Math.round((current / target) * 100)}%)\n` +
        `• **Remaining Gap:** ₹${remaining.toLocaleString('en-IN')}\n` +
        `• **Timeline:** ${months} months\n\n` +
        `To reach **₹${target.toLocaleString('en-IN')}** in ${months} months, you need to save approximately **₹${monthlyNeeded.toLocaleString('en-IN')} per month**.\n\n` +
        `Since your current monthly surplus is **₹${savings.toLocaleString('en-IN')}**, you are **fully capable of reaching this ahead of schedule**! Consider allocating ₹3,500/month to your goal and building an emergency cushion with the remainder.`;
    }

    // 3. "Analyze my spending"
    if (q.includes('analyze') || q.includes('spending') || q.includes('breakdown')) {
      let largestCategory = 'Food';
      let maxVal = 0;
      for (const [cat, val] of Object.entries(expenseCategories)) {
        if (val > maxVal) {
          maxVal = val;
          largestCategory = cat;
        }
      }

      return `Here is your spending analysis for this month:\n\n` +
        `• **Total Outflow:** ₹${expenses.toLocaleString('en-IN')} (${Math.round((expenses / income) * 100)}% of income)\n` +
        `• **Top Category:** **${largestCategory}** at ₹${maxVal.toLocaleString('en-IN')} (${Math.round((maxVal / expenses) * 100)}% of total spend)\n` +
        `• **Travel & Transit:** ₹${travelSpend.toLocaleString('en-IN')}\n` +
        `• **Shopping / Supplies:** ₹${shoppingSpend.toLocaleString('en-IN')}\n\n` +
        `💡 *AI Observation:* Your food expenses represent the largest share of your budget. Preparing snacks in the hostel or utilizing campus meal plans could comfortably liberate ₹500–₹800/month!`;
    }

    // 4. "Create my budget" / 50/30/20
    if (q.includes('budget') || q.includes('create budget') || q.includes('50/30/20')) {
      const recNeeds = Math.round(income * 0.50);
      const recWants = Math.round(income * 0.20);
      const recSavings = Math.round(income * 0.20);
      const recEmergency = Math.round(income * 0.10);

      return `Here is an optimal **Student Wealth Budget** tailored for your ₹${income.toLocaleString('en-IN')} monthly income:\n\n` +
        `1. **Needs (50%):** ₹${recNeeds.toLocaleString('en-IN')} (Hostel, mess food, tuition supplies, travel)\n` +
        `2. **Wants (20%):** ₹${recWants.toLocaleString('en-IN')} (Hangouts, weekend outings, hobby spending)\n` +
        `3. **Long-Term Savings (20%):** ₹${recSavings.toLocaleString('en-IN')} (Targeted wealth milestones & index funds)\n` +
        `4. **Emergency Fund (10%):** ₹${recEmergency.toLocaleString('en-IN')} (Liquid buffer for unforeseen medical or tech repairs)\n\n` +
        `You can customize these sliders on the **Smart Budget** page!`;
    }

    // 5. "Explain investing" / Stocks / Mutual Funds
    if (q.includes('invest') || q.includes('stock') || q.includes('mutual fund') || q.includes('crypto')) {
      return `Here is the student roadmap to understanding investments:\n\n` +
        `1. **Emergency Buffer First:** Always retain 3–6 months of living expenses in an accessible savings account before investing.\n` +
        `2. **Broad Index Funds:** Rather than gambling on individual hype stocks, index funds let you own a slice of top 50 national companies at very low expense.\n` +
        `3. **Risk vs. Return:** Higher potential return always comes with higher volatility. Never invest money you will need in the next 12 months in the stock market.\n` +
        `4. **Hands-On Practice:** Try our virtual **Investment Simulator** to practice buying fictional assets with ₹10,000 in virtual funds without risking real money!\n\n` +
        `⚠️ *Educational Reminder:* EduWealth AI is an educational platform and never provides personalized real-money stock tips or advice.`;
    }

    // 6. "Teach me about scams" / Safety
    if (q.includes('scam') || q.includes('safe') || q.includes('fraud') || q.includes('phishing')) {
      return `🛡️ **Golden Rules of Student Financial Protection:**\n\n` +
        `• **Rule 1 (UPI PIN):** You **NEVER** enter your UPI PIN to receive money or scholarships. PIN is only for debiting funds.\n` +
        `• **Rule 2 (Guaranteed Returns):** Anyone offering "guaranteed 50% profit in 24 hours" on Telegram or WhatsApp is running a scam.\n` +
        `• **Rule 3 (Instant Loan Apps):** Avoid unverified lending apps requesting phone contact permissions.\n` +
        `• **Rule 4 (Emergency Helpline):** In case of any cyber financial fraud, report immediately to **1930** (cybercrime.gov.in).\n\n` +
        `Play the interactive **Can You Spot the Scam?** challenge in the Financial Safety Center to test your skills!`;
    }

    // 7. General student financial query
    return `That's a thoughtful question about student wealth building! Here's how to think about it systematically:\n\n` +
      `With your current monthly income of **₹${income.toLocaleString('en-IN')}** and expenses of **₹${expenses.toLocaleString('en-IN')}**, you are generating a surplus of **₹${savings.toLocaleString('en-IN')}** every month.\n\n` +
      `• **Immediate Action:** Direct at least ₹3,000 into your **${user.primaryGoal || 'Primary Goal'}**.\n` +
      `• **Discipline:** Keep non-essential outlays within ₹2,500/month.\n` +
      `• **Knowledge:** Complete the daily lessons in the **Financial Academy** to level up your Financial Health Score (currently ${user.healthScore}/100).\n\n` +
      `Would you like me to show you how small daily habits or our EcoWealth module can help you unlock an extra ₹500/month?`;
  }
}

window.eduCoach = new AICoach();
