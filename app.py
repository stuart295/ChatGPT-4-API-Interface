import openai
from pathlib import Path
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

SECRETS_FILE = 'secrets.txt'

def load_api_key(file_path: Path) -> str:
    if not file_path.exists():
        raise FileNotFoundError(f"Secrets file '{file_path}' not found.")

    with file_path.open('r') as f:
        api_key = f.read().strip()

    if not api_key:
        raise ValueError("API key not found in secrets file.")

    return api_key

openai.api_key = load_api_key(Path(SECRETS_FILE))

@app.route('/')
def index():
    return render_template('index.html')

def ask_gpt4(messages):
    data = {
        'model': 'gpt-4',
        'messages': messages
    }
    return openai.ChatCompletion.create(**data)

@app.route('/ask', methods=['POST'])
def ask():
    user_input = request.form['user_input']
    system_message = request.form['system_message']
    conversation = [
        {'role': 'system', 'content': system_message},
        {'role': 'user', 'content': user_input}
    ]

    response = ask_gpt4(conversation)
    gpt4_response = response['choices'][0]['message']['content'].strip()
    return jsonify({'response': gpt4_response})

if __name__ == '__main__':
    app.run(debug=True)