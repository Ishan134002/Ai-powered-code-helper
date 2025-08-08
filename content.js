

// Try to extract the problem statement from common coding platforms
function extractProblemStatement() {
  let statement = '';

  // LeetCode (new UI)
  const leetcodeNew = document.querySelector('[data-track-load="description_content"]');
  if (leetcodeNew) {
    statement = leetcodeNew.innerText;
  }

  // LeetCode (old UI)
  if (!statement) {
    const leetcodeOld = document.querySelector('.question-content, .content__u3I1.question-content__JfgR');
    if (leetcodeOld) {
      statement = leetcodeOld.innerText;
    }
  }

  // Codeforces
  if (!statement) {
    const cfStatement = document.querySelector('.problem-statement');
    if (cfStatement) {
      statement = cfStatement.innerText;
    }
  }

  // AtCoder
  if (!statement) {
    const atcoderStatement = document.querySelector('.lang-en .part');
    if (atcoderStatement) {
      statement = atcoderStatement.innerText;
    }
  }

  // HackerRank
  if (!statement) {
    const hrStatement = document.querySelector('.problem-statement .challenge_problem_statement .msB');
    if (hrStatement) {
      statement = hrStatement.innerText;
    }
  }

  // Fallback: try to get the main content
  if (!statement) {
    const main = document.querySelector('main');
    if (main) {
      statement = main.innerText;
    }
  }

  // Final fallback: get the largest <div> with lots of text
  if (!statement) {
    let maxLen = 0;
    let bestDiv = null;
    document.querySelectorAll('div').forEach(div => {
      if (div.innerText && div.innerText.length > maxLen) {
        maxLen = div.innerText.length;
        bestDiv = div;
      }
    });
    if (bestDiv) {
      statement = bestDiv.innerText;
    }
  }

  return statement.trim();
}

const problemStatement = extractProblemStatement();
if (problemStatement) {
  chrome.storage.local.set({ problemStatement });
}
