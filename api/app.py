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
    print(f"The request data to insert: {data}", file=sys.stderr)

    con = psycopg2.connect(
        database="campsite",
        user="postgres",
        password="password",
        host="db",
        port="5432",
    )
    cur = con.cursor()
    cur.execute(
        f"""CREATE TABLE IF NOT EXISTS STUDENT"""
        f"""(ADMISSION INT PRIMARY KEY NOT NULL,"""
        f"""NAME TEXT NOT NULL,"""
        f"""AGE INT NOT NULL,"""
        f"""COURSE CHAR(50),"""
        f"""DEPARTMENT CHAR(50));"""
    )

    cur.execute(
        f"SELECT count(*) FROM student WHERE admission={data['admission']};"
    )

    fetch_one = cur.fetchone()
    count = fetch_one[0]
    print(f"The count of existing entries. {count}", file=sys.stderr)

    if count == 1:
        print(f"Updating only! Admission key already exists!", file=sys.stderr)

        # Update
        cur.execute(
            f"""UPDATE student """
            f"""SET name='{data['name']}',"""
            f"""age={data['age']},"""
            f"""course='{data['course']}',"""
            f"""department='{data['department']}' """
            f"""WHERE admission='{data['admission']}';"""
        )
    else:
        print(f"Inserting new entry!", file=sys.stderr)

        # Insert
        cur.execute(
            f"""INSERT INTO student"""
            f""" VALUES ("""
            f"""{data['admission']}, """
            f"""'{data['name']}',"""
            f"""{data['age']},"""
            f"""'{data['course']}',"""
            f"""'{data['department']}');"""
        )

    # print(, file=sys.stderr)
    con.commit()
    con.close()
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

    cur.execute("SELECT * FROM student;")
    output = cur.fetchall()
    print(f"The output is {output}", file=sys.stderr)

    con.commit()
    con.close()

    # output = make_response(jsonify(output))
    output = jsonify(output)
    return output


@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({"error": "Not found"}), 404)
