from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app) 
OLLAMA = "http://localhost:11434/api/generate"
    

def openai_test(content):
    client = OpenAI()

    assistant = client.beta.assistants.create(
        name="Summarizer",
        instructions="You are a professional summarizer. You will receive a list of titles and a list of paragraph froma web page and you will provide a summary in less than 500 words",
        model="gpt-4o-mini",
    )

    thread = client.beta.threads.create()

    message = client.beta.threads.messages.create(
        thread_id=thread.id,
        role="user",
        content=f"content: {content}"

    )

    run = client.beta.threads.runs.create_and_poll(
        thread_id=thread.id,
        assistant_id=assistant.id,
        instructions="answer only with the summary of max 100 words"
    )

    if run.status != 'completed': 
        raise Exception(f'Could not retreive openai response, status: {run.status}')


    messages = client.beta.threads.messages.list(
        thread_id=thread.id
    )
    answer = []
    for thread_message in messages.data[0:1]:
        for content_item in thread_message.content:
            answer.append(content_item.text.value)        
    return answer


 
@app.route('/summarize', methods=['POST'])
def summarize():
    data = request.json
    res = data.get('res')
    print("Loading response...")
    response = openai_test(res)

    return jsonify({"status": "success", "message": "HTML received", "response": response})


if __name__ == '__main__':
    app.run(debug=True, port=5555)
