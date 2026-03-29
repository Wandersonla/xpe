
*** Settings ***
Documentation     Testes E2E para API Nexora Academy - Usuários
Library           RequestsLibrary
Resource          variables.robot
Resource          keywords.robot

*** Variables ***
${BASE_URL}       http://localhost:3000
${API_PREFIX}     /api/v1
${ADMIN_USER}     admin@nexora.com
${ADMIN_PASS}     admin123
${SUPPORT_USER}   support@nexora.com
${SUPPORT_PASS}   support123
${TEACHER_USER}   teacher@nexora.com
${TEACHER_PASS}   teacher123
${STUDENT_USER}   student@nexora.com
${STUDENT_PASS}   student123

*** Test Cases ***
# Login Admin
Admin Login Should Return Token
    [Tags]    login    admin
    ${token}=    Get Token    ${ADMIN_USER}    ${ADMIN_PASS}
    Should Not Be Empty    ${token}

# Listar Usuários (admin)
Admin Should List Users
    [Tags]    users    admin
    ${token}=    Get Token    ${ADMIN_USER}    ${ADMIN_PASS}
    ${headers}=    Create Dictionary    Authorization=Bearer ${token}
    Create Session    admin    ${BASE_URL}
    ${response}=    GET On Session    admin    ${API_PREFIX}/users    headers=${headers}
    Status Should Be    200    ${response}

# Listar Usuários (support)
Support Should List Users
    [Tags]    users    support
    ${token}=    Get Token    ${SUPPORT_USER}    ${SUPPORT_PASS}
    ${headers}=    Create Dictionary    Authorization=Bearer ${token}
    Create Session    support    ${BASE_URL}
    ${response}=    GET On Session    support    ${API_PREFIX}/users    headers=${headers}
    Status Should Be    200    ${response}
