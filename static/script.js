const md = window.markdownit();

$(document).ready(function () {


     // Add the following event listener for the 'Set System Message' button
    $('#set-system-message').on('click', function () {
    let systemMessage = $('#system-message').val().trim().replace(/\s\s+/g, ' ');
    if (systemMessage) {
        $('.system-message p').text(systemMessage);
    }
});

    //Submit
    $('#chat-form').on('submit', function (e) {
    e.preventDefault();
    let userInput = $('#user-input').val().trim();
    let systemMessage = $('#system-message').val().trim();

    if (userInput) {
        addMessage('user', userInput);

        $.ajax({
            type: 'POST',
            url: '/ask',
            data: {
                'user_input': userInput,
                'system_message': systemMessage,  // Add the system message to the request data
            },
            success: function (data) {
                addMessage('gpt-4', data.response);
            },
            error: function () {
                addMessage('system', 'Error: Unable to get a response from the server.');
            },
        });

        $('#user-input').val('');
    }
});

    function addMessage(role, message) {
        // Wrap the sender in a span element with a class 'sender'
        var sender = $('<span>').addClass('sender').text(role + ': ');

        // Convert the message content from Markdown to HTML
        var messageHtml = md.render(message);

        // Wrap the message in a span element with a class 'message-content'
        var messageContent = $('<span>').addClass('message-content').html(messageHtml);

        // Create a new div element for the message and append the sender and message content
        var newMessage = $('<div>').addClass('message ' + role).append(sender).append(messageContent);

        // Add the new message to the chat area and scroll to the bottom
        $('#chat-area').append(newMessage);
        $('#chat-area').scrollTop($('#chat-area')[0].scrollHeight);
    }

     $('#user-input').on('keydown', function(e) {
        // Check if the Enter key is pressed
        if (e.key === 'Enter') {
            if (!e.shiftKey) {
                e.preventDefault();

                $('#chat-form').submit();
            }
        }
    });
});
