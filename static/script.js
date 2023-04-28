const md = window.markdownit();

$(document).ready(function () {

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
                    'system_message': systemMessage,
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


    $('#save-chat').on('click', function () {
       fetch('/save')
        .then(response => response.json())
        .then(data => {
            console.log(data);
          const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
          const downloadUrl = URL.createObjectURL(jsonBlob);
          const downloadLink = document.createElement('a');
          downloadLink.href = downloadUrl;
          downloadLink.download = 'data.json';
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          URL.revokeObjectURL(downloadUrl);
    })
    .catch(error => console.error(error));
    });

    $('#load-chat').on('click', function () {
      const fileInput = document.getElementById('file-input');
      fileInput.click();
      fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function(event) {
          const json = event.target.result;
          loadChatRequest(json);
          loadJsonIntoForm(JSON.parse(json));
        };
        reader.readAsText(file);
      });
    });

    function loadChatRequest(json) {
      fetch('/load', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: json
      })
      .catch(error => console.error(error));
    }

    function loadJsonIntoForm(messages){
        const textarea = document.getElementById('system-message');
        textarea.value = messages[0]['content'];

        for (let i =1; i < messages.length; i++){
            addMessage(messages[i]['role'], messages[i]['content'])
        }
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
