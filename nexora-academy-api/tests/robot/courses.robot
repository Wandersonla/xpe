*** Settings ***
Documentation     Testes E2E para API Nexora Academy - Cursos
Library           RequestsLibrary
Library           Collections
Resource          variables.robot
Resource          keywords.robot

*** Variables ***
${BASE_URL}       http://localhost:3000
${API_PREFIX}     /api/v1

*** Test Cases ***
Should List Courses Public
    [Tags]    courses    public
    Create Session    public    ${BASE_URL}
    ${response}=    GET On Session    public    ${API_PREFIX}/courses
    Status Should Be    200    ${response}

Admin Should Create Course
    [Tags]    courses    admin
    ${token}=    Get Token    ${ADMIN_USER}    ${ADMIN_PASS}
    ${headers}=    Create Dictionary    Authorization=Bearer ${token}
    ${timestamp}=    Get Time    epoch
    ${unique_title}=    Set Variable    Curso Teste ${timestamp}
    ${body}=    Create Dictionary    title=${unique_title}    description=Curso de Teste sobre APIs    category=tecnologia
    Create Session    admin    ${BASE_URL}
    ${response}=    POST On Session    admin    ${API_PREFIX}/courses    headers=${headers}    json=${body}
    Status Should Be    201    ${response}
    ${json}=    Set Variable    ${response.json()}
    Dictionary Should Contain Key    ${json['data']}    id
