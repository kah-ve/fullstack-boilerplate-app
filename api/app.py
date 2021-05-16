from flask import Flask, jsonify, make_response, request

import psycopg2
import sys
from flask_cors import CORS, cross_origin
import json

app = Flask(__name__)
CORS(app, support_credentials=True)
app.config["CORS_HEADERS"] = "Content-Type"


class db_conn:
    table_created = False
    table_name = "weather"

    @classmethod
    def get_connection(cls):
        print(f"Opening connection...", file=sys.stderr)

        con = psycopg2.connect(
            database="weather_db",
            user="postgres",
            password="password",
            host="db",
            port="5432",
        )

        return con

    @classmethod
    def create_table(cls):
        print(f"Creating the table...", file=sys.stderr)

        con = db_conn.get_connection()

        with con:
            with con.cursor() as cur:
                cur.execute(
                    f"""CREATE TABLE IF NOT EXISTS {cls.table_name}"""
                    f"""(DATE INT PRIMARY KEY NOT NULL,"""
                    f"""TEMPERATURE INT NOT NULL,"""
                    f"""PRECIPITATION INT NOT NULL,"""
                    f"""CLIMATE CHAR(50),"""
                    f"""DESCRIPTION CHAR(50));"""
                )

                cls.table_created = True

    @classmethod
    def insert_data(cls, params):
        con = db_conn.get_connection()

        with con:
            with con.cursor() as cur:

                cur.execute(
                    f"""INSERT INTO weather"""
                    f""" VALUES ("""
                    f"""{params['date']}, """
                    f"""{params['temperature']},"""
                    f"""{params['precipitation']},"""
                    f"""'{params['climate']}',"""
                    f"""'{params['description']}');"""
                )

    @classmethod
    def get_count_by_date(cls, date: int):
        print(f"Getting count by date...", file=sys.stderr)

        con = db_conn.get_connection()

        with con:
            with con.cursor() as cur:
                cur.execute(f"SELECT count(*) FROM weather WHERE date={date};")

                fetch_one = cur.fetchone()
                count = fetch_one[0]
                print(f"The count of existing entries. {count}", file=sys.stderr)

    @classmethod
    def update_date(cls, params):
        print(f"Updating with params {params}...", file=sys.stderr)

        con = db_conn.get_connection()

        with con:
            with con.cursor() as cur:

                cur.execute(
                    f"""UPDATE weather """
                    f"""SET date={params['date']},"""
                    f"""temperature={params['temperature']},"""
                    f"""precipitation={params['precipitation']},"""
                    f"""climate='{params['climate']}',"""
                    f"""description='{params['description']}' """
                    f"""WHERE date='{params['date']}';"""
                )

    @classmethod
    def get_all_rows(cls):
        if not cls.table_created:
            print(f"The table does not exist!", file=sys.stderr)
            cls.create_table()
            return {}

        con = db_conn.get_connection()

        with con:
            with con.cursor() as cur:
                cur.execute("SELECT * FROM weather;")
                output = cur.fetchall()
                return output


@app.route("/api/insert", methods=["POST"])
@cross_origin(origin="*", headers=["Content-Type", "Authorization"])
def insert_data():

    data = json.loads(request.data)
    print(f"The request data to insert: {data}", file=sys.stderr)

    count = db_conn.get_count_by_date(data["date"])
    if count == 1:
        print(
            f"Updating only! Temperature key already exists!",
            file=sys.stderr,
        )
        db_conn.update_date(data)
    else:
        print(f"Inserting new entry!", file=sys.stderr)

        # Insert
        db_conn.insert_data(data)

    # print(, file=sys.stderr)
    return ""


@app.route("/api/getinfo", methods=["GET"])
@cross_origin(origin="*", headers=["Content-Type", "Authorization"])
def test_response():
    """Return a sample JSON response."""
    output = db_conn.get_all_rows()
    print(f"The output is {output}", file=sys.stderr)

    # output = make_response(jsonify(output))
    output = jsonify(output)
    return output


@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({"error": "Not found"}), 404)
