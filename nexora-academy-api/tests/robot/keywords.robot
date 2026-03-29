*** Settings ***
Resource          variables.robot

*** Keywords ***
Get Token
    [Arguments]    ${username}    ${password}
    ${keycloak_url}=    Set Variable    http://localhost:8080/realms/nexora/protocol/openid-connect/token
    ${client_id}=    Set Variable    nexora-api
    ${client_secret}=    Set Variable
    Create Session    keycloak    http://localhost:8080
    ${data}=    Set Variable    grant_type=password&client_id=${client_id}&username=${username}&password=${password}
    ${headers}=    Create Dictionary    Content-Type=application/x-www-form-urlencoded
    ${response}=    POST On Session    keycloak    /realms/nexora/protocol/openid-connect/token    data=${data}    headers=${headers}
    ${json}=    Set Variable    ${response.json()}
    Should Contain    ${json}    access_token
    [Return]    ${json}[access_token]
