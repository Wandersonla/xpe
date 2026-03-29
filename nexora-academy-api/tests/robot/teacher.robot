*** Settings ***
Documentation     Teste E2E para criação de professor via API Nexora Academy
Library           RequestsLibrary
Resource          variables.robot
Resource          keywords.robot

*** Test Cases ***
Admin Should Create Teacher
    [Tags]    users    admin    create    teacher
    ${token}=    Get Token    ${ADMIN_USER}    ${ADMIN_PASS}
    ${headers}=    Create Dictionary    Authorization=Bearer ${token}
    ${timestamp}=    Get Time    epoch
    ${email}=    Set Variable    professor${timestamp}@nexora.com
    ${identity_id}=    Set Variable    prof-identity-${timestamp}
    ${body}=    Create Dictionary    identityId=${identity_id}    name=Professor Teste ${timestamp}    email=${email}    role=teacher    status=active    description=Professor de APIs    subject=Matemática
    Create Session    admin    ${BASE_URL}
    ${response}=    POST On Session    admin    ${API_PREFIX}/users    headers=${headers}    json=${body}
    Status Should Be    201    ${response}
    ${json}=    Set Variable    ${response.json()}
    ${has_data}=    Run Keyword And Return Status    Dictionary Should Contain Key    ${json}    data
    IF    ${has_data}
        ${user}=    Set Variable    ${json['data']}
    ELSE
        ${user}=    Set Variable    ${json}
    END
    Run Keyword And Return Status    Dictionary Should Contain Key    ${user}    id
    Run Keyword And Return Status    Dictionary Should Contain Key    ${user}    _id
