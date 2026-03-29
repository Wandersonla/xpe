import os
import subprocess
from datetime import datetime

ROBOT_TESTS_PATH = "nexora-academy-api/tests/robot/"
OUTPUT_HTML = "nexora-academy-api/tests/robot/robot_test_report.html"
DB_NAME = "nexora"


def run_robot_tests():
    # Executa os testes Robot Framework e gera output.xml, log.html, report.html
    result = subprocess.run([
        "robot",
        "--outputdir",
        ROBOT_TESTS_PATH,
        ROBOT_TESTS_PATH
    ], capture_output=True, text=True)
    return result


def parse_robot_output():
    # Lê o arquivo output.xml para extrair nomes dos testes e status
    import xml.etree.ElementTree as ET
    output_xml = os.path.join(ROBOT_TESTS_PATH, "output.xml")
    tree = ET.parse(output_xml)
    root = tree.getroot()
    tests = []
    for suite in root.iter("suite"):
        for test in suite.iter("test"):
            name = test.attrib["name"]
            status = test.find("status").attrib["status"]
            tests.append({"name": name, "status": status})
    return tests


def generate_html_report(tests, db_name):
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    html = f"""
    <html>
    <head><title>Robot Test Report</title></head>
    <body>
        <h1>Robot Framework Test Report</h1>
        <p><b>Data de execução:</b> {now}</p>
        <p><b>Banco de dados utilizado:</b> {db_name}</p>
        <h2>Testes Realizados</h2>
        <table border='1'>
            <tr><th>Nome do Teste</th><th>Status</th></tr>
            {''.join([f'<tr><td>{t['name']}</td><td>{t['status']}</td></tr>' for t in tests])}
        </table>
    </body>
    </html>
    """
    with open(OUTPUT_HTML, "w") as f:
        f.write(html)


def main():
    result = run_robot_tests()
    tests = parse_robot_output()
    generate_html_report(tests, DB_NAME)
    print(f"Relatório HTML gerado em: {OUTPUT_HTML}")
    print(f"Saída dos testes:\n{result.stdout}")

if __name__ == "__main__":
    main()
