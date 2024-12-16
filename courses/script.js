// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPACURk0fECwcx7mdnvgKvzoAwFIZ-wfc",
    authDomain: "authlearn-c0620.firebaseapp.com",
    projectId: "authlearn-c0620",
    storageBucket: "authlearn-c0620.appspot.com",
    messagingSenderId: "1057467852931",
    appId: "1:1057467852931:web:6b68ef4f55754653c753b6",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Toggle Dropdown
function toggleDropdown(id) {
  const dropdown = document.getElementById(id);
  dropdown.classList.toggle('hidden'); // Toggle hidden class

  // Update the dropdown arrow for the clicked header
  const button = dropdown.previousElementSibling.querySelector('.dropdown-btn');
  button.textContent = button.textContent === "▼" ? "▶" : "▼";

  // Fetch problems if the dropdown is opened
  if (!dropdown.classList.contains('hidden') && id === 'lec1-content') {
      fetchProblems('Array', 'lec1-content');
  } else if (!dropdown.classList.contains('hidden') && id === 'lec2-content') {
      fetchProblems('Tree', 'lec2-content');
  }
}

// Fetch Problems from Firestore
async function fetchProblems(category, contentId) {
  const container = document.getElementById(contentId);
  container.innerHTML = ''; // Clear previous content

  try {
      const querySnapshot = await db
          .collection('problems')
          .where('category', '==', category)
          .orderBy('order')
          .get();

      querySnapshot.forEach((doc) => {
          const data = doc.data();
          const topicElement = createTopicElement(data);
          container.appendChild(topicElement);
      });
  } catch (error) {
      console.error('Error fetching problems:', error);
  }
}

// Create Topic Element with Difficulty
function createTopicElement(problemData) {
  const topic = document.createElement('div');
  topic.classList.add('topic');

  // Checkbox
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = `topic-${problemData.id}`;
  topic.appendChild(checkbox);

  // Label
  const label = document.createElement('label');
  label.htmlFor = `topic-${problemData.id}`;
  label.textContent = problemData.title;
  topic.appendChild(label);

  // Difficulty
  const difficulty = document.createElement('span');
  difficulty.classList.add('difficulty');
  difficulty.textContent = problemData.difficulty || 'Unknown';
  if (problemData.difficulty === 'Easy') {
      difficulty.style.color = 'green';
  } else if (problemData.difficulty === 'Medium') {
      difficulty.style.color = 'orange';
  } else if (problemData.difficulty === 'Hard') {
      difficulty.style.color = 'red';
  }
  topic.appendChild(difficulty);

  // Links container
  const links = document.createElement('div');
  links.classList.add('links');

  // Article link
  const articleLink = document.createElement('a');
  articleLink.href = '#';
  articleLink.textContent = '📄 Article';
  articleLink.onclick = () => generateArticle(problemData.title);
  links.appendChild(articleLink);

  // YouTube search link
  const youtubeLink = document.createElement('a');
  youtubeLink.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(problemData.title)}`;
  youtubeLink.textContent = '📹 YouTube';
  youtubeLink.target = '_blank';
  links.appendChild(youtubeLink);

  // Practice link
  const practiceLink = document.createElement('a');
  practiceLink.href = problemData.link || '#';
  practiceLink.textContent = '📝 Practice';
  links.appendChild(practiceLink);

  topic.appendChild(links);
  return topic;
}
async function generateArticle(problemTitle) {
  const apiKey = "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"; // Replace with your actual OpenAI API key
  const url = "https://api.openai.com/v1/chat/completions";

  const payload = {
      model: "gpt-3.5-turbo",
      messages: [
          {
              role: "system",
              content: "You are an assistant that writes detailed articles."
          },
          {
              role: "user",
              content: `Write an article on the topic: "${problemTitle}". The article should explain the topic in detail and provide examples.`
          }
      ],
      max_tokens: 600,
      temperature: 0.7,
  };

  try {
      const response = await fetch(url, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(payload),
      });

      if (!response.ok) {
          const errorData = await response.json();
          console.error("OpenAI API Error:", errorData);
          alert(`OpenAI API Error: ${errorData.error.message}`);
          return;
      }

      const data = await response.json();
      console.log("OpenAI API Response:", data);

      if (data.choices && data.choices.length > 0) {
          const article = data.choices[0].message.content.trim();
          alert(`Generated Article for "${problemTitle}":\n\n${article}`);
      } else {
          alert("No article could be generated. Please try again later.");
      }
  } catch (error) {
      console.error("Error generating article:", error);
      alert(`Error occurred: ${error.message}`);
  }
}
