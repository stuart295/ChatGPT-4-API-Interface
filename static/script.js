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

    function addMessage(sender, message) {
       let messageParagraph = $('<p>');

        message = md.render(message);

        messageParagraph.html("<b>"+ sender + "</b><br>" + message);
        $('#chat-area').append(messageParagraph);
        $('#chat-area').scrollTop($('#chat-area')[0].scrollHeight);
    }
});
