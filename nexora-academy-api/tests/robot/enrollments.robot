

*** Settings ***
Documentation     Testes E2E para API Nexora Academy - Inscrições
Library           RequestsLibrary
Resource          variables.robot
Resource          keywords.robot

*** Variables ***
${BASE_URL}       http://localhost:3000
${API_PREFIX}     /api/v1

*** Test Cases ***
# Listar Inscrições (admin)
Admin Should List Enrollments
    [Tags]    enrollments    admin
    ${token}=    Get Token    ${ADMIN_USER}    ${ADMIN_PASS}
    ${headers}=    Create Dictionary    Authorization=Bearer ${token}
    Create Session    admin    ${BASE_URL}
    ${response}=    GET On Session    admin    ${API_PREFIX}/enrollments    headers=${headers}
    Status Should Be    200    ${response}

# Listar Inscrições (support)
Support Should List Enrollments
    [Tags]    enrollments    support
    ${token}=    Get Token    ${SUPPORT_USER}    ${SUPPORT_PASS}
    ${headers}=    Create Dictionary    Authorization=Bearer ${token}
    Create Session    support    ${BASE_URL}
    ${response}=    GET On Session    support    ${API_PREFIX}/enrollments    headers=${headers}
    Status Should Be    200    ${response}
