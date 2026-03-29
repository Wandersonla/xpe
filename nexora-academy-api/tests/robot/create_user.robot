*** Settings ***
Documentation     Teste E2E para criação de usuário via API Nexora Academy
Library           RequestsLibrary
Library           Collections
Resource          variables.robot
Resource          keywords.robot

*** Test Cases ***
Admin Should Create User
    [Tags]    users    admin    create
    ${token}=    Get Token    ${ADMIN_USER}    ${ADMIN_PASS}
    ${headers}=    Create Dictionary    Authorization=Bearer ${token}
    ${timestamp}=    Get Time    epoch
    ${email}=    Set Variable    testuser${timestamp}@nexora.com
    ${identity_id}=    Set Variable    test-identity-${timestamp}
    ${body}=    Create Dictionary    identityId=${identity_id}    name=Usuário Teste ${timestamp}    email=${email}    role=student    status=active    description=Aluno de APIs    subject=Matemática
    Create Session    admin    ${BASE_URL}
    ${response}=    POST On Session    admin    ${API_PREFIX}/users    headers=${headers}    json=${body}
    Status Should Be    201    ${response}
    ${json}=    Set Variable    ${response.json()}
    Dictionary Should Contain Key    ${json['data']}    id

Admin Should Create Teacher
    [Tags]    users    admin    create    teacher
    ${token}=    Get Token    ${ADMIN_USER}    ${ADMIN_PASS}
    ${headers}=    Create Dictionary    Authorization=Bearer ${token}
    ${timestamp}=    Get Time    epoch
    ${email}=    Set Variable    testteacher${timestamp}@nexora.com
    ${identity_id}=    Set Variable    test-identity-teacher-${timestamp}
    ${body}=    Create Dictionary    identityId=${identity_id}    name=Professor Teste ${timestamp}    email=${email}    role=teacher    status=active    description=Professor de APIs    subject=Matemática
    Create Session    admin    ${BASE_URL}
    ${response}=    POST On Session    admin    ${API_PREFIX}/users    headers=${headers}    json=${body}
    Status Should Be    201    ${response}
    ${json}=    Set Variable    ${response.json()}
    Dictionary Should Contain Key    ${json['data']}    id
