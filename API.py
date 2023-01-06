# Using flask to make an api
# import necessary libraries and functions
from flask import Flask, jsonify, request, render_template

# creating a Flask app
app = Flask(__name__)


@app.route('/')
def hello():
    return 'Hello, World!'

@app.route('/home/<int:num>', methods=['GET'])
def disp(num):
    return jsonify({'data': num ** 2})


# driver function
if __name__ == '__main__':
    app.run(debug=True)
