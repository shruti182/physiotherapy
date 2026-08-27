/* ============================================================
   REUSABLE gradeTest() FUNCTION — paste-and-replace snippet
   ============================================================
   Drop this in to replace the existing gradeTest() function in
   any new quiz HTML file built on the same template.

   Requirements for it to work out of the box:
   - quizData        : array of { q, opts: [...], ans: <index>, exp }
   - #result-box      : element that shows the final score
   - #submitBtn        : the submit button
   - Question blocks have id="qb-<index>" and explanations id="exp-<index>"
   - Radios are named "q<index>"

   This version reports the result to the parent page
   (course-detail.html) via postMessage so the score gets saved
   to Supabase. Do not remove the postMessage block at the end.
   ============================================================ */

function gradeTest(isAutoSubmit = false) {
  clearInterval(countdownInterval);
  document.querySelectorAll('input[type="radio"]').forEach(el => el.disabled = true);
  document.getElementById('submitBtn').disabled = true;

  let score = 0;
  const answersLog = [];

  quizData.forEach((item, index) => {
    const selected = document.querySelector(`input[name="q${index}"]:checked`);
    const block = document.getElementById(`qb-${index}`);
    const exp = document.getElementById(`exp-${index}`);
    exp.style.display = 'block';

    const selectedIndex = selected ? parseInt(selected.value) : null;
    const isCorrect = selectedIndex !== null && selectedIndex === item.ans;

    if (isCorrect) {
      score++;
      block.className = 'question-block correct-feedback';
    } else {
      block.className = 'question-block incorrect-feedback';
    }

    answersLog.push({
      question: item.q,
      student_answer: selectedIndex !== null ? item.opts[selectedIndex] : null,
      correct_answer: item.opts[item.ans],
      is_correct: isCorrect,
      marks_for_q: 1
    });
  });

  const res = document.getElementById('result-box');
  res.style.display = 'block';
  const pct = Math.round((score / quizData.length) * 100);
  res.style.backgroundColor = pct >= 50 ? '#e3fcef' : '#ffebe6';
  res.style.color = pct >= 50 ? '#006644' : '#bf2600';
  const statusPrefix = isAutoSubmit ? "Time's up! " : "";
  res.innerHTML = `${statusPrefix}Final Score: ${score} / ${quizData.length} (${pct}%)`;
  res.scrollIntoView({ behavior: 'smooth' });

  // ── Report result to parent page (do not remove) ──
  try {
    window.parent.postMessage({
      type: "TEST_COMPLETE",
      testId: window.PARENT_TEST_ID || null,
      score: score,
      totalMarks: quizData.length,
      answers: answersLog
    }, "*");
  } catch (err) {
    console.error("Could not report test result to parent page:", err);
  }
}
