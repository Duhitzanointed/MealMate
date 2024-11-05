// Function to display the username in the header when the page loads
window.onload = function() {
    const username = localStorage.getItem('username');
    const usernameHeader = document.getElementById('username-header');
    
    if (username) {
        usernameHeader.innerText = `Welcome, ${username}!`;
    } 
};


// chatbot code
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
let userMessage = null;
const API_KEY = "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";
const inputInitHeight = chatInput.scrollHeight;

// List of keywords related to health, recipes, or meals
const relevantKeywords = ["health", "recipe", "meal", "nutrition", "cook", "diet", "ingredients", "food"];

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

const generateResponse = (chatElement) => {
    const API_URL = "https://api.groq.com/openai/v1/chat/completions";
    const messageElement = chatElement.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "llama3-8b-8192",
            messages: [{ role: "user", content: userMessage }],
        })
    }

    fetch(API_URL, requestOptions)
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                console.error("API Error:", data.error.message);
                throw new Error(data.error.message);
            }
            messageElement.textContent = data.choices[0].message.content.trim();
        })
        .catch((error) => {
            console.error("Fetch Error:", error);
            messageElement.classList.add("error");
            messageElement.textContent = "Hmmm..Something's not working";
        })
        .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

const isRelevantQuestion = (message) => {
    const lowerCaseMessage = message.toLowerCase();
    return relevantKeywords.some(keyword => lowerCaseMessage.includes(keyword));
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);

        if (isRelevantQuestion(userMessage)) {
            generateResponse(incomingChatLi);
        } else {
            // Provide a default response if the question is not relevant
            const defaultResponse = "I'm sorry, but I can only help with health, recipe, or meal-related questions.";
            incomingChatLi.querySelector("p").textContent = defaultResponse;
        }
    }, 600);
}

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
