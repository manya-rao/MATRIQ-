// EduWealth AI - Financial Academy & Gamification Module
// Interactive bite-sized courses, lessons, real-time quizzes, XP, and badge milestones

class AcademyManager {
  constructor() {
    this.activeCourseId = null;
    this.activeQuizState = null;
  }

  render(containerId = 'academy-view') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const state = window.eduState.getState();
    const courses = state.courses;
    const user = state.user;
    const badges = state.badges;

    const totalXP = user.learningScore;
    const completedCount = courses.filter(c => c.completed).length;
    const overallProgress = Math.round((completedCount / courses.length) * 100);

    container.innerHTML = `
      <div class="space-y-6 animate-fade-in">
        <!-- Header & XP Score Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-2xl md:text-3xl font-bold tracking-tight">Financial Academy 🎓</h2>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Level ${user.levelNumber}: ${user.levelName}
              </span>
            </div>
            <p class="text-sm text-slate-400 mt-1">Transform financial knowledge into wealth-building confidence through bite-sized lessons.</p>
          </div>
          
          <!-- XP Counter Badge -->
          <div class="card-fintech px-5 py-3 flex items-center gap-4 border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 to-purple-950/40">
            <div class="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xl font-bold">
              ⚡
            </div>
            <div>
              <span class="text-xs uppercase font-semibold text-slate-400 tracking-wider">Learning Score</span>
              <div class="text-2xl font-black text-amber-300">${totalXP} <span class="text-xs font-normal text-slate-400">XP</span></div>
            </div>
          </div>
        </div>

        <!-- Progress Overview Bar -->
        <div class="card-fintech p-5">
          <div class="flex items-center justify-between text-sm mb-2">
            <span class="font-semibold text-slate-200">Academy Completion Status</span>
            <span class="text-emerald-400 font-bold">${completedCount} of ${courses.length} Modules Mastered (${overallProgress}%)</span>
          </div>
          <div class="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
            <div class="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-500" style="width: ${overallProgress}%;"></div>
          </div>
        </div>

        <!-- Badges Showcase -->
        <div class="card-fintech p-5">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="font-bold text-base text-white flex items-center gap-2">
                <span>🏆</span> Student Wealth Badges
              </h3>
              <p class="text-xs text-slate-400">Earn badges as you master financial concepts and practice healthy habits</p>
            </div>
            <span class="text-xs text-slate-400 font-medium">${badges.filter(b => b.unlocked).length} / ${badges.length} Unlocked</span>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            ${badges.map(b => `
              <div class="p-3.5 rounded-xl border ${b.unlocked ? 'bg-indigo-950/30 border-indigo-500/40 text-slate-200' : 'bg-slate-900/40 border-slate-800/80 opacity-50 text-slate-500'} flex flex-col items-center text-center transition-all hover:scale-105">
                <span class="text-3xl mb-1">${b.icon}</span>
                <span class="font-bold text-xs text-white">${b.name}</span>
                <span class="text-[10px] text-slate-400 mt-1 leading-tight line-clamp-2">${b.desc}</span>
                <span class="text-[9px] mt-2 px-2 py-0.5 rounded-full ${b.unlocked ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'}">
                  ${b.unlocked ? 'Unlocked' : 'Locked'}
                </span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 6 Courses Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${courses.map(course => this.renderCourseCard(course)).join('')}
        </div>
      </div>
    `;

    this.bindEvents(container);
    if (window.lucide) window.lucide.createIcons();
  }

  renderCourseCard(course) {
    return `
      <div class="card-fintech p-6 flex flex-col justify-between relative overflow-hidden border border-slate-800 hover:border-indigo-500/50 transition-all group">
        ${course.completed ? `
          <div class="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1 border border-emerald-500/30">
            <i data-lucide="check-circle" class="w-3.5 h-3.5"></i> Completed
          </div>
        ` : `
          <div class="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs font-medium border border-slate-700">
            ${course.progress}%
          </div>
        `}

        <div>
          <div class="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
            <i data-lucide="${course.icon}" class="w-6 h-6"></i>
          </div>
          <span class="text-xs uppercase tracking-wider font-semibold text-indigo-400">${course.category} • ${course.level}</span>
          <h3 class="text-xl font-bold text-white mt-1 mb-2">${course.title}</h3>
          <p class="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">${course.description}</p>
        </div>

        <div>
          <!-- Mini lessons count & reward -->
          <div class="flex items-center justify-between text-xs text-slate-400 py-3 border-t border-slate-800/80 mb-4">
            <span class="flex items-center gap-1">
              <i data-lucide="book-open" class="w-3.5 h-3.5"></i> ${course.lessons.length} Lessons
            </span>
            <span class="flex items-center gap-1 text-amber-400 font-semibold">
              ⚡ +${course.xp} XP
            </span>
          </div>

          <!-- Action Buttons -->
          <div class="grid grid-cols-2 gap-2">
            <button class="btn-read-course w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-1.5" data-id="${course.id}">
              <i data-lucide="book-marked" class="w-3.5 h-3.5"></i> Read Lessons
            </button>
            <button class="btn-take-quiz w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm" data-id="${course.id}">
              <i data-lucide="help-circle" class="w-3.5 h-3.5"></i> Take Quiz
            </button>
          </div>
        </div>
      </div>
    `;
  }

  openLessonModal(courseId) {
    const state = window.eduState.getState();
    const course = state.courses.find(c => c.id === courseId);
    if (!course) return;

    const modal = document.getElementById('modal-academy-lesson');
    if (!modal) return;

    modal.querySelector('#lesson-modal-title').textContent = course.title;
    modal.querySelector('#lesson-modal-category').textContent = `${course.category} • ${course.level} • Earn +${course.xp} XP`;
    
    const body = modal.querySelector('#lesson-modal-body');
    body.innerHTML = `
      <div class="space-y-6">
        <p class="text-sm text-slate-300 leading-relaxed">${course.description}</p>
        <div class="space-y-4">
          ${course.lessons.map((lesson, idx) => `
            <div class="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2">
              <div class="flex items-center justify-between">
                <h4 class="font-bold text-sm text-white flex items-center gap-2">
                  <span class="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center text-xs font-bold border border-indigo-500/40">
                    ${idx + 1}
                  </span>
                  ${lesson.title}
                </h4>
                <span class="text-xs text-slate-400 flex items-center gap-1">
                  <i data-lucide="clock" class="w-3 h-3"></i> ${lesson.duration}
                </span>
              </div>
              <p class="text-xs text-slate-300 leading-relaxed pl-8">${lesson.content}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    const btnQuiz = modal.querySelector('#btn-modal-start-quiz');
    if (btnQuiz) {
      btnQuiz.onclick = () => {
        window.eduApp.hideModal('modal-academy-lesson');
        this.openQuizModal(courseId);
      };
    }

    window.eduApp.showModal('modal-academy-lesson');
    if (window.lucide) window.lucide.createIcons();
  }

  openQuizModal(courseId) {
    const state = window.eduState.getState();
    const course = state.courses.find(c => c.id === courseId);
    if (!course || !course.quiz) return;

    this.activeCourseId = courseId;
    this.activeQuizState = {
      course,
      quiz: course.quiz,
      currentIndex: 0,
      userAnswers: [],
      score: 0
    };

    this.renderQuizStep();
    window.eduApp.showModal('modal-academy-quiz');
  }

  renderQuizStep() {
    const modal = document.getElementById('modal-academy-quiz');
    if (!modal || !this.activeQuizState) return;

    const { course, quiz, currentIndex, userAnswers } = this.activeQuizState;
    const currentQ = quiz.questions[currentIndex];
    const totalQ = quiz.questions.length;

    modal.querySelector('#quiz-modal-title').textContent = `${course.title} - Quiz`;
    modal.querySelector('#quiz-modal-progress').textContent = `Question ${currentIndex + 1} of ${totalQ}`;

    const body = modal.querySelector('#quiz-modal-body');
    body.innerHTML = `
      <div class="space-y-5">
        <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div class="bg-indigo-500 h-full rounded-full transition-all" style="width: ${((currentIndex + 1) / totalQ) * 100}%;"></div>
        </div>

        <h4 class="text-base font-bold text-white leading-snug">${currentQ.q}</h4>

        <div class="space-y-2.5" id="quiz-options-container">
          ${currentQ.options.map((opt, idx) => `
            <button class="quiz-option-btn w-full p-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 text-left text-sm text-slate-200 transition-all flex items-start gap-3" data-idx="${idx}">
              <span class="w-5 h-5 rounded-full border border-slate-500 flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                ${String.fromCharCode(65 + idx)}
              </span>
              <span>${opt}</span>
            </button>
          `).join('')}
        </div>

        <div id="quiz-explanation-box" class="hidden p-3.5 rounded-xl text-xs space-y-1"></div>
      </div>
    `;

    // Bind option selection
    const optionBtns = body.querySelectorAll('.quiz-option-btn');
    const explanationBox = body.querySelector('#quiz-explanation-box');

    optionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedIdx = parseInt(btn.getAttribute('data-idx'), 10);
        const isCorrect = selectedIdx === currentQ.answer;

        // Disable options
        optionBtns.forEach((b, i) => {
          b.disabled = true;
          if (i === currentQ.answer) {
            b.classList.remove('bg-slate-800/60', 'border-slate-700');
            b.classList.add('bg-emerald-500/20', 'border-emerald-500', 'text-emerald-300');
          } else if (i === selectedIdx && !isCorrect) {
            b.classList.remove('bg-slate-800/60', 'border-slate-700');
            b.classList.add('bg-rose-500/20', 'border-rose-500', 'text-rose-300');
          }
        });

        if (isCorrect) {
          this.activeQuizState.score++;
        }

        explanationBox.classList.remove('hidden');
        if (isCorrect) {
          explanationBox.className = 'p-3.5 rounded-xl text-xs bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 block';
          explanationBox.innerHTML = `<strong>✅ Correct!</strong> ${currentQ.explanation}`;
        } else {
          explanationBox.className = 'p-3.5 rounded-xl text-xs bg-rose-950/40 border border-rose-500/30 text-rose-300 block';
          explanationBox.innerHTML = `<strong>❌ Not quite.</strong> ${currentQ.explanation}`;
        }

        // Show Next / Finish button
        const footer = modal.querySelector('#quiz-modal-footer');
        footer.innerHTML = `
          <button id="btn-next-quiz-q" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md">
            ${currentIndex + 1 < totalQ ? 'Next Question →' : 'View Results 🎯'}
          </button>
        `;
        footer.querySelector('#btn-next-quiz-q').onclick = () => {
          if (currentIndex + 1 < totalQ) {
            this.activeQuizState.currentIndex++;
            this.renderQuizStep();
          } else {
            this.renderQuizResults();
          }
        };
      });
    });
  }

  renderQuizResults() {
    const modal = document.getElementById('modal-academy-quiz');
    if (!modal || !this.activeQuizState) return;

    const { course, quiz, score } = this.activeQuizState;
    const total = quiz.questions.length;
    const pct = Math.round((score / total) * 100);
    const passed = pct >= 66;

    if (passed) {
      window.eduState.completeQuiz(course.id, score, total);
      if (window.confetti) {
        window.confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }
    }

    const body = modal.querySelector('#quiz-modal-body');
    body.innerHTML = `
      <div class="text-center py-6 space-y-4">
        <div class="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-3xl ${passed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'}">
          ${passed ? '🎉' : '📖'}
        </div>
        <h3 class="text-2xl font-bold text-white">${passed ? 'Quiz Passed!' : 'Keep Learning!'}</h3>
        <p class="text-sm text-slate-300">
          You scored <strong class="text-white">${score} / ${total} (${pct}%)</strong> on ${course.title}.
        </p>
        ${passed ? `
          <div class="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-300 max-w-sm mx-auto">
            ⚡ <strong>+${course.xp} XP</strong> added to your Financial Learning Score! You are on your way to financial freedom.
          </div>
        ` : `
          <p class="text-xs text-slate-400 max-w-sm mx-auto">
            You need 66% to unlock the module completion bonus. Review the lessons and try again!
          </p>
        `}
      </div>
    `;

    const footer = modal.querySelector('#quiz-modal-footer');
    footer.innerHTML = `
      <button id="btn-close-quiz-done" class="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-all">
        Back to Academy
      </button>
    `;
    footer.querySelector('#btn-close-quiz-done').onclick = () => {
      window.eduApp.hideModal('modal-academy-quiz');
      this.render();
    };
  }

  bindEvents(container) {
    container.querySelectorAll('.btn-read-course').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.openLessonModal(id);
      });
    });

    container.querySelectorAll('.btn-take-quiz').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.openQuizModal(id);
      });
    });
  }
}

window.academyManager = new AcademyManager();
