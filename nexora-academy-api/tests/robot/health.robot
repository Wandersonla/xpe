*** Settings ***
Documentation     Smoke test da API Nexora Academy
Library           RequestsLibrary

*** Variables ***
${BASE_URL}       http://localhost:3000
${API_PREFIX}     /api/v1

*** Test Cases ***
Health Endpoint Should Return 200
    Create Session    nexora    ${BASE_URL}
    ${response}=      GET On Session    nexora    ${API_PREFIX}/health
    Status Should Be  200    ${response}
