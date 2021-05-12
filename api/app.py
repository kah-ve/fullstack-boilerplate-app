from flask import Flask, jsonify, make_response, request

import psycopg2
import sys
from flask_cors import CORS, cross_origin
import json

app = Flask(__name__)
CORS(app, support_credentials=True)
app.config["CORS_HEADERS"] = "Content-Type"


@app.route("/api/insert", methods=["POST"])
@cross_origin(origin="*", headers=["Content-Type", "Authorization"])
def insert_data():

    data = json.loads(request.data)
    print(data, file=sys.stderr)

    con = psycopg2.connect(
        database="campsite",
        user="postgres",
        password="password",
        host="db",
        port="5432",
    )
    cur = con.cursor()

    cur.execute("SELECT count(*) FROM student WHERE admission=10;")

    fetch_one = cur.fetchone()
    count = fetch_one[0]

    if count == 1:
        # Update
        cur.execute(
            f"""UPDATE student 
            SET name={data['name']}, 
            age={data['age']}, 
            course={data['course']}, 
            department={data['department']},
            WHERE admission={data['admission']};"""
        )
    else:
        # Insert
        cur.execute(
            f"""INSERT INTO student 
            VALUES ('{data['name']}', 
            {data['age']}, 
            '{data['course']}', 
            '{data['department']}',
            WHERE admission='{data['admission']}';"""
        )

    # print(, file=sys.stderr)

    return ""


@app.route("/api/getinfo", methods=["GET"])
@cross_origin(origin="*", headers=["Content-Type", "Authorization"])
def test_response():
    """Return a sample JSON response."""

    con = psycopg2.connect(
        database="campsite",
        user="postgres",
        password="password",
        host="db",
        port="5432",
    )

    print("Database opened successfully")

    cur = con.cursor()

    cur.execute(
        """CREATE TABLE IF NOT EXISTS STUDENT
            (ADMISSION INT PRIMARY KEY NOT NULL,
            NAME TEXT NOT NULL,
            AGE INT NOT NULL,
            COURSE CHAR(50),
            DEPARTMENT CHAR(50));"""
    )

    # cur.execute(
    #     """INSERT INTO STUDENT VALUES (10, 'John', 25, 'Math', 'Sciences');"""
    # )

    cur.execute("SELECT * FROM STUDENT;")
    # output = cur.fetchall()
    output = {}
    print(f"The output is {output}")

    con.commit()
    con.close()

    # output = make_response(jsonify(output))
    output = jsonify(output)
    return output


@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({"error": "Not found"}), 404)
