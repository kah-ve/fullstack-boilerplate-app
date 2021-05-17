import psycopg2
from mylogger import get_logger

logger = get_logger()


class Database:
    table_created = False
    table_name = "weather"

    @classmethod
    def get_connection(cls):
        logger.info(f"Opening connection...")

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
        logger.info(f"Creating the table...")

        con = Database.get_connection()

        with con:
            with con.cursor() as cur:
                cur.execute(
                    f"""CREATE TABLE IF NOT EXISTS {cls.table_name}"""
                    f"""(DATE TEXT PRIMARY KEY NOT NULL,"""
                    f"""TEMPERATURE INT NOT NULL,"""
                    f"""PRECIPITATION INT NOT NULL,"""
                    f"""CLIMATE CHAR(50),"""
                    f"""DESCRIPTION CHAR(50));"""
                )

                cls.table_created = True

    @classmethod
    def insert_data(cls, params):
        con = Database.get_connection()

        with con:
            with con.cursor() as cur:

                cur.execute(
                    f"""INSERT INTO weather"""
                    f""" VALUES ("""
                    f"""'{params['date']}', """
                    f"""{params['temperature']},"""
                    f"""{params['precipitation']},"""
                    f"""'{params['climate']}',"""
                    f"""'{params['description']}');"""
                )

    @classmethod
    def get_count_by_date(cls, date: str) -> int:
        logger.info(f"Getting count by date...")

        con = Database.get_connection()

        with con:
            with con.cursor() as cur:
                cur.execute(f"SELECT count(*) FROM weather WHERE date='{date}';")

                fetch_one = cur.fetchone()
                count = fetch_one[0]
                logger.info(f"The count of existing entries. {count}")

                return count

    @classmethod
    def update_date(cls, params):
        logger.info(f"Updating with params {params}...")

        con = Database.get_connection()

        with con:
            with con.cursor() as cur:

                cur.execute(
                    f"""UPDATE weather """
                    f"""SET date='{params['date']}',"""
                    f"""temperature={params['temperature']},"""
                    f"""precipitation={params['precipitation']},"""
                    f"""climate='{params['climate']}',"""
                    f"""description='{params['description']}' """
                    f"""WHERE date='{params['date']}';"""
                )

    @classmethod
    def get_all_rows(cls):
        if not cls.table_created:
            logger.info(f"The table does not exist!")
            cls.create_table()
            return {}

        con = Database.get_connection()

        with con:
            with con.cursor() as cur:
                cur.execute("SELECT * FROM weather;")
                output = cur.fetchall()
                return output
