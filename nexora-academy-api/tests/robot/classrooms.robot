*** Settings ***
Documentation     Testes E2E para API Nexora Academy - Turmas
Library           RequestsLibrary
Library           Collections
Resource          variables.robot
Resource          keywords.robot

*** Variables ***
${BASE_URL}       http://localhost:3000
${API_PREFIX}     /api/v1

*** Test Cases ***
Should List Classrooms Public
    [Tags]    classrooms    public
    Create Session    public    ${BASE_URL}
    ${response}=    GET On Session    public    ${API_PREFIX}/classrooms
    Status Should Be    200    ${response}

Admin Should Create Classroom
    [Tags]    classrooms    admin
    ${token}=    Get Token    ${ADMIN_USER}    ${ADMIN_PASS}
    ${headers}=    Create Dictionary    Authorization=Bearer ${token}
    ${timestamp}=    Get Time    epoch
    ${unique_title}=    Set Variable    Curso para Turma ${timestamp}
    ${course_body}=    Create Dictionary    title=${unique_title}    description=Curso auxiliar para turma    category=auxiliar
    Create Session    admin    ${BASE_URL}
    ${course_response}=    POST On Session    admin    ${API_PREFIX}/courses    headers=${headers}    json=${course_body}
    Status Should Be    201    ${course_response}
    ${course_id}=    Set Variable    ${course_response.json()['data']['id']}
    ${classroom_body}=    Create Dictionary    courseId=${course_id}    name=Turma Teste ${timestamp}    capacity=${30}    enrollmentStart=2026-04-01T00:00:00Z    enrollmentEnd=2026-04-20T23:59:59Z    startAt=2026-05-01T19:00:00Z    endAt=2026-06-30T22:00:00Z
    ${classroom_response}=    POST On Session    admin    ${API_PREFIX}/classrooms    headers=${headers}    json=${classroom_body}
    Status Should Be    201    ${classroom_response}
    ${json}=    Set Variable    ${classroom_response.json()}
    Dictionary Should Contain Key    ${json['data']}    id
