document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("fetch-hints").addEventListener("click", fetchHints);

  async function fetchHints() {
    chrome.tabs.query(
      { active: true, currentWindow: true },
      async function (tabs) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id },
            func: () => {
              // Extraction logic (same as improved content.js)
              let statement = '';
              const leetcodeNew = document.querySelector('[data-track-load="description_content"]');
              if (leetcodeNew) statement = leetcodeNew.innerText;
              if (!statement) {
                const leetcodeOld = document.querySelector('.question-content, .content__u3I1.question-content__JfgR');
                if (leetcodeOld) statement = leetcodeOld.innerText;
              }
              if (!statement) {
                const cfStatement = document.querySelector('.problem-statement');
                if (cfStatement) statement = cfStatement.innerText;
              }
              if (!statement) {
                const atcoderStatement = document.querySelector('.lang-en .part');
                if (atcoderStatement) statement = atcoderStatement.innerText;
              }
              if (!statement) {
                const hrStatement = document.querySelector('.problem-statement .challenge_problem_statement .msB');
                if (hrStatement) statement = hrStatement.innerText;
              }
              if (!statement) {
                const main = document.querySelector('main');
                if (main) statement = main.innerText;
              }
              if (!statement) {
                let maxLen = 0;
                let bestDiv = null;
                document.querySelectorAll('div').forEach(div => {
                  if (div.innerText && div.innerText.length > maxLen) {
                    maxLen = div.innerText.length;
                    bestDiv = div;
                  }
                });
                if (bestDiv) statement = bestDiv.innerText;
              }
              return statement.trim();
            },
          },
          async (injectionResults) => {
            const problemStatement = injectionResults[0].result;
            document.getElementById("problem-name").innerText =
              `Extracted Problem Statement:`;
            try {
              const response = await fetch("http://localhost:3000/getHints", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ problemName: problemStatement }),
              });
              if (response.ok) {
                const data = await response.json();
                const hintText = data.hint;
                const hintContainer = document.getElementById("hint-container");
                hintContainer.innerHTML = "";
                hintContainer.innerHTML = hintText;
              }
            } catch (error) {
              console.error("Error fetching hints:", error);
              document.getElementById("hint-container").innerHTML =
                "<div>Failed to fetch hints</div>";
            }
          }
        );
      }
    );
  }
});
