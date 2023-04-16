from pathlib import Path
import openai

from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

SECRETS_FILE = 'secrets.txt'
secrets_file_path = Path(SECRETS_FILE)

if not secrets_file_path.exists():
    raise FileNotFoundError(f"Secrets file '{SECRETS_FILE}' not found.")

with open(SECRETS_FILE, 'r') as f:
    API_KEY = f.read().strip()

if not API_KEY:
    raise ValueError("API key not found in secrets file.")

# Set the OpenAI API key
openai.api_key = API_KEY


@app.route('/')
def index():
    return render_template('index.html')


def ask_gpt4(messages):
    data = {
        'model': 'gpt-4',  # Update this with the correct model name when GPT-4 is available
        'messages': messages
    }
    response = openai.ChatCompletion.create(**data)
    return response

conversation = [{'role': 'system', 'content': 'You are ChatGPT, a large language model trained by OpenAI, based on the GPT-4 architecture.'}]


@app.route('/ask', methods=['POST'])
def ask():
    user_input = request.form['user_input']
    system_message = request.form['system_message']
    user_message = {'role': 'user', 'content': user_input}

    conversation = [{'role': 'system', 'content': system_message}]
    conversation.append(user_message)

    response = ask_gpt4(conversation)
    gpt4_response = response['choices'][0]['message']['content'].strip()
    assistant_message = {'role': 'assistant', 'content': gpt4_response}
    conversation.append(assistant_message)

    return jsonify({'response': gpt4_response})


if __name__ == '__main__':
    app.run(debug=True)
