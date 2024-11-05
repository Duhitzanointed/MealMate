

function goToPage() {
    // Get the input field values
    const username = document.getElementById('username').value.trim();

    // Check if the username field is filled out
    if (username) {
        // Store the username in localStorage
        localStorage.setItem('username', username);

        // Redirect to the chatbot page
        window.location.href = "chatbot.html";
    } else {
        // Show an alert if the username is missing
        alert('Please enter your username before submitting! <3');
    }
}

