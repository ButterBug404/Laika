$URL = "http://localhost:3001/api/register"
$PASSWORD = "SuperSecret123$"
$STATE = "Jalisco"
$MUNICIPALITY = "Guadalajara"

for ($i = 1; $i -le 10; $i++) {
    $USERNAME = "user_$i"
    $EMAIL = "user${i}@woofmail.com"
    
    Write-Host "🐶 Curling user $USERNAME..." -ForegroundColor Yellow
    
    $body = @{
        username = $USERNAME
        email = $EMAIL
        password = $PASSWORD
        state = $STATE
        municipality = $MUNICIPALITY
    } | ConvertTo-Json
    
    try {
        Invoke-RestMethod -Uri $URL -Method POST -ContentType "application/json" -Body $body
        Write-Host "✅ Done with $USERNAME" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Error with $USERNAME`: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}
